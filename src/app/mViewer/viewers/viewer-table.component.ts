import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-viewer',
  template: `<h3>Table Viewer</h3>
             <div>{{ node?.outputs[0]?.value || "no-value" }}</div>`,
  styles: []
})
export class TableViewerComponent{
    @Input() node; 

    constructor(){ console.log(`Table Viewer Created`); }
}