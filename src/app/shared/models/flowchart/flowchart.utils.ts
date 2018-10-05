import { IFlowchart } from './flowchart.interface';
import { NodeUtils } from '@models/node';

export class FlowchartUtils{
    
    public static newflowchart(): IFlowchart{
        const flw: IFlowchart = { 
            language: "js",
            meta: {
                selected_nodes: [0]
            },
            nodes: [  NodeUtils.getStartNode(), NodeUtils.getEndNode()  ],
            edges: [ {source: [0, 0], target: [1, 0] } ],
            functions: []
        }

        return flw;
    }
    
}