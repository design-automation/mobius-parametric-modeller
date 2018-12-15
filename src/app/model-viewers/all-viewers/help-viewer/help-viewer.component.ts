import { Component, Input } from '@angular/core';
import { ModuleDocAware } from '@shared/decorators';

/**
 * HelpViewerComponent
 */
@ModuleDocAware
@Component({
  selector: 'help-viewer',
  templateUrl: './help-viewer.component.html',
  styleUrls: ['./help-viewer.component.scss']
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
