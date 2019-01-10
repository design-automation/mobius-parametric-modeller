import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType } from '@libs/geo-info/common';
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

    selecting: any = [];

    // Selected Entities by Threejs Viewer for Attribute Table
    selected_ents: Map<number, Map<string, number>> = new Map();
    /**
     * Create a data service.
     */
    constructor() {
        this.selected_ents.set(EEntType.POSI, new Map());
        this.selected_ents.set(EEntType.VERT, new Map());
        this.selected_ents.set(EEntType.EDGE, new Map());
        this.selected_ents.set(EEntType.FACE, new Map());
        this.selected_ents.set(EEntType.WIRE, new Map());
        this.selected_ents.set(EEntType.PGON, new Map());
        this.selected_ents.set(EEntType.PLINE, new Map());
        this.selected_ents.set(EEntType.POINT, new Map());
        this.selected_ents.set(EEntType.COLL, new Map());
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
    setThreejsScene(settings) {
        this._data_threejs = new DataThreejs(settings);
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
