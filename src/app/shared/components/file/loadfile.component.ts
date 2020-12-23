import { Component } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';
import { DataService } from '@services';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { ModuleList } from '@shared/decorators';
import { checkNodeValidity } from '@shared/parser';
import { IdGenerator, updateLocalViewerSettings, updateCesiumViewerSettings } from '@utils';
import { checkMobFile } from '@shared/updateOldMobFile';
import { SaveFileComponent } from './savefile.component';

@Component({
  selector: 'file-load',
  template:  `<button id='loadfile' class='btn' onclick="document.getElementById('file-input').click();">Load</button>
              <input id="file-input" type="file" (change)="sendloadfile()" style=" display: none;" accept=".mob,.mobdata"/>`,
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

// Component for loading a local .mob file into mobius
export class LoadFileComponent {

    constructor(private dataService: DataService) {}


    sendloadfile() {
        if (!confirm('Loading a new file will delete the current flowchart! Would you like to continue?')) {
            (<HTMLInputElement>document.getElementById('file-input')).value = '';
            return;
        }

        const selectedFile = (<HTMLInputElement>document.getElementById('file-input')).files[0];
        const stream = new Observable<IMobius>(observer => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // if (typeof reader.result === 'string') {}
                let f: any;
                try {
                    f = circularJSON.parse(<string>reader.result);
                } catch (ex) {
                    this.dataService.notifyMessage(`ERROR: Unable to read file...`);
                    throw(ex);
                }
                if (!f.flowchart.id) {
                    f.flowchart.id = IdGenerator.getId();
                }
                const file: IMobius = {
                    name: selectedFile.name.split('.mob')[0],
                    author: f.author,
                    flowchart: f.flowchart,
                    version: f.version,
                    settings: f.settings || {}
                };

                checkMobFile(file);

                observer.next(file);
                observer.complete();
                };
            reader.readAsText(selectedFile);
        });
        stream.subscribe(loadeddata => {
            SaveFileComponent.clearModelData(this.dataService.flowchart);
            delete this.dataService.file.flowchart;
            this.dataService.file = loadeddata;
            if (updateLocalViewerSettings(loadeddata.settings)) {
                this.dataService.viewerSettingsUpdated = true;
            }
            updateCesiumViewerSettings(loadeddata.settings);
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
            setTimeout(() => {
                if (this.dataService.mobiusSettings.execute) {
                    document.getElementById('executeButton').click();
                }
                const zooming = document.getElementById('zoomToFit');
                if (zooming) {
                    zooming.click();
                    this.dataService.newFlowchart = false;
                } else {
                    this.dataService.newFlowchart = true;
                }
                this.dataService.clearModifiedNode();
            }, 200);
        });
        (<HTMLInputElement>document.getElementById('file-input')).value = '';
    }

}
