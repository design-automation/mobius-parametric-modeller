import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { IPortInput, InputType } from '@models/port';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { _parameterTypes } from '@modules';


export class CodeUtils {

    static async getProcedureCode(prod: IProcedure, existingVars: string[], addProdArr: Boolean): Promise<string[]> {
        if (prod.enabled === false || prod.type === ProcedureTypes.Blank) { return ['']; }

        prod.hasError = false;

        let codeStr: string[] = [];
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

            case ProcedureTypes.Constant:
                let constName = args[0].value;
                if (constName.substring(0, 1) === '"' || constName.substring(0, 1) === '\'') {
                    constName = args[0].value.substring(1, args[0].value.length - 1);
                }

                const val = await CodeUtils.getStartInput(args[1].value || args[1].default, prod.meta.inputMode);
                codeStr.push(`__params__['constants']['${constName}'] = ${val};`);

                break;

            case ProcedureTypes.AddData:
                let cst = args[0].value;
                if (cst.substring(0, 1) === '"' || cst.substring(0, 1) === '\'') {
                    cst = args[0].value.substring(1, args[0].value.length - 1);
                }

                const value = await CodeUtils.getStartInput(args[1].value || args[1].default, prod.meta.inputMode);
                codeStr.push(`__params__['constants']['${cst}'] = ${value};`);
                if (_parameterTypes.addData) {
                    codeStr.push(`__modules__.${_parameterTypes.addData}( __params__.model, __params__.constants['${cst}']);`);
                } else {
                    codeStr.push(`__params__.model = mergeInputs( [__params__.model, __params__.constants['${cst}']]);`);
                }

                break;


            case ProcedureTypes.Return:
                codeStr.push(`if (${args[0].value} > __params__['model'].length) { return __params__['model']; }`);
                codeStr.push(`return __params__['model'][${args[0].value}].value;`);
                break;

            case ProcedureTypes.Function:
                const argVals = [];
                for (const arg of args.slice(1)) {
                    if (arg.name === _parameterTypes.input) {
                        const argVal = await CodeUtils.getStartInput(arg.value || arg.default, prod.meta.inputMode);
                        argVals.push(argVal);
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
                    // TODO-QUERY: update the query statement
                    if (arg.value && arg.value.substring(0, 1) === '#') {
                        argVals.push('`' + arg.value + '`');
                        continue;
                        /*
                        if (prod.meta.module.toUpperCase() === 'QUERY'
                            && prod.meta.name.toUpperCase() === 'SET'
                            && arg.name.toUpperCase() === 'STATEMENT') {
                            argVals.push('"' + arg.value.replace(/"/g, '\'') + '"');
                            continue;
                        }
                        argVals.push('__modules__.Query.get( __params__.model,"' + arg.value.replace(/"/g, '\'') + '" )');
                        continue;
                        */
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
                let argsVals: any = [];
                for (let i = 1; i < args.length; i++) {
                    const arg = args[i];
                    // args.slice(1).map((arg) => {
                    if (arg.type.toString() !== InputType.URL.toString()) {argsVals.push(arg.value); }
                    const r = await CodeUtils.getStartInput(arg.value, InputType.URL);
                    argsVals.push(r);
                }
                argsVals = argsVals.join(',');

                const fn = `${prod.meta.name}(__params__, ${argsVals} )`;
                codeStr.push(`${prefix}${args[0].value} = ${fn};`);
                if (prefix === 'let ') {
                    existingVars.push(args[0].value);
                }
                break;

        }
        if (prod.children) {
            for (const p of prod.children) {
                codeStr = codeStr.concat(await CodeUtils.getProcedureCode(p, existingVars, addProdArr));
            }
            codeStr.push(`}`);
        }

        if (prod.print) {
            codeStr.push(`console.log('${prod.args[0].value}: '+ ${prod.args[0].value});`);
            // codeStr.push(`wait(5000);`);
        }
        return codeStr;
    }

    static async getStartInput(val, inputMode): Promise<any> {
        let result = val;
        if (inputMode.toString() === InputType.URL.toString() ) {
            if (val.indexOf('dropbox') !== -1) {
                val = val.replace('www', 'dl').replace('dl=0', 'dl=1');
            }
            const p = new Promise((resolve) => {
                const request = new XMLHttpRequest();
                request.open('GET', val);
                request.onload = () => {
                    resolve(request.responseText);
                };
                request.send();
            });
            result = await p;
            result = '`' + result + '`';
        } else if (inputMode.toString() === InputType.File.toString()) {
            const p = new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function() {
                    resolve(reader.result);
                };
                reader.readAsText(val);
            });
            result = await p;
            result = '`' + result + '`';
        }
        return result;
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
            const inputs = [];
            for (const edge of inp.edges) {
                if (edge.source.parentNode.enabled) {
                    inputs.push(edge.source.value);
                }
            }
            input = CodeUtils.mergeInputs(inputs);
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

    public static async getNodeCode(node: INode, addProdArr = false): Promise<string[]> {
        node.hasError = false;
        let codeStr = [];
        const varsDefined: string[] = [];
        // input initializations
        if (addProdArr) {
            const input = await CodeUtils.getInputValue(node.input, node);
            node.input.value = input;
        }

        if (node.type === 'start') {
            codeStr.push('__params__.constants = {};\n');
        }


        codeStr.push(`__modules__.${_parameterTypes.preprocess}( __params__.model);`);
        // procedure
        for (const prod of node.procedure) {
            if (node.type === 'start' && !addProdArr) { break; }
            codeStr = codeStr.concat(await CodeUtils.getProcedureCode(prod, varsDefined, addProdArr) );
        }
        if (node.type === 'end' && node.procedure.length > 0) {
            codeStr.push('}');
            return ['{'].concat(codeStr);
            // return `{\n${codeStr.join('\n')}\n}`;
        } else {
            codeStr.push(`__modules__.${_parameterTypes.postprocess}( __params__.model);`);
        }

        codeStr.push('return __params__.model;');
        return codeStr;
        // return `\n${codeStr.join('\n')}\n\nreturn __params__.model;\n`;


        // return `{\n${codeStr.join('\n')}\nreturn result;\n}`;
        // return `/*    ${node.name.toUpperCase()}    */\n\n{\n${codeStr.join('\n')}\nreturn ${node.output.name};\n}`;


    }

    static async getFunctionString(func: IFunction): Promise<string> {
        let fullCode = '';
        /*
        let fnCode = `function ${func.name}(${func.args.map(arg=>{return arg.name}).join(',')})` +
        `{\nvar merged;\nlet __params__={"currentProcedure": [''],"model":{}};\n`;
        */
        let fnCode;
        if (func.args.length === 0) {
            fnCode = `function ${func.name}(__mainParams__)` +
            `{\nvar merged;\nvar _newModel = __modules__.${_parameterTypes['new']}();\n`
            + `let __params__={"currentProcedure": [''],"model": _newModel};\n`;
        } else {
            fnCode = `function ${func.name}(__mainParams__,${func.args.map(arg => arg.name).join(',')})` +
            `{\nvar merged;\nlet __params__={"model":__modules__.${_parameterTypes['new']}()};\n`;
        }

        for (const node of func.flowchart.nodes) {
            let code: any = await CodeUtils.getNodeCode(node, false);
            code = '{\n' + code.join('\n') + '\n}';
            if (func.args.length === 0) {
                fullCode += `function ${node.id}(__params__)` + code + `\n\n`;
            } else {
                fullCode += `function ${node.id}(__params__, ${func.args.map(arg => arg.name).join(',')})` + code + `\n\n`;
            }

            if (node.type === 'start') {
                // fnCode += `let result_${node.id} = ${node.id}(__params__);\n`
                fnCode += `let result_${node.id} = __params__.model;\n`;
            } else if (node.input.edges.length === 1) {
                fnCode += `__params__.model = result_${node.input.edges[0].source.parentNode.id};\n`;
                if (func.args.length === 0) {
                    fnCode += `let result_${node.id} = ${node.id}(__params__);\n`;
                } else {
                    fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg => arg.name).join(',')});\n`;
                }
            } else {
                fnCode += `merged = mergeInputs([${node.input.edges.map((edge) => 'result_' + edge.source.parentNode.id).join(',')}]);\n`;
                fnCode += `__params__.model = merged;\n`;
                if (func.args.length === 0) {
                    fnCode += `let result_${node.id} = ${node.id}(__params__);\n`;
                } else {
                    fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg => arg.name).join(',')});\n`;
                }
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
