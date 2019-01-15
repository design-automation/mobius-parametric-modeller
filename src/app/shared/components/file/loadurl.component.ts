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

@Component({
  selector: 'load-url',
  template:  `<button id='loadurl' class='btn' (click)='loadURL()'></button>`,
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
        url = url.replace(/%22|%27|'/g, '');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }

        if (routerUrl.indexOf('node=') !== 1) {
            let nodeID: any = routerUrl.split('node=')[1].split('&')[0];
            nodeID = Number(nodeID.replace(/%22|%27|'/g, ''));
            this.loadURL(url, nodeID);
        } else {
            this.loadURL(url);
        }
    }

    loadURL(url: string, nodeID?: number) {
        const stream = Observable.create(observer => {
            const request = new XMLHttpRequest();

            request.open('GET', url);
            request.onload = () => {
                if (request.status === 200) {
                    const f = circularJSON.parse(request.responseText);
                    const file: IMobius = {
                        name: f.name,
                        author: f.author,
                        flowchart: f.flowchart,
                        last_updated: f.last_updated,
                        version: f.version
                    };
                    const urlSplit = url.split('/');
                    file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

                    // TO BE REMOVED after all the existing mob files are updated
                    const endNode = file.flowchart.nodes[file.flowchart.nodes.length - 1];
                    if (endNode.procedure.length === 0) {
                        endNode.procedure = [{type: 13, ID: '',
                        parent: undefined,
                        meta: {name: '', module: ''},
                        children: undefined,
                        argCount: 0,
                        args: [],
                        print: false,
                        enabled: true,
                        selected: false,
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
                                argCount: j.argCount,
                                args: j.args,
                                print: false,
                                enabled: true,
                                selected: false,
                                hasError: false});
                                break;
                            }
                            break;
                        }
                    }
                    // REMOVE ENDS

                    observer.next(file);
                    observer.complete();
                } else {
                    console.log('Error: Unable to load file: ' + url);
                    observer.error('error happened');
                }
            };

            request.onerror = () => {
                console.log('Error: Unable to load file: ' + url);
                observer.error('error happened');
            };
            request.send();
        });
        stream.subscribe(loadeddata => {
            this.dataService.file = loadeddata;
            this.dataService.newFlowchart = true;
            if (nodeID) {
                loadeddata.flowchart.meta.selected_nodes = [nodeID];
                this.router.navigate(['/editor']);
            } else if (this.dataService.node.type !== 'end') {
                loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];
            }
            document.getElementById('executeButton').click();
        });
    }

}
