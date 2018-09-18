import { IFlowchart } from '@models/flowchart';
import { ExecuteUtils } from './execute.utils';

export function execute_flowchart( flowchart: IFlowchart, language: string = 'js' ){
    
    console.log(ExecuteUtils.print_modules())

    flowchart.nodes.map( (node) => {
        ExecuteUtils.execute_node(node);
    })

    return flowchart;
}