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