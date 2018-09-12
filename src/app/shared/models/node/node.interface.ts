/*
 *
 *	Nodes are logical units that can be connected together to denote the code-flow
 *  They contain two things - ports and procedures
 *  Ports are arrays - which are the 'communication channels' between nodes
 *  Procedures are internal to the nodes and are an array of function calls in a sequence
 * 
 */
import { IPosition } from "@models/node/position";
import { InputPort, OutputPort } from "@models/port";
import { IProcedure } from "@models/procedure";

export interface INode{
	// basic properties
	id: string;
	name: string;
	description: string;
	author: string;
	version: number; 

	// type: string;
	position: IPosition;
	enabled: boolean;
	hasExecuted: boolean;
	hasError: boolean;
	timeTaken: number;

	// contents
	inputs: InputPort[];
	outputs: OutputPort[];
	procedure: IProcedure[];

	// stores the state
	state: {
		procedure: number,
		input_port: number,
		output_port: number
	}

	update_properties(data: any);
	reset();
}