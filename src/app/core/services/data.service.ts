import { Injectable } from '@angular/core';
import { IMobius } from '@models/mobius';
import { IFlowchart, FlowchartUtils } from '@models/flowchart';
import { INode } from '@models/node'; 


@Injectable()
export class DataService {
  private static _data: IMobius = {
    name: "default_file",
    author: "new_user", 
    last_updated: new Date(),
    version: 1,
    flowchart: FlowchartUtils.newflowchart()
  }; 

  private static _selected: number = 0;

    get file(){ return DataService._data; }
    set file(data: IMobius){ 
        DataService._data = <IMobius>{
            name: data.name, 
            author: data.author, 
            flowchart: data.flowchart, 
            last_updated: data.last_updated, 
            version: data.version
        };
    }

    get flowchart(): IFlowchart{ return DataService._data.flowchart; }
    get node(): INode{ return DataService._data.flowchart.nodes[DataService._selected] };
}