import { Component, Input } from '@angular/core';

@Component({
  selector: 'console-viewer',
  template: `<h3></h3>
             <div>{{ consoleText || "" }}</div>`,
  styles: []
})
export class ConsoleViewerComponent{
    @Input() node; 
    consoleText: string;
    constructor(){ 
      console.log(`Console Viewer Created`); 
      this.consoleText = console.log.bind(console);
  }
}