import {IProcedure} from "./IProcedure";
import {ProcedureFactory} from "./ProcedureFactory";
import {Procedure} from "./Procedure";

export abstract class ProcedureUtils{

	public static copy_procedure(procedure: IProcedure): IProcedure{
		if(!procedure) return;		

		let n: IProcedure = ProcedureFactory.getProcedure(procedure.type || procedure["_type"]);
		//todo: bad programming!
		let id = n.id;
		n.update(procedure, procedure.parent);
		
		//
		// TODO: Design Issue?
		// If it is procedure data, the propery is _children
		// If it is a procedure object, the property is children
		//
		let child_prop = procedure.children ? "children" : "_children";
		if(procedure[child_prop]){
			n.children = procedure[child_prop].map((p)=> {
				let pc:IProcedure = ProcedureUtils.copy_procedure(p);
				pc.parent = n;
				return pc;
			});
		}

		n.id = id;

		return n;
	}

	public static shift_level_up(procedure: IProcedure): IProcedure{
		if(!procedure || !procedure.parent) throw Error("No procedure to shift up");

		let parent: IProcedure = procedure.parent;
		let grandparent: IProcedure = parent.parent;

		if(!grandparent) return undefined;

		ProcedureUtils.delete_child(parent, procedure);
		ProcedureUtils.add_child_at_position( grandparent, procedure, ProcedureUtils.get_child_position(grandparent, parent) + 1 );

		return procedure;
	}

	public static get_child_position(parent: IProcedure, child: IProcedure): number{
		let index: number = 0;
		for(const prod of parent.children){
			if (prod.id === child.id){
				return index;
			}
			index++;
		}

		return -1;
	}

	public static add_child(procedure: IProcedure, child: IProcedure): IProcedure{
		try{
			if( procedure.hasChildren ){
				procedure.children.push(child);
				child.parent = procedure;
			}
			else{
				throw Error(`Illegal addition of child to ${procedure.type} type`);
			}
		}
		catch(ex){
			console.log(`Error adding child ${ex}`);
		}

		return procedure;
	}

	public static add_child_from_data(procedure: IProcedure, child: IProcedure): IProcedure{
		if( procedure.hasChildren ){
			procedure.children.push(child);
			child.parent = procedure;
		}
		else{
			throw Error("Cannot add child to this procedure");
		}

		return procedure;
	}

	public static add_child_at_position(procedure: IProcedure, child: IProcedure, index: number): IProcedure{
		procedure.children.splice(index, 0, child);
		child.parent = procedure;

		return procedure;
	}

	public static delete_child(procedure: IProcedure, remove: IProcedure): IProcedure{
		procedure.children = procedure.children.filter(function(child: IProcedure){ 
			return !(child === remove)
		});

		return procedure;
	}
} 