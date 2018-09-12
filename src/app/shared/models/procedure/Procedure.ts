import {IdGenerator} from '../misc/GUID';
import {IProcedure} from "./IProcedure";
import {ProcedureTypes} from "./ProcedureTypes";
import {IComponent} from "./IComponent";
import {ICodeGenerator} from "../code/CodeModule";

export abstract class Procedure implements IProcedure{

	private _id: string; 
	private _error: boolean;
	private _level: number;

	private _type: ProcedureTypes; 
	private _selected: boolean; 
	private _disabled: boolean = false; 
	private _printToConsole: boolean = false;
	
	private _parent: IProcedure;

	protected _leftComponent: IComponent; 
	protected _rightComponent: IComponent; 

	public hasChildren: boolean;
	public _children: IProcedure[] = []; 

	constructor(type: ProcedureTypes, hasChildren: boolean){
		this._id = IdGenerator.getId();

		this._type = type; 
		this._level = 0;

		this.hasChildren = hasChildren;
		this._error = false;
	}	

	get enabled(): boolean{
		return !this._disabled;
	}

	set enabled(value: boolean){
		this._disabled = !value;
	}

	get id(): string{
		return this._id;
	}

	set id(value: string){
		console.warn("Id of procedure being set manually");
		this._id = value;
	}

	get type(): ProcedureTypes{
		return this._type;
	}

	set type(value: ProcedureTypes){
		this._type = value;
	}

	get left(){
		return this._leftComponent;
	}

	set left(value: any){
		this._leftComponent = value;
	}

	get right(){
		return this._rightComponent;
	}

	set right(value: any){
		this._rightComponent = value;
	}

	get children(): IProcedure[]{
		return this._children;
	}

	set children(children: IProcedure[]){
		this._children = children;
	}

	get error(): boolean{
		return this._error;
	}

	set error(value: boolean){
		this._error = value;
	}

	get print(): boolean{
		return this._printToConsole;
	}

	set print(value: boolean){
		this._printToConsole = value;
	}


	get parent(): IProcedure{
		return this._parent;
	}

	set parent(parent: IProcedure){
		if(parent && (parent["_level"]!==undefined)){
			this._level = parent["_level"] + 1;
		}
		else{
			this._level = 0;
		}

		this._parent = parent;
	}

	reset(): void{
		this._error = false;
		this.children.map(function(p){
			p.reset();
		})
	}

	getCodeString(code_generator: ICodeGenerator): string{
		return code_generator.get_code_procedure(this);
	}

	hasParent(): boolean{
		if(this._parent == undefined){
			return false;
		}
		else{
			return true;
		}
	}

	update(prodData: any, parent: IProcedure): void{
		this._id = prodData._id;
		this._disabled = prodData._disabled; 

		// todo: be careful
		//this._leftComponent =  prodData._leftComponent; 
		//this._rightComponent = prodData._rightComponent; 

		this._parent = parent;
		this._level = prodData._level;
		this._children = [];
		this._error = false; 
	}

}
