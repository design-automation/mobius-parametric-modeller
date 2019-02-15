import { Component } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { DataService } from '@services';
import { _parameterTypes } from '@modules';
import { ModuleList } from '@shared/decorators';
import { checkMissingProd } from '@shared/checkMissingProd';

@Component({
  selector: 'file-load',
  template:  `<button id='loadfile' class='btn' onclick="document.getElementById('file-input').click();">Load</button>
              <input id="file-input" type="file" (change)="sendloadfile()" style=" display: none;" />`,
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
export class LoadFileComponent {

    constructor(private dataService: DataService) {}


    sendloadfile() {
        const selectedFile = (<HTMLInputElement>document.getElementById('file-input')).files[0];
        const stream = Observable.create(observer => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // if (typeof reader.result === 'string') {}
                const f = circularJSON.parse(<string>reader.result);
                const file: IMobius = {
                    name: selectedFile.name.split('.mob')[0],
                    author: f.author,
                    flowchart: f.flowchart,
                    last_updated: f.last_updated,
                    version: f.version,
                    settings: f.settings || {}
                };
                // file.flowchart.name = selectedFile.name.split('.mob')[0];
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
                };
            reader.readAsText(selectedFile);
        });
        stream.subscribe(loadeddata => {
            this.dataService.file = loadeddata;
            if (loadeddata.settings && JSON.stringify(loadeddata.settings) !== '{}') {
                window.localStorage.setItem('mpm_settings', loadeddata.settings);
            }
            this.dataService.newFlowchart = true;
            if (this.dataService.node.type !== 'end') {
                loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];
                // for (let i = 0; i < loadeddata.flowchart.nodes.length; i++) {
                //     if (loadeddata.flowchart.nodes[i].type === 'end') {
                //         loadeddata.flowchart.meta.selected_nodes = [i];
                //         break;
                //     }
                // }
            }
            document.getElementById('executeButton').click();
            const zooming = document.getElementById('zoomToFit');
            if (zooming) {
                zooming.click();
                this.dataService.newFlowchart = false;
            } else {
                this.dataService.newFlowchart = true;
            }
        });
        (<HTMLInputElement>document.getElementById('file-input')).value = '';
    }

}
