import { Component, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import { ProcedureTypes } from '@shared/models/procedure';
import * as circularJSON from 'circular-json';
import * as funcs from '@modules';
import { DataService } from '@services';

@Component({
  selector: 'file-load',
  template:  `<button id='loadfile' class='btn' onclick="document.getElementById('file-input').click();">Load</button>
              <input id="file-input" type="file" name="name" (change)="sendloadfile()" style=" display: none;" />`,
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
export class LoadFileComponent {

    constructor(private dataService: DataService) {}


    sendloadfile() {
        const selectedFile = (<HTMLInputElement>document.getElementById('file-input')).files[0];
        const stream = Observable.create(observer => {
            const reader = new FileReader();
            reader.onloadend = () => {
                function checkMissingProd(prodList: any[]) {
                    let check = true;
                    for (const prod of prodList) {
                        if (prod.children) {
                            if (!checkMissingProd(prod.children)) {
                                check = false;
                            }
                        }
                        prod.hasError = false;
                        if (prod.type !== ProcedureTypes.Function) { continue; }
                        if (!funcs[prod.meta.module] || !funcs[prod.meta.module][prod.meta.name]) {
                            prod.hasError = true;
                            check = false;
                        }
                    }
                    return check;
                }
                // if (typeof reader.result === 'string') {}
                const f = circularJSON.parse(<string>reader.result);
                const file: IMobius = {
                    name: f.name,
                    author: f.author,
                    flowchart: f.flowchart,
                    last_updated: f.last_updated,
                    version: f.version
                };
                let hasError = false;
                for (const node of file.flowchart.nodes) {
                    if (!checkMissingProd(node.procedure)) {
                        node.hasError = true;
                        hasError = true;
                    }
                }
                if (hasError) {
                    alert('The flowchart contains functions that does not exist in the current version of Mobius');
                }
                observer.next(file);
                observer.complete();
                };
            reader.readAsText(selectedFile);
        });
        stream.subscribe(loadeddata => {
            this.dataService.file = loadeddata;
            this.dataService.newFlowchart = true;
            if (this.dataService.node.type !== 'end') {
                for (let i = 0; i < loadeddata.flowchart.nodes.length; i++) {
                    if (loadeddata.flowchart.nodes[i].type === 'end') {
                        loadeddata.flowchart.meta.selected_nodes = [i];
                        break;
                    }
                }
            }
            document.getElementById('executeButton').click();
            const zooming = document.getElementById('zoomToFit');
            if (zooming) {
                zooming.click();
                this.dataService.newFlowchart = false;
            } else {
                this.dataService.newFlowchart = true;
            }
        });
        (<HTMLInputElement>document.getElementById('file-input')).value = '';
    }


    //   @ViewChild('fileInput') fileInput: ElementRef;
    //   openPicker(): void{
    //     let el: HTMLElement = this.fileInput.nativeElement as HTMLElement;
    //     el.click();
    //   }

    //   loadFile(url ?:string): void{
    //     let file = this.fileInput.nativeElement.files[0];
    //     if (file) {
    //         let reader = new FileReader();
    //         reader.readAsText(file, "UTF-8");
    //         let fs = this.flowchartService;
    //         reader.onload = function (evt) {
    //           let fileString: string = evt.target["result"];
    //           fs.loadFile(fileString);
    //         }
    //         reader.onerror = function (evt) {
    //             console.log("Error reading file");
    //         }
    //     }
    // this.flowchartService.loadFile(url);
}
