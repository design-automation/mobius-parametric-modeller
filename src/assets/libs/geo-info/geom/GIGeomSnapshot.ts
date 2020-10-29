import { vecCross, vecDiv, vecFromTo } from '@assets/libs/geom/vectors';
import { arrMakeFlat } from '../../util/arrs';
import { EAttribNames, EEntType, EEntTypeStr, IEntSets, IGeomMaps, ISnapshotData, TEntTypeIdx, Txyz } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for modifying plines.
 */
export class GIGeomSnapshot {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    // ss_data -> ssid -> ps, pt, pl, pg, co
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
    public addEntsToActiveSnapshot(ents: TEntTypeIdx[]): void {
        for (const [ent_type, ent_i] of ents) {
            if (ent_type === EEntType.POSI || ent_type >= EEntType.POINT) {
                this.ss_data.get(this.modeldata.active_ssid)[EEntTypeStr[ent_type]].add(ent_i);
            }
        }
    }
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
                    return arrMakeFlat( posis_i.map( posi_i => this.modeldata.geom.nav.navPosiToVert(posi_i) ) );
                } else if (ent_type === EEntType.EDGE) {
                    const plines_i = Array.from(this.getEnts(ssid, EEntType.PLINE));
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pline_edges_i: number[] =  arrMakeFlat( plines_i.map( pline_i => this.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i) ) );
                    const pgon_edges_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this.modeldata.geom.nav.navAnyToEdge(EEntType.PGON, pgon_i) ) );
                    return pline_edges_i.concat(pgon_edges_i);
                } else if (ent_type === EEntType.WIRE) {
                    const plines_i = Array.from(this.getEnts(ssid, EEntType.PLINE));
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pline_wires_i: number[] =  arrMakeFlat( plines_i.map( pline_i => this.modeldata.geom.nav.navAnyToWire(EEntType.PLINE, pline_i) ) );
                    const pgon_wires_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i) ) );
                    return pline_wires_i.concat(pgon_wires_i);
                // }  else if (ent_type === EEntType.FACE) {
                //     const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                //     const pgon_faces_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this.modeldata.geom.nav.navAnyToFace(EEntType.PGON, pgon_i) ) );
                //     return pgon_faces_i;
                }  else if (ent_type === EEntType.TRI) {
                    const pgons_i = Array.from(this.getEnts(ssid, EEntType.PGON));
                    const pgon_tris_i: number[] =  arrMakeFlat( pgons_i.map( pgon_i => this.modeldata.geom.nav_tri.navPgonToTri(pgon_i) ) );
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
    // Delete geometry locally
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ents_i
     */
    public delEnts(ssid: number, ent_type: EEntType, ents_i: number|number[], invert = false): void {
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
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
    public delAllEnts(ssid: number, ent_type: EEntType): void {
        const ent_set: Set<number> = this.ss_data.get(ssid)[EEntTypeStr[ent_type]];
        ent_set.clear();
    }
     /**
     * Delete ents
     * @param ent_sets
     */
    public delEntSets(ssid: number, ent_sets: IEntSets): void {
        // delete the ents
        this.delColls(ssid, Array.from(ent_sets.co));
        this.delPgons(ssid, Array.from(ent_sets.pg), true);
        this.delPlines(ssid, Array.from(ent_sets.pl), true);
        this.delPoints(ssid, Array.from(ent_sets.pt), true);
        this.delPosis(ssid, Array.from(ent_sets.ps));
        this.delUnusedPosis(ssid, Array.from(ent_sets.obj_ps));
    }
    /**
     * Del all unused posis in the model.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delUnusedPosis(ssid: number, posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        // loop
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            const verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
            if ( verts_i.length === 0) { // only delete posis with no verts
                this.delEnts(ssid, EEntType.POSI, posi_i);
            }
        }
    }
    /**
     * Del posis.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delPosis(ssid: number, posis_i: number|number[]): void {
        this.delEnts(ssid, EEntType.POSI, posis_i);
        // deal with vertices
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // loop
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            // delete all verts for this posi
            const copy_verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i).slice(); // make a copy
            copy_verts_i.forEach(vert_i => this.modeldata.geom.del_vert.delVert(vert_i));
        }
    }
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    public delPoints(ssid: number, points_i: number|number[], del_unused_posis: boolean): void {
        this.delEnts(ssid, EEntType.POINT, points_i);
        if (!del_unused_posis) { return; }
        // create array
        points_i = (Array.isArray(points_i)) ? points_i : [points_i];
        // loop
        for (const point_i of points_i) {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, point_i);
            this.delUnusedPosis(ssid, posis_i);
        }
    }
    /**
     * Del plines.
     * Pline attributes will also be deleted.
     * @param plines_i
     */
    public delPlines(ssid: number, plines_i: number|number[], del_unused_posis: boolean): void {
        this.delEnts(ssid, EEntType.PLINE, plines_i);
        if (!del_unused_posis) { return; }
        // create array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        // loop
        for (const pline_i of plines_i) {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            this.delUnusedPosis(ssid, posis_i);
        }
    }
    /**
     * Del pgons.
     * @param pgons_i
     */
    public delPgons(ssid: number, pgons_i: number|number[], del_unused_posis: boolean): void {
        this.delEnts(ssid, EEntType.PGON, pgons_i);
        if (!del_unused_posis) { return; }
        // create array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        // loop
        for (const pgon_i of pgons_i) {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            this.delUnusedPosis(ssid, posis_i);
        }
    }
    /**
     * Delete a collection.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    public delColls(ssid: number, colls_i: number|number[]): void {
        this.delEnts(ssid, EEntType.COLL, colls_i);
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
    // ============================================================================
    // Debug
    // ============================================================================
    public toStr(ssid: number): string {
        return JSON.stringify([
            'posis', Array.from(this.ss_data.get(ssid).ps),
            'points', Array.from(this.ss_data.get(ssid).pt),
            'plines', Array.from(this.ss_data.get(ssid).pl),
            'pgons', Array.from(this.ss_data.get(ssid).pg),
            'colls', Array.from(this.ss_data.get(ssid).co),
        ]) + '\n';
    }
}
