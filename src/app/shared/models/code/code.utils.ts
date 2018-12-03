import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { IPortInput, InputType } from '@models/port';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { promise } from 'protractor';
import { IEdge } from '@models/edge';
import { _parameterTypes, Model } from '@modules';


export class CodeUtils {

    static async getProcedureCode(prod: IProcedure, existingVars: string[], addProdArr: Boolean): Promise<string> {
        if (prod.enabled === false) { return ''; }

        prod.hasError = false;

        const codeStr: string[] = [];
        const args = prod.args;
        const prefix = args.hasOwnProperty('0') && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';
        codeStr.push('');
        if (addProdArr && prod.type !== ProcedureTypes.Else && prod.type !== ProcedureTypes.Elseif) {
            codeStr.push(`__params__.currentProcedure[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.Variable:
                if (args[0].value.indexOf('__params__') !== -1 || args[1].value.indexOf('__params__') !== -1) {
                    throw new Error('Unexpected Identifier');
                }
                codeStr.push(`${prefix}${args[0].value} = ${args[1].value};`);
                if (prefix === 'let ') {
                    existingVars.push(args[0].value);
                }
                break;

            case ProcedureTypes.If:
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`if (${args[0].value}){`);
                break;

            case ProcedureTypes.Else:
                codeStr.push(`else {`);
                break;

            case ProcedureTypes.Elseif:
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`else if(${args[0].value}){`);
                break;

            case ProcedureTypes.Foreach:
                // codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`for (${prefix} ${args[0].value} of ${args[1].value}){`);
                break;

            case ProcedureTypes.While:
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`while (${args[0].value}){`);
                break;

            case ProcedureTypes.Break:
                codeStr.push(`break;`);
                break;

            case ProcedureTypes.Continue:
                codeStr.push(`continue;`);
                break;

            case ProcedureTypes.Function:
                const argVals = [];
                for (const arg of args.slice(1)) {
                    if (arg.name === _parameterTypes.input) {
                        let val = arg.value || arg.default;
                        if (prod.meta.inputMode.toString() === InputType.URL.toString() ) {
                            const p = new Promise((resolve) => {
                                const request = new XMLHttpRequest();
                                request.open('GET', arg.value || arg.default);
                                request.onload = () => {
                                    resolve(request.responseText);
                                };
                                request.send();
                            });
                            val = await p;
                        } else if (prod.meta.inputMode.toString() === InputType.File.toString()) {
                            const p = new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onload = function() {
                                    resolve(reader.result);
                                };
                                reader.readAsText(arg.value || arg.default);
                            });
                            val = await p;
                        } else {}
                        argVals.push(val);
                        continue;
                    }
                    if (arg.value && arg.value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                    if (arg.name === _parameterTypes.constList) {
                        argVals.push('__params__.constants');
                        continue;
                    }
                    if (arg.name === _parameterTypes.model) {
                        argVals.push('__params__.model');
                        continue;
                    }
                    if (arg.value && arg.value.substring(0, 1) === '@') {
                        if (prod.meta.module.toUpperCase() === 'QUERY'
                            && prod.meta.name.toUpperCase() === 'SET'
                            && arg.name.toUpperCase() === 'STATEMENT') {
                            argVals.push('"' + arg.value.replace(/"/g, '\'') + '"');
                            continue;
                        }
                        argVals.push('__modules__.Query.get( __params__.model,"' + arg.value.replace(/"/g, '\'') + '" )');
                        continue;
                    }
                    // else if (arg.name.indexOf('__') != -1) return '"'+args[args.indexOf(arg)+1].value+'"';
                    argVals.push(arg.value);

                }
                const argValues = argVals.join(',');
                await argValues;
                const fnCall = `__modules__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`;
                if ( prod.meta.module.toUpperCase() === 'OUTPUT') {
                    codeStr.push(`return ${fnCall};`);
                } else if (args[0].name === '__none__') {
                    codeStr.push(`${fnCall};`);
                } else {
                    codeStr.push(`${prefix}${args[0].value} = ${fnCall};`);
                    if (prefix === 'let ') {
                        existingVars.push(args[0].value);
                    }
                }
                break;
            case ProcedureTypes.Imported:
                // ('args: ',args)
                const argsVals = args.slice(1).map((arg) => arg.value).join(',');
                const fn = `${prod.meta.name}(__params__, ${argsVals} )`;
                codeStr.push(`${prefix}${args[0].value} = ${fn};`);
                if (prefix === 'let ') {
                    existingVars.push(args[0].value);
                }
                break;

        }
        if (prod.children) {
            for (const p of prod.children) {
                codeStr.push(await CodeUtils.getProcedureCode(p, existingVars, addProdArr));
            }
            codeStr.push(`}`);
        }

        if (prod.print) {
            codeStr.push(`console.log('${prod.args[0].value}: '+ ${prod.args[0].value});`);
            // codeStr.push(`wait(5000);`);
        }
        return codeStr.join('\n');
    }


    static loadFile(f) {
        const stream = Observable.create(observer => {
          const request = new XMLHttpRequest();

          request.open('GET', f.download_url);
          request.onload = () => {
              if (request.status === 200) {
                  const fl = circularJSON.parse(request.responseText);
                  observer.next(fl);
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
          return loadeddata;
        });
    }

    static mergeInputs(models): any {
        const result = _parameterTypes['newFn']();
        for (const model of models) {
            _parameterTypes['mergeFn'](result, model);
        }
        return result;
    }



    static getInputValue(inp: IPortInput, node: INode): Promise<string> {
        let input: any;
        if (node.type === 'start' || inp.edges.length === 0) {
            input = _parameterTypes['newFn']();
        } else {
            input = CodeUtils.mergeInputs(inp.edges.map(edge => edge.source.value));
            /*
            if (typeof input === 'number' || input === undefined){
                // do nothing
            } else if (typeof input === 'string'){
                input = '"' + input + '"';
            } else if (input.constructor === [].constructor){
                input = '[' + input + ']';
            } else if (input.constructor === {}.constructor) {
                input = JSON.stringify(input);
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
        if (addProdArr) {
            const input = await CodeUtils.getInputValue(node.input, node);
            node.input.value = input;
        }

        if (node.type === 'start') {
            codeStr.push('__params__.constants = {};\n');
        }

        /*
        codeStr.push(`
function wait(ms){
     start = new Date().getTime();
     end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}
        `)
        */

        codeStr.push(`__modules__.${_parameterTypes.preprocess}( __params__.model);`);
        // procedure
        for (const prod of node.procedure) {
            codeStr.push(await CodeUtils.getProcedureCode(prod, varsDefined, addProdArr) );
        }
        if (node.type === 'end' && node.procedure.length > 0) {
            return `{\n${codeStr.join('\n')}\n}`;
        } else {
            codeStr.push(`__modules__.${_parameterTypes.postprocess}( __params__.model);`);
        }


        return `\n${codeStr.join('\n')}\n\nreturn __params__.model;\n`;


        // return `{\n${codeStr.join('\n')}\nreturn result;\n}`;
        // return `/*    ${node.name.toUpperCase()}    */\n\n{\n${codeStr.join('\n')}\nreturn ${node.output.name};\n}`;


    }

    static async getFunctionString(func: IFunction): Promise<string> {
        let fullCode = '';
        /*
        let fnCode = `function ${func.name}(${func.args.map(arg=>{return arg.name}).join(',')})` +
        `{\nvar merged;\nlet __params__={"currentProcedure": [''],"model":{}};\n`;
        */
        let fnCode = `function ${func.name}(__mainParams__,${func.args.map(arg => arg.name).join(',')})` +
        `{\nvar merged;\nlet __params__={"currentProcedure": [''],"model":__modules__.${_parameterTypes['new']}()};\n`;

        for (const node of func.flowchart.nodes) {
            const code = '{' + await CodeUtils.getNodeCode(node, false) + '}';
            fullCode += `function ${node.id}(__params__, ${func.args.map(arg => arg.name).join(',')})` + code + `\n\n`;
            if (node.type === 'start') {
                // fnCode += `let result_${node.id} = ${node.id}(__params__);\n`
                fnCode += `let result_${node.id} = __params__.model;\n`;
            } else if (node.input.edges.length === 1) {
                fnCode += `__params__.model = JSON.parse(JSON.stringify(result_${node.input.edges[0].source.parentNode.id}));\n`;
                fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg => arg.name).join(',')});\n`;
            } else {
                fnCode += `merged = mergeInputs([${node.input.edges.map((edge) => 'result_' + edge.source.parentNode.id).join(',')}]);\n`;
                fnCode += `__params__.model = merged;\n`;
                fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg => arg.name).join(',')});\n`;
            }
            /*
            } else if (node.input.edges.length == 1) {
                fnCode += `let result_${node.id} = ${node.id}(result_${node.input.edges[0].source.parentNode.id});\n`
            } else {
                fnCode += `merged = mergeResults([${node.input.edges.map((edge)=>'result_'+edge.source.parentNode.id).join(',')}]);\n`;
                fnCode += `let result_${node.id} = ${node.id}(merged);\n`


            */
            if (node.type === 'end') {
                fnCode += `\n__mainParams__.model = mergeInputs([__mainParams__.model,__params__.model]);\n`;
                fnCode += `return result_${node.id};\n`;
            }
            // fnCode += `console.log(result_${node.id});\n`;
        }
        fnCode += '}\n\n';
        fullCode += fnCode;
        // console.log(fullCode)
        return fullCode;
    }

}
