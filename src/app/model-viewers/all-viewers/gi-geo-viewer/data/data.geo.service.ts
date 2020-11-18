import { DataGeo } from './data.geo';
import { GeoSettings } from '../gi-geo-viewer.settings';

// import @angular stuff
import { Injectable } from '@angular/core';

/**
 * DataService
 * The data service for the Geo viewer.
 */
@Injectable()
export class DataGeoService {
    private _data_geo: DataGeo;
    private _geo_settings: GeoSettings;

    /**
     * Create a data service.
     */
    constructor() {
    }

    /**
     * Get the Geo Scene
     */
    getGeoScene(): DataGeo {
        return this._data_geo;
    }
    /**
     * Set the Geo Scene
     */
    setGeoScene(settings: GeoSettings) {
        this._data_geo = new DataGeo(settings);
    }

    /**
     * Get the Geo Scene
     */
    getGeoSettings(): GeoSettings {
        return this._geo_settings;
    }

    /**
     * Set the Geo Scene
     */
    setGeoSettings(settings: GeoSettings) {
        this._geo_settings = settings;
    }

    createGeoViewer(threejsScene) {
        this._data_geo.createGeoViewer(threejsScene);
    }
}
