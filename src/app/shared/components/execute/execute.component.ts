import { Component, isDevMode } from '@angular/core';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { CodeUtils } from '@models/code';
import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';

import * as Modules from '@modules';
import { _parameterTypes, _varString } from '@modules';
import { DataService } from '@services';
// import { WebWorkerService } from 'ngx-web-worker';
import { InputType } from '@models/port';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';

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
function printFunc(_console, name, value){
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
        val = value;
    }
    _console.push(name+': '+val);
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

    private startTime;
    private isDev = true;
    constructor(private dataService: DataService, private googleAnalyticsService: GoogleAnalyticsService) {
        this.isDev = isDevMode();
    }

    async execute(testing?: boolean) {
        this.startTime = performance.now();
        document.getElementById('spinner-on').click();
        this.dataService.log(' ');

        // reset input of all nodes except start & resolve all async processes (file reading + get url content)
        for (const node of this.dataService.flowchart.nodes) {
            let EmptyECheck = false;
            let InvalidECheck = false;
            if (node.type !== 'start') {
                if (node.input.edges) {
                    node.input.value = undefined;
                }
            }

            try {
                await this.resolveImportedUrl(node.procedure);
            } catch (ex) {
                document.getElementById('spinner-off').click();
                document.getElementById('Console').click();
                this.dataService.log(ex.message);
                const _category = this.isDev ? 'dev' : 'execute';
                this.googleAnalyticsService.trackEvent(_category, `error: ${ex.name}`, 'click', performance.now() - this.startTime);
                throw ex;
            }

            if (!node.enabled) {
                continue;
            }

            for (const prod of node.procedure) {
                if (prod.type === ProcedureTypes.Return || !prod.enabled) { continue; }
                if (prod.args.length > 0 && prod.args[0].invalidVar) {
                    node.hasError = true;
                    prod.hasError = true;
                    InvalidECheck = true;
                }
                if (prod.type === ProcedureTypes.Constant) {
                    try {
                        prod.resolvedValue = await CodeUtils.getStartInput(prod.args[1], prod.meta.inputMode);
                    } catch (ex) {
                        node.hasError = true;
                        prod.hasError = true;
                        if (ex.message.indexOf('HTTP') !== -1 || ex.message.indexOf('File Reading') !== -1) {
                            document.getElementById('Console').click();
                            document.getElementById('spinner-off').click();
                            const _category = this.isDev ? 'dev' : 'execute';
                            this.googleAnalyticsService.trackEvent(_category, `error: Reserved Word Argument`,
                                'click', performance.now() - this.startTime);
                            this.dataService.log(ex.message);
                            throw(ex);
                        }
                        InvalidECheck = true;
                    }
                    if (!prod.args[0].value || (!prod.args[1].value && !prod.args[1].default &&
                        prod.args[1].value !== 0 && prod.args[1].default !== 0)) {
                        node.hasError = true;
                        prod.hasError = true;
                        EmptyECheck = true;
                    }
                } else {
                    for (const arg of prod.args) {
                        if (arg.name[0] === '_' || arg.type === 5) {
                            continue;
                        }
                        if (arg.value !== 0 && !arg.value) {
                            node.hasError = true;
                            prod.hasError = true;
                            EmptyECheck = true;
                        }
                    }
                }
            }
            if (EmptyECheck) {
                document.getElementById('Console').click();
                this.dataService.log('Error: Empty Argument detected. Check marked node(s) and procedure(s)!');
                document.getElementById('spinner-off').click();
                const _category = this.isDev ? 'dev' : 'execute';
                this.googleAnalyticsService.trackEvent(_category, `error: Empty Argument`, 'click', performance.now() - this.startTime);
                throw new Error('Empty Argument');
            }
            if (InvalidECheck) {
                document.getElementById('Console').click();
                this.dataService.log('Error: Invalid Argument or Argument with Reserved Word detected.' +
                                     'Check marked node(s) and procedure(s)!');
                document.getElementById('spinner-off').click();
                const _category = this.isDev ? 'dev' : 'execute';
                this.googleAnalyticsService.trackEvent(_category, `error: Reserved Word Argument`,
                    'click', performance.now() - this.startTime);
                throw new Error('Reserved Word Argument');
            }
        }

        if (testing) {
            this.executeFlowchart();
            return;
        } else {
            // setTimeout for 20ms so that the loading screen has enough time to be loaded in
            setTimeout(() => {
                this.executeFlowchart();
            }, 20);
        }

    }

    executeFlowchart() {
        let globalVars = '';

        // order the flowchart
        if (!this.dataService.flowchart.ordered) {
            FlowchartUtils.orderNodes(this.dataService.flowchart);
        }

        // get the string of all imported functions
        const funcStrings = {};
        for (const func of this.dataService.flowchart.functions) {
            funcStrings[func.name] =  CodeUtils.getFunctionString(func);
        }

        // execute each node
        for (const node of this.dataService.flowchart.nodes) {
            if (!node.enabled) {
                node.output.value = undefined;
                continue;
            }
            globalVars = this.executeNode(node, funcStrings, globalVars);
        }

        for (const node of this.dataService.flowchart.nodes) {
            if (node.type !== 'end') {
                delete node.output.value;
            }
        }

        document.getElementById('spinner-off').click();
        const category = this.isDev ? 'dev' : 'execute';
        this.googleAnalyticsService.trackEvent(category, 'successful', 'click', performance.now() - this.startTime);
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
        const params = {'currentProcedure': [''], 'console': []};
        let fnString = '';
        const startTime = performance.now();
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
            this.dataService.log(`Executing node: ${node.name}\n`);
            if (DEBUG) {
                console.log(`______________________________________________________________\n/*     ${node.name.toUpperCase()}     */\n`);
                console.log(fnString);
            }

            const prevWindowVar = {};
            for (const v of varsDefined) {
                if (window.hasOwnProperty(v)) {
                    prevWindowVar[v] = window[v];
                }
            }

            // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)
            const fn = new Function('__modules__', '__params__', fnString);
            // execute the function

            const result = fn(Modules, params);

            for (const v of varsDefined) {
                if (window.hasOwnProperty(v)) {
                    delete window[v];
                    if (prevWindowVar[v]) {
                        window[v] = prevWindowVar[v];
                    }
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
            const endTime = performance.now();
            const duration: number = Math.round(endTime - startTime);
            let duration_msg: string;
            if (duration < 1000)  {
                duration_msg = '  Executed in ' + duration + ' milliseconds.';
            } else {
                duration_msg = '  Executed in ' + duration / 1000 + ' seconds.';
            }
            for (const str of params.console) {
                this.dataService.log(str);
            }
            this.dataService.log(duration_msg);
            return globalVars;
        } catch (ex) {
            for (const str of params.console) {
                this.dataService.log(str);
            }
            const endTime = performance.now();
            const duration: number = Math.round(endTime - startTime);
            let duration_msg: string;
            if (duration < 1000)  {
                duration_msg = '  Executed in ' + duration + ' milliseconds.';
            } else {
                duration_msg = '  Executed in ' + duration / 1000 + ' seconds.';
            }
            this.dataService.log(duration_msg);
            document.getElementById('spinner-off').click();
            if (DEBUG) {
                this.dataService.log('\n=======================================\n' +
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
            this.dataService.log('\n=======================================\n' +
                        ex.name +
                        '\n=======================================\n' +
                        ex.message);
            // console.log('---------------\nError node code:');
            // console.log(fnString);
            const category = this.isDev ? 'dev' : 'execute';
            this.googleAnalyticsService.trackEvent(category, `error: ${ex.name}`, 'click', performance.now() - this.startTime);
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
