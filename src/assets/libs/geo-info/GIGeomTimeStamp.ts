import { EEntType, TTri, TEdge, TWire, TFace, IGeomArrays, Txyz, TColl, TVert } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for geometry.
 */
export class GIGeomTimeStamp {
    private _geom: GIGeom;
    private _geom_maps: IGeomArrays;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
    /**
     * Update time stamp of an entity.
     * @param point_i
     */
    public updateEntTs(ent_type: EEntType, ent_i: number): void {
        const ts: number = this._geom.modeldata.model.metadata.nextTimeStamp();
        switch (ent_type) {
            case EEntType.POSI:
                this._geom_maps.posis_ts[ent_i] = ts;
                return;
            case EEntType.POINT:
                this._geom_maps.points_ts[ent_i] = ts;
                return;
            case EEntType.PLINE:
                this._geom_maps.plines_ts[ent_i] = ts;
                return;
            case EEntType.PGON:
                this._geom_maps.pgons_ts[ent_i] = ts;
                return;
            case EEntType.COLL:
                this._geom_maps.colls_ts[ent_i] = ts;
                return;
        }
    }
    /**
     * Get the timestamp of a posi
     * @param posi_i
     */
    public getEntTs(ent_type: EEntType, ent_i: number): number {
        switch (ent_type) {
            case EEntType.POSI:
                return this._geom_maps.posis_ts[ent_i];
            case EEntType.POINT:
                return this._geom_maps.points_ts[ent_i];
            case EEntType.PLINE:
                return this._geom_maps.plines_ts[ent_i];
            case EEntType.PGON:
                return this._geom_maps.pgons_ts[ent_i];
            case EEntType.COLL:
                return this._geom_maps.colls_ts[ent_i];
            default:
                throw new Error('Get time stamp: Entity type not recognised.');
        }
    }
    /**
     * Set the timestamp for an ent.
     * This is used by merge.
     * @param posi_i
     */
    public setEntTs(ent_type: EEntType, ent_i: number, ts: number): void {
        switch (ent_type) {
            case EEntType.POSI:
                this._geom_maps.posis_ts[ent_i] = ts;
                return;
            case EEntType.POINT:
                this._geom_maps.points_ts[ent_i] = ts;
                return;
            case EEntType.PLINE:
                this._geom_maps.plines_ts[ent_i] = ts;
                return;
            case EEntType.PGON:
                this._geom_maps.pgons_ts[ent_i] = ts;
                return;
            case EEntType.COLL:
                this._geom_maps.colls_ts[ent_i] = ts;
                return;
            default:
                throw new Error('Get time stamp: Entity type not recognised.');
        }
    }
}
