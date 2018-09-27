import { Component, Input } from '@angular/core';

@Component({
  selector: 'three-viewer',
  template: `<h3>Three Viewer</h3>
             <div>{{ node?.outputs[0]?.value || "no-value" }}</div>`,
  styles: []
})
export class ThreeViewerComponent{
    @Input() node; 

    constructor(){ console.log(`Three Viewer Created`); }
}