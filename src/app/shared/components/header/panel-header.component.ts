import { Component, Input, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@shared/services';
import * as circularJSON from 'circular-json';
import { IFlowchart } from '@models/flowchart';
import { ProcedureTypes, IFunction } from '@models/procedure';
import { SaveFileComponent } from '../file';
import { IdGenerator } from '@utils';
import { InputType } from '@models/port';
import { IArgument } from '@models/code';

@Component({
    selector: 'panel-header',
    templateUrl: 'panel-header.component.html',
    styleUrls: ['panel-header.component.scss']
})
export class PanelHeaderComponent implements OnDestroy {

    @Input() flowchart: IFlowchart;
    executeCheck: boolean;
    nodeListCheck: boolean;

    urlSet = ['', 'publish', '', '', ''];
    urlValid: boolean;
    urlNodes;
    private ctx = document.createElement('canvas').getContext('2d');

    constructor(private dataService: DataService, private router: Router) {
        if (this.router.url === '/about') {
            this.executeCheck = false;
            this.nodeListCheck = false;
        } else if (this.router.url === '/gallery') {
            this.executeCheck = true;
            this.nodeListCheck = false;
        } else {
            this.executeCheck = true;
            this.nodeListCheck = true;
        }
        this.ctx.font = '12px sans-serif';
    }

    ngOnDestroy() {
        this.dataService.dialog = null;
        this.ctx = null;
    }


    getUrl() {
        return this.router.url;
    }
    getNode() {
        return this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
    }

    changeNode(index: number) {
        this.dataService.flowchart.meta.selected_nodes = [index];
        if (this.router.url === '/editor') {
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[index].id);
            if ((index === 0 || index === this.dataService.flowchart.nodes.length - 1)) {
                setTimeout(() => {
                    this.adjustTextArea();
                }, 100);
            }
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



    loadFile() {
        document.getElementById('file-input').click();
        // this.router.navigate(['/dashboard']);
    }

    saveJavascript() {
        document.getElementById('savejavascript').click();
        // this.router.navigate(['/dashboard']);
    }

    openDropdownMenu(e: MouseEvent) {
        let stl = document.getElementById('dropdownMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.left = (document.getElementById('dropdownMenuButton').getBoundingClientRect().left + 34 - 100) + 'px';
            stl.display = 'block';
            // const bRect = (<Element>e.target).getBoundingClientRect();
            // stl.transform = `translate(` + bRect.left + `px, ` + bRect.height + `px)`;
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();
        stl = null;
    }

    openNodeMenu(e: MouseEvent) {
        let stl = document.getElementById('nodeMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();
        stl = null;
    }


    openHeaderDialog(event, dialogType: string) {
        event.stopPropagation();
        this.dataService.dialogType = dialogType;
        this.dataService.dialog = <HTMLDialogElement>document.getElementById('headerDialog');
        this.dataService.dialog.showModal();
        if (dialogType === 'backup') {
            this.dataService.setbackup_header();
        }
    }

    checkDialog(type) {
        return this.dataService.dialogType === type;
    }

    getBackupFiles() {
        const items = localStorage.getItem('mobius_backup_list');
        if (!items) {
            return [];
        }
        return JSON.parse(items);
    }

    updateSettings() {
        const newSettings = { 'execute': (<HTMLInputElement>document.getElementById('settings-execute')).checked };
        this.dataService.mobiusSettings = newSettings;
        this.dataService.dialog.close();
    }

    checkSetting(settingName: string, value: any) {
        return this.dataService.mobiusSettings[settingName] === value;
    }

    closeDialog() {
        (<HTMLInputElement>document.getElementById('settings-execute')).checked = this.dataService.mobiusSettings['execute'];
        this.dataService.dialog.close();
    }

    async loadBackup(event: MouseEvent, filecode: string) {
        event.stopPropagation();
        if (this.dataService.checkbackup_header()) {
            const result = await SaveFileComponent.loadFromFileSystem(filecode);
            if (result === 'error') {
                return;
            }

            this.dataService.file = circularJSON.parse(result);
            this.dataService.file.flowchart.meta.selected_nodes = [this.dataService.file.flowchart.nodes.length - 1];
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            if (this.dataService.mobiusSettings.execute) {
                document.getElementById('executeButton').click();
            }

            // SaveFileComponent.loadFile(filecode, (file) => {
            //     if (file === 'error') {
            //         return;
            //     }
            //     this.dataService.file = circularJSON.parse(file);
            //     this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            //     if (this.dataService.mobiusSettings.execute) {
            //         document.getElementById('executeButton').click();
            //     }
            // });
        } else {
            const func = this.dataService.getbackup();
            // const fileString: any = localStorage.getItem(filecode);
            const result = await SaveFileComponent.loadFromFileSystem(filecode);
            if (!result) {
                return;
            }
            const file = circularJSON.parse(result);
            file.flowchart.meta.selected_nodes = [file.flowchart.nodes.length - 1];
            // parse the flowchart
            const fl = file.flowchart;

            if (this.dataService.flowchart.subFunctions) {
                const subFunctions = this.dataService.flowchart.subFunctions;
                let i = 0;
                while (i < subFunctions.length) {
                    const subFunc = subFunctions[i];
                    if (subFunc.name.substring(0, func.name.length) === func.name) {
                        subFunctions.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            } else {
                this.dataService.flowchart.subFunctions = [];
            }

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
            // func = <IFunction>{
            //     flowchart: <IFlowchart>{
            //         id: fl.id ? fl.id : IdGenerator.getId(),
            //         name: fl.name,
            //         nodes: fl.nodes,
            //         edges: fl.edges
            //     },
            //     name: func.name,
            //     module: 'Imported',
            //     doc: documentation,
            //     importedFile: file
            // };
            func.flowchart = <IFlowchart>{
                id: fl.id ? fl.id : IdGenerator.getId(),
                name: fl.name,
                nodes: fl.nodes,
                edges: fl.edges
            };
            func.name = funcName;
            func.doc = documentation;
            func.importedFile = result;

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
                });
            }
            func.argCount = func.args.length;

            for (const i of fl.functions) {
                i.name = func.name + '_' + i.name;
                this.dataService.flowchart.subFunctions.push(i);
            }
            if (fl.subFunctions) {
                for (const i of fl.subFunctions) {
                    i.name = func.name + '_' + i.name;
                    this.dataService.flowchart.subFunctions.push(i);
                }
            }

            const end = fl.nodes[fl.nodes.length - 1];
            const returnProd = end.procedure[end.procedure.length - 1];
            if (returnProd.args[1].value) {
                func.hasReturn = true;
            } else {
                func.hasReturn = false;
            }
            document.getElementById('tooltiptext').click();

            // SaveFileComponent.loadFile(filecode, (fileString) => {
            //     if (!fileString) {
            //         return;
            //     }
            //     const file = circularJSON.parse(fileString);
            //     // parse the flowchart
            //     const fl = file.flowchart;

            //     if (this.dataService.flowchart.subFunctions) {
            //         const subFunctions = this.dataService.flowchart.subFunctions;
            //         let i = 0;
            //         while (i < subFunctions.length) {
            //             const subFunc = subFunctions[i];
            //             if (subFunc.name.substring(0, func.name.length) === func.name) {
            //                 subFunctions.splice(i, 1);
            //             } else {
            //                 i++;
            //             }
            //         }
            //     } else {
            //         this.dataService.flowchart.subFunctions = [];
            //     }

            //     let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
            //     if (funcName.match(/^[\d_]/)) {
            //         funcName = 'func' + funcName;
            //     }

            //     const documentation = {
            //         name: funcName,
            //         module: 'Imported',
            //         description: fl.description,
            //         summary: fl.description,
            //         parameters: [],
            //         returns: fl.returnDescription
            //     };
            //     // func = <IFunction>{
            //     //     flowchart: <IFlowchart>{
            //     //         id: fl.id ? fl.id : IdGenerator.getId(),
            //     //         name: fl.name,
            //     //         nodes: fl.nodes,
            //     //         edges: fl.edges
            //     //     },
            //     //     name: func.name,
            //     //     module: 'Imported',
            //     //     doc: documentation,
            //     //     importedFile: file
            //     // };
            //     func.flowchart = <IFlowchart>{
            //         id: fl.id ? fl.id : IdGenerator.getId(),
            //         name: fl.name,
            //         nodes: fl.nodes,
            //         edges: fl.edges
            //     };
            //     func.name = funcName;
            //     func.doc = documentation;
            //     func.importedFile = fileString;

            //     func.args = [];
            //     for (const prod of fl.nodes[0].procedure) {
            //         if (!prod.enabled || prod.type !== ProcedureTypes.Constant) { continue; }
            //         let v: string = prod.args[prod.argCount - 2].value || 'undefined';
            //         if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
            //         if (prod.meta.inputMode !== InputType.Constant) {
            //             documentation.parameters.push({
            //                 name: v,
            //                 description: prod.meta.description
            //             });
            //         }
            //         func.args.push(<IArgument>{
            //             name: v,
            //             value: prod.args[prod.argCount - 1].value,
            //             type: prod.meta.inputMode,
            //         });
            //     }
            //     func.argCount = func.args.length;

            //     for (const i of fl.functions) {
            //         i.name = func.name + '_' + i.name;
            //         this.dataService.flowchart.subFunctions.push(i);
            //     }
            //     if (fl.subFunctions) {
            //         for (const i of fl.subFunctions) {
            //             i.name = func.name + '_' + i.name;
            //             this.dataService.flowchart.subFunctions.push(i);
            //         }
            //     }

            //     const end = fl.nodes[fl.nodes.length - 1];
            //     const returnProd = end.procedure[end.procedure.length - 1];
            //     if (returnProd.args[1].value) {
            //         func.hasReturn = true;
            //     } else {
            //         func.hasReturn = false;
            //     }
            //     document.getElementById('tooltiptext').click();
            // });
        }
    }

    deleteBackup(event: MouseEvent, filecode: string) {
        event.stopPropagation();
        // const file = localStorage.getItem(filecode);
        // if (!file) {
        //     return;
        // }
        // localStorage.removeItem(filecode);
        SaveFileComponent.deleteFile(filecode);
        const items: string[] = this.getBackupFiles();
        const i = items.indexOf(filecode);
        if (i !== -1) {
            items.splice(i, 1);
            localStorage.setItem('mobius_backup_list', JSON.stringify(items));
        }
    }

    checkMobBackup(backup): boolean {
        const splitted = backup.split('.');
        if (splitted[splitted.length - 1] === 'mob') {
            return false;
        }
        return true;
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent) {
        let dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
        let nodeMenu = document.getElementById('nodeMenu');
        if (nodeMenu) {
            nodeMenu.style.display = 'none';
        }
        let galleryMenu = document.getElementById('galleryMenu');
        if (galleryMenu) {
            galleryMenu.style.display = 'none';
        }
        let helpMenu = document.getElementById('helpMenu');
        if (helpMenu) {
            helpMenu.style.display = 'none';
        }
        if (this.dataService.dialog) {
            if ((<HTMLElement>event.target).tagName === 'SELECT') { return; }

            const rect = this.dataService.dialog.getBoundingClientRect();

            const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
                && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                this.dataService.dialog.close();
                this.dataService.dialog = null;
            }
        }
        dropdownMenu = null;
        nodeMenu = null;
        galleryMenu = null;
        helpMenu = null;
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            try {
                SaveFileComponent.saveFileToLocal(this.dataService.file);
                this.dataService.notifyMessage(`Saved Flowchart as ${this.dataService.flowchart.name}...`);
            } catch (ex) {
                this.dataService.notifyMessage('ERROR: Unable to save Flowchart');
            }
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
        }
    }

    validateUrl() {
        if (this.urlSet[0] === '') {
            this.urlValid = false;
            return;
        }
        const request = new XMLHttpRequest();

        let url = this.urlSet[0];
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('?dl=0', '');
        }
        request.open('GET', url);

        request.onload = () => {
            if (request.status === 200) {
                try {
                    const f = circularJSON.parse(request.responseText);
                    this.urlNodes = f.flowchart.nodes;
                    this.urlValid = true;
                } catch (ex) {
                    this.urlValid = false;
                }
            } else {
                this.urlValid = false;
            }
        };
        request.onerror = () => {
            this.urlValid = false;
        };
        request.send();
    }

    generateUrl() {
        if (this.urlSet[0] === '') {
            return;
        }
        if (this.urlSet[1] === 'publish') {
            this.urlSet[2] = '';
            this.urlSet[3] = '';
        } else if (this.urlSet[2] === '') {
            this.urlSet[3] = '';
        } else if (this.urlSet[3] === '') {
            this.urlSet[2] = '';
        }

        let url = this.urlSet[0];
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('?dl=0', '');
        }
        url = '_' + btoa(url);

        let txtArea = document.getElementById('generatedLink');
        txtArea.innerHTML = `${window.location.origin}/${this.urlSet[1]}` +
            `?file=${url}${this.urlSet[2]}${this.urlSet[3]}${this.urlSet[4]}`;
        txtArea = null;
    }

    generateEmbed() {
        if (this.urlSet[0] === '') {
            return;
        }
        if (this.urlSet[1] === 'publish') {
            this.urlSet[2] = '';
            this.urlSet[3] = '';
        } else if (this.urlSet[2] === '') {
            this.urlSet[3] = '';
        } else if (this.urlSet[3] === '') {
            this.urlSet[2] = '';
        }

        let url = this.urlSet[0];
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('?dl=0', '');
        }
        url = url.replace(/\//g, '%2F');

        let txtArea = document.getElementById('generatedLink');
        txtArea.innerHTML = `<iframe width='100%' height='600px' style='border: 1px solid black;' src="` +
            `${window.location.origin}/${this.urlSet[1]}` +
            `?file=${url}${this.urlSet[2]}${this.urlSet[3]}${this.urlSet[4]}"` +
            `></iframe>`;
        txtArea = null;
    }

}
