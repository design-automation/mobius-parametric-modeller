import { Component} from '@angular/core';
import * as circularJSON from 'circular-json';
import { IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import { ProcedureTypes, IFunction } from '@models/procedure';
import { IdGenerator } from '@utils';
import { IArgument, CodeUtils } from '@models/code';
import { DownloadUtils } from './download.utils';
import { _varString } from '@assets/core/modules';
// const mergeInputsFunc = `
// function mergeInputs(__params__, models){
//     let result = __params__.modules._model.__new__();
//     for (let model of models){
//         __params__.modules._model.__merge__(result, model);
//     }
//     return result;
// }`;
const mergeInputsFunc = `
function mergeInputs(models){
    let result = __modules__._model.__new__();
    for (let model of models){
        __modules__._model.__merge__(result, model);
    }
    return result;
}`;

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
            module: 'Imported',
            doc: null,
            importedFile: ''
        };

        func.args = [];
        for (const prod of fl.nodes[0].procedure) {
            if (!prod.enabled || prod.type !== ProcedureTypes.Constant) { continue; }
            let v: string = prod.args[prod.argCount - 2].value || 'undefined';
            if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
            func.args.push(<IArgument>{
                name: v,
                value: prod.args[prod.argCount - 1].value,
                type: prod.meta.inputMode,
            });
        }
        func.argCount = func.args.length;

        const end = fl.nodes[fl.nodes.length - 1];
        const returnProd = end.procedure[end.procedure.length - 1];
        if (returnProd.args[1].value) {
            func.hasReturn = true;
        } else {
            func.hasReturn = false;
        }

        let fnString = CodeUtils.getFunctionString(func);

        for (const i of fl.functions) {
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

        fnString =
            `/**\n * to use this code: import ${funcName} from this js file as well as the GI module\n` +
            ` * run ${funcName} with the GI module as the only input\n` +
            ` * e.g.:\n` +
            ` * const ${funcName} = require('./${funcName}.js').${funcName}\n` +
            ` * const module = require('gi-module')\n` +
            ` * const result = ${funcName}(module);\n *\n` +
            ` * returns: a json object:` +
            ` *   _ result.model -> gi model of the flowchart\n` +
            ` *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value,` +
            ` result.result is the model of the flowchart\n */\n\n` +
            `function ${funcName}(__modules__` + func.args.map(arg => ', ' + arg.name).join('') + `) {\n\n` +
            _varString + `\n\n` +
            fnString +
            mergeInputsFunc +
            `\n\nconst __params__ = {};\n` +
            `__params__["model"]= __modules__._model.__new__();\n` +
            `__params__["modules"]= __modules__;\n` +
            `const result = exec_${funcName}(__params__` +
            func.args.map(arg => ', ' + arg.name).join('') +
            `)\n` +
            `return {"model": __params__.model, "result": result};\n}\n\n` +
            `module.exports = ${funcName};\n`;

        const blob = new Blob([fnString], {type: 'application/json'});

        DownloadUtils.downloadFile(funcName + '.js', blob);
    }

}
