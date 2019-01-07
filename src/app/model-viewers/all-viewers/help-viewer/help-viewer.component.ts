import { Component, Input } from '@angular/core';
import { ModuleDocList } from '@shared/decorators';

/**
 * HelpViewerComponent
 */
 @Component({
  selector: 'help-viewer',
  templateUrl: './help-viewer.component.html',
  styleUrls: ['./help-viewer.component.scss']
})
export class HelpViewerComponent {
    @Input() output;
    ModuleDoc = ModuleDocList;
    /**
     * constructor
     */
    constructor() {
        // console.log(`Help Viewer Created`);
    }
}
