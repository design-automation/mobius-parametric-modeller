import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataThreejs } from './data.threejs';
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
    private _data_threejs: DataThreejs;
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
        console.log('CALLING constructor in DATA SERVICE');
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
    getGIModel(): GIModel {
        // console.log('CALLING getModel in DATA SERVICE');
        return this._model;
    }
    /**
     * Get the THreejs Scene
     */
    getThreejsScene(): DataThreejs {
        // console.log('CALLING getThreejs Scene in DATA SERVICE');
        return this._data_threejs;
    }

    newThreejsScene(model: any) {
        // this._threejs_scene = new ThreejsScene(model);
    }

    /**
     * Set the GI Model
     * @param model
     */
    setModel(model: GIModel) {
        console.log('CALLING setModel in DATA SERVICE');
        this._model = model;
        this._data_threejs = new DataThreejs(model);
        this.sendMessage('model_update');
    }
}
