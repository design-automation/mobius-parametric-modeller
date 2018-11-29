import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';

@Component({
  selector: 'view-publish',
  templateUrl: './view-publish.component.html',
  styleUrls: ['./view-publish.component.scss']
})
export class ViewPublishComponent {

    constructor(private dataService: DataService) {}

    selectNode(node_index: number): void {
      if ( typeof(node_index) === 'number' ) {
          this.dataService.flowchart.meta.selected_nodes = [node_index];
      }
    }

    getEndNode(): INode {
      for (const node of this.dataService.flowchart.nodes) {
        if (node.type === 'end') { return node; }
      }
    }

}

