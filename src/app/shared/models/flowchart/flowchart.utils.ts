import { IFlowchart } from './flowchart.interface';
import { NodeUtils } from '@models/node';

export class FlowchartUtils{
    
    public static newflowchart(): IFlowchart{
        const flw: IFlowchart = { 
            language: "js",
            modules: [],
            meta: {
                selected_nodes: [0]
            },
            nodes: [  NodeUtils.getNewNode()  ],
            edges: [ ]
        }

        return flw;
    }
    
}