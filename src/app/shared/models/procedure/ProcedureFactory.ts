import {ProcedureTypes} from "./ProcedureTypes"; 
import {DataProcedure} from "./DataProcedure";
import {ActionProcedure} from "./ActionProcedure";
import {IfElseControlProcedure} from "./IfElseControlProcedure";
import {IfControlProcedure} from "./IfControlProcedure";
import {ElseControlProcedure} from "./ElseControlProcedure";
import {ElseIfControlProcedure} from "./ElseIfControlProcedure";
import {ForLoopControlProcedure} from "./ForLoopControlProcedure";
import {WhileControlProcedure} from "./WhileControlProcedure";
import {FunctionProcedure} from "./FunctionProcedure";
import {StatementProcedure} from "./StatementProcedure";
import {IProcedure} from "./IProcedure";

export class ProcedureFactory{

	static getProcedure(type: ProcedureTypes, data?: any): IProcedure{

		switch(type){

			case ProcedureTypes.Data:
				return new DataProcedure(data);

			case ProcedureTypes.Action:
				return new ActionProcedure(data);

			case ProcedureTypes.Function:
				return new FunctionProcedure(data);

			case ProcedureTypes.LoopBreak:
			case ProcedureTypes.LoopContinue:
			case ProcedureTypes.Comment:
				return new StatementProcedure(type);

			case ProcedureTypes.IfControl:
				return new IfControlProcedure(data);

			case ProcedureTypes.ElseControl:
				return new ElseControlProcedure(data);

			case ProcedureTypes.ElseIfControl:
				return new ElseIfControlProcedure(data); 

			case ProcedureTypes.ForLoopControl:
				return new ForLoopControlProcedure(data);

			case ProcedureTypes.WhileControl:
				return new WhileControlProcedure();


			default: 
				throw Error(`Invalid Procedure Type: ${type}`);

		}

	}
 

}