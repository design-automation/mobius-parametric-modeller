//
//
// The flowchart is the basic datastructure in Mobius - it is essentially a linked-list.
// It also
//

import { INode } from '@models/node';
import { IEdge } from '@models/edge';
import { IFunction } from '@models/procedure';

export interface IFlowchart {
    name: string;
    description: string;
    language: string;

    nodes: INode[];
    edges: IEdge[];
    functions: IFunction[];
    ordered: boolean;

    meta: {
        selected_nodes: number[];
    };
}

export const canvasSize = 10000;

