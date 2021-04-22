import { IFlowchart, canvasSize } from './flowchart.interface';
import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';
import { IdGenerator } from '@utils';

export class FlowchartUtils {

    public static newflowchart(): IFlowchart {
        const startNode = NodeUtils.getStartNode();
        let startPos = canvasSize * 1.07 / 2;
        startPos = startPos - startPos % 20;

        startNode.position = {x: startPos, y: canvasSize / 2};

        const middleNode = NodeUtils.getNewNode();
        middleNode.position = {x: startPos, y: 200 + canvasSize / 2};

        const endNode = NodeUtils.getEndNode();
        endNode.position = {x: startPos, y: 400 + canvasSize / 2};

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
            id: IdGenerator.getId(),
            name: 'Untitled',
            description: '',
            language: 'js',
            meta: {
                selected_nodes: [1]
            },
            nodes: [ startNode, middleNode, endNode ],
            edges: [ startMid, midEnd ],
            functions: [],
            ordered: true,
            model: null
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
                if (edge.source.parentNode.enabled && !edge.source.parentNode.hasExecuted) {
                    return;
                }
            }
            nodeOrder.push(node);
        }
        node.hasExecuted = true;
        // node.enabled = enabled;
        for (const edge of node.output.edges) {
            FlowchartUtils.checkNode(nodeOrder, edge.target.parentNode, enabled);
        }
    }

    public static orderNodes(flw: IFlowchart) {
        let startNode: INode;
        const selectedNodesID = [];
        for (const nodeIndex of flw.meta.selected_nodes) {
            selectedNodesID.push(flw.nodes[nodeIndex].id);
        }
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
                // node.enabled = false;
                nodeOrder.push(node);
            }
        }
        if (nodeOrder[nodeOrder.length - 1].type !== 'end') {
            for (let i = nodeOrder.length - 2; i > 0; i--) {
                if (nodeOrder[i].type === 'end') {
                    const endN = nodeOrder[i];
                    nodeOrder.splice(i, 1);
                    nodeOrder.push(endN);
                    break;
                }
            }
        }
        flw.meta.selected_nodes = [];
        for (const nodeID of selectedNodesID) {
            for (let i = 0; i < nodeOrder.length; i++) {
                if (nodeOrder[i].id === nodeID) {
                    flw.meta.selected_nodes.push(i);
                    break;
                }
            }
        }
        flw.nodes = nodeOrder;
        flw.ordered = true;
    }
}
