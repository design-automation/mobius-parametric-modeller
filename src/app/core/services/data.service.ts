import { Injectable } from '@angular/core';
import { IMobius } from '@models/mobius';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { INode } from '@models/node';
import { IProcedure } from '@models/procedure';

@Injectable()
export class DataService {
    private static _data: IMobius = {
        name: 'default_file',
        author: 'new_user',
        last_updated: new Date(),
        version: 1,
        flowchart: FlowchartUtils.newflowchart()
    };
    private static _flowchartPosition: string = undefined;
    private static _newFlowchart = true;

    private static _modelOutputView = {};
    private static _testModel = false;
    private static _helpView = [false, undefined];

    private static _activeModelView: string = undefined;
    private static _activeGallery: any = undefined;

    private static _focusedInput: any;

    private static _splitVal = 60;

    private static _copiedProd: IProcedure[];
    private static _copiedType: IProcedure[];

    private static _consoleScroll: number;

    private _prevActions = [];
    private _nextActions = [];

    get file() { return DataService._data; }
    set file(data: IMobius) {
        DataService._data = <IMobius>{
            name: data.name,
            author: data.author,
            flowchart: data.flowchart,
            last_updated: data.last_updated,
            version: data.version
        };
    }

    get flowchartPos() {return DataService._flowchartPosition; }
    set flowchartPos(transf: string) {DataService._flowchartPosition = transf; }

    get newFlowchart() {return DataService._newFlowchart; }
    set newFlowchart(check: boolean) {DataService._newFlowchart = check; }

    getModelOutputView(nodeID: string) {
        if (DataService._modelOutputView.hasOwnProperty(nodeID)) {
            return DataService._modelOutputView[nodeID];
        }
        return true;
    }
    setModelOutputView(nodeID: string, check: boolean) {DataService._modelOutputView[nodeID] = check; }

    get testModel() {return DataService._testModel; }
    set testModel(check: boolean) {DataService._testModel = check; }

    get activeView() {return DataService._activeModelView; }
    set activeView(view: string) {DataService._activeModelView = view; }

    get activeGallery() {return DataService._activeGallery; }
    set activeGallery(gallery: any) {DataService._activeGallery = gallery; }

    get helpView() {return DataService._helpView; }
    set helpView(view: any) {DataService._helpView[1] = view; }
    toggleHelp(state: boolean) { DataService._helpView[0] = state; }

    get focusedInput() {return DataService._focusedInput; }
    set focusedInput(input: any) {DataService._focusedInput = input; }

    get copiedProd() {return DataService._copiedProd; }
    set copiedProd(prods: any) {DataService._copiedProd = prods; }

    get copiedType() {return DataService._copiedType; }
    set copiedType(Ptype: any) {DataService._copiedType = Ptype; }

    get splitVal() {return DataService._splitVal; }
    set splitVal(num: number) {DataService._splitVal = num; }

    get consoleScroll() {return DataService._consoleScroll; }
    set consoleScroll(num: number) {DataService._consoleScroll = num; }

    get flowchart(): IFlowchart { return DataService._data.flowchart; }
    get node(): INode { return DataService._data.flowchart.nodes[DataService._data.flowchart.meta.selected_nodes[0]]; }


    registerAction(action) {
        this._prevActions.push(action);
        this._nextActions = [];
        // console.log(action);
    }

    undo() {
        if (this._prevActions.length === 0) {
            return undefined;
        }
        const action = this._prevActions.pop();
        this._nextActions.push(action);
        return action;
    }

    redo() {
        if (this._nextActions.length === 0) {
            return undefined;
        }
        const action = this._nextActions.pop();
        this._prevActions.push(action);
        return action;
    }



}
