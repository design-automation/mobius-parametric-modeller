import { Component, Input} from '@angular/core';
import { IMobius } from '@models/mobius';
import { downloadUtils } from './download.utils'
import * as circularJSON from 'circular-json';

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

        var savedfile = circularJSON.parse(circularJSON.stringify(this.file))
        for (let node of savedfile.flowchart.nodes){
            for (let input of node.inputs){
                if (input.hasOwnProperty('value')){
                    input.value = ""
                }
            }
            for (let output of node.outputs){
                if (output.hasOwnProperty('value')){
                    output.value = ""
                }
            }
        }

        const fileString = circularJSON.stringify(savedfile);
        let fname: string = `${savedfile.name}.mob`;
        var blob = new Blob([fileString], {type: 'application/json'});
        downloadUtils.downloadFile(fname, blob);

    }

}