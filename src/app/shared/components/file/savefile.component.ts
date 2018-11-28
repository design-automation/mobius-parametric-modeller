import { Component, Input} from '@angular/core';
import { IMobius } from '@models/mobius';
import { downloadUtils } from './download.utils';
import * as circularJSON from 'circular-json';
import { FlowchartUtils } from '@models/flowchart';

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

    @Input() file: IMobius;


    // todo: save file
    download() {
        if (!this.file.flowchart.ordered) {
            FlowchartUtils.orderNodes(this.file.flowchart);
        }
        const savedfile = circularJSON.parse(circularJSON.stringify(this.file));
        for (const node of savedfile.flowchart.nodes) {
            if (node.input.hasOwnProperty('value')) {
                node.input.value = undefined;
            }
            if (node.output.hasOwnProperty('value')) {
                node.output.value = undefined;
            }
            for (const prod of node.state.procedure) {
                prod.selected = false;
            }
            node.state.procedure = [];
        }

        // **** need to modify this when changing the input's constant function:
        // **** this part resets the value of the last argument of the function when saving the file
        for (const prod of savedfile.flowchart.nodes[0].procedure) {
            prod.args[prod.argCount - 1].value = undefined;
        }


        savedfile.flowchart.meta.selected_nodes = [0];
        for (const edge of savedfile.flowchart.edges) {
            edge.selected = false;
        }

        savedfile.name = savedfile.flowchart.name;

        const fileString = circularJSON.stringify(savedfile);
        const fname = `${savedfile.flowchart.name.replace(/\ /g, '_')}.mob`;
        const blob = new Blob([fileString], {type: 'application/json'});
        downloadUtils.downloadFile(fname, blob);

    }

}
