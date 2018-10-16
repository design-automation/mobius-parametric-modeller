import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-viewer',
  template: `<h3>Text Viewer :: {{ node?.name }}</h3>
             <div>{{ output || "no-value" }}</div>`,
  styles: []
})
export class TextViewerComponent{
    @Input() node; 
    output : string[];

    constructor(){ 
      console.log(`Text Viewer Created`); 
    }
    /*
      for (let oup of this.node.output){
        if (typeof oup === 'number' || oup === undefined){
          this.output.push(oup);
        } else if (typeof oup === 'string'){
          this.output.push('"' + oup + '"');
        } else if (oup.constructor === [].constructor){
          this.output.push('[' + oup + ']');
        } else if (oup.constructor === {}.constructor) {
          this.output.push(JSON.stringify(oup));
        } else {
          console.log('Unknown output type:', oup);
          this.output.push(oup);
        }
  
      }

    */
   ngOnInit() {
    this.output = [];
    for (let oup of this.node.output){
      if (typeof oup.value === 'number' || oup.value === undefined){
        this.output.push(oup.value);
      } else if (typeof oup.value === 'string'){
        this.output.push('"' + oup.value + '"');
      } else if (oup.value.constructor === [].constructor){
        this.output.push('[' + oup.value + ']');
      } else if (oup.value.constructor === {}.constructor) {
        this.output.push(JSON.stringify(oup.value));
      } else {
        console.log('Unknown output type:', oup.value);
        this.output.push(oup.value);
      }
    }
  
	}


	ngDoCheck(){
    this.output = [];
    for (let oup of this.node.output){
      if (typeof oup.value === 'number' || oup.value === undefined){
        this.output.push(oup.value);
      } else if (typeof oup.value === 'string'){
        this.output.push('"' + oup.value + '"');
      } else if (oup.value.constructor === [].constructor){
        this.output.push('[' + oup.value + ']');
      } else if (oup.value.constructor === {}.constructor) {
        this.output.push(JSON.stringify(oup.value));
      } else {
        console.log('Unknown output type:', oup.value);
        this.output.push(oup.value);
      }
    }
	}



}