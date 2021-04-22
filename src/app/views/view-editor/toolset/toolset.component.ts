import { Component, Output, EventEmitter, Input, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';

import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';
import * as CircularJSON from 'circular-json';
import { IArgument } from '@models/code';
import { ModuleList, ModuleDocList, AllFunctionDoc } from '@shared/decorators';
import { INode, NodeUtils } from '@models/node';

import { DownloadUtils } from '@shared/components/file/download.utils';
import { inline_query_expr, inline_func, inline_sort_expr} from '@assets/core/inline/inline';
import { DataService } from '@services';
import { InputType } from '@models/port';
import { IdGenerator } from '@utils';
import { SaveFileComponent } from '@shared/components/file';
import * as Modules from '@modules';

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

    // @Output() selected = new EventEmitter();
    // @Output() delete = new EventEmitter();
    // @Output() imported = new EventEmitter();
    @Output() eventAction = new EventEmitter();
    // @Input() functions: IFunction[];

    ProcedureTypes = ProcedureTypes;
    ProcedureTypesArr = keys.slice(keys.length / 2);
    searchedMainFuncs = [];
    // searchedInlineFuncs = [];
    // searchedUserFuncs = [];

    // inlineQueryExpr = inline_query_expr;
    // inlineSortExpr = inline_sort_expr;
    // inlineFunc = inline_func;

    AllModules = {};
    Modules = [];
    ModuleDoc = ModuleDocList;
    AllFuncsDoc = AllFunctionDoc;

    private timeOut;

    constructor(private dataService: DataService) {
        this.dataService.toolsetUpdate$.subscribe(() => {
            this.Modules = [];
            for (const cat in this.AllModules) {
                if (!this.AllModules[cat] || !this.dataService.mobiusSettings['_func_' + cat]) { continue; }
                this.Modules.push(this.AllModules[cat]);
            }
        });
    }


    ngOnInit() {
        for (const mod of ModuleList) {
            if (mod.module[0] === '_') { continue; }
            const nMod = {'module': mod.module, 'functions': []};
            for (const fn of mod.functions) {
                if (fn.name[0] === '_') { continue; }
                if (ModuleDocList[mod.module] && ModuleDocList[mod.module][fn.name]) {
                    fn['doc'] = ModuleDocList[mod.module][fn.name];
                    let fnDocHtml;
                    if (fn.doc.summary) {
                        fnDocHtml = `<p class="funcDesc">${fn.doc.summary}</p>`;
                    } else {
                        fnDocHtml = `<p class="funcDesc">${fn.doc.description.split('\n')[0]}</p>`;
                    }
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
            this.AllModules[nMod.module] = nMod;
            // this.Modules.push(nMod);
        }

        for (const cat in this.AllModules) {
            if (!this.AllModules[cat] || !this.dataService.mobiusSettings['_func_' + cat]) { continue; }
            this.Modules.push(this.AllModules[cat]);
        }

    }

    selectPrevProd(){
        // event.preventDefault();
        this.dataService.focusedInputProd = null;
    }

    // add selected basic function as a new procedure
    add_basic_func(type: ProcedureTypes, data?): void {
        this.eventAction.emit({
            'type': 'add_prod',
            'content': { type: type, data: data }
        });
    }

    // add selected function from core.modules as a new procedure
    add_main_func(fnData) {

        // fnData.args = fnData.args.map( (arg) => {
        //     return {name: arg.name, value: arg.value};
        // });
        const newArgs = [];
        for (let i = 0; i < fnData.args.length; i ++) {
            const arg = fnData.args[i];
            const argDoc = ModuleDocList[fnData.module][fnData.name].parameters[i];
            if (argDoc && argDoc.description ) {
                const docText = argDoc.description.toLowerCase();
                if (docText.indexOf('enum') !== -1) {
                    const enm = Modules[fnData.module][argDoc.type];
                    // tslint:disable-next-line:forin
                    for (const j in enm) {
                        newArgs.push({name: arg.name, value: `'${enm[j]}'`, jsValue: `'${enm[j]}'`});
                        break;
                    }
                    continue;
                } else if (docText.indexOf('optional') !== -1) {
                    newArgs.push({name: arg.name, value: `null`, jsValue: `null`});
                    continue;
                }
            }
            newArgs.push({name: arg.name, value: arg.value});
        }
        fnData.args = newArgs;

        this.eventAction.emit({
            'type': 'add_prod',
            'content': { type: ProcedureTypes.MainFunction, data: fnData }
        });
    }

    add_local_func_def(numArgs: number) {
        this.eventAction.emit({
            'type': 'add_prod',
            'content': { type: ProcedureTypes.LocalFuncDef, data: numArgs }
        });
    }

    // add selected imported function as a new procedure
    add_local_func_call(funcProd) {
        this.eventAction.emit({
            'type': 'add_prod',
            'content': { type: ProcedureTypes.LocalFuncCall, data: funcProd }
        });
    }

    // add selected imported function as a new procedure
    add_global_func(fnData) {
        fnData.args = fnData.args.map( (arg) => {
            // if (arg.type === InputType.Constant) {
            //     return {name: arg.name, value: arg.value, jsValue: arg.value, type: arg.type, isEntity: arg.isEntity};
            // }
            return {name: arg.name, value: arg.value, jsValue: arg.value, type: arg.type, isEntity: arg.isEntity};
        });
        this.eventAction.emit({
            'type': 'add_prod',
            'content': { type: ProcedureTypes.globalFuncCall, data: fnData }
        });
    }

    add_searched_func(fnData) {
        if (fnData.type === 'localFunc') {
            this.add_local_func_call(fnData.data);
        } else if (fnData.type === 'globalFunc') {
            this.add_global_func(fnData.data);
        } else {
            this.add_main_func(fnData.data);
        }
    }


    add_searched_user_func(fnData) {
        if (fnData.type === 'localFunc') {
            this.add_local_func_call(fnData.data);
        } else {
            this.add_global_func(fnData.data);
        }
    }

    add_inline_func(string) {
        if (!this.dataService.focusedInput) {
            return;
        }
        this.dataService.focusedInput.focus();
        let selStart: number, selEnd: number;
        if (this.dataService.focusedInput.selectionDirection === 'backward') {
            selStart = this.dataService.focusedInput.selectionEnd;
            selEnd = this.dataService.focusedInput.selectionStart;
        } else {
            selStart = this.dataService.focusedInput.selectionStart;
            selEnd = this.dataService.focusedInput.selectionEnd;
        }
        const newSelStart = string.indexOf('(');
        this.dataService.focusedInput.value =
            this.dataService.focusedInput.value.slice(0, selStart) +
            string +
            this.dataService.focusedInput.value.slice(selEnd);
        this.dataService.focusedInput.dispatchEvent(inputEvent);
        if (newSelStart !== -1) {
            this.dataService.focusedInput.selectionStart = selStart + newSelStart + 1;
            this.dataService.focusedInput.selectionEnd = selStart + string.length - 1;
        } else {
            this.dataService.focusedInput.selectionStart = selStart + string.length;
            this.dataService.focusedInput.selectionEnd = selStart + string.length;
        }
        // const index = this.dataService.focusedInput.selectionDirection === 'backward' ?
        //     this.dataService.focusedInput.selectionStart : this.dataService.focusedInput.selectionEnd;
        // this.dataService.focusedInput.value =
        //     this.dataService.focusedInput.value.slice(0, index) +
        //     string +
        //     this.dataService.focusedInput.value.slice(index);

        // this.dataService.focusedInput.dispatchEvent(inputEvent);
        // this.dataService.focusedInput.selectionStart = index + string.length;
    }

    // delete imported function
    delete_global_func(fnData) {
        this.eventAction.emit({
            'type': 'delete_global_func',
            'content': fnData
        });
        this.turnoffTooltip();
    }


    // import a flowchart as function
    async import_global_func(event) {
        // read the file and create the function based on the flowchart
        const p = new Promise((resolve) => {
            let numFiles = 0;
            const funcList = [];
            for (const f of event.target.files) {
                const reader = new FileReader();
                reader.onload = function() {
                    // parse the flowchart
                    const fileString = reader.result.toString();
                    const fl = CircularJSON.parse(fileString).flowchart;

                    // create function and documentation of the function
                    const funcs = {'main': null, 'sub': []};
                    let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
                    if (funcName.match(/^[\d_]/)) {
                        funcName = 'func' + funcName;
                    }
                    const documentation = {
                        name: funcName,
                        module: 'globalFunc',
                        description: fl.description,
                        summary: fl.description,
                        parameters: [],
                        returns: fl.returnDescription
                    };
                    const func: IFunction = <IFunction>{
                        flowchart: <IFlowchart>{
                            id: fl.id ? fl.id : IdGenerator.getId(),
                            name: fl.name,
                            nodes: fl.nodes,
                            edges: fl.edges
                        },
                        name: funcName,
                        module: 'globalFunc',
                        doc: documentation,
                        importedFile: fileString
                    };

                    func.args = [];
                    for (const prod of fl.nodes[0].procedure) {
                        if (!prod.enabled || prod.type !== ProcedureTypes.Constant) { continue; }
                        let v: string = prod.args[prod.argCount - 2].value || 'undefined';
                        if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
                        if (prod.meta.inputMode !== InputType.Constant) {
                            documentation.parameters.push({
                                name: v,
                                description: prod.meta.description
                            });
                        }
                        func.args.push(<IArgument>{
                            name: v,
                            value: prod.args[prod.argCount - 1].value,
                            type: prod.meta.inputMode,
                            isEntity: prod.selectGeom
                        });
                    }
                    func.argCount = func.args.length;

                    const end = fl.nodes[fl.nodes.length - 1];
                    const returnProd = end.procedure[end.procedure.length - 1];
                    if (returnProd.args[1].value) {
                        func.hasReturn = true;
                    } else {
                        func.hasReturn = false;
                    }

                    // add func and all the imported functions of the imported flowchart to funcs
                    funcs.main = func;
                    for (const i of fl.functions) {
                        i.name = func.name + '_' + i.name;
                        funcs.sub.push(i);
                    }
                    if (fl.subFunctions) {
                        for (const i of fl.subFunctions) {
                            i.name = func.name + '_' + i.name;
                            funcs.sub.push(i);
                        }
                    }

                    if (numFiles + 1 === event.target.files.length) {
                        funcList.push(funcs);
                        resolve(funcList);
                    } else {
                        numFiles += 1;
                        funcList.push(funcs);
                    }
                };
                reader.onerror = function() {
                    numFiles += 1;
                    funcList.push('error');
                };

                reader.readAsText(f);
            }
        });
        const fncs: any = await p;
        (<HTMLInputElement>document.getElementById('selectImportFile')).value = '';
        for (const fnc of fncs) {
            if (fnc === 'error') {
                console.warn('Error reading file');
                continue;
            }
            this.eventAction.emit({
                'type': 'import_global_func',
                'content': fnc
            });
        }
    }


    setCurrent(event) {
        if (document.activeElement.tagName === 'INPUT' && document.activeElement.className !== 'searchBar') {
            this.dataService.focusedInput = document.activeElement;
        }
    }




    download_imported_function(event: MouseEvent, fnData) {
        event.stopPropagation();
        const fileString = fnData.importedFile;
        const fname = `${fnData.name}.mob`;
        const blob = new Blob([fileString], {type: 'application/json'});
        DownloadUtils.downloadFile(fname, blob);
        this.turnoffTooltip();
    }

    edit_imported_function(event: MouseEvent, fnData) {
        event.stopPropagation();
        const fileString = fnData.importedFile;
        // console.log(fnData);
        SaveFileComponent.saveToLocalStorage('___TEMP___.mob', fileString);
        // localStorage.setItem('temp_file', fileString);
        setTimeout(() => {
            window.open(`${window.location.origin}/editor?file=temp`, '_blank');
        }, 200);
    }

    open_update_dialog(event: MouseEvent) {
        event.stopPropagation();
        this.dataService.dialogType = 'backup';
        this.dataService.dialog = <HTMLDialogElement>document.getElementById('headerDialog');
        this.dataService.dialog.showModal();
        this.dataService.setbackup_updateImported(true);
    }

    open_globalFunc_dialog(event: MouseEvent) {
        event.stopPropagation();
        this.dataService.dialogType = 'globalfunc';
        this.dataService.dialog = <HTMLDialogElement>document.getElementById('headerDialog');
        this.dataService.dialog.showModal();
    }

    open_inline_dialog(event: MouseEvent) {
        event.stopPropagation();
        const activeElm = <HTMLInputElement> document.activeElement;

        let insertInlineExpr = <HTMLButtonElement> document.getElementById('insertInlineExpression');
        if (insertInlineExpr && !insertInlineExpr.classList.contains('disabled')) {
            insertInlineExpr.classList.add('disabled');
        }
        (<HTMLInputElement>document.getElementById('hidden_update_inline_func')).click();
        this.dataService.dialogType = 'inlinefunc';
        this.dataService.dialog = <HTMLDialogElement>document.getElementById('headerDialog');
        this.dataService.dialog.showModal();
        this.dataService.dialog.style.right = '-300px';

        setTimeout(() => {
            const expressionInput = <HTMLTextAreaElement> document.getElementById('inlineExpression');
            insertInlineExpr = <HTMLButtonElement> document.getElementById('insertInlineExpression');
            if (!expressionInput) { return; }
            if (activeElm && activeElm.nodeName === 'INPUT') {
                expressionInput.value = activeElm.value;
                if (insertInlineExpr && insertInlineExpr.classList.contains('disabled')) {
                    insertInlineExpr.classList.remove('disabled');
                }
            } else {
                expressionInput.value = '';
            }
        }, 0);
    }

    preventfocus(event) {
        event.preventDefault();
    }

    toggleAccordion(id: string, inline?: boolean) {
        if (inline && this.dataService.focusedInput) {
            this.dataService.focusedInput.focus();
        }
        let acc = document.getElementById(id);
        // acc = document.getElementsByClassName("accordion");
        acc.classList.toggle('active');
        let panel = <HTMLElement>acc.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
        acc = null;
        panel = null;
    }

    toggleAccordionHead(id: string) {
        let acc = document.getElementById(id);
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
        acc = null;
        panel = null;
    }


    checkInvalid(type) {
        return NodeUtils.checkInvalid(type, this.dataService.node);
    }

    searchMainFunc(event) {
        this.updateFocusProd()
        const str = event.target.value.toLowerCase().replace(/ /g, '_');
        this.searchedMainFuncs = [];
        if (str.length === 0) {
            return;
        }

        // Search Basic Functions: Variable, If, ElseIf, Else, ...
        // for (let i = 0; i < 8; i++) {
        //     if (this.searchedMainFuncs.length >= 10) { break; }
        //     if (this.ProcedureTypesArr[i].toLowerCase().indexOf(str) !== -1) {
        //         this.searchedMainFuncs.push({
        //             'type': 'basic',
        //             'name': this.ProcedureTypesArr[i],
        //         });
        //     }
        // }

        // Search Core Functions
        for (const mod of this.Modules) {
            if (this.searchedMainFuncs.length >= 10) { break; }
            if (mod.module[0] === '_' || mod.module === 'Input' || mod.module === 'Output') {continue; }
            for (const func of mod.functions) {
                if (this.searchedMainFuncs.length >= 10) { break; }
                if (func.name[0] === '_') {continue; }
                if (func.name.toLowerCase().indexOf(str) !== -1) {
                    this.searchedMainFuncs.push({
                        'type': 'function',
                        'module': mod.module,
                        'name': func.name,
                        'data': func,
                    });
                }
            }
        }

        if (this.searchedMainFuncs.length >= 10) { return; }
        for (const func of this.getNode().localFunc) {
            if (func.type !== ProcedureTypes.LocalFuncDef) { continue; }
            if (this.searchedMainFuncs.length >= 10) { break; }
            if (func.args[0].value.toLowerCase().indexOf(str) !== -1) {
                this.searchedMainFuncs.push({
                    'type': 'localFunc',
                    'module': 'local',
                    'name': func.args[0].value,
                    'data': func
                });
            }
        }

        if (this.searchedMainFuncs.length >= 10) { return; }

        // Search User Defined Functions
        for (const func of this.dataService.flowchart.functions) {
            if (this.searchedMainFuncs.length >= 10) { break; }
            if (func.name.toLowerCase().indexOf(str) !== -1) {
                this.searchedMainFuncs.push({
                    'type': 'globalFunc',
                    'module': 'global',
                    'name': func.name,
                    'data': func
                });
            }
        }
    }

    // searchInlineFuncs(event) {
    //     this.updateFocusProd()
    //     const str = event.target.value.toLowerCase();
    //     this.searchedInlineFuncs = [];
    //     if (str.length === 0) {
    //         return;
    //     }
    //     // search Global Variables
    //     for (const cnst of this.dataService.flowchart.nodes[0].procedure) {
    //         if (this.searchedInlineFuncs.length >= 10) { break; }
    //         if (cnst.type !== ProcedureTypes.Constant) { continue; }
    //         const cnstString = cnst.args[cnst.argCount - 2].value;
    //         if (cnstString.toLowerCase().indexOf(str) !== -1) {
    //             this.searchedInlineFuncs.push([cnstString, `Global Variable ${cnstString}`]);
    //         }
    //     }

    //     // // search inline query expressions
    //     // for (const expr of this.inlineQueryExpr) {
    //     //     if (this.searchedInlineFuncs.length >= 10) { break; }
    //     //     if (expr[0].toLowerCase().indexOf(str) !== -1) {
    //     //         this.searchedInlineFuncs.push([expr, '']);
    //     //     }
    //     // }

    //     // search inline functions
    //     for (const category of this.inlineFunc) {
    //         for (const funcString of category[1]) {
    //             if (this.searchedInlineFuncs.length >= 10) { break; }
    //             if (funcString[0].toLowerCase().indexOf(str) !== -1) {
    //                 this.searchedInlineFuncs.push(funcString);
    //             }
    //         }
    //         if (this.searchedInlineFuncs.length >= 10) { break; }
    //     }
    // }

    // searchUserFuncs(event) {
    //     this.updateFocusProd()
    //     const str = event.target.value.toLowerCase();
    //     this.searchedUserFuncs = [];
    //     for (const func of this.getNode().localFunc) {
    //         if (func.type !== ProcedureTypes.LocalFuncDef) { continue; }
    //         if (this.searchedUserFuncs.length >= 10) { break; }
    //         if (func.args[0].value.toLowerCase().indexOf(str) !== -1) {
    //             this.searchedUserFuncs.push({
    //                 'type': 'localFunc',
    //                 'name': func.args[0].value,
    //                 'data': func
    //             });
    //         }

    //     }
    //     // Search User Defined Functions
    //     for (const func of this.dataService.flowchart.functions) {
    //         if (this.searchedUserFuncs.length >= 10) { break; }
    //         if (func.name.toLowerCase().indexOf(str) !== -1) {
    //             this.searchedUserFuncs.push({
    //                 'type': 'globalFunc',
    //                 'name': func.name,
    //                 'data': func
    //             });
    //         }
    //     }
    // }

    updateFocusProd() {
        if (this.dataService.focusedInputProd && this.dataService.node.state.procedure.length === 0) {
            this.dataService.focusedInputProd.selected = true;
            this.dataService.node.state.procedure.push(this.dataService.focusedInputProd);
            this.dataService.focusedInputProd = null;
        }
    }

    assembleImportedTooltip(funcData, type = 'globalFunc'): any {
        let htmlDesc: string;
        if (type === 'globalFunc') {
            const funcDoc = funcData.doc;
            htmlDesc = `<p class="funcDesc">${funcDoc.name}</p>`;
            htmlDesc += `<p>${funcDoc.description}</p>`;
            if (funcDoc.parameters && funcDoc.parameters.length > 0) {
                htmlDesc += `<p><span>Parameters: </span></p>`;
                for (const param of funcDoc.parameters) {
                    htmlDesc += `<p class='paramP'><span>${param.name} - </span> ${param.description}</p>`;
                }
            }
            if (funcDoc.returns) {
                htmlDesc += `<p><span>Returns: </span>${funcDoc.returns}</p>`;
            }
        } else {
            htmlDesc = `<p class="funcDesc">Function ${funcData.args[0].value}`
                     + `(${funcData.args.slice(1).map(arg => arg.value).join(', ')})</p>`;
        }
        return {doc: htmlDesc};
    }

    assembleGlobalHelp(funcData): string {
        let docText: string;
        const funcDoc = funcData.doc;
        docText = `## Global.${funcDoc.name}  \n`;
        docText += `**Description:** ${funcDoc.description}  \n`;
        if (funcDoc.parameters && funcDoc.parameters.length > 0) {
            docText += `\n**Parameters:**  \n`;
            for (const param of funcDoc.parameters) {
                docText += `  * *${param.name}:* ${param.description}  \n`;
            }
        }
        if (funcDoc.returns) {
            docText += `\n**Returns:** ${funcDoc.returns}  \n`;
        }
        return docText;
    }

    popupTooltip(event, functionObj) {
        let tooltip = document.getElementById('tooltiptext');
        tooltip.innerHTML = functionObj.doc;
        tooltip.style.top = event.target.getBoundingClientRect().top + 'px';
        this.timeOut = setTimeout(() => {
            tooltip.style.transitionDuration = '0.3s';
            tooltip.style.opacity = '1';
            tooltip = null;
        }, 700);
    }

    emitHelpText(event, functype, func) {
        event.stopPropagation();
        if (functype === 'core') {
            this.dataService.helpView = this.AllFuncsDoc[func.module.toLowerCase()][func.name.toLowerCase()];
            this.dataService.toggleHelp(true);
        } else if (functype === 'global') {
            this.dataService.helpView = this.assembleGlobalHelp(func)
            this.dataService.toggleHelp(true);
        } else {
            this.dataService.helpView = this.AllFuncsDoc[functype.toLowerCase()][func.toLowerCase()];
            this.dataService.toggleHelp(true);
        }
    }


    turnoffTooltip() {
        clearTimeout(this.timeOut);
        let tooltip = document.getElementById('tooltiptext');
        tooltip.style.transitionDuration = '0s';
        tooltip.style.opacity = '0';
        tooltip = null;
    }

    getViewOutput() {
        return this.dataService.getModelOutputView(this.dataService.node.id);
    }

    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }

}
