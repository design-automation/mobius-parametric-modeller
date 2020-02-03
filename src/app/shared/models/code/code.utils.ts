import { INode } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { IPortInput, InputType } from '@models/port';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { _parameterTypes } from '@assets/core/_parameterTypes';

let _terminateCheck: string;
export class CodeUtils {


    static getProcedureCode(prod: IProcedure, existingVars: string[], isMainFlowchart: Boolean,
                            functionName?: string, usedFunctions?: string[]): string[] {
        if (_terminateCheck === '' || prod.enabled === false ||
            prod.type === ProcedureTypes.Blank ||
            prod.type === ProcedureTypes.Comment) { return ['']; }

        // mark _terminateCheck to terminate all process after this
        if (prod.type === ProcedureTypes.Terminate && prod.enabled) {
            // _terminateCheck = '';
            return ['__params__.terminated = true;', 'return __params__.model;'];
        }

        prod.hasError = false;

        let codeStr: string[] = [];
        const args = prod.args;
        let prefix = '';
        if (args) {
            prefix =
            args.hasOwnProperty('0') && args[0].jsValue && args[0].jsValue.indexOf('[') === -1
            && existingVars.indexOf(args[0].jsValue) === -1 ? 'let ' : '';
        }
        codeStr.push('');
        if (isMainFlowchart && prod.type !== ProcedureTypes.Else && prod.type !== ProcedureTypes.Elseif) {
            codeStr.push(`__params__.currentProcedure[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.Variable:
                if (!args[0].jsValue) {
                    codeStr.push(`${args[1].jsValue};`);
                    break;
                }
                const repVar = this.repSetAttrib(args[0].jsValue);
                if (!repVar) {
                    codeStr.push(`${prefix}${args[0].jsValue} = ${args[1].jsValue};`);
                    if (prefix === 'let ') {
                        existingVars.push(args[0].jsValue);
                    }
                } else {
                    codeStr.push(`${repVar[0]} ${args[1].jsValue} ${repVar[1]}`);
                }
                break;

            case ProcedureTypes.If:
                codeStr.push(`if (${args[0].jsValue}){`);
                break;

            case ProcedureTypes.Else:
                codeStr.push(`else {`);
                break;

            case ProcedureTypes.Elseif:
                codeStr.push(`else if(${args[0].jsValue}){`);
                break;

            case ProcedureTypes.Foreach:
                codeStr.push(`for (${prefix} ${args[0].jsValue} of ${args[1].jsValue}){`);
                break;

            case ProcedureTypes.While:
                codeStr.push(`while (${args[0].jsValue}){`);
                break;

            case ProcedureTypes.Break:
                codeStr.push(`break;`);
                break;

            case ProcedureTypes.Continue:
                codeStr.push(`continue;`);
                break;

            case ProcedureTypes.Constant:
                if (!isMainFlowchart) {
                    return [''];
                }
                let constName = args[0].jsValue;
                if (constName[0] === '"' || constName[0] === '\'') {
                    constName = args[0].jsValue.substring(1, args[0].jsValue.length - 1);
                }
                codeStr.push(`__params__['constants']['${constName}'] = ${prod.resolvedValue};`);

                break;

            case ProcedureTypes.AddData:
                let cst = args[0].value;
                if (!isMainFlowchart) {
                    return [`__modules__.${_parameterTypes.addData}( __params__.model, ${cst});`];
                }
                if (cst[0] === '"' || cst[0] === '\'') {
                    cst = args[0].value.substring(1, args[0].value.length - 1);
                }

                codeStr.push(`__params__['constants']['${cst}'] = ${prod.resolvedValue};`);
                if (_parameterTypes.addData) {
                    codeStr.push(`__modules__.${_parameterTypes.addData}( __params__.model, __params__.constants['${cst}']);`);
                } else {
                    codeStr.push(`__params__.model = mergeInputs( [__params__.model, __params__.constants['${cst}']]);`);
                }

                break;


            case ProcedureTypes.Return:
                let check = true;
                const returnArgVals = [];
                for (const arg of args) {
                    if (arg.name === _parameterTypes.constList) {
                        returnArgVals.push('__params__.constants');
                        continue;
                    }
                    if (arg.name === _parameterTypes.model) {
                        returnArgVals.push('__params__.model');
                        continue;
                    }
                    if (!arg.jsValue) {
                        check = false;
                        break;
                    }
                    if (arg.jsValue[0] === '#') {
                        returnArgVals.push('`' + arg.jsValue + '`');
                        continue;
                    }
                    returnArgVals.push(arg.jsValue);
                }
                if (!check) {
                    codeStr.push(`return null;`);
                } else {
                    codeStr.push(`let __return_value__ = __modules__.${_parameterTypes.return}(${returnArgVals.join(', ')});`);
                    if (isMainFlowchart) {
                        codeStr.push(`__params__.console.push('<p><b>Return: <i>' + ` +
                                     `__return_value__.toString().replace(/,/g,', ') + '</i></b></p>');`);
                    }
                    codeStr.push(`return __return_value__;`);
                }
                break;

            case ProcedureTypes.MainFunction:
                const argVals = [];
                for (const arg of args.slice(1)) {
                    if (arg.name === _parameterTypes.constList) {
                        argVals.push('__params__.constants');
                        continue;
                    }
                    if (arg.name === _parameterTypes.model) {
                        argVals.push('__params__.model');
                        continue;
                    }
                    if (arg.name === _parameterTypes.console) {
                        argVals.push('__params__.console');
                        continue;
                    }
                    if (arg.name === _parameterTypes.fileName) {
                        argVals.push('__params__.fileName');
                        continue;
                    }

                    if (arg.jsValue && arg.jsValue[0] === '#') {
                        argVals.push('`' + arg.jsValue + '`');
                        continue;
                    }
                    argVals.push(arg.jsValue);
                }
                if (prod.resolvedValue) {
                    let prodResolvedCheck = false;
                    for (let i = 0; i < argVals.length; i++) {
                        if (argVals[i].indexOf('://') !== -1) {
                            argVals[i] = prod.resolvedValue;
                            prod.resolvedValue = null;
                            prodResolvedCheck = true;
                            break;
                        }
                    }
                    if (!prodResolvedCheck) {
                        argVals[1] = prod.resolvedValue;
                    }
                }
                // const argValues = argVals.join(', ');
                const fnCall = `__modules__.${prod.meta.module}.${prod.meta.name}( ${argVals.join(', ')} )`;
                if ( prod.meta.module.toUpperCase() === 'OUTPUT') {
                    if (prod.args[prod.args.length - 1].jsValue) {
                        codeStr.push(`return ${fnCall};`);
                    }
                } else if (args[0].name === '__none__' || !args[0].jsValue) {
                    codeStr.push(`${fnCall};`);
                } else {
                    const repfuncVar = this.repSetAttrib(args[0].jsValue);
                    if (!repfuncVar) {
                        codeStr.push(`${prefix}${args[0].jsValue} = ${fnCall};`);
                        if (prefix === 'let ') {
                            existingVars.push(args[0].jsValue);
                        }
                    } else {
                        codeStr.push(`${repfuncVar[0]} ${fnCall} ${repfuncVar[1]}`);
                    }
                }
                break;
            case ProcedureTypes.LocalFuncDef:
                codeStr.push(`\nfunction ${prod.args[0].jsValue}(__params__, ${prod.args.slice(1).map(arg => arg.jsValue).join(', ')}) {`);
                break;
            case ProcedureTypes.LocalFuncReturn:
                codeStr.push(`return ${prod.args[0].jsValue};`);
                break;
            case ProcedureTypes.LocalFuncCall:
                const lArgsVals: any = [];
                // let urlCheck = false;
                if (isMainFlowchart) {
                    usedFunctions.push(prod.meta.name);
                }
                for (let i = 1; i < args.length; i++) {
                    lArgsVals.push(args[i].jsValue);
                }

                const lfn = `${prod.meta.name}_(__params__${lArgsVals.map(val => ', ' + val).join('')})`;
                if (args[0].name === '__none__' || !args[0].jsValue) {
                    codeStr.push(`${lfn};`);
                    codeStr.push('if (__params__.terminated) { return __params__.model;}')
                    break;
                }
                const lRepImpVar = this.repSetAttrib(args[0].jsValue);
                if (!lRepImpVar) {
                    codeStr.push(`${prefix}${args[0].jsValue} = ${lfn};`);
                } else {
                    codeStr.push(`${lRepImpVar[0]} ${lfn} ${lRepImpVar[1]}`);
                }

                if (prefix === 'let ') {
                    existingVars.push(args[0].jsValue);
                }
                codeStr.push('if (__params__.terminated) { return __params__.model;}')
                break;

            case ProcedureTypes.globalFuncCall:
                const argsVals: any = [];
                const namePrefix = functionName ? `${functionName}_` : '';

                // let urlCheck = false;
                if (isMainFlowchart) {
                    usedFunctions.push(prod.meta.name);
                // } else {
                //     for (const urlfunc of _parameterTypes.urlFunctions) {
                //         const funcMeta = urlfunc.split('.');
                //         if (funcMeta[0] === prod.meta.module && funcMeta[1] === prod.meta.name) {
                //             urlCheck = true;
                //             break;
                //         }
                //     }
                }
                for (let i = 1; i < args.length; i++) {
                    const arg = args[i];
                    // if (urlCheck && arg.jsValue.indexOf('://') !== -1) {
                    //     argsVals.push(prod.resolvedValue);
                    //     prod.resolvedValue = null;
                    // }
                    if (arg.type.toString() !== InputType.URL.toString()) {
                        argsVals.push(arg.jsValue);
                        // argsVals.push(this.repGetAttrib(arg.jsValue));
                    } else {
                        argsVals.push(prod.resolvedValue);
                    }
                }
                // argsVals = argsVals.join(', ');
                // const fn = `${namePrefix}${prod.meta.name}(__params__, ${argsVals} )`;
                const fn = `${namePrefix}${prod.meta.name}(__params__${argsVals.map(val => ', ' + val).join('')})`;
                if (args[0].name === '__none__' || !args[0].jsValue) {
                    codeStr.push(`${fn};`);
                    break;
                }
                const repImpVar = this.repSetAttrib(args[0].jsValue);
                if (!repImpVar) {
                    codeStr.push(`${prefix}${args[0].jsValue} = ${fn};`);
                } else {
                    codeStr.push(`${repImpVar[0]} ${fn} ${repImpVar[1]}`);
                }

                if (prefix === 'let ') {
                    existingVars.push(args[0].jsValue);
                }
                break;

        }

        if (isMainFlowchart && prod.print && prod.args[0].name !== '__none__' && prod.args[0].jsValue) {
            // const repGet = prod.args[0].jsValue;
            const repGet = this.repGetAttrib(prod.args[0].jsValue);
            codeStr.push(`printFunc(__params__.console,'${prod.args[0].value}', ${repGet});`);
        }
        if (isMainFlowchart && prod.selectGeom && prod.args[0].jsValue) {
            // const repGet = prod.args[0].jsValue;
            const repGet = this.repGetAttrib(prod.args[0].value);
            const repGetJS = this.repGetAttrib(prod.args[0].jsValue);
            codeStr.push(`try {` +
            `\t__modules__.${_parameterTypes.select}(__params__.model, ${repGetJS}, "${repGet}"); ` +
            `} catch (ex) {` +
            `\t__params__.message = 'Trying to select geometric entities in node "%node%", but no entity was found';` +
            `}`);
        }

        if (prod.children) {
            for (const p of prod.children) {
                codeStr = codeStr.concat(CodeUtils.getProcedureCode(p, existingVars, isMainFlowchart, functionName, usedFunctions));
            }
            codeStr.push(`}`);
        }
        return codeStr;
    }
    static repSetAttrib(val: string) {
        if (!val || val.indexOf('@') === -1) {
            return false;
        }
        // get two parts, before @ and after @
        let val_0: string;
        let val_1: string;
        const atIndex: number = val.indexOf('@');
        if (atIndex === 0) {
            val_0 = null;
            val_1 = val.slice(1);
        } else {
            val_0 = val.slice(0, atIndex);
            val_1 = val.slice(atIndex + 1);
        }
        const bracketIndex = val_1.indexOf('[pythonList(');
        if (bracketIndex !== -1) {
            const name = val_1.slice(0, bracketIndex);
            const index = val_1.lastIndexOf(name);
            // return [`__modules__.${_parameterTypes.setattrib}(__params__.model, ${val_0}, '${name}', ` +
            //         `${val_1.substring(bracketIndex + 12, index - 2)},`, `);`];
            return [`__modules__.${_parameterTypes.setattrib}(__params__.model, ${val_0},` +
                    `['${name}', ${val_1.substring(bracketIndex + 12, index - 2)}], `, `);`];
        } else {
            // return [`__modules__.${_parameterTypes.setattrib}(__params__.model, ${val_0}, '${val_1}', null, `, ');'];
            return [`__modules__.${_parameterTypes.setattrib}(__params__.model, ${val_0}, '${val_1}', `, ');'];
        }
    }

    static repGetAttrib(val: string) {
        if (!val) { return; }
        const res = val.split('@');
        if (res.length === 1 ) {
            return val;
        }
        let entity = res[0];
        if (res[0] === '') {
            entity = 'null';
        }

        let att_name;
        let att_index;
        const bracketIndex = res[1].indexOf('.slice(');
        if (bracketIndex !== -1) {
            att_name = res[1].slice(0, bracketIndex);
            att_index = res[1].slice(bracketIndex + 7, -4);
        } else {
            att_name = res[1];
            att_index = 'null';
        }
        if (att_index === 'null') {
            return `__modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, '${att_name}', 'one_value')`;
        }
        return `__modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, ['${att_name}', ${att_index}], 'one_value')`;
        // return `__modules__.${_parameterTypes.getattrib}(__params__.model, ${entity}, '${att_name}', ${att_index}, 'one_value')`;
    }

    static async getURLContent(url: string): Promise<any> {
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        if (url[0] === '"' || url[0] === '\'') {
            url = url.substring(1);
        }
        if (url[url.length - 1] === '"' || url[url.length - 1] === '\'') {
            url = url.substring(0, url.length - 1);
        }
        const p = new Promise((resolve) => {
            const request = new XMLHttpRequest();
            request.open('GET', url);
            // request.overrideMimeType('text/plain; charset=x-user-defined');
            request.onload = () => {
                resolve(request.responseText.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1'));
            };
            request.onerror = () => {
                resolve('HTTP Request Error: unable to retrieve file from url ' + url);
            };
            request.send();
        });
        return await p;
    }

    static async getStartInput(arg, inputMode): Promise<any> {
        const val = arg.jsValue || arg.value;
        let result = val;
        if (inputMode.toString() === InputType.URL.toString() ) {
            result = await CodeUtils.getURLContent(val);
            if (result.indexOf('HTTP Request Error') !== -1) {
                throw(new Error(result));
            }
            result = '`' + result + '`';
        } else if (inputMode.toString() === InputType.File.toString()) {
            result = window.localStorage.getItem(val.name);
            if (!result) {
                const p = new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        resolve('File Reading Error: unable to read file ' + val.name);
                    };
                    reader.readAsText(val);
                });
                result = await p;
                if (result.indexOf('File Reading Error') !== -1) {
                    throw(new Error(result));
                }
                result = '`' + result + '`';
                // let savedFiles: any = window.localStorage.getItem('savedFileList');
                // if (!savedFiles) {
                //     window.localStorage.setItem('savedFileList', `["${val.name}"]`);
                // } else {
                //     savedFiles = JSON.parse(savedFiles);
                //     window.localStorage.removeItem(savedFiles[0]);
                //     window.localStorage.setItem('savedFileList', `["${val.name}"]`);
                // }
                // window.localStorage.setItem(val.name, result);
                arg.jsValue = {'name': val.name};
            }
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

    public static getNodeCode(node: INode, isMainFlowchart = false,
                                    functionName?: string, usedFunctions?: string[]): [string[][], string] {
        node.hasError = false;
        let codeStr = [];

        // reset terminate check to false at start node (only in main flowchart's start node).
        // for every node after that, if terminate check is true, do not execute the node.
        if (!isMainFlowchart) {
            // do nothing
        } else if (node.type === 'start') {
            _terminateCheck = null;
        } else if (_terminateCheck) {
            return [undefined, _terminateCheck];
        }

        // input initializations
        if (isMainFlowchart) {
            const input = CodeUtils.getInputValue(node.input, node);
            node.input.value = input;
        }

        if (node.type === 'start') {
            codeStr.push('__params__.constants = {};\n');
        }

        codeStr.push(`__modules__.${_parameterTypes.preprocess}( __params__.model);`);

        let varsDefined: string[];
        // procedure
        for (const prod of node.localFunc) {
            varsDefined = [];
            for (const arg of prod.args.slice(1)) {
                varsDefined.push(arg.jsValue);
            }
            codeStr = codeStr.concat(CodeUtils.getProcedureCode(prod, varsDefined, isMainFlowchart, functionName, usedFunctions));
        }
        varsDefined = [];
        for (const prod of node.procedure) {
            // if (node.type === 'start' && !isMainFlowchart) { break; }
            codeStr = codeStr.concat(CodeUtils.getProcedureCode(prod, varsDefined, isMainFlowchart, functionName, usedFunctions));
        }
        if (node.type === 'end' && node.procedure.length > 0) {
            // return [[codeStr, varsDefined], _terminateCheck];
        } else {
            codeStr.push(`__modules__.${_parameterTypes.postprocess}( __params__.model);`);
            codeStr.push('return __params__.model;');
        }

        if (_terminateCheck === '') {
            _terminateCheck = node.name;
        }

        return [[codeStr, varsDefined], _terminateCheck];
    }

    static getFunctionString(func: IFunction): string {
        let fullCode = '';

        let fnCode = `function ${func.name}(__params__${func.args.map(arg => ', ' + arg.name + '_').join('')})` + `{\nvar merged;\n`;

        for (const node of func.flowchart.nodes) {
            const nodeFuncName = `${func.name}_${node.id}`;
            if (node.type === 'start') {
                fnCode += `let result_${nodeFuncName} = __params__.model;\n`;
            } else {
                const codeRes = CodeUtils.getNodeCode(node, false, func.name)[0];
                fullCode += `\nfunction ${nodeFuncName}(__params__${func.args.map(arg => ', ' + arg.name + '_').join('')}){` +
                            codeRes[0].join('\n') + `\n}\n\n`;

                const activeNodes = [];
                for (const nodeEdge of node.input.edges) {
                    if (!nodeEdge.source.parentNode.enabled) {
                        continue;
                    }
                    activeNodes.push(nodeEdge.source.parentNode.id);
                }
                fnCode += `\n__params__.model = mergeInputs([${activeNodes.map((nodeId) =>
                    `result_${func.name}_${nodeId}`).join(', ')}]);\n`;
                fnCode += `let result_${nodeFuncName} = ${nodeFuncName}(__params__${func.args.map(arg => ', ' + arg.name + '_'
                            ).join('')});\n`;

            }
            if (node.type === 'end') {
                // fnCode += `\n__mainParams__.model = mergeInputs([__mainParams__.model,__params__.model]);\n`;
                fnCode += `\nreturn result_${nodeFuncName};\n`;
            }
        }
        fnCode += '}\n\n';
        fullCode += fnCode;
        return fullCode;
    }


}
