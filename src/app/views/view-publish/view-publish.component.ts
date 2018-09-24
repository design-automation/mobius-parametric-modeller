import { Component } from '@angular/core';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'view-publish',
  templateUrl: './view-publish.component.html',
  styleUrls: ['./view-publish.component.scss']
})
export class ViewPublishComponent{

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

