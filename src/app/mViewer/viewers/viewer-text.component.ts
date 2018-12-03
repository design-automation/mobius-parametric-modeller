import { Component, Input, OnInit, DoCheck } from '@angular/core';
import {functions} from '@modules';
import * as circularJSON from 'circular-json';
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
export class TextViewerComponent implements OnInit, DoCheck {
    @Input() data;
    output: string;

    constructor() {
      // console.log(`Text Viewer Created`);
    }

   ngOnInit() {
    if (typeof this.data === 'number' || this.data === undefined) {
      this.output = this.data;
    } else if (typeof this.data === 'string') {
      this.output = '"' + this.data + '"';
    } else if (this.data.constructor === [].constructor) {
      this.output = JSON.stringify(this.data);
    } else if (this.data.constructor === {}.constructor) {
      this.output = JSON.stringify(this.data);
    } else {
        // console.log('Unknown output type:', this.data);
        // this.output = functions.__stringify__(this.data);
        console.log(this.data)
        this.output = functions.__stringify__(this.data);

    }

  }


  ngDoCheck() {
    if (typeof this.data === 'number' || this.data === undefined) {
      this.output = this.data;
    } else if (typeof this.data === 'string') {
      this.output = '"' + this.data + '"';
    } else if (this.data.constructor === [].constructor) {
      this.output = JSON.stringify(this.data);
    } else if (this.data.constructor === {}.constructor) {
      this.output = JSON.stringify(this.data);
    } else {
      //console.log('Unknown output type:', this.data);
      console.log(this.data)
      this.output = functions.__stringify__(this.data);
    }
  }



}
