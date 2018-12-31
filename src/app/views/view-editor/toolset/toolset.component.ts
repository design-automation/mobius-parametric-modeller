import { Component, Output, EventEmitter, Input} from '@angular/core';

import { ProcedureTypes, IFunction, IModule, IProcedure } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';
import * as CircularJSON from 'circular-json';
import { IArgument } from '@models/code';
import { ModuleAware, ModuleDocAware } from '@shared/decorators';
import { INode } from '@models/node';

import * as circularJSON from 'flatted';
import { DownloadUtils } from '@shared/components/file/download.utils';
import {inline_expr, inline_func} from './toolset.inline';
import { DataService } from '@services';

const keys = Object.keys(ProcedureTypes);
const inputEvent = new Event('input', {
    'bubbles': true,
    'cancelable': true
});
@ModuleAware
@ModuleDocAware
@Component({
  selector: 'toolset',
  templateUrl: './toolset.component.html',
  styleUrls: ['./toolset.component.scss']
})
export class ToolsetComponent {

    @Output() selected = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() imported = new EventEmitter();
    // @Input() functions: IFunction[];

    ProcedureTypes = ProcedureTypes;
    ProcedureTypesArr = keys.slice(keys.length / 2);
    searchedFunctions = [];
    searchedInlines = [];
    focusedInput: any;

    inlineExpr = inline_expr;
    inlineFunc = inline_func;

    constructor(private dataService: DataService) {
    }

    // add selected basic function as a new procedure
    add(type: ProcedureTypes, data?): void {
        this.selected.emit( { type: type, data: data } );
    }

    // add selected function from core.modules as a new procedure
    add_function(fnData) {
        // create a fresh copy of the params to avoid linked objects
        // todo: figure out
        fnData.args = fnData.args.map( (arg) => {
            return {name: arg.name, value: arg.value, default: arg.default};
            });

        this.selected.emit( { type: ProcedureTypes.Function, data: fnData } );
    }

    // add selected imported function as a new procedure
    add_imported_function(fnData) {
        fnData.args = fnData.args.map( (arg) => {
            return {name: arg.name, value: arg.value, type: arg.type};
            });
        this.selected.emit( { type: ProcedureTypes.Imported, data: fnData } );
    }

    setCurrent() {
        if (document.activeElement.tagName === 'INPUT') {
            this.focusedInput = document.activeElement;
        } else {
            this.focusedInput = undefined;
        }
    }

    add_inline(string) {
        if (!this.focusedInput) {
            return;
        }
        this.focusedInput.focus();
        this.focusedInput.value += string;

        this.focusedInput.dispatchEvent(inputEvent);
        // this.focusedInput.trigger('input');
    }

    // delete imported function
    delete_imported_function(fnData) {
        this.delete.emit(fnData);
    }


    // import a flowchart as function
    async import_function(event) {
        // read the file and create the function based on the flowchart
        const p = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function() {
                // parse the flowchart
                const fl = CircularJSON.parse(reader.result.toString()).flowchart;

                // create function and documentation of the function
                const funcs = [];
                const funcName = fl.name.replace(/\ /g, '_');
                const documentation = {
                    name: funcName,
                    module: 'Imported',
                    description: fl.description,
                    summary: fl.description,
                    parameters: [],
                    returns: undefined
                };
                const func: IFunction = <IFunction>{
                    flowchart: <IFlowchart>{
                        name: fl.name,
                        nodes: fl.nodes,
                        edges: fl.edges
                    },
                    name: funcName,
                    module: 'Imported',
                    doc: documentation,
                    importedFile: reader.result.toString()
                };

                func.args = [];
                for (const prod of fl.nodes[0].procedure) {
                    if (!prod.enabled) { continue; }

                    let v: string = prod.args[prod.argCount - 2].value || 'undefined';
                    if (v.substring(0, 1) === '"' || v.substring(0, 1) === '\'') { v = v.substring(1, v.length - 1); }
                    documentation.parameters.push({
                        name: v,
                        description: prod.meta.description
                    });
                    func.args.push(<IArgument>{
                        name: v,
                        default: prod.args[prod.argCount - 1].default,
                        value: undefined,
                        type: prod.meta.inputMode,
                    });
                }
                func.argCount = func.args.length;
                /*
                if (!func.argCount) {
                    resolve('error');
                }
                */

                // go through the nodes
                for (const node of fl.nodes) {
                    if (node.type === 'end') {
                        if (node.procedure.length > 0) {documentation.returns = node.procedure[0].meta.description; }
                    }
                }

                // add func and all the imported functions of the imported flowchart to funcs
                funcs.push(func);
                for (const i of fl.functions) {
                    funcs.push(i);
                }
                resolve(funcs);
            };
            reader.onerror = function() {
                resolve('error');
            };
            reader.readAsText(event.target.files[0]);
        });
        const fnc = await p;
        (<HTMLInputElement>document.getElementById('selectedFile')).value = '';
        if (fnc === 'error') {
            console.warn('Error reading file');
            return;
        }
        this.imported.emit(fnc);
    }

    downloadImported(event: MouseEvent, fnData) {
        event.stopPropagation();

        const fileString = fnData.importedFile;
        const fname = `${fnData.name}.mob`;
        const blob = new Blob([fileString], {type: 'application/json'});
        DownloadUtils.downloadFile(fname, blob);

    }

    toggleAccordion(id: string) {
        if (this.focusedInput) {
            this.focusedInput.focus();
        }
        const acc = document.getElementById(id);
        // acc = document.getElementsByClassName("accordion");
        acc.classList.toggle('active');
        const panel = <HTMLElement>acc.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    }

    toggleAccordionHead(id: string) {
        if (this.focusedInput) {
            this.focusedInput.focus();
        }
        const acc = document.getElementById(id);
        // acc = document.getElementsByClassName("accordion");
        acc.classList.toggle('active');
        let panel = <HTMLElement>acc.nextElementSibling;
        if (panel.className !== 'panel') {
            panel = <HTMLElement>panel.nextElementSibling;
        }
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    }

    openNodeMenu(e: MouseEvent) {
        const stl = document.getElementById('nodeMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();

    }

    changeNode(index: number) {
        this.dataService.flowchart.meta.selected_nodes = [index];
    }

    checkInvalid(type) {
        const node = this.dataService.node;
        const tp = type.toUpperCase();
        if (tp === 'ELSE') {
            if (!node.state.procedure[0]) {
                return true;
            }
            if (node.state.procedure[0].type.toString() !== ProcedureTypes.If.toString()
            && node.state.procedure[0].type.toString() !== ProcedureTypes.Elseif.toString()) {
                return true;
            }
            let prods: IProcedure[];

            if (node.state.procedure[0].parent) { prods = node.state.procedure[0].parent.children;
            } else { prods = node.procedure; }

            for (let i = 0 ; i < prods.length - 1; i++) {
                if (prods[i].ID === node.state.procedure[0].ID) {
                    if (prods[i + 1].type.toString() === ProcedureTypes.Elseif.toString() ||
                    prods[i + 1].type.toString() === ProcedureTypes.Else.toString()) {
                        return true;
                    }
                    return false;
                }
            }
            return false;
        } else if (tp === 'ELSEIF') {
            if (!node.state.procedure[0]) {
                return true;
            }
            return (node.state.procedure[0].type.toString() !== ProcedureTypes.If.toString()
            && node.state.procedure[0].type.toString() !== ProcedureTypes.Elseif.toString());
        } else {
            if (node.state.procedure[0]) {
                let prods: IProcedure[];

                if (node.state.procedure[0].parent) { prods = node.state.procedure[0].parent.children;
                } else { prods = node.procedure; }

                if (node.state.procedure[0].type.toString() === ProcedureTypes.If.toString()
                || node.state.procedure[0].type.toString() === ProcedureTypes.Elseif.toString()) {
                    for (let i = 0 ; i < prods.length - 1; i++) {
                        if (prods[i].ID === node.state.procedure[0].ID) {
                            if (prods[i + 1].type.toString() === ProcedureTypes.Else.toString()
                            || prods[i + 1].type.toString() === ProcedureTypes.Elseif.toString()) {
                                return true;
                            }
                            return false;
                        }
                    }
                }
            }


            if (tp === 'BREAK' || tp === 'CONTINUE') {
                let checkNode = node.state.procedure[0];
                if (!checkNode) {return true; }
                while (checkNode.parent) {
                    if (checkNode.parent.type.toString() === ProcedureTypes.Foreach.toString() ||
                    checkNode.parent.type.toString() === ProcedureTypes.While.toString()) {
                        return false;
                    }
                    checkNode = checkNode.parent;
                }
                return true;
            }
        }
        return false;
    }

    searchFunction(event) {
        const str = event.target.value.toLowerCase().replace(/ /g, '_');
        this.searchedFunctions = [];
        if (str.length === 0) {
            return;
        }
        for (let i = 0; i < 8; i++) {
            if (this.searchedFunctions.length >= 10) { break; }
            if (this.ProcedureTypesArr[i].toLowerCase().indexOf(str) !== -1) {
                this.searchedFunctions.push({
                    'type': 'basic',
                    'name': this.ProcedureTypesArr[i],
                });
            }
        }

        // @ts-ignore
        for (const mod of this.Modules) {
            if (this.searchedFunctions.length >= 10) { break; }
            if (mod.module.substring(0, 1) === '_' || mod.module === 'Input' || mod.module === 'Output') {continue; }
            for (const func of mod.functions) {
                if (this.searchedFunctions.length >= 10) { break; }
                if (func.name.substring(0, 1) === '_') {continue; }
                if (func.name.toLowerCase().indexOf(str) !== -1) {
                    this.searchedFunctions.push({
                        'type': 'function',
                        'name': func.name,
                        'module': mod.module,
                        'data': func
                    });
                }
            }
        }
        for (const func of this.dataService.flowchart.functions) {
            if (this.searchedFunctions.length >= 10) { break; }
            if (func.name.toLowerCase().indexOf(str) !== -1) {
                this.searchedFunctions.push({
                    'type': 'imported',
                    'name': func.name,
                    'data': func
                });
            }
        }
    }

    searchInline(event) {
        const str = event.target.value.toLowerCase();
        this.searchedInlines = [];
        if (str.length === 0) {
            return;
        }
        for (const cnst of this.dataService.flowchart.nodes[0].procedure) {
            if (this.searchedInlines.length >= 10) { break; }
            const cnstString = cnst.args[cnst.argCount - 2].value;
            if (cnstString.toLowerCase().indexOf(str) !== -1) {
                this.searchedInlines.push(cnstString);
            }
        }
        for (const expr of this.inlineExpr) {
            if (this.searchedInlines.length >= 10) { break; }
            if (expr.toLowerCase().indexOf(str) !== -1) {
                this.searchedInlines.push(expr);
            }
        }
        for (const category of this.inlineFunc) {
            for (const funcString of category[1]) {
                if (this.searchedInlines.length >= 10) { break; }
                if (funcString.toLowerCase().indexOf(str) !== -1) {
                    this.searchedInlines.push(funcString);
                }
            }
            if (this.searchedInlines.length >= 10) { break; }
        }

    }
}
