import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPortOutput } from '@models/port';

@Component({
  selector: 'output-port-editor',
  templateUrl: './output-port-editor.component.html',
  styleUrls: ['./output-port-editor.component.scss']
})
export class OutputPortEditorComponent{

    @Input() port: IPortOutput;
    @Output() delete = new EventEmitter();

    constructor(){}

    editOptions(): void{

    }

}