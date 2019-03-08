import { Component, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import { ProcedureTypes } from '@shared/models/procedure';
import * as circularJSON from 'circular-json';
import * as funcs from '@modules';
import { DataService } from '@services';
import { _parameterTypes } from '@modules';
import { ModuleList } from '@shared/decorators';
import { Router } from '@angular/router';
import { checkMissingProd } from '@shared/checkMissingProd';
import { checkNodeValidity } from '@shared/parser';

@Component({
  selector: 'load-url',
  template:  `<button id='loadurl' class='btn'></button>`,
  styles: [
            `
            button.btn{
                visibility: hidden;
            }
            `
          ]
})
export class LoadUrlComponent {

    constructor(private dataService: DataService, private router: Router) {}


    async loadStartUpURL(routerUrl: string) {
        let url: any = routerUrl.split('file=');
        if (url.length <= 1 ) {
            return;
        }
        url = url[1].split('&')[0];
        url = url.replace(/%2F/g, '/');
        url = url.replace(/%5C/g, '\\');
        url = url.replace(/%22|%27|'|\s/g, '');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        if (routerUrl.indexOf('node=') !== -1) {
            let nodeID: any = routerUrl.split('node=')[1].split('&')[0];
            nodeID = Number(nodeID.replace(/%22|%27|'/g, ''));
            await this.loadURL(url, nodeID);
        } else {
            await this.loadURL(url);
        }
    }



    async loadURL(url: string, nodeID?: number) {
        const p = new Promise((resolve) => {
            const request = new XMLHttpRequest();

            request.open('GET', url);
            request.onload = () => {
                if (request.status === 200) {

                    const f = circularJSON.parse(request.responseText);
                    const urlSplit = url.split('/');
                    const file: IMobius = {
                        name: urlSplit[urlSplit.length - 1 ].split('.mob')[0],
                        author: f.author,
                        flowchart: f.flowchart,
                        last_updated: f.last_updated,
                        version: f.version,
                        settings: f.settings || {}
                    };
                    // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

                    // TO BE REMOVED after all the existing mob files are updated
                    const endNode = file.flowchart.nodes[file.flowchart.nodes.length - 1];
                    if (endNode.procedure.length === 0) {
                        endNode.procedure = [{type: 13, ID: '',
                        parent: undefined,
                        meta: {name: '', module: ''},
                        children: undefined,
                        variable: undefined,
                        argCount: 0,
                        args: [],
                        print: false,
                        enabled: true,
                        selected: false,
                        selectGeom: false,
                        hasError: false}];
                    }
                    if (endNode.procedure[endNode.procedure.length - 1].type !== 11) {
                        const returnMeta = _parameterTypes.return.split('.');
                        for (const i of ModuleList) {
                            if (i.module !== returnMeta[0]) { continue; }
                            for ( const j of i.functions) {
                                if (j.name !== returnMeta[1]) { continue; }
                                endNode.procedure.push({type: 11, ID: '',
                                parent: undefined,
                                meta: {name: '', module: ''},
                                children: undefined,
                                variable: undefined,
                                argCount: j.argCount,
                                args: j.args,
                                print: false,
                                enabled: true,
                                selected: false,
                                selectGeom: false,
                                hasError: false});
                                break;
                            }
                            break;
                        }
                    }
                    // REMOVE ENDS
                    let hasError = false;
                    for (const node of file.flowchart.nodes) {
                        if (!checkMissingProd(node.procedure)) {
                            node.hasError = true;
                            hasError = true;
                        }
                    }
                    if (hasError) {
                        alert('The flowchart contains functions that does not exist in the current version of Mobius');
                    }


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
            return;
        }
        this.dataService.file = loadeddata;
        if (loadeddata.settings && JSON.stringify(loadeddata.settings) !== '{}') {
            window.localStorage.setItem('mpm_settings', loadeddata.settings);
        }
        this.dataService.newFlowchart = true;
        if ((nodeID || nodeID === 0) && nodeID >= 0 && nodeID < loadeddata.flowchart.nodes.length) {
            loadeddata.flowchart.meta.selected_nodes = [nodeID];
            this.router.navigate(['/editor']);
        } else if (this.dataService.node.type !== 'end') {
            loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];
        }
        for (const node of loadeddata.flowchart.nodes) {
            checkNodeValidity(node);
        }
        const executeB = document.getElementById('executeButton');
        if (executeB) { executeB.click(); }
    }

}
