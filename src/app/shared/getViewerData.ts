import { INode } from '@models/node';
import { _parameterTypes } from '@assets/core/modules';
// import * as flatted from 'flatted';
// import { GIModel } from '@assets/libs/geo-info';

const emptyModel = _parameterTypes.newFn();
// const emptyModelData = emptyModel.getData();
const iModel = {'nodeID': '', 'getOutput': null, 'model': null};

export function getViewerData(node: INode, getViewOutput: boolean) {
    if (!node || !node.enabled || !node.model) { return emptyModel; }
    if (iModel.nodeID === node.id && iModel.getOutput === getViewOutput) {
        return iModel.model;
    }
    // const startTime = performance.now();
    // console.log('retrieve Data...');
    const model = _parameterTypes.newFn();
    if (getViewOutput) {
        model.setData(JSON.parse(node.model));
        iModel.getOutput = true;
    } else if (node.input.edges.length === 1) {
        model.setData(JSON.parse(node.input.edges[0].source.parentNode.model));
        iModel.getOutput = false;
    } else {
        for (const edge of node.input.edges) {
            if (!edge.source.parentNode || !edge.source.parentNode.enabled) {
                continue;
            }
            const newModel = _parameterTypes.newFn();
            newModel.setData(JSON.parse(edge.source.parentNode.model));
            model.merge(newModel);
        }
        iModel.getOutput = false;
    }
    // console.log('retrieve viewer Data time:', (performance.now() - startTime) / 1000, 's' );
    iModel.nodeID = node.id;
    delete iModel.model;
    iModel.model = model;
    return iModel.model;
}

// export function getViewerData1(node: INode, getViewOutput: boolean) {
//     if (!node || !node.enabled || !node.model) { return emptyModel; }
//     if (iModel.nodeID === node.id && iModel.getOutput === getViewOutput) {
//         return iModel.model;
//     } else if (iModel.nodeID === node.id && getViewOutput) {
//         iModel.getOutput = true;
//         const oldModel = iModel.model.getData();
//         iModel.model = _parameterTypes.newFn();
//         iModel.model.setData(applyDiff(oldModel, node.model));
//         return iModel.model;
//     } else {
//         const startTime = performance.now();
//         console.log('retrieve Data...');
//         iModel.nodeID = node.id;
//         iModel.model = _parameterTypes.newFn();
//         iModel.getOutput = getViewOutput;
//         const a = getModel(node, getViewOutput, {});
//         iModel.model.setData(a);
//         console.log('retrieve viewer Data time:', (performance.now() - startTime) / 1000, 's' );
//     }
//     return iModel.model;
// }


// export function getModel(node: INode, getViewOutput: boolean, resolvedModels: {}) {
//     if (resolvedModels[node.id]) {
//         // console.log('.......', node.name);
//         return resolvedModels[node.id];
//         // return JSON.parse(resolvedModels[node.id]);
//     }
//     // console.log('!!!!!!', node.name)
//     if (node.type === 'start') {
//         if (getViewOutput) {
//             resolvedModels[node.id] = node.model;
//             return node.model;
//             // resolvedModels[node.id] = JSON.stringify(node.model);
//             // return JSON.parse(resolvedModels[node.id]);
//         }
//         // resolvedModels[node.id] = emptyModelData;
//         return emptyModelData;
//     }

//     let newModel;

//     if (node.input.edges.length === 1) {
//         if (!node.input.edges[0].source.parentNode.enabled) {
//             return null;
//         }
//         newModel = getModel(node.input.edges[0].source.parentNode, true, resolvedModels);
//     } else {
//         newModel = _parameterTypes.newFn();
//         for (const edge of node.input.edges) {
//             if (!edge.source.parentNode.enabled) { continue; }
//             const nodeMod = _parameterTypes.newFn();
//             nodeMod.setData(getModel(edge.source.parentNode, true, resolvedModels));
//             newModel.merge(nodeMod);
//         }
//         newModel = newModel.getData();
//     }

//     if (getViewOutput) {
//         newModel = applyDiff(JSON.parse(JSON.stringify(newModel)), node.model);
//         // newModel = applyDiff(newModel, node.model);
//     }
//     if (node.output.edges.length > 1) {
//         resolvedModels[node.id] = newModel;
//     }
//     return newModel;
// }

export function resetIModel() {
    iModel.nodeID = '';
    iModel.getOutput = null;
    iModel.model = null;
}
