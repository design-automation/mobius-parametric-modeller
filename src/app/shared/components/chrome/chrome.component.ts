
import { Component, AfterViewInit, } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@shared/services';

@Component({
    selector: 'chrome',
    templateUrl: 'chrome.component.html',
    styleUrls: ['chrome.component.scss']
})
export class ChromeComponent implements AfterViewInit {

    check: boolean;

    constructor(private router: Router, private dataservice: DataService) {

    }

    ngAfterViewInit() {
        if (this.router.url.split('?')[0] === '/publish') {
            return;
        }
        // @ts-ignore
        const isChromium = window.chrome;
        const winNav = window.navigator;
        const vendorName = winNav.vendor;
        // @ts-ignore
        const isOpera = typeof window.opr !== 'undefined';
        const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
        const isIOSChrome = winNav.userAgent.indexOf('CriOS') > -1;
        const isChrome = winNav.userAgent.indexOf('Chrome') > -1;

        if (isIOSChrome || isChrome) {
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


}
