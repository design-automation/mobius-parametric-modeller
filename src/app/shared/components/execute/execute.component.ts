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

        let all_nodes = this.flowchart.nodes;
        let executed = [];
        
		while(executed.length < all_nodes.length){
			for(let index=0; index < all_nodes.length; index++){

				let node = all_nodes[index];
				if(executed.indexOf(index) > -1){
					//do nothing
				}
				else{

					// check if all inputs have valid inputs
					// if yes, execute add to executed
					// if no, set flag to true 
					// check status of the node; don't rerun
					if( !node.enabled /* or hasFnOutput */ ){
						// do nothing
						executed.push(index);
					}
					else{

						let flag = true;
						let inputs = node.getInputs();
						for(let i=0; i < inputs.length; i++){
							let inp = inputs[i];

							if(inp.getValue() && inp.getValue()["port"] && !inp.isFunction()){
								flag = false;
								break;
							}
						}

						if(flag){
                            console.log(`${node.getName()} executing...`);
                            this.executeNode(node);
							this.updateDependentInputs(node, index); 
							executed.push(index);
						}

					}
				}
			} 
		}

    }

    executeNode(node: INode): void{
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
    }

    updateDependentInputs(node: INode, originalRank: number): void{

		let selectedEdges: IEdge[] = this.flowchart.edges.filter(function(edge){
			return edge.output_address[0] == originalRank;
		});

		for( let e=0;  e < selectedEdges.length; e++ ){

			let edge: IEdge = selectedEdges[e];
			let inputNode: INode = this.flowchart.nodes[ edge.input_address[0] ];

			// set computed value of port
			// should this be from within the node?
			let outputPort =  node.outputs[ edge.output_address[1] ];
			let inputPort = inputNode.inputs[ edge.input_address[1] ];


			inputPort.value =  JSON.parse(JSON.stringify( outputPort.value )) ;

		}
	}
}