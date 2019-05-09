/*
 *  Adding this to an HTML5 input element
 *  allows for the file being read to be converted into a Mobius
 *  Flowchart
 *
 */
import { Directive, ElementRef, Input, Output, HostBinding, HostListener, EventEmitter } from '@angular/core';
import * as CircularJSON from 'circular-json';

@Directive({
  selector: '[mbFileReader]'
})
export class MbFileReaderDirective {

  @Input() data: any = {};
  @Output() load = new EventEmitter();

  constructor(private el: ElementRef) { }

  @HostListener('change')
  onFileChange() {
    const f = this.el.nativeElement.files[0];
    if (f) {
        const reader = new FileReader();
        reader.readAsText(f, 'UTF-8');
        const ins = this;
        reader.onload = function (evt) {
            const fileString: string = evt.target['result'];
            ins.load_flowchart_from_string(fileString);
        };
        reader.onerror = function (evt) {
            console.log('Error reading file');
        };
    }
  }


  //
  // Input: string
  // Output: MobiusFile DS
  //
  //
  private load_flowchart_from_string(fileString: string): void {
    const _this = this;
    // let jsonData: {language: string, flowchart: JSON, modules: JSON};
    // let flowchart: any; // IFlowchart;

    try {
      const data = CircularJSON.parse(fileString);
      this.load.emit(data);
      // this.data.flowchart = data.flowchart;
      // this.data.modules = data.modules;
      // this.data.language = data.language;

      // this.update_code_generator(CodeFactory.getCodeGenerator(data["language"]));
      // TODO: this.update_modules();

      // flowchart = FlowchartReader.read_flowchart_from_data(data["flowchart"]);
      // TODO: select a node
    } catch (err) {
      console.error('Mob-file-reader error', err);
    }

  }


}
