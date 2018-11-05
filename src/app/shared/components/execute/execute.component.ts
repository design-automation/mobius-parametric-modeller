import { Component, Input } from '@angular/core';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { CodeUtils } from '@models/code';
import { INode } from '@models/node';
import { IProcedure } from '@models/procedure';
import { IEdge } from '@models/edge';

import * as Modules from '@modules';


@Component({
  selector: 'execute',
  template: `<button class="btn--execute" 
                    (click)="execute()">
                Execute
             </button>`,
  styles: [ 
            `.btn--execute{ 
                font-size: 14px;
                line-height: 18px;
                border: 3px solid #E0C229;
                border-radius: 4px;
                padding: 2px 10px;
                background-color: #E0C229; 
                color: #494D59;
                font-weight: 600;
                text-transform: uppercase;
              }` 
          ]
})
export class ExecuteComponent {

    @Input() flowchart: IFlowchart;
    private globalVars: string;

    async execute() {
        this.globalVars = '';
        for (let node of this.flowchart.nodes){
            if (node.type != 'start'){
                if (node.input.edges){
                    node.input.value = undefined;
                }
            }
        }
        if (!this.flowchart.ordered){
            FlowchartUtils.orderNodes(this.flowchart);
        }
        let funcStrings = {};
        for (let func of this.flowchart.functions){
            funcStrings[func.name] = await CodeUtils.getFunctionString(func);
        }
        for (let node of this.flowchart.nodes){
            if (!node.enabled) {
                node.output.value = undefined;
                continue;
            }
            //console.log(`${node.name} executing...`);
            await this.executeNode(node, funcStrings);
        }
    }

    async executeNode(node: INode, funcStrings){
        let params = {"currentProcedure": ['']};
        try{
            var fnString = await CodeUtils.getNodeCode(node, true);
            fnString = this.globalVars + fnString;
            params["model"] = node.input.value;
            var hasFunctions = false;
            for (let funcName in funcStrings){
                fnString = funcStrings[funcName] + fnString;
                hasFunctions = true;
            }
            if (hasFunctions){
                let mergeString = CodeUtils.mergeInputs.toString();
                fnString = 'function mergeInputs' + mergeString.substring(9, mergeString.length) +'\n\n' + fnString;
            }
            console.log(`/*    ${node.name.toUpperCase()}    */\n\n`+fnString);
            //new Function ([arg1[, arg2[, ...argN]],] functionBody)
            const fn = new Function('__modules__', '__params__', fnString);
            let result = fn(Modules, params);
            node.output.value = result;
            if (node.type == 'start'){
                for (let constant in params["constants"]){
                    this.globalVars += `const ${constant} = ${params["constants"][constant]};\n`;
                }
                this.globalVars += '\n';
            }
        }
        catch(ex){
            node.hasError = true;
            //console.warn(`${node.name} errored`);

            // Unexpected Identifier
            // Unexpected token
            let prodWithError: string = params["currentProcedure"][0]; 
            let markError = function(prod: IProcedure, id: string){
                if(prod["ID"] && id && prod["ID"] == id){
                    prod.hasError = true;
                }
                if(prod.hasOwnProperty('children')){
                    prod.children.map(function(p){
                        markError(p, id);
                    });
                }
            }
            if(prodWithError != ''){
                node.procedure.map(function(prod: IProcedure){
                    if(prod["ID"] == prodWithError){
                        prod.hasError = true;
                    }
                    if(prod.hasOwnProperty('children')){
                        prod.children.map(function(p){
                            markError(p, prodWithError);
                        })
                    }
                });
            }
            let error: Error;
            if(ex.toString().indexOf("Unexpected identifier") > -1){
                error = new Error("Unexpected Identifier error. Did you declare everything? Check that your strings are enclosed in quotes (\")");
            }
            else if(ex.toString().indexOf("Unexpected token") > -1){
                error = new Error("Unexpected token error. Check for stray spaces or reserved keywords?");
            }
            else{
                 error = new Error(ex);
            }
            throw error;
            
        }
    }

}
