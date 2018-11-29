import { Component, Input } from '@angular/core';
import { NodeUtils } from '@models/node';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'add-node',
  template:  `<button (click)='addNode()'>AddNode</button>`,
  styles: [ ]
})
export class AddNodeComponent {

    @Input() flowchart: IFlowchart;
    constructor() {}

    addNode(): void {  this.flowchart.nodes.push(NodeUtils.getNewNode()); }

}
