import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Injectable } from '@angular/core';

/**
 * DataService
 * The data service for the Goe-Info viewer.
 */
@Injectable()
export class DataService {
    // GI Model
    private _model: GIModel;
    // Others
    imVisible: boolean;
    selecting: any = [];
    // Subscription Handling
    private subject = new Subject<any>();
    /**
     * Create a data service.
     */
    constructor() {
        // Do nothing
    }
    /**
     * Msg
     * @param message
     */
    sendMessage(message?: string) {
        this.subject.next({ text: message });
    }
    /**
     * Msg
     */
    clearMessage() {
        this.subject.next();
    }
    /**
     * Msg
     */
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    /**
     * Get the GI Model
     */
    getModel(): GIModel {
        return this._model;
    }
    /**
     * Set the GI Model
     * @param model
     */
    setModel(model: GIModel) {
        this._model = model;
        this.sendMessage('model_update');
    }
}
