import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { IProcedure, ProcedureTypes } from '@models/procedure';
import { InputType } from '@models/port';
const keys = Object.keys(InputType);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '13px Arial';

@Component({
  selector: 'procedure-input-editor',
  templateUrl: './procedure-input-editor.component.html',
  styleUrls: ['./procedure-input-editor.component.scss']
})
export class ProcedureInputEditorComponent implements AfterViewInit {

    @Input() prod: IProcedure;

    PortTypes = InputType;
    PortTypesArr = keys.slice(keys.length / 2);

    constructor() {
    }

    ngAfterViewInit() {
        // console.log(this.prod);
    }

    editOptions(): void { }

    onFileChange(event) {
      this.prod.args[this.prod.argCount - 1].default = event.target.files[0];
    }

    inputSize(val, defaultVal) {
        if (val === undefined || val === '') { return ctx.measureText(defaultVal).width + 5; }
        return ctx.measureText(val).width + 5;
    }

}
