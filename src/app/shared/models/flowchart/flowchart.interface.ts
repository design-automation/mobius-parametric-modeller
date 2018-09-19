//
//
// The flowchart is the basic datastructure in Mobius - it is essentially a linked-list.
// It also 
//

// import { INode, IEdge } from '@models/node';
// import { CodeLanguage } from '@models/code';

export interface IFlowchart{
	language: any;
	modules: any;

	nodes: any[];
	edges: any[];

	meta: {
		selected_nodes: number[];
	}
};