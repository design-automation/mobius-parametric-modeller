import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { IProcedure } from '@models/procedure';
import { InputType } from '@models/port';
import { modifyVarArg } from '@shared/parser';
const keys = Object.keys(InputType);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '13px Arial';

@Component({
  selector: 'procedure-input-editor',
  templateUrl: './procedure-input-editor.component.html',
  styleUrls: ['./procedure-input-editor.component.scss']
})
export class ProcedureInputEditorComponent {

    @Input() prod: IProcedure;
    @Input() disableInput: boolean;
    @Output() delete = new EventEmitter();
    @Output() deleteC = new EventEmitter();
    @Output() disableProds = new EventEmitter();
    @Output() selectInp = new EventEmitter();
    @Output() updateGlbs = new EventEmitter();

    PortTypes = InputType;
    PortTypesArr = keys.slice(keys.length / 2);

    constructor() {
    }

    selectInput(event: MouseEvent) {
        event.stopPropagation();
        this.selectInp.emit({'ctrl': event.ctrlKey || event.metaKey, 'shift': event.shiftKey, 'prod': this.prod});
    }

    emitClearSelect(event: MouseEvent) {
        event.stopPropagation();
        this.selectInp.emit('clear');
    }

    editOptions(): void { }

    openFileBrowse(id) {
        document.getElementById(`file_${id}`).click();
    }
    onFileChange(event) {
        this.prod.args[this.prod.argCount - 1].default = event.target.files[0];
    }

    inputSize(val, defaultVal) {
        if (val === undefined || val === '') { return ctx.measureText(defaultVal).width + 8; }
        return ctx.measureText(val).width + 7;
    }

    // delete this procedure
    deleteProd(): void {
        if (!this.prod.selected) {
            this.deleteC.emit();
        } else {
            this.delete.emit();
        }
    }

    markDisabled() {
        if (!this.prod.selected) {
            this.prod.enabled = ! this.prod.enabled;
        } else {
            this.disableProds.emit();
        }
    }

    updateMin(args, event) {
        if (event.type === 'keyup' && event.which !== 13) { return; }
        const currentVal = Number(event.target.value);
        if (currentVal !== 0 && !currentVal) { return; }
        if (Number(args.max) && Number(args.max) < currentVal) {
            args.min = args.max;
            event.target.value = args.min;
        } else {
            args.min = event.target.value;
        }
        if (!args.default || args.default < Number(args.min)) {
            args.default = Number(args.min);
        }
    }

    updateMax(args, event) {
        if (event.type === 'keyup' && event.which !== 13) { return; }
        const currentVal = Number(event.target.value);
        if (currentVal !== 0 && !currentVal) { return; }
        if (Number(args.min) && Number(args.min) > currentVal) {
            args.max = args.min;
            event.target.value = args.max;
        } else {
            args.max = event.target.value;
        }
        if (!args.default || args.default > Number(args.max)) {
            args.default = Number(args.max);
        }
    }

    // modify variable input: replace space " " with underscore "_"
    varMod() {
        if (!this.prod.args[0].value) { return; }
        this.updateGlbs.emit('');
        // this.prod.args[0].value = modifyVarArg(this.prod.args[0]);
    }

    disableShift(event: MouseEvent) {
        if ((<Element>event.target).tagName === 'INPUT') { return; }
        if (event.shiftKey) {
            event.preventDefault();
        }
    }

}
