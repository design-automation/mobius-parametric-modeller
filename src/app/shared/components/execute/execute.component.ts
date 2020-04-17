import { Component, isDevMode } from '@angular/core';
import { FlowchartUtils } from '@models/flowchart';
import { CodeUtils } from './code.util';
import { INode } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';

import * as Modules from '@modules';
import { DataService } from '@services';
// import { WebWorkerService } from 'ngx-web-worker';
import { InputType } from '@models/port';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';
import { Router } from '@angular/router';
import { DataOutputService } from '@shared/services/dataOutput.service';
import { SaveFileComponent } from '@shared/components/file';
import { _parameterTypes, _varString } from '@assets/core/_parameterTypes';

export const pythonList = `
function pythonList(x, l){
    if (x < 0) {
        return x + l;
    }
    return x;
}
`;
export const mergeInputsFunc = `
function mergeInputs(models){
    let result = __modules__.${_parameterTypes.new}();
    try {
        result.debug = __debug__;
    } catch (ex) {}
    for (let model of models){
        __modules__.${_parameterTypes.merge}(result, model);
    }
    return result;
}
function duplicateModel(model){
    return model.clone();;
}
`;
export const printFunc = `
function printFunc(_console, name, value){
    let val;
    let padding_style = 'padding: 2px 0px 2px 10px;';
    if (!value) {
        val = value;
    } else if (value === '__null__') {
        _console.push('<p style="' + padding_style + '"><b><i>_ ' + name + '</i></b></p>');
        return value;
    } else if (typeof value === 'number' || value === undefined) {
        val = value;
    } else if (typeof value === 'string') {
        val = '"' + value.replace(/\\n/g, '<br>') + '"';
    } else if (value.constructor === [].constructor) {
        let __list_check__ = false;
        let __value_strings__ = [];
        for (const __item__ of value) {
            if (!__item__) {
                __value_strings__.push('' + __item__);
                continue;
            }
            if (__item__.constructor === [].constructor || __item__.constructor === {}.constructor) {
                __list_check__ = true;
            }
            __value_strings__.push(JSON.stringify(__item__).replace(/,/g, ', '));
        }
        if (__list_check__) {
            padding_style = 'padding: 2px 0px 0px 10px;';
            val = '[<p style="padding: 0px 0px 2px 40px;">' +
                  __value_strings__.join(',</p><p style="padding: 0px 0px 2px 40px;">') +
                  '</p><p style="padding: 0px 0px 2px 30px;">]</p>';
        } else {
            val = '[' + __value_strings__.join(', ') + ']';
        }
    } else if (value.constructor === {}.constructor) {
        let __list_check__ = false;
        let __value_strings__ = [];
        for (const __item__ in value) {
            const __value__ = value[__item__];
            if (!__value__) {
                __value_strings__.push('\\"' + __item__ + '\\"' + ': ' + __value__);
                continue;
            }
            if (__value__.constructor === [].constructor || __value__.constructor === {}.constructor) {
                __list_check__ = true;
            }
            __value_strings__.push('\\"' + __item__ + '\\"' + ': ' + JSON.stringify(__value__).replace(/,/g, ', '));
        }
        if (__list_check__) {
            padding_style = 'padding: 2px 0px 0px 10px;';
            val = '{<p style="padding: 0px 0px 2px 40px;">' +
                  __value_strings__.join(',</p><p style="padding: 0px 0px 2px 40px;">') +
                  '</p><p style="padding: 0px 0px 2px 30px;">}</p>';
        } else {
            val = '{' + __value_strings__.join(', ') + '}';
        }
    } else {
        val = value;
    }
    _console.push('<p style="' + padding_style + '"><b><i>_ ' + name+'</i></b>  = ' + val + '</p>');
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
    private triggerCheck: boolean;
    private terminated: string;

    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private router: Router,
                private googleAnalyticsService: GoogleAnalyticsService) {
        this.isDev = isDevMode();
    }

    static async resolveImportedUrl(prodList: IProcedure[], isMainFlowchart?: boolean) {
        for (const prod of prodList) {
            if (prod.children) {await  ExecuteComponent.resolveImportedUrl(prod.children); }
            if (!prod.enabled) {
                continue;
            }
            if (isMainFlowchart && prod.type === ProcedureTypes.globalFuncCall) {
                for (let i = 1; i < prod.args.length; i++) {
                    const arg = prod.args[i];
                    // args.slice(1).map((arg) => {
                    if (arg.type.toString() !== InputType.URL.toString()) { continue; }
                    prod.resolvedValue = await CodeUtils.getStartInput(arg, InputType.URL);
                }
                continue;
            }
            if (prod.type !== ProcedureTypes.MainFunction) {continue; }
            for (const func of _parameterTypes.urlFunctions) {
                const funcMeta = func.split('.');
                if (prod.meta.module === funcMeta[0] && prod.meta.name === funcMeta[1]) {
                    const arg = prod.args[2];
                    if (arg.name[0] === '_') { continue; }
                    if (arg.value.indexOf('__model_data__') !== -1) {
                        arg.jsValue = arg.value;
                        prod.resolvedValue = arg.value.split('__model_data__').join('');
                    } else if (arg.jsValue && arg.jsValue.indexOf('__model_data__') !== -1) {
                        prod.resolvedValue = arg.jsValue.split('__model_data__').join('');
                    } else if (arg.value.indexOf('://') !== -1) {
                        const val = <string>(arg.value).replace(/ /g, '');
                        const result = await CodeUtils.getURLContent(val);
                        if (result === undefined) {
                            prod.resolvedValue = arg.value;
                        } else {
                            prod.resolvedValue = '`' + result + '`';
                        }
                        break;
                    } else {
                        const backup_list = JSON.parse(localStorage.getItem('mobius_backup_list'));
                        const val = arg.value.replace(/\"|\'/g, '');
                        if (backup_list.indexOf(val) !== -1) {
                            const result = await SaveFileComponent.loadFromFileSystem(val);
                            if (!result || result === 'error') {
                                prod.hasError = true;
                                throw(new Error(`File named ${val} does not exist in the local storage`));
                                // prod.resolvedValue = arg.value;
                            } else {
                                prod.resolvedValue = '`' + result + '`';
                            }
                        } else {
                            prod.hasError = true;
                            throw(new Error(`File named ${val} does not exist in the local storage`));
                        }
                    }
                    break;
                }
            }
        }
    }

    async execute(testing?: boolean) {
        this.startTime = performance.now();
        this.triggerCheck = false;
        this.terminated = null;

        if (this.dataService.consoleClear) {
            this.dataService.clearLog();
        }
        SaveFileComponent.clearModelData(this.dataService.flowchart, null, false);

        if (this.dataService.mobiusSettings.debug === undefined) {
            this.dataService.mobiusSettings.debug = true;
        }

        document.getElementById('spinner-on').click();
        this.dataService.log('<br><hr>');

        // reset input of all nodes except start & resolve all async processes (file reading + get url content)
        for (const node of this.dataService.flowchart.nodes) {
            node.hasError = false;
            let EmptyECheck = false;
            let InvalidECheck = false;

            // reset node input value to undefined --> save memory
            if (node.type !== 'start') {
                if (node.input.edges) {
                    node.input.value = undefined;
                }
            }

            if (!node.enabled) {
                continue;
            }

            // resolve all urls (or local storage files) in the node, calling the url and retrieving the data
            // the data is then saved as resolvedValue in its respective argument in the procedure (in JSON format)
            try {
                await  ExecuteComponent.resolveImportedUrl(node.procedure, true);
            } catch (ex) {
                node.hasError = true;
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                document.getElementById('spinner-off').click();
                document.getElementById('Console').click();
                this.dataService.log(`<h4 style="padding: 2px 0px 2px 0px; color:red;">Error: ${ex.message}</h4>`);
                const _category = this.isDev ? 'dev' : 'execute';
                this.googleAnalyticsService.trackEvent(_category, `error: ${ex.name}`, 'click', performance.now() - this.startTime);
                throw ex;
            }
            let validCheck = await this.checkProdValidity(node, node.localFunc);
            InvalidECheck = InvalidECheck || validCheck[0];
            EmptyECheck = EmptyECheck || validCheck[1];
            validCheck = await this.checkProdValidity(node, node.procedure);
            InvalidECheck = InvalidECheck || validCheck[0];
            EmptyECheck = EmptyECheck || validCheck[1];
            // // Empty argument error
            // if (EmptyECheck) {
            //     document.getElementById('Console').click();
            //     this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; color:red;">Error: Empty Argument detected. ' +
            //                          'Check marked node(s) and procedure(s)!</h5>');
            //     this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            //     document.getElementById('spinner-off').click();
            //     const _category = this.isDev ? 'dev' : 'execute';
            //     this.googleAnalyticsService.trackEvent(_category, `error: Empty Argument`, 'click', performance.now() - this.startTime);
            //     throw new Error('Empty Argument');
            // }
            // // Invalid argument value error
            // if (InvalidECheck) {
            //     document.getElementById('Console').click();
            //     this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; style="color:red">Error: Invalid Argument or ' +
            //                          'Argument with Reserved Word detected. Check marked node(s) and procedure(s)!</h5>');
            //     document.getElementById('spinner-off').click();
            //     this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            //     const _category = this.isDev ? 'dev' : 'execute';
            //     this.googleAnalyticsService.trackEvent(_category, `error: Reserved Word Argument`,
            //         'click', performance.now() - this.startTime);
            //     throw new Error('Reserved Word Argument');
            // }
        }

        // resolve urls for each imported functions and subFunctions
        for (const func of this.dataService.flowchart.functions) {
            for (const node of func.flowchart.nodes) {
                await  ExecuteComponent.resolveImportedUrl(node.procedure, false);
            }
        }
        if (this.dataService.flowchart.subFunctions) {
            for (const func of this.dataService.flowchart.subFunctions) {
                for (const node of func.flowchart.nodes) {
                    await  ExecuteComponent.resolveImportedUrl(node.procedure, false);
                }
            }
        }

        // execute the flowchart
        try {
            if (testing) {
                this.executeFlowchart();
                this.dataService.finalizeLog();
                return;
            } else {
                // setTimeout for 20ms so that the loading screen has enough time to be loaded in
                setTimeout(() => {
                    this.executeFlowchart();
                    this.dataService.finalizeLog();
                    this.dataService.log('<br>');
                }, 20);
            }
        } catch (ex) {
            document.getElementById('spinner-off').click();
        }
    }

    async checkProdValidity(node: INode, prodList: IProcedure[]) {
        let InvalidECheck = false;
        let EmptyECheck = false;
        console.log('................')
        for (const prod of prodList) {
            // ignore the return, comment and disabled procedures
            if (prod.type === ProcedureTypes.Return || prod.type === ProcedureTypes.Comment || !prod.enabled) { continue; }
            // if there's any invalid argument, flag as having error
            for (const arg of prod.args) {
                console.log(arg)
                if (arg.invalidVar) {
                    node.hasError = true;
                    prod.hasError = true;
                    InvalidECheck = true;
                    console.log('------------------------')
                }
            }
            // if (prod.argCount > 0 && prod.args[0].invalidVar) {
            //     node.hasError = true;
            //     prod.hasError = true;
            //     InvalidECheck = true;
            // }

            // for start node constant procedures (start node parameters)
            if (prod.type === ProcedureTypes.Constant) {
                // resolve start node input (URL + File parameters) ... to be revised
                // flag error if catch error (invalid argument value)
                try {
                    prod.resolvedValue = await CodeUtils.getStartInput(prod.args[1], prod.meta.inputMode);
                } catch (ex) {
                    node.hasError = true;
                    prod.hasError = true;
                    if (ex.message.indexOf('HTTP') !== -1 || ex.message.indexOf('File Reading') !== -1) {
                        document.getElementById('spinner-off').click();
                        document.getElementById('Console').click();
                        this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                        const _category = this.isDev ? 'dev' : 'execute';
                        this.googleAnalyticsService.trackEvent(_category, `error: Reserved Word Argument`,
                            'click', performance.now() - this.startTime);
                        this.dataService.log(`<h4 style="padding: 2px 0px 2px 0px; color:red;">Error: ${ex.message}</h4>`);
                        throw(ex);
                    }
                    InvalidECheck = true;
                }

                // if there's no value for the parameter name or parameter value -> flag error (empty argument)
                if (!prod.args[0].value || (!prod.args[1].value && prod.args[1].value !== 0 && prod.args[1].value !== false)) {
                    node.hasError = true;
                    prod.hasError = true;
                    EmptyECheck = true;
                }
            // any other procedure type that is not start node constant
            } else {
                for (const arg of prod.args) {
                    // ignore arguments that have argument name starting with "_" ("__model__", "__constant__", ...)
                    if (arg.name[0] === '_' || arg.type === 5) {
                        continue;
                    }
                    // if the argument value is empty -> flag error (empty argument)
                    if (arg.value !== 0 && arg.value !== false && !arg.value) {
                        node.hasError = true;
                        prod.hasError = true;
                        EmptyECheck = true;
                    }
                }
            }
            if (prod.children) {
                const childrenCheck = this.checkProdValidity(node, prod.children);
                InvalidECheck = InvalidECheck || childrenCheck[0];
                EmptyECheck = EmptyECheck || childrenCheck[1];
            }
        }
        return [InvalidECheck, EmptyECheck]
    }

    extractAnswerList(flowchart: any): any {
        const answerList = {'params': []};
        const paramList = [];
        const lines = flowchart.description.split('\n');
        for (const line of lines) {
            let splittedLine = line.split(':');
            if (splittedLine.length < 2) {
                splittedLine = line.split('=');
                if (splittedLine.length < 2){
                    continue;
                }
            }
            const param = splittedLine[0].trim();
            if (this.isParamName(param, flowchart)) {
                let paramVal;
                try {
                    paramVal = JSON.parse(splittedLine[1]);
                } catch (ex) {
                    paramVal = JSON.parse('[' + splittedLine[1] + ']');
                }
                if (!paramVal) { continue; }
                if (paramVal.constructor !== [].constructor) {
                    paramVal = [paramVal];
                }
                paramList.push([param, paramVal]);
            } else if (param !== 'params') {
                try {
                    answerList[param] = JSON.parse(splittedLine[1]);
                } catch (ex) {
                    answerList[param] = JSON.parse('[' + splittedLine[1] + ']');
                }
            }
        }
        if (paramList.length === 0) {
            return answerList;
        }

        for (let i = 0; i < paramList[0][1].length; i++) {
            const paramSet = {};
            let check = true;
            for (const param of paramList) {
                if (i >= param[1].length) {
                    check = false;
                    break;
                }
                paramSet[param[0]] = param[1][i];
            }
            if (!check) { break; }
            answerList.params.push(paramSet);
        }
        return answerList;
    }

    isParamName(str: string, flowchart: any): boolean {
        for (const prod of flowchart.nodes[0].procedure) {
            if (prod.type === ProcedureTypes.Constant && (prod.args[0].value === str || prod.args[0].jsValue === str)) {
                return true;
            }
        }
        return false;
    }



    executeFlowchart() {
        let globalVars = '';
        const constantList = {};

        // console.log(this.extractAnswerList(this.dataService.flowchart))

        // reordering the flowchart
        if (!this.dataService.flowchart.ordered) {
            FlowchartUtils.orderNodes(this.dataService.flowchart);
        }

        // get the javascript string of all imported functions
        const funcStrings = {};
        for (const func of this.dataService.flowchart.functions) {
            funcStrings[func.name] =  CodeUtils.getFunctionString(func);
        }
        if (this.dataService.flowchart.subFunctions) {
            for (const func of this.dataService.flowchart.subFunctions) {
                funcStrings[func.name] =  CodeUtils.getFunctionString(func);
            }
        }

        // execute based on the current url:
        // _ for "/flowchart" & "/editor": execute the whole flowchart if the whole flowchart is not executed before,
        //                                 then execute only start node + nodes that are modified after the last execute
        //                                 and their downstream nodes.
        // _ for all other url           : execute the whole flowchart
        let executeSet: any;
        let currentUrl = this.router.url;
        if (currentUrl) {
            currentUrl = currentUrl.split('?')[0];
        } else {
            currentUrl = '/editor';
        }
        if (!this.dataService.flowchart.nodes[0].model || this.dataService.numModifiedNode() === 0
            || (currentUrl !== '/flowchart' && currentUrl !== '/editor')) {
            executeSet = new Set(this.dataService.flowchart.nodes.keys());
        } else {
            executeSet = this.dataService.getExecutableNodes();
            this.dataService.clearModifiedNode();
        }
        for (let i = 0; i < this.dataService.flowchart.nodes.length; i++) {
            if (executeSet.has(i)) {
                this.dataService.flowchart.nodes[i].hasExecuted = false;
            } else {
                this.dataService.flowchart.nodes[i].hasExecuted = true;
            }
        }

        const nodeIndices = {};
        // execute each node
        for (let i = 0; i < this.dataService.flowchart.nodes.length; i++) {
            const node = this.dataService.flowchart.nodes[i];

            // if disabled node -> continue
            if (!node.enabled) {
                node.output.value = undefined;
                continue;
            }
            nodeIndices[node.id] = i;

            // if the node is not to be executed
            if (!executeSet.has(i)) {
                let exCheck = false;
                for (const edge of node.output.edges) {
                    if (!edge.target.parentNode.hasExecuted) {
                        exCheck = true;
                    }
                }
                if (exCheck) {
                    node.output.value = _parameterTypes.newFn();
                    node.output.value.debug = this.dataService.mobiusSettings.debug;
                    node.output.value.setData(JSON.parse(node.model));
                }
                continue;
            }
            // execute valid node
            globalVars = this.executeNode(node, funcStrings, globalVars, constantList, nodeIndices);
        }

        // delete each node.output.value to save memory
        for (const node of this.dataService.flowchart.nodes) {
            if (node.type === 'end') {
                if (node.procedure[node.procedure.length - 1].args[1].jsValue) {
                    continue;
                } else {
                    delete node.output.value;
                }
            } else {
                delete node.output.value;
            }
        }

        this.dataOutputService.resetIModel();
        document.getElementById('spinner-off').click();
        const category = this.isDev ? 'dev' : 'execute';
        this.googleAnalyticsService.trackEvent(category, 'successful', 'click', performance.now() - this.startTime);
        console.log('total execute time:', (performance.now() - this.startTime) / 1000, 'sec');
    }


    executeNode(node: INode, funcStrings, globalVars, constantList, nodeIndices): string {
        const params = {
            'currentProcedure': [''],
            'console': this.dataService.getLog(),
            'constants': constantList,
            'fileName': this.dataService.flowchart.name,
            'message': null,
            'terminated': false
        };

        if (node.hasError){
            document.getElementById('Console').click();
            this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; style="color:red">Error: Invalid Argument ' +
                                    'detected. Check marked node(s) and procedure(s)!</h5>');
            document.getElementById('spinner-off').click();
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            const _category = this.isDev ? 'dev' : 'execute';
            this.googleAnalyticsService.trackEvent(_category, `error: Reserved Word Argument`,
                'click', performance.now() - this.startTime);
            throw new Error('Reserved Word Argument');
        }
        // const consoleLength = params.console.length;

        let fnString = '';
        const startTime = performance.now();
        try {
            if (this.terminated) {
                this.dataService.notifyMessage(`PROCESS TERMINATED IN NODE: "${this.terminated}"`);
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                node.model = undefined;
                return;
            }
            const usedFuncs: string[] = [];
            const codeResult = CodeUtils.getNodeCode(node, true, nodeIndices, undefined, undefined, usedFuncs);
            const usedFuncsSet = new Set(usedFuncs);
            // if process is terminated, return
            if (codeResult[1]) {
                this.dataService.notifyMessage(`PROCESS TERMINATED IN NODE: "${codeResult[1]}"`);
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                if (!codeResult[0]) {
                    node.model = undefined;
                    return;
                }
            }

            const codeRes = codeResult[0];
            const nodeCode = codeRes[0].join('\n').split('_-_-_+_-_-_');
            const varsDefined = codeRes[1];

            // Create function string:
            // start with asembling the node's code
            fnString =  '\n\n//  ------------ MAIN CODE ------------\n' +
                        nodeCode[0] +
                        '\nfunction __main_node_code__(){\n' +
                        nodeCode[1] +
                        '\n}\nreturn __main_node_code__();';

            // add the user defined functions that are used in the node
            const addedFunc = new Set([]);
            usedFuncsSet.forEach((funcName) => {
                for (const otherFunc in funcStrings) {
                    if (!addedFunc.has(otherFunc) && otherFunc.substring(0, funcName.length) === funcName) {
                        addedFunc.add(otherFunc);
                        fnString =  `\n// ------ GLOBAL FUNCTION: ${otherFunc} ------\n\n` + funcStrings[otherFunc] + fnString;
                    }
                }
            });

            // add the constants from the start node and the predefined constants/functions (e.g. PI, sqrt, ...)
            fnString = _varString + globalVars + fnString;

            // add the merge input function and the print function
            fnString = `\nconst __debug__ = ${this.dataService.mobiusSettings.debug};` +
                        '\n\n// ------ MERGE INPUTS FUNCTION ------' + mergeInputsFunc +
                        '\n\n// ------ PRINT FUNCTION ------' + printFunc +
                        `\n\n// ------ FUNCTION FOR PYTHON STYLE LIST ------` + pythonList +
                        '\n\n// ------ CONSTANTS ------' + fnString;

            // ==> generated code structure:
            //  1. pythonList + mergeInputFunction + printFunc
            //  2. constants
            //  3. user functions
            //  4. main node code

            // print the code
            this.dataService.log(`<h3  style="padding: 10px 0px 2px 0px;">Executing node: ${node.name}</h3>`);
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

            params['model'] = node.input.value;
            // console.log(node.input.value)
            // _parameterTypes.mergeFn(params['model'], node.input.value);
            params['model'].debug = this.dataService.mobiusSettings.debug;

            // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)

            // #########################################################
            // *********************************************************
            // console.log(fnString);

            const fn = new Function('__modules__', '__params__', fnString);
            // execute the function
            const result = fn(Modules, params);
            if (params['terminated']) {
                this.terminated = node.name;
                this.dataService.notifyMessage(`PROCESS TERMINATED IN NODE: "${this.terminated}"`);
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            }

            if (params.message && !this.triggerCheck) {
                this.triggerCheck = true;
                this.dataService.notifyMessage(params.message.replace('%node%', node.name));
            }

            for (const v of varsDefined) {
                if (window.hasOwnProperty(v)) {
                    delete window[v];
                    if (prevWindowVar[v]) {
                        window[v] = prevWindowVar[v];
                    }
                }
            }

            if (node.type === 'end') {
                node.output.value = result;
            } else {
                node.output.value = params['model'];
            }

            // mark the node as has been executed
            node.hasExecuted = true;

            // check all the input nodes of this node, if all of their children nodes are all executed,
            // change their output.value to null to preserve memory space.
            node.input.edges.forEach( edge => {
                const inputNode = edge.source.parentNode;
                if (inputNode.output.edges.length > 1) {
                    for (const outputEdge of inputNode.output.edges) {
                        if (!outputEdge.target.parentNode.hasExecuted) { return; }
                    }
                }
                inputNode.output.value = null;
            });

            // if start node ->
            if (node.type === 'start') {
                for (const constant in params['constants']) {
                    if (params['constants'].hasOwnProperty(constant)) {
                        const constString = JSON.stringify(params['constants'][constant]);
                        globalVars += `const ${constant} = ${constString};\n`;
                        constantList[constant] = params['constants'][constant];
                    }
                }
                globalVars += '\n';
                // node.model = params['model'].getData();
            } else {
                // node.model = diff(node.input.value.getData(), params['model'].getData());
            }
            node.model = JSON.stringify(params['model'].getData());
            node.input.value = null;

            const endTime = performance.now();
            const duration: number = Math.round(endTime - startTime);
            let duration_msg: string;
            if (duration < 1000)  {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;"><i>Executed in ' + duration + ' milliseconds.</i></p>';
            } else {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;"><i>Executed in ' + duration / 1000 + ' seconds.</i></p>';
            }
            this.dataService.log(duration_msg);
            this.dataService.log('<br>');
            if (codeResult[1]) {
                this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; color:red;">PROCESS TERMINATED</h4>');
            }
            return globalVars;
        } catch (ex) {
            // for (const str of params.console) {
            //     this.dataService.log(str);
            // }
            document.getElementById('spinner-off').click();
            const endTime = performance.now();
            const duration: number = Math.round(endTime - startTime);
            let duration_msg: string;
            if (duration < 1000)  {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;""><i>Executed in ' + duration + ' milliseconds.</i></p>';
            } else {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;""><i>Executed in ' + duration / 1000 + ' seconds.</i></p>';
            }
            this.dataService.log(duration_msg);
            this.dataService.log('<br>');
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
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
            let localFunc: string;
            const markError = function(prod: IProcedure, id: string, localFuncProd = null) {
                if (prod['ID'] && id && prod['ID'] === id) {
                    prod.hasError = true;
                    if (localFuncProd) {
                        localFunc = localFuncProd.args[0].value;
                        localFuncProd.hasError = true;
                    }
                }
                if (prod.children) {
                    prod.children.map(function(p) {
                        markError(p, id, localFuncProd);
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
                node.localFunc.map(function(prod: IProcedure) {
                    if (prod['ID'] === prodWithError) {
                        prod.hasError = true;
                        localFunc = prod.args[0].value;
                    }
                    if (prod.children) {
                        prod.children.map(function(p) {
                            markError(p, prodWithError, prod);
                        });
                    }
                });
                if (localFunc) {
                    this.dataService.notifyMessage(`Error in local function "${localFunc}" of node "${node.name}"`);
                } else {
                    this.dataService.notifyMessage(`Error in main code of node "${node.name}"`);
                }
            }
            if (ex.toString().slice(0, 11) === 'Error: ____') {
                ex.message = ex.toString().slice(11);
            } else if (ex.toString().indexOf('Unexpected identifier') > -1) {
                ex.message = 'Unexpected Identifier error. Did you declare everything?' +
                             'Check that your strings are enclosed in quotes (")';
            } else if (ex.toString().indexOf('Unexpected token') > -1 || ex.toString().indexOf('unexpected token') > -1) {
                ex.message = 'Unable to compile code. Check code order and arguments.';
            } else if (ex.toString().indexOf('\'readAsText\' on \'FileReader\'') > -1) {
                ex.message = 'Unable to read file input. Check all start node inputs.';
            } else if (ex.toString().indexOf('Cannot read property \'splice\'') > -1) {
                ex.message = 'Unrecognized or missing variable in the procedure.';
            }
            document.getElementById('Console').click();
            this.dataService.log(`<h4 style="padding: 2px 0px 2px 0px; color:red;">Error: ${ex.message}</h4>`);
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
