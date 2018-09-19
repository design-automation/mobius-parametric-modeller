import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPortInput } from '@models/port';

@Component({
  selector: 'input-port-viewer',
  templateUrl: './input-port-viewer.component.html',
  styleUrls: ['./input-port-viewer.component.scss']
})
export class InputPortViewerComponent{

    @Input() port: IPortInput;
    @Output() delete = new EventEmitter();

    constructor(){ }

    editOptions(): void{

    }

}