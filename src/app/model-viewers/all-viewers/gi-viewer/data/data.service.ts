import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType, EEntTypeStr } from '@libs/geo-info/common';
import { DataThreejs } from './data.threejs';
// import @angular stuff
import { Injectable } from '@angular/core';
import { DataService as DS } from '@services';
import { MatTableDataSource } from '@angular/material';
/**
 * DataService
 * The data service for the Goe-Info viewer.
 */
@Injectable()
export class DataService {
    // GI Model
    // private _model: GIModel;
    private static _tableDataSource: MatTableDataSource<object>;

    private _data_threejs: DataThreejs;

    selecting: any = [];

    // Selected Entities by Threejs Viewer for Attribute Table
    selected_ents: Map<string, Map<string, number>> = new Map();
    selected_positions: Map<string, string[]>;
    selected_vertex: Map<string, string[]>;
    selected_face_edges: Map<string, string[]>;
    selected_face_wires: Map<string, string[]>;
    selected_coll: Map<string, string[]>;

    selectingEntityType: { id: EEntType, name: string } ;

    switch_page: boolean;
    /**
     * Create a data service.
     */
    constructor(private ds: DS) {
        this.selected_ents.set(EEntTypeStr[EEntType.POSI], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.VERT], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.EDGE], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.WIRE], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.PGON], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.PLINE], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.POINT], new Map());
        this.selected_ents.set(EEntTypeStr[EEntType.COLL], new Map());
        this.selected_positions = new Map();
        this.selected_vertex = new Map();
        this.selected_face_edges = new Map();
        this.selected_face_wires = new Map();
        this.selected_coll = new Map();
        this.selectingEntityType = { id: EEntType.PGON, name: 'Polygons' };
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
        this._data_threejs = new DataThreejs(settings, this.ds);
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

    clearAll() {
        this.selected_ents.forEach(selected_ents => selected_ents.clear());
    }

    updateSelectingEntityType(selEntType: { id: number, name: string }) { this.selectingEntityType = selEntType; }

    get tableDataSource() {return DataService._tableDataSource; }
    set tableDataSource(dataSource: any) {DataService._tableDataSource = dataSource; }

}
