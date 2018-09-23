import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IMobius } from '@models/mobius';
import { FlowchartUtils } from '@models/flowchart';

@Component({
  selector: 'file-new',
  template:  `<div class='btn btn--newfile' (click)='sendNewFile()'>New File</div>`,
  styles: [ 
            `.btn--newfile{ 
             }
             `
          ]
})
export class NewFileComponent{

    @Output() create = new EventEmitter();

    constructor(private cdr: ChangeDetectorRef){}

    sendNewFile(){
        const file: IMobius = {
            name: "default_file.mob",
            author: "new_user", 
            flowchart: FlowchartUtils.newflowchart(),
            last_updated: new Date(),
            version: 1
        }
        this.create.emit(JSON.stringify(file));
        this.cdr.detectChanges()
    }
}