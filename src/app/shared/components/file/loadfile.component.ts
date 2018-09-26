import { Component, Output, EventEmitter } from '@angular/core';
import { IMobius } from '@models/mobius';
import { Observable } from 'rxjs';
import * as circularJSON from 'circular-json';

@Component({
  selector: 'file-load',
  template:  `<div class='btn btn--loadfile' onclick="document.getElementById('file-input').click();">Load File</div>
              <input id="file-input" type="file" name="name" (change)="sendloadfile()" style=" display: none;" />`,
  styles: [ 
            `.btn--loadfile{ 
             }
             `
          ]
})
export class LoadFileComponent{

    @Output() loaded = new EventEmitter();
    
    
    sendloadfile(){
        var selectedFile = (<HTMLInputElement>document.getElementById('file-input')).files[0];
        console.log(selectedFile);
        let stream = Observable.create(observer => {
            let reader = new FileReader();
            reader.onloadend = () => {
                //if (typeof reader.result === 'string') {}
                var f = circularJSON.parse(<string>reader.result);
                const file: IMobius = {
                    name: f.name,
                    author: f.author, 
                    flowchart: f.flowchart,
                    last_updated: f.last_updated,
                    version: f.version
                }
                observer.next(file);
                observer.complete();
                }
            reader.readAsText(selectedFile);
        });
        stream.subscribe(loadeddata => {
            this.loaded.emit(circularJSON.stringify(loadeddata));
        });
        (<HTMLInputElement>document.getElementById('file-input')).value = "";
    }
    

    //   @ViewChild('fileInput') fileInput: ElementRef;
    //   openPicker(): void{
    //     let el: HTMLElement = this.fileInput.nativeElement as HTMLElement;
    //     el.click();
    //   }

    //   loadFile(url ?:string): void{
    //     let file = this.fileInput.nativeElement.files[0];
    //     if (file) {
    //         var reader = new FileReader();
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