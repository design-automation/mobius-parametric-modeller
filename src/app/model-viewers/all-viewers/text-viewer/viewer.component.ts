import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { _model } from '@modules';

/**
 * TextViewerComponent
 */
@Component({
    selector: 'text-viewer',
    template: `<textarea>{{ output || "no-value" }}</textarea>`,
    styleUrls: [`../general-viewer.scss`]
})
class TextViewerComponent implements OnInit, DoCheck {
    @Input() data;
    output: string;
    /**
     * constructor
     */
    constructor() {
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
            this.output = _model.__stringify__(this.data); // TODO - make this generic
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
            this.output = _model.__stringify__(this.data); // TODO - make this generic
        }
    }
}
