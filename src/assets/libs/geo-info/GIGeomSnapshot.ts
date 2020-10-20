import { arrMakeFlat } from '../util/arrs';
import { EEntType, EEntTypeStr, IEntSets, IGeomMaps, ISnapshotData, TEntTypeIdx } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for modifying plines.
 */
export class GIGeomSnapshot {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    // ss_data -> ssid -> ps, pt, pl, pg, co
    private ss_data: Map<number, ISnapshotData> = new Map();
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
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
        const data: ISnapshotData = { ps: null, pt: null, pl: null, pg: null, co: null };
        this.ss_data.set( ssid, data );
        // merge data
        if (include === undefined || include.length === 0) {
            // create an empty snapshot
            data.ps = new Set();
            data.pt = new Set();
            data.pl = new Set();
            data.pg = new Set();
            data.co = new Set();
        } else {
            // add the first ssid to the new snapshot
            if (!this.ss_data.has(include[0])) {
                throw new Error('The snapshot ID ' + include[0] + ' does not exist.');
            }
            data.ps = new Set(this.ss_data.get(include[0]).ps);
            data.pt = new Set(this.ss_data.get(include[0]).pt);
            data.pl = new Set(this.ss_data.get(include[0]).pl);
            data.pg = new Set(this.ss_data.get(include[0]).pg);
            data.co = new Set(this.ss_data.get(include[0]).co);
            // add subsequent ssids to teh new snapshot
            for ( let i = 1; i < include.length; i++ ) {
                const exist_ssid: number = include[i];
                if (!this.ss_data.has(exist_ssid)) {
                    throw new Error('The snapshot ID ' + exist_ssid + ' does not exist.');
                }
                this.ss_data.get(exist_ssid).ps.forEach ( posi_i => data.ps.add(posi_i) );
                this.ss_data.get(exist_ssid).pt.forEach ( point_i => data.pt.add(point_i) );
                this.ss_data.get(exist_ssid).pl.forEach ( pline_i => data.pl.add(pline_i) );
                this.ss_data.get(exist_ssid).pg.forEach ( pgon_i => data.pg.add(pgon_i) );
                this.ss_data.get(exist_ssid).co.forEach ( coll_i => data.co.add(coll_i) );
            }
            // for (const exist_ssid of include[1:]) {
            //     if (!this.ss_data.has(exist_ssid)) {
            //         throw new Error('The snapshot ID ' + exist_ssid + ' does not exist.');
            //     }
            //     this.ss_data.get(exist_ssid).ps.forEach ( posi_i => data.ps.add(posi_i) );
            //     this.ss_data.get(exist_ssid).pt.forEach ( point_i => data.pt.add(point_i) );
            //     this.ss_data.get(exist_ssid).pl.forEach ( pline_i => data.pl.add(pline_i) );
            //     this.ss_data.get(exist_ssid).pg.forEach ( pgon_i => data.pg.add(pgon_i) );
            //     this.ss_data.get(exist_ssid).co.forEach ( coll_i => data.co.add(coll_i) );
            // }
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
    // Query Active
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    public hasEntActive(ent_type: EEntType, ent_i: number): boolean {
        return this.hasEnt(this._geom.modeldata.active_snapshot, ent_type, ent_i);
    }
    /**
     *
     * @param ent_type
     * @param ents_i
     */
    public filterEntsActive(ent_type: EEntType, ents_i: number[]): number[] {
        return this.filterEnts(this._geom.modeldata.active_snapshot, ent_type, ents_i);
    }
    /**
     *
     * @param ent_type
     */
    public getEntsActive(ent_type: EEntType): number[] {
        return this.getEnts(this._geom.modeldata.active_snapshot, ent_type);
    }
    /**
     *
     * @param ent_type
     */
    public numEntsActive(ent_type: EEntType): number {
        return this.numEnts(this._geom.modeldata.active_snapshot, ent_type);
    }
    // ============================================================================
    // Query Active
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
            case EEntType.FACE:
                if (!this._geom.query.entExists(ent_type, ent_i)) { return false; }
                const [obj_ent_type, obj_ent_i]: TEntTypeIdx = this._geom.query.getTopoObj(ent_type, ent_i);
                return this.hasEnt(ssid, obj_ent_type, obj_ent_i);
            default:
                throw new Error('Entity type not recognised.');
        }
    }
    /**
     * Used by nav any to any
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
            case EEntType.FACE:
                return Array.from(ents_i.filter( ent_i => this.hasEnt(ssid, ent_type, ent_i) ));
            default:
                throw new Error('Entity type not recognised.');
        }
    }
    /**
     *
     * @param ent_type
     */
    public getEntSets(ssid: number): IEntSets {
        const ent_sets: IEntSets = {
            ps: this.ss_data.get(ssid)[EEntTypeStr[EEntType.POSI]],
            pt: this.ss_data.get(ssid)[EEntTypeStr[EEntType.POINT]],
            pl: this.ss_data.get(ssid)[EEntTypeStr[EEntType.PLINE]],
            pg: this.ss_data.get(ssid)[EEntTypeStr[EEntType.PGON]],
            co: this.ss_data.get(ssid)[EEntTypeStr[EEntType.COLL]],
        };
        return ent_sets;
    }
    /**
     * Adds the ents to the active snapshot.
     * @param ent_type
     */
    public addEntsToActiveSnapshot(ents: TEntTypeIdx[]): void {
        for (const [ent_type, ent_i] of ents) {
            if (ent_type === EEntType.POSI || ent_type >= EEntType.POINT) {
                this.ss_data.get(this._geom.modeldata.active_snapshot)[EEntTypeStr[ent_type]].add(ent_i);
            }
        }
    }
    /**
     * Get an array of all the ents in a snapshot.
     * @param ssid
     */
    public getAllEnts(ssid: number): TEntTypeIdx[] {
        const ents: TEntTypeIdx[] = [];
        const posis_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[EEntType.POSI]];
        posis_set.forEach( posi_i => ents.push([EEntType.POSI, posi_i]) );
        const points_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[EEntType.POINT]];
        points_set.forEach( point_i => ents.push([EEntType.POINT, point_i]) );
        const plines_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[EEntType.PLINE]];
        plines_set.forEach( pline_i => ents.push([EEntType.PLINE, pline_i]) );
        const pgons_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[EEntType.PGON]];
        pgons_set.forEach( pgon_i => ents.push([EEntType.PGON, pgon_i]) );
        const colls_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[EEntType.COLL]];
        colls_set.forEach( coll_i => ents.push([EEntType.COLL, coll_i]) );
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
                    const posis_i: number[] = Array.from(this.getEnts(ssid, EEntType.POSI));
                    return arrMakeFlat( posis_i.map( posi_i => this._geom.nav.navPosiToVert(posi_i) ) );
                } else if (ent_type === EEntType.EDGE) {
                    const plines_i = Array.from(this.getEnts(ssid, EEntType.PLINE));
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pline_edges_i: number[] =  arrMakeFlat( plines_i.map( pline_i => this._geom.nav.navAnyToEdge(EEntType.PLINE, pline_i) ) );
                    const pgon_edges_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this._geom.nav.navAnyToEdge(EEntType.PGON, pgon_i) ) );
                    return pline_edges_i.concat(pgon_edges_i);
                } else if (ent_type === EEntType.WIRE) {
                    const plines_i = Array.from(this.getEnts(ssid, EEntType.PLINE));
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pline_wires_i: number[] =  arrMakeFlat( plines_i.map( pline_i => this._geom.nav.navAnyToWire(EEntType.PLINE, pline_i) ) );
                    const pgon_wires_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this._geom.nav.navAnyToWire(EEntType.PGON, pgon_i) ) );
                    return pline_wires_i.concat(pgon_wires_i);
                }  else if (ent_type === EEntType.FACE) {
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pgon_faces_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this._geom.nav.navAnyToFace(EEntType.PGON, pgon_i) ) );
                    return pgon_faces_i;
                }  else if (ent_type === EEntType.TRI) {
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pgon_tris_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this._geom.nav.navAnyToTri(EEntType.PGON, pgon_i) ) );
                    return pgon_tris_i;
                }
                throw new Error('Entity type not recognised.');
        }
    }
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
    // ============================================================================
    // Add, Del, Copy
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ents_i
     */
    public addEnt(ssid: number, ent_type: EEntType, ents_i: number): void {
        switch (ent_type) {
            case EEntType.POSI:
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
            case EEntType.COLL:
                const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
                ent_set.add(ents_i);
                break;
            default:
                throw new Error('Adding entity to snapshot: invalid entity type.');
        }
    }
    /**
     *
     * @param ent_type
     * @param ents_i
     */
    public addEntActive(ent_type: EEntType, ent_i: number): void {
        switch (ent_type) {
            case EEntType.POSI:
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
            case EEntType.COLL:
                const ent_set: Set<number> = this.ss_data.get(this._geom.modeldata.active_snapshot)[EEntTypeStr[ent_type]];
                ent_set.add(ent_i);
                break;
            default:
                throw new Error('Adding entity to snapshot: invalid entity type.');
        }
    }
    /**
     *
     * @param ent_type
     * @param ents_i
     */
    public delEntsActive(ent_type: EEntType, ents_i: number|number[], invert = false): void {
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        const ent_set: Set<number> = this.ss_data.get(this._geom.modeldata.active_snapshot)[EEntTypeStr[ent_type]];
        if (!invert) {
            // delet the ents in the list
            for (const a_ent_i of ents_i) {
                ent_set.delete(a_ent_i);
            }
        } else {
            // keep the ents in the ist, delete everything else
            if (ents_i.length > 0) {
                const keep_set: Set<number> = new Set(ents_i);
                ent_set.forEach( a_ent_i => {
                    if (!keep_set.has(a_ent_i)) {
                        ent_set.delete(a_ent_i);
                    }
                });
            }
        }
    }
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    public delAllEntsActive(ent_type: EEntType): void {
        const ent_set: Set<number> = this.ss_data.get(this._geom.modeldata.active_snapshot)[EEntTypeStr[ent_type]];
        ent_set.clear();
    }
    // /**
    //  * For the array of ents, makes a copy of all the ents that are members of the currently active snapshot.
    //  * IF copy_posis is true, then teh posis in the copied ents are also copied.
    //  * For transforming ents, copy_posis should be true, since xyz of posis will change.
    //  * For other operations, copy_posis should be false.
    //  * @param ent_type
    //  * @param ent_i
    //  */
    // public copyObjs(ents_arr: TEntTypeIdx|TEntTypeIdx[], copy_posis: boolean): TEntTypeIdx|TEntTypeIdx[] {
    //     const curr_ts: number = this._geom.modeldata.timestamp;
    //     if (ents_arr.length === 0) { return []; }
    //     const ents_arr2: TEntTypeIdx|TEntTypeIdx[] = this._copyObjs(ents_arr, curr_ts);
    //     if (copy_posis) {
    //         this._copyPosisInObs(ents_arr2 as TEntTypeIdx[], curr_ts);
    //     }
    //     return ents_arr2;
    // }
    // private _copyObjs(ents_arr: TEntTypeIdx|TEntTypeIdx[], curr_ts: number): TEntTypeIdx|TEntTypeIdx[] {
    //     if (!Array.isArray(ents_arr[0])) {
    //         const [ent_type, ent_i] = ents_arr as TEntTypeIdx;
    //         let ts: number;
    //         switch (ent_type) {
    //             case EEntType.POSI:
    //                 // Reject this?
    //                 throw new Error('Not implemented');
    //             case EEntType.VERT:
    //             case EEntType.EDGE:
    //             case EEntType.WIRE:
    //             case EEntType.FACE:
    //                 // Get the object associated with the topo, then this method again with the object
    //                 throw new Error('Not implemented');
    //             case EEntType.POINT:
    //                 ts = this._geom.modeldata.getEntTs(ent_type, ent_i);
    //                 if (curr_ts !== ts) {
    //                     this.ss_data.pt.get(this._geom.modeldata.timestamp).delete(ent_i);
    //                     return [EEntType.POINT, this._geom.add.copyPoint(ent_i, true)];
    //                 } else { return ents_arr; }
    //                 break;
    //             case EEntType.PLINE:
    //                 ts = this._geom.modeldata.getEntTs(ent_type, ent_i);
    //                 if (curr_ts !== ts) {
    //                     this.ss_data.pl.get(this._geom.modeldata.timestamp).delete(ent_i);
    //                     return [EEntType.PLINE, this._geom.add.copyPline(ent_i, true)];
    //                 } else { return ents_arr; }
    //                 break;
    //             case EEntType.PGON:
    //                 ts = this._geom.modeldata.getEntTs(ent_type, ent_i);
    //                 if (curr_ts !== ts) {
    //                     this.ss_data.pg.get(this._geom.modeldata.timestamp).delete(ent_i);
    //                     return [EEntType.PGON, this._geom.add.copyPgon(ent_i, true)];
    //                 } else { return ents_arr; }
    //                 break;
    //             case EEntType.COLL:
    //                 // get the objects in the collection
    //                 // the objects will change ID, so the collection will also need to be updated to reflect the new IDs
    //                 // so teh collection will need to be copied as well...
    //                 // but then what happens when we merge?
    //                 throw new Error('Not implemented');
    //         }
    //     } else {
    //         return (ents_arr as TEntTypeIdx[]).map( ent_arr => this._copyObjs( ent_arr, curr_ts )) as TEntTypeIdx[];
    //     }
    // }
    // private _copyPosisInObs(ents_arr: TEntTypeIdx[], curr_ts: number): void {
    //     const old_to_new_posis_i_map: Map<number, number> = new Map();
    //     for (const ent_arr of ents_arr) {
    //         const [ent_type, ent_i]: TEntTypeIdx = ent_arr as TEntTypeIdx;
    //         const old_posis_i: number[] = this._geom.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
    //         const ent_new_posis_i: number[] = [];
    //         for (const old_posi_i of old_posis_i) {
    //             const ts: number  = this._geom.modeldata.getEntTs(EEntType.POSI, old_posi_i);
    //             if (ts !== curr_ts) {
    //                 this.ss_data.ps.get(curr_ts).delete(old_posi_i);
    //                 let new_posi_i: number;
    //                 if (old_to_new_posis_i_map.has(old_posi_i)) {
    //                     new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
    //                 } else {
    //                     new_posi_i = this._geom.modeldata.geom.add.copyPosis(old_posi_i, true) as number;
    //                     old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
    //                 }
    //                 ent_new_posis_i.push(new_posi_i);
    //             } else {
    //                 ent_new_posis_i.push(old_posi_i);
    //             }
    //         }
    //         this._geom.modeldata.geom.modify.replacePosis(ent_type, ent_i, ent_new_posis_i);
    //     }
    // }
    // ============================================================================
    // Delete geometry locally
    // ============================================================================
     /**
     * Delete ents
     * @param ent_sets
     */
    public delActive(ent_sets: IEntSets): void {
        // delete the ents
        this.delCollsActive(Array.from(ent_sets.co));
        this.delPgonsActive(Array.from(ent_sets.pg), true);
        this.delPlinesActive(Array.from(ent_sets.pl), true);
        this.delPointsActive(Array.from(ent_sets.pt), true);
        this.delPosisActive(Array.from(ent_sets.ps));
        this.delUnusedPosisActive(Array.from(ent_sets.obj_ps));
    }
    /**
     * Del all unused posis in the model.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delUnusedPosisActive(posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        // loop
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            const verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
            if ( verts_i.length === 0) { // only delete posis with no verts
                this.delEntsActive(EEntType.POSI, posi_i);
            }
        }
    }
    /**
     * Del posis.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delPosisActive(posis_i: number|number[]): void {
        this.delEntsActive(EEntType.POSI, posis_i);
        // deal with vertices
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // loop
        const deleted_posis_i: number[] = [];
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            // delete all verts for this posi
            const copy_verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i).slice(); // make a copy
            copy_verts_i.forEach(vert_i => this._geom.del_vert.delVert(vert_i));
        }
    }
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    public delPointsActive(points_i: number|number[], del_unused_posis: boolean): void {
        this.delEntsActive(EEntType.POINT, points_i);
        if (!del_unused_posis) { return; }
        // create array
        points_i = (Array.isArray(points_i)) ? points_i : [points_i];
        // loop
        for (const point_i of points_i) {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.POINT, point_i);
            this.delUnusedPosisActive(posis_i);
        }
    }
    /**
     * Del plines.
     * Pline attributes will also be deleted.
     * @param plines_i
     */
    public delPlinesActive(plines_i: number|number[], del_unused_posis: boolean): void {
        this.delEntsActive(EEntType.PLINE, plines_i);
        if (!del_unused_posis) { return; }
        // create array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        // loop
        for (const pline_i of plines_i) {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            this.delUnusedPosisActive(posis_i);
        }
    }
    /**
     * Del pgons.
     * @param pgons_i
     */
    public delPgonsActive(pgons_i: number|number[], del_unused_posis: boolean): void {
        this.delEntsActive(EEntType.PGON, pgons_i);
        if (!del_unused_posis) { return; }
        // create array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        // loop
        for (const pgon_i of pgons_i) {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            this.delUnusedPosisActive(posis_i);
        }
    }
    /**
     * Delete a collection.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    public delCollsActive(colls_i: number|number[]): void {
        this.delEntsActive(EEntType.COLL, colls_i);
    }
    // ============================================================================
    // Nav
    // ============================================================================
     /**
     * Navigate between any levels.
     * Filter the entities based on the active snapshot.
     * @param index
     */
    public navAnyToAnyActive(from_ets: EEntType, to_ets: EEntType, index: number): number[] {
        return this.navAnyToAny(this._geom.modeldata.active_snapshot, from_ets, to_ets, index);
    }
    /**
     *
     * @param ssid
     * @param from_ets
     * @param to_ets
     * @param index
     */
    public navAnyToAny(ssid: number, from_ets: EEntType, to_ets: EEntType, index: number): number[] {
        const ents_i: number[] = this._geom.nav.navAnyToAny(from_ets, to_ets, index);
        if (from_ets === EEntType.POSI || from_ets === EEntType.COLL || to_ets === EEntType.COLL) {
            return ents_i.filter( ent_i => this.hasEnt(ssid, to_ets, ent_i) );
        }
        return ents_i;
    }
}
