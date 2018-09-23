import { Component } from '@angular/core';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';
import { IMobius } from '@models/mobius';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent{

    private file: IMobius;
    private flowchart: IFlowchart; 

    constructor(private dataService: DataService){
        this.file = dataService.file;
        this.flowchart = dataService.flowchart;
    }

    selectNode(node_index: number): void{  
        if( typeof(node_index) == 'number' ){
            this.flowchart.meta.selected_nodes = [node_index];  
        }
    }

    updateFile($event: string){
        this.dataService.file = JSON.parse($event);
    }
    
}
