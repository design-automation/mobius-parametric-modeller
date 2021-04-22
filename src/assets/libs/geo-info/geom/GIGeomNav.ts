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
        return this.modeldata.geom.nav_snapshot.navCollToPoint(ssid, coll_i);
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    public navCollToPline(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToPline(ssid, coll_i);
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    public navCollToPgon(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToPgon(ssid, coll_i);
    }
    /**
     * If none, returns []
     * @param coll_i
     */
    public navCollToCollChildren(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.snapshot.getCollChildren(ssid, coll_i); // coll children
    }
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    public navCollToCollDescendents(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToCollDescendents(ssid, coll_i);
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
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    public navCollToCollAncestors(coll_i: number): number[] {
        const ssid: number = this.modeldata.active_ssid;
        return this.modeldata.geom.nav_snapshot.navCollToCollAncestors(ssid, coll_i);
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
        if (ent_type === EEntType.EDGE) { return [ent_i]; }
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
        if (ent_type === EEntType.WIRE) { return [ent_i]; }
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
            for (const vert_i of this.navPosiToVert(ent_i)) {
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
        if (ent_type === EEntType.POINT) { return [ent_i]; }
        if (ent_type === EEntType.VERT) {
            const point_i: number = this._geom_maps.up_verts_points.get(ent_i);
            return point_i === undefined ? [] : [point_i];
        }
        if (ent_type === EEntType.POSI) {
            const points_i: number[] = [];
            for (const vert_i of this.navPosiToVert(ent_i)) {
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
        if (ent_type === EEntType.PLINE) { return [ent_i]; }
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
        if (ent_type === EEntType.PGON) { return [ent_i]; }
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
        if (ent_type === EEntType.COLL) { return [ent_i]; }
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
        if (ent_type === EEntType.WIRE) { return [ent_i]; }
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
        if (ent_type === EEntType.EDGE) { return [ent_i]; }
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
        if (ent_type === EEntType.VERT) { return [ent_i]; }
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
        if (ent_type === EEntType.POSI) { return [ent_i]; }
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

