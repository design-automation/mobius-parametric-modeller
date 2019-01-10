import { Component, Input} from '@angular/core';
import { DownloadUtils } from './download.utils';
import * as circularJSON from 'circular-json';
import { FlowchartUtils } from '@models/flowchart';
import { DataService } from '@services';
import { InputType } from '@models/port';
import { ProcedureTypes } from '@models/procedure';

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


    async download() {
        const f = this.dataService.file;

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
                if (arg.default && arg.default.lastModified) {
                    const p = new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function() {
                            resolve(reader.result);
                        };
                        reader.readAsText(arg.default);
                    });
                    window.localStorage.setItem(arg.default.name, '`' + await p + '`');
                    arg.default = {'name': arg.default.name};
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
        for (const edge of savedfile.flowchart.edges) {
            edge.selected = false;
        }

        savedfile.name = savedfile.flowchart.name;

        const fileString = circularJSON.stringify(savedfile);
        const fname = `${savedfile.flowchart.name.replace(/\ /g, '_')}.mob`;
        const blob = new Blob([fileString], {type: 'application/json'});
        DownloadUtils.downloadFile(fname, blob);

        this.dataService.flowchart.name = 'Untitled';
    }

}
