import { Injectable } from '@angular/core';
import { IMobius } from '@models/mobius';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { INode } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';
import { IEdge } from '@models/edge';
import { Subject } from 'rxjs';
import { VERSION } from '@env/version';
import { GIMetaData } from '@assets/libs/geo-info/GIMetaData';
import { inline_func } from '@assets/core/inline/inline';
import { GIModel } from '@assets/libs/geo-info/GIModel';
import { _parameterTypes } from '@assets/core/modules';

@Injectable()
export class DataService {
    private static _data: IMobius = {
        name: 'Untitled',
        author: 'new_user',
        version: VERSION.version,
        flowchart: FlowchartUtils.newflowchart(),
        settings: {}
    };

    private static _consoleLog: string[] = [];

    private static _flowchartPosition: string = undefined;
    private static _newFlowchart = true;

    private static _model: GIModel;

    private static _modelOutputView = {};
    private static _testModel = false;

    private static _modelMeta = null;

    private static _helpView = [false, false, undefined];
    private static _helpViewData = [undefined, ''];

    private static _activeModelView: string = undefined;
    private static _activeGallery: any = undefined;

    private static _focusedInput: any;
    private static _focusedInputProd: any;
    private static _highlightedProd: any[] = [];

    private static _splitVal = 60;
    private static _flowchartSplitUpdate = false;

    private static _attribVal = 34;
    private static _attribSplitUpdate = false;

    private static _copiedProd: IProcedure[];
    private static _copiedType: IProcedure[];

    private static _consoleScroll: number;
    private static _consoleClear = true;

    private static _notificationMessage: string;
    private static _notificationTrigger = false;

    private static _dialog: HTMLDialogElement;
    private static _dialogType: string;

    private static _mobiusSettings; // {'execute': true};
    private static _viewerSettingsUpdated = false;

    private static _timelineDefault;

    private _backupDialogType: any;

    private _prevFlwActions = [];
    private _nextFlwActions = [];

    private _prevEdtActions = [];
    private _nextEdtActions = [];
    private _edtNode: string;

    private _modifiedNodeSet = new Set([]);

    private toolsetUpdate = new Subject<void>();
    toolsetUpdate$ = this.toolsetUpdate.asObservable();

    constructor() {
        const settingsString = localStorage.getItem('mobius_settings');
        if (settingsString) {
            DataService._mobiusSettings = JSON.parse(settingsString);
        } else {
            DataService._mobiusSettings = {'execute': true, 'debug': true};
        }
    }

    getLog(): string[] {
        return DataService._consoleLog;
    }

    log(str: string) {
        DataService._consoleLog.push(str);
    }

    clearLog() {
        DataService._consoleLog = [];
    }

    finalizeLog() {
        let i = 0;
        while (i < DataService._consoleLog.length - 1) {
            if (DataService._consoleLog[i].slice(0, 4) === '<div' && DataService._consoleLog[i + 1].slice(0, 5) === '</div') {
                DataService._consoleLog.splice(i, 2);
                i--;
            } else {
                i++;
            }
        }
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

    get executeModel() {return DataService._model; }
    initiateExecuteModel() {
        DataService._model = _parameterTypes.newFn();
        DataService._model.debug = DataService._mobiusSettings.debug;
    }

    get viewerSettingsUpdated() {return DataService._viewerSettingsUpdated; }
    set viewerSettingsUpdated(updated: boolean) {DataService._viewerSettingsUpdated = updated; }

    get flowchartPos() {return DataService._flowchartPosition; }
    set flowchartPos(transf: string) {DataService._flowchartPosition = transf; }

    get newFlowchart() {return DataService._newFlowchart; }
    set newFlowchart(check: boolean) {DataService._newFlowchart = check; }

    get modelMeta() {return DataService._modelMeta; }
    set modelMeta(meta: GIMetaData) {DataService._modelMeta = meta; }

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

    get focusedInputProd() {return DataService._focusedInputProd; }
    set focusedInputProd(input: any) {DataService._focusedInputProd = input; }

    getHighlightedProd() {
        if (DataService._highlightedProd.length > 0) {
            return DataService._highlightedProd[DataService._highlightedProd.length - 1];
        }
        return undefined;
    }
    addHighlightedProd(prod: any) {DataService._highlightedProd.push(prod); }
    removeHighlightedProd(): any {
        if (DataService._highlightedProd.length > 0) {
            return DataService._highlightedProd.pop();
        }
        return undefined;
    }

    get copiedProd() {return DataService._copiedProd; }
    set copiedProd(prods: any) {DataService._copiedProd = prods; }

    get copiedType() {return DataService._copiedType; }
    set copiedType(Ptype: any) {DataService._copiedType = Ptype; }

    get splitVal() {return DataService._splitVal; }
    set splitVal(num: number) {DataService._splitVal = num; }

    get splitUpdate() {return DataService._flowchartSplitUpdate; }
    set splitUpdate(check: boolean) {DataService._flowchartSplitUpdate = check; }

    get attribVal() {return DataService._attribVal; }
    set attribVal(num: number) {DataService._attribVal = num; }

    get attribUpdate() {return DataService._attribSplitUpdate; }
    set attribUpdate(check: boolean) {DataService._attribSplitUpdate = check; }

    get consoleScroll() {return DataService._consoleScroll; }
    set consoleScroll(num: number) {DataService._consoleScroll = num; }

    get consoleClear() {return DataService._consoleClear; }
    set consoleClear(check: boolean) {DataService._consoleClear = check; }

    get flowchart(): IFlowchart { return DataService._data.flowchart; }
    get node(): INode { return DataService._data.flowchart.nodes[DataService._data.flowchart.meta.selected_nodes[0]]; }

    get dialog() {return DataService._dialog; }
    set dialog(dialog: HTMLDialogElement) {DataService._dialog = dialog; }

    get dialogType() {return DataService._dialogType; }
    set dialogType(dialogType: string) {DataService._dialogType = dialogType; }

    get notificationMessage(): string { return DataService._notificationMessage; }
    get notificationTrigger(): boolean { return DataService._notificationTrigger; }

    get mobiusSettings() { return DataService._mobiusSettings; }
    set mobiusSettings(settings) { DataService._mobiusSettings = settings; }

    get timelineDefault() { return DataService._timelineDefault; }
    set timelineDefault(setting) { DataService._timelineDefault = setting; }



    notifyMessage(message) {
        DataService._notificationMessage = message;
        DataService._notificationTrigger = !DataService._notificationTrigger;
    }

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
        if (this._edtNode !== this.node.id) {
            this._prevEdtActions = [];
            this._nextEdtActions = [];
            this._edtNode = this.node.id;
        }
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
        if (this._edtNode !== this.node.id) {
            this._prevEdtActions = [];
            this._nextEdtActions = [];
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
        if (this._edtNode !== this.node.id) {
            this._prevEdtActions = [];
            this._nextEdtActions = [];
            return undefined;
        }
        const actions = this._nextEdtActions.pop();
        this._prevEdtActions.push(actions);
        return actions;
    }

    clearModifiedNode() {
        this._modifiedNodeSet = new Set([this.node.id]);
    }

    flagModifiedNode(nodeID: string) {
        // console.log(`adding ${nodeID} to modified node list`);
        this._modifiedNodeSet.add(nodeID);
    }

    checkModifiedNode(nodeID: string) {
        return this._modifiedNodeSet.has(nodeID);
    }

    numModifiedNode() {
        return this._modifiedNodeSet.size;
    }

    getExecutableNodes() {
        const checkList = new Set([0]);
        this._modifiedNodeSet.forEach(nodeID => {
            this.recursiveDownstreamNodeCheck(nodeID, checkList);
        });
        return checkList;
    }

    private recursiveDownstreamNodeCheck(nodeID: string, checkList: Set<number>) {
        for (let i = 0; i < this.flowchart.nodes.length; i++) {
            const node = this.flowchart.nodes[i];
            if (!node.enabled) { continue; }
            if (node.id === nodeID) {
                checkList.add(i);
                if (node.output.edges) {
                    node.output.edges.forEach((edge: IEdge) => {
                        this.recursiveDownstreamNodeCheck(edge.target.parentNode.id, checkList);
                    });
                }
                return;
            }
        }
    }

    setbackup_header() {
        this._backupDialogType = null;
    }

    setbackup_updateImported(func) {
        this._backupDialogType = func;
    }

    checkbackup_header() {
        return !this._backupDialogType;
    }

    getbackup() {
        return this._backupDialogType;
    }

    triggerToolsetUpdate() {
        this.toolsetUpdate.next();
    }

}
