import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { INode } from '@models/node';

@Component({
  selector: 'console-viewer',
  template: `<textarea>{{ text || "" }}</textarea>`,
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
  }`]
})
export class ConsoleViewerComponent implements OnInit, DoCheck{

  text: string;

  constructor(){ 
  }

  ngOnInit(){
    // @ts-ignore
    this.text = console.logs.join('\n');
  }

  ngDoCheck(){
    // @ts-ignore
    this.text = console.logs.join('\n');
  }
}