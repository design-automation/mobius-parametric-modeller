import { IFlowchart } from './flowchart.interface';
import { NodeUtils } from '@models/node';

export class FlowchartUtils{
    
    public static newflowchart(): IFlowchart{
        const flw: IFlowchart = { 
            language: "js",
            meta: {
                selected_nodes: [0]
            },
            nodes: [  NodeUtils.getNewNode(), NodeUtils.getNewNode()  ],
            edges: [ {source: [0, 0], target: [1, 0] } ]
        }

        return flw;
    }
    
}