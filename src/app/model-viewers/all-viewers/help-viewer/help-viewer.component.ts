import { Component, Input } from '@angular/core';
import { ModuleDocList } from '@shared/decorators';
import { Router, ActivatedRoute } from '@angular/router';

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

    // TODO: update mobius url
    urlString: string;
    /**
     * constructor
     */
    constructor(private router: ActivatedRoute) {
        this.urlString = `${window.location.origin}` +
                        '/flowchart?file=' +
                        'https://raw.githubusercontent.com/design-automation/' +
                        'mobius-parametric-modeller/master/src/assets/gallery/function_examples/';
    }
}
