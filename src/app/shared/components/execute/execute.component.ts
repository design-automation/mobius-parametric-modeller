import { Component, Input } from '@angular/core';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { CodeUtils } from '@models/code';
import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';

import * as Modules from '@modules';
import { _parameterTypes, _varString } from '@modules';
import { DataService } from '@services';
// import { WebWorkerService } from 'ngx-web-worker';
import { InputType } from '@models/port';

export const mergeInputsFunc = `
function mergeInputs(models){
    let result = __modules__.${_parameterTypes.new}();
    for (let model of models){
        __modules__.${_parameterTypes.merge}(result, model);
    }
    return result;
}
`;
export const printFunc = `
function printFunc(name, value){
    let val;
    if (typeof value === 'number' || value === undefined) {
        val = value;
    } else if (typeof value === 'string') {
        val = '"' + value + '"';
    } else if (value.constructor === [].constructor) {
        val = JSON.stringify(value);
    } else if (value.constructor === {}.constructor) {
        val = JSON.stringify(value);
    } else {
        // console.log('Unknown output type:', value);
        // this.output = functions.__stringify__(value);
        val = value; // TODO - make this generic
    }
    console.log(name+': '+val);
    return val;
}
`;
const DEBUG = false;

@Component({
    selector: 'execute',
    templateUrl: 'execute.component.html',
    styleUrls: ['execute.component.scss']
})
export class ExecuteComponent {

    constructor(private dataService: DataService) {}

    async execute() {
        console.log(' ');
        // reset input of all nodes except start & resolve all async processes (file reading + get url content)
        for (const node of this.dataService.flowchart.nodes) {
            let errorCheck = false;
            if (node.type !== 'start') {
                if (node.input.edges) {
                    node.input.value = undefined;
                }
            }
            await this.resolveImportedUrl(node.procedure);

            if (!node.enabled) {
                continue;
            }

            for (const prod of node.procedure) {
                if (prod.type === ProcedureTypes.Return || !prod.enabled) { continue; }
                if (prod.type === ProcedureTypes.Constant) {
                    prod.resolvedValue = await CodeUtils.getStartInput(prod.args[1], prod.meta.inputMode);
                    if (!prod.args[0].value || (!prod.args[1].value && !prod.args[1].default &&
                        prod.args[1].value !== 0 && prod.args[1].default !== 0)) {
                        node.hasError = true;
                        prod.hasError = true;
                        errorCheck = true;
                    }
                } else {
                    for (const arg of prod.args) {
                        if (arg.name.substring(0, 1) === '_' || arg.type === 5) {
                            continue;
                        }
                        if (arg.value !== 0 && !arg.value) {
                            node.hasError = true;
                            prod.hasError = true;
                            errorCheck = true;
                        }
                    }
                }
            }
            if (errorCheck) {
                document.getElementById('Console').click();
                console.log('Error: Empty Argument detected. Check marked node(s) and procedure(s)!');
                throw new Error('Empty Argument');
            }
        }


        this.executeFlowchart(this.dataService.flowchart);
        // this._webWorkerService.run(this.executeFlowchart, this.dataService.flowchart);

        for (const node of this.dataService.flowchart.nodes) {
            if (node.type !== 'end') {
                delete node.output.value;
            }
        }
    }

    executeFlowchart(flowchart) {
        let globalVars = '';


        // order the flowchart
        if (!flowchart.ordered) {
            FlowchartUtils.orderNodes(flowchart);
        }

        // get the string of all imported functions
        const funcStrings = {};
        for (const func of flowchart.functions) {
            const funcStringRes =  CodeUtils.getFunctionString(func);
            funcStrings[func.name] = funcStringRes[0];
        }

        // execute each node
        for (const node of flowchart.nodes) {
            if (!node.enabled) {
                node.output.value = undefined;
                continue;
            }
            globalVars = this.executeNode(node, funcStrings, globalVars);
        }
    }

    async resolveImportedUrl(prodList: IProcedure[]) {
        for (const prod of prodList) {
            if (prod.type === ProcedureTypes.Imported) {
                for (let i = 1; i < prod.args.length; i++) {
                    const arg = prod.args[i];
                    // args.slice(1).map((arg) => {
                    if (arg.type.toString() !== InputType.URL.toString()) { continue; }
                    prod.resolvedValue = await CodeUtils.getStartInput(arg, InputType.URL);
                }
             }
            if (prod.children) {await this.resolveImportedUrl(prod.children); }
        }
    }

    executeNode(node: INode, funcStrings, globalVars): string {
        const params = {'currentProcedure': ['']};
        let fnString = '';
        try {
            // get the code for the node
            const codeRes = CodeUtils.getNodeCode(node, true);
            const nodeCode = codeRes[0];
            const varsDefined = codeRes[1];

            // fnString = printFunc + nodeCode.join('\n');
            fnString = printFunc + '\nfunction __main_node_code__(){\n' + nodeCode.join('\n') + '\n}\nreturn __main_node_code__();';
            // add the constants from the start node
            fnString = _varString + globalVars + fnString;

            params['model'] = _parameterTypes.newFn();
            _parameterTypes.mergeFn(params['model'], node.input.value);

            // add the imported functions code
            let hasFunctions = false;
            for (const funcName in funcStrings) {
                if (funcStrings.hasOwnProperty(funcName)) {
                    fnString = funcStrings[funcName] + fnString;
                    hasFunctions = true;
                }
            }
            if (hasFunctions || node.type === 'start') {
                fnString = mergeInputsFunc + '\n\n' + fnString;
            }
            // print the code
            console.log(`Executing node: ${node.name}\n`);
            if (DEBUG) {
                console.log(`______________________________________________________________\n/*     ${node.name.toUpperCase()}     */\n`);
                console.log(fnString);
                /*
                for (const i of nodeCode) {
                    if (i.substring(0, 18) === '__params__.current') {
                        continue;
                    }
                    if (i.length > 500) {
                        console.log(i.substring(0, 500) + '...\n});\n');
                    } else {
                        console.log(i);
                    }
                }
                console.log('--------------------------\n');
                */
            }
            // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)
            const context = {};
            const fn = new Function('__modules__', '__params__', fnString).bind(context);
            // execute the function

            const result = fn(Modules, params);
            for (const v of varsDefined) {
                if (window[v]) {
                    delete window[v];
                }
            }

            node.output.value = result;
            if (node.type === 'start') {
                for (const constant in params['constants']) {
                    if (params['constants'].hasOwnProperty(constant)) {
                        const constString = JSON.stringify(params['constants'][constant]);
                        globalVars += `const ${constant} = ${constString};\n`;
                    }
                }
                globalVars += '\n';
            }
            node.model = params['model'];
            return globalVars;
        } catch (ex) {
            if (DEBUG) {
                console.log('\n=======================================\n' +
                    ex.name +
                    '\n=======================================\n' +
                    ex.message);
                throw ex;
            }
            node.hasError = true;
            // console.warn(`${node.name} errored`);

            // Unexpected Identifier
            // Unexpected token
            const prodWithError: string = params['currentProcedure'][0];
            const markError = function(prod: IProcedure, id: string) {
                if (prod['ID'] && id && prod['ID'] === id) {
                    prod.hasError = true;
                }
                if (prod.children) {
                    prod.children.map(function(p) {
                        markError(p, id);
                    });
                }
            };
            if (prodWithError !== '') {
                node.procedure.map(function(prod: IProcedure) {
                    if (prod['ID'] === prodWithError) {
                        prod.hasError = true;
                    }
                    if (prod.children) {
                        prod.children.map(function(p) {
                            markError(p, prodWithError);
                        });
                    }
                });
            }

            if (ex.toString().indexOf('Unexpected identifier') > -1) {
                ex.message = 'Unexpected Identifier error. Did you declare everything?' +
                'Check that your strings are enclosed in quotes (")';
            } else if (ex.toString().indexOf('Unexpected token') > -1 || ex.toString().indexOf('unexpected token') > -1) {
                ex.message = 'Unexpected token error. Check for stray spaces or reserved keywords?';
            } else if (ex.toString().indexOf('\'readAsText\' on \'FileReader\'') > -1) {
                ex.message = 'Unable to read file input. Check all start node inputs.';
            } else if (ex.toString().indexOf('Cannot read property \'splice\'') > -1) {
                ex.message = 'Unrecognized or missing variable in the procedure.';
            }
            document.getElementById('Console').click();
            // @ts-ignore
            // console.logs = [];
            console.log('\n=======================================\n' +
                        ex.name +
                        '\n=======================================\n' +
                        ex.message);
            // console.log('---------------\nError node code:');
            // console.log(fnString);
            throw ex;

        }
    }

    runningFunction(functionDetails) {
        // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)
        const fn = new Function('__modules__', '__params__', functionDetails.fnString);
        // execute the function
        const result = fn(functionDetails.Modules, functionDetails.params);
        return [result, functionDetails.params];
    }
}
