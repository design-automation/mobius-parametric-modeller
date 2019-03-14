import { Injectable } from '@angular/core';
import { IMobius } from '@models/mobius';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { INode } from '@models/node';
import { IProcedure } from '@models/procedure';

@Injectable()
export class DataService {
    private static _data: IMobius = {
        name: 'Untitled',
        author: 'new_user',
        version: 1,
        flowchart: FlowchartUtils.newflowchart(),
        settings: {}
    };

    private static _consoleLog: string[] = [];

    private static _flowchartPosition: string = undefined;
    private static _newFlowchart = true;

    private static _modelOutputView = {};
    private static _testModel = false;

    private static _helpView = [false, false, undefined];
    private static _helpViewData = [undefined, ''];

    private static _activeModelView: string = undefined;
    private static _activeGallery: any = undefined;

    private static _focusedInput: any;

    private static _splitVal = 60;
    private static _flowchartSplitUpdate = false;

    private static _copiedProd: IProcedure[];
    private static _copiedType: IProcedure[];

    private static _consoleScroll: number;
    private static _consoleClear = true;

    private _prevFlwActions = [];
    private _nextFlwActions = [];

    private _prevEdtActions = [];
    private _nextEdtActions = [];

    getLog(): string[] {
        return DataService._consoleLog;
    }

    log(str: string) {
        DataService._consoleLog.push(str);
    }

    clearLog() {
        DataService._consoleLog = [];
    }

    spliceLog(remainingLogs: number) {
        DataService._consoleLog.splice(0, DataService._consoleLog.length - remainingLogs);
    }

    get file() { return DataService._data; }
    set file(data: IMobius) {
        DataService._data = <IMobius>{
            name: data.name,
            author: data.author,
            flowchart: data.flowchart,
            version: data.version,
            settings: data.settings || {}
        };
    }
    get settings() {return DataService._data.settings; }
    set settings(settings: any) {DataService._data.settings = settings; }

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
    set helpView(view: any) {DataService._helpView[2] = view; }
    toggleHelp(state: boolean) { DataService._helpView[0] = state; DataService._helpView[1] = state; }
    toggleViewHelp(state: boolean) { DataService._helpView[0] = state; }
    togglePageHelp(state: boolean) { DataService._helpView[1] = state; }

    get helpViewData() {return DataService._helpViewData; }
    set helpViewData(view: any) {DataService._helpViewData = view; }

    get focusedInput() {return DataService._focusedInput; }
    set focusedInput(input: any) {DataService._focusedInput = input; }

    get copiedProd() {return DataService._copiedProd; }
    set copiedProd(prods: any) {DataService._copiedProd = prods; }

    get copiedType() {return DataService._copiedType; }
    set copiedType(Ptype: any) {DataService._copiedType = Ptype; }

    get splitVal() {return DataService._splitVal; }
    set splitVal(num: number) {DataService._splitVal = num; }

    get splitUpdate() {return DataService._flowchartSplitUpdate; }
    set splitUpdate(check: boolean) {DataService._flowchartSplitUpdate = check; }

    get consoleScroll() {return DataService._consoleScroll; }
    set consoleScroll(num: number) {DataService._consoleScroll = num; }

    get consoleClear() {return DataService._consoleClear; }
    set consoleClear(check: boolean) {DataService._consoleClear = check; }

    get flowchart(): IFlowchart { return DataService._data.flowchart; }
    get node(): INode { return DataService._data.flowchart.nodes[DataService._data.flowchart.meta.selected_nodes[0]]; }


    registerFlwAction(action) {
        this._prevFlwActions.push(action);
        this._nextFlwActions = [];
        if (this._prevFlwActions.length > 10) {
            this._prevFlwActions.splice(0, 1);
        }
    }

    undoFlw() {
        if (this._prevFlwActions.length === 0) {
            return undefined;
        }
        const action = this._prevFlwActions.pop();
        this._nextFlwActions.push(action);
        return action;
    }

    redoFlw() {
        if (this._nextFlwActions.length === 0) {
            return undefined;
        }
        const action = this._nextFlwActions.pop();
        this._prevFlwActions.push(action);
        return action;
    }



    registerEdtAction(actions: any[]) {
        this._prevEdtActions.push(actions);
        this._nextEdtActions = [];
        if (this._prevEdtActions.length > 10) {
            this._prevEdtActions.splice(0, 1);
        }
    }

    undoEdt() {
        if (this._prevEdtActions.length === 0) {
            return undefined;
        }
        const actions = this._prevEdtActions.pop();
        this._nextEdtActions.push(actions);
        return actions;
    }

    redoEdt() {
        if (this._nextEdtActions.length === 0) {
            return undefined;
        }
        const actions = this._nextEdtActions.pop();
        this._prevEdtActions.push(actions);
        return actions;
    }



}
