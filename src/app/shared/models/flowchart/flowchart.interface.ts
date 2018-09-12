//
//
// The flowchart is the basic datastructure in Mobius - it is essentially a linked-list.
// It also 
//
import { INode, IEdge } from '@models/node';
import { CodeLanguage } from '@models/code';

export interface IFlowchart{
	nodes: INode[];
	edges: IEdge[];

	language: CodeLanguage;
	modules: any; //IModules
};