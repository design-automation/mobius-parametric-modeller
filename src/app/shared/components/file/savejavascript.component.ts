import { Component} from '@angular/core';
import * as circularJSON from 'circular-json';
import { IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import { ProcedureTypes, IFunction } from '@models/procedure';
import { IdGenerator } from '@utils';
import { IArgument, CodeUtils } from '@models/code';

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
            name: funcName,
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

        fnString = fnString + 'const __params__ = {};\n__params__["model"]= module.';

        console.log(fnString);

        // const blob = new Blob([fileString], {type: 'application/json'});

        // DownloadUtils.downloadFile(fname, blob);
    }

}
