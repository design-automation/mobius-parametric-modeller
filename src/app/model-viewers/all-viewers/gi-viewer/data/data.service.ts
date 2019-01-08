import { GIModel } from '@libs/geo-info/GIModel';
import { EEntityTypeStr } from '@libs/geo-info/common';
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
    // private _model: GIModel;
    private _data_threejs: DataThreejs;
    // Others
    // imVisible: boolean;
    selecting: any = [];

    // Selected Entities by Threejs Viewer
    selected_ents: Map<string, Map<string, number>>  = new Map();

    // Settings
    show_selected = false;
    /**
     * Create a data service.
     */
    constructor() {
        // Do nothing
        // console.log('CALLING constructor in DATA SERVICE');
        this.selected_ents.set(EEntityTypeStr.EDGE, new Map());
        this.selected_ents.set(EEntityTypeStr.FACE, new Map());
        this.selected_ents.set(EEntityTypeStr.WIRE, new Map());
        this.selected_ents.set(EEntityTypeStr.PGON, new Map());
        this.selected_ents.set(EEntityTypeStr.PLINE, new Map());
        this.selected_ents.set(EEntityTypeStr.POINT, new Map());
        this.selected_ents.set(EEntityTypeStr.COLL, new Map());
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
    setThreejsScene() {
        this._data_threejs = new DataThreejs();
    }

    /**
     * check selected entites number
     */
    countSelectedEnts() {
        let count = 0;
        this.selected_ents.forEach(selected_ents => {
            count = +selected_ents.size;
        });
        return count;
    }
}
