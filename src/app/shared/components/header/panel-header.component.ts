import { Component, Input, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, KeyboardService } from '@shared/services';
import * as circularJSON from 'circular-json';
import { IFlowchart } from '@models/flowchart';
import { ProcedureTypes, IFunction } from '@models/procedure';
import { SaveFileComponent } from '../file';
import { IdGenerator } from '@utils';
import { InputType } from '@models/port';
import { IArgument } from '@models/code';
import * as Modules from '@modules';
import { checkNodeValidity } from '@shared/parser';
import { DownloadUtils } from '../file/download.utils';

@Component({
    selector: 'panel-header',
    templateUrl: 'panel-header.component.html',
    styleUrls: ['panel-header.component.scss']
})
export class PanelHeaderComponent implements OnDestroy {

    @Input() flowchart: IFlowchart;
    executeCheck: boolean;
    nodeListCheck: boolean;
    selectedBackups: string[] = [];

    urlSet = ['', 'publish', '', '', '', ''];
    urlValid: boolean;
    urlNodes;

    settings;
    func_categories = Object.keys(Modules).filter(cat => cat[0] !== '_');
    private ctx = document.createElement('canvas').getContext('2d');
    backupDates;

    constructor(private dataService: DataService, private keyboardService: KeyboardService, private router: Router) {
        SaveFileComponent.updateBackupList();
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

        this.settings = this.dataService.mobiusSettings;

        if (this.settings['execute'] === undefined) { this.settings['execute'] = true; }
        if (this.settings['autosave'] === undefined) { this.settings['autosave'] = true; }
        if (this.settings['debug'] === undefined) { this.settings['debug'] = true; }
        for (const cat in this.func_categories) {
            if (!this.func_categories[cat] || this.settings.hasOwnProperty('_func_' + this.func_categories[cat])) { continue; }
            this.settings['_func_' + this.func_categories[cat]] = true;
        }
        localStorage.setItem('mobius_settings', JSON.stringify(this.settings));
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

    updateSettings() {
        this.settings.execute = (<HTMLInputElement>document.getElementById('settings-execute')).checked;
        this.settings.debug = (<HTMLInputElement>document.getElementById('settings-debug')).checked;
        this.settings.autosave = (<HTMLInputElement>document.getElementById('settings-autosave')).checked;

        for (const cat in this.func_categories) {
            if (!this.func_categories[cat]) { continue; }
            this.settings['_func_' + this.func_categories[cat]] = (<HTMLInputElement>document.getElementById(`_func_${this.func_categories[cat]}`)).checked;
        }
        this.dataService.dialog.close();
        this.dataService.triggerToolsetUpdate();
        localStorage.setItem('mobius_settings', JSON.stringify(this.settings));

    }

    checkSetting(settingName: string, value: any) {
        return this.settings[settingName] === value;
    }

    closeDialog(closeLS = false) {
        if (closeLS) {
            (<HTMLInputElement>document.getElementById('savels-name')).value = this.flowchart.name;
        }
        this.dataService.dialog.close();
    }

    async loadBackup(event: MouseEvent, filecode: string) {
        event.stopPropagation();
        if (this.dataService.checkbackup_header()) {
            if (!confirm('Loading a new file will delete the current flowchart! Would you like to continue?')) {return; }
            const result = await SaveFileComponent.loadFromFileSystem(filecode);
            if (result === 'error') {
                return;
            }
            SaveFileComponent.clearModelData(this.dataService.flowchart, null);
            try {
                this.dataService.file = circularJSON.parse(result);
            } catch (ex) {
                this.dataService.notifyMessage('ERROR: Corrupted local file');
                return;
            }
            this.dataService.file.flowchart.meta.selected_nodes = [this.dataService.file.flowchart.nodes.length - 1];
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            for (const func of this.dataService.flowchart.functions) {
                for (const node of func.flowchart.nodes) {
                    checkNodeValidity(node);
                }
            }
            if (this.dataService.flowchart.subFunctions) {
                for (const func of this.dataService.flowchart.subFunctions) {
                    for (const node of func.flowchart.nodes) {
                        checkNodeValidity(node);
                    }
                }
            }
            for (const node of this.dataService.flowchart.nodes) {
                checkNodeValidity(node);
            }
            if (this.settings.execute) {
                document.getElementById('executeButton').click();
            }

        } else {
            // const fileString: any = localStorage.getItem(filecode);
            const fileString = await SaveFileComponent.loadFromFileSystem(filecode);
            if (!fileString) {
                return;
            }
            const fl = circularJSON.parse(fileString).flowchart;

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

            this.dataService.flowchart.functions.push(funcs.main);
            if (!this.dataService.flowchart.subFunctions) {
                this.dataService.flowchart.subFunctions = [];
            }
            for (const subfunc of funcs.sub) {
                this.dataService.flowchart.subFunctions.push(subfunc);
            }

            this.dataService.notifyMessage(`Successfully import global function ${funcName} from local storage`);
            this.closeDialog();

            // const func = this.dataService.getbackup();
            // // const fileString: any = localStorage.getItem(filecode);
            // const result = await SaveFileComponent.loadFromFileSystem(filecode);
            // if (!result) {
            //     return;
            // }
            // const file = circularJSON.parse(result);
            // file.flowchart.meta.selected_nodes = [file.flowchart.nodes.length - 1];
            // // parse the flowchart
            // const fl = file.flowchart;

            // if (this.dataService.flowchart.subFunctions) {
            //     const subFunctions = this.dataService.flowchart.subFunctions;
            //     let i = 0;
            //     while (i < subFunctions.length) {
            //         const subFunc = subFunctions[i];
            //         if (subFunc.name.substring(0, func.name.length) === func.name) {
            //             subFunctions.splice(i, 1);
            //         } else {
            //             i++;
            //         }
            //     }
            // } else {
            //     this.dataService.flowchart.subFunctions = [];
            // }

            // let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
            // if (funcName.match(/^[\d_]/)) {
            //     funcName = 'func' + funcName;
            // }

            // const documentation = {
            //     name: funcName,
            //     module: 'globalFunc',
            //     description: fl.description,
            //     summary: fl.description,
            //     parameters: [],
            //     returns: fl.returnDescription
            // };
            // func.flowchart = <IFlowchart>{
            //     id: fl.id ? fl.id : IdGenerator.getId(),
            //     name: fl.name,
            //     nodes: fl.nodes,
            //     edges: fl.edges
            // };
            // func.name = funcName;
            // func.doc = documentation;
            // func.importedFile = result;

            // func.args = [];
            // for (const prod of fl.nodes[0].procedure) {
            //     if (!prod.enabled || prod.type !== ProcedureTypes.Constant) { continue; }
            //     let v: string = prod.args[prod.argCount - 2].value || 'undefined';
            //     if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
            //     if (prod.meta.inputMode !== InputType.Constant) {
            //         documentation.parameters.push({
            //             name: v,
            //             description: prod.meta.description
            //         });
            //     }
            //     func.args.push(<IArgument>{
            //         name: v,
            //         value: prod.args[prod.argCount - 1].value,
            //         type: prod.meta.inputMode,
            //     });
            // }
            // func.argCount = func.args.length;

            // for (const i of fl.functions) {
            //     i.name = func.name + '_' + i.name;
            //     this.dataService.flowchart.subFunctions.push(i);
            // }
            // if (fl.subFunctions) {
            //     for (const i of fl.subFunctions) {
            //         i.name = func.name + '_' + i.name;
            //         this.dataService.flowchart.subFunctions.push(i);
            //     }
            // }

            // const end = fl.nodes[fl.nodes.length - 1];
            // const returnProd = end.procedure[end.procedure.length - 1];
            // if (returnProd.args[1].value) {
            //     func.hasReturn = true;
            // } else {
            //     func.hasReturn = false;
            // }
            // document.getElementById('tooltiptext').click();
        }
    }

    getBackupFiles(onlyMobFiles = true) {
        const items = localStorage.getItem('mobius_backup_list');
        // console.log(items)
        this.backupDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
        if (!items) {
            return [];
        }
        const all_items = JSON.parse(items);
        const return_items = [];
        for (const i of all_items) {
            if (i === '___TEMP___.mob') { continue; }
            if (i.endsWith('.mob') === onlyMobFiles) {
                return_items.push(i);
            }
        }
        return return_items;
    }

    openTab(evt, tabID: string) {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName('tabContent');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }
        tablinks = document.getElementsByClassName('tabLinks');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        document.getElementById(tabID).style.display = 'block';
        evt.currentTarget.className += ' active';
        this.selectedBackups = [];
    }

    deleteBackup(event: MouseEvent, filecode: string) {
        event.stopPropagation();
        console.log(this.selectedBackups)
        for (filecode of this.selectedBackups) {
            SaveFileComponent.deleteFile(filecode);
            const itemsString = localStorage.getItem('mobius_backup_list');
            if (!itemsString) { continue; }
            const items: string[] = JSON.parse(itemsString);
            const i = items.indexOf(filecode);
            if (i !== -1) {
                items.splice(i, 1);
                localStorage.setItem('mobius_backup_list', JSON.stringify(items));
                const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
                itemDates[filecode] = (new Date()).toLocaleString();
                localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
            }
        }
        this.selectedBackups = [];
    }

    downloadBackup(event: MouseEvent, filecode: string) {
        event.stopPropagation();
        SaveFileComponent.downloadLocalStorageFile(this.selectedBackups);
        // event.stopPropagation();
        // SaveFileComponent.downloadLocalStorageFile(filecode);
    }

    async addBackup() {
        const selectedFile = (<HTMLInputElement>document.getElementById('addBackup')).files[0];
        const p = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(<string>reader.result);
                };
            reader.readAsText(selectedFile);
        });
        SaveFileComponent.saveToLocalStorage(selectedFile.name, <string> await p);
        (<HTMLInputElement>document.getElementById('addBackup')).value = '';
    }

    selectBackup(backup: string, event: MouseEvent) {
        event.stopPropagation();
        if (event.shiftKey && this.selectedBackups.length > 0) {
            const backup_items = JSON.parse(localStorage.getItem('mobius_backup_list'));
            let indexFrom: number, indexTo: number;

            for (let i = 0; i < backup_items.length; i++) {
                if (backup_items[i] === this.selectedBackups[this.selectedBackups.length - 1]) {
                    indexFrom = i;
                }
                if (backup_items[i] === backup) {
                    indexTo = i;
                }
            }
            let step = 1;
            if (indexFrom > indexTo) {
                step = -1;
            }
            indexTo += step;

            if (this.selectedBackups.indexOf(backup) === -1) {
                for (let i = indexFrom; i !== indexTo; i += step) {
                    if (this.selectedBackups.indexOf(backup_items[i]) === -1) {
                        this.selectedBackups.push(backup_items[i]);
                    }
                }
            } else {
                for (let i = indexFrom; i !== indexTo; i += step) {
                    const backup_index = this.selectedBackups.indexOf(backup_items[i]);
                    if (backup_index !== -1) {
                        this.selectedBackups.splice(backup_index, 1);
                    }
                }
            }
        } else {
            for (let i = 0; i < this.selectedBackups.length; i++) {
                if (this.selectedBackups[i] === backup) {
                    this.selectedBackups.splice(i, 1);
                    return;
                }
            }
            this.selectedBackups.push(backup);
        }
    }

    selectedBackup(backup) {
        for (const b of this.selectedBackups) {
            if (b === backup) {
                return true;
            }
        }
        return false;
    }

    checkMobBackup(backup): boolean {
        const splitted = backup.split('.');
        if (splitted[splitted.length - 1] === 'mob') {
            return false;
        }
        return true;
    }

    prevDef(event) {
        event.preventDefault();
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent) {
        if ((<HTMLElement>event.target).id === 'addBackup' || (<HTMLElement>event.target).id === 'addBackupButton') {
            return;
        }
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

    @HostListener('window:copy', ['$event'])
    onWindowCopy(event: KeyboardEvent) {
        if (this.router.url === '/editor') {
            document.getElementById('copyProdButton').click();
        }
    }

    @HostListener('window:cut', ['$event'])
    onWindowCut(event: KeyboardEvent) {
        if (this.router.url === '/editor') {
            document.getElementById('cutProdButton').click();
        }
    }
    @HostListener('window:paste', ['$event'])
    onWindowPaste(event: KeyboardEvent) {
        if (this.router.url === '/editor') {
            document.getElementById('pasteProdButton').click();
        }
    }


    saveBackup() {
        try {
            let fileName = (<HTMLInputElement>document.getElementById('savels-name')).value + '.mob';
            fileName = fileName.replace(/\s/g, '_');
            SaveFileComponent.saveFileToLocal(fileName, this.dataService.file);
            this.closeDialog();
            this.dataService.notifyMessage(`Saved Flowchart as ${fileName}...`);
        } catch (ex) {
            this.dataService.notifyMessage('ERROR: Unable to save Flowchart');
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            try {
                let fileName = this.dataService.flowchart.name.replace(/\s/g, '_');
                if (fileName.length < 4 || fileName.slice(-4) !== '.mob') {
                    fileName += '.mob';
                }
                SaveFileComponent.saveFileToLocal(fileName, this.dataService.file);
                this.dataService.notifyMessage(`Saved Flowchart as ${fileName}...`);
            } catch (ex) {
                this.dataService.notifyMessage('ERROR: Unable to save Flowchart');
            }
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.keyboardService.update(event);
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
        url = url.replace(/^[\"\']|[\"\']$/g, '');
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
        url = url.replace(/^[\"\']|[\"\']$/g, '');
        url = '_' + btoa(url);

        let txtArea = document.getElementById('generatedLink');
        let baseLink = window.location.origin;
        if (baseLink.indexOf('design-automation.github.io') !== -1) {
            baseLink += '/mobius-parametric-modeller-dev'
        }
        txtArea.innerHTML = `${baseLink}/${this.urlSet[1]}` +
            `?file=${url}${this.urlSet[2]}${this.urlSet[3]}${this.urlSet[4]}${this.urlSet[5]}`;
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
            `?file=${url}${this.urlSet[2]}${this.urlSet[3]}${this.urlSet[4]}${this.urlSet[5]}"` +
            `></iframe>`;
        txtArea = null;
    }

    async refresh_global_func(event: MouseEvent, func) {
        event.stopPropagation();
        const fileName = func.name + '.mob';
        const localFiles = JSON.parse(localStorage.getItem('mobius_backup_list'));
        let check = false;
        for (const f in localFiles) {
            if (localFiles[f] === fileName) {
                check = true;
            }
        }
        if (!check) {
            this.dataService.notifyMessage(`Error: ${func.name}.mob does not exists in local storage,\n` +
            `Unable to update Global Function ${func.name}`);
            return;
        }
        const result = await SaveFileComponent.loadFromFileSystem(fileName);
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
            module: 'globalFunc',
            description: fl.description,
            summary: fl.description,
            parameters: [],
            returns: fl.returnDescription
        };
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
        this.dataService.notifyMessage(`Updated Global Function ${func.name}`);
    }

    download_global_func(event: MouseEvent, fnData) {
        event.stopPropagation();
        const fileString = fnData.importedFile;
        const fname = `${fnData.name}.mob`;
        const blob = new Blob([fileString], {type: 'application/json'});
        DownloadUtils.downloadFile(fname, blob);
        this.closeDialog();
    }

    edit_global_func(event: MouseEvent, fnData) {
        event.stopPropagation();
        const fileString = fnData.importedFile;
        // console.log(fnData);
        SaveFileComponent.saveToLocalStorage('___TEMP___.mob', fileString);
        // localStorage.setItem('temp_file', fileString);
        setTimeout(() => {
            window.open(`${window.location.origin}/editor?file=temp`, '_blank');
        }, 200);
        this.closeDialog();
    }

    delete_global_func(event: MouseEvent, fnData) {
        event.stopPropagation();
        for (let i = 0; i < this.dataService.flowchart.functions.length; i++) {
            if (this.dataService.flowchart.functions[i] === fnData) {
                this.dataService.flowchart.functions.splice(i, 1);
                break;
            }
        }
        let j = 0;
        while (j < this.dataService.flowchart.subFunctions.length) {
            if (this.dataService.flowchart.subFunctions[j].name.substring(0, fnData.name.length) === fnData.name) {
                this.dataService.flowchart.subFunctions.splice(j, 1);
            } else {
                j++;
            }
        }
    }

    addGlobalFunc(event: MouseEvent) {
        document.getElementById('selectImportFile').click();
        this.openHeaderDialog(event, 'globalfunc');
    }
}
