import {ProcedureTypes} from "./ProcedureTypes";
import {IComponent} from "./IComponent";
import {Procedure} from "./Procedure";
import {IProcedure} from "./IProcedure";

export class IfControlProcedure extends Procedure{

	constructor(data ?: {condition: string}){
		super(ProcedureTypes.IfControl, true);

		if(data == undefined){
			data = {condition: "conditional_expression"}
		}

		let left: IComponent = { expression: undefined, 
								 isAction: false, 
								 module: undefined, 
								 category: undefined, 
								 fn_name: undefined,
								 params: undefined
								}
		let right: IComponent = {
							     expression: data.condition, 
								 isAction: false, 
								 module: undefined, 
								 category: undefined, 
								 fn_name: undefined,
								 params: undefined
								}
		super.left = (left);
		super.right = (right);


	}

	update(prodData: any, parent: IProcedure): void{
		super.update(prodData, parent);

		this._leftComponent.expression = prodData._leftComponent.expression;
		this._rightComponent.expression = prodData._rightComponent.expression;
	}

}