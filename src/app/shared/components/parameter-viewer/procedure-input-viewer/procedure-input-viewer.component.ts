import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IProcedure } from '@models/procedure';
import { InputType } from '@models/port';

@Component({
  selector: 'procedure-input-viewer',
  templateUrl: './procedure-input-viewer.component.html',
  styleUrls: ['./procedure-input-viewer.component.scss']
})
export class ProcedureInputViewerComponent implements OnDestroy {

    @Input() prod: IProcedure;
    @Output() delete = new EventEmitter();
    PortTypes = InputType;
    private ctx = document.createElement('canvas').getContext('2d');

    constructor() {
        this.ctx.font = '13px Arial';

    }

    ngOnDestroy() {
        this.ctx = null;
    }

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
        return this.ctx.measureText(val).width + 7;
    }

    openFileBrowse(id) {
        document.getElementById(`file_${id}`).click();
    }

    replaceQuotes(val) {
        return val.replace(/(^[\'\"])|([\'\"]$)/g, '');
    }

    getDropdownOptions() {
        if (this.prod.args[this.prod.argCount - 1].min) {
            return this.prod.args[this.prod.argCount - 1].min;
            try {
                return this.prod.args[this.prod.argCount - 1].min.map((val: string) => {
                    let x = val;
                    if (x[0] === '"' || x[0] === '\'') { x = x.substring(1); }
                    if (x[x.length - 1] === '"' || x[x.length - 1] === '\'') { x = x.substring(0, x.length - 1); }
                    return x;
                });
            } catch (ex) {
                return [];
            }
        }
        return [];
    }

}
