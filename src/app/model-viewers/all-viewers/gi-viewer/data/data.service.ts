import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { GIModel } from '@libs/geo-info/GIModel';
import { ThreejsScene } from './threejs-scene';
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
    private _threejs_scene: ThreejsScene;
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
    getThreejsScene(): ThreejsScene {
        // console.log('CALLING getThreejs Scene in DATA SERVICE');
        return this._threejs_scene;
    }

    newThreejsScene(model: any) {
        this._threejs_scene = new ThreejsScene(model);
    }

    /**
     * Set the GI Model
     * @param model
     */
    setModel(model: GIModel) {
        console.log('CALLING setModel in DATA SERVICE');
        this._model = model;
        this.sendMessage('model_update');
    }
}
