import { IdGenerator } from '@shared/utils';
import { INode } from '@models/node';
import { IPosition } from '@models/node/position';
import { Input, Output } from "@models/port";
import { IProcedure, ProcedureFactory, ProcedureTypes, ProcedureUtils } from "@models/procedure";

export class Node implements INode{

	private _id: string;
	private _name: string;
	private _description: string;
	private _author: string;
	private _version: number; 
	private _position: IPosition;
	private _enabled: boolean;
	private _hasExecuted: boolean;
	private _hasError: boolean;
	private _timeTaken: number;

	// contents
	private _inputs: Input[];
	private _outputs: Output[];
	private _procedure: IProcedure[];

	// stores the state
	private _state: {
		procedure: number,
		input_port: number,
		output_port: number
	}

	// getters and setters
	get id(): string{ return this._id; }
	set id(uuid: string) { 	this._id = uuid; }
	
	get name(): string{ return this._name; 	}
	set name(value: string){ this._name = value; }

	get description(): string{ return this._description; 	}
	set description(value: string){ this._description = value; }

	get version(): number{ return this._version;  }
	set version(value: number){ this._version = value; }

	get enabled(): boolean{ return this._enabled; }
	set enabled(value: boolean){ this._enabled = value; }

	get hasExecuted(): boolean{ return this._hasExecuted;  }
	set hasExecuted(value: boolean){ this._hasExecuted = value; }

	get hasError(): boolean{ return this._hasError;  }
	set hasError(value: boolean){ this._hasError = value; }

	get time_taken(): number{ return this._timeTaken; }
	set time_taken(value: number){ this._timeTaken = value; }

	get position(): number[]{ return this._position; }
	set position(value: number[]){ this._position = value; }

	get inputs(): Input[]{ return this._inputs; }
	//set inputs(values: Input[]){ this._inputs = values; }

	get outputs(): Output[]{ return this._outputs; }
	//set outputs(values: Output[]){ this._outputs = values; }

	get procedure(): IProcedure[]{ return this._procedure; }
	//set procedure(prod: IProcedure[]){ this._procedure = prod; }

	get active_procedure(): IProcedure{ 
		// todo
		return this._procedure[this._state.procedure];
	}
	set active_procedure(value: IProcedure){
		// todo: validate if value exists
		//this._active = value; 
	}

	/// todo:
	update_properties(nodeData: INode, nodeMap?: any): void{

		this._name = nodeData["_name"];
		this._position = nodeData["_position"] || [0, 0];

		// map direct properties
		this._enabled = nodeData["_enabled"];


		// add inputs
		let inputs: Input[] = nodeData["_inputs"];
		for( let input_index in inputs ){
			let inp_data :Input = inputs[input_index];
			let input :Input = new Input(inp_data["_name"]);

			input.update(inp_data, "inp");
			this._inputs.push(input);
		}
			
		// add outputs
		let outputs: Output[] = nodeData["_outputs"];
		for( let output_index in outputs ){
			let output_data: Output = outputs[output_index];
			let output: Output = new Output(output_data["_name"]);

			output.update(output_data, "out");
			this._outputs.push(output);
		}

		// add procedure
		for( let p_data of nodeData["_procedure"] ){
			this._procedure.push(ProcedureUtils.copy_procedure(p_data));
		}
	}

	reset(): boolean{
		this._hasExecuted = false;
		this._hasError = false;

		this._procedure.map(function(prod){
			prod.reset();
		});

		this._outputs.map(function(output){
			output.reset();
		});

		this.time_taken = undefined;

		return (this._hasExecuted == false); 
	}
	
}

