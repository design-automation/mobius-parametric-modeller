import {  EEntType, IGeomMaps, TEntTypeIdx } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for navigating the geometry.
 */
export class GIGeomNavSnapshot {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Navigate down the hierarchy
    // ============================================================================
    /**
     * Returns all points in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    public navCollToPoint(ssid: number, coll_i: number): number[] {
        // get the descendants of this collection
        const coll_and_desc_i: number[] = this.navCollToCollDescendents(ssid, coll_i);
        // if no descendants, just return the the ents in this coll
        if (coll_and_desc_i.length === 0) {
            return this.modeldata.geom.snapshot.getCollPoints(ssid, coll_i); // coll points
        }
        // we have descendants, so get all points
        coll_and_desc_i.splice(0, 0, coll_i);
        const points_i_set: Set<number> = new Set();
        for (const one_coll_i of coll_and_desc_i) {
            for (const point_i of this.modeldata.geom.snapshot.getCollPoints(ssid, one_coll_i)) {
                points_i_set.add(point_i);
            }
        }
        return Array.from(points_i_set);
    }
    /**
     * Returns all polylines in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    public navCollToPline(ssid: number, coll_i: number): number[] {
        // get the descendants of this collection
        const coll_and_desc_i: number[] = this.navCollToCollDescendents(ssid, coll_i);
        // if no descendants, just return the the ents in this coll
        if (coll_and_desc_i.length === 0) {
            return this.modeldata.geom.snapshot.getCollPlines(ssid, coll_i); // coll lines
        }
        // we have descendants, so get all plines
        coll_and_desc_i.splice(0, 0, coll_i);
        const plines_i_set: Set<number> = new Set();
        for (const one_coll_i of coll_and_desc_i) {
            for (const pline_i of this.modeldata.geom.snapshot.getCollPlines(ssid, one_coll_i)) {
                plines_i_set.add(pline_i);
            }
        }
        return Array.from(plines_i_set);
    }
    /**
     * Returns all polygons in this collection and in descendent collections.
     * If none, returns []
     * @param coll_i
     */
    public navCollToPgon(ssid: number, coll_i: number): number[] {
        // get the descendants of this collection
        const coll_and_desc_i: number[] = this.navCollToCollDescendents(ssid, coll_i);
        // if no descendants, just return the the ents in this coll
        if (coll_and_desc_i.length === 0) {
            return this.modeldata.geom.snapshot.getCollPgons(ssid, coll_i); // coll pgons
        }
        // we have descendants, so get all pgons
        coll_and_desc_i.splice(0, 0, coll_i);
        const pgons_i_set: Set<number> = new Set();
        for (const one_coll_i of coll_and_desc_i) {
            for (const pgon_i of this.modeldata.geom.snapshot.getCollPgons(ssid, one_coll_i)) {
                pgons_i_set.add(pgon_i);
            }
        }
        return Array.from(pgons_i_set);
    }
    /**
     * Returns children of this collection.
     * If none, returns []
     * @param coll_i
     */
    public navCollToCollChildren(ssid: number, coll_i: number): number[] {
        return this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i); // coll children
    }
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    public navCollToCollDescendents(ssid: number, coll_i: number): number[] {
        const descendent_colls_i: number[] = [];
        this._getCollDescendents(ssid, coll_i, descendent_colls_i);
        return descendent_colls_i;
    }
    private _getCollDescendents(ssid: number, coll_i: number, descendent_colls_i: number[]): void {
        const child_colls_i: number[] = this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
        if (child_colls_i === undefined) { return; }
        child_colls_i.forEach( coll2_i => {
            descendent_colls_i.push(coll2_i);
            this._getCollDescendents(ssid, coll2_i, descendent_colls_i);
        });
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    /**
     * Returns [] if none
     * @param point_i
     */
    public navPosiToVert(ssid: number, posi_i: number): number[] {
        const verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
        const filt_verts_i: number[] = [];
        for (const vert_i of verts_i) {
            const [ent_type, ent_i]: TEntTypeIdx  = this.modeldata.geom.query.getTopoObj(EEntType.VERT, vert_i);
            if (this.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i)) {
                filt_verts_i.push(vert_i);
            }
        }
        return filt_verts_i;
    }
    /**
     * Returns [] if none
     * @param point_i
     */
    public navPointToColl(ssid: number, point_i: number): number[] {
        return this.modeldata.geom.snapshot.getPointColls(ssid, point_i);
    }
    /**
     * Returns [] if none
     * @param pline_i
     */
    public navPlineToColl(ssid: number, pline_i: number): number[] {
        return this.modeldata.geom.snapshot.getPlineColls(ssid, pline_i);
    }
    /**
     * Returns [] if none
     * @param pgon_i
     */
    public navPgonToColl(ssid: number, pgon_i: number): number[] {
        return this.modeldata.geom.snapshot.getPgonColls(ssid, pgon_i);
    }
    /**
     * Returns undefined if none
     * @param coll_i
     */
    public navCollToCollParent(ssid: number, coll_i: number): number {
        return this.modeldata.geom.snapshot.getCollParent(ssid, coll_i); // coll parent
    }
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    public navCollToCollAncestors(ssid: number, coll_i: number): number[] {
        const ancestor_colls_i: number[] = [];
        let parent_coll_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, coll_i);
        while (parent_coll_i !== undefined) {
            ancestor_colls_i.push(parent_coll_i);
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return ancestor_colls_i;
    }
}

