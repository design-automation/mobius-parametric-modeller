import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProcedure } from '@models/procedure';
import { InputType } from '@models/port';
const keys = Object.keys(InputType);

@Component({
  selector: 'procedure-input-editor',
  templateUrl: './procedure-input-editor.component.html',
  styleUrls: ['./procedure-input-editor.component.scss']
})
export class ProcedureInputEditorComponent {

    @Input() prod: IProcedure;
    @Output() delete = new EventEmitter();

    PortTypes = InputType;
    PortTypesArr = keys.slice(keys.length / 2);

    constructor() { }

    editOptions(): void { }

    onFileChange(event) {
      this.prod.args[this.prod.argCount - 1].default = event.target.files[0];
    }

}
