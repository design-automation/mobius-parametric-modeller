import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IMobius } from '@models/mobius';
import { FlowchartUtils } from '@models/flowchart';
import { DataService } from '@services';
import { SaveFileComponent } from './savefile.component';
import { VERSION } from '@env/version';

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
// Component for creating a new mobius flowchart
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
            version: VERSION.version,
            settings: {}
        };

        SaveFileComponent.clearModelData(this.dataService.flowchart);
        delete this.dataService.file.flowchart;
        this.dataService.file = file;
        let zooming = document.getElementById('zoomToFit');
        if (zooming) {
            zooming.click();
            this.dataService.newFlowchart = false;
        } else {
            this.dataService.newFlowchart = true;
        }
        this.cdr.detectChanges();
        if (this.dataService.mobiusSettings.execute) {
            document.getElementById('executeButton').click();
        }
        zooming = null;
        this.dataService.clearModifiedNode();
        this.dataService.flagModifiedNode(file.flowchart.nodes[0].id);
    }
}
