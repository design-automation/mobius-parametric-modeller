import { Component, Input} from '@angular/core';
import { IMobius } from '@models/mobius';
import { downloadUtils } from './download.utils'
import * as circularJSON from 'circular-json';
import { FlowchartUtils } from '@models/flowchart';

@Component({
  selector: 'file-save',
  template:  `<button class='btn' (click)='download()'>Save</button>`,
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
export class SaveFileComponent{

    @Input() file: IMobius;


    // todo: save file
    download(){
        if (!this.file.flowchart.ordered){
            FlowchartUtils.orderNodes(this.file.flowchart)
        }
        var savedfile = circularJSON.parse(circularJSON.stringify(this.file))
        for (let node of savedfile.flowchart.nodes){
            if (node.input.hasOwnProperty('value')){
                node.input.value = undefined;
            }
            if (node.output.hasOwnProperty('value')){
                node.output.value = undefined;
            }
        }

        const fileString = circularJSON.stringify(savedfile);
        let fname: string = `${savedfile.name}.mob`;
        var blob = new Blob([fileString], {type: 'application/json'});
        downloadUtils.downloadFile(fname, blob);

    }

}