import { Component, Input } from '@angular/core';
import { INode } from '@models/node';
import { PortUtils } from '@models/port';

@Component({
  selector: 'add-input',
  template:  `<button (click)='addInput()'>AddInput</button>`,
  styles: [ ]
})
export class AddInputComponent {

    @Input() node: INode;
    constructor() {}

    addInput(): void {
      return;
      /*
      let newPort = PortUtils.getNewInput();
      newPort.parentNode = this.node;
      this.node.input.push(newPort);
      */
    }

}
