import {Procedure} from "./Procedure";
import {IProcedure} from "./IProcedure";
import {ProcedureTypes} from "./ProcedureTypes";
import {IComponent} from "./IComponent";
import {IGraphNode} from "../node/IGraphNode";
import {InputPort} from "../port/InputPort";

export class FunctionProcedure extends Procedure{

	private node: IGraphNode = undefined;
	private port: InputPort = undefined;

	constructor(data?: {node: IGraphNode, port: InputPort}){

		super(ProcedureTypes.Function, false); 

		if(data){
			this.node = data.node;
			this.port = data.port;
		}

		let left: IComponent = { 
									expression: "new_variable", 
									isAction: false, 
									module: undefined, 
									category: undefined, 
									fn_name: undefined,
									params: undefined
								};

		let right: IComponent = { 
									expression: undefined, 
									isAction: true, 
									module: undefined, 
									category: undefined,
									fn_name: undefined,
									params: this.node && this.node.inputs ? [this.node.inputs.map(function(inp){ return " "; })] : []
								}

		super.left = (left);
		super.right = (right);

	}

	getNode(): IGraphNode{
		return this.node;
	}

	setNode(graphNode: IGraphNode): void{
		this.node = graphNode;
	}

	getFunctionName(): string{
		return this.port ? this.port.name : "";		
	}

	updateParams(): string[]{
		let inp_range = this.node.inputs.map(function(inp){
			return " ";
		})
		return inp_range;
	}

	getOutputs(): string[]{
		let outputs = this.node.outputs.map(function(output){
			return output.name;
		});
		return outputs;
	}	

	update(prodData: any, parent: IProcedure): void{
		super.update(prodData, parent);

		this._leftComponent = 	{ 
									expression: prodData._leftComponent.expression,
								 	isAction: false, 
								 	module: undefined, 
								 	category: undefined, 
								 	fn_name: undefined,
								 	params: undefined
								};


		this._rightComponent =  {  
									expression: prodData._rightComponent.expression, 
									isAction: true, 
									module: undefined, 
									category: prodData._rightComponent.category, 
									fn_name: undefined,
									params: prodData._rightComponent.params
								};
	}

}