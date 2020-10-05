import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { DataOutputService } from '@shared/services/dataOutput.service';


@Component({
  selector: 'view-minimal',
  templateUrl: './view-minimal.component.html',
  styleUrls: ['./view-minimal.component.scss']
})
export class ViewMinimalComponent implements AfterViewInit {


    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url.split(/\s*&*\s*node\s*=/)[0]);
    }

    ngAfterViewInit() {
        setTimeout(() => {
        }, 100);
    }

    viewerData() {
        return this.dataOutputService.getViewerData(this.dataService.node, this.dataService.flowchart.model, true);
    }

    updateNode() {
        const nodeSelInput = <HTMLInputElement> document.getElementById('hidden_node_selection');
        const selectedNode = nodeSelInput.value;
        nodeSelInput.value = null;
        if (selectedNode === this.dataService.node.name) { return; }
        for (let i = 0; i < this.dataService.flowchart.nodes.length; i ++) {
            const node = this.dataService.flowchart.nodes[i];
            if (node.name === selectedNode) {
                this.dataService.flowchart.meta.selected_nodes = [i];
                return;
            }
        }
    }

    notifyMessage(event) {
        this.dataService.notifyMessage(event.target.value);
        event.target.value = '';
    }
}

