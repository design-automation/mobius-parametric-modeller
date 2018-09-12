import {InputPort, OutputPort, InputPortTypes, PortTypes} from "../port/PortModule";
import {IGraphNode} from "./IGraphNode";
import {GraphNode} from "./GraphNode";
import {IProcedure, ProcedureTypes} from "../procedure/ProcedureModule";
import {ProcedureUtils} from '../procedure/ProcedureUtils';
import {ICodeGenerator, IModule} from "../code/CodeModule";

export abstract class NodeUtils{

	//
	//	Takes IGraphNode and creates an exact or duplicate
	//	Exact copy will have the same name and node ID (useful when loading from a file)
	//	Duplicates will have different names and node IDs (useful when duplicating or adding from library)
	//
	public static copy_node(node: IGraphNode, exact?: boolean): IGraphNode{

		let n: IGraphNode = new GraphNode();

		if(exact){
			// do nothing
			n.update_properties(node);
		}
		else{
			let id = n.id;
			n.update_properties(node);
			n.name = node.name +  Math.floor(Math.random()*100);
			n.id = id;
			n.position  = [ Math.floor(Math.random()*100), Math.floor(Math.random()*100) ];

			n.inputs.map((inp) => inp.value = ' ');
			n.outputs.map((out) => out.value = ' ');
		}

		return n;
	}	
 
	public static add_port(node: IGraphNode, type: PortTypes, name?: string): IGraphNode{
		let default_name = type.toString().substring(0, 3) + node[`${type}s`].length; 

		if( name !== undefined ){
			default_name = name;
		}

		let port: InputPort|OutputPort;
		if(type == PortTypes.Input){
			port = new InputPort(default_name);
		}
		else if(type == PortTypes.Output){
			port = new OutputPort(default_name);
		}
		else{
			throw Error("Unrecognised Port Type");
		}

		node[`${type}s`].push(port);
		node.type = undefined;
		
		return node;
	}

	public static delete_port(node: IGraphNode, port: any): IGraphNode{

		let prop = "";

		if ( port instanceof InputPort ){
			prop = "inputs";
		}
		else if( port instanceof OutputPort ){
			prop = "outputs";
		}
		else{
			throw Error("Invalid Port Type");
		}

		for (const [idx, p] of node[prop].entries()) {
		  	if(p.id === port.id){
				node[prop].splice(idx, 1);
				break;
			}
		}

		return node;
	}

	public static delete_port_by_index(node: IGraphNode, type: string, port_index: number): IGraphNode{
		node[type].splice(port_index, 1);
		node.type = undefined;
		return node;
	}


	//
	//	Adds a given procedure line as child of active procedure 
	//	If there is no active procedure, adds it to the node procedure
	//
	public static add_procedure(node: IGraphNode, procedure: IProcedure): IGraphNode{
      	try{
			let active_procedure: IProcedure = node.active_procedure;

			// TODO: Validate postioning of ElseIf / Else
			// ElseIf / Else can only be placed after an If / ElseIf

			if(active_procedure){

				//
				// If the active procedure is an If or ElseIf
				// and the next procedure being added is ElseIf / Else
				// the next procedure should be a sibling of the active procedure
				//
				let if_else_conditional: boolean = (active_procedure.type == ProcedureTypes.IfControl || active_procedure.type == ProcedureTypes.ElseIfControl)
						&& (procedure.type == ProcedureTypes .ElseControl || procedure.type == ProcedureTypes.ElseIfControl);

				
				// Check if the if-else conditional is true or the active procedure can't have children
				if( if_else_conditional || !active_procedure.hasChildren ){
			       if(active_procedure.parent){
			           let parent: IProcedure = active_procedure.parent;
			           let position: number = ProcedureUtils.get_child_position(parent, active_procedure);
			           ProcedureUtils.add_child_at_position(parent, procedure, position+1);
			       }
			       else{
			       	   let position: number = NodeUtils.get_child_position(node, active_procedure);
			           NodeUtils.add_procedure_at_position(node, procedure, position + 1);
			       }
				}
				else{
			    	active_procedure = ProcedureUtils.add_child(active_procedure, procedure);
				}
			}
			else{
				node.procedure.push(procedure);
			}

	      	node.active_procedure = procedure;
      	}
      	catch(ex){
      		console.log(`Error adding procedure type ${procedure.type} to node ${node.name}`);
      	}

      	// TODO: Lint the Node

		return node;
	}

	public static add_procedure_at_position(node: IGraphNode, procedure: IProcedure, index: number): IGraphNode{
		node.type = undefined;
		node.procedure.splice(index, 0, procedure);
		procedure.parent = undefined;
		return node;
	}

	public static get_child_position(node: IGraphNode, procedure: IProcedure): number{
		let index: number = 0;
		for(const prod of node.procedure){
			if (prod.id === procedure.id){
				return index;
			}
			index++;
		}

		return -1;
	}

	//
	// Deletes the active procedure in a node
	//
	public static delete_procedure(node, prod_to_delete?: IProcedure): IGraphNode{
		
		if(!node.active_procedure && prod_to_delete == undefined){
			console.warn("Delete procedure called without active or procedure to delete");
			return;
		}

		if(prod_to_delete == undefined){
			prod_to_delete = node.active_procedure;
		}

		let parent: IProcedure = prod_to_delete.parent;

		if(parent){
			// delete procedure from the oarent procedure
			let position: number = ProcedureUtils.get_child_position(parent, prod_to_delete);
			parent = ProcedureUtils.delete_child(parent, prod_to_delete);
			if(position == 0){
				node.active_procedure = parent;
			}
			else{
				node.active_procedure = parent.children[position];
			}
			console.log(`Successfully deleted procedure-child`);
		}
		else{
			// delete procedure from the node

			let index:number = 0;
			for (const prod of node.procedure){
				if (prod.id == node.active_procedure.id){
					node.procedure.splice(index, 1);
					node.active_procedure = index < node.procedure.length ? node.procedure[index] : undefined;
					break;
				}
				index++;
			}
		}

		console.log(`Delete Procedure: ${prod_to_delete.type}`);
		return node;
	}

	public static get_variable_list(node: IGraphNode): string[]{

		let varList: string[] = [];

		//push undefined
		varList.push("undefined");

		//push names of inputs and outputs
		node.inputs.map(function(inp){
			varList.push(inp.name);
		});

		node.outputs.map(function(out){
			varList.push(out.name);
		});

		// push names of left components in procedure
		node.procedure.map(function(prod){
			let type = prod.type;
			if( type == ProcedureTypes.Data || 
				type == ProcedureTypes.ForLoopControl || 
				type == ProcedureTypes.Action){
				let var_name: string = prod.left.expression;
				if(var_name && var_name.length > 0){
					varList.push(var_name);
				};
			}
		});

		return varList;
	}
	
	public static execute_node(node: IGraphNode, code_generator: ICodeGenerator, modules: any, print: Function, globals?: any): void{

		console.log(`${node.name} is executing...`);

		// To store the files in window_scope
		let window_params: string[] = [];

		// Params required for the node execution
		let params: any[] = [];

		// Count of data being downloaded from file URLs
		let live_data_downloads = 0;

		node.inputs.map(function(i, index){ 

			if(i.type == InputPortTypes.URL){

				///
				///	 If type of input-port is URL,
				///	 fetch data first
				///

				live_data_downloads++;
				let urlString: any = i.opts.url;
				fetch(urlString)
				.then((res) => res.text())
				.then((out) => {

					i.value = out;
					try{
						i.value = JSON.parse(out);
					}
					catch(ex){
						console.error(`Error fetching data from ${urlString}`)
					}

					live_data_downloads--;

					// when last of all data has downloaded
					if(live_data_downloads == 0){
						outputProcessing();
					}

				})
				.catch(err => { alert("Oops...Error fetching data from URL."); throw err; });
			}
			else{
				params[i.name] = i.value; 
			}

		});

		// this code runs only after live_data_downloads = 0;
	    function outputProcessing(){
			// use code generator to execute code
			let result: any  = code_generator.execute_node(node, params, modules, print, globals);

			// add results to self node
			for( let n=0;  n < node.outputs.length; n++ ){
				let output_port = node.outputs[n];
				output_port.value = (result[output_port.name]);
				console.log(`${output_port.name} of node ${node.name} was assigned value ${output_port.value}`);
			}

			node.hasExecuted = true;

			// delete all files stored in window reference
			window_params.map(function(filename){
				delete window[filename];
			})
	    }


	    if(live_data_downloads == 0){
	    	outputProcessing();
	    }
	}

	public static get_result(node: IGraphNode):any{
		let final_values :any = {};
		for(let o=0; o < node.outputs.length; o++ ){
			let output: OutputPort = node.outputs[o];
			final_values[output.name] = output.value;
		}

		return final_values;
	}


}