import { Component, Output, EventEmitter, Input, OnInit, ViewEncapsulation} from '@angular/core';

import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';
import * as CircularJSON from 'circular-json';
import { IArgument } from '@models/code';
import { ModuleList, ModuleDocList } from '@shared/decorators';
import { INode } from '@models/node';

import { DownloadUtils } from '@shared/components/file/download.utils';
import { inline_query_expr, inline_func, inline_sort_expr} from './toolset.inline';
import { DataService } from '@services';
import { _parameterTypes } from '@modules';
import { InputType } from '@models/port';

const keys = Object.keys(ProcedureTypes);
const inputEvent = new Event('input', {
    'bubbles': true,
    'cancelable': true
});

@Component({
  selector: 'toolset',
  templateUrl: './toolset.component.html',
  styleUrls: ['./toolset.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToolsetComponent implements OnInit {

    @Output() selected = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() imported = new EventEmitter();
    // @Input() functions: IFunction[];

    ProcedureTypes = ProcedureTypes;
    ProcedureTypesArr = keys.slice(keys.length / 2);
    searchedFunctions = [];
    searchedInlines = [];

    inlineQueryExpr = inline_query_expr;
    inlineSortExpr = inline_sort_expr;
    inlineFunc = inline_func;

    Modules = [];
    ModuleDoc = ModuleDocList;

    private timeOut;

    constructor(private dataService: DataService) {}


    ngOnInit() {
        for (const mod of ModuleList) {
            if (mod.module.substring(0, 1) === '_') { continue; }
            const nMod = {'module': mod.module, 'functions': []};
            for (const fn of mod.functions) {
                if (fn.name.substring(0, 1) === '_') { continue; }
                if (ModuleDocList[mod.module] && ModuleDocList[mod.module][fn.name]) {
                    fn['doc'] = ModuleDocList[mod.module][fn.name];
                    let fnDocHtml = `<p class="funcDesc">${fn.doc.summary || fn.doc.description}</p>`;
                    if (fn.doc.parameters && fn.doc.parameters.length > 0) {
                        fnDocHtml += `<p><span>Parameters: </span></p>`;
                        for (const param of fn.doc.parameters) {
                            if (!param) {continue; }
                            fnDocHtml += `<p class="paramP"><span>${param.name} - </span> ${param.description}</p>`;
                        }
                    }
                    if (fn.doc.returns) {
                        fnDocHtml += `<p><span>Returns: </span> ${fn.doc.returns}</p>`;
                    }
                    fn['doc'] = fnDocHtml;
                } else {
                    fn['doc'] = '<br>';
                }
                nMod.functions.push(fn);
            }
            this.Modules.push(nMod);
        }
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
            if (arg.type === InputType.Constant) {
                return {name: arg.name, value: arg.default, type: arg.type};
            }
            return {name: arg.name, value: arg.value, type: arg.type};
            });
        this.selected.emit( { type: ProcedureTypes.Imported, data: fnData } );
    }

    setCurrent(event) {
        if (document.activeElement.tagName === 'INPUT' && document.activeElement.className !== 'searchBar') {
            // this.dataService.focusedInput = [document.activeElement, (<HTMLInputElement>document.activeElement).selectionStart];
            this.dataService.focusedInput = document.activeElement;
        } else {
            // this.dataService.focusedInput = undefined;
        }
    }

    add_inline(string) {
        if (!this.dataService.focusedInput) {
            return;
        }
        this.dataService.focusedInput.focus();
        const index = this.dataService.focusedInput.selectionDirection === 'backward' ?
            this.dataService.focusedInput.selectionStart : this.dataService.focusedInput.selectionEnd;
        this.dataService.focusedInput.value =
            this.dataService.focusedInput.value.slice(0, index) +
            string +
            this.dataService.focusedInput.value.slice(index);

        this.dataService.focusedInput.dispatchEvent(inputEvent);
        this.dataService.focusedInput.selectionStart = index + string.length;
        // this.dataService.focusedInput.trigger('input');
    }

    // delete imported function
    delete_imported_function(fnData) {
        this.delete.emit(fnData);
        this.turnoffTooltip();
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
                let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
                if (funcName.match(/^[\d_]/)) {
                    funcName = 'func' + funcName;
                }
                const documentation = {
                    name: funcName,
                    module: 'Imported',
                    description: fl.description,
                    summary: fl.description,
                    parameters: [],
                    returns: fl.returnDescription
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
                    if (!prod.enabled || prod.type !== ProcedureTypes.Constant) { continue; }
                    let v: string = prod.args[prod.argCount - 2].value || 'undefined';
                    if (v.substring(0, 1) === '"' || v.substring(0, 1) === '\'') { v = v.substring(1, v.length - 1); }
                    if (prod.meta.inputMode !== InputType.Constant) {
                        documentation.parameters.push({
                            name: v,
                            description: prod.meta.description
                        });
                    }
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
        this.turnoffTooltip();
    }

    toggleAccordion(id: string) {
        if (this.dataService.focusedInput) {
            this.dataService.focusedInput.focus();
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
        if (this.dataService.focusedInput) {
            this.dataService.focusedInput.focus();
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
            if (cnst.type !== ProcedureTypes.Constant) { continue; }
            const cnstString = cnst.args[cnst.argCount - 2].value;
            if (cnstString.toLowerCase().indexOf(str) !== -1) {
                this.searchedInlines.push(cnstString);
            }
        }
        for (const expr of this.inlineQueryExpr) {
            if (this.searchedInlines.length >= 10) { break; }
            if (expr[0].toLowerCase().indexOf(str) !== -1) {
                this.searchedInlines.push(expr);
            }
        }
        for (const category of this.inlineFunc) {
            for (const funcString of category[1]) {
                if (this.searchedInlines.length >= 10) { break; }
                if (funcString[0].toLowerCase().indexOf(str) !== -1) {
                    this.searchedInlines.push(funcString[0]);
                }
            }
            if (this.searchedInlines.length >= 10) { break; }
        }
    }

    assembleImportedTooltip(funcDoc): string {
        // <span class="tooltiptext1">
        //     <p class='funcDesc'>{{fn.doc.description}}</p>
        //     <p *ngIf='fn.doc.parameters?.length > 0'><span>Parameters: </span></p>
        //     <p class='paramP' *ngFor='let param of fn.doc.parameters'><span>{{param.name}} - </span> {{param.description}}</p>
        //     <p *ngIf='fn.doc.returns'><span>Returns: </span>{{fn.doc.returns}}</p>
        // </span>
        let htmlDesc = `<p class="funcDesc">${funcDoc.description}</p>`;
        if (funcDoc.parameters && funcDoc.parameters.length > 0) {
            htmlDesc += `<p><span>Parameters: </span></p>`;
            for (const param of funcDoc.parameters) {
                htmlDesc += `<p class='paramP'><span>${param.name} - </span> ${param.description}</p>`;
            }
        }
        if (funcDoc.returns) {
            htmlDesc += `<p><span>Returns: </span>${funcDoc.returns}</p>`;
        }
        return htmlDesc;
    }

    popupTooltip(event, funcText: string) {
        const tooltip = document.getElementById('tooltiptext');
        tooltip.innerHTML = funcText;
        tooltip.style.top = event.target.getBoundingClientRect().top + 'px';
        this.timeOut = setTimeout(() => {
            tooltip.style.transitionDuration = '0.3s';
            tooltip.style.opacity = '1';
        }, 700);
    }

    turnoffTooltip() {
        clearTimeout(this.timeOut);
        const tooltip = document.getElementById('tooltiptext');
        tooltip.style.transitionDuration = '0s';
        tooltip.style.opacity = '0';
    }

    getViewOutput() {
        return this.dataService.getModelOutputView(this.dataService.node.id);
    }

    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }

}
