import { Component, Input} from '@angular/core';
import { IMobius } from '@models/mobius';
import { downloadUtils } from './download.utils'
import * as circularJSON from 'circular-json';
import { FlowchartUtils } from '@models/flowchart';

@Component({
  selector: 'file-save',
  template:  `<div class='btn btn--save' (click)='download()'>Save File</div>`,
  styles: [ 
            `.btn--save{ 
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
            for (let input of node.input){
                if (input.hasOwnProperty('value')){
                    input.value = undefined;
                }
            }
            for (let output of node.output){
                if (output.hasOwnProperty('value')){
                    output.value = undefined;
                }
            }
        }

        const fileString = circularJSON.stringify(savedfile);
        let fname: string = `${savedfile.name}.mob`;
        var blob = new Blob([fileString], {type: 'application/json'});
        downloadUtils.downloadFile(fname, blob);

    }

}