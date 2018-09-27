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

<<<<<<< HEAD
        // TODO-0: Check if the file gets stringified directly with the interlinked Procedure references; If not, use circular-json to do so
        // TODO-1: Split downloading part into another function or in a general utils file that can be used by others also
        // TODO-2: Before downloading, input/output values (not defaults) should be cleared from all ports for all nodes
=======
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
>>>>>>> cc90fc6f87292ee807712521423e303c8a2d1e43

        const fileString = circularJSON.stringify(savedfile);
        let fname: string = `${savedfile.name}.mob`;
        var blob = new Blob([fileString], {type: 'application/json'});
        downloadUtils.downloadFile(fname, blob);

    }

}