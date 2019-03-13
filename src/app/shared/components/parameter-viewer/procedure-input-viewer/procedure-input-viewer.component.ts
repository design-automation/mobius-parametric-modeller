import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProcedure } from '@models/procedure';
import { InputType } from '@models/port';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '13px Arial';

@Component({
  selector: 'procedure-input-viewer',
  templateUrl: './procedure-input-viewer.component.html',
  styleUrls: ['./procedure-input-viewer.component.scss']
})
export class ProcedureInputViewerComponent {

    @Input() prod: IProcedure;
    @Output() delete = new EventEmitter();
    PortTypes = InputType;

    constructor() { }

    editOptions(): void { }

    onFileChange(event) {
      this.prod.args[this.prod.argCount - 1].value = event.target.files[0];
    }

    displayConstName() {
        let val = this.prod.args[this.prod.argCount - 2].value;
        if (!val) {
            return 'undefined :';
        }
        if (val[0] === '"' || val[0] === '\'') {
            val = val.substring(1, val.length - 1);
        }
        // return val.replace(/_/g, ' ') + ':';
        return val + ':';
    }

    inputSize(val) {
        return ctx.measureText(val).width + 7;
    }

    openFileBrowse(id) {
        document.getElementById(`file_${id}`).click();
    }

}
