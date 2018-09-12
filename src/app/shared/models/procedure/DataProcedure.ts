import {Procedure} from "./Procedure";
import {IProcedure} from "./IProcedure";
import {ProcedureTypes} from "./ProcedureTypes";
import {IComponent} from "./IComponent";

export class DataProcedure extends Procedure{

	private static count: number = 1;

	constructor(data ?: {result: string, value: string}){
		super(ProcedureTypes.Data, false); 

		if(data == undefined){
			data = {result: `var${DataProcedure.count}`, value: "value"};
			DataProcedure.count++;
		}

		let left: IComponent = { expression: data.result, 
								 isAction: false, 
								 module: undefined, 
								 category: undefined, 
								 fn_name: undefined,
								 params: undefined
								}
		let right: IComponent = { expression: data.value, 
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