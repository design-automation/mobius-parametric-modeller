import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'view-publish',
  templateUrl: './view-publish.component.html',
  styleUrls: ['./view-publish.component.scss']
})
export class ViewPublishComponent{
    @Input() flowchart: IFlowchart;

    constructor(){}

    selectNode(node_index: number): void{  
      if( typeof(node_index) == 'number' ){
          this.flowchart.meta.selected_nodes = [node_index];  
      }
    }
    
}

