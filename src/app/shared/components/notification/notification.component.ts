import { Component, OnChanges, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements AfterViewInit, OnChanges, OnDestroy {

    notificationBox: HTMLElement;
    @Input() message: string;
    @Input() dummyTrigger: boolean;

    timeOut;

    constructor() {
    }

    ngAfterViewInit() {
        this.notificationBox = document.getElementById('notificationBox');
    }

    ngOnChanges() {
        if (!this.notificationBox) { return ; }
        window.clearTimeout(this.timeOut);
        this.notificationBox.className = 'show';

        // After 3 seconds, remove the show class from DIV
        this.timeOut = setTimeout(function() {
            this.notificationBox.className = this.notificationBox.className.replace('show', '');
            this.notificationBox.className = 'hide';
            this.message = '';
        }, 5000);
    }

    ngOnDestroy() {
        this.notificationBox = null;
    }

}
