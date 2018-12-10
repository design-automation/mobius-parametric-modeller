import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';

@Component({
  selector: 'view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss']
})
export class ViewDashboardComponent {

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

