
import { Component, AfterViewInit, } from '@angular/core';

@Component({
    selector: 'chrome',
    templateUrl: 'chrome.component.html',
    styleUrls: ['chrome.component.scss']
})
export class ChromeComponent implements AfterViewInit {

    check: boolean;

    constructor() {

    }

    ngAfterViewInit() {
        // @ts-ignore
        const isChromium = window.chrome;
        const winNav = window.navigator;
        const vendorName = winNav.vendor;
        // @ts-ignore
        const isOpera = typeof window.opr !== 'undefined';
        const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
        const isIOSChrome = winNav.userAgent.match('CriOS');
        if (isIOSChrome) {
        } else if (
          isChromium !== null &&
          typeof isChromium !== 'undefined' &&
          vendorName === 'Google Inc.' &&
          isOpera === false &&
          isIEedge === false
        ) {
        } else {
            document.getElementById('chrome-only').style.display = 'block';
        }
    }

    stopProp(e: Event) {
        e.stopPropagation();
    }

}
