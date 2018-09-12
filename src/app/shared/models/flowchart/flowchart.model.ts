//
//	Flowchart class 
//  Implement IFlowchart
//	
//
//
import {IFlowchart} from './flowchart.interface';
import {IGraphNode, IEdge, GraphNode} from '../node/NodeModule';
import {ICodeGenerator, IModule} from '../code/CodeModule';
import {InputPort} from '../port/PortModule';

import * as gs from 'gs-json';

export class Flowchart implements IFlowchart{

	private _name: string;
	private _description: string;
	private _author: string; 
	private _selected: number;
	private _summary: string; 

	private _nodes: IGraphNode[] = [];
	private _edges: IEdge[] = [];

	private _sortOrder: number[];

	private _globals = [];
	private _displayed_node: number;

	private _editable;

	constructor(data?: any){ 
		this._name = "new_flowchart.mob";
		this._description = "Hello, World!";
		this._author = "new_author";
		this._editable = true;
		this._globals = [];
		this._nodes = [];
		this._edges = [];

		if(data){
			this._name = data["_name"];
			this._description = data["_description"];
			this._author = data["_author"];
			this._editable = data["_editable"];

			if(data["_globals"]){
				this._globals = data["_globals"].map(function(in_data){
					let input_port = new InputPort(in_data["_name"]);
					input_port.update(in_data);
					return input_port;
				});
			}
		}
	};

	get name(): string{
		return this._name;
	}

	set name(value: string){
		this._name = value;
	}

	get author(): string{
		return this._author;
	}

	set author(value: string){
		this._author = value;
	}

	get description(): string{
		return this._description;
	}

	set description(value: string){
		this._description = value;
	}

	get summary(): string{
		return this._summary;
	}

	set summary(value: string){
		this._summary = value;
	}

	get selected_node(): number{
		return this._selected;
	}

	set selected_node(index: number){
		this._selected = index;
	}

	get globals(): any{
		return this._globals;
	}

	set globals(arr: any){
		this._globals = arr;
	}

	get nodes(): IGraphNode[]{
		return this._nodes;
	}

	get edges(): IEdge[]{
		return this._edges;
	}

	set edges(edges: IEdge[]){
		this._edges = edges;
	}

	set editable(value){
		this._editable = value;
	}

	get editable(): any{
		return this._editable;
	}

	get display_node(): number{
		return this._displayed_node;
	}

	set display_node(index: number){
		this._displayed_node = index;
	}

}
