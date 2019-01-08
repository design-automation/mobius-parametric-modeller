import { Component, Input, Output,  EventEmitter, OnInit, OnDestroy, AfterViewInit} from '@angular/core';

import { IProcedure, ProcedureTypes } from '@models/procedure';
import { ModuleDocList } from '@shared/decorators';

import { _parameterTypes} from '@modules';

import { inline_func } from '../toolset/toolset.inline';
import * as Modules from '@modules';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '12px Arial';

const reservedWords = [
    'abstract', 'arguments', 'await', 'boolean',
    'break', 'byte', 'case', 'catch',
    'char', 'class', 'const', 'continue',
    'debugger', 'default', 'delete', 'do',
    'double', 'else', 'enum', 'eval',
    'export', 'extends', 'false', 'final',
    'finally', 'float', 'for', 'function',
    'goto', 'if', 'implements', 'import',
    'in', 'instanceof', 'int', 'interface',
    'let', 'long', 'native', 'new',
    'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static',
    'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'true',
    'try', 'typeof', 'var', 'void',
    'volatile', 'while', 'with', 'yield',

    'Array', 'Date', 'hasOwnProperty', 'Infinity',
    'isFinite', 'isNaN', 'isPrototypeOf', 'length',
    'Math', 'NaN', 'name', 'Number', 'Object',
    'prototype', 'String', 'toString', 'undefined', 'valueOf'
];


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

    private keys = Object.keys(ProcedureTypes);
    ProcedureTypesArr = this.keys.slice(this.keys.length / 2);
    invalidVar = false;
    mathFuncs = [];
    ModuleDoc = ModuleDocList;

    constructor() {
        for (const funcMod of inline_func) {
            for (const func of funcMod[1]) {
                this.mathFuncs.push(func[0].split('(')[0]);
            }
        }
    }


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
        return this.data.type === ProcedureTypes.Return ||
               (this.data.argCount > 0 && this.data.args[0].name === 'var_name');
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
            this.helpText.emit(this.ModuleDoc[this.data.meta.module][this.data.meta.name]);
            }
        } catch (ex) {
            this.helpText.emit('error');
        }

    }

    // stopPropagation to prevent cut/paste with input box focused
    stopProp(event): void {
        // event.stopPropagation();
    }

    // modify variable input: replace space " " with underscore "_"
    varMod(event) {
        if (!event) { return event; }
        let str = event.trim();
        str = str.replace(/ /g, '_');
        str = str.toLowerCase();
        if ((str.match(/\[/g) || []).length !== (str.match(/\]/g) || []).length) {
            this.invalidVar = true;
            return str;
        }
        const strSplit = str.split(/[\@\[\]]/g);
        for (const i of strSplit) {
            if (i === '') { continue; }
            try {
                if (i.substring(0, 1) === '_') {
                    this.invalidVar = true;
                    return str;
                }
                for (const reserved of reservedWords) {
                    if (i === reserved) {
                        this.invalidVar = true;
                        return str;
                    }
                }
                for (const funcName of this.mathFuncs) {
                    if (i === funcName) {
                        this.invalidVar = true;
                        return str;
                    }
                }
                const fn = new Function('', `${i}=1;`);
                fn();
                this.invalidVar = false;
            } catch (ex) {
                // console.log(ex.message);
                this.invalidVar = true;
                return str;
            }
        }
        return str;
    }

    // modify argument input: check if input is valid
    argMod(event: string, argIndex: number) {
        if (!this.data.args[argIndex].value) { return; }
        this.data.args[argIndex].value = this.data.args[argIndex].value.replace(
            /\s*([\[\]])\s*/g, '$1').replace(
            // /([\+\-\*\/\%\[\]\{\}\(\)\,])/g, ' $1 ').trim().replace(/[ ]{2,}/g, ' ');
            /([\+\-\*\/\%\{\}\(\)\,])/g, ' $1 ').trim().replace(/[ ]{2,}/g, ' ');
            // /([\+\-\*\/\%\[\]\{\}\(\)\,])/g, ' $1 ').replace(
            // /@[a-z0-9]+\s\[\s/g, '[').trim().replace(/[ ]{2,}/g, ' ');
        return;

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

    checkEnum(param, index: number): boolean {
        try {
            if (param.name.substring(0, 1) === '_') {
                return false;
            }
            // @ts-ignore
            const arg = this.ModuleDoc[this.data.meta.module][this.data.meta.name].parameters[index];
            if (arg.description.toLowerCase().indexOf('enum') === -1 || !Modules[this.data.meta.module][arg.type]) {
                return false;
            }
            return true;
        } catch (ex) {
            return false;
        }
    }

    getEnum(index: number) {
        // @ts-ignore
        const enm = Modules[this.data.meta.module][this.ModuleDoc[this.data.meta.module][this.data.meta.name].parameters[index].type];
        const enumList = [];
        for (const i in enm) {
            if (! enm.hasOwnProperty(i)) {
                continue;
            }
            enumList.push(enm[i]);
        }
        return enumList;
    }
}
