import { Component, Input } from '@angular/core';
import { INode } from '@models/node';
import { PortUtils } from '@models/port';

@Component({
  selector: 'add-output',
  template:  `<button (click)='addOutput()'>AddOutput</button>`,
  styles: [ ]
})
export class AddOutputComponent {

    @Input() node: INode;
    constructor() {}

    addOutput(): void {
      return;
      /*
      let newPort = PortUtils.getNewOutput();
      newPort.parentNode = this.node;
      this.node.output.push(newPort);
      */
    }

}
