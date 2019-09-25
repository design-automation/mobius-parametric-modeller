import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class KeyboardService {


    private shiftKeyPushed = new Subject<void>();
    shiftKeyPushed$ = this.shiftKeyPushed.asObservable();

    private viewerControl = new Subject<KeyboardEvent>();
    viewerControl$ = this.viewerControl.asObservable();

    // private viewerCommand: EventEmitter<any> = new EventEmitter();

    update(event: KeyboardEvent) {
        if (event.key === 'Control' || event.key === 'Shift' || event.key === 'Meta') {
            if (!event.repeat) {
                this.shiftKeyPushed.next();
            }
        } else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
            if (document.activeElement.nodeName !== 'INPUT') {
                event.preventDefault();
            }
        } else if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
        } else if (event.which > 64 && event.which < 91) {
            this.viewerControl.next(event);
        }

    }
}
