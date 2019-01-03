import { Component, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import { ProcedureTypes } from '@shared/models/procedure';
import * as circularJSON from 'circular-json';
import * as funcs from '@modules';
import { DataService } from '@services';

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

    constructor(private dataService: DataService) {}

    loadStartUpURL(routerUrl: string) {
        let url: any = routerUrl.split('file=');
        if (url.length <= 1 ) {
            return;
        }
        url = url[1].split('&')[0];
        url = url.replace(/%2F/g, '/');
        url = url.replace(/%5C/g, '\\');
        url = url.replace(/%22/g, '');
        url = url.replace(/'/g, '');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        // url = url.substring(1, url.length - 1);
        this.loadURL(url);

    }

    loadURL(url: string) {
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
                    observer.next(file);
                    observer.complete();
                } else {
                    observer.error('error happened');
                }
            };

            request.onerror = () => {
            observer.error('error happened');
            };
            request.send();
        });
        stream.subscribe(loadeddata => {
            this.dataService.file = loadeddata;
            this.dataService.newFlowchart = true;
            if (this.dataService.node.type !== 'end') {
                for (let i = 0; i < loadeddata.flowchart.nodes.length; i++) {
                    if (loadeddata.flowchart.nodes[i].type === 'end') {
                        loadeddata.flowchart.meta.selected_nodes = [i];
                        break;
                    }
                }
            }
            document.getElementById('executeButton').click();
        });
    }

}
