import { Component, } from '@angular/core';

@Component({
    selector: 'spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['spinner.component.scss']
})
export class SpinnerComponent {

    constructor() {}

    on() {
        // document.getElementById('loading-spinner-overlay').style.visibility = 'visible';
        // document.getElementById('loading-spinner').style.visibility = 'visible';
        document.getElementById('spinner-div').style.visibility = 'visible';
    }

    off() {
        // document.getElementById('loading-spinner-overlay').style.visibility = 'hidden';
        // document.getElementById('loading-spinner').style.visibility = 'hidden';
        document.getElementById('spinner-div').style.visibility = 'hidden';
    }
}
