import { GIModel } from '@libs/geo-info/GIModel';
import { GICommon } from '@libs/geo-info';
import { DataThreejs } from './data.threejs';
// import @angular stuff
import { Injectable } from '@angular/core';
import { GIAttribMap } from '@libs/geo-info/GIAttribMap';

/**
 * DataService
 * The data service for the Goe-Info viewer.
 */
@Injectable()
export class DataService {
    // GI Model
    // private _model: GIModel;
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
        return this._data_threejs;
    }

    /**
     * Set the THreejs Scene
     */
    setThreejsScene(model: GIModel) {
        this._data_threejs = new DataThreejs(model);
    }
}

