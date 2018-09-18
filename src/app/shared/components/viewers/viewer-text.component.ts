import { Component, Input } from '@angular/core';


@Component({
  selector: 'text-viewer',
  template: '<div>{{ node.outputs[0].value || "no-value" }}</div>',
  styles: []
})
export class TextViewerComponent{
    @Input() node; 
}