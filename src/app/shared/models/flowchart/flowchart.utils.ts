import { IFlowchart, canvasSize } from './flowchart.interface';
import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';

export class FlowchartUtils {

    public static newflowchart(): IFlowchart {
        const startNode = NodeUtils.getStartNode();
        startNode.position = {x: canvasSize * 1.07 / 2, y: canvasSize / 2};

        const middleNode = NodeUtils.getNewNode();
        middleNode.position = {x: canvasSize * 1.07 / 2, y: 200 + canvasSize / 2};

        const endNode = NodeUtils.getEndNode();
        endNode.position = {x: canvasSize * 1.07 / 2, y: 400 + canvasSize / 2};

        const startMid: IEdge = {
            source: startNode.output,
            target: middleNode.input,
            selected: false
        };
        startNode.output.edges = [startMid];
        middleNode.input.edges = [startMid];

        const midEnd: IEdge = {
            source: middleNode.output,
            target: endNode.input,
            selected: false
        };
        middleNode.output.edges = [midEnd];
        endNode.input.edges = [midEnd];

        middleNode.enabled = true;
        endNode.enabled = true;

        const flw: IFlowchart = {
            name: 'Untitled',
            description: '',
            language: 'js',
            meta: {
                selected_nodes: [2]
            },
            nodes: [ startNode, middleNode, endNode ],
            edges: [ startMid, midEnd ],
            functions: [],
            ordered: true
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
            /*
            for (const node of flw.nodes) {
                if (node.type !== 'start' && node.input.edges.length === 0) {
                    FlowchartUtils.checkNode(nodeOrder, node, false);
                }
            }
            */
            for (const node of flw.nodes) {
                let check = false;
                for (const existingNode of nodeOrder) {
                    if (existingNode === node) {
                        check = true;
                        break;
                    }
                }
                if (check) { continue; }
                node.enabled = false;
                nodeOrder.push(node);
            }
        }
        flw.nodes = nodeOrder;
        flw.ordered = true;
    }
}
