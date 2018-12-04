import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { INode } from '@models/node';

@Component({
  selector: 'console-viewer',
  template: `<textarea>{{ text || "" }}</textarea>`,
  styleUrls: [`general-viewer.scss`]
})
export class ConsoleViewerComponent implements OnInit, DoCheck {

  text: string;

  constructor() {
  }

  ngOnInit() {
    // @ts-ignore
    this.text = console.logs.join('\n---------------------------------------------------------\n');
  }

  ngDoCheck() {
    // @ts-ignore
    this.text = console.logs.join('\n---------------------------------------------------------\n');
  }
}
