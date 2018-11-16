import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IMobius } from '@models/mobius';
import { FlowchartUtils } from '@models/flowchart';
import * as circularJSON from 'circular-json';

@Component({
  selector: 'file-new',
  template:  `<button id='newfile' class='btn' (click)='sendNewFile()'>New</button>`,
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
export class NewFileComponent{

    @Output() create = new EventEmitter();

    constructor(private cdr: ChangeDetectorRef){}

    sendNewFile(){
        let confirmed = confirm("Resetting would delete the current flowchart. Would you like to continue?");
        if (!confirmed) return
        const file: IMobius = {
            name: "default_file.mob",
            author: "new_user", 
            flowchart: FlowchartUtils.newflowchart(),
            last_updated: new Date(),
            version: 1
        }
        this.create.emit(circularJSON.stringify(file));
        this.cdr.detectChanges()
    }
}