import { vecCross, vecDiv, vecFromTo } from '@assets/libs/geom/vectors';
import { EAttribNames, EEntType, EEntTypeStr, IEntSets, IGeomMaps, ISnapshotData, TEntTypeIdx, Txyz } from '../common';
import { mapSetMerge } from '../common_func';
import { GIModelData } from '../GIModelData';

/**
 * Class for modifying plines.
 */
export class GIGeomSnapshot {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    // ss_data -> ssid -> data for one snapshot
    private ss_data: Map<number, ISnapshotData> = new Map();
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Snapshot
    // ============================================================================
    /**
     *
     * @param id Starts a new snapshot with the given ID.
     * @param include
     */
    public addSnapshot(ssid: number, include?: number[]): void {
        const data: ISnapshotData = {
            ps: null, pt: null, pl: null, pg: null, co: null,
            pt_co: null, pl_co: null, pg_co: null,
            co_pt: null, co_pl: null, co_pg: null, co_ch: null, co_pa: null
        };
        // set the data
        this.ss_data.set( ssid, data );
        // create an empty snapshot
        data.ps = new Set();
        data.pt = new Set();
        data.pl = new Set();
        data.pg = new Set();
        data.co = new Set();
        // obj -> coll
        data.pt_co = new Map();
        data.pl_co = new Map();
        data.pg_co = new Map();
        // coll -> obj
        data.co_pt = new Map();
        data.co_pl = new Map();
        data.co_pg = new Map();
        // coll data
        data.co_ch = new Map();
        data.co_pa = new Map();
        // add subsequent ssids to the new snapshot
        if (include === undefined) { return; }
        for ( const exist_ssid of include ) {
            if (!this.ss_data.has(exist_ssid)) {
                throw new Error('The snapshot ID ' + exist_ssid + ' does not exist.');
            }
            this.ss_data.get(exist_ssid).ps.forEach ( posi_i => data.ps.add(posi_i) );
            this.ss_data.get(exist_ssid).pt.forEach ( point_i => data.pt.add(point_i) );
            this.ss_data.get(exist_ssid).pl.forEach ( pline_i => data.pl.add(pline_i) );
            this.ss_data.get(exist_ssid).pg.forEach ( pgon_i => data.pg.add(pgon_i) );
            this.ss_data.get(exist_ssid).co.forEach ( coll_i => data.co.add(coll_i) );
            // point -> colls
            mapSetMerge(this.ss_data.get(exist_ssid).pt_co, data.pt_co);
            // pline -> colls
            mapSetMerge(this.ss_data.get(exist_ssid).pl_co, data.pl_co);
            // pgon -> colls
            mapSetMerge(this.ss_data.get(exist_ssid).pg_co, data.pg_co);
            // coll -> points
            mapSetMerge(this.ss_data.get(exist_ssid).co_pt, data.co_pt);
            // coll -> plines
            mapSetMerge(this.ss_data.get(exist_ssid).co_pl, data.co_pl);
            // coll -> pgons
            mapSetMerge(this.ss_data.get(exist_ssid).co_pg, data.co_pg);
            // coll -> children
            mapSetMerge(this.ss_data.get(exist_ssid).co_ch, data.co_ch);
            // coll -> parent (check for conflict)
            this.ss_data.get(exist_ssid).co_pa.forEach ( (parent_i, coll_i) => {
                if (data.co_pa.has(coll_i)) {
                    if (data.co_pa.get(coll_i) !== parent_i) {
                        throw new Error('Error merging collection data');
                    }
                } else {
                    data.co_pa.set(coll_i, parent_i);
                }
            });
        }
    }
    /**
     * Delete a snapshot.
     * @param ssid Snapshot ID.
     */
    public delSnapshot(ssid: number): void {
        this.ss_data.delete( ssid );
    }
    // ============================================================================
    // Add
    // ============================================================================
    /**
     * Adds the ents to the active snapshot.
     * Called when executing a global function.
     * @param ent_type
     */
    public copyEntsToActiveSnapshot(from_ssid: number, ents: TEntTypeIdx[]): void {
        const from_data: ISnapshotData = this.ss_data.get(from_ssid);
        const to_data: ISnapshotData = this.ss_data.get(this.modeldata.active_ssid);
        const set_colls_i: Set<number> =  new Set();
        for (const [ent_type, ent_i] of ents) {
            if (ent_type === EEntType.POSI || ent_type >= EEntType.POINT) {
                to_data[EEntTypeStr[ent_type]].add(ent_i);
                // handle collections
                if (ent_type === EEntType.COLL) {
                    set_colls_i.add(ent_i);
                    // point -> colls
                    mapSetMerge(from_data.pt_co, to_data.pt_co, from_data.co_pt.get(ent_i));
                    // pline -> colls
                    mapSetMerge(from_data.pl_co, to_data.pl_co, from_data.co_pl.get(ent_i));
                    // pgon -> colls
                    mapSetMerge(from_data.pg_co, to_data.pg_co, from_data.co_pg.get(ent_i));
                    // coll -> points
                    mapSetMerge(from_data.co_pt, to_data.co_pt, [ent_i]);
                    // coll -> plines
                    mapSetMerge(from_data.co_pl, to_data.co_pl, [ent_i]);
                    // coll -> pgons
                    mapSetMerge(from_data.co_pg, to_data.co_pg, [ent_i]);
                    // coll -> children
                    mapSetMerge(from_data.co_ch, to_data.co_ch, [ent_i]);
                }
            } else {
                throw new Error('Adding entity to snapshot: invalid entity type.');
            }
        }
        // hadle collection parents
        // make sure only to allow parent collections that actually exist
        set_colls_i.forEach( coll_i => {
            // check if the collection has a parent
            if (from_data.co_pa.has(coll_i)) {
                const parent_coll_i: number = from_data.co_pa.get(coll_i);
                // check if parent exists
                if (set_colls_i.has(parent_coll_i)) {
                    to_data.co_pa.set(coll_i, parent_coll_i);
                }
            }
        });
    }
    /**
     * Add a new ent.
     * If the ent is a collection, then it is assumed that this is a new empty collection.
     * @param ent_type
     * @param ent_i
     */
    public addNewEnt(ssid: number, ent_type: EEntType, ent_i: number): void {
        const to_data: ISnapshotData = this.ss_data.get(ssid);
        if (ent_type === EEntType.POSI || ent_type >= EEntType.POINT) {
            to_data[EEntTypeStr[ent_type]].add(ent_i);
            // handle collections
            if (ent_type === EEntType.COLL) {
                // coll -> obj and children
                to_data.co_pt.set(ent_i, new Set());
                to_data.co_pl.set(ent_i, new Set());
                to_data.co_pg.set(ent_i, new Set());
                to_data.co_ch.set(ent_i, new Set());
            }
        } else {
            throw new Error('Adding new entity to snapshot: invalid entity type.');
        }
    }
    // ============================================================================
    // Query
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    public hasEnt(ssid: number, ent_type: EEntType, ent_i: number): boolean {
        switch (ent_type) {
            case EEntType.POSI:
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
            case EEntType.COLL:
                const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
                return ent_set.has(ent_i);
            case EEntType.VERT:
            case EEntType.EDGE:
            case EEntType.WIRE:
                if (!this.modeldata.geom.query.entExists(ent_type, ent_i)) { return false; }
                const [obj_ent_type, obj_ent_i]: TEntTypeIdx = this.modeldata.geom.query.getTopoObj(ent_type, ent_i);
                return this.hasEnt(ssid, obj_ent_type, obj_ent_i);
            default:
                throw new Error('Entity type not recognised.');
        }
    }
    /**
     * Takes in a list of ents and filters out ents that do no exist in the snapshot specified by SSID.
     * Used by nav any to any
     *
     * @param ent_type
     * @param ents_i
     */
    public filterEnts(ssid: number, ent_type: EEntType, ents_i: number[]): number[] {
        switch (ent_type) {
            case EEntType.POSI:
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
            case EEntType.COLL:
                const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
                return Array.from(ents_i.filter( ent_i => ent_set.has(ent_i) ));
            case EEntType.VERT:
            case EEntType.EDGE:
            case EEntType.WIRE:
                return Array.from(ents_i.filter( ent_i => this.hasEnt(ssid, ent_type, ent_i) ));
            default:
                throw new Error('Entity type not recognised.');
        }
    }
    // ============================================================================
    // Get
    // ============================================================================
    /**
     *
     * @param ent_type
     */
    public numEnts(ssid: number, ent_type: EEntType): number {
        switch (ent_type) {
            case EEntType.POSI:
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
            case EEntType.COLL:
                const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
                return ent_set.size;
            default:
                return this.getEnts(ssid, ent_type).length;
        }
    }
    /**
     *
     * @param ent_type
     */
    public getAllEntSets(ssid: number): IEntSets {
        const ent_sets: IEntSets = {
            ps: this.ss_data.get(ssid).ps,
            pt: this.ss_data.get(ssid).pt,
            pl: this.ss_data.get(ssid).pl,
            pg: this.ss_data.get(ssid).pg,
            co: this.ss_data.get(ssid).co,
        };
        return ent_sets;
    }
    /**
     * Get an array of all the ents in a snapshot.
     * @param ssid
     */
    public getAllEnts(ssid: number): TEntTypeIdx[] {
        const ents: TEntTypeIdx[] = [];
        this.ss_data.get(ssid).ps.forEach( posi_i => ents.push([EEntType.POSI, posi_i]) );
        this.ss_data.get(ssid).pt.forEach( point_i => ents.push([EEntType.POINT, point_i]) );
        this.ss_data.get(ssid).pl.forEach( pline_i => ents.push([EEntType.PLINE, pline_i]) );
        this.ss_data.get(ssid).pg.forEach( pgon_i => ents.push([EEntType.PGON, pgon_i]) );
        this.ss_data.get(ssid).co.forEach( coll_i => ents.push([EEntType.COLL, coll_i]) );
        return ents;
    }
    /**
     *
     * @param ent_type
     */
    public getEnts(ssid: number, ent_type: EEntType): number[] {
        switch (ent_type) {
            case EEntType.POSI:
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
            case EEntType.COLL:
                const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
                return Array.from(ent_set);
            default:
                if (ent_type === EEntType.VERT) {
                    const verts_i: number[] = [];
                    for (const point_i of this.ss_data.get(ssid).pt) {
                        verts_i.push(this.modeldata.geom.nav.navPointToVert(point_i));
                    }
                    for (const pline_i of this.ss_data.get(ssid).pl) {
                        for (const vert_i of this.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i)) {
                            verts_i.push(vert_i);
                        }
                    }
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const vert_i of this.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i)) {
                            verts_i.push(vert_i);
                        }
                    }
                    return verts_i;
                } else if (ent_type === EEntType.EDGE) {
                    const edges_i: number[] = [];
                    for (const pline_i of this.ss_data.get(ssid).pl) {
                        for (const edge_i of this.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i)) {
                            edges_i.push(edge_i);
                        }
                    }
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const edge_i of this.modeldata.geom.nav.navAnyToEdge(EEntType.PGON, pgon_i)) {
                            edges_i.push(edge_i);
                        }
                    }
                    return edges_i;
                } else if (ent_type === EEntType.WIRE) {
                    const wires_i: number[] = [];
                    for (const pline_i of this.ss_data.get(ssid).pl) {
                        wires_i.push(this.modeldata.geom.nav.navPlineToWire(pline_i));
                    }
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const wire_i of this.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i)) {
                            wires_i.push(wire_i);
                        }
                    }
                    return wires_i;
                }  else if (ent_type === EEntType.TRI) {
                    const tris_i: number[] = [];
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const tri_i of this.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
                            tris_i.push(tri_i);
                        }
                    }
                    return tris_i;
                }
                throw new Error(
                    'Entity type not recognised: "' + ent_type + '".' +
                    'Valid entity types are: "ps", "_v", "_e", "_w", "pt", "pl", "pg" and "co".'
                );
        }
    }
    /**
     * Get the sub ents as a list
     * @param ents
     */
    public getSubEnts(ents_sets: IEntSets): TEntTypeIdx[] {
        const ents_arr: TEntTypeIdx[] = [];
        ents_sets.ps.forEach( posi_i => ents_arr.push([EEntType.POSI, posi_i]) );
        ents_sets.obj_ps.forEach( posi_i => ents_arr.push([EEntType.POSI, posi_i]) );
        ents_sets.pt.forEach( point_i => ents_arr.push([EEntType.POINT, point_i]) );
        ents_sets.pl.forEach( pline_i => ents_arr.push([EEntType.PLINE, pline_i]) );
        ents_sets.pg.forEach( pgon_i => ents_arr.push([EEntType.PGON, pgon_i]) );
        ents_sets.co.forEach( coll_i => ents_arr.push([EEntType.COLL, coll_i]) );
        if (ents_sets.hasOwnProperty('_v')) { ents_sets._v.forEach(vert_i => ents_arr.push([EEntType.VERT, vert_i])); }
        if (ents_sets.hasOwnProperty('_e')) { ents_sets._e.forEach(vert_i => ents_arr.push([EEntType.EDGE, vert_i])); }
        if (ents_sets.hasOwnProperty('_w')) { ents_sets._w.forEach(vert_i => ents_arr.push([EEntType.WIRE, vert_i])); }
        return ents_arr;
    }
    /**
     * Returns sets of unique entity indexes, given an array of TEntTypeIdx.
     * ~
     * Used for deleting all entities and for adding global function entities to a snapshot.
     */
    public getSubEntsSets(ssid: number, ents: TEntTypeIdx[]): IEntSets {
        const ent_sets: IEntSets = {
            ps: new Set(),
            obj_ps: new Set(),
            pt: new Set(),
            pl: new Set(),
            pg: new Set(),
            co: new Set()
        };
        // process all the ents, but not posis of the ents, we will do that at the end
        for (const ent_arr of ents) {
            const [ent_type, ent_i]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            if (ent_type === EEntType.COLL) {
                // get the descendants of this collection
                const coll_and_desc_i: number[] = this.modeldata.geom.nav_snapshot.navCollToCollDescendents(ssid, ent_i);
                coll_and_desc_i.splice(0, 0, ent_i); //  add parent coll to start of list
                // get all the objs
                for (const one_coll_i of coll_and_desc_i) {
                    for (const point_i of this.modeldata.geom.snapshot.getCollPoints(ssid, one_coll_i)) {
                        ent_sets.pt.add(point_i);
                    }
                    for (const pline_i of this.modeldata.geom.snapshot.getCollPlines(ssid, one_coll_i)) {
                        ent_sets.pl.add(pline_i);
                    }
                    for (const pgon_i of this.modeldata.geom.snapshot.getCollPgons(ssid, one_coll_i)) {
                        ent_sets.pg.add(pgon_i);
                    }
                    ent_sets.co.add(one_coll_i);
                }
            } else if (ent_type === EEntType.PGON) {
                ent_sets.pg.add(ent_i);
            } else if (ent_type === EEntType.PLINE) {
                ent_sets.pl.add(ent_i);
            } else if (ent_type === EEntType.POINT) {
                ent_sets.pt.add(ent_i);
            } else if (ent_type === EEntType.POSI) {
                ent_sets.ps.add(ent_i);
            }
        }
        // now get all the posis of the objs and add them to the list
        ent_sets.pt.forEach( point_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, point_i);
            posis_i.forEach( posi_i => {
                ent_sets.obj_ps.add(posi_i);
            });
        });
        ent_sets.pl.forEach( pline_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            posis_i.forEach( posi_i => {
                ent_sets.obj_ps.add(posi_i);
            });
        });
        ent_sets.pg.forEach( pgon_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            posis_i.forEach( posi_i => {
                ent_sets.obj_ps.add(posi_i);
            });
        });
        // return the result
        return ent_sets;
    }
    /**
     *
     * @param ent_sets
     */
    public addTopoToSubEntsSets(ent_sets: IEntSets): void {
        ent_sets._v = new Set();
        ent_sets._e = new Set();
        ent_sets._w = new Set();
        ent_sets._t = new Set();
        ent_sets.pt.forEach( point_i => {
            ent_sets._v.add(this.modeldata.geom.nav.navPointToVert(point_i) );
        });
        ent_sets.pl.forEach( pline_i => {
            const wire_i: number = this.modeldata.geom.nav.navPlineToWire(pline_i);
            const edges_i: number[] = this.modeldata.geom.nav.navWireToEdge(wire_i);
            const verts_i: number[] = this.modeldata.geom.query.getWireVerts(wire_i);
            ent_sets._w.add(wire_i);
            edges_i.forEach( edge_i => ent_sets._e.add(edge_i) );
            verts_i.forEach( vert_i => ent_sets._v.add(vert_i) );
        });
        ent_sets.pg.forEach( pgon_i => {
            const wires_i: number[] = this.modeldata.geom.nav.navPgonToWire(pgon_i);
            wires_i.forEach( wire_i => {
                ent_sets._w.add(wire_i);
                const edges_i: number[] = this.modeldata.geom.nav.navWireToEdge(wire_i);
                const verts_i: number[] = this.modeldata.geom.query.getWireVerts(wire_i);
                edges_i.forEach( edge_i => ent_sets._e.add(edge_i) );
                verts_i.forEach( vert_i => ent_sets._v.add(vert_i) );
            });
            const tris_i: number[] = this.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
            tris_i.forEach( tri_i => ent_sets._t.add(tri_i) );
        });
    }
    // ============================================================================
    // Delete geometry locally
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    public delAllEnts(ssid: number): void {
        this.ss_data.get(ssid).ps.clear();
        this.ss_data.get(ssid).pt.clear();
        this.ss_data.get(ssid).pl.clear();
        this.ss_data.get(ssid).pg.clear();
        this.ss_data.get(ssid).co.clear();
        this.ss_data.get(ssid).co_pt.clear();
        this.ss_data.get(ssid).co_pl.clear();
        this.ss_data.get(ssid).co_pg.clear();
        this.ss_data.get(ssid).co_ch.clear();
        this.ss_data.get(ssid).co_pa.clear();
    }
     /**
     * Delete ents
     * @param ent_sets
     */
    public delEntSets(ssid: number, ent_sets: IEntSets): void {
        this.delColls(ssid, Array.from(ent_sets.co));
        this.delPgons(ssid, Array.from(ent_sets.pg));
        this.delPlines(ssid, Array.from(ent_sets.pl));
        this.delPoints(ssid, Array.from(ent_sets.pt));
        this.delPosis(ssid, Array.from(ent_sets.ps));
        this.delUnusedPosis(ssid, Array.from(ent_sets.obj_ps));
    }
    /**
     * Invert ent sets
     * @param ent_sets
     */
    public invertEntSets(ssid: number, ent_sets: IEntSets): void {
        ent_sets.co = this._invertSet(this.ss_data.get(ssid).co, ent_sets.co);
        ent_sets.pg = this._invertSet(this.ss_data.get(ssid).pg, ent_sets.pg);
        ent_sets.pl = this._invertSet(this.ss_data.get(ssid).pl, ent_sets.pl);
        ent_sets.pt = this._invertSet(this.ss_data.get(ssid).pt, ent_sets.pt);
        // go through the posis
        // we get the inverse of the untion of ps and obj_ps
        // for this inverse set, we then sort into those that are used and those that are unused
        const new_set_ps: Set<number> = new Set();
        const new_set_obj_ps: Set<number> = new Set();
        for (const posi_i of this.ss_data.get(ssid).ps) {
            if (ent_sets.obj_ps.has(posi_i) || ent_sets.ps.has(posi_i)) {
                continue;
            }
            if (this.isPosiUnused(ssid, posi_i)) {
                new_set_ps.add(posi_i);
            } else {
                new_set_obj_ps.add(posi_i);
            }
        }
        ent_sets.ps = new_set_ps;
        ent_sets.obj_ps = new_set_obj_ps;
    }
    /**
     * Del unused posis, i.e posis that are not linked to any vertices.
     * @param posis_i
     */
    public delUnusedPosis(ssid: number, posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        // loop
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            if ( this.isPosiUnused(ssid, posi_i) ) { // only delete posis with no verts
                this.ss_data.get(ssid).ps.delete(posi_i);
            }
        }
    }
    /**
     * Del posis.
     * This will delete any geometry connected to these posis, starting with the vertices
     * and working up the hierarchy.
     * @param posis_i
     */
    public delPosis(ssid: number, posis_i: number|number[]): void {
        // make array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // delete the posis
        for (const posi_i of posis_i) {
            this.ss_data.get(ssid).ps.delete(posi_i);
        }
        // get all verts and sort them
        const points_i: number[] = [];
        const plines_verts: Map<number, number[]> = new Map();
        const pgons_verts: Map<number, number[]> = new Map();
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            for (const vert_i of this._geom_maps.up_posis_verts.get(posi_i)) {
                if (this._geom_maps.up_verts_points.has(vert_i)) {
                    points_i.push(this._geom_maps.up_verts_points.get(vert_i));
                } else {
                    // not we cannot check trianges, some pgons have no triangles
                    const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
                    const wire_i: number = this._geom_maps.up_edges_wires.get(edges_i[0]);
                    if (this._geom_maps.up_wires_pgons.has(wire_i)) {
                        const pgon_i: number = this.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i)[0];
                        if (pgons_verts.has(pgon_i)) {
                            pgons_verts.get(pgon_i).push(vert_i);
                        } else {
                            pgons_verts.set(pgon_i, [vert_i]);
                        }
                    } else {
                        const pline_i: number = this.modeldata.geom.nav.navAnyToPline(EEntType.VERT, vert_i)[0];
                        if (plines_verts.has(pline_i)) {
                            plines_verts.get(pline_i).push(vert_i);
                        } else {
                            plines_verts.set(pline_i, [vert_i]);
                        }
                    }
                }
            }
        }
        // delete point vertices
        for (const point_i of points_i) {
            this.ss_data.get(ssid).pt.delete(point_i);
        }
        // delete pline vertices
        plines_verts.forEach( (verts_i, pline_i) => {
            this.modeldata.geom.del_vert.delPlineVerts(pline_i, verts_i);
        });
        // delete pgon vertices
        pgons_verts.forEach( (verts_i, pgon_i) => {
            this.modeldata.geom.del_vert.delPgonVerts(pgon_i, verts_i);
        });
    }
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    public delPoints(ssid: number, points_i: number|number[]): void {
        // make array
        points_i = (Array.isArray(points_i)) ? points_i : [points_i];
        if (points_i.length === 0) { return; }
        // delete the points
        for (const point_i of points_i) {
            this.ss_data.get(ssid).pt.delete(point_i);
            // remove the points from any collections
            const set_colls_i: Set<number> = this.ss_data.get(ssid).pt_co.get(point_i);
            if (set_colls_i !== undefined) {
                set_colls_i.forEach( coll_i => this.ss_data.get(ssid).co_pt.get(coll_i).delete(point_i) );
            }
        }
    }
    /**
     * Del plines.
     * @param plines_i
     */
    public delPlines(ssid: number, plines_i: number|number[]): void {
        // make array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        if (plines_i.length === 0) { return; }
        // delete the plines
        for (const pline_i of plines_i) {
            this.ss_data.get(ssid).pl.delete(pline_i);
            // remove the plines from any collections
            const set_colls_i: Set<number> = this.ss_data.get(ssid).pl_co.get(pline_i);
            if (set_colls_i !== undefined) {
                set_colls_i.forEach( coll_i => this.ss_data.get(ssid).co_pl.get(coll_i).delete(pline_i) );
            }
        }
    }
    /**
     * Del pgons.
     * @param pgons_i
     */
    public delPgons(ssid: number, pgons_i: number|number[], invert = false): void {
        // make array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        if (pgons_i.length === 0) { return; }
        // delete the pgons
        for (const pgon_i of pgons_i) {
            this.ss_data.get(ssid).pg.delete(pgon_i);
            // remove the pgons from any collections
            const set_colls_i: Set<number> = this.ss_data.get(ssid).pg_co.get(pgon_i);
            if (set_colls_i !== undefined) {
                set_colls_i.forEach( coll_i => this.ss_data.get(ssid).co_pg.get(coll_i).delete(pgon_i) );
            }
        }
    }
    /**
     * Delete a collection.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    public delColls(ssid: number, colls_i: number|number[]): void {
        // make array
        colls_i = (Array.isArray(colls_i)) ? colls_i : [colls_i];
        if (colls_i.length === 0) { return; }
        // delete the colls
        for (const coll_i of colls_i) {
            // delete the coll
            this.ss_data.get(ssid).co.delete(coll_i);
            // remove the coll from points
            const set_points_i: Set<number> = this.ss_data.get(ssid).co_pt.get(coll_i);
            if (set_points_i !== undefined) {
                set_points_i.forEach( point_i => this.ss_data.get(ssid).pt_co.get(point_i).delete(coll_i) );
            }
            // remove the coll from plines
            const set_plines_i: Set<number> = this.ss_data.get(ssid).co_pl.get(coll_i);
            if (set_plines_i !== undefined) {
                set_plines_i.forEach( pline_i => this.ss_data.get(ssid).pl_co.get(pline_i).delete(coll_i) );
            }
            // remove the coll from pgons
            const set_pgons_i: Set<number> = this.ss_data.get(ssid).co_pg.get(coll_i);
            if (set_pgons_i !== undefined) {
                set_pgons_i.forEach( pgon_i => this.ss_data.get(ssid).pg_co.get(pgon_i).delete(coll_i) );
            }
            // remove the coll from children (the children no longer have this coll as a parent)
            const set_childs_i: Set<number> = this.ss_data.get(ssid).co_ch.get(coll_i);
            if (set_childs_i !== undefined) {
                set_childs_i.forEach( child_i => this.ss_data.get(ssid).co_pa.delete(child_i) );
            }
            // delete the other coll data
            this.ss_data.get(ssid).co_pt.delete(coll_i);
            this.ss_data.get(ssid).co_pl.delete(coll_i);
            this.ss_data.get(ssid).co_pg.delete(coll_i);
            this.ss_data.get(ssid).co_ch.delete(coll_i);
            this.ss_data.get(ssid).co_pa.delete(coll_i);
        }
    }
    // ============================================================================================
    // Get colls from entities
    // ============================================================================================
    /**
     * Get the collections of a point.
     * @param point_i
     */
    public getPointColls(ssid: number, point_i: number): number[] {
        if (this.ss_data.get(ssid).pt_co.has(point_i)) {
            return Array.from(this.ss_data.get(ssid).pt_co.get(point_i));
        }
        return [];
    }
    /**
     * Get the collections of a pline.
     * @param pline_i
     */
    public getPlineColls(ssid: number, pline_i: number): number[] {
        if (this.ss_data.get(ssid).pl_co.has(pline_i)) {
            return Array.from(this.ss_data.get(ssid).pl_co.get(pline_i));
        }
        return [];
    }
    /**
     * Get the collections of a pgon
     * @param pgon_i
     */
    public getPgonColls(ssid: number, pgon_i: number): number[] {
        if (this.ss_data.get(ssid).pg_co.has(pgon_i)) {
            return Array.from(this.ss_data.get(ssid).pg_co.get(pgon_i));
        }
        return [];
    }
    // ============================================================================================
    // Get entities from colls
    // ============================================================================================
    /**
     * Get the points of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollPoints(ssid: number, coll_i: number): number[] {
        if (this.ss_data.get(ssid).co_pt.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_pt.get(coll_i));
        }
        return [];
    }
    /**
     * Get the plines of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollPlines(ssid: number, coll_i: number): number[] {
        if ( this.ss_data.get(ssid).co_pl.has(coll_i)) {
            return Array.from( this.ss_data.get(ssid).co_pl.get(coll_i));
        }
        return [];
    }
    /**
     * Get the pgons of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollPgons(ssid: number, coll_i: number): number[] {
        if (this.ss_data.get(ssid).co_pg.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_pg.get(coll_i));
        }
        return [];
    }
    /**
     * Get the children collections of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    public getCollChildren(ssid: number, coll_i: number): number[] {
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_ch.get(coll_i));
        }
        return [];
    }
    /**
     * Get the parent.
     * Undefined if there is no parent.
     * @param coll_i
     */
    public getCollParent(ssid: number, coll_i: number): number {
        return this.ss_data.get(ssid).co_pa.get(coll_i);
    }
    // ============================================================================================
    // Set parent
    // ============================================================================================
    /**
     * Set the parent for a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The index of the parent collection
     */
    public setCollParent(ssid: number, coll_i: number, parent_coll_i: number): void {
        // child -> parent
        this.ss_data.get(ssid).co_pa.set(coll_i, parent_coll_i);
        // parent -> child
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            this.ss_data.get(ssid).co_ch.get(parent_coll_i).add(coll_i);
        } else {
            this.ss_data.get(ssid).co_ch.set(parent_coll_i, new Set( [coll_i] ) );
        }
    }
    // ============================================================================================
    // Add entities in colls
    // ============================================================================================
    /**
     * Set the points in a collection
     * @param coll_i The index of the collection
     * @param points_i
     */
    public addCollPoints(ssid: number, coll_i: number, points_i: number|number[]): void {
        points_i = Array.isArray(points_i) ? points_i : [points_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pt.has(coll_i)) {
            const set_points_i: Set<number> = this.ss_data.get(ssid).co_pt.get(coll_i);
            points_i.forEach( point_i => set_points_i.add(point_i) );
        } else {
            this.ss_data.get(ssid).co_pt.set(coll_i, new Set(points_i));
        }
        // obj up to coll
        for (const point_i of points_i) {
            if (this.ss_data.get(ssid).pt_co.has(point_i)) {
                this.ss_data.get(ssid).pt_co.get(point_i).add(coll_i);
            } else {
                this.ss_data.get(ssid).pt_co.set(point_i, new Set([coll_i]));
            }
        }
    }
    /**
     * Set the plines in a collection
     * @param coll_i The index of the collection
     * @param plines_i
     */
    public addCollPlines(ssid: number, coll_i: number, plines_i: number|number[]): void {
        plines_i = Array.isArray(plines_i) ? plines_i : [plines_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pl.has(coll_i)) {
            const set_plines_i: Set<number> = this.ss_data.get(ssid).co_pl.get(coll_i);
            plines_i.forEach( pline_i => set_plines_i.add(pline_i) );
        } else {
            this.ss_data.get(ssid).co_pl.set(coll_i, new Set(plines_i));
        }
        // obj up to coll
        for (const pline_i of plines_i) {
            if (this.ss_data.get(ssid).pl_co.has(pline_i)) {
                this.ss_data.get(ssid).pl_co.get(pline_i).add(coll_i);
            } else {
                this.ss_data.get(ssid).pl_co.set(pline_i, new Set([coll_i]));
            }
        }
    }
    /**
     * Set the pgons in a collection
     * @param coll_i The index of the collection
     * @param pgons_i
     */
    public addCollPgons(ssid: number, coll_i: number, pgons_i: number|number[]): void {
        pgons_i = Array.isArray(pgons_i) ? pgons_i : [pgons_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pg.has(coll_i)) {
            const set_pgons_i: Set<number> = this.ss_data.get(ssid).co_pg.get(coll_i);
            pgons_i.forEach( pgon_i => set_pgons_i.add(pgon_i) );
        } else {
            this.ss_data.get(ssid).co_pg.set(coll_i, new Set(pgons_i));
        }
        // obj up to coll
        for (const pgon_i of pgons_i) {
            if (this.ss_data.get(ssid).pg_co.has(pgon_i)) {
                this.ss_data.get(ssid).pg_co.get(pgon_i).add(coll_i);
            } else {
                this.ss_data.get(ssid).pg_co.set(pgon_i, new Set([coll_i]));
            }
        }
    }
    /**
     * Set the child collections in a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The indicies of the child collections
     */
    public addCollChildren(ssid: number, coll_i: number, childs_i: number|number[]): void {
        childs_i = Array.isArray(childs_i) ? childs_i : [childs_i];
        // coll down to children
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            const set_childs_i: Set<number> = this.ss_data.get(ssid).co_ch.get(coll_i);
            childs_i.forEach( child_i => set_childs_i.add(child_i) );
        } else {
            this.ss_data.get(ssid).co_ch.set(coll_i, new Set(childs_i));
        }
        // children up to coll
        for (const child_i of childs_i) {
            this.ss_data.get(ssid).co_pa.set(child_i, coll_i);
        }
    }
    // ============================================================================================
    // Remove entities in colls
    // ============================================================================================
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param points_i
     */
    public remCollPoints(ssid: number, coll_i: number, points_i: number|number[]): void {
        points_i = Array.isArray(points_i) ? points_i : [points_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pt.has(coll_i)) {
            const set_points_i: Set<number> = this.ss_data.get(ssid).co_pt.get(coll_i);
            for (const point_i of points_i) {
                set_points_i.delete(point_i);
                // obj up to coll
                this.ss_data.get(ssid).pg_co.get(point_i).delete(coll_i);
            }
        }
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param plines_i
     */
    public remCollPlines(ssid: number, coll_i: number, plines_i: number[]): void {
        plines_i = Array.isArray(plines_i) ? plines_i : [plines_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pl.has(coll_i)) {
            const set_plines_i: Set<number> = this.ss_data.get(ssid).co_pl.get(coll_i);
            for (const pline_i of plines_i) {
                set_plines_i.delete(pline_i);
                // obj up to coll
                this.ss_data.get(ssid).pl_co.get(pline_i).delete(coll_i);
            }
        }
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param pgons_i
     */
    public remCollPgons(ssid: number, coll_i: number, pgons_i: number[]): void {
        pgons_i = Array.isArray(pgons_i) ? pgons_i : [pgons_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pg.has(coll_i)) {
            const set_pgons_i: Set<number> = this.ss_data.get(ssid).co_pg.get(coll_i);
            for (const pgon_i of pgons_i) {
                set_pgons_i.delete(pgon_i);
                // obj up to coll
                this.ss_data.get(ssid).pg_co.get(pgon_i).delete(coll_i);
            }
        }
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param child_colls_i
     */
    public remCollChildren(ssid: number, coll_i: number, childs_i: number[]): void {
        childs_i = Array.isArray(childs_i) ? childs_i : [childs_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            const set_childs_i: Set<number> = this.ss_data.get(ssid).co_ch.get(coll_i);
            for (const child_i of childs_i) {
                set_childs_i.delete(child_i);
                // obj up to coll
                this.ss_data.get(ssid).co_pa.delete(child_i);
            }
        }
    }
    // ============================================================================
    // Others
    // ============================================================================
    /**
     *
     * @param pgon_i
     */
    public getPgonNormal(ssid: number, pgon_i: number): Txyz {
        const normal: Txyz = [0, 0, 0];
        const tris_i: number[] = this.modeldata.geom._geom_maps.dn_pgons_tris.get(pgon_i);
        let count = 0;
        for (const tri_i of tris_i) {
            const posis_i: number[] = this._geom_maps.dn_tris_verts.get(tri_i).map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs: Txyz[] = posis_i.map(posi_i => this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(posi_i) as Txyz);
            const vec_a: Txyz = vecFromTo(xyzs[0], xyzs[1]);
            const vec_b: Txyz = vecFromTo(xyzs[0], xyzs[2]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                count += 1;
                normal[0] += tri_normal[0];
                normal[1] += tri_normal[1];
                normal[2] += tri_normal[2];
            }
        }
        if (count === 0) { return [0, 0, 0]; }
        return vecDiv(normal, count);
    }
    /**
     * Returns true if posis is used
     * @param point_i
     */
    public isPosiUnused(ssid: number, posi_i: number): boolean {
        const verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
        for (const vert_i of verts_i) {
            const [ent_type, ent_i]: TEntTypeIdx  = this.modeldata.geom.query.getTopoObj(EEntType.VERT, vert_i);
            if (this.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i)) {
                return false;
            }
        }
        return true;
    }
    // ============================================================================
    // Private
    // ============================================================================
    private _invertSet(ents_ss: Set<number>, selected: Set<number>): Set<number> {
        const inverted: Set<number> = new Set();
        const set_selected: Set<number> = new Set(selected);
        for (const ent_i of ents_ss) {
            if (!set_selected.has(ent_i)) {
                inverted.add(ent_i);
            }
        }
        return inverted;
    }
    // ============================================================================
    // Debug
    // ============================================================================
    public toStr(ssid: number): string {
        // data.pt_co = new Map();
        // data.pl_co = new Map();
        // data.pg_co = new Map();
        // // coll -> obj
        // data.co_pt = new Map();
        // data.co_pl = new Map();
        // data.co_pg = new Map();
        // // coll data
        // data.co_ch = new Map();
        // data.co_pa = new Map();
        return JSON.stringify([
            'posis', Array.from(this.ss_data.get(ssid).ps),
            'points', Array.from(this.ss_data.get(ssid).pt),
            'plines', Array.from(this.ss_data.get(ssid).pl),
            'pgons', Array.from(this.ss_data.get(ssid).pg),
            'colls', Array.from(this.ss_data.get(ssid).co),
            'pt_co', this._mapSetToStr(this.ss_data.get(ssid).pt_co),
            'pl_co', this._mapSetToStr(this.ss_data.get(ssid).pl_co),
            'pg_co', this._mapSetToStr(this.ss_data.get(ssid).pg_co),
            'co_pt', this._mapSetToStr(this.ss_data.get(ssid).co_pt),
            'co_pl', this._mapSetToStr(this.ss_data.get(ssid).co_pl),
            'co_pg', this._mapSetToStr(this.ss_data.get(ssid).co_pg),
            'co_ch', this._mapSetToStr(this.ss_data.get(ssid).co_ch),
        ]) + '\n';
    }
    private _mapSetToStr(map_set: Map<number, Set<number>>): string {
        let result = '{';
        map_set.forEach( (val_set, key) => {
            result = result + key + ':' + JSON.stringify(Array.from(val_set));
        });
        return result + '}';
    }
}
