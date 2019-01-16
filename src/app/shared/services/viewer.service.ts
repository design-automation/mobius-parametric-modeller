import { Injectable, ComponentFactoryResolver, Injector  } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ViewerService {
    contextReceivedSource = new Subject<any>();
    contextReceived$ = this.contextReceivedSource.asObservable();

    receiveContext(componentFactoryResolver: ComponentFactoryResolver, injector: Injector) {
        this.contextReceivedSource.next({ resolver: componentFactoryResolver, injector: injector });
    }
}
