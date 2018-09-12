import { IFlowchart } from './flowchart.interface';
import { Flowchart } from './flowchart.model';
import { FlowchartConnectionUtils } from './flowchartconnection.utils'
import { IGraphNode, IEdge, GraphNode, NodeUtils } from '../node/NodeModule';
import { ICodeGenerator, IModule } from '../code/CodeModule';
import { InputPort, PortTypes } from '../port/PortModule';

export class FlowchartUtils{	


	// === General Util Functions
	public static get_new_node_name(flowchart: IFlowchart, prefix?: string): string{
		let default_node_name: string = prefix + (flowchart.nodes.length + 1);
		return default_node_name;
	}

	public static get_node_idx(flowchart: IFlowchart, uuid: string): number{
		
		let nodes: IGraphNode[] = flowchart.nodes;
		let idx: number = undefined;
		for(let i=0; i< nodes.length; i++){
			if(nodes[i].id == uuid){
				idx = i;
				break;
			}
		}

		return idx;
	}

	// 
	// =========
	// Node Add/Delete
	// 

	//
	// Adds a new node
	//
	public static add_node(flowchart: IFlowchart){
		let new_node = new GraphNode();
		new_node.name = FlowchartUtils.get_new_node_name(flowchart, "node");
		NodeUtils.add_port(new_node, PortTypes.Input); 
		NodeUtils.add_port(new_node, PortTypes.Output);

		flowchart.nodes.push(new_node);

		return flowchart;
	}

	//
	// Deletes a node
	//
	public static delete_node(flowchart: IFlowchart, uuid: string): IFlowchart{

		// get node_index of the uuid
		let node_index: number = FlowchartUtils.get_node_idx(flowchart, uuid);
		if (node_index == undefined) throw Error("Node not found");

		// disconnect the node and set all port values to undefined
		FlowchartConnectionUtils.disconnect_node(flowchart, node_index);
		flowchart.nodes.splice(node_index, 1);


		/*compute redundant edges in the node and delete the edges
  		let redundant_edges = FlowchartConnectionUtils.edges_with_node(flowchart, node_index);
  		flowchart = FlowchartUtils.delete_edges(flowchart, redundant_edges);*/

  		// todo: clean this up!
  		for(let e=0; e < flowchart.edges.length; e++){
			let edge = flowchart.edges[e];

			let input_node = edge.input_address[0];
			let output_node = edge.output_address[0];

			if(input_node == node_index || output_node == node_index){
				FlowchartUtils.delete_edge(flowchart, e);
			}
			
			if(input_node > node_index){
				edge.input_address[0] = input_node - 1;
			}
			
			if(output_node > node_index){
				edge.output_address[0] = output_node - 1;
			}

		}

  		return flowchart;
	}

	public static delete_port(flowchart: IFlowchart, type: string, portIndex: number, nodeIndex: number): void{
		FlowchartUtils.disconnect_port(flowchart, type, portIndex, nodeIndex);
		NodeUtils.delete_port_by_index(flowchart.nodes[nodeIndex], type, portIndex);
	}

	// ========== Disconnect ports
	public static disconnect_port(flowchart: IFlowchart, type: string, portIndex: number, nodeIndex: number): IFlowchart{
	  let edges = flowchart.edges;

	  /// disconnect the edges related to this port
	  let edgesArr: number[] = FlowchartConnectionUtils.disconnect_edges_with_port_idx(flowchart, nodeIndex, portIndex, type); 
	  FlowchartUtils.delete_edges(flowchart, edgesArr);

	  /// update indices of edges
	  /// delete port
	  for(let e=0; e < edges.length; e++){

	      let input_node: number = edges[e].input_address[0];
	      let input_port: number = edges[e].input_address[1];

	      if(type == "input"){
	         let input_node: number = edges[e].input_address[0];
	         let input_port: number = edges[e].input_address[1];

	          if(input_node == nodeIndex && input_port >= portIndex){
	            edges[e].input_address[1] = edges[e].input_address[1] - 1;
	          }
	      }
	      else if(type == "output"){
	         let output_node: number = edges[e].output_address[0];
	         let output_port: number = edges[e].output_address[1];

	          if(output_node == nodeIndex && output_port >= portIndex){
	            edges[e].output_address[1] = edges[e].output_address[1] - 1;
	          }
	      }
	      else{
	         console.warn("reached 358");
	      }
	  }

	  return flowchart;
	}



	// 
	// =============== 
	// Edge related
	// 
	// 

	//
  	// Adds an edge between two ports
  	//
	public static add_edge(flowchart: IFlowchart, outputAddress: number[], inputAddress: number[]): IFlowchart{

		if(outputAddress.length !== 2 || inputAddress.length !== 2){
			throw Error("Invalid arguments for edge");
		}

		console.log(`Edge created`);

		let oNode = flowchart.nodes[outputAddress[0]];
     	let iNode = flowchart.nodes[inputAddress[0]];

     	// dont remove previous edges for outputs
		let output = oNode.outputs[outputAddress[1]];
		let input = iNode.inputs[inputAddress[1]];

      	if (input.isConnected){
	        FlowchartUtils.delete_edges(flowchart, 
	        							FlowchartConnectionUtils.disconnect_edges_with_port_idx(flowchart, 
	        							inputAddress[0], inputAddress[1], "input"));
	    }

		if( !flowchart.nodes[outputAddress[0]].enabled ||  !flowchart.nodes[inputAddress[0]].enabled ){
			console.warn("Cannot connect to disabled nodes");
		}
		else{
			let edge: IEdge = { output_address: outputAddress, input_address: inputAddress };

			input.value = {port: outputAddress};
		    output.isConnected = true;
		    input.isConnected = true;
			

			// todo: check for valid input/output addresses and port address
			flowchart.edges.push(edge);
		}

		return flowchart;
	};


	//
	//	Deletes an edge by index number of the edges
	//	TODO: Overload
	//
	public static delete_edge(flowchart: IFlowchart, edgeIdx: number): IFlowchart{
		return FlowchartUtils.delete_edges(flowchart, [edgeIdx]);
	}


	//
	//	Deletes edges by arrya of indices
	//
	public static delete_edges(flowchart: IFlowchart, edgeIds: number[]): IFlowchart{

		flowchart.edges = flowchart.edges.filter(function(edge, index){
			return ( edgeIds.indexOf(index) == -1 );
		})

		return flowchart;
	}


	// ==== Execution related
	//
	// Updates dependent inputs of a node
	//
	public static update_dependent_inputs(flowchart: IFlowchart, node: IGraphNode, originalRank: number): void{

		let selectedEdges: IEdge[] = flowchart.edges.filter(function(edge){
			return edge.output_address[0] == originalRank;
		});

		for( let e=0;  e < selectedEdges.length; e++ ){

			let edge: IEdge = selectedEdges[e];
			let inputNode: IGraphNode = flowchart.nodes[edge.input_address[0]];

			// set computed value of port
			// should this be from within the node?
			let outputPort = node.outputs[edge.output_address[1]];
			let inputPort = inputNode.inputs[edge.input_address[1]];

			let outVal = outputPort.getValue();
			if(outVal && outVal.constructor.name == "Model"){
				console.error("Shouldn't be here")
				// let modelData: string = outVal.toJSON();
				// let model = new gs.Model(JSON.parse(modelData));
				// inputPort.setComputedValue( model );
			}
			else{
				inputPort.value = JSON.parse(JSON.stringify(outVal));
			}

		}
	}

	//
	//	Executes the flowchart
	//
	public static execute(flowchart: IFlowchart, code_generator: ICodeGenerator, modules: any, print: Function) :any{

		// set all nodes to status not executed
		// future: cache results and set status based on changes
		FlowchartUtils.reset(flowchart);

		let gld = [];
		for(let i=0; i < flowchart.globals.length; i++){
			let prop = flowchart.globals[i].getName();
			let value = flowchart.globals[i].getValue();
			gld.push({name: prop, value: value});
		}

		// sort nodes 
		let executed = [];
		while(executed.length < flowchart.nodes.length){

			for(let index=0; index < flowchart.nodes.length; index++){

				let node = flowchart.nodes[index];
				if(executed.indexOf(index) > -1){
					console.log(`${node.name} is already executed`);
				}
				else{

					console.log(`${node.name} is enabled: ${node.enabled}`);


					if( !node.enabled ){
						//
						//	If node is disabled, do nothing and add index of the node
						//	to the executed array
						//
						executed.push(index);
						console.log(`${node.name} is disabled, hence skipped}`);
					}
					else{

						//
						//	If node is enabled, check if all inputs are satisfied
						//
						let flag = true;
						let inputs = node.inputs;
						for(const inp of node.inputs){
							// input value contains reference to a port
							// mark flag as false, to revisit
							if(inp.value && inp.value["port"]){
								flag = false;
								console.log(`${node.name} is has unfulfilled values}`);
								break;
							}
						}

						// If all inputs are determined, 
						// execute the node
						if(flag){
							console.log(`${node.name} executing...`);
							let time1 = (new Date()).getTime();
							NodeUtils.execute_node(node, code_generator, modules, print, gld);
							FlowchartUtils.update_dependent_inputs(flowchart, node, index); 
							executed.push(index);
							let time2 = (new Date()).getTime();
							let time_taken = (time2 - time1)/1000;
							node.time_taken = time_taken;
							console.log(`${node.name} executed in ${time_taken}s`);
						}

					}
				}
			} 
		}

		return true;
	}

	//
	//	clears all the cached results
	//
	public static reset(flowchart: IFlowchart): void{
		for(let n=0; n < flowchart.nodes.length; n++){
			let node: IGraphNode = flowchart.nodes[n];
			node.reset();

			if(!node.enabled){
				FlowchartConnectionUtils.disconnect_node(flowchart, n);
			}
		}
	}

}
