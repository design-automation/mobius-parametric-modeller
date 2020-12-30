import { Component, Input, OnDestroy } from '@angular/core';
import { DownloadUtils } from './download.utils';
import * as circularJSON from 'circular-json';
import { FlowchartUtils, IFlowchart } from '@models/flowchart';
import { DataService } from '@services';
import { InputType } from '@models/port';
import { ProcedureTypes, IProcedure } from '@models/procedure';
import { IdGenerator } from '@utils';
import { IMobius } from '@models/mobius';
import { INode, NodeUtils } from '@models/node';
import JSZip from 'jszip';
import { _parameterTypes } from '@assets/core/modules';

declare global {
    interface Navigator {
        webkitPersistentStorage: {
            requestQuota: (a, b, c) => {}
        };
    }
}
const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota
let _occupied = null;

@Component({
    selector: 'file-save',
    template: `<button id='savefile' class='btn' (click)='download()'>Save</button>
               <button id='savedata' class='btn' (click)='savedata()'>Save</button>`,
    styles: [
        `
            button.btn{
                margin: 0px 0px 0px 0px;
                font-size: 10px;
                line-height: 12px;
                border: 2px solid gray;
                border-radius: 4px;
                padding: 2px 5px;
                background-color: #3F4651;
                color: #E7BF00;
                font-weight: 600;
                text-transform: uppercase;
             }
            button.btn:hover{
                background-color: gray;
                color: white;
            }
             `
    ]
})
// component for saving file to the browser local storage and hard disk.
export class SaveFileComponent implements OnDestroy{
    _interval_: NodeJS.Timer;

    constructor(private dataService: DataService) {
        const settings = this.dataService.mobiusSettings;
        if (settings['autosave'] === undefined) {
            settings['autosave'] = true;
        }
        // this._interval_ = setInterval(() => {
        //     const mobius_settings = this.dataService.mobiusSettings;
        //     if (!mobius_settings['autosave']) { return; }

        //     let fileName = this.dataService.flowchart.name.replace(/\s/g, '_');
        //     if (fileName.length < 4 || fileName.slice(-4) !== '.mob') {
        //         fileName += '.mob';
        //     }
        //     SaveFileComponent.saveFileToLocal(fileName, this.dataService.file);
        //     this.dataService.notifyMessage(`Auto-saving Flowchart as ${fileName}`);
        // }, 300000);
    }


    static saveFileToLocal( fileName: string, f: IMobius) {
        const downloadResult = SaveFileComponent.fileDownloadString(f);
        SaveFileComponent.saveToLocalStorage(fileName, downloadResult.file);
    }

    static saveToLocalStorage(name: string, file: string) {
        if (_occupied === name) {
            return;
        } else if (_occupied !== null) {
            while (_occupied !== null) {
                continue;
            }
        }
        _occupied = name;

        setTimeout(() => {
            _occupied = null;
        }, 5000);

        const itemstring = localStorage.getItem('mobius_backup_list');
        const code = name;
        if (!itemstring) {
            localStorage.setItem('mobius_backup_list', `["${code}"]`);
            localStorage.setItem('mobius_backup_date_dict', `{ "${code}": "${(new Date()).toLocaleString()}"}`);
        } else {
            const items: string[] = JSON.parse(itemstring);
            let check = false;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item === code) {
                    items.splice(i, 1);
                    items.unshift(item);
                    check = true;
                    break;
                }
            }
            if (!check) {
                items.unshift(code);
                // if (itemss.length > 10) {
                //     const item = items.pop();
                //     localStorage.removeItem(item);
                // }
            }
            localStorage.setItem('mobius_backup_list', JSON.stringify(items));
            const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
            itemDates[code] = (new Date()).toLocaleString();
            localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
        }

        navigator.webkitPersistentStorage.requestQuota (
            requestedBytes, function(grantedBytes) {
                // @ts-ignore
                window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS,
                function(e) { console.log('Error', e); });
            }, function(e) { console.log('Error', e); }
        );

        function saveToFS(fs) {
            fs.root.getFile(code, { create: true}, function (fileEntry) {
                fileEntry.createWriter(async function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        _occupied = null;
                    };
                    // fileWriter.onerror = function (e) {
                    //     console.log('Write failed: ' + e.toString());
                    // };
                    const bb = new Blob([file + '_|_|_'], {type: 'text/plain;charset=utf-8'});
                    await fileWriter.write(bb);
                }, (e) => { console.log(e); });
            }, (e) => { console.log(e.code); });
        }

        SaveFileComponent.deleteUnaccountedFile();
        // localStorage.setItem(code, file);
    }


    static deleteFile(filecode) {
        // window['_code__'] = filecode;
        navigator.webkitPersistentStorage.requestQuota (
            requestedBytes, function(grantedBytes) {
                // @ts-ignore
                window.webkitRequestFileSystem(PERSISTENT, grantedBytes, removeFromFS);
            }, function(e) { console.log('Error', e); }
        );
        function removeFromFS(fs) {
            fs.root.getFile(filecode, {create: false}, function(fileEntry) {
                fileEntry.remove(function() {
                    // console.log('File removed.');
                    const items: string[] = JSON.parse(localStorage.getItem('mobius_backup_list'));
                    const i = items.indexOf(filecode);
                    if (i !== -1) {
                        items.splice(i, 1);
                        localStorage.setItem('mobius_backup_list', JSON.stringify(items));
                        const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
                        delete itemDates[filecode];
                        localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
                    }
                    window['_code__'] = undefined;
                }, (e) => { console.log('Error', e); });
            });
        }
    }

    static async downloadLocalStorageFile(filecodes) {
        if (filecodes.length === 0) {
            return;
        }
        if (filecodes.length === 1) {
            const file = await SaveFileComponent.loadFromFileSystem(filecodes[0]);
            const blob = new Blob([file], { type: 'application/json' });
            DownloadUtils.downloadFile(filecodes[0], blob);
            return;
        }
        const zip = new JSZip();
        for (const filecode of filecodes) {
            const file = await SaveFileComponent.loadFromFileSystem(filecode);
            zip.file(filecode, file);
        }
        zip.generateAsync({type: 'blob'}).then(function(content) {
            DownloadUtils.downloadFile('local_storage_files.zip', content);
        });
        // const blob = new Blob([file], { type: 'application/json' });
    }


    static deleteUnaccountedFile() {
        navigator.webkitPersistentStorage.requestQuota (
            requestedBytes, function(grantedBytes) {
                // @ts-ignore
                window.webkitRequestFileSystem(PERSISTENT, grantedBytes, fs => {
                    const dirReader = fs.root.createReader();
                    const validList = JSON.parse(localStorage.getItem('mobius_backup_list'));
                    dirReader.readEntries(function(results) {
                        if (results.length) {
                            for (const i of results) {
                                if (validList.indexOf(i.name) === -1) {
                                    i.remove(function() {
                                        /* the file was removed successfully */
                                    });
                                }
                            }
                        }
                    }, function(error) {
                        console.log(error)
                        /* handle error -- error is a FileError object */
                    });
                });
            }, function(e) { console.log('Error', e); }
        );
    }

    static async loadFromFileSystem(filecode): Promise<any> {
        const p = new Promise((resolve) => {
            navigator.webkitPersistentStorage.requestQuota (
                requestedBytes, function(grantedBytes) {
                    // @ts-ignore
                    window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function(fs) {
                        fs.root.getFile(filecode, {}, function(fileEntry) {
                            fileEntry.file((file) => {
                                const reader = new FileReader();
                                reader.onerror = () => {
                                    resolve('error');
                                };
                                reader.onloadend = () => {
                                    if ((typeof reader.result) === 'string') {
                                        resolve((<string>reader.result).split('_|_|_')[0]);
                                        // const splitted = (<string>reader.result).split('_|_|_');
                                        // let val = splitted[0];
                                        // for (const i of splitted) {
                                        //     if (val.length < i.length) {
                                        //         val = i;
                                        //     }
                                        // }
                                        // resolve(val);
                                    } else {
                                        resolve(reader.result);
                                    }
                                };
                                reader.readAsText(file, 'text/plain;charset=utf-8');
                            });
                        });
                    });
                }, function(e) { console.log('Error', e); }
            );
        });
        return await p;
    }

    static checkDisappearedNodes(checkNode: INode, nodeList: INode[]) {
        for (const node of nodeList) {
            if (node.id === checkNode.id) {
                return true;
            }
        }
        nodeList.splice(nodeList.length - 1, 0, checkNode);
    }

    static clearModelData(f: IFlowchart, clearAll = true, clearState = true) {
        for (const node of f.nodes) {
            if (node.input.hasOwnProperty('value')) {
                node.input.value = undefined;
            }
            if (node.output.hasOwnProperty('value')) {
                node.output.value = undefined;
            }
            if (clearState) {
                for (const prod of node.state.procedure) {
                    prod.selected = false;
                    prod.lastSelected = false;
                }
                node.state.procedure = [];
            }
            SaveFileComponent.clearResolvedValue(node.procedure, clearAll);
            if (node.localFunc) {
                SaveFileComponent.clearResolvedValue(node.localFunc, clearAll);
            }
        }
        if (f.functions) {
            for (const func of f.functions) {
                SaveFileComponent.clearModelData(func.flowchart, null, clearAll);
            }
        }
        if (f.subFunctions) {
            for (const func of f.subFunctions) {
                SaveFileComponent.clearModelData(func.flowchart, null, clearAll);
            }
        }
    }

    static clearResolvedValue(prodList: IProcedure[], clearAll) {
        prodList.forEach(prod => {
            if (prod.hasOwnProperty('resolvedValue')) {
                prod.resolvedValue = undefined;
            }
            // ******** delete some unnecessary parameters for saving ******** //
            if (clearAll) {
                delete prod['selected'];
                delete prod['lastSelected'];
                delete prod['hasError'];
                for (const arg of prod.args) {
                    delete arg['invalidVar'];
                    delete arg['linked'];
                }
            }
            if (prod.children) {
                SaveFileComponent.clearResolvedValue(prod.children, clearAll);
            }
        });
    }

    static fileDownloadString(f: IMobius): {'name': string, 'file': string} {
        const main_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        const cesiumSettings = JSON.parse(localStorage.getItem('cesium_settings'));
        if (cesiumSettings) {
            if (cesiumSettings.cesium) {
                delete cesiumSettings.cesium;
            }
            main_settings.cesium = cesiumSettings;
        }
        f.settings = JSON.stringify(main_settings);

        // if any node disappears from the flowchart but is still present in any edge (due to bug), restore the node.
        for (const edge of f.flowchart.edges) {
            SaveFileComponent.checkDisappearedNodes(edge.source.parentNode, f.flowchart.nodes);
            SaveFileComponent.checkDisappearedNodes(edge.target.parentNode, f.flowchart.nodes);
        }

        // order the flowchart execution order if it's not ordered
        if (!f.flowchart.ordered) {
            FlowchartUtils.orderNodes(f.flowchart);
        }

        // for (const prod of f.flowchart.nodes[0].procedure) {
        //     if (prod.type !== ProcedureTypes.Constant) { continue; }
        //     if (prod.meta.inputMode.toString() === InputType.File.toString()) {
        //         const arg = prod.args[1];
        //         if (arg.value && arg.value.lastModified) {
        //             const p = new Promise((resolve) => {
        //                 const reader = new FileReader();
        //                 reader.onload = function () {
        //                     resolve(reader.result);
        //                 };
        //                 reader.readAsText(arg.value);
        //             });
        //             window.localStorage.setItem(arg.value.name, '`' + await p + '`');
        //             arg.value = { 'name': arg.value.name };
        //         }
        //         if (arg.value && arg.value.lastModified) {
        //             const p = new Promise((resolve) => {
        //                 const reader = new FileReader();
        //                 reader.onload = function () {
        //                     resolve(reader.result);
        //                 };
        //                 reader.readAsText(arg.value);
        //             });
        //             window.localStorage.setItem(arg.value.name, '`' + await p + '`');
        //             arg.value = { 'name': arg.value.name };
        //         }
        //     }
        // }


        // clear the nodes' input/output in the flowchart, save them in modelMap
        // (save time on JSON stringify + parse)
        const flowchartModel = f.flowchart.model;
        f.flowchart.model = undefined;
        SaveFileComponent.clearModelData(f.flowchart, false, false);

        // make a copy of the flowchart
        const savedfile = circularJSON.parse(circularJSON.stringify(f));
        f.flowchart.model = flowchartModel;

        SaveFileComponent.clearModelData(savedfile.flowchart);


        // reset each node's id in the new copy of the flowchart --> the same node will
        // have different id everytime it's saved
        // (to track if one single .mob file is passed around among the students)
        for (const node of savedfile.flowchart.nodes) {
            node.id = IdGenerator.getNodeID();
            // for (const prod of node.state.procedure) {
            //     prod.selected = false;
            //     prod.lastSelected = false;
            // }
            // node.state.procedure = [];
        }

        // **** need to modify this when changing the input's constant function:
        // **** this part resets the value of the last argument of the function when saving the file
        /*
        for (const prod of savedfile.flowchart.nodes[0].procedure) {
            prod.args[prod.argCount - 1].value = undefined;
        }
        */


        // unselect all selected nodes + edges in the new flowchart copy
        savedfile.flowchart.meta.selected_nodes = [0];
        savedfile.flowchart.last_updated = new Date();
        for (const edge of savedfile.flowchart.edges) {
            // delete edge['selected'];
            edge.selected = false;
        }

        // get the saved file name
        if (!savedfile.name || savedfile.name === '' || savedfile.name.toLowerCase() === 'untitled') {
            savedfile.name = savedfile.flowchart.name;
        }

        // stringify the new copy (with formatting)
        const fileString = circularJSON.stringify(savedfile);
        let fname = savedfile.name.replace(/\ /g, '_');
        if (savedfile.name.length < 4 || savedfile.name.substring(savedfile.name.length - 4) !== '.mob') {
            fname = `${fname}.mob`;
        }

        return {'name': fname, 'file': fileString};
    }

    static updateBackupList() {
        const backups = JSON.parse(localStorage.getItem('mobius_backup_list'));
        if (!backups) { return; }
        const backupdates = {};
        for (const backup of backups) {
            // if (!backupdates[backup]) {
                navigator.webkitPersistentStorage.requestQuota (
                    requestedBytes, function(grantedBytes) {
                        // @ts-ignore
                        window.webkitRequestFileSystem(PERSISTENT, grantedBytes, (fs) => {
                            fs.root.getFile(backup, {create: false}, function(fileEntry) {
                                fileEntry.getMetadata( f => {
                                    backupdates[backup] = f.modificationTime.toLocaleString();
                                    localStorage.setItem('mobius_backup_date_dict', JSON.stringify(backupdates));
                                    if (Object.keys(backupdates).length === backups.length) {
                                        SaveFileComponent.reorderBackupList(backups, backupdates);
                                    }
                                });
                            });
                        });
                    }, function(e) { console.log('Error', e); }
                );
            // }
        }
    }

    static reorderBackupList(backups, backupdates) {
        let reorderList = [];
        for (const backup of backups) {
            reorderList.push([backup, new Date(backupdates[backup])]);
        }
        reorderList = reorderList.sort((a, b) => {
            if (a[1] > b[1]) {
                return -1;
            } else if (a[1] < b[1]) {
                return 1;
            } else {
                return 0;
            }
        });
        localStorage.setItem('mobius_backup_list', JSON.stringify(reorderList.map(item => item[0])));
    }

    ngOnDestroy() {
        if (this._interval_) {
            clearInterval(this._interval_);
        }
    }

    async download() {
        const downloadResult = SaveFileComponent.fileDownloadString(this.dataService.file);

        const blob = new Blob([downloadResult.file], { type: 'application/json' });

        try {
            let fileName = this.dataService.file.flowchart.name;
            if (fileName.slice(-4) !== '.mob') {
                fileName += '.mob';
            }
            SaveFileComponent.saveToLocalStorage(fileName, downloadResult.file);
        } catch (ex) {
            console.log('Unable to save file to local storage');
        }
        DownloadUtils.downloadFile(downloadResult.name, blob);
        this.dataService.file.name = 'Untitled';
    }

    async savedata() {
        const newFile: IMobius = {
            name: this.dataService.file.name,
            author: 'new_user',
            version: this.dataService.file.version,
            flowchart: FlowchartUtils.newflowchart(),
            settings: {}
        };
        newFile.flowchart.name = this.dataService.flowchart.name;

        const main_settings = JSON.parse(localStorage.getItem('mpm_settings'));
        const cesiumSettings = JSON.parse(localStorage.getItem('cesium_settings'));
        if (cesiumSettings) {
            if (cesiumSettings.cesium) {
                delete cesiumSettings.cesium;
            }
            main_settings.cesium = cesiumSettings;
        }
        newFile.settings = JSON.stringify(main_settings);

        const splitDesc = this.dataService.flowchart.description.split('\n');
        let i = 0;
        while (i < splitDesc.length) {
            const trimmedLine = splitDesc[i].replace(/ /g, '');
            if (trimmedLine.startsWith('console:')
            ||  trimmedLine.startsWith('model:')
            ||  trimmedLine.startsWith('normalize:')) {
                splitDesc.splice(i, 1);
            } else {
                i += 1;
            }
        }
        let flowchart_desc = '';

        for (const prod of this.dataService.flowchart.nodes[0].procedure) {
            if (prod.type !== ProcedureTypes.Constant) { continue; }
            for (let j = 0; j < splitDesc.length; j ++) {
                const trimmedLine = splitDesc[j].replace(/ /g, '');
                if (trimmedLine.startsWith(prod.args[0].value + ':[')) {
                    splitDesc.splice(j, 1);
                    break;
                }
            }
            flowchart_desc += '\n' + prod.args[0].value + ' = ' + prod.args[1].value;
        }
        newFile.flowchart.description = splitDesc.join('\n') + flowchart_desc;

        const node = newFile.flowchart.nodes[1];
        if (!this.dataService.flowchart.model) {
            this.dataService.notifyMessage('No model to be saved');
            return;
        }
        const modelVal = '\'__model_data__' + this.dataService.flowchart.model.exportGI(null).replace(/\\/g, '\\\\').replace(/\'/g, '\\\'') + '\'';
        // NodeUtils.add_procedure(node, ProcedureTypes.MainFunction, {
        //     'module': 'io',
        //     'name': 'Import',
        //     'argCount': 3,
        //     'args': [
        //         {'name': '__model__'},
        //         {
        //             'name': 'model_data',
        //             'value': modelVal
        //         }, {
        //             'name': 'data_format',
        //             'value': '\'gi\'',
        //             'jsValue': '\'gi\''
        //         }
        //     ],
        //     'hasReturn': true
        // });
        NodeUtils.add_procedure(node, ProcedureTypes.MainFunction, {
            'module': 'util',
            'name': 'ModelMerge',
            'argCount': 2,
            'args': [
                {'name': '__model__'},
                {
                    'name': 'input_data',
                    'value': modelVal
                }
            ],
            'hasReturn': true
        });

        node.procedure[node.procedure.length - 1].args[0].value = 'mod';
        node.procedure[node.procedure.length - 1].args[0].jsValue = 'mod';

        const downloadResult = {
            'name': newFile.name.replace(/\ /g, '_') + '_data.mobdata',
            'file': circularJSON.stringify(newFile)
        };

        const blob = new Blob([downloadResult.file], { type: 'application/json' });

        DownloadUtils.downloadFile(downloadResult.name, blob);

    }


}
