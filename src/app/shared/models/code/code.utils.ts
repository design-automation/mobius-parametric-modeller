import { INode } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';
import { InputType } from '@models/port';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { promise } from 'protractor';

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

            case ProcedureTypes.FUNCTION:
                const argValues = args.slice(1).map((arg)=>arg.value).join(',');
                const fnCall: string = `__MODULES__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`
                codeStr.push(`${prefix}${args[0].value} = ${fnCall};`);
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

    public static async getNodeCode(node: INode, addProdArr = false): Promise<string> {
        node.hasError = false;
        const codeStr = [];
        const varsDefined: string[] = [];

        // TODO [think later]: How to handle defaults / values for FileInputs and WebURLs?
        // IDEA-1: Load and add as parameter; Will need to the synchronous

        // input initializations
        for (let inp of node.inputs){
            var input: any;
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
                if (typeof input === 'number' || input === undefined){
                    // do nothing
                } else if (typeof input === 'string'){
                    if(node.type != 'start' && inp.edge){
                        input = '"' + input + '"';
                    }
                } else if (input.constructor === [].constructor){
                    input = '[' + input + ']';
                } else if (input.constructor === {}.constructor) {
                    input = JSON.stringify(input);
                } else {
                    // do nothing
                }
            }
            codeStr.push('let ' + inp.name + ' = ' + input + ';');
            varsDefined.push(inp.name);
        };

        for (let oup of node.outputs){
            const line = `let ${oup.name} = ${oup.value || oup.default};`;
            codeStr.push(line);
            varsDefined.push(oup.name);
        };

        // procedure
        for (let prod of node.procedure){
            codeStr.push(CodeUtils.getProcedureCode(prod, varsDefined, addProdArr) );
        };


        // output intializations
        const outStatements = [];
        for (let oup of node.outputs){
            outStatements.push( `${oup.name} : ${oup.name}` );
        };

        console.log( `{\n${codeStr.join('\n')}\nreturn { ${outStatements.join(',') } };\n}`);

        return `{
            ${codeStr.join('\n')}
            return { ${outStatements.join(',') } };
        }`;

    }

}