import { Component } from '@angular/core';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent{

    private flowchart: IFlowchart;
    constructor(private dataService: DataService){
        this.flowchart = dataService.flowchart;
    }

    selectNode(node_index: number): void{  
      if( typeof(node_index) == 'number' ){
          this.flowchart.meta.selected_nodes = [node_index];  
      }
    }
    
}

