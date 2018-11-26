import { Component, Input } from '@angular/core';

@Component({
  selector: 'procedure-help',
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
export class procedureHelpComponent{
    @Input() output; 
    //output : string;

    constructor(){ 
      //console.log(`Text Viewer Created`); 
    }

  ngOnInit() {
	}



}