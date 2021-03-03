import { Component, Input, EventEmitter, Output, AfterViewInit, HostListener, OnDestroy, ViewChild} from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { DataService, KeyboardService } from '@services';
import { Router } from '@angular/router';
import * as circularJSON from 'circular-json';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { checkNodeValidity } from '@shared/parser';
import { DataOutputService } from '@shared/services/dataOutput.service';
import { SaveFileComponent } from '@shared/components/file';
import { IArgument } from '@models/code';
import { SplitComponent } from 'angular-split';

@Component({
  selector: 'view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent implements AfterViewInit, OnDestroy {
    /*
    @Input() flowchart: IFlowchart;
    @Input() node: INode;
    */

    // @Output() imported = new EventEmitter();
    // @Output() delete_Function = new EventEmitter();
    // notificationMessage = '';
    // notificationTrigger = true;

    disableInput = false;
    keyboardSub = null;
    @ViewChild('editorSplit', { static: true }) editorSplit: SplitComponent;

    // private copyCheck = true;
    private ctx = document.createElement('canvas').getContext('2d');

    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private keyboardService: KeyboardService,
                private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url);
        this.keyboardSub = this.keyboardService.shiftKeyPushed$.subscribe(() => {
            this.disableInput = true;
        });
        this.ctx.font = '700 12px arial';
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.adjustTextArea();
            this.dataService.flagModifiedNode(this.dataService.node.id);
        }, 100);
    }

    ngOnDestroy() {
        this.ctx = null;
        this.keyboardSub.unsubscribe();
    }

    viewerData() {
        return this.dataOutputService.getViewerData(this.getNode(), this.dataService.flowchart.model, this.getViewOutput());
    }

    performAction_param_editor(event: any) {
        // (regAction)='regAction($event)'
        // (selectInp)='selectProcedure($event)'
        // (disableProds) = 'disableSelectedProds()'
        // (delete)='deleteSelectedProds()'
        switch (event.type) {
            case 'regAction' :
                this.regAction(event.content);
                break;
            case 'selectInp' :
                this.selectProcedure(event.content);
                break;
            case 'disableProds' :
                this.disableSelectedProds();
                break;
            case 'delete' :
                this.deleteSelectedProds();
                break;
        }
    }

    performAction_toolset(event: any) {
        // (delete_global_func)='delete_global_func($event)'
        // (import_global_func)='import_global_func($event)'
        // (add_prod)='add_prod($event)'
        switch (event.type) {
            case 'delete_global_func' :
                this.delete_global_Func(event.content);
                break;
            case 'import_global_func' :
                this.import_global_func(event.content);
                break;
            case 'add_prod' :
                this.add_prod(event.content);
                break;
            // case 'helpText' :
            //     this.updateHelpView(event.content);
            //     break;
        }
    }

    performAction_procedure_item(event: any, idx) {
        switch (event.type) {
            case 'select' :
                this.selectProcedure(event.content);
                break;
            case 'delete' :
                this.deleteSelectedProds();
                break;
            case 'deleteC' :
                this.deleteChild(idx);
                break;
            case 'addArg' :
                this.updateLocalFuncArg(this.dataService.node.localFunc, event.data, true);
                this.updateLocalFuncArg(this.dataService.node.procedure, event.data, true);
                break;
            case 'delArg' :
                this.updateLocalFuncArg(this.dataService.node.localFunc, event.data, false);
                this.updateLocalFuncArg(this.dataService.node.procedure, event.data, false);
                break;
            case 'notifyError' :
                this.notifyError(event.content);
                break;
        }
    }

    // .............. ON INPUT FOCUS ................
    onfocus(event: Event) {
        if ((<HTMLElement>event.target).nodeName === 'TEXTAREA' || (<HTMLElement>event.target).nodeName === 'INPUT') {
            for (const prod of this.dataService.node.state.procedure) {
                prod.selected = false;
                prod.lastSelected = false;
            }
            this.dataService.node.state.procedure = [];
        }
    }

    adjustTextArea() {
        if (!this.ctx) { return; }
        let textarea = document.getElementById('flowchart-desc');
        if (textarea) {
            const desc = this.dataService.flowchart.description.split('\n');
            const textareaWidth = textarea.getBoundingClientRect().width - 30;
            let lineCount = 0;
            for (const line of desc) {
                lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
            }
            textarea.style.height = lineCount * 14 + 4 + 'px';

            for (const prod of this.dataService.node.procedure) {
                if (prod.type !== ProcedureTypes.Constant) { continue; }
                textarea = document.getElementById(prod.ID + '_desc');
                if (textarea && prod.meta.description) {
                    const prodDesc = prod.meta.description.split('\n');
                    const prodTextareaWidth = textarea.getBoundingClientRect().width - 30;
                    let prodLineCount = 0;
                    for (const line of prodDesc) {
                        prodLineCount += Math.floor(this.ctx.measureText(line).width / prodTextareaWidth) + 1;
                    }
                    textarea.style.height = prodLineCount * 14 + 4 + 'px';
                }
            }
        }
        textarea = document.getElementById('flowchart-return');
        if (textarea) {
            const desc = (this.dataService.flowchart.returnDescription || '').split('\n');
            const textareaWidth = textarea.getBoundingClientRect().width - 30;
            let lineCount = 0;
            for (const line of desc) {
                lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
            }
            textarea.style.height = lineCount * 14 + 4 + 'px';
        }
        textarea = null;
    }


    // add a procedure
    add_prod(data: {type: ProcedureTypes, data: IFunction}): void {
        if (this.dataService.focusedInputProd && this.dataService.node.state.procedure.length === 0) {
            this.dataService.focusedInputProd.selected = true;
            this.dataService.focusedInputProd.lastSelected = true;
            this.dataService.node.state.procedure.push(this.dataService.focusedInputProd);
            this.dataService.focusedInputProd = null;
        }
        if (this.dataService.node.state.procedure.length === 0) {
            if (data.type === ProcedureTypes.Constant) {
            } else if (this.dataService.node.localFunc.length === 1) {
                if (data.type === ProcedureTypes.LocalFuncDef || this.dataService.node.procedure.length === 1 ||
                    (this.dataService.node.type === 'end' && this.dataService.node.procedure.length === 2)) {
                } else {
                    this.dataService.notifyMessage('Error: No selected place for adding procedure!');
                    return;
                }
            } else {
                this.dataService.notifyMessage('Error: No selected place for adding procedure!');
                return;
            }
        }
        NodeUtils.add_procedure(this.dataService.node, data.type, data.data);
        let prod = this.dataService.node.state.procedure[0];
        if (prod.type === ProcedureTypes.Blank) {
            prod = prod.parent;
        }
        this.dataService.registerEdtAction([{'type': 'add',
            'parent': prod.parent, 'prod': prod}]);
    }

    // delete a procedure
    deleteChild(index: number): void {
        this.dataService.registerEdtAction([{'type': 'del',
            'parent': undefined, 'index': index, 'prod': this.dataService.node.procedure[index]}]);
        this.dataService.node.procedure.splice(index, 1);
        NodeUtils.deselect_procedure(this.dataService.node);
    }

    updateLocalFuncArg(prodList: IProcedure[], funcName: string, addArg: boolean) {
        for (const prod of prodList) {
            if (prod.type === ProcedureTypes.LocalFuncCall && prod.meta.name === funcName) {
                if (addArg) {
                    if (!prod.meta.otherInfo) { prod.meta.otherInfo = {}; }
                    if (!prod.meta.otherInfo.deletedArgs || prod.meta.otherInfo.deletedArgs.length === 0) {
                        prod.args.push(<IArgument>{
                            'name': 'arg_' + prod.argCount,
                            'value': '',
                            'jsValue': '',
                            'usedVars': [],
                            'linked': false,
                            'invalidVar': false
                        });
                    } else {
                        const old_arg = prod.meta.otherInfo.deletedArgs.pop();
                        prod.args.push(old_arg);
                    }
                    prod.argCount += 1;
                } else {
                    if (!prod.meta.otherInfo) { prod.meta.otherInfo = {}; }
                    if (!prod.meta.otherInfo.deletedArgs) { prod.meta.otherInfo.deletedArgs = []; }
                    prod.meta.otherInfo.deletedArgs.push(prod.args.pop());
                    prod.argCount -= 1;
                }
            }
            if (prod.children) {
                this.updateLocalFuncArg(prod.children, funcName, addArg)
            }
        }
    }

    // select a procedure
    selectProcedure(event): void {
        if (event === 'clear') {
            NodeUtils.deselect_procedure(this.dataService.node);
            return;
        }
        NodeUtils.check_procedure_selected(this.dataService.node.state.procedure, this.dataService.node.localFunc);
        NodeUtils.check_procedure_selected(this.dataService.node.state.procedure, this.dataService.node.procedure);
        if (!event.ctrl && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
            return;
        }
        NodeUtils.select_procedure(this.dataService.node, event.prod, event.ctrl || false, event.shift || false);
    }

    // copy selected procedures
    copyProd() {
        const node = this.dataService.node;
        let i = 0;
        while (i < node.state.procedure.length) {
            if (node.state.procedure[i].type === ProcedureTypes.Blank || node.state.procedure[i].type === ProcedureTypes.EndReturn) {
                node.state.procedure[i].selected = false;
                node.state.procedure[i].lastSelected = false;
                node.state.procedure.splice(i, 1);
            } else {
                i += 1;
            }
        }
        // if (!this.copyCheck || document.activeElement.nodeName === 'INPUT' || node.state.procedure.length === 0) { return; }
        if (document.activeElement.nodeName === 'TEXTAREA' || document.activeElement.nodeName === 'INPUT' || node.state.procedure.length === 0) { return; }

        const temp = node.state.procedure.slice();
        const copiedProds = [];
        NodeUtils.rearrangeProcedures(copiedProds, temp, node.localFunc.concat(node.procedure));
        SaveFileComponent.clearResolvedValue(copiedProds, true);
        localStorage.setItem('mobius_copied_procedures', circularJSON.stringify(copiedProds));
        this.dataService.notifyMessage(`Copied ${copiedProds.length} Procedures`);
    }

    // cut selected procedures
    cutProd() {
        const node = this.dataService.node;
        let tobeSelected;
        if (node.state.procedure.length === 0) { return; }
        for (const selected of node.state.procedure) {
            if (!selected.lastSelected) {
                continue;
            }
            let prodList;
            if (selected.parent) {
                prodList = selected.parent.children;
            } else if (selected.type === ProcedureTypes.LocalFuncDef) {
                prodList = node.localFunc;
            } else {
                prodList = node.procedure;
            }
            let reached_last_selected = false;
            for (const prod of prodList) {
                if (prod.lastSelected) {
                    reached_last_selected = true;
                }
                if (reached_last_selected && !prod.selected) {
                    tobeSelected = prod;
                    break;
                }
            }
        }
        this.scrollToProd(node.state.procedure[node.state.procedure.length - 1]);
        let i = 0;
        while (i < node.state.procedure.length) {
            if (node.state.procedure[i].type === ProcedureTypes.Blank || node.state.procedure[i].type === ProcedureTypes.EndReturn) {
                node.state.procedure[i].selected = false;
                node.state.procedure[i].lastSelected = false;
                node.state.procedure.splice(i, 1);
            } else {
                i += 1;
            }
        }
        // if (!this.copyCheck || document.activeElement.nodeName === 'INPUT' || node.state.procedure.length === 0) { return; }
        if (document.activeElement.nodeName === 'TEXTAREA' || document.activeElement.nodeName === 'INPUT' || node.state.procedure.length === 0) { return; }

        const temp = node.state.procedure.slice();
        const copiedProds = [];
        NodeUtils.rearrangeProcedures(copiedProds, temp, node.localFunc.concat(node.procedure));
        SaveFileComponent.clearResolvedValue(copiedProds, true);

        let parentArray: IProcedure[];
        const redoActions = [];
        for (const prod of copiedProds) {
            if (prod.type === ProcedureTypes.Blank) { continue; }
            if (prod.parent) {
                parentArray = prod.parent.children;
            } else if (prod.type === ProcedureTypes.LocalFuncDef) {
                parentArray = node.localFunc;
            } else { parentArray = node.procedure; }

            for (let j = 0; j < parentArray.length; j++ ) {
                if (parentArray[j] === prod) {
                    redoActions.unshift({'type': 'del', 'parent': parentArray[j].parent, 'index': j, 'prod': parentArray[j]});
                    parentArray.splice(j, 1);
                    break;
                }
            }
        }
        localStorage.setItem('mobius_copied_procedures', circularJSON.stringify(copiedProds));
        this.dataService.registerEdtAction(redoActions);
        checkNodeValidity(this.dataService.node);

        node.state.procedure = [];

        // NodeUtils.deselect_procedure(node);
        NodeUtils.select_procedure(node, tobeSelected, false, false);
        this.dataService.notifyMessage(`Cut ${copiedProds.length} Procedures`);
    }

    // paste copied procedures
    pasteProd() {
        const node = this.dataService.node;
        if (document.activeElement.nodeName !== 'INPUT'
        && document.activeElement.nodeName !== 'TEXTAREA'
        && this.router.url.startsWith('/editor')) {
        // if (this.copyCheck
        // && document.activeElement.nodeName !== 'INPUT'
        // && document.activeElement.nodeName !== 'TEXTAREA'
        // && this.router.url.startsWith('/editor')) {
            const copiedProds = localStorage.getItem('mobius_copied_procedures');
            if (!copiedProds) {
                this.dataService.notifyMessage('Error: No saved procedure to be pasted!');
                return;
            }
            const pastingPlace = node.state.procedure[node.state.procedure.length - 1];
            const toBePasted = circularJSON.parse(copiedProds);
            const redoActions = [];
            let notified = false;
            if (pastingPlace === undefined) {
                if (node.procedure.length > 1 || node.localFunc.length > 1) {
                    this.dataService.notifyMessage('Error: No selected place for pasting!');
                    return;
                }
                for (let i = 0; i < toBePasted.length; i++) {
                    if (toBePasted[i].type === ProcedureTypes.Blank ||
                        toBePasted[i].type === ProcedureTypes.EndReturn) { continue; }
                    const check = NodeUtils.paste_procedure(node, toBePasted[i]);
                    if (!check) {
                        this.dataService.notifyMessage('Error: Unable to paste procedure');
                        notified = true;
                    }
                    redoActions.unshift({'type': 'add',
                        'parent': this.dataService.node.state.procedure[0].parent, 'prod': this.dataService.node.state.procedure[0]});
                    node.state.procedure[0].selected = false;
                    node.state.procedure[0].lastSelected = false;
                    node.state.procedure = [];
                }
            } else {
                for (let i = 0; i < toBePasted.length; i++) {
                    if (toBePasted[i].type === ProcedureTypes.Blank ||
                        toBePasted[i].type === ProcedureTypes.EndReturn) { continue; }
                    const check = NodeUtils.paste_procedure(node, toBePasted[i]);
                    if (!check) {
                        this.dataService.notifyMessage('Error: Unable to paste procedure');
                        notified = true;
                    }
                    redoActions.unshift({'type': 'add',
                        'parent': this.dataService.node.state.procedure[0].parent, 'prod': this.dataService.node.state.procedure[0]});
                }
                node.state.procedure[node.state.procedure.length - 1].selected = false;
                node.state.procedure[node.state.procedure.length - 1].lastSelected = false;
                pastingPlace.selected = true;
                pastingPlace.lastSelected = true;
                node.state.procedure = [pastingPlace];
                this.scrollToProd(pastingPlace);
            }
            this.dataService.registerEdtAction(redoActions);
            checkNodeValidity(this.dataService.node);
            // toBePasted = undefined;
            if (!notified) {
                this.dataService.notifyMessage(`Pasted ${toBePasted.length} Procedures`);
            }
        }
    }

    scrollToProd(prod) {
        const mainProdContainer = <HTMLDivElement> document.getElementById('procedure');
        let topmostProd = prod.parent;
        while (topmostProd && topmostProd.parent) { topmostProd = topmostProd.parent; }
        if (topmostProd && topmostProd.type === ProcedureTypes.LocalFuncDef && topmostProd.meta.otherInfo['collapsed']) {
            topmostProd.meta.otherInfo['collapsed'] = false;
            prod = topmostProd;
        }
        let prodDiv;
        if (prod.ID === '' && prod.parent) {
            prodDiv = <HTMLDivElement> document.getElementById('prodDiv_' + prod.parent.ID);
        } else {
            prodDiv = <HTMLDivElement> document.getElementById('prodDiv_' + prod.ID);
        }
        if (!prodDiv) {
            return;
        }
        let scrollPos = prodDiv.offsetTop - mainProdContainer.offsetTop - (mainProdContainer.offsetHeight / 3);
        if (scrollPos < 0) { scrollPos = 0; }
        if (scrollPos > mainProdContainer.scrollHeight) { scrollPos = mainProdContainer.scrollHeight; }
        mainProdContainer.scrollTop = scrollPos;
    }

    // @HostListener('window:keydown', ['$event'])
    // onKeyDown(event: KeyboardEvent) {
    //     // disable text input in textboxes when ctrl/shift/command key is held down
    //     if (!this.disableInput && (event.key === 'Control' || event.key === 'Shift' || event.key === 'Meta')) {
    //         this.disableInput = true;
    //     } else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
    //         if (document.activeElement.nodeName !== 'INPUT') {
    //             event.preventDefault();
    //         }
    //     }
    // }

    regAction(act) {
        this.dataService.registerEdtAction(act);
    }

    disableSelectedProds() {
        event.stopPropagation();
        const prodList = this.dataService.node.state.procedure;
        const newEnabled = ! prodList[prodList.length - 1].enabled;
        for (const prod of prodList) {
            if (prod.type === ProcedureTypes.Blank || prod.type === ProcedureTypes.Comment) { continue; }
            prod.enabled = newEnabled;
        }
        // this.data.enabled = !this.data.enabled;
    }


    deleteSelectedProds() {
        const node = this.dataService.node;
        let tobeSelected;
        for (const selected of node.state.procedure) {
            if (!selected.lastSelected) {
                continue;
            }
            let prodList;
            if (selected.parent) {
                prodList = selected.parent.children;
            } else if (selected.type === ProcedureTypes.LocalFuncDef) {
                prodList = node.localFunc;
            } else {
                prodList = node.procedure;
            }
            let reached_last_selected = false;
            for (const prod of prodList) {
                if (prod.lastSelected) {
                    reached_last_selected = true;
                }
                if (reached_last_selected && !prod.selected) {
                    tobeSelected = prod;
                    break;
                }
            }
        }
        const redoActions = [];
        for (const prod of node.state.procedure) {
            let prodList: IProcedure[];
            if (prod.parent) {
                prodList = prod.parent.children;
            } else if (prod.type === ProcedureTypes.LocalFuncDef) {
                prodList = node.localFunc;
            } else {
                prodList = node.procedure;
            }
            prod.selected = false;
            prod.lastSelected = false;
            for (let i = 1; i < prodList.length; i++) {
                if (prodList[i].ID === prod.ID) {
                    redoActions.unshift({'type': 'del', 'parent': prodList[i].parent, 'index': i, 'prod': prodList[i]});
                    prodList.splice(i, 1);
                    break;
                }
            }
        }
        this.dataService.registerEdtAction(redoActions);
        checkNodeValidity(this.dataService.node);
        node.state.procedure = [];
        NodeUtils.select_procedure(node, tobeSelected, false, false);
        // this.dataService.node.state.procedure = [];
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (!(event.ctrlKey && event.metaKey && event.shiftKey)) { this.disableInput = false; }
        if (document.activeElement.nodeName === 'TEXTAREA' || document.activeElement.nodeName === 'INPUT') {return; }
        // if (!this.copyCheck) { return; }
        if (event.key === 'Delete' || event.key === 'Backspace') {
            this.deleteSelectedProds();
        } else if (event.key.toLowerCase() === 'z' && (event.ctrlKey === true || event.metaKey === true)) {
            let actions: any;
            // if ((<HTMLElement>event.target).nodeName === 'INPUT') {return; }
            if (event.shiftKey) {
                actions = this.dataService.redoEdt();
                if (!actions) { return; }
                for (let i = actions.length - 1; i >= 0; i--) {
                    const act = actions[i];
                    if (act.type === 'del') {
                        this.scrollToProd(act.prod);
                        let prodList: IProcedure[];
                        if (act.parent) {
                            prodList = act.parent.children;
                        } else if (act.prod.type === ProcedureTypes.LocalFuncDef) {
                            prodList = this.dataService.node.localFunc;
                        } else {
                            prodList = this.dataService.node.procedure;
                        }
                        prodList.splice(act.index, 1);
                    } else {
                        let prodList: IProcedure[];
                        if (act.parent) {
                            prodList = act.parent.children;
                        } else if (act.prod.type === ProcedureTypes.LocalFuncDef) {
                            prodList = this.dataService.node.localFunc;
                        } else {
                            prodList = this.dataService.node.procedure;
                        }
                        prodList.splice(act.index, 0, act.prod);
                        this.scrollToProd(act.prod);
                    }
                }
            } else {
                actions = this.dataService.undoEdt();
                if (!actions) { return; }
                for (const act of actions) {
                    if (act.type === 'add') {
                        this.scrollToProd(act.prod);
                        let prodList: IProcedure[];
                        if (act.parent) {
                            prodList = act.parent.children;
                        } else if (act.prod.type === ProcedureTypes.LocalFuncDef) {
                            prodList = this.dataService.node.localFunc;
                        } else {
                            prodList = this.dataService.node.procedure;
                        }
                        if (act.index) {
                            prodList.splice(act.index, 1);
                        } else {
                            for (let i = 0; i < prodList.length; i++) {
                                if (prodList[i].ID === act.prod.ID) {
                                    act.index = i;
                                    prodList.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    } else {
                        let prodList: IProcedure[];
                        if (act.parent) {
                            prodList = act.parent.children;
                        } else if (act.prod.type === ProcedureTypes.LocalFuncDef) {
                            prodList = this.dataService.node.localFunc;
                        } else {
                            prodList = this.dataService.node.procedure;
                        }
                        prodList.splice(act.index, 0, act.prod);
                        this.scrollToProd(act.prod);
                    }
                }
            }
            NodeUtils.deselect_procedure(this.dataService.node);
            checkNodeValidity(this.dataService.node);
        }
    }

    notifyError(message) {
        this.dataService.notifyMessage(message);
    }

    // activate copying/cutting/pasting when the mouse hovers over the procedure list
    activateCopyPaste(): void {
        // this.copyCheck = true;
    }

    // deactivate copying/cutting/pasting when the mouse exit the procedure list
    deactivateCopyPaste(): void {
        // this.copyCheck = false;
    }



    // import a flowchart as function
    import_global_func(event) {
        for (let i = 0; i < this.dataService.flowchart.functions.length; i ++) {
            if (this.dataService.flowchart.functions[i].name === event.main.name) {
                if (confirm(`A function named ${event.main.name} already exists. Would you like to override it?`)) {
                    this.dataService.flowchart.functions[i] = event.main;
                    if (!this.dataService.flowchart.subFunctions) {
                        this.dataService.flowchart.subFunctions = [];
                    }
                    let j = 0;
                    while (j < this.dataService.flowchart.subFunctions.length) {
                        const func = this.dataService.flowchart.subFunctions[j];
                        if (func.name.startsWith(event.main.name)) {
                            this.dataService.flowchart.subFunctions.splice(j, 1);
                        } else {
                            j++;
                        }
                    }
                    for (const func of event.sub) {
                        this.dataService.flowchart.subFunctions.push(func);
                    }
                    this.dataService.notifyMessage(`Import and Override Global Function ${event.main.name}`);
                }
                return;
            }
        }
        this.dataService.flowchart.functions.push(event.main);
        if (!this.dataService.flowchart.subFunctions) {
            this.dataService.flowchart.subFunctions = [];
        }
        for (const func of event.sub) {
            this.dataService.flowchart.subFunctions.push(func);
        }
        this.dataService.notifyMessage(`Imported Global Function ${event.main.name}`);
    }

    // delete an imported function
    delete_global_Func(event) {
        for (let i = 0; i < this.dataService.flowchart.functions.length; i++) {
            if (this.dataService.flowchart.functions[i] === event) {
                this.dataService.flowchart.functions.splice(i, 1);
                break;
            }
        }
        let j = 0;
        while (j < this.dataService.flowchart.subFunctions.length) {
            if (this.dataService.flowchart.subFunctions[j].name.substring(0, event.name.length) === event.name) {
                this.dataService.flowchart.subFunctions.splice(j, 1);
            } else {
                j++;
            }
        }
    }

    updateHelpView(event) {
        // if (typeof(event) === 'string') {
        //     for (const func of this.dataService.flowchart.functions) {
        //         if (func.name === event) {
        //             this.dataService.helpView = func.doc;
        //         }
        //     }
        // } else {
        //     this.dataService.helpView = event;
        // }
        // this.dataService.toggleHelp(true);
    }

    setViewOutput() {
        this.dataService.setModelOutputView(this.dataService.node.id, !this.getViewOutput());
        // this.dataService.modelOutputView = !this.dataService.modelOutputView;
    }

    getViewOutput() {
        return this.dataService.getModelOutputView(this.dataService.node.id);
    }

    toggleShowCode() {
        this.dataService.node.state.show_code = !this.dataService.node.state.show_code;
    }

    toggleShowFunc() {
        this.dataService.node.state.show_func = !this.dataService.node.state.show_func;
    }

    // setTestModel() {
    //     this.dataService.testModel = !this.dataService.testModel;
    //     this.dataService.modelOutputView = this.dataService.testModel;
    // }

    // viewerData(): any {
    //     const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
    //     if (!node || !node.enabled) { return ''; }
    //     // if (node.type === 'output') { return node.input.value; }
    //     if (this.getViewOutput()) {
    //         return node.model;
    //     }
    //     return node.input.value;
    // }

    setSplit(event) {
        this.dataService.splitUpdate = true;
        this.dataService.splitVal = event.sizes[1];
        this.adjustTextArea();
    }

    unselectAll(event) {
        if (event.ctrlKey || event.metaKey) { return; }
        NodeUtils.deselect_procedure(this.dataService.node);
    }
    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }
    getFlowchartName() { return this.dataService.file.name; }

    @HostListener('document:mouseleave', [])
    onmouseleave() {
        this.editorSplit.notify('end', this.editorSplit.gutterSize);
    }

}
