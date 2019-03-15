import { Component, Input} from '@angular/core';
import { DownloadUtils } from './download.utils';
import * as circularJSON from 'circular-json';
import { FlowchartUtils } from '@models/flowchart';
import { DataService } from '@services';
import { InputType } from '@models/port';
import { ProcedureTypes } from '@models/procedure';
import { IdGenerator } from '@utils';
import { IMobius } from '@models/mobius';

@Component({
  selector: 'file-save',
  template:  `<button id='savefile' class='btn' (click)='download()'>Save</button>`,
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
export class SaveFileComponent {

    constructor(private dataService: DataService) {}

    static saveFileToLocal(f: IMobius) {
        const models = [];
        for (const node of f.flowchart.nodes) {
            const nodeModel = {
                'model': node.model,
                'input': node.input.value,
                'output': node.output.value
            };
            node.model = undefined;
            if (node.input.hasOwnProperty('value')) {
                node.input.value = undefined;
            }
            if (node.output.hasOwnProperty('value')) {
                node.output.value = undefined;
            }
            for (const prod of node.procedure) {
                if (prod.hasOwnProperty('resolvedValue')) {
                    prod.resolvedValue = undefined;
                }
            }
            models.push(nodeModel);
        }

        SaveFileComponent.saveToLocalStorage(circularJSON.stringify(f));

        for (const node of f.flowchart.nodes) {
            const mod = models.shift();
            node.model = mod.model;
            node.input.value = mod.input;
            node.output.value = mod.output;
        }
    }

    static saveToLocalStorage(f: string) {
        try {
            localStorage.setItem('__mobius__', f);
        } catch (ex) {
            console.log('Failed to save flowchart to local storage');
            console.log(ex.message);
        }
    }


    async download() {
        const f = this.dataService.file;
        f.settings = localStorage.getItem('mpm_settings');
        if (!f.flowchart.ordered) {
            FlowchartUtils.orderNodes(f.flowchart);
        }

        for (const prod of f.flowchart.nodes[0].procedure) {
            if (prod.type !== ProcedureTypes.Constant) { continue; }
            if (prod.meta.inputMode.toString() === InputType.File.toString()) {
                const arg = prod.args[1];
                if (arg.value && arg.value.lastModified) {
                    const p = new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function() {
                            resolve(reader.result);
                        };
                        reader.readAsText(arg.value);
                    });
                    window.localStorage.setItem(arg.value.name, '`' + await p + '`');
                    arg.value = {'name': arg.value.name};
                }
                if (arg.value && arg.value.lastModified) {
                    const p = new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function() {
                            resolve(reader.result);
                        };
                        reader.readAsText(arg.value);
                    });
                    window.localStorage.setItem(arg.value.name, '`' + await p + '`');
                    arg.value = {'name': arg.value.name};
                }
            }
        }

        for (const node of f.flowchart.nodes) {
            node.model = undefined;
            if (node.input.hasOwnProperty('value')) {
                node.input.value = undefined;
            }
            if (node.output.hasOwnProperty('value')) {
                node.output.value = undefined;
            }
            for (const prod of node.procedure) {
                if (prod.hasOwnProperty('resolvedValue')) {
                    prod.resolvedValue = undefined;
                }
            }
        }

        const savedfile = circularJSON.parse(circularJSON.stringify(f));
        for (const node of savedfile.flowchart.nodes) {
            node.id = IdGenerator.getNodeID();
            for (const prod of node.state.procedure) {
                prod.selected = false;
            }
            node.state.procedure = [];
        }

        // **** need to modify this when changing the input's constant function:
        // **** this part resets the value of the last argument of the function when saving the file
        /*
        for (const prod of savedfile.flowchart.nodes[0].procedure) {
            prod.args[prod.argCount - 1].value = undefined;
        }
        */

        savedfile.flowchart.meta.selected_nodes = [0];
        savedfile.flowchart.last_updated = new Date();
        for (const edge of savedfile.flowchart.edges) {
            edge.selected = false;
        }

        if (!savedfile.name || savedfile.name === '' || savedfile.name.toLowerCase() === 'untitled') {
            savedfile.name = savedfile.flowchart.name;
        }

        const fileString = circularJSON.stringify(savedfile, null, 4);
        let fname = savedfile.name.replace(/\ /g, '_');
        if (savedfile.name.length < 4 || savedfile.name.substring(savedfile.name.length - 4) !== '.mob') {
            fname = `${fname}.mob`;
        }
        const blob = new Blob([fileString], {type: 'application/json'});

        SaveFileComponent.saveToLocalStorage(fileString);

        DownloadUtils.downloadFile(fname, blob);

        this.dataService.file.name = 'Untitled';
    }

}
