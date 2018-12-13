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
    // imVisible: boolean;
    selecting: any = [];
    /**
     * Create a data service.
     */
    constructor() {
        // Do nothing
        // console.log('CALLING constructor in DATA SERVICE');
    }

    /**
     * Get the THreejs Scene
     */
    getThreejsScene(): DataThreejs {
        // console.log('CALLING getThreejs Scene in DATA SERVICE');
        return this._data_threejs;
    }

    /**
     * Set the THreejs Scene
     */
    setThreejsScene( model: GIModel ) {
        // console.log('CALLING setThreejsScene Scene in DATA SERVICE');
        this._data_threejs = new DataThreejs(model);
    }

    /**
     * Get the GI Model
     */
    getGIModel(): GIModel {
        // console.log('CALLING getModel in DATA SERVICE');
        return this._model;
    }

    /**
     * Set the GI Model
     * @param model
     */
    setGIModel(model: GIModel) {
        // console.log('CALLING setModel in DATA SERVICE');
        // console.log('DATTTTTTTTTTTTTTTTTTT', model);
        this._model = model;
        // this._data_threejs.UpdateModel(model);
    }
}
