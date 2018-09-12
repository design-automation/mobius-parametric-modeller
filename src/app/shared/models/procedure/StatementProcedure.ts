import {Procedure} from "./Procedure";
import {IProcedure} from "./IProcedure";
import {ProcedureTypes} from "./ProcedureTypes";
import {IComponent} from "./IComponent";

export class StatementProcedure extends Procedure{

	constructor(type: ProcedureTypes){
		super(type, false); 

		let exp: string;
		if(type == ProcedureTypes.LoopBreak){
			exp = "break";
		}
		else if(type == ProcedureTypes.LoopContinue){
			exp = "continue";
		}
		else if(type == ProcedureTypes.Comment){
			exp = "Comment: Add notes";
		}

		let left: IComponent = { expression: exp, 
								 isAction: false, 
								 module: undefined, 
								 category: undefined, 
								 fn_name: undefined,
								 params: undefined
								}

		super.left = (left);
		super.right = (undefined);

	}

	update(prodData: any, parent: IProcedure): void{
		super.update(prodData, parent);
		this._leftComponent.expression = prodData._leftComponent.expression;
	}

}