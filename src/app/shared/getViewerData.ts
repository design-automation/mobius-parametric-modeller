import { INode } from '@models/node';
import { _parameterTypes } from '@assets/core/modules';
const emptyModel = _parameterTypes.newFn();

export function getViewerData(node: INode, getViewOutput: boolean) {
    if (!node || !node.enabled) { return emptyModel; }
    // if (node.type === 'output') { return node.input.value; }
    if (getViewOutput) {
        return node.model;
    }
    return node.input.value;

}
