/*enum ControlTypes{
	FOR = "for each", 
	IF = "if else"
}*/

//
//	 A procedure is a line of code that gets inserted into a node
// 	 A procedure can be of three types - data, action or control
//   Data Procedure -> Has a left side and a right side: 
// 			<some-variable-name> = <some-expression>
//   Action Procedure -> Has a left side (optional) and a right side derieved from modules and params: 
// 			<some-variable-name> = <some-expression-derieved-from-module-and-params>
//   Control Procedure -> Doesn't have a left side, but has conditional statements and contains procedures inside itself
//
//

import {ICodeGenerator} from "../code/CodeModule";
import {ProcedureTypes} from "./ProcedureTypes";
import {IComponent} from "./IComponent"; 

export interface IProcedure{

	hasChildren: boolean; 
	children: IProcedure[];
	parent: IProcedure;
	id;
	type;

	print: boolean;
	enabled: boolean;

	left; 
	right;

	error; 
	reset();
	update(prodData: any, parent: IProcedure);
}




