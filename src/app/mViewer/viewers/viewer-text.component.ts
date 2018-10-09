import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-viewer',
  template: `<h3>Text Viewer :: {{ node?.name }}</h3>
             <div>{{ outputs || "no-value" }}</div>`,
  styles: []
})
export class TextViewerComponent{
    @Input() node; 
    outputs : string[];

    constructor(){ 
      console.log(`Text Viewer Created`); 
    }
    /*
      for (let oup of this.node.outputs){
        if (typeof oup === 'number' || oup === undefined){
          this.outputs.push(oup);
        } else if (typeof oup === 'string'){
          this.outputs.push('"' + oup + '"');
        } else if (oup.constructor === [].constructor){
          this.outputs.push('[' + oup + ']');
        } else if (oup.constructor === {}.constructor) {
          this.outputs.push(JSON.stringify(oup));
        } else {
          console.log('Unknown output type:', oup);
          this.outputs.push(oup);
        }
  
      }

    */
   ngOnInit() {
    this.outputs = [];
    for (let oup of this.node.outputs){
      if (typeof oup.value === 'number' || oup.value === undefined){
        this.outputs.push(oup.value);
      } else if (typeof oup.value === 'string'){
        this.outputs.push('"' + oup.value + '"');
      } else if (oup.value.constructor === [].constructor){
        this.outputs.push('[' + oup.value + ']');
      } else if (oup.value.constructor === {}.constructor) {
        this.outputs.push(JSON.stringify(oup.value));
      } else {
        console.log('Unknown output type:', oup.value);
        this.outputs.push(oup.value);
      }
    }
  
	}


	ngDoCheck(){
    this.outputs = [];
    for (let oup of this.node.outputs){
      if (typeof oup.value === 'number' || oup.value === undefined){
        this.outputs.push(oup.value);
      } else if (typeof oup.value === 'string'){
        this.outputs.push('"' + oup.value + '"');
      } else if (oup.value.constructor === [].constructor){
        this.outputs.push('[' + oup.value + ']');
      } else if (oup.value.constructor === {}.constructor) {
        this.outputs.push(JSON.stringify(oup.value));
      } else {
        console.log('Unknown output type:', oup.value);
        this.outputs.push(oup.value);
      }
    }
	}



}