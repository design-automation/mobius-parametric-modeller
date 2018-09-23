import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { CodeUtils } from '@models/code';
import { INode } from '@models/node';

import * as Modules from '@modules';


@Component({
  selector: 'execute',
  template: `<button class="btn--execute" 
                    (click)="execute($event)">
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

    execute($event): void {
        // order the nodes based on edges array

        // for each node,
        // get code
        // execute node
        // update dependent nodes
        this.flowchart.nodes.map((node: INode) => {

            try{

                //new Function ([arg1[, arg2[, ...argN]],] functionBody)
                const fn = new Function('__MODULES__', CodeUtils.getNodeCode(node));
                let results = fn(Modules);
                node.outputs.map( (oup) => {
                    oup.value = results[oup.name];
                });
                
            }
            catch(ex){
                console.warn(`${node.name} errored`);
            }
            
        });

    }
}