import { IFlowchart } from './flowchart.interface';
import { NodeUtils, INode } from '@models/node';
import { NgModuleFactoryLoader } from '@angular/core';

export class FlowchartUtils{
    
    public static newflowchart(): IFlowchart{
        const flw: IFlowchart = { 
            name: "new_flowchart",
            description: 'new flowchart description',
            language: "js",
            meta: {
                selected_nodes: [0]
            },
            nodes: [  NodeUtils.getStartNode(), NodeUtils.getEndNode()  ],
            edges: [],
            functions: [],
            ordered: false
        }

        return flw;
    }

    static checkNode(nodeOrder: INode[], node: INode, enabled: boolean){
        if (node.hasExecuted){
            return
        } else if (node.type === 'start' ){
            nodeOrder.push(node)
        } else {
            for (let edge of node.input.edges){
                if (!edge.source.parentNode.hasExecuted){
                    return
                }
            }
            nodeOrder.push(node)
        }
        node.hasExecuted = true;
        node.enabled = enabled
        for (let edge of node.output.edges){
            FlowchartUtils.checkNode(nodeOrder, edge.target.parentNode, enabled);
        }
    }

    public static orderNodes(flw: IFlowchart){
        var startNode = undefined;
        for (let node of flw.nodes){
            if (node.type === 'start'){
                startNode = node;
            }
            node.hasExecuted = false;
        }
        var nodeOrder = [];
        FlowchartUtils.checkNode(nodeOrder, startNode, true);
        if (nodeOrder.length < flw.nodes.length){
            for (let node of flw.nodes){
                if (node.type != 'start' && node.input.edges.length == 0){
                    FlowchartUtils.checkNode(nodeOrder, node, false);
                }
            }
        }
        flw.nodes = nodeOrder;
        flw.ordered = true;
    }
}
