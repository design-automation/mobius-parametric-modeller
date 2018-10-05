import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPortInput } from '@models/port';
import { PortTypesAware } from '@shared/decorators';

@PortTypesAware
@Component({
  selector: 'input-port-viewer',
  templateUrl: './input-port-viewer.component.html',
  styleUrls: ['./input-port-viewer.component.scss']
})
export class InputPortViewerComponent{

    @Input() port: IPortInput;
    constructor(){ }

}