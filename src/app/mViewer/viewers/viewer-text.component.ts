import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-viewer',
  template: `<h3>Text Viewer :: {{ node.name }}</h3>
             <div>{{ node?.outputs[0]?.value || "no-value" }}</div>`,
  styles: []
})
export class TextViewerComponent{
    @Input() node; 

    constructor(){ console.log(`Text Viewer Created`); }
}