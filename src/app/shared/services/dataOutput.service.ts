import { Injectable } from '@angular/core';
import { INode } from '@models/node';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { WebWorkerService } from 'ngx-web-worker';
import { GIMetaData } from '@assets/libs/geo-info/GIMetaData';
import { GIModel } from '@assets/libs/geo-info/GIModel';

@Injectable()
export class DataOutputService {
    private emptyModel = _parameterTypes.newFn();
    private iModel = {'nodeID': '', 'getOutput': null, 'model': null};

    getViewerData(node: INode, model: GIModel, getViewOutput: boolean) {
        if (!model || !node || !node.enabled || !node.model) {
            return null; }
        // model.outputSnapshot = node.model;
        return model;
        // const webWorker = new WebWorkerService();
        // if (!node || !node.enabled || !node.model) {
        //     return null; }
        // if (this.iModel.nodeID === node.id && this.iModel.getOutput === getViewOutput) {
        //     return this.iModel.model;
        // }
        // // const startTime = performance.now();
        // // console.log('retrieve Data...');
        // const model = _parameterTypes.newFn();
        // model.setMetaData(meta);
        // if (getViewOutput) {
        //     model.setModelDataJSONStr(node.model);
        //     this.iModel.model = model;
        //     this.iModel.getOutput = true;
        //     this.iModel.nodeID = node.id;
        //     return this.iModel.model;

        //     // const result = webWorker.run(input => {
        //     //     return JSON.parse(input);
        //     // }, node.model);
        //     // result.then(r => {
        //     //     model.setModelData(r);
        //     //     this.iModel.model = model;
        //     // });
        //     // this.iModel.getOutput = true;
        //     // this.iModel.nodeID = node.id;
        //     // return this.iModel.model;

        //     // model.setData(JSON.parse(node.model));
        // } else if (node.input.edges.length === 1) {
        //     model.setModelDataJSONStr(node.input.edges[0].source.parentNode.model);
        //     this.iModel.model = model;
        //     this.iModel.getOutput = false;
        //     this.iModel.nodeID = node.id;
        //     return this.iModel.model;

        //     // const result = webWorker.run(input => {
        //     //     return JSON.parse(input);
        //     // }, node.input.edges[0].source.parentNode.model);
        //     // result.then(r => {
        //     //     model.setModelData(r);
        //     //     this.iModel.model = model;
        //     // });
        //     // this.iModel.getOutput = false;
        //     // this.iModel.nodeID = node.id;
        //     // return this.iModel.model;
        //     // model.setData(JSON.parse(node.input.edges[0].source.parentNode.model));
        // } else {
        //     for (const edge of node.input.edges) {
        //         if (!edge.source.parentNode || !edge.source.parentNode.enabled) {
        //             continue;
        //         }
        //         const newModel = _parameterTypes.newFn();
        //         // newModel.setModelData(JSON.parse(edge.source.parentNode.model));
        //         newModel.setModelDataJSONStr(edge.source.parentNode.model);
        //         newModel.setMetaData(meta);
        //         model.merge(newModel);
        //     }
        //     this.iModel.getOutput = false;
        // }
        // // console.log('retrieve viewer Data time:', (performance.now() - startTime) / 1000, 's' );
        // this.iModel.nodeID = node.id;
        // this.iModel.model = model;
        // return this.iModel.model;
    }

    resetIModel() {
        this.iModel.nodeID = '';
        this.iModel.getOutput = null;
        this.iModel.model = null;
    }

}
