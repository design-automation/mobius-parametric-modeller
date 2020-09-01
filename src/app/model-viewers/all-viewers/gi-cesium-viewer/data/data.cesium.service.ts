import { DataCesium } from './data.cesium';
import { CesiumSettings } from '../gi-cesium-viewer.settings';

// import @angular stuff
import { Injectable } from '@angular/core';

/**
 * DataService
 * The data service for the Cesium viewer.
 */
@Injectable()
export class DataCesiumService {
    private _data_cesium: DataCesium;
    private _cesium_settings: CesiumSettings;

    /**
     * Create a data service.
     */
    constructor() {
    }

    /**
     * Get the Cesium Scene
     */
    getCesiumScene(): DataCesium {
        return this._data_cesium;
    }
    /**
     * Set the Cesium Scene
     */
    setCesiumScene(settings: CesiumSettings) {
        this._data_cesium = new DataCesium(settings);
    }

    /**
     * Get the Cesium Scene
     */
    getCesiumSettings(): CesiumSettings {
        return this._cesium_settings;
    }

    /**
     * Set the Cesium Scene
     */
    setCesiumSettings(settings: CesiumSettings) {
        this._cesium_settings = settings;
    }

    createCesiumViewer() {
        this._data_cesium.createCesiumViewer();
    }
}
