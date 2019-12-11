import { EEntType, TTri, TEdge, TWire, TFace, IGeomArrays, Txyz, TColl, TVert } from './common';
import { GIGeom } from './GIGeom';
import { arrRem, arrIdxAdd } from '../util/arrs';
import { vecDot } from '../geom/vectors';

/**
 * Class for geometry.
 */
export class GIGeomModifyColl {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
    }
    /**
     * Set the parent if a collection
     * @param coll_i The index of teh collection that is the parent
     * @param parent_coll_i
     */
    public setCollParent(coll_i: number, parent_coll_i: number): void {
        this._geom_arrays.dn_colls_objs[coll_i][0] = parent_coll_i;
    }
    /**
     * Add entities to a collection
     * @param coll_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    public collAddEnts(coll_i: number, points_i: number[], plines_i: number[], pgons_i: number[]): void {
        const coll: TColl = this._geom_arrays.dn_colls_objs[coll_i];
        const coll_points: number[] = coll[1];
        if (points_i && points_i.length) {
            for (const point_i of points_i) {
                if (coll_points.indexOf(point_i) === -1) {
                    // update down arrays
                    coll_points.push(point_i);
                    // update up arrays
                    arrIdxAdd(this._geom_arrays.up_points_colls, point_i, coll_i);
                }
            }
        }
        const coll_plines: number[] = coll[2];
        if (plines_i && plines_i.length) {
            for (const pline_i of plines_i) {
                if (coll_plines.indexOf(pline_i) === -1) {
                    // update down arrays
                    coll_plines.push(pline_i);
                    // update up arrays
                    arrIdxAdd(this._geom_arrays.up_plines_colls, pline_i, coll_i);
                }
            }
        }
        const coll_pgons: number[] = coll[3];
        if (pgons_i && pgons_i.length) {
            for (const pgon_i of pgons_i) {
                if (coll_pgons.indexOf(pgon_i) === -1) {
                    // update down arrays
                    coll_pgons.push(pgon_i);
                    // update up arrays
                    arrIdxAdd(this._geom_arrays.up_pgons_colls, pgon_i, coll_i);
                }
            }
        }
    }
    /**
     * Remove entities from a collection
     * @param coll_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    public collRemoveEnts(coll_i: number, points_i: number[], plines_i: number[], pgons_i: number[]): void {
        const coll: TColl = this._geom_arrays.dn_colls_objs[coll_i];
        const coll_points: number[] = coll[1];
        if (points_i && points_i.length) {
            for (const point_i of points_i) {
                // update down arrays
                arrRem(coll_points, point_i);
                // update up arrays
                arrRem(this._geom_arrays.up_points_colls[point_i], coll_i);
            }
        }
        const coll_plines: number[] = coll[2];
        if (plines_i && plines_i.length) {
            for (const pline_i of plines_i) {
                // update down arrays
                arrRem(coll_plines, pline_i);
                // update up arrays
                arrRem(this._geom_arrays.up_plines_colls[pline_i], coll_i);
            }
        }
        const coll_pgons: number[] = coll[3];
        if (pgons_i && pgons_i.length) {
            for (const pgon_i of pgons_i) {
                // update down arrays
                arrRem(coll_pgons, pgon_i);
                // update up arrays
                arrRem(this._geom_arrays.up_pgons_colls[pgon_i], coll_i);
            }
        }
    }
}
