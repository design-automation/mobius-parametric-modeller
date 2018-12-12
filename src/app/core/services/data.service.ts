import { Injectable } from '@angular/core';
import { IMobius } from '@models/mobius';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { INode } from '@models/node';

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

    private static _activeModelView: string = undefined;

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

    get activeView() {return DataService._activeModelView; }
    set activeView(view: string) {DataService._activeModelView = view; }

    get flowchart(): IFlowchart { return DataService._data.flowchart; }
    get node(): INode { return DataService._data.flowchart.nodes[DataService._data.flowchart.meta.selected_nodes[0]]; }

}
