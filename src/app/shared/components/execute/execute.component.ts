import { Component, Input } from '@angular/core';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { CodeUtils } from '@models/code';
import { INode } from '@models/node';
import { IProcedure } from '@models/procedure';

import * as Modules from '@modules';

const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
const mergeInputsFunc = `
function mergeInputs(models){
    let result = __modules__.Model.New();
    for (let model of models){
        __modules__.Model.Merge(result, model);
    }
    return result;
}
`;

@Component({
  selector: 'execute',
  /*
  template: `<button class="btn--execute"
                    (click)="execute()">
                Execute
             </button>`,
    */
   template: `<button class="btn" mat-icon-button title="Execute" (click)="execute()">
    <mat-icon>play_circle_outline</mat-icon>
    </button>
    `,
  styles: [
            `.btn--execute{
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                line-height: 18px;
                border: 3px solid #E0C229;
                border-radius: 4px;
                padding: 1px 10px;
                background-color: #E0C229;
                color: #494D59;
                font-weight: 600;
                text-transform: uppercase;
              }
              .btn{
                vertical-align: middle;
                background-color: transparent;
                border: none;
                color: rgb(80,80,80);
              }
              .btn:hover{
                color: blue;
              }`
          ]
})
export class ExecuteComponent {

    @Input() flowchart: IFlowchart;
    private globalVars: string;

    async execute(): Promise<any> {
        const p = new Promise(async (resolve) => {
            this.globalVars = '';

            // @ts-ignore
            console.logs = [];

            // reset input of all nodes except start
            for (const node of this.flowchart.nodes) {
                if (node.type !== 'start') {
                    if (node.input.edges) {
                        node.input.value = undefined;
                    }
                }
            }

            // order the flowchart
            if (!this.flowchart.ordered) {
                FlowchartUtils.orderNodes(this.flowchart);
            }

            // get the string of all imported functions
            const funcStrings = {};
            for (const func of this.flowchart.functions) {
                funcStrings[func.name] = await CodeUtils.getFunctionString(func);
            }

            // execute each node
            for (const node of this.flowchart.nodes) {
                if (!node.enabled) {
                    node.output.value = undefined;
                    continue;
                }
                await this.executeNode(node, funcStrings);
            }
            resolve('');
        });
        return p;


        /*
        this.globalVars = '';

        // @ts-ignore
        //console.logs = []

        // reset input of all nodes except start
        for (let node of this.flowchart.nodes){
            if (node.type != 'start'){
                if (node.input.edges){
                    node.input.value = undefined;
                }
            }
        }

        // order the flowchart
        if (!this.flowchart.ordered){
            FlowchartUtils.orderNodes(this.flowchart);
        }

        // get the string of all imported functions
        let funcStrings = {};
        for (let func of this.flowchart.functions){
            funcStrings[func.name] = await CodeUtils.getFunctionString(func);
        }

        // execute each node
        for (let node of this.flowchart.nodes){
            if (!node.enabled) {
                node.output.value = undefined;
                continue;
            }
            await this.executeNode(node, funcStrings);
        }
        */
    }

    async executeNode(node: INode, funcStrings) {
        const params = {'currentProcedure': ['']};
        try {
            // get the code for the node
            let fnString = await CodeUtils.getNodeCode(node, true);

            // add the constants from the start node
            fnString = this.globalVars + fnString;
            params['model'] = node.input.value;

            // add the imported functions code
            let hasFunctions = false;
            for (const funcName in funcStrings) {
                if (funcStrings.hasOwnProperty(funcName)) {
                    fnString = funcStrings[funcName] + fnString;
                    hasFunctions = true;
                }
            }
            if (hasFunctions) {
                fnString = mergeInputsFunc + '\n\n' + fnString;
            }

            console.log(`______________________________________________________________
            \n/*    ${node.name.toUpperCase()}    */
            \n` + fnString + `--------------------------\n`);
            // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)
            const fn = new Function('__modules__', '__params__', fnString);
            // execute the function
            const result = fn(Modules, params);
            node.output.value = result;
            if (node.type === 'start') {
                for (const constant in params['constants']) {
                    if (params['constants'].hasOwnProperty(constant)) {
                        const constString = JSON.stringify(params['constants'][constant]);
                        this.globalVars += `const ${constant} = ${constString};\n`;
                    }
                }
                this.globalVars += '\n';
            }
        } catch (ex) {
            node.hasError = true;
            // console.warn(`${node.name} errored`);

            // Unexpected Identifier
            // Unexpected token
            const prodWithError: string = params['currentProcedure'][0];
            const markError = function(prod: IProcedure, id: string) {
                if (prod['ID'] && id && prod['ID'] === id) {
                    prod.hasError = true;
                }
                if (prod.hasOwnProperty('children')) {
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
                    if (prod.hasOwnProperty('children')) {
                        prod.children.map(function(p) {
                            markError(p, prodWithError);
                        });
                    }
                });
            }
            let error: Error;
            if (ex.toString().indexOf('Unexpected identifier') > -1) {
                error = new Error('Unexpected Identifier error. Did you declare everything?' +
                    'Check that your strings are enclosed in quotes (")');
            } else if (ex.toString().indexOf('Unexpected token') > -1) {
                error = new Error('Unexpected token error. Check for stray spaces or reserved keywords?');
            } else {
                 error = new Error(ex);
            }
            throw error;

        }
    }

}
