import { Component, Input, OnInit, DoCheck, AfterViewInit, AfterViewChecked } from '@angular/core';

/**
 * ConsoleViewerComponent
 */
@Component({
    selector: 'console-viewer',
    templateUrl: './console-viewer.component.html',
    styleUrls: ['./console-viewer.component.scss']
})
export class ConsoleViewerComponent implements OnInit, AfterViewInit, DoCheck, AfterViewChecked {
    text: string;
    scrollcheck: boolean;
    logs: string[];

    /**
     * constructor
     */
    constructor() {
        // console.log('Console Viewer Created');
    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        // @ts-ignore
        this.text = console.logs.join('\n');
    }

    /**
     * ngOnInit
     */
    ngAfterViewInit() {
        // const ct = document.getElementById('console_textarea');
        // ct.scrollTo(0, ct.scrollHeight);
        const ct = document.getElementById('console-container');
        ct.scrollTop = ct.scrollHeight;
    }

    /**
     * ngDoCheck
     */
    ngDoCheck() {
        // @ts-ignore
        const t = console.logs.join('\n');
        // @ts-ignore
        this.logs = console.logs;
        if (this.text !== t) {
            this.text = t;
            this.scrollcheck = true;
        }
    }

    ngAfterViewChecked() {
        if (this.scrollcheck) {
            const ct = document.getElementById('console-container');
            ct.scrollTop = ct.scrollHeight;
            this.scrollcheck = false;
        }
    }

    clearConsole() {
        // @ts-ignore
        console.logs = [];
    }
}
