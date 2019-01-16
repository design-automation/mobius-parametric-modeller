import { Component, Input, OnInit, DoCheck, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { DataService } from '@services';

/**
 * ConsoleViewerComponent
 */
@Component({
    selector: 'console-viewer',
    templateUrl: './console-viewer.component.html',
    styleUrls: ['./console-viewer.component.scss']
})
export class ConsoleViewerComponent implements OnInit, AfterViewInit, DoCheck, AfterViewChecked, OnDestroy {
    text: string;
    scrollcheck: boolean;
    logs: string[];

    /**
     * constructor
     */
    constructor(private dataService: DataService) {
        // console.log('Console Viewer Created');
    }

    ngOnDestroy() {
        const ct = document.getElementById('console-container');
        if (!ct) { return; }
        this.dataService.consoleScroll = ct.scrollTop;
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
        const ct = document.getElementById('console-container');
        if (! this.dataService.consoleScroll) {
            ct.scrollTop = ct.scrollHeight;
        } else {
            ct.scrollTop = this.dataService.consoleScroll;
        }
    }

    /**
     * ngDoCheck
     */
    ngDoCheck() {
        // @ts-ignore
        if (console.logs.length > 500) {
            // @ts-ignore
            console.logs.splice(0, console.logs.length - 500);
        }
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
        if (this.dataService.consoleScroll) {
            this.dataService.consoleScroll = undefined;
        } else if (this.scrollcheck) {
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
