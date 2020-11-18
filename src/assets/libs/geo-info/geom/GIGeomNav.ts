import {  EEntType, IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for navigating the geometry.
 */
export class GIGeomNav {
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
     * Never none
     * @param vert_i
     */
    public navVertToPosi(vert_i: number): number {
        return this._geom_maps.dn_verts_posis.get(vert_i);
    }
    /**
     * Never none, an array of length 2
     * @param edge_i
     */
    public navEdgeToVert(edge_i: number): number[] {
        return this._geom_maps.dn_edges_verts.get(edge_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param wire_i
     */
    public navWireToEdge(wire_i: number): number[] {
        return this._geom_maps.dn_wires_edges.get(wire_i); // WARNING BY REF
    }
    /**
     * Never none
     * @param point_i
     */
    public navPointToVert(point_i: number): number {
        return this._geom_maps.dn_points_verts.get(point_i);
    }
    /**
     * Never none
     * @param line_i
     */
    public navPlineToWire(line_i: number): number {
        return this._geom_maps.dn_plines_wires.get(line_i);
    }
    /**
     * Never none
     * @param pgon_i
     */
    public navPgonToWire(pgon_i: number): number[] {
        return this._geom_maps.dn_pgons_wires.get(pgon_i); // WARNING BY REF
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    public navCollToPoint(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // get the descendants of this collection
        const coll_and_desc_i: number[] = this.modeldata.geom.colls.getCollDescendents(coll_i);
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
     * If none, returns []
     * @param coll_i
     */
    public navCollToPline(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // get the descendants of this collection
        const coll_and_desc_i: number[] = this.modeldata.geom.colls.getCollDescendents(coll_i);
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
     * If none, returns []
     * @param coll_i
     */
    public navCollToPgon(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        // get the descendants of this collection
        const coll_and_desc_i: number[] = this.modeldata.geom.colls.getCollDescendents(coll_i);
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
     * If none, returns []
     * @param coll_i
     */
    public navCollToCollChildren(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i); // coll children
    }
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    /**
     * Returns [] is none
     * @param posi_i
     */
    public navPosiToVert(posi_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this._geom_maps.up_posis_verts.get(posi_i).filter( ent_i => this.modeldata.geom.snapshot.hasEnt(ssid, EEntType.VERT, ent_i) );
    }
    /**
     * Returns undefined if none (consider points)
     * The array of edges wil be length of either one or two, [in_edge, out_edge].
     * If the vertex is at the start or end of a polyline, then length will be one.
     * @param vert_i
     */
    public navVertToEdge(vert_i: number): number[] {
        return this._geom_maps.up_verts_edges.get(vert_i); // WARNING BY REF
    }
    /**
     * Returns undefined if none.
     * @param edge_i
     */
    public navEdgeToWire(edge_i: number): number {
        return this._geom_maps.up_edges_wires.get(edge_i);
    }
    /**
     * Returns undefined if none
     * @param vert_i
     */
    public navVertToPoint(vert_i: number): number {
        return this._geom_maps.up_verts_points.get(vert_i);
    }
    /**
     * Returns undefined if none
     * @param tri_i
     */
    public navWireToPline(wire_i: number): number {
        return this._geom_maps.up_wires_plines.get(wire_i);
    }
    /**
     * Never none
     * @param tri_i
     */
    public navTriToPgon(tri_i: number): number {
        return this._geom_maps.up_tris_pgons.get(tri_i);
    }
    /**
     * Never none
     * @param wire_i
     */
    public navWireToPgon(wire_i: number): number {
        return this._geom_maps.up_wires_pgons.get(wire_i);
    }
    /**
     * Returns [] if none
     * @param point_i
     */
    public navPointToColl(point_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getPointColls(ssid, point_i);
    }
    /**
     * Returns [] if none
     * @param pline_i
     */
    public navPlineToColl(pline_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getPlineColls(ssid, pline_i);
    }
    /**
     * Returns [] if none
     * @param pgon_i
     */
    public navPgonToColl(pgon_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getPgonColls(ssid, pgon_i);
    }
    /**
     * Returns undefined if none
     * @param coll_i
     */
    public navCollToCollParent(coll_i: number): number {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getCollParent(ssid, coll_i); // coll parent
    }
    // ============================================================================
    // Private, Navigate up from any to ?
    // ============================================================================
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToEdge(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navUpAnyToEdge");
        // if (ent_type > EEntType.EDGE) { throw new Error(); }
        // if (ent_type === EEntType.EDGE) { return [ent_i]; }
        if (ent_type === EEntType.VERT) {
            const edges_i: number[] = [];
            const v_edges_i: number[] = this._geom_maps.up_verts_edges.get(ent_i);
            if (v_edges_i !== undefined) {
                for (const edge_i of v_edges_i) {
                    edges_i.push(edge_i);
                }
            }
            return edges_i;
        }
        if (ent_type === EEntType.POSI) {
            // one posi could have multiple verts
            // but edges on those verts will always be different so no need to check for dups
            const edges_i: number[] = [];
            for (const vert_i of this.navPosiToVert(ent_i)) {
                const v_edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
                if (v_edges_i !== undefined) {
                    for (const edge_i of v_edges_i) {
                        edges_i.push(edge_i);
                    }
                }
            }
            return edges_i;
        }
        return []; // points
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToWire(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navUpAnyToWire");
        // if (ent_type > EEntType.WIRE) { throw new Error(); }
        // if (ent_type === EEntType.WIRE) { return [ent_i]; }
        if (ent_type === EEntType.EDGE) {
            return [this._geom_maps.up_edges_wires.get(ent_i)];
        }
        if (ent_type === EEntType.VERT) {
            const edges_i: number[] = this._geom_maps.up_verts_edges.get(ent_i);
            if (edges_i !== undefined) {
                return [this._geom_maps.up_edges_wires.get(edges_i[0])]; // only 1 edge
            }
        }
        // a vertex can have two edges which belong to the same wire
        // we do not want to have two copies of that wire, so we need to take care to only get 1 edge
        if (ent_type === EEntType.POSI) {
            const wires_i: number[] = [];
            for (const vert_i of this._geom_maps.up_posis_verts.get(ent_i)) {
                const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
                if (edges_i !== undefined) {
                    wires_i.push( this._geom_maps.up_edges_wires.get(edges_i[0]) ); // only 1 edge
                }
            }
            return wires_i;
        }
        return [];
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToPoint(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navUpAnyToPoint");
        // if (ent_type > EEntType.POINT) { throw new Error(); }
        // if (ent_type === EEntType.POINT) { return [ent_i]; }
        if (ent_type === EEntType.VERT) {
            const point_i: number = this._geom_maps.up_verts_points.get(ent_i);
            return point_i === undefined ? [] : [point_i];
        }
        if (ent_type === EEntType.POSI) {
            const verts_i: number[] = this.navPosiToVert(ent_i);
            const points_i: number[] = [];
            for (const vert_i of verts_i) {
                const point_i: number = this._geom_maps.up_verts_points.get(vert_i);
                if (point_i !== undefined) { points_i.push(point_i); }
            }
            return points_i;
        }
        return [];
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToPline(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navUpAnyToPline");
        // if (ent_type > EEntType.PLINE) { throw new Error(); }
        // if (ent_type === EEntType.PLINE) { return [ent_i]; }
        if (ent_type === EEntType.POINT) { return[]; }
        const plines_i: number[] = [];
        for (const wire_i of this._navUpAnyToWire(ent_type, ent_i)) {
            const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
            if (pline_i !== undefined) { plines_i.push(pline_i); }
        }
        return plines_i;
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navUpAnyToPgon(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navUpAnyToPgon");
        // if (ent_type > EEntType.PGON) { throw new Error(); }
        // if (ent_type === EEntType.PGON) { return [ent_i]; }
        if (ent_type > EEntType.WIRE) { return[]; } // point and pline
        const pgons_i: number[] = [];
        for (const wire_i of this._navUpAnyToWire(ent_type, ent_i)) {
            const pgon_i: number = this._geom_maps.up_wires_pgons.get(wire_i);
            if (pgon_i !== undefined) { pgons_i.push(pgon_i); }
        }
        // it is possible that there is a posi that has two wires on the same pgon
        // this would result in the pgon being duplicated...
        // but checking for this results in a performance hit...
        return pgons_i;
    }
    /**
     * Returns [] if none.
     * @param posi_i
     */
    private _navUpAnyToColl(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navUpAnyToColl");
        // if (ent_type === EEntType.COLL) { return [ent_i]; }
        const colls_i: number[] = [];
        for (const point_i of this.navAnyToPoint(ent_type, ent_i)) {
            for (const coll_i of this.navPointToColl(point_i)) {
                colls_i.push(coll_i);
            }
        }
        for (const pline_i of this.navAnyToPline(ent_type, ent_i)) {
            for (const coll_i of this.navPlineToColl(pline_i)) {
                colls_i.push(coll_i);
            }
        }
        for (const pgon_i of this.navAnyToPgon(ent_type, ent_i)) {
            for (const coll_i of this.navPgonToColl(pgon_i)) {
                colls_i.push(coll_i);
            }
        }
        // if ent_type is posi, we could have duplicates
        if (ent_type === EEntType.POSI) { return Array.from(new Set(colls_i)); }
        return colls_i;
    }
    // ============================================================================
    // Private, Navigate down from any to ?
    // ============================================================================
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToWire(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navDnAnyToWire");
        // if (ent_type < EEntType.WIRE) { throw new Error(); }
        // if (ent_type === EEntType.WIRE) { return [ent_i]; }
        if (ent_type === EEntType.PLINE) {
            return [this._geom_maps.dn_plines_wires.get(ent_i)];
        }
        if (ent_type === EEntType.PGON) {
            return this._geom_maps.dn_pgons_wires.get(ent_i); // WARNING BY REF
        }
        if (ent_type === EEntType.COLL) {
            const wires_i: number[] = [];
            for (const pline_i of this.navCollToPline(ent_i)) {
                wires_i.push( this._geom_maps.dn_plines_wires.get(pline_i) );
            }
            for (const pgon_i of this.navCollToPgon(ent_i)) {
                for (const wire_i of this._geom_maps.dn_pgons_wires.get(pgon_i)) {
                    wires_i.push( wire_i );
                }
            }
            return wires_i;
        }
        return []; // points
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToEdge(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navDnAnyToEdge");
        // if (ent_type < EEntType.EDGE) { throw new Error(); }
        // if (ent_type === EEntType.EDGE) { return [ent_i]; }
        if (ent_type === EEntType.WIRE) { return this._geom_maps.dn_wires_edges.get(ent_i); }
        const edges_i: number[] = [];
        for (const wire_i of this._navDnAnyToWire(ent_type, ent_i)) {
            for (const edge_i of this._geom_maps.dn_wires_edges.get(wire_i)) {
                edges_i.push(edge_i);
            }
        }
        return edges_i;
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToVert(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navDnAnyToVert");
        // if (ent_type < EEntType.VERT) { throw new Error(); }
        // if (ent_type === EEntType.VERT) { return [ent_i]; }
        if (ent_type === EEntType.EDGE) { return this._geom_maps.dn_edges_verts.get(ent_i); }
        if (ent_type === EEntType.WIRE) { return this.modeldata.geom.query.getWireVerts(ent_i); }
        if (ent_type === EEntType.POINT) { return [this._geom_maps.dn_points_verts.get(ent_i)]; }
        const verts_i: number[] = [];
        for (const wire_i of this._navDnAnyToWire(ent_type, ent_i)) {
            for (const vert_i of this.modeldata.geom.query.getWireVerts(wire_i)) {
                verts_i.push(vert_i);
            }
        }
        return verts_i;
    }
    /**
     * Returns [] if none.
     * @param
     */
    private _navDnAnyToPosi(ent_type: EEntType, ent_i: number): number[] {
        // console.log("_navDnAnyToPosi");
        // if (ent_type === EEntType.POSI) { return [ent_i]; }
        if (ent_type === EEntType.VERT) { return [ this._geom_maps.dn_verts_posis.get(ent_i) ]; }
        // multiple verts can share the same vertex, so we need to check for dups
        const set_posis_i: Set<number> = new Set();
        for (const vert_i of this._navDnAnyToVert(ent_type, ent_i)) {
            set_posis_i.add(this._geom_maps.dn_verts_posis.get(vert_i));
        }
        return Array.from(set_posis_i);
    }
    // ============================================================================
    // Navigate any to ?
    // ============================================================================
    public navAnyToPosi(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToPosi");
        if (ent_type === EEntType.POSI) { return [ent_i]; }
        return this._navDnAnyToPosi(ent_type, ent_i);
    }
    public navAnyToVert(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToVert");
        if (ent_type === EEntType.VERT) { return [ent_i]; }
        if (ent_type === EEntType.POSI) {
            return this.navPosiToVert(ent_i); // WARNING BY REF
        }
        return this._navDnAnyToVert(ent_type, ent_i);
    }
    public navAnyToEdge(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToEdge");
        if (ent_type === EEntType.EDGE) { return [ent_i]; }
        if (ent_type <= EEntType.EDGE) {
            return this._navUpAnyToEdge(ent_type, ent_i);
        }
        return this._navDnAnyToEdge(ent_type, ent_i);
    }
    public navAnyToWire(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToWire");
        if (ent_type === EEntType.WIRE) { return [ent_i]; }
        if (ent_type <= EEntType.WIRE) {
            return this._navUpAnyToWire(ent_type, ent_i);
        }
        return this._navDnAnyToWire(ent_type, ent_i);
    }
    public navAnyToPoint(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToPoint");
        if (ent_type === EEntType.POINT) { return [ent_i]; }
        if (ent_type <= EEntType.POINT) {
            return this._navUpAnyToPoint(ent_type, ent_i);
        }
        if (ent_type === EEntType.COLL) {
            return this.navCollToPoint(ent_i);
        }
        return [];
    }
    public navAnyToPline(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToPline");
        if (ent_type === EEntType.PLINE) { return [ent_i]; }
        if (ent_type <= EEntType.PLINE) {
            return this._navUpAnyToPline(ent_type, ent_i);
        }
        if (ent_type === EEntType.COLL) {
            return this.navCollToPline(ent_i);
        }
        return [];
    }
    public navAnyToPgon(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToPgon");
        if (ent_type === EEntType.PGON) { return [ent_i]; }
        if (ent_type <= EEntType.PGON) {
            return this._navUpAnyToPgon(ent_type, ent_i);
        }
        if (ent_type === EEntType.COLL) {
            return this.navCollToPgon(ent_i);
        }
        return [];
    }
    public navAnyToColl(ent_type: EEntType, ent_i: number): number[] {
        // console.log("navAnyToColl");
        if (ent_type === EEntType.COLL) { return [ent_i]; }
        return this._navUpAnyToColl(ent_type, ent_i);
    }
    // ============================================================================
    // Navigate any to any
    // ============================================================================
    /**
     * Main function used for queries.
     * Includes #ps #_v #_e #_w #pt #pl #pg
     * @param from_ets
     * @param to_ets
     * @param ent_i
     */
    public navAnyToAny(from_ets: EEntType, to_ets: EEntType, ent_i: number): number[] {
        // console.log("navAnyToAny");
        // check if this is nav coll to coll
        // for coll to coll, we assume we are going down, from parent to children
        if (from_ets === EEntType.COLL && to_ets === EEntType.COLL) {
            return this.navCollToCollChildren(ent_i);
        }
        // same level
        if (from_ets === to_ets) { return [ent_i]; }
        // up or down?
        switch (to_ets) {
            case EEntType.POSI:
                return this.navAnyToPosi(from_ets, ent_i);
            case EEntType.VERT:
                return this.navAnyToVert(from_ets, ent_i);
            case EEntType.EDGE:
                return this.navAnyToEdge(from_ets, ent_i);
            case EEntType.WIRE:
                return this.navAnyToWire(from_ets, ent_i);
            case EEntType.POINT:
                return this.navAnyToPoint(from_ets, ent_i);
            case EEntType.PLINE:
                return this.navAnyToPline(from_ets, ent_i);
            case EEntType.PGON:
                return this.navAnyToPgon(from_ets, ent_i);
            case EEntType.COLL:
                return this.navAnyToColl(from_ets, ent_i);
            default:
                throw new Error('Bad navigation in geometry data structure: ' + to_ets + ent_i);
        }
    }
}




// import {  EEntType, IGeomMaps } from '../common';
// import { GIModelData } from '../GIModelData';
// /**
//  * Class for navigating the geometry.
//  */
// export class GIGeomNav {
//     private modeldata: GIModelData;
//     private _geom_maps: IGeomMaps;
//     /**
//      * Constructor
//      */
//     constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
//         this.modeldata = modeldata;
//         this._geom_maps = geom_maps;
//     }
//     // ============================================================================
//     // Navigate down the hierarchy
//     // ============================================================================
//     public navVertToPosi(vert_i: number): number {
//         return this._geom_maps.dn_verts_posis.get(vert_i);
//     }
//     public navEdgeToVert(edge_i: number): number[] {
//         return this._geom_maps.dn_edges_verts.get(edge_i);
//     }
//     public navWireToEdge(wire_i: number): number[] {
//         return this._geom_maps.dn_wires_edges.get(wire_i);
//     }
//     public navPointToVert(point_i: number): number {
//         return this._geom_maps.dn_points_verts.get(point_i);
//     }
//     public navPlineToWire(line_i: number): number {
//         return this._geom_maps.dn_plines_wires.get(line_i);
//     }
//     public navPgonToWire(pgon_i: number): number[] {
//         return this._geom_maps.dn_pgons_wires.get(pgon_i);
//     }
//     public navCollToPoint(coll_i: number): number[] {
//         // get the descendants of this collection
//         const coll_and_desc_i: number[] = this.modeldata.geom.snapshot.getCollDescendents(coll_i);
//         // if no descendants, just return the the ents in this coll
//         if (coll_and_desc_i.length === 0) {
//             return this.modeldata.geom.snapshot.getCollPoints(coll_i); // coll points
//         }
//         // we have descendants, so get all points
//         coll_and_desc_i.splice(0, 0, coll_i);
//         const points_i_set: Set<number> = new Set();
//         for (const one_coll_i of coll_and_desc_i) {
//             for (const point_i of this.modeldata.geom.snapshot.getCollPoints(one_coll_i)) {
//                 points_i_set.add(point_i);
//             }
//         }
//         return Array.from(points_i_set);
//     }
//     public navCollToPline(coll_i: number): number[] {
//         // get the descendants of this collection
//         const coll_and_desc_i: number[] = this.modeldata.geom.snapshot.getCollDescendents(coll_i);
//         // if no descendants, just return the the ents in this coll
//         if (coll_and_desc_i.length === 0) {
//             return this.modeldata.geom.snapshot.getCollPlines(coll_i); // coll lines
//         }
//         // we have descendants, so get all plines
//         coll_and_desc_i.splice(0, 0, coll_i);
//         const plines_i_set: Set<number> = new Set();
//         for (const one_coll_i of coll_and_desc_i) {
//             for (const pline_i of this.modeldata.geom.snapshot.getCollPlines(one_coll_i)) {
//                 plines_i_set.add(pline_i);
//             }
//         }
//         return Array.from(plines_i_set);
//     }
//     public navCollToPgon(coll_i: number): number[] {
//         // get the descendants of this collection
//         const coll_and_desc_i: number[] = this.modeldata.geom.snapshot.getCollDescendents(coll_i);
//         // if no descendants, just return the the ents in this coll
//         if (coll_and_desc_i.length === 0) {
//             return this.modeldata.geom.snapshot.getCollPgons(coll_i); // coll pgons
//         }
//         // we have descendants, so get all pgons
//         coll_and_desc_i.splice(0, 0, coll_i);
//         const pgons_i_set: Set<number> = new Set();
//         for (const one_coll_i of coll_and_desc_i) {
//             for (const pgon_i of this.modeldata.geom.snapshot.getCollPgons(one_coll_i)) {
//                 pgons_i_set.add(pgon_i);
//             }
//         }
//         return Array.from(pgons_i_set);
//     }
//     public navCollToCollChildren(coll_i: number): number[] {
//         return this.modeldata.geom.snapshot.getCollChildren(coll_i); // coll children
//     }
//     // ============================================================================
//     // Navigate up the hierarchy
//     // ============================================================================
//     public navPosiToVert(posi_i: number): number[] {
//         const ssid: number = this.modeldata.active_ssid;
//         return this._geom_maps.up_posis_verts.get(posi_i).filter( ent_i => this.modeldata.geom.snapshot.hasEnt(ssid, EEntType.VERT, ent_i) );
//     }
//     public navVertToEdge(vert_i: number): number[] {
//         return this._geom_maps.up_verts_edges.get(vert_i);
//     }
//     public navEdgeToWire(edge_i: number): number {
//         return this._geom_maps.up_edges_wires.get(edge_i);
//     }
//     public navVertToPoint(vert_i: number): number {
//         return this._geom_maps.up_verts_points.get(vert_i);
//     }
//     public navWireToPline(wire_i: number): number {
//         return this._geom_maps.up_wires_plines.get(wire_i);
//     }
//     public navWireToPgon(wire_i: number): number {
//         return this._geom_maps.up_wires_pgons.get(wire_i);
//     }
//     public navPointToColl(point_i: number): number[] {
//         return this.modeldata.geom.snapshot.getPointColls(point_i);
//     }
//     public navPlineToColl(pline_i: number): number[] {
//         return this.modeldata.geom.snapshot.getPlineColls(pline_i);
//     }
//     public navPgonToColl(pgon_i: number): number[] {
//         return this.modeldata.geom.snapshot.getPgonColls(pgon_i);
//     }
//     public navCollToCollParent(coll_i: number): number {
//         // return undefined if no parent
//         return this.modeldata.geom.snapshot.getCollParent(coll_i); // coll parent
//     }
//     // ============================================================================
//     // Navigate from any level to ? (up or down)
//     // ============================================================================
//     /**
//      * Navigate from any level to the colls.
//      * This will filter out colls that are not in teh active snapshot.
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToColl(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.COLL) { return [index]; }
//         const set_colls_i: Set<number> = new Set();
//         const points_i: number[] = this.navAnyToPoint(ent_type, index);
//         for (const point_i of points_i) {
//             const point_colls_i: number[] = this.navPointToColl(point_i);
//             for (const coll_i of point_colls_i) {
//                 set_colls_i.add(coll_i);
//             }
//         }
//         const plines_i: number[] = this.navAnyToPline(ent_type, index);
//         for (const pline_i of plines_i) {
//             const pline_colls_i: number[] = this.navPointToColl(pline_i);
//             for (const coll_i of pline_colls_i) {
//                 set_colls_i.add(coll_i);
//             }
//         }
//         const pgons_i: number[] = this.navAnyToPgon(ent_type, index);
//         for (const pgon_i of pgons_i) {
//             const pgon_colls_i: number[] = this.navPointToColl(pgon_i);
//             for (const coll_i of pgon_colls_i) {
//                 set_colls_i.add(coll_i);
//             }
//         }
//         return Array.from(set_colls_i);
//     }
//     /**
//      * Navigate from any level to the pgons
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToPgon(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.PGON) { return [index]; }
//         const wires_i: number[] = this.navAnyToWire(ent_type, index);
//         return wires_i.map( wire_i => this.navWireToPgon(wire_i) ).filter(pgon_i => pgon_i !== undefined);
//     }
//     /**
//      * Navigate from any level to the plines
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToPline(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.PLINE) { return [index]; }
//         const wires_i: number[] = this.navAnyToWire(ent_type, index);
//         return wires_i.map( wire_i => this.navWireToPline(wire_i) ).filter(pline_i => pline_i !== undefined);
//     }
//     /**
//      * Navigate from any level to the points
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToPoint(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.POINT) { return [index]; }
//         const verts_i: number[] = this.navAnyToVert(ent_type, index);
//         return verts_i.map( vert_i => this.navVertToPoint(vert_i) ).filter(point_i => point_i !== undefined);
//     }
//     /**
//      * Navigate from any level to the wires
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToWire(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.POSI) {
//             const verts_i: number[] = this.navPosiToVert(index);
//             // avoid getting duplicates
//             const wires_i_set: Set<number> = new Set();
//             for (const vert_i of verts_i) {
//                 const wires_i: number[] = this.navAnyToWire(EEntType.VERT, vert_i);
//                 for (const wire_i of wires_i) {
//                     wires_i_set.add(wire_i);
//                 }
//             }
//             return Array.from(new Set(wires_i_set));
//         } else if (ent_type === EEntType.VERT) {
//             const edges_i: number[] = this.navVertToEdge(index);
//             return [].concat(...edges_i.map( edge_i => this.navEdgeToWire(edge_i) ));
//         } else if (ent_type === EEntType.TRI) {
//             return [];
//         } else if (ent_type === EEntType.EDGE) {
//             return [this.navEdgeToWire(index)];
//         } else if (ent_type === EEntType.WIRE) { // target
//             return [index];
//         } else if (ent_type === EEntType.POINT) {
//             return [];
//         } else if (ent_type === EEntType.PLINE) {
//             return [this.navPlineToWire(index)];
//         } else if (ent_type === EEntType.PGON) {
//             return this.navPgonToWire(index);
//         } else if (ent_type === EEntType.COLL) {
//             const all_wires_i: number[] = [];
//             const plines_i: number[] = this.navCollToPline(index);
//             for (const pline_i of plines_i) {
//                 const wire_i: number = this.navPlineToWire(pline_i);
//                 all_wires_i.push(wire_i);
//             }
//             const pgons_i: number[] = this.navCollToPgon(index);
//             for (const pgon_i of pgons_i) {
//                 const wires_i: number[] = this.navPgonToWire(pgon_i);
//                 for (const wire_i of wires_i) {
//                     all_wires_i.push(wire_i);
//                 }
//             }
//             return all_wires_i;
//         }
//         throw new Error('Bad navigation in geometry data structure: ' + ent_type + index);
//     }
//     /**
//      * Navigate from any level to the edges
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToEdge(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.POSI) {
//             const verts_i: number[] = this.navPosiToVert(index);
//             return [].concat(...verts_i.map( vert_i => this.navVertToEdge(vert_i) ));
//         } else if (ent_type === EEntType.VERT) {
//             return this.navVertToEdge(index);
//         } else if (ent_type === EEntType.TRI) {
//             return [];
//         } else if (ent_type === EEntType.EDGE) {
//             return [index];
//         } else if (ent_type === EEntType.WIRE) {
//             return this.navWireToEdge(index);
//         } else if (ent_type === EEntType.POINT) {
//             return [];
//         } else if (ent_type === EEntType.PLINE) {
//             const wire_i: number = this.navPlineToWire(index);
//             return this.navAnyToEdge(EEntType.WIRE, wire_i);
//         } else if (ent_type === EEntType.PGON) {
//             const wires_i: number[] = this.navPgonToWire(index);
//             const all_edges_i: number[] = [];
//             for (const wire_i of wires_i) {
//                 const edges_i: number[] = this.navWireToEdge(wire_i);
//                 for (const edge_i of edges_i) {
//                     all_edges_i.push(edge_i);
//                 }
//             }
//             return all_edges_i;
//         } else if (ent_type === EEntType.COLL) {
//             const all_edges_i: number[] = [];
//             const plines_i: number[] = this.navCollToPline(index);
//             for (const pline_i of plines_i) {
//                 const edges_i: number[] = this.navAnyToEdge(EEntType.PLINE, pline_i);
//                 for (const edge_i of edges_i) {
//                     all_edges_i.push(edge_i);
//                 }
//             }
//             const pgons_i: number[] = this.navCollToPgon(index);
//             for (const pgon_i of pgons_i) {
//                 const edges_i: number[] = this.navAnyToEdge(EEntType.PGON, pgon_i);
//                 for (const edge_i of edges_i) {
//                     all_edges_i.push(edge_i);
//                 }
//             }
//             return all_edges_i;
//         }
//         throw new Error('Bad navigation in geometry data structure: ' + ent_type + index);
//     }
//     /**
//      * Navigate from any level to the vertices
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToVert(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.POSI) {
//             return this.navPosiToVert(index);
//         } else if (ent_type === EEntType.VERT) {
//             return [index];
//         } else if (ent_type === EEntType.EDGE) {
//             return this.navEdgeToVert(index);
//         } else if (ent_type === EEntType.WIRE) {
//             return this.modeldata.geom.query.getWireVerts(index); // avoids duplicate verts
//         } else if (ent_type === EEntType.POINT) {
//             return  [this.navPointToVert(index)];
//         } else if (ent_type === EEntType.PLINE) {
//             const wire_i: number = this.navPlineToWire(index);
//             return this.navAnyToVert(EEntType.WIRE, wire_i);
//         } else if (ent_type === EEntType.PGON) {
//             const wires_i: number[] = this.navPgonToWire(index);
//             const verts_i: number[] = [];
//             for (const wire_i of wires_i) {
//                 const wire_verts_i: number [] = this.modeldata.geom.query.getWireVerts(wire_i); // avoids duplicate verts
//                 for (const vert_i of wire_verts_i) { verts_i.push(vert_i); }
//             }
//             return verts_i;
//         } else if (ent_type === EEntType.COLL) {
//             const all_verts_i: number[] = [];
//             const points_i: number[] = this.navCollToPoint(index);
//             for (const point_i of points_i) {
//                 const vert_i: number = this.navPointToVert(point_i);
//                 all_verts_i.push(vert_i);
//             }
//             const plines_i: number[] = this.navCollToPline(index);
//             for (const pline_i of plines_i) {
//                 const verts_i: number[] = this.navAnyToVert(EEntType.PLINE, pline_i);
//                 for (const vert_i of verts_i) {
//                     all_verts_i.push(vert_i);
//                 }
//             }
//             const pgons_i: number[] = this.navCollToPgon(index);
//             for (const pgon_i of pgons_i) {
//                 const verts_i: number[] = this.navAnyToVert(EEntType.PGON, pgon_i);
//                 for (const vert_i of verts_i) {
//                     all_verts_i.push(vert_i);
//                 }
//             }
//             return all_verts_i;
//         }
//         throw new Error('Bad navigation in geometry data structure: ' + ent_type + index);
//     }
//     /**
//      * Navigate from any level to the positions
//      * @param ent_type
//      * @param index
//      */
//     public navAnyToPosi(ent_type: EEntType, index: number): number[] {
//         if (ent_type === EEntType.POSI) { return [index]; }
//         const verts_i: number[] = this.navAnyToVert(ent_type, index);
//         const posis_i: number[] = verts_i.map(vert_i => this.navVertToPosi(vert_i));
//         return Array.from(new Set(posis_i)); // remove duplicates
//     }
//     // ============================================================================
//     // Navigate from any to any, general method
//     // ============================================================================
//     /**
//      * Navigate from any level down to the positions
//      * @param index
//      */
//     public navAnyToAny(from_ets: EEntType, to_ets: EEntType, index: number): number[] {
//         // check if this is nav coll to coll
//         // for coll to coll, we assume we are going down, from parent to children
//         if (from_ets === EEntType.COLL && to_ets === EEntType.COLL) {
//             return this.navCollToCollChildren(index);
//         }
//         // same level
//         if (from_ets === to_ets) { return [index]; }
//         // from -> to
//         switch (to_ets) {
//             case EEntType.POSI:
//                 return this.navAnyToPosi(from_ets, index);
//             case EEntType.VERT:
//                 return this.navAnyToVert(from_ets, index);
//             case EEntType.EDGE:
//                 return this.navAnyToEdge(from_ets, index);
//             case EEntType.WIRE:
//                 return this.navAnyToWire(from_ets, index);
//             case EEntType.POINT:
//                 return this.navAnyToPoint(from_ets, index);
//             case EEntType.PLINE:
//                 return this.navAnyToPline(from_ets, index);
//             case EEntType.PGON:
//                 return this.navAnyToPgon(from_ets, index);
//             case EEntType.COLL:
//                 return this.navAnyToColl(from_ets, index);
//             default:
//                 throw new Error('Bad navigation in geometry data structure: ' + to_ets + index);
//         }
//     }
// }


