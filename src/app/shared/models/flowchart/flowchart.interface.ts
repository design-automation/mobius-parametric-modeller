//
//
// The flowchart is the basic datastructure in Mobius - it is essentially a linked-list.
// It also 
//

import { INode } from '@models/node';
import { IEdge } from '@models/edge';
import { IFunction } from '@models/procedure';

export interface IFlowchart{
	language: string;

	nodes: INode[];
	edges: IEdge[];
	functions: IFunction[];
	nodeOrder: Number[];

	meta: {
		selected_nodes: number[];
	}
};