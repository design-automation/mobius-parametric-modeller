import { Component, Input, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'console-viewer',
    template: `<textarea>{{ text || "" }}</textarea>`,
    styleUrls: [`../general-viewer.scss`]
})
/**
 * ConsoleViewerComponent
 */
export class ConsoleViewerComponent implements OnInit, DoCheck {
    text: string;
    /**
     * constructor
     */
    constructor() {
        // console.log(`Console Viewer Created`);
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        // @ts-ignore
        this.text = console.logs.join('\n---------------------------------------------------------\n');
    }
    /**
     * ngDoCheck
     */
    ngDoCheck() {
        // @ts-ignore
        this.text = console.logs.join('\n---------------------------------------------------------\n');
    }
}
