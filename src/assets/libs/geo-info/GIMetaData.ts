import { EAttribDataTypeStrs, TAttribDataTypes } from './common';

interface IAttribValues {
    number: [number[], Map<string, number>];
    string: [string[], Map<string, number>];
    list:   [any[],    Map<string, number>];
    dict:   [object[], Map<string, number>];
}

/**
 * Geo-info model metadata class.
 */
export class GIMetaData {
    private _time_stamp: number;
    private _posi_count: number;
    private _vert_count: number;
    private _tri_count: number;
    private _edge_count: number;
    private _wire_count: number;
    private _face_count: number;
    private _point_count: number;
    private _pline_count: number;
    private _pgon_count: number;
    private _coll_count: number;
    private _attrib_values: IAttribValues;

    /**
     * Constructor
     */
    constructor() {
        // console.log('CREATING META OBJECT');
        this._time_stamp = 0;
        this._posi_count = 0;
        this._vert_count = 0;
        this._tri_count = 0;
        this._edge_count = 0;
        this._wire_count = 0;
        this._face_count = 0;
        this._point_count = 0;
        this._pline_count = 0;
        this._pgon_count = 0;
        this._coll_count = 0;
        this._attrib_values = {
            number: [[], new Map()],
            string: [[], new Map()],
            list:   [[], new Map()],
            dict:   [[], new Map()]
        };
    }
    // get next time stamp
    public nextTimeStamp(): number {
        const ts: number = this._time_stamp;
        this._time_stamp += 1;
        return ts;
    }
    // get next index
    public nextPosi(): number {
        const index: number = this._posi_count;
        this._posi_count += 1;
        return index;
    }
    public nextVert(): number {
        const index: number = this._vert_count;
        this._vert_count += 1;
        return index;
    }
    public nextTri(): number {
        const index: number = this._tri_count;
        this._tri_count += 1;
        return index;
    }
    public nextEdge(): number {
        const index: number = this._edge_count;
        this._edge_count += 1;
        return index;
    }
    public nextWire(): number {
        const index: number = this._wire_count;
        this._wire_count += 1;
        return index;
    }
    public nextFace(): number {
        const index: number = this._face_count;
        this._face_count += 1;
        return index;
    }
    public nextPoint(): number {
        const index: number = this._point_count;
        this._point_count += 1;
        return index;
    }
    public nextPline(): number {
        const index: number = this._pline_count;
        this._pline_count += 1;
        return index;
    }
    public nextPgon(): number {
        const index: number = this._pgon_count;
        this._pgon_count += 1;
        return index;
    }
    public nextColl(): number {
        const index: number = this._coll_count;
        this._coll_count += 1;
        return index;
    }
    // set next index
    public setNextPosi(index: number): void {
        this._posi_count = index;
    }
    public setNextVert(index: number): void {
        this._vert_count = index;
    }
    public setNextTri(index: number): void {
        this._tri_count = index;
    }
    public setNextEdge(index: number): void {
        this._edge_count = index;
    }
    public setNextWire(index: number): void {
        this._wire_count = index;
    }
    public setNextFace(index: number): void {
        this._face_count = index;
    }
    public setNextPoint(index: number): void {
        this._point_count = index;
    }
    public setNextPline(index: number): void {
        this._pline_count = index;
    }
    public setNextPgon(index: number): void {
        this._pgon_count = index;
    }
    public setNextColl(index: number): void {
        this._coll_count = index;
    }
    // attribute values
    public addAttribByKeyVal(key: string|number, val: TAttribDataTypes, data_type: EAttribDataTypeStrs): number {
        if (this._attrib_values[data_type][1].has(key)) {
            return this._attrib_values[data_type][1].get(key);
        }
        const index = this._attrib_values[data_type][0].push(val) - 1;
        this._attrib_values[data_type][1].set(key, index);
        return index;
    }
    public getAttribValFromIdx(index: number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        return this._attrib_values[data_type][0][index];
    }
    public getAttribValFromKey(key: string|number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        return this._attrib_values[data_type][0][this._attrib_values[data_type][1].get(key)];
    }
    public getAttribIdxFromKey(key: string|number, data_type: EAttribDataTypeStrs): number {
        return this._attrib_values[data_type][1].get(key);
    }
    public hasAttribKey(key: string|number, data_type: EAttribDataTypeStrs): boolean {
        return this._attrib_values[data_type][1].has(key);
    }
    // create string for debugging
    public toStr(): string {
        return '' +
            'number: ' +
            JSON.stringify(this._attrib_values['number'][0]) +
            JSON.stringify(Array.from(this._attrib_values['number'][1])) +
            '\nstring: ' +
            JSON.stringify(this._attrib_values['string'][0]) +
            JSON.stringify(Array.from(this._attrib_values['string'][1])) +
            '\nlist: ' +
            JSON.stringify(this._attrib_values['list'][0]) +
            JSON.stringify(Array.from(this._attrib_values['list'][1])) +
            '\ndict: ' +
            JSON.stringify(this._attrib_values['dict'][0]) +
            JSON.stringify(Array.from(this._attrib_values['dict'][1]));
    }
}
