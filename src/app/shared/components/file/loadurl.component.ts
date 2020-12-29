import { Component, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import { ProcedureTypes } from '@shared/models/procedure';
import * as circularJSON from 'circular-json';
import * as funcs from '@modules';
import { DataService } from '@services';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { ModuleList } from '@shared/decorators';
import { Router } from '@angular/router';
import { checkNodeValidity } from '@shared/parser';
import { IdGenerator, updateLocalViewerSettings, updateCesiumViewerSettings } from '@utils';
import { checkMobFile } from '@shared/updateOldMobFile';
import { SaveFileComponent } from './savefile.component';
import { InputType } from '@models/port';

@Component({
    selector: 'load-url',
    template:  `<button id='loadurl' class='btn' (click)="loadInputUrl()"></button>
                <input id='loadurl_input' type='text' class='url'>`,
    styles: [
              `
              button.btn{
                  visibility: hidden;
              };
              input.url {
                  visibility: hidden;
              }
              `
            ]
  })
// Component for loading a .mob file from a specific url into mobius.
export class LoadUrlComponent {

    constructor(private dataService: DataService, private router: Router) {}



    /*
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        LOAD URL PARAMETERS:

        file="<<file_url>>" -> load file on load

        node=<<node_index>> -> switch to node with index node_index

        showViewer=0 -> show all viewers
        showViewer=1 -> show GI viewer only
        showViewer=2 -> show Geo viewer only
        showViewer=3 -> show Console only
        showViewer=4 -> show Help only
        showViewer=[1,2,3] -> show combination of viewers listed above

        defaultViewer=0 -> show console on load
        defaultViewer=1 -> show GI viewer on load
        defaultViewer=2 -> show Geo viewer on load
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    */

    async loadStartUpURL(routerUrl: string): Promise<boolean> {
        const url = this.extractUrl(routerUrl);
        if (!url) { return; }
        if (routerUrl.indexOf('node=') !== -1) {
            let nodeID: any = routerUrl.split('node=')[1].split('&')[0];
            nodeID = Number(nodeID.replace(/%22|%27|'/g, ''));
            return await this.loadURL(url, nodeID, false);
        } else {
            return await this.loadURL(url, null, false);
        }
    }

    loadInputUrl() {
        const input: HTMLInputElement = <HTMLInputElement> document.getElementById('loadurl_input');
        const keepSettings: boolean = input.value.indexOf('keepSettings') !== -1;
        const url = this.extractUrl(input.value);
        this.loadURL(url, null, keepSettings, true);
        input.value = '';
    }

    extractUrl(rawUrl: string) {
        let url: any = rawUrl.split('file=');
        if (url.length <= 1 ) {
            return false;
        }
        if (url[1] === 'temp') {
            this.loadTempFile();
            return false;
        }
        url = url[1].split('&')[0];
        if (url[0] === '_') {
            url = atob(decodeURIComponent(url.substring(1)));
        } else {
            url = decodeURIComponent(url);
        }
        url = url.replace(/'|\s/g, '');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        return url;
    }

    async loadURL(url: string, nodeID?: number, loadURLSettings?: any, newParams?: any): Promise<boolean> {
        const p = new Promise((resolve) => {
            const request = new XMLHttpRequest();

            request.open('GET', url);
            request.onload = () => {
                if (request.status === 200) {
                    let f: any;
                    try {
                        f = circularJSON.parse(request.responseText);
                    } catch (ex) {
                        this.dataService.notifyMessage(`ERROR: Unable to read file...`);
                        throw(ex);
                    }
                    if (!f.flowchart.id) {
                        f.flowchart.id = IdGenerator.getId();
                    }
                    const urlSplit = url.split('/');
                    const file: IMobius = {
                        name: urlSplit[urlSplit.length - 1 ].split('.mob')[0],
                        author: f.author,
                        flowchart: f.flowchart,
                        version: f.version,
                        settings: f.settings || {}
                    };
                    // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

                    checkMobFile(file);

                    resolve(file);
                } else {
                    resolve('error happened');
                }
            };

            request.onerror = () => {
                resolve('error happened');
            };
            request.send();
        });
        const loadeddata: any = await p;
        if (loadeddata === 'error happened') {
            return false;
        }

        SaveFileComponent.clearModelData(this.dataService.flowchart);
        delete this.dataService.file.flowchart;
        this.dataService.file = loadeddata;
        if (!loadURLSettings || !loadURLSettings.keepSettings) {
            if (updateLocalViewerSettings(loadeddata.settings)) {
                this.dataService.viewerSettingsUpdated = true;
            }
            updateCesiumViewerSettings(loadeddata.settings);
        }
        this.dataService.newFlowchart = true;
        if ((nodeID || nodeID === 0) && nodeID >= 0 && nodeID < loadeddata.flowchart.nodes.length) {
            loadeddata.flowchart.meta.selected_nodes = [nodeID];
            this.router.navigate(['/editor']);
        } else if (this.dataService.node.type !== 'end') {
            loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];
        }
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
        for (const node of loadeddata.flowchart.nodes) {
            checkNodeValidity(node);
        }
        if (newParams) {
            for (const prod of this.dataService.flowchart.nodes[0].procedure) {
                if (prod.type === ProcedureTypes.Constant) {
                    if (newParams[prod.args[0].value] !== undefined) {
                        prod.args[1].value = newParams[prod.args[0].value];
                    }
                    if (newParams[prod.args[0].jsValue] !== undefined) {
                        prod.args[1].value = newParams[prod.args[0].jsValue];
                    }
                    if (typeof prod.args[1].jsValue === 'object') {
                        prod.args[1].value = JSON.stringify(prod.args[1].jsValue);
                    }
                    if (prod.meta.inputMode === InputType.SimpleInput || prod.meta.inputMode === InputType.URL) {
                        prod.args[1].jsValue = prod.args[1].value;
                    }
                }
            }

        }
        setTimeout(() => {
            const zoomFlowchart = document.getElementById('zoomToFit');
            if (zoomFlowchart && (!loadURLSettings || !loadURLSettings.keepCamera)) { zoomFlowchart.click(); }
            let executeB = document.getElementById('executeButton');
            if (executeB && this.dataService.mobiusSettings.execute) { executeB.click(); }
            executeB = null;
            this.dataService.clearModifiedNode();
        }, 200);

        return true;
    }


    async loadTempFile() {
        let f = await SaveFileComponent.loadFromFileSystem('___TEMP___.mob');
        // let f: any = localStorage.getItem('temp_file');
        if (!f || f === 'error') { return; }
        f = circularJSON.parse(f);

        if (!f.flowchart.id) {
            f.flowchart.id = IdGenerator.getId();
        }
        const loadeddata: IMobius = {
            name: f.name,
            author: f.author,
            flowchart: f.flowchart,
            version: f.version,
            settings: f.settings || {}
        };

        // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

        checkMobFile(loadeddata);
        loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];

        SaveFileComponent.clearModelData(this.dataService.flowchart);
        delete this.dataService.file.flowchart;
        this.dataService.file = loadeddata;
        if (updateLocalViewerSettings(loadeddata.settings)) {
            this.dataService.viewerSettingsUpdated = true;
        }
        updateCesiumViewerSettings(loadeddata.settings);
        this.dataService.newFlowchart = true;
        this.router.navigate(['/editor']);
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
        for (const node of loadeddata.flowchart.nodes) {
            checkNodeValidity(node);
        }
        this.dataService.clearModifiedNode();
        // localStorage.removeItem('temp_file');
        SaveFileComponent.deleteFile('___TEMP___.mob');

        setTimeout(() => {
            const zoomFlowchart = document.getElementById('zoomToFit');
            if (zoomFlowchart) { zoomFlowchart.click(); }
            let executeB = document.getElementById('executeButton');
            if (executeB && this.dataService.mobiusSettings.execute) { executeB.click(); }
            executeB = null;
        }, 200);

        // SaveFileComponent.loadFile('___TEMP___.mob', (f) => {
        //     // let f: any = localStorage.getItem('temp_file');
        //     if (!f || f === 'error') { return; }
        //     f = circularJSON.parse(f);

        //     if (!f.flowchart.id) {
        //         f.flowchart.id = IdGenerator.getId();
        //     }
        //     const loadeddata: IMobius = {
        //         name: f.name,
        //         author: f.author,
        //         flowchart: f.flowchart,
        //         version: f.version,
        //         settings: f.settings || {}
        //     };

        //     // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

        //     checkMobFile(loadeddata);

        //     this.dataService.file = loadeddata;
        //     if (loadeddata.settings && JSON.stringify(loadeddata.settings) !== '{}') {
        //         window.localStorage.setItem('mpm_settings', loadeddata.settings);
        //     }
        //     this.dataService.newFlowchart = true;
        //     this.router.navigate(['/editor']);
        //     for (const func of this.dataService.flowchart.functions) {
        //         for (const node of func.flowchart.nodes) {
        //             checkNodeValidity(node);
        //         }
        //     }
        //     if (this.dataService.flowchart.subFunctions) {
        //         for (const func of this.dataService.flowchart.subFunctions) {
        //             for (const node of func.flowchart.nodes) {
        //                 checkNodeValidity(node);
        //             }
        //         }
        //     }
        //     for (const node of loadeddata.flowchart.nodes) {
        //         checkNodeValidity(node);
        //     }
        //     this.dataService.clearModifiedNode();
        //     // localStorage.removeItem('temp_file');
        //     SaveFileComponent.deleteFile('___TEMP___.mob');

        //     setTimeout(() => {
        //         let executeB = document.getElementById('executeButton');
        //         if (executeB && this.dataService.mobiusSettings.execute) { executeB.click(); }
        //         executeB = null;
        //     }, 50);
        // });
    }
}
