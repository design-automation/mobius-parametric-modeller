import { Injectable } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node'; 
import { InputType, OutputType, } from '@models/port';

@Injectable()
export class DataService {
  private static _data = {
    name: "default_file.mob",
    author: "new_user", 
    flowchart: <IFlowchart>{ 
                    language: "js",
                    modules: [],
                    meta: {
                        selected_nodes: [0]
                    },
                    nodes: [
                        {   
                            id: 'asdads',
                            name: "first_node", 
                            position: {x: 0, y: 0}, 
                            procedure: [],
                            inputs: [
                                {
                                    name: 'a--input', 
                                    default: 0,
                                    value: 0,
                                    isConnected: false,
                                    meta: {
                                        mode: InputType.Slider, 
                                        opts: { min: 0, max: 12, increment: 1}
                                    }
                                }
                            ],
                            outputs: [
                                {
                                    name: 'a-output', 
                                    isConnected: false,
                                    meta: {
                                        mode: OutputType.Text, 
                                    }
                                }
                            ]
                        }, 
                        {
                            id: 'sadsdad',
                            name: "second_node", 
                            position: {x: 0, y: 0},
                            procedure: [],
                            outputs: [
                                { name: 'result' }
                            ]
                        }, 
                    ],
                    edges: [
                        { id: '123213', start: [ 0, 1 ], end: [] }
                    ]
                },
    last_updated: new Date(),
    version: 1
  }; 

  private static _selected: number = 0;

  get flowchart(): IFlowchart{ return DataService._data.flowchart; }
  get node(): INode{ return DataService._data.flowchart.nodes[DataService._selected] };
}