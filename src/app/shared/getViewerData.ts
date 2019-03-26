import { INode } from '@models/node';
import { _parameterTypes } from '@assets/core/modules';
const emptyModel = _parameterTypes.newFn();
const iModel = {'nodeID': '', 'model': null};

export function getViewerData(node: INode, getViewOutput: boolean) {
    if (!node || !node.enabled) { return emptyModel; }
    // if (node.type === 'output') { return node.input.value; }
    if (getViewOutput) {
        return node.model;
    }
    if (node.input.edges.length === 1) {
        return node.input.edges[0].source.parentNode.model;
    }
    if (iModel.nodeID !== node.id) {
        const model = _parameterTypes.newFn();
        for (const edge of node.input.edges) {
            if (!edge.source.parentNode || !edge.source.parentNode.enabled) {
                continue;
            }
            model.merge(edge.source.parentNode.model);
        }
        iModel.nodeID = node.id;
        iModel.model = model;
    }
    return iModel.model;
}

export function resetIModel() {
    iModel.nodeID = '';
    iModel.model = null;
}
