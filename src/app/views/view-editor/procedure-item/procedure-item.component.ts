import { Component, Input, Output,  EventEmitter} from '@angular/core';

import { IProcedure, ProcedureTypes } from '@models/procedure';
import { ModuleDocList } from '@shared/decorators';

import { _parameterTypes} from '@modules';

import { inline_func } from '@assets/core/inline/inline';
import * as Modules from '@modules';
import { DataService } from '@services';
import { IArgument } from '@models/code';

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

const mathFuncs = [];
for (const funcMod of inline_func) {
    for (const func of funcMod[1]) {
        mathFuncs.push(func[0].split('(')[0]);
    }
}


@Component({
    selector: 'procedure-item',
    templateUrl: './procedure-item.component.html',
    styleUrls: ['procedure-item.component.scss']
})
export class ProcedureItemComponent {
    @Input() data: IProcedure;
    @Input() disableInput: boolean;
    @Output() delete = new EventEmitter();
    @Output() deleteC = new EventEmitter();
    @Output() select = new EventEmitter();
    @Output() copied = new EventEmitter();
    @Output() pasteOn = new EventEmitter();
    @Output() helpText = new EventEmitter();

    ProcedureTypes = ProcedureTypes;

    private keys = Object.keys(ProcedureTypes);
    ProcedureTypesArr = this.keys.slice(this.keys.length / 2);
    ModuleDoc = ModuleDocList;

    constructor(private dataService: DataService) {
    }

    static modifyVarArg(value: string, arg: IArgument) {
        let str = value.trim();
        str = str.replace(/ /g, '_');
        str = str.toLowerCase();
        if ((str.match(/\[/g) || []).length !== (str.match(/\]/g) || []).length) {
            arg.invalidVar = true;
            return str;
        }
        const strSplit = str.split(/[\@\[\]]/g);
        let teststr = str;
        for (const i of strSplit) {
            if (i === '') { continue; }
            if (i === '0' || Number(i)) {
                const sStr = `[${i}]`;
                const ind = teststr.indexOf(sStr);
                if (ind === -1) {
                    arg.invalidVar = true;
                    return str;
                }
                teststr = teststr.slice(0, ind) + teststr.slice(ind + sStr.length);
                continue;
            }
            try {
                if (i[0] === '_') {
                    arg.invalidVar = true;
                    return str;
                }
                for (const reserved of reservedWords) {
                    if (i === reserved) {
                        arg.invalidVar = true;
                        return str;
                    }
                }
                for (const funcName of mathFuncs) {
                    if (i === funcName) {
                        arg.invalidVar = true;
                        return str;
                    }
                }
                let currentWindow;
                if (window.hasOwnProperty(i)) {
                    currentWindow = window[i];
                }
                const fn = new Function('', `${i}=1;`);
                fn();
                delete window[i];
                if (currentWindow) {
                    window[i] = currentWindow;
                }

                arg.invalidVar = false;
            } catch (ex) {
                arg.invalidVar = true;
                return str;
            }
        }
        return str;

    }


    // select this procedure
    emitSelect(event, procedure: IProcedure) {
        event.stopPropagation();
        this.select.emit({'ctrl': event.ctrlKey, 'shift': event.shiftKey, 'prod': procedure});
    }

    disableShift(event: MouseEvent) {
        if ((<Element>event.target).tagName === 'INPUT') { return; }
        if (event.shiftKey) {
            event.preventDefault();
        }
    }

    // select child procedure (after receiving emitSelect from child procedure)
    selectChild(event, procedure: IProcedure) {
        this.select.emit(event);
    }

    markPrint(event: MouseEvent) {
        event.stopPropagation();
        if (!this.data.selected) {
            this.data.print = !this.data.print;
            return;
        }
        const prodList = this.dataService.node.state.procedure;
        const newPrint = ! prodList[prodList.length - 1].print;
        for (const prod of prodList) {
            if (prod.argCount > 0 && prod.args[0].name === 'var_name') {
                prod.print = newPrint;
            }
        }
        // this.data.print = !this.data.print;
    }

    markDisabled(event: MouseEvent) {
        event.stopPropagation();
        if (!this.data.selected) {
            this.data.enabled = !this.data.enabled;
            return;
        }
        const prodList = this.dataService.node.state.procedure;
        const newEnabled = ! prodList[prodList.length - 1].enabled;
        for (const prod of prodList) {
            if (prod.type === ProcedureTypes.Blank || prod.type === ProcedureTypes.Comment) { continue; }
            prod.enabled = newEnabled;
        }
        // this.data.enabled = !this.data.enabled;
    }

    // delete child procedure (after receiving emitDelete from child procedure)
    deleteChild(index: number): void {
        this.dataService.registerEdtAction([{'type': 'del', 'parent': this.data, 'index': index, 'prod': this.data.children[index]}]);
        this.data.children.splice(index, 1);
    }


    // delete this procedure
    emitDelete(): void {
        if (! this.data.selected) {
            this.deleteC.emit();
        } else {
            this.delete.emit();
        }
    }

    canBePrinted() {
        return this.data.type === ProcedureTypes.Return ||
               (this.data.argCount > 0 && this.data.args[0].name === 'var_name');
    }

    haveHelpText() {
        return (this.data.type === 8 || this.data.type ===  9);
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

    // modify variable input: replace space " " with underscore "_"
    varMod(event: string) {
        if (!event) { return event; }
        return ProcedureItemComponent.modifyVarArg(event, this.data.args[0]);
    }


    // modify argument input: check if input is valid
    argMod(event: Event, argIndex: number) {
        // this.dataService.focusedInput = [event.target, (<HTMLInputElement>event.target).selectionStart];
        this.dataService.focusedInput = event.target;
        if (!this.data.args[argIndex].value) { return; }
        const vals = this.data.args[argIndex].value.split('"');
        let result = '';
        let startOnEven = true;
        for (let i = 0; i < vals.length; i += 2) {
            if (i > 0) {
                if (startOnEven) {
                    result += ' "' + vals[i - 1] + '" ';
                } else {
                    result += '"' + vals[i - 1] + '"';
                }
            }
            const valSplit = vals[i].split(`'`);
            for (let j = startOnEven ? 0 : 1; j < valSplit.length; j += 2) {
                if (j === 1) {
                    result += valSplit[0] + `' `;
                } else if (j > 1) {
                    result += ` '` + valSplit[j - 1] + `' `;
                }
                result += valSplit[j].replace(
                    /\s*([\[\]])\s*/g, '$1').replace(
                    /([\+\-\*\/\%\{\}\(\)\,\<\>\=\!])/g, ' $1 ')
                    .replace(/([\<\>\=\!])\s+=/g, '$1=')
                    .trim().replace(/\s{2,}/g, ' ');
                if (j === valSplit.length - 2 ) {
                    result += ` '` + valSplit[j + 1];
                }
            }
            if (valSplit.length % 2 === 0) {
                startOnEven = !startOnEven;
            }

            // result += vals[i].replace(
            //     /\s*([\[\]])\s*/g, '$1').replace(
            //     /([\+\-\*\/\%\{\}\(\)\,\<\>\=\!])/g, ' $1 ')
            //     .replace(/([\<\>\=\!])\s+=/g, '$1=')
            //     .trim().replace(/\s{2,}/g, ' ');
            if (i === vals.length - 2 ) {
                result += ' "' + vals[i + 1] + '" ';
            }
        }
        this.data.args[argIndex].value = result.trim();
        // this.data.args[argIndex].value = this.data.args[argIndex].value.replace(
        //     /\s*([\[\]])\s*/g, '$1').replace(
        //     /([\+\-\*\/\%\{\}\(\)\,\<\>\=\!])/g, ' $1 ')
        //     .replace(/([\<\>\=\!])\s+=/g, '$1=')
        //     .trim().replace(/\s{2,}/g, ' ');
    }

    // argHighlight(value: any) {
    //     return value.replace(
    //         inline_fn_regEx, '<span class = "inline-function">' + value.match(inline_fn_regEx) + '</span>'
    //     );
    // }

    inputSize(val) {
        return ctx.measureText(val).width + 7;
    }


    onInputFocus() {
        for (const prod of this.dataService.node.state.procedure) {
            prod.selected = false;
        }
        this.dataService.node.state.procedure = [];
    }

    checkEnum(param, index: number): boolean {
        try {
            if (param.name[0] === '_') {
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
