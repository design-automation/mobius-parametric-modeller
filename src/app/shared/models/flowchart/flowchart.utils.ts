import { IFlowchart } from './flowchart.interface';
import { NodeUtils, INode } from '@models/node';
import { NgModuleFactoryLoader } from '@angular/core';

export class FlowchartUtils {

    public static newflowchart(): IFlowchart {
        const flw: IFlowchart = {
            name: 'new_flowchart',
            description: '',
            language: 'js',
            meta: {
                selected_nodes: [0]
            },
            nodes: [  NodeUtils.getStartNode(), NodeUtils.getEndNode()  ],
            edges: [],
            functions: [],
            ordered: false
        };

        return flw;
    }

    static checkNode(nodeOrder: INode[], node: INode, enabled: boolean) {
        if (node.hasExecuted) {
            return;
        } else if (node.type === 'start' ) {
            nodeOrder.push(node);
        } else {
            for (const edge of node.input.edges) {
                if (!edge.source.parentNode.hasExecuted) {
                    return;
                }
            }
            nodeOrder.push(node);
        }
        node.hasExecuted = true;
        node.enabled = enabled;
        for (const edge of node.output.edges) {
            FlowchartUtils.checkNode(nodeOrder, edge.target.parentNode, enabled);
        }
    }

    public static orderNodes(flw: IFlowchart) {
        let startNode;
        for (const node of flw.nodes) {
            if (node.type === 'start') {
                startNode = node;
            }
            node.hasExecuted = false;
        }
        const nodeOrder = [];
        FlowchartUtils.checkNode(nodeOrder, startNode, true);
        if (nodeOrder.length < flw.nodes.length) {
            for (const node of flw.nodes) {
                if (node.type !== 'start' && node.input.edges.length === 0) {
                    FlowchartUtils.checkNode(nodeOrder, node, false);
                }
            }
        }
        flw.nodes = nodeOrder;
        flw.ordered = true;
    }
}
