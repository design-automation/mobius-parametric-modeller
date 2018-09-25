import { Component } from '@angular/core';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';
import { IMobius } from '@models/mobius';

@Component({
  selector: 'view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent{

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
        //this.dataService.file = JSON.parse($event);
        this.file = JSON.parse($event);
        this.flowchart = this.file.flowchart;
    }
    
}
