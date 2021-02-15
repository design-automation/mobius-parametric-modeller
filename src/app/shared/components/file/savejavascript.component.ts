import { Component} from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import { ProcedureTypes, IFunction } from '@models/procedure';
import { IdGenerator } from '@utils';
import { IArgument } from '@models/code';
import { DownloadUtils } from './download.utils';
// import {js as beautify} from 'js-beautify';
import { mergeInputsFunc, printFuncString, pythonListFunc, ExecuteComponent } from '../execute/execute.component';
import { InputType } from '@models/port';
import { CodeUtils } from '@shared/components/execute/code.util';
import { _varString } from '@assets/core/modules';

@Component({
  selector: 'javascript-save',
  template:  `<button id='savejavascript' class='btn' (click)='download()'>Save</button>`,
  styles: [
            `
            button.btn{
                margin: 0px 0px 0px 0px;
                font-size: 10px;
                line-height: 12px;
                border: 2px solid gray;
                border-radius: 4px;
                padding: 2px 5px;
                background-color: #3F4651;
                color: #E7BF00;
                font-weight: 600;
                text-transform: uppercase;
             }
            button.btn:hover{
                background-color: gray;
                color: white;
            }
             `
          ]
})
// component for saving the javascript code to hard disk
export class SaveJavascriptComponent {

    constructor(private dataService: DataService) {}

    async download() {
        const fl = this.dataService.flowchart;

        // create function and documentation of the function
        let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
        if (funcName.match(/^[\d_]/)) {
            funcName = 'func' + funcName;
        }
        const func: IFunction = <IFunction>{
            flowchart: <IFlowchart>{
                id: fl.id ? fl.id : IdGenerator.getId(),
                name: fl.name,
                nodes: fl.nodes,
                edges: fl.edges
            },
            name: 'exec_' + funcName,
            module: 'globalFunc',
            doc: null,
            importedFile: ''
        };

        func.args = [];
        let argString = ``;
        for (const prod of fl.nodes[0].procedure) {
            if (!prod.enabled || prod.type !== ProcedureTypes.Constant) { continue; }
            let v: string = prod.args[prod.argCount - 2].value || 'undefined';
            if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
            const arg = <IArgument>{
                name: v,
                value: prod.args[prod.argCount - 1].value,
                type: prod.meta.inputMode,
            };
            func.args.push(arg);
            if (prod.meta.inputMode === InputType.Slider) {
                arg.min = prod.args[1].min;
                arg.max = prod.args[1].max;
                arg.step = prod.args[1].step;
            }
            argString += '// Parameter: ' + JSON.stringify(arg) + '\n';
        }
        func.argCount = func.args.length;

        const end = fl.nodes[fl.nodes.length - 1];
        const returnProd = end.procedure[end.procedure.length - 1];
        if (returnProd.args[1].value) {
            func.hasReturn = true;
        } else {
            func.hasReturn = false;
        }

        // for (const node of func.flowchart.nodes) {
        //     await  ExecuteComponent.resolveImportedUrl(node, false, node.type === 'start');
        // }
        let fnString = CodeUtils.getFunctionString(func);

        for (const i of fl.functions) {
            // for (const node of i.flowchart.nodes) {
            //     await  ExecuteComponent.resolveImportedUrl(node, false, node.type === 'start');
            // }
            const nFunc = <IFunction> {
                module: i.module,
                name: func.name + '_' + i.name,
                argCount: i.argCount,
                hasReturn: i.hasReturn,
                args: i.args,
                flowchart: i.flowchart
            };
            fnString = CodeUtils.getFunctionString(nFunc) + fnString;
        }
        if (fl.subFunctions) {
            for (const i of fl.subFunctions) {
                // for (const node of i.flowchart.nodes) {
                //     await  ExecuteComponent.resolveImportedUrl(node, false, node.type === 'start');
                // }
                const nFunc = <IFunction> {
                    module: i.module,
                    name: func.name + '_' + i.name,
                    argCount: i.argCount,
                    hasReturn: i.hasReturn,
                    args: i.args,
                    flowchart: i.flowchart
                };
                fnString = CodeUtils.getFunctionString(nFunc) + fnString;
            }
        }

        if (this.dataService.mobiusSettings.debug === undefined) { this.dataService.mobiusSettings.debug = true; }

        fnString =
            `/**\n * to use this code: import ${funcName} from this js file as well as the GI module\n` +
            ` * run ${funcName} with the GI module as input along with other start node input\n` +
            ` * e.g.:\n` +
            ` * const ${funcName} = require('./${funcName}.js').${funcName}\n` +
            ` * const module = require('gi-module')\n` +
            ` * const result = await ${funcName}(module, start_input_1, start_input_2, ...);\n *\n` +
            ` * returns: a json object:\n` +
            ` *   _ result.model -> gi model of the flowchart\n` +
            ` *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value,` +
            ` result.result is the model of the flowchart\n */\n\n` +
            argString.replace(/\\/g, '\\\\') +  '\n\n' +
            `async function ${funcName}(__modules__` + func.args.map(arg => ', ' + arg.name).join('') + `) {\n\n` +
            `var __debug__ = ${this.dataService.mobiusSettings.debug};\n` +
            `var __model__ = null;\n` +
            '/** * **/' +
            '\nvar ' + _varString.split(';\n').join(';\nvar ') + `\n\n` +
            fnString +
            pythonListFunc +
            mergeInputsFunc +
            printFuncString +
            `\n\nconst __params__ = {};\n` +
            `__params__["model"] = __modules__._model.__new__();\n` +
            `if (__model__) {\n` +
            `__modules__.io._importGI(__params__["model"], __model__);\n` +
            `}\n` +
            `__params__["model"].debug = __debug__;\n` +
            `__params__["console"] = [];\n` +
            `__params__["modules"] = __modules__;\n` +
            `__params__["curr_ss"] = {};\n` +
            `const result = await exec_${funcName}(__params__` +
            func.args.map(arg => ', ' + arg.name).join('') +
            `);\n` +
            `if (result === __params__.model) { return { "model": __params__.model, "result": null };}\n` +
            `return {"model": __params__.model, "result": result};\n` +
            '/** * **/' +
            `\n\n}\n\n` +
            `module.exports = ${funcName};\n`;

        // fnString = beautify(fnString, { indent_size: 4, space_in_empty_paren: true });
        const blob = new Blob([fnString], {type: 'application/json'});

        DownloadUtils.downloadFile(funcName + '.js', blob);
    }

}
