import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { InputType, IPortInput } from '@models/port';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { promise } from 'protractor';
import { IEdge } from '@models/edge';
import * as gs from 'gs-json';

import { gsConstructor } from '@modules';


export class CodeUtils {

    static getProcedureCode(prod: IProcedure, existingVars: string[], addProdArr: Boolean): string {
        prod.hasError = false;

        const codeStr: string[] = [];
        const args = prod.args;
        const prefix = args.hasOwnProperty('0') && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';

        if (addProdArr && prod.type != ProcedureTypes.ELSE && prod.type != ProcedureTypes.ELSEIF){
            codeStr.push(`__PRODARR__[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.VARIABLE:
                codeStr.push(`${prefix}${args[0].value} = ${args[1].value};`);
                if (prefix === 'let '){
                    existingVars.push(args[0].value)
                }
                break;

            case ProcedureTypes.IF:
                codeStr.push(`if (${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.ELSE:
                codeStr.push(`else {`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.ELSEIF:
                codeStr.push(`else if(${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.FOREACH:
                //codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                codeStr.push(`for (${prefix} ${args[0].value} of ${args[1].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.WHILE:
                codeStr.push(`while (${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.BREAK:
                codeStr.push(`break;`);
                break;
                
            case ProcedureTypes.CONTINUE:
                codeStr.push(`continue;`);
                break;

            case ProcedureTypes.FUNCTION:
                const argValues = args.slice(1).map((arg)=>arg.value).join(',');
                const fnCall: string = `__MODULES__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`
                codeStr.push(`${prefix}${args[0].value} = ${fnCall};`);
                if (prefix === 'let '){
                    existingVars.push(args[0].value)
                }
                break;

            case ProcedureTypes.IMPORTED:
                console.log('args: ',args)
                const argsVals = args.slice(1).map((arg)=>arg.value).join(',');
                const fn: string = `${prod.meta.name}( ${argsVals} )`
                codeStr.push(`${prefix}${args[0].value} = ${fn};`);
                if (prefix === 'let '){
                    existingVars.push(args[0].value)
                }
                break;


        }

        return codeStr.join('\n');
    }


    static loadFile(f){
        let stream = Observable.create(observer => {
          let request = new XMLHttpRequest();
          
          request.open('GET', f.download_url);
          request.onload = () => {
              if (request.status === 200) {
                  const f = circularJSON.parse(request.responseText);
                  observer.next(f);
                  observer.complete();
              } else {
                  observer.error('error happened');
              }
          };
      
          request.onerror = () => {
          observer.error('error happened');
          };
          request.send();
        });
        
        stream.subscribe(loadeddata => {
          return loadeddata
        });
    }

    static mergeInputs(edges: IEdge[]): any{
        var result = new gs.Model();
        for (let i = 0; i<edges.length; i++){
            console.log(edges[i].source)
            if (!edges[i].source.value || edges[i].source.value.constructor != gsConstructor) continue;
            result.merge(edges[i].source.value);
        }
        return result;
        //return edges[0].source.value;
    }

    static async getInputValue(inp: IPortInput, node: INode): Promise<string>{
        var input: any;
        if (node.type == 'start' || inp.edges.length == 0){
            if (inp.meta.mode == InputType.URL){
                const p = new Promise((resolve) => {
                    let request = new XMLHttpRequest();
                    request.open('GET', inp.value || inp.default);
                    request.onload = () => {
                        resolve(request.responseText);
                    }
                    request.send();
                });
                input = await p;
            } else if (inp.meta.mode == InputType.File) {
                const p = new Promise((resolve) => {
                    let reader = new FileReader();
                    reader.onload = function(){
                        resolve(reader.result)
                    }
                    reader.readAsText(inp.value || inp.default)
                });
                input = await p;
            } else {
                input = inp.value || inp.default;
            }
        } else {
            input = CodeUtils.mergeInputs(inp.edges);
            if (input.constructor === gsConstructor) {
                input = `new __MODULES__.gs.Model(${input.toJSON()})`
            } else {
                // do nothing
            }
        }
        return input;
    }

    public static async getNodeCode(node: INode, addProdArr = false): Promise<string> {
        node.hasError = false;
        const codeStr = [];
        const varsDefined: string[] = [];

        // TODO [think later]: How to handle defaults / values for FileInputs and WebURLs?
        // IDEA-1: Load and add as parameter; Will need to the synchronous

        // input initializations
        if (addProdArr){
            var input = await CodeUtils.getInputValue(node.input, node);
            codeStr.push('let ' + node.input.name + ' = ' + input + ';');
            varsDefined.push(node.input.name);
        }

        const line = `let ${node.output.name} = undefined;`;
        codeStr.push(line);
        varsDefined.push(node.output.name);

        // procedure
        for (let prod of node.procedure){
            codeStr.push(CodeUtils.getProcedureCode(prod, varsDefined, addProdArr) );
        };

        //console.log( `{\n${codeStr.join('\n')}\nreturn { ${outStatements.join(',') } };\n}`);
        return `{\n${codeStr.join('\n')}\nreturn ${node.output.name};\n}`;


    }
    
    static async getFunctionString(func: IFunction): Promise<string>{
        let fullCode = '';
        let fnCode = `function ${func.name}(${func.args[0].name}){\nvar merged;\n`;
        for (let node of func.module.nodes){
            let code =  await CodeUtils.getNodeCode(node, false)
            fullCode += `function ${node.id}(${node.input.name})` + code + `\n\n`;
            if (node.type ==='start'){
                fnCode += `let result_${node.id} = ${node.id}(${func.args[0].name});\n`
            } else if (node.input.edges.length == 1) {
                fnCode += `let result_${node.id} = ${node.id}(result_${node.input.edges[0].source.parentNode.id});\n`
            } else {
                fnCode += `merged = mergeResults([${node.input.edges.map((edge)=>'result_'+edge.source.parentNode.id).join(',')}]);\n`;
                fnCode += `let result_${node.id} = ${node.id}(merged);\n`
            }
            if (node.type === 'end'){
                fnCode += `return result_${node.id};\n`;
            }
        }
        fnCode += '}\n\n'
        fullCode += fnCode
        //console.log(fullCode)
        return fullCode
    }

}