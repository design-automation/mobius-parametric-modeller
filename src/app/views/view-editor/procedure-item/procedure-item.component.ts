import { Component, Input, Output,  EventEmitter, OnInit, OnDestroy, AfterViewInit} from '@angular/core';

import { IProcedure, ProcedureTypes } from '@models/procedure';
import { ProcedureTypesAware, ModuleDocAware } from '@shared/decorators';

import { _parameterTypes} from '@modules';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '11px Arial';

@ProcedureTypesAware
@ModuleDocAware
@Component({
    selector: 'procedure-item',
    templateUrl: './procedure-item.component.html',
    styleUrls: ['procedure-item.component.scss']
})
export class ProcedureItemComponent {
    @Input() data: IProcedure;
    @Output() delete = new EventEmitter();
    @Output() select = new EventEmitter();
    @Output() copied = new EventEmitter();
    @Output() pasteOn = new EventEmitter();
    @Output() helpText = new EventEmitter();

    ProcedureTypes = ProcedureTypes;


    // delete this procedure
    emitDelete(): void {
        this.delete.emit();
    }

    // select this procedure
    emitSelect(event, procedure: IProcedure) {
        event.stopPropagation();
        this.select.emit({'ctrl': event.ctrlKey, 'prod': procedure});
    }

    // delete child procedure (after receiving emitDelete from child procedure)
    deleteChild(index: number): void {
        this.data.children.splice(index, 1);
    }

    // select child procedure (after receiving emitSelect from child procedure)
    selectChild(event, procedure: IProcedure) {
        this.select.emit(event);
    }

    markPrint() {
        this.data.print = !this.data.print;
    }

    markDisabled() {
        this.data.enabled = !this.data.enabled;
    }

    canBePrinted() {
        return (this.data.argCount > 0 && this.data.args[0].name === 'var_name');
    }

    haveHelpText() {
        return (this.data.type === ProcedureTypes.Function || this.data.type ===  ProcedureTypes.Imported);
    }

    emitHelpText($event) {
        if ($event) {
            this.helpText.emit($event);
            return;
        }
        try {
            if (this.data.type === ProcedureTypes.Imported) {
                this.helpText.emit(this.data.meta.name);
                // this.helpText.emit(this.ModuleDoc[this.data.meta.module][this.data.meta.name]);

            } else {
            // @ts-ignore
            this.helpText.emit(this.ModuleDoc[this.data.meta.module][this.data.meta.name]);
            }
        } catch (ex) {
            this.helpText.emit('error');
        }

    }

    // stopPropagation to prevent cut/paste with input box focused
    stopProp(event): void {
        event.stopPropagation();
    }

    // modify variable input: replace space " " with underscore "_"
    varMod(event) {
        if (!event) { return event; }
        let str = event.trim();
        str = str.replace(/ /g, '_');
        return str;
    }

    // modify argument input: check if input is valid
    argMod(event: string) {
        return event;

        console.log(event);
        const string = event.trim();
        if ( string.substring(0, 1) === '@' || (/^[a-zA-Z_$][0-9a-zA-Z_$]*/i).test(string)) {
            return event;
        }
        try {
            JSON.parse(string);
        } catch (ex) {
            console.log('.........', ex);
            // document.activeElement.style.error = true;
        }

        return event;
    }

    inputSize(val) {
        return ctx.measureText(val).width + 2;
    }
}
