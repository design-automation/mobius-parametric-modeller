import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { IProcedure } from '@models/procedure';
import { InputType } from '@models/port';
import { modifyVarArg } from '@shared/parser';
const keys = Object.keys(InputType);

@Component({
  selector: 'procedure-input-editor',
  templateUrl: './procedure-input-editor.component.html',
  styleUrls: ['./procedure-input-editor.component.scss']
})
export class ProcedureInputEditorComponent implements OnDestroy {

    @Input() prod: IProcedure;
    @Input() disableInput: boolean;
    @Output() eventAction = new EventEmitter();

    PortTypes = InputType;
    PortTypesArr = keys.slice(keys.length / 2);
    private ctx = document.createElement('canvas').getContext('2d');

    constructor() {
        this.ctx.font = 'bold 12px arial';
    }

    ngOnDestroy() {
        this.ctx = null;
    }

    selectInput(event: MouseEvent) {
        event.stopPropagation();
        this.eventAction.emit({
            'type': 'selectInp',
            'content': {'ctrl': event.ctrlKey || event.metaKey, 'shift': event.shiftKey, 'prod': this.prod}
        });
    }

    emitClearSelect(event: MouseEvent) {
        event.stopPropagation();
        this.eventAction.emit({
            'type': 'selectInp',
            'content': 'clear'
        });
    }

    // delete this procedure
    deleteProd(): void {
        if (!this.prod.selected) {
            this.eventAction.emit({
                'type': 'deleteC'
            });
        } else {
            this.eventAction.emit({
                'type': 'delete'
            });
        }
    }

    markDisabled() {
        if (!this.prod.selected) {
            this.prod.enabled = ! this.prod.enabled;
        } else {
            this.eventAction.emit({
                'type': 'disableProds'
            });
        }
    }

    // modify variable input: replace space " " with underscore "_"
    varMod() {
        if (!this.prod.args[0].value) { return; }
        this.eventAction.emit({
            'type': 'updateGlbs',
        });
        // this.prod.args[0].value = modifyVarArg(this.prod.args[0]);
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

    formOptionList() {
        if (!this.prod.args[this.prod.argCount - 1].max) { return; }
        try {
            let str: string = this.prod.args[this.prod.argCount - 1].max;
            if (str[0] === '[') { str = str.substring(1); }
            if (str[str.length - 1] === ']') { str = str.substring(0, str.length - 1); }
            this.prod.args[this.prod.argCount - 1].min = str.split(',').map(x => x.trim());
        } catch (ex) {
            this.prod.args[this.prod.argCount - 1].min = null;
        }
    }

    editOptions(): void { }

    openFileBrowse(id) {
        document.getElementById(`file_${id}`).click();
    }

    onFileChange(event) {
        this.prod.args[this.prod.argCount - 1].value = event.target.files[0];
    }

    inputSize(val, defaultVal) {
        if (val === undefined || val === '') { return this.ctx.measureText(defaultVal).width + 8; }
        return this.ctx.measureText(val).width + 7;
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
        if (!args.value || args.value < Number(args.min)) {
            args.value = Number(args.min);
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
        if (!args.value || args.value > Number(args.max)) {
            args.value = Number(args.max);
        }
    }

    disableShift(event: MouseEvent) {
        if ((<Element>event.target).tagName === 'INPUT') { return; }
        if (event.shiftKey) {
            event.preventDefault();
        }
    }

}
