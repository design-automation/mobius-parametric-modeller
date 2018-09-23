import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';

@Component({
  selector: 'file-load',
  template:  `<div class='btn btn--loadfile' (click)='sendloadfile()'>Load File</div>`,
  styles: [ 
            `.btn--loadfile{ 
             }
             `
          ]
})
export class LoadFileComponent{

    @Output() loaded = new EventEmitter();

    sendloadfile(){
        // todo: load file
        const file: IMobius = <IMobius>{};

        this.loaded.emit(JSON.stringify(file));
    }
}