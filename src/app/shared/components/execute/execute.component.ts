import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { CodeUtils } from '@models/code';
import { INode } from '@models/node';
import { IProcedure } from '@models/procedure';
import { IEdge } from '@models/edge';

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
					if( !node.enabled ){ // or hasFnOutput  
						// do nothing
						executed.push(index);
					}
					else{

						let flag = true;
						let inputs = node.inputs;
						for(let i=0; i < inputs.length; i++){
							let inp = inputs[i];

							if(inp.value && inp.value["port"] /*&& !inp.isFunction() */){
								flag = false;
								break;
							}
						}

						if(flag){
                            console.log(`${node.name} executing...`);
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
        let prodArr: string[] = [''];
        try{
            //new Function ([arg1[, arg2[, ...argN]],] functionBody)
            const fn = new Function('__MODULES__', '__PRODARR__', CodeUtils.getNodeCode(node));
            let results = fn(Modules, prodArr);
            node.outputs.map( (oup) => {
                if (typeof results[oup.name] === 'number' || results[oup.name] === undefined){
                    oup.value = results[oup.name];
                } else if (typeof results[oup.name] === 'string'){
                    oup.value = '"' + results[oup.name] + '"';
                } else if (results[oup.name].constructor === [].constructor){
                    oup.value = '[' + results[oup.name] + ']';
                } else if (results[oup.name].constructor === {}.constructor) {
                    oup.value = JSON.stringify(results[oup.name]);
                } else {
                    oup.value = results[oup.name];
                }
            });
            
        }
        catch(ex){
            node.hasError = true;
            //console.warn(`${node.name} errored`);

            // Unexpected Identifier
            // Unexpected token
            let prodWithError: string = prodArr[0]; 
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

    updateDependentInputs(node: INode, originalRank: number): void{

		let selectedEdges: IEdge[] = this.flowchart.edges.filter(function(edge){
			return edge.target[0] == originalRank;
		});

		for( let e=0;  e < selectedEdges.length; e++ ){

			let edge: IEdge = selectedEdges[e];
			let inputNode: INode = this.flowchart.nodes[ edge.source[0] ];

			// set computed value of port
			// should this be from within the node?
			let outputPort =  node.outputs[ edge.target[1] ];
			let inputPort = inputNode.inputs[ edge.source[1] ];


			inputPort.value =  JSON.parse(JSON.stringify( outputPort.value )) ;

		}
	}
}
