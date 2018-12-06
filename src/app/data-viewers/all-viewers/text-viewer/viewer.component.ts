import { Component, Input, OnInit, DoCheck } from '@angular/core';
import {functions} from '@modules';

@Component({
    selector: 'text-viewer',
    template: `<textarea>{{ output || "no-value" }}</textarea>`,
    styleUrls: [`../general-viewer.scss`]
})
/**
 * TextViewerComponent
 */
export class TextViewerComponent implements OnInit, DoCheck {
    @Input() data;
    output: string;
    /**
     * constructor
     */
    constructor() {
        // console.log(`Text Viewer Created`);
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        if (typeof this.data === 'number' || this.data === undefined) {
            this.output = this.data;
        } else if (typeof this.data === 'string') {
            this.output = '"' + this.data + '"';
        } else if (this.data.constructor === [].constructor) {
            this.output = JSON.stringify(this.data);
        } else if (this.data.constructor === {}.constructor) {
            this.output = JSON.stringify(this.data);
        } else {
            // console.log('Unknown output type:', this.data);
            // this.output = functions.__stringify__(this.data);
            this.output = functions.__stringify__(this.data);
        }
    }
    /**
     * ngDoCheck
     */
    ngDoCheck() {
        if (typeof this.data === 'number' || this.data === undefined) {
            this.output = this.data;
        } else if (typeof this.data === 'string') {
            this.output = '"' + this.data + '"';
        } else if (this.data.constructor === [].constructor) {
            this.output = JSON.stringify(this.data);
        } else if (this.data.constructor === {}.constructor) {
            this.output = JSON.stringify(this.data);
        } else {
            // console.log('Unknown output type:', this.data);
            this.output = functions.__stringify__(this.data);
        }
    }
}
