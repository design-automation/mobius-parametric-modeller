import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-viewer',
  template: `<textarea>{{ output || "no-value" }}</textarea>`,
  styles: [`
  :host{
    height: 100%;
    width: 100%;
  }
  textarea{
    height: 99%;
    width: 99%;
    overflow: auto;
    resize: none;
    background-color: rgb(220,220,220);
    text-color: rgb(80,80,80);
    border: none;
    font-family: arial;
  }`]
})
export class TextViewerComponent{
    @Input() node; 
    output : string;

    constructor(){ 
      console.log(`Text Viewer Created`); 
    }

   ngOnInit() {
    if (! this.node) {
      this.output = "no-value";
    } else if (typeof this.node.output.value === 'number' || this.node.output.value === undefined){
      this.output = this.node.output.value;
    } else if (typeof this.node.output.value === 'string'){
      this.output = '"' + this.node.output.value + '"';
    } else if (this.node.output.value.constructor === [].constructor){
      this.output = JSON.stringify(this.node.output.value);
    } else if (this.node.output.value.constructor === {}.constructor) {
      this.output = JSON.stringify(this.node.output.value);
    } else {
      console.log('Unknown output type:', this.node.output.value);
      this.output = this.node.output.value;
    }
  
	}


	ngDoCheck(){
    if (! this.node) {
      this.output = "no-value";
    } else if (typeof this.node.output.value === 'number' || this.node.output.value === undefined){
      this.output = this.node.output.value;
    } else if (typeof this.node.output.value === 'string'){
      this.output = '"' + this.node.output.value + '"';
    } else if (this.node.output.value.constructor === [].constructor){
      this.output = JSON.stringify(this.node.output.value);
    } else if (this.node.output.value.constructor === {}.constructor) {
      this.output = JSON.stringify(this.node.output.value);
    } else {
      console.log('Unknown output type:', this.node.output.value);
      this.output = this.node.output.value;
    }
	}



}