import { Injectable } from '@angular/core';
import { INode } from '@models/node';
import { _parameterTypes } from '@assets/core/modules';
import { WebWorkerService } from 'ngx-web-worker';
import { mode } from '@assets/core/modules/_mathjs';

@Injectable()
export class DataOutputService {
    private emptyModel = _parameterTypes.newFn();
    private iModel = {'nodeID': '', 'getOutput': null, 'model': null};

    getViewerData(node: INode, getViewOutput: boolean) {
        const webWorker = new WebWorkerService();
        if (!node || !node.enabled || !node.model) { return this.emptyModel; }
        if (this.iModel.nodeID === node.id && this.iModel.getOutput === getViewOutput) {
            return this.iModel.model;
        }
        // const startTime = performance.now();
        // console.log('retrieve Data...');
        const model = _parameterTypes.newFn();
        if (getViewOutput) {
            // const result = webWorker.run(input => {
            //     return JSON.parse(input);
            // }, node.model);
            // result.then(r => {
            //     model.setData(r);
            //     console.log('.........');
            // });
            this.iModel.getOutput = true;
            model.setData(JSON.parse(node.model));
        } else if (node.input.edges.length === 1) {
            model.setData(JSON.parse(node.input.edges[0].source.parentNode.model));
            this.iModel.getOutput = false;
        } else {
            for (const edge of node.input.edges) {
                if (!edge.source.parentNode || !edge.source.parentNode.enabled) {
                    continue;
                }
                const newModel = _parameterTypes.newFn();
                newModel.setData(JSON.parse(edge.source.parentNode.model));
                model.merge(newModel);
            }
            this.iModel.getOutput = false;
        }
        // console.log('retrieve viewer Data time:', (performance.now() - startTime) / 1000, 's' );
        this.iModel.nodeID = node.id;
        this.iModel.model = model;
        return this.iModel.model;
    }

    resetIModel() {
        this.iModel.nodeID = '';
        this.iModel.getOutput = null;
        this.iModel.model = null;
    }

}
