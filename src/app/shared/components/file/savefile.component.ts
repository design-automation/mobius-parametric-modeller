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
        console.log("Downloading file", this.file);
    }
}