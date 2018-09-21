import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-viewer',
  template: `<panel-header [node]='node' [title]='"Text Viewer"'></panel-header>
             <div>{{ node?.outputs[0]?.value || "no-value" }}</div>`,
  styles: []
})
export class TextViewerComponent{
    @Input() node; 
}