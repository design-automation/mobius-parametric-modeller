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
import { _parameterTypes } from '@modules';


export class CodeUtils {

    static getProcedureCode(prod: IProcedure, existingVars: string[], addProdArr: Boolean): string {
        prod.hasError = false;

        const codeStr: string[] = [];
        const args = prod.args;
        const prefix = args.hasOwnProperty('0') && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';
        if (addProdArr && prod.type != ProcedureTypes.Else && prod.type != ProcedureTypes.Elseif){
            codeStr.push(`__params__.currentProcedure[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.Variable:
                if (args[0].value.indexOf('__params__') != -1 || args[1].value.indexOf('__params__') != -1) throw new Error("Unexpected Identifier");
                codeStr.push(`${prefix}${args[0].value} = ${args[1].value};`);
                if (prefix === 'let '){
                    existingVars.push(args[0].value)
                }
                break;

            case ProcedureTypes.If:
                if (args[0].value.indexOf('__params__') != -1) throw new Error("Unexpected Identifier");
                codeStr.push(`if (${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.Else:
                codeStr.push(`else {`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.Elseif:
                if (args[0].value.indexOf('__params__') != -1) throw new Error("Unexpected Identifier");
                codeStr.push(`else if(${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.Foreach:
                //codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                if (args[0].value.indexOf('__params__') != -1) throw new Error("Unexpected Identifier");
                codeStr.push(`for (${prefix} ${args[0].value} of ${args[1].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.While:
                if (args[0].value.indexOf('__params__') != -1) throw new Error("Unexpected Identifier");
                codeStr.push(`while (${args[0].value}){`);
                for (let p of prod.children){
                    codeStr.push(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
                }
                codeStr.push(`}`)
                break;

            case ProcedureTypes.Break:
                codeStr.push(`break;`);
                break;
                
            case ProcedureTypes.Continue:
                codeStr.push(`continue;`);
                break;

            case ProcedureTypes.Function:
                const argValues = args.slice(1).map((arg)=>{
                    // if __params__ is present in the value of the argument, throw unexpected identifier
                    if (arg.name == _parameterTypes.input) { 
                        console.log(arg.value, arg.default);
                        let val = arg.value || arg.default; return val; };
                    if (arg.value.indexOf('__params__') != -1) throw new Error("Unexpected Identifier");
                    if (arg.name == _parameterTypes.constList) return "__params__.constants";
                    if (arg.name == _parameterTypes.model) return "__params__.model";
                    if (arg.value.substring(0,1) == '@') {
                        if (prod.meta.module.toUpperCase() == 'QUERY') return '"'+arg.value.replace('"',"'")+'"';
                        return '__modules__.Query.get( __params__.model,"'+arg.value.replace('"',"'")+'" )';
                    }
                    //else if (arg.name.indexOf('__') != -1) return '"'+args[args.indexOf(arg)+1].value+'"';
                    return arg.value;
                }).join(',');
                const fnCall: string = `__modules__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`;
                if ( prod.meta.module.toUpperCase() == 'OUTPUT'){
                    codeStr.push(`return ${fnCall};`);
                } else if (args[0].name == '__none__'){
                    codeStr.push(`${fnCall};`);
                } else {
                    codeStr.push(`${prefix}${args[0].value} = ${fnCall};`);
                    if (prefix === 'let '){
                        existingVars.push(args[0].value)
                    }
                }
                break;
            case ProcedureTypes.Imported:
                //('args: ',args)
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

    static mergeInputs(models): any{
        var result = new gs.Model();
        for (let model of models){
            if (!model || model.constructor != gsConstructor) continue;
            result.merge(model);
        }
        return result;
    }

    static async getInputValue(inp: IPortInput, node: INode): Promise<string>{
        var input: any;
        if (node.type == 'start' || inp.edges.length == 0){
            input = new gs.Model();
        } else {
            input = CodeUtils.mergeInputs(inp.edges.map(edge=>{ return edge.source.value}));
            /*
            if (input.constructor === gsConstructor) {
                input = `new __MODULES__.gs.Model(${input.toJSON()})`
            } else {
                // do nothing
            }
            */
        }
        return input;
    }

    public static async getNodeCode(node: INode, addProdArr = false): Promise<string> {
        node.hasError = false;
        const codeStr = [];
        const varsDefined: string[] = [];
        // input initializations
        if (addProdArr){
            var input = await CodeUtils.getInputValue(node.input, node);
            node.input.value = input;
        }

        if (node.type =='start'){
            codeStr.push('__params__.constants = {};\n')
        }
        // procedure
        for (let prod of node.procedure){
            codeStr.push(CodeUtils.getProcedureCode(prod, varsDefined, addProdArr) );
        };
        if (node.type == 'end' && node.procedure.length > 0){
            return `{\n${codeStr.join('\n')}\n}`;
        } 
        return `{\n${codeStr.join('\n')}\nreturn __params__.model;\n}`;
        

        //return `{\n${codeStr.join('\n')}\nreturn result;\n}`;
        //return `/*    ${node.name.toUpperCase()}    */\n\n{\n${codeStr.join('\n')}\nreturn ${node.output.name};\n}`;


    }
    
    static async getFunctionString(func: IFunction): Promise<string>{
        let fullCode = '';
        let fnCode = `function ${func.name}(${func.args.map(arg=>{return arg.name}).join(',')}){\nvar merged;\nlet __params__={"currentProcedure": [''],"model":{}};\n`;
        for (let node of func.module.nodes){
            let code =  await CodeUtils.getNodeCode(node, false)
            fullCode += `function ${node.id}(__params__, ${func.args.map(arg=>{return arg.name}).join(',')})` + code + `\n\n`;
            if (node.type ==='start'){
                //fnCode += `let result_${node.id} = ${node.id}(__params__);\n`
                fnCode += `let result_${node.id} = __params__.model;\n`
            } else if (node.input.edges.length == 1) {
                fnCode += `__params__.model = JSON.parse(JSON.stringify(result_${node.input.edges[0].source.parentNode.id}));\n`
                fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg=>{return arg.name}).join(',')});\n`
            } else {
                fnCode += `merged = mergeInputs([${node.input.edges.map((edge)=>'result_'+edge.source.parentNode.id).join(',')}]);\n`;
                fnCode += `__params__.model = merged;\n`
                fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg=>{return arg.name}).join(',')});\n`
            }
            /*
            } else if (node.input.edges.length == 1) {
                fnCode += `let result_${node.id} = ${node.id}(result_${node.input.edges[0].source.parentNode.id});\n`
            } else {
                fnCode += `merged = mergeResults([${node.input.edges.map((edge)=>'result_'+edge.source.parentNode.id).join(',')}]);\n`;
                fnCode += `let result_${node.id} = ${node.id}(merged);\n`


            */
            if (node.type === 'end'){
                fnCode += `return result_${node.id};\n`;
            }
            //fnCode += `console.log(result_${node.id});\n`;
        }
        fnCode += '}\n\n'
        fullCode += fnCode
        //console.log(fullCode)
        return fullCode
    }

}