import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { IPortInput, InputType } from '@models/port';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { _parameterTypes } from '@modules';


export class CodeUtils {

    static getProcedureCode(prod: IProcedure, existingVars: string[], addProdArr: Boolean): string[] {
        if (prod.enabled === false || prod.type === ProcedureTypes.Blank) { return ['']; }

        prod.hasError = false;

        let codeStr: string[] = [];
        const args = prod.args;
        const prefix =
            args.hasOwnProperty('0') && args[0].value && args[0].value.indexOf('[') === -1
            && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';
        codeStr.push('');
        if (addProdArr && prod.type !== ProcedureTypes.Else && prod.type !== ProcedureTypes.Elseif) {
            codeStr.push(`__params__.currentProcedure[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.Variable:
                if (!args[0].value) {
                    codeStr.push(`${this.repGetAttrib(args[1].value)};`);
                    break;
                }
                const repVar = this.repSetAttrib(args[0].value);
                if (!repVar) {
                    codeStr.push(`${prefix}${args[0].value} = ${args[1].value};`);
                    if (prefix === 'let ') {
                        existingVars.push(args[0].value);
                    }
                } else {
                    codeStr.push(`${repVar}${this.repGetAttrib(args[1].value)});`);
                }
                break;

            case ProcedureTypes.If:
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`if (${this.repGetAttrib(args[0].value)}){`);
                break;

            case ProcedureTypes.Else:
                codeStr.push(`else {`);
                break;

            case ProcedureTypes.Elseif:
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`else if(${this.repGetAttrib(args[0].value)}){`);
                break;

            case ProcedureTypes.Foreach:
                // codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`for (${prefix} ${args[0].value} of ${this.repGetAttrib(args[1].value)}){`);
                break;

            case ProcedureTypes.While:
                if (args[0].value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                codeStr.push(`while (${this.repGetAttrib(args[0].value)}){`);
                break;

            case ProcedureTypes.Break:
                codeStr.push(`break;`);
                break;

            case ProcedureTypes.Continue:
                codeStr.push(`continue;`);
                break;

            case ProcedureTypes.Constant:
                if (!addProdArr) {
                    return [''];
                }
                let constName = args[0].value;
                if (constName.substring(0, 1) === '"' || constName.substring(0, 1) === '\'') {
                    constName = args[0].value.substring(1, args[0].value.length - 1);
                }
                codeStr.push(`__params__['constants']['${constName}'] = ${prod.resolvedValue};`);

                break;

            case ProcedureTypes.AddData:
                let cst = args[0].value;
                if (!addProdArr) {
                    return [`__modules__.${_parameterTypes.addData}( __params__.model, ${cst});`];
                }
                if (cst.substring(0, 1) === '"' || cst.substring(0, 1) === '\'') {
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
                codeStr.push(`if (${args[0].value} > __params__['model'].length) { return __params__['model']; }`);
                codeStr.push(`return __params__['model'][${args[0].value}].value;`);
                break;

            case ProcedureTypes.Function:
                const argVals = [];
                for (const arg of args.slice(1)) {
                    if (arg.value && arg.value.indexOf('__params__') !== -1) { throw new Error('Unexpected Identifier'); }
                    if (arg.name === _parameterTypes.constList) {
                        argVals.push('__params__.constants');
                        continue;
                    }
                    if (arg.name === _parameterTypes.model) {
                        argVals.push('__params__.model');
                        continue;
                    }

                    if (arg.value && arg.value.substring(0, 1) === '#') {
                        argVals.push('`' + this.repGetAttrib(arg.value) + '`');
                        continue;
                    }
                    argVals.push(this.repGetAttrib(arg.value));

                }
                const argValues = argVals.join(', ');
                const fnCall = `__modules__.${prod.meta.module}.${prod.meta.name}( ${argValues} )`;
                if ( prod.meta.module.toUpperCase() === 'OUTPUT') {
                    codeStr.push(`return ${fnCall};`);
                } else if (args[0].name === '__none__' || !args[0].value) {
                    codeStr.push(`${fnCall};`);
                } else {
                    const repfuncVar = this.repSetAttrib(args[0].value);
                    if (!repfuncVar) {
                        codeStr.push(`${prefix}${args[0].value} = ${fnCall};`);
                        if (prefix === 'let ') {
                            existingVars.push(args[0].value);
                        }
                    } else {
                        codeStr.push(`${repfuncVar}${fnCall});`);
                    }
                }
                break;
            case ProcedureTypes.Imported:
                let argsVals: any = [];
                for (let i = 1; i < args.length; i++) {
                    const arg = args[i];
                    // args.slice(1).map((arg) => {
                    if (arg.type.toString() !== InputType.URL.toString()) {argsVals.push(this.repGetAttrib(arg.value)); }
                    argsVals.push(prod.resolvedValue);
                }
                argsVals = argsVals.join(', ');

                const fn = `${prod.meta.name}(__params__, ${argsVals} )`;

                if (!args[0].value) {
                    codeStr.push(`${fnCall};`);
                    break;
                }
                const repImpVar = this.repSetAttrib(args[0].value);
                if (!repImpVar) {
                    codeStr.push(`${prefix}${args[0].value} = ${fn};`);
                    if (prefix === 'let ') {
                        existingVars.push(args[0].value);
                    }
                } else {
                    codeStr.push(`${repImpVar}${fnCall});`);
                }

                if (prefix === 'let ') {
                    existingVars.push(args[0].value);
                }
                break;

        }
        if (prod.children) {
            for (const p of prod.children) {
                codeStr = codeStr.concat(CodeUtils.getProcedureCode(p, existingVars, addProdArr));
            }
            codeStr.push(`}`);
        }

        if (prod.print) {
            codeStr.push(`printFunc('${prod.args[0].value}', ${prod.args[0].value});`);
            // codeStr.push(`wait(5000);`);
        }
        return codeStr;
    }
    static repSetAttrib(val: string) {
        if (val.indexOf('@') === -1) {
            return false;
        }
        return `__modules__.${_parameterTypes.setattrib}('${val}', `;
    }

    static repGetAttrib(val: string) {
        const res = val.split(' ');
        for (const i in res) {
            if (!res[i]) {
                continue;
            }
            const atIndex = res[i].indexOf('@');
            if (atIndex !== -1 && atIndex > 0 && res[i].trim()[0] !== '#') {
                res[i] = `__modules__.${_parameterTypes.getattrib}('${res[i]}')`;
            }
        }
        return res.join(' ');
    }

    static async getStartInput(arg, inputMode): Promise<any> {
        let val;
        let defaultCheck = false;
        if (arg.value === undefined) {
            val = arg.default;
            defaultCheck = true;
        } else {
            val = arg.value;
        }
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
            result = '`' + await p + '`';
        } else if (inputMode.toString() === InputType.File.toString()) {
            if (val.lastModified) {
                const p = new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function() {
                        resolve(reader.result);
                    };
                    reader.readAsText(val);
                });
                result = '`' + await p + '`';
                window.localStorage.setItem(val.name, result);
                if (defaultCheck) {
                    arg.default = {'name': val.name};
                } else {
                    arg.value = {'name': val.name};
                }
            } else {
                result = window.localStorage.getItem(val.name);
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

    public static getNodeCode(node: INode, addProdArr = false): string[] {
        node.hasError = false;
        let codeStr = [];
        const varsDefined: string[] = [];
        // input initializations
        if (addProdArr) {
            const input = CodeUtils.getInputValue(node.input, node);
            node.input.value = input;
        }

        if (node.type === 'start') {
            codeStr.push('__params__.constants = {};\n');
        }


        codeStr.push(`__modules__.${_parameterTypes.preprocess}( __params__.model);`);
        // procedure
        for (const prod of node.procedure) {
            // if (node.type === 'start' && !addProdArr) { break; }
            codeStr = codeStr.concat(CodeUtils.getProcedureCode(prod, varsDefined, addProdArr) );
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

    static getFunctionString(func: IFunction): string {
        let fullCode = '';
        /*
        let fnCode = `function ${func.name}(${func.args.map(arg=>{return arg.name}).join(', ')})` +
        `{\nvar merged;\nlet __params__={"currentProcedure": [''],"model":{}};\n`;
        */
        let fnCode;
        if (func.args.length === 0) {
            fnCode = `function ${func.name}(__mainParams__)` +
            `{\nvar merged;\nvar _newModel = __modules__.${_parameterTypes['new']}();\n`
            + `let __params__={"currentProcedure": [''],"model": _newModel};\n`;
        } else {
            fnCode = `function ${func.name}(__mainParams__, ${func.args.map(arg => arg.name).join(', ')})` +
            `{\nvar merged;\nlet __params__={"model":__modules__.${_parameterTypes['new']}()};\n`;
        }

        for (const node of func.flowchart.nodes) {
            let code: any = CodeUtils.getNodeCode(node, false);
            code = '{\n' + code.join('\n') + '\n}';
            if (func.args.length === 0) {
                fullCode += `function ${node.id}(__params__)` + code + `\n\n`;
            } else {
                fullCode += `function ${node.id}(__params__, ${func.args.map(arg => arg.name).join(', ')})` + code + `\n\n`;
            }

            if (node.type === 'start') {
                // fnCode += `let result_${node.id} = ${node.id}(__params__);\n`
                fnCode += `let result_${node.id} = __params__.model;\n`;
            } else {
                const activeNodes = [];
                for (const nodeEdge of node.input.edges) {
                    if (!nodeEdge.source.parentNode.enabled) {
                        continue;
                    }
                    activeNodes.push(nodeEdge.source.parentNode.id);
                }
                if (activeNodes.length === 1) {
                    fnCode += `__params__.model = result_${activeNodes};\n`;
                } else {
                    fnCode += `merged = mergeInputs([${activeNodes.map((nodeId) => 'result_' + nodeId).join(', ')}]);\n`;
                    fnCode += `__params__.model = merged;\n`;
                }
                if (func.args.length === 0) {
                    fnCode += `let result_${node.id} = ${node.id}(__params__);\n`;
                } else {
                    fnCode += `let result_${node.id} = ${node.id}(__params__, ${func.args.map(arg => arg.name).join(', ')});\n`;
                }
            }
            /*
            } else if (node.input.edges.length == 1) {
                fnCode += `let result_${node.id} = ${node.id}(result_${node.input.edges[0].source.parentNode.id});\n`
            } else {
                fnCode += `merged = mergeResults([${node.input.edges.map((edge)=>'result_'+edge.source.parentNode.id).join(', ')}]);\n`;
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
