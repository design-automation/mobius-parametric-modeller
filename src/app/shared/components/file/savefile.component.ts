import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';

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

        // TODO-0: Check if the file gets stringified directly with the interlinked Procedure references; If not, use circular-json to do so
        // TODO-1: Split downloading part into another function or in a general utils file that can be used by others also
        // TODO-2: Before downloading, input/output values (not defaults) should be cleared from all ports for all nodes

        const fileString = JSON.stringify(this.file);
  
        let fname: string = `${this.file.name}.mob`;
        var blob = new Blob([fileString], {type: 'application/json'});

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fname);
        } else {
            const a = document.createElement('a');
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fname;
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 0);
        }
    }

}