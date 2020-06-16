/**
 * Geo-info model metadata class.
 */
export class GIMeta {
    private _posi_count: number;
    private _vert_count: number;
    private _edge_count: number;
    private _wire_count: number;
    private _face_count: number;
    private _point_count: number;
    private _pline_count: number;
    private _pgon_count: number;
    private _coll_count: number;
    /**
     * Constructor
     */
    constructor() {
        this._posi_count = 0;
        this._vert_count = 0;
        this._edge_count = 0;
        this._wire_count = 0;
        this._face_count = 0;
        this._point_count = 0;
        this._pline_count = 0;
        this._pgon_count = 0;
        this._coll_count = 0;

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
}
