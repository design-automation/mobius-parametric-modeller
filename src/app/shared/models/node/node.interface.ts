/*
 *
 *    Nodes are logical units that can be connected together to denote the code-flow
 *  They contain two things - ports and procedures
 *  Ports are arrays - which are the 'communication channels' between nodes
 *  Procedures are internal to the nodes and are an array of function calls in a sequence
 *
 */
import { IPortInput, IPortOutput } from '@models/port';
import { IProcedure } from '@models/procedure';

export interface INode {
    // basic properties
    name: string;
    id: string;
    description?: string;
    author?: string;
    version?: number;

    type: string;
    position: any;
    enabled: boolean;
    hasExecuted: boolean;
    hasError: boolean;

    // contents
    input: IPortInput;
    output: IPortOutput;
    procedure: IProcedure[];
    localFunc: IProcedure[];
    model: any;

    // stores the state
    state: {
        procedure: IProcedure[],
        show_code: boolean,
        show_func: boolean
    };

    update_properties(data: any);
    reset();
}
