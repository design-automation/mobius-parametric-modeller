import { Component, Input } from '@angular/core';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';
import { IMobius } from '@models/mobius';
import * as circularJSON from 'circular-json';

@Component({
  selector: 'view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent{
    @Input() flowchart: IFlowchart; 

    constructor(){}

    selectNode(node_index: number): void{  
        if( typeof(node_index) == 'number' ){
            this.flowchart.meta.selected_nodes = [node_index];  
        }
    }

    importFunction($event){
        for (let func of $event){
            this.flowchart.functions.push(func);
        }
    }

}
