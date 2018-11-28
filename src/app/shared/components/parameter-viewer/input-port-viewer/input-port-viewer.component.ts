import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPortInput, InputType } from '@models/port';

@Component({
  selector: 'input-port-viewer',
  templateUrl: './input-port-viewer.component.html',
  styleUrls: ['./input-port-viewer.component.scss']
})
export class InputPortViewerComponent {

    @Input() port: IPortInput;
    PortTypes = InputType;

    constructor() { }

    onFileChange(event) {
      this.port.value = event.target.files[0];
    }

}
