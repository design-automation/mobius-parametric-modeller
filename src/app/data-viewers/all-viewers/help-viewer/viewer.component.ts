import { Component, Input } from '@angular/core';
import { ModuleDocAware } from '@shared/decorators';

/**
 * HelpViewerComponent
 */
@ModuleDocAware
@Component({
  selector: 'procedure-help',
  template: `
  <div *ngIf='output'>
    <h2>{{output.name}}</h2>
    <h4>Module: <span>{{output.module}}</span></h4>
    <h5><span>Description:</span></h5>
    <p>{{output.description}}</p>
    <h5 *ngIf='output.parameters?.length > 0'><span>Parameters: </span></h5>
    <p class='paramP' *ngFor='let param of output.parameters'><span>{{param.name}} - </span>{{param.description}}</p>
    <h5 *ngIf='output.returns'>Returns:</h5>
    <p *ngIf='output.returns'>{{output.returns}}</p>
  </div>


  `,
  styleUrls: [`../general-viewer.scss`]
})
export class HelpViewerComponent {
    @Input() output;
    /**
     * constructor
     */
    constructor() {
        // console.log(`Help Viewer Created`);
    }
}
