import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-viewer',
  template: `<h3>Table Viewer</h3>
             <div>{{ node?.output?.value || "no-value" }}</div>`,
  styles: []
})
export class TableViewerComponent{
    @Input() node; 

    constructor(){ console.log(`Table Viewer Created`); }
}