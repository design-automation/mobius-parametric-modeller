import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPortInput } from '@models/port';

@Component({
  selector: 'input-port-editor',
  templateUrl: './input-port-editor.component.html',
  styleUrls: ['./input-port-editor.component.scss']
})
export class InputPortEditorComponent{

    @Input() port: IPortInput;
    @Output() delete = new EventEmitter();

    constructor(){ }

    editOptions(): void{

    }

}