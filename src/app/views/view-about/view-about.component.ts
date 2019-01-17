import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';

@Component({
  selector: 'view-about',
  templateUrl: './view-about.component.html',
  styleUrls: ['./view-about.component.scss']
})
export class ViewAboutComponent {

    constructor(private dataService: DataService, private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url);
    }

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

    viewerData(): any {
        const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) { return ''; }
        // if (node.type === 'output') { return node.input.value; }
        return node.model;
    }

    setSplit(event) {
        this.dataService.splitUpdate = true;
        this.dataService.splitVal = event.sizes[1];
    }

    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
}

