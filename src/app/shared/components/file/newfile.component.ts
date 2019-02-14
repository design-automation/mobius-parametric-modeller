import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IMobius } from '@models/mobius';
import { FlowchartUtils } from '@models/flowchart';
import { DataService } from '@services';

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
export class NewFileComponent {

    @Output() create = new EventEmitter();

    constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}

    sendNewFile() {
        const confirmed = confirm('Loading a new file will delete the current flowchart. Would you like to continue?');
        if (!confirmed) { return; }
        const file: IMobius = {
            name: 'Untitled',
            author: 'new_user',
            flowchart: FlowchartUtils.newflowchart(),
            last_updated: new Date(),
            version: 1,
            settings: {}
        };
        this.dataService.file = file;
        const zooming = document.getElementById('zoomToFit');
        if (zooming) {
            zooming.click();
            this.dataService.newFlowchart = false;
        } else {
            this.dataService.newFlowchart = true;
        }
        this.cdr.detectChanges();
        document.getElementById('executeButton').click();
    }
}
