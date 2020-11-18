import { Component, Input } from '@angular/core';
import { DataService } from '@shared/services';

@Component({
  selector: 'publish-header',
  templateUrl:  'publish-header.component.html',
  styleUrls: ['publish-header.component.scss']
})
export class PublishHeaderComponent {

    @Input() title: string;
    expando_href: string;

    constructor(private dataService: DataService) {
    }

    getTitle() {
        return this.title.replace(/_/g, ' ');
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
