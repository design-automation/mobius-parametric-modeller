import { Component, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';

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

    @Output() loaded = new EventEmitter();


    sendloadfile() {
        const selectedFile = (<HTMLInputElement>document.getElementById('file-input')).files[0];
        const stream = Observable.create(observer => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // if (typeof reader.result === 'string') {}
                const f = circularJSON.parse(<string>reader.result);
                const file: IMobius = {
                    name: f.name,
                    author: f.author,
                    flowchart: f.flowchart,
                    last_updated: f.last_updated,
                    version: f.version
                };
                observer.next(file);
                observer.complete();
                };
            reader.readAsText(selectedFile);
        });
        stream.subscribe(loadeddata => {
            this.loaded.emit(circularJSON.stringify(loadeddata));
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
