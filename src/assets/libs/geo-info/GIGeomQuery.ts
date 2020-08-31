
import {  EEntType, IGeomArrays, EEntStrToGeomArray, TWire, Txyz, TColl, TEntTypeIdx,
    IGeomPack, TFace, EWireType, Txy, TEdge, TPosi, TVert } from './common';
import { isPosi, isVert, isPoint, isEdge, isWire, isPline, isFace, isPgon, isColl, isTri } from './id';
import { GIGeom } from './GIGeom';
import { vecFromTo, vecCross, vecDiv, vecNorm, vecLen, vecDot } from '../geom/vectors';
import * as Mathjs from 'mathjs';
/**
 * Class for geometry.
 */
export class GIGeomQuery {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
    }
    // ============================================================================
    // Entities
    // ============================================================================

    /**
     * Returns a list of indices for all.
     * ~
     * If include_deleted=true, it will include ents that are null.
     * @param ent_type
     */
    public getEnts(ent_type: EEntType, include_deleted: boolean): number[] {
        // get posis indices array from up array: up_posis_verts
        if (isPosi(ent_type)) {
            const posis: number[][] = this._geom_arrays.up_posis_verts;
            const posis_i: number[] = [];
            if (include_deleted) {
                let i = 0; const i_max = posis.length;
                for (; i < i_max; i++ ) {
                    const posi = posis[i];
                    if (posi !== null) {
                        posis_i.push(i);
                    } else {
                        posis_i.push(null); // TODO
                    }
                }
            } else {
                let i = 0; const i_max = posis.length;
                for (; i < i_max; i++ ) {
                    const posi = posis[i];
                    if (posi !== null) {
                        posis_i.push(i);
                    }
                }
            }
            return posis_i;
        }
        // get ents indices array from down arrays
        const geom_array_key: string = EEntStrToGeomArray[ent_type];
        const geom_array: any[] = this._geom_arrays[geom_array_key];
        const ents_i: number[] = [];
        if (include_deleted) {
            let i = 0; const i_max = geom_array.length;
            for (; i < i_max; i++ ) {
                const ent = geom_array[i];
                if (ent !== null) {
                    ents_i.push(i);
                } else {
                    ents_i.push(null); // TODO
                }
            }
        } else {
            let i = 0; const i_max = geom_array.length;
            for (; i < i_max; i++ ) {
                const ent = geom_array[i];
                if (ent !== null) {
                    ents_i.push(i);
                }
            }
        }
        return ents_i;
    }
    /**
     * Returns the number of entities
     */
    public numEnts(ent_type: EEntType, include_deleted: boolean): number {
        if (include_deleted) {
            return this.getNumEntsInclDel(ent_type);
        }
        return this.getNumEntsExcDel(ent_type);
    }
    /**
     * Returns the number of entities for [posis, point, polylines, polygons, collections].
     */
    public numEntsAll(include_deleted: boolean): number[] {
        if (include_deleted) {
            return [
                this.getNumEntsInclDel(EEntType.POSI),
                this.getNumEntsInclDel(EEntType.POINT),
                this.getNumEntsInclDel(EEntType.PLINE),
                this.getNumEntsInclDel(EEntType.PGON),
                this.getNumEntsInclDel(EEntType.COLL)
            ];
        }
        return [
            this.getNumEntsExcDel(EEntType.POSI),
            this.getNumEntsExcDel(EEntType.POINT),
            this.getNumEntsExcDel(EEntType.PLINE),
            this.getNumEntsExcDel(EEntType.PGON),
            this.getNumEntsExcDel(EEntType.COLL)
        ];
    }
    private getNumEntsInclDel(ent_type: EEntType): number {
        // get posis count from up array: up_posis_verts
        if (isPosi(ent_type)) {
            return this._geom_arrays.up_posis_verts.length;
        }
        // get ents count from down arrays
        const geom_array_key: string = EEntStrToGeomArray[ent_type];
        const geom_array: any[] = this._geom_arrays[geom_array_key];
        return geom_array.length;
    }
    private getNumEntsExcDel(ent_type: EEntType): number {
        let count = 0;
        let geom_array: any[] = null;
        if (isPosi(ent_type)) {
            // get posis count from up array: up_posis_verts
            geom_array = this._geom_arrays.up_posis_verts;
        } else {
            // get ents count from down arrays
            const geom_array_key: string = EEntStrToGeomArray[ent_type];
            geom_array = this._geom_arrays[geom_array_key];
        }
        for (let i = 0; i < geom_array.length; i++) {
            if (geom_array[i] !== null) {
                count += 1;
            }
        }
        return count;
    }
    /**
     * Check if an entity exists
     * @param ent_type
     * @param index
     */
    public entExists(ent_type: EEntType, index: number): boolean {
        if (ent_type === EEntType.POSI) {
            return (
                this._geom_arrays.up_posis_verts[index] !== undefined &&
                this._geom_arrays.up_posis_verts[index] !== null
            );
        }
        const geom_arrays_key: string = EEntStrToGeomArray[ent_type];
        return (
            this._geom_arrays[geom_arrays_key][index] !== undefined &&
            this._geom_arrays[geom_arrays_key][index] !== null
        );
    }
    /**
     * Returns a geompack of unique indexes, given an array of TEntTypeIdx.
     * ~
     * Object positions are added to the geompack.
     * ~
     * Collections contents is added to teh geompack, including nested collections..
     * ~
     * If invert=true, then the geompack will include the opposite set of entities.
     * ~
     * Used for deleting all entities.
     */
    public createGeomPack(ents: TEntTypeIdx[], invert: boolean = false): IGeomPack {
        const set_posis_i: Set<number> = new Set();
        const set_posis2_i: Set<number> = new Set();
        const set_points_i: Set<number> = new Set();
        const set_plines_i: Set<number> = new Set();
        const set_pgons_i: Set<number> = new Set();
        const set_colls_i: Set<number> = new Set();
        // process all the ents, but not posis of the ents, we will do that at the end
        for (const ent_arr of ents) {
            const [ent_type, ent_i]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            if (isColl(ent_type)) {
                // get the descendants of this collection
                const coll_and_desc_i: number[] = this._geom.query.getCollDescendents(ent_i);
                coll_and_desc_i.splice(0, 0, ent_i);
                // get all the objs
                for (const one_coll_i of coll_and_desc_i) {
                    for (const point_i of this._geom_arrays.dn_colls_objs[one_coll_i][1]) {
                        set_points_i.add(point_i);
                    }
                    for (const pline_i of this._geom_arrays.dn_colls_objs[one_coll_i][2]) {
                        set_plines_i.add(pline_i);
                    }
                    for (const pgon_i of this._geom_arrays.dn_colls_objs[one_coll_i][3]) {
                        set_pgons_i.add(pgon_i);
                    }
                    set_colls_i.add(one_coll_i);
                }
            } else if (isPgon(ent_type)) {
                set_pgons_i.add(ent_i);
            } else if (isPline(ent_type)) {
                set_plines_i.add(ent_i);
            } else if (isPoint(ent_type)) {
                set_points_i.add(ent_i);
            } else if (isPosi(ent_type)) {
                set_posis_i.add(ent_i);
            }
        }
        // now get all the posis of the ents and add them to the list
        set_points_i.forEach( point_i => {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.POINT, point_i);
            for (const posi_i of posis_i) {
                set_posis2_i.add(posi_i);
            }
        });
        set_plines_i.forEach( pline_i => {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            for (const posi_i of posis_i) {
                set_posis2_i.add(posi_i);
            }
        });
        set_pgons_i.forEach( pgon_i => {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            for (const posi_i of posis_i) {
                set_posis2_i.add(posi_i);
            }
        });
        // if no invert, then return the result
        if (!invert) {
            return {
                posis_i: Array.from(set_posis_i),
                posis2_i: Array.from(set_posis2_i),
                points_i: Array.from(set_points_i),
                plines_i: Array.from(set_plines_i),
                pgons_i: Array.from(set_pgons_i),
                colls_i: Array.from(set_colls_i)
            };
        }
        // invert
        const inv_colls_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.dn_colls_objs.length; i++) {
            if (this._geom_arrays.dn_colls_objs[i] !== null && !set_colls_i.has(i)) { inv_colls_i.push(i); }
        }
        const inv_pgons_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.dn_pgons_faces.length; i++) {
            if (this._geom_arrays.dn_pgons_faces[i] !== null && !set_pgons_i.has(i)) { inv_pgons_i.push(i); }
        }
        const inv_plines_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.dn_plines_wires.length; i++) {
            if (this._geom_arrays.dn_plines_wires[i] !== null && !set_plines_i.has(i)) { inv_plines_i.push(i); }
        }
        const inv_points_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.dn_points_verts.length; i++) {
            if (this._geom_arrays.dn_points_verts[i] !== null && !set_points_i.has(i)) { inv_points_i.push(i); }
        }
        const inv_posis2_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.up_posis_verts.length; i++) {
            if (
                this._geom_arrays.up_posis_verts[i] !== null &&
                !set_posis2_i.has(i) && !set_posis_i.has(i) ) {
                    inv_posis2_i.push(i);
                }
        }
        return {
            posis_i: [],
            posis2_i: inv_posis2_i,
            points_i: inv_points_i,
            plines_i: inv_plines_i,
            pgons_i: inv_pgons_i,
            colls_i: inv_colls_i
        };
    }
    // ============================================================================
    // Posis
    // ============================================================================
    /**
     * Returns a list of indices for all posis that have no verts
     */
    public getUnusedPosis(include_deleted: boolean): number[] {
        // get posis indices array from up array: up_posis_verts
        const posis: number[][] = this._geom_arrays.up_posis_verts;
        const posis_i: number[] = [];
        if (include_deleted) {
            for (let i = 0; i < posis.length; i++ ) {
                const posi = posis[i];
                if (posi !== null) {
                    if (posi.length === 0) { posis_i.push(i); }
                } else {
                    posis_i.push(null);
                }
            }
        } else {
            for (let i = 0; i < posis.length; i++ ) {
                const posi = posis[i];
                if (posi !== null) {
                    if (posi.length === 0) { posis_i.push(i); }
                }
            }
        }
        return posis_i;
    }
    // ============================================================================
    // Verts
    // ============================================================================
    /**
     * Get two edges that are adjacent to this vertex that are both not zero length.
     * In some cases wires and polygons have edges that are zero length.
     * This causes problems for calculating normals etc.
     * The return value can be either one edge (in open polyline [null, edge_i], [edge_i, null])
     * or two edges (in all other cases) [edge_i, edge_i].
     * If the vert has no non-zero edges, then [null, null] is returned.
     * @param vert_i
     */
    public getVertNonZeroEdges(vert_i: number): number[] {
        // get the wire start and end verts
        const edges_i: number[] = this._geom_arrays.up_verts_edges[vert_i];
        const posi_coords: Txyz[] = [];
        // get the first edge
        let edge0 = null;
        if (edges_i[0] !== null || edges_i[0] !== undefined) {
            let prev_edge_i: number = edges_i[0];
            while (edge0 === null) {
                if (prev_edge_i === edges_i[1]) { break; }
                const edge_verts_i: number[] = this._geom_arrays.dn_edges_verts[prev_edge_i];
                // first
                const posi0_i: number =  this._geom_arrays.dn_verts_posis[edge_verts_i[0]];
                if ( posi_coords[posi0_i] === undefined) {
                    posi_coords[posi0_i] = this._geom.model.attribs.query.getPosiCoords(posi0_i);
                }
                const xyz0: Txyz = posi_coords[posi0_i];
                // second
                const posi1_i: number =  this._geom_arrays.dn_verts_posis[edge_verts_i[1]];
                if ( posi_coords[posi1_i] === undefined) {
                    posi_coords[posi1_i] = this._geom.model.attribs.query.getPosiCoords(posi1_i);
                }
                const xyz1: Txyz = posi_coords[posi1_i];
                // check
                if (Math.abs(xyz0[0] - xyz1[0]) > 0 || Math.abs(xyz0[1] - xyz1[1]) > 0 || Math.abs(xyz0[2] - xyz1[2]) > 0) {
                    edge0 = prev_edge_i;
                } else {
                    prev_edge_i = this._geom_arrays.up_verts_edges[edge_verts_i[0]][0];
                    if (prev_edge_i === null || prev_edge_i === undefined) { break; }
                }
            }
        }
        // get the second edge
        let edge1 = null;
        if (edges_i[1] !== null || edges_i[1] !== undefined) {
            let next_edge_i: number = edges_i[1];
            while (edge1 === null) {
                if (next_edge_i === edges_i[0]) { break; }
                const edge_verts_i: number[] = this._geom_arrays.dn_edges_verts[next_edge_i];
                // first
                const posi0_i: number =  this._geom_arrays.dn_verts_posis[edge_verts_i[0]];
                if ( posi_coords[posi0_i] === undefined) {
                    posi_coords[posi0_i] = this._geom.model.attribs.query.getPosiCoords(posi0_i);
                }
                const xyz0: Txyz = posi_coords[posi0_i];
                // second
                const posi1_i: number =  this._geom_arrays.dn_verts_posis[edge_verts_i[1]];
                if ( posi_coords[posi1_i] === undefined) {
                    posi_coords[posi1_i] = this._geom.model.attribs.query.getPosiCoords(posi1_i);
                }
                const xyz1: Txyz = posi_coords[posi1_i];
                // check
                if (Math.abs(xyz0[0] - xyz1[0]) > 0 || Math.abs(xyz0[1] - xyz1[1]) > 0 || Math.abs(xyz0[2] - xyz1[2]) > 0) {
                    edge1 = next_edge_i;
                } else {
                    next_edge_i = this._geom_arrays.up_verts_edges[edge_verts_i[1]][1];
                    if (next_edge_i === null || next_edge_i === undefined) { break; }
                }
            }
        }
        // return the two edges, they can be null
        return [edge0, edge1];
    }
    // ============================================================================
    // Edges
    // ============================================================================
    /**
     * Get the next edge in a sequence of edges
     * @param edge_i
     */
    public getNextEdge(edge_i: number): number {
        // get the wire start and end verts
        const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
        const edges_i: number[] = this._geom_arrays.up_verts_edges[edge[1]];
        if (edges_i.length === 1) { return null; }
        return edges_i[1];
    }
    /**
     * Get the previous edge in a sequence of edges
     * @param edge_i
     */
    public getPrevEdge(edge_i: number): number {
        // get the wire start and end verts
        const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
        const edges_i: number[] = this._geom_arrays.up_verts_edges[edge[0]];
        if (edges_i.length === 1) { return null; }
        return edges_i[1];
    }
    /**
     * Get a list of edges that are neighbours ()
     * The list will include the input edge.
     * @param edge_i
     */
    public getNeighborEdges(edge_i: number): number[] {
        // get the wire start and end verts
        const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
        const start_posi_i: number = this._geom_arrays.dn_verts_posis[edge[0]];
        const end_posi_i: number = this._geom_arrays.dn_verts_posis[edge[1]];
        const start_edges_i: number[] = this._geom.nav.navAnyToEdge(EEntType.POSI, start_posi_i);
        const end_edges_i: number[] = this._geom.nav.navAnyToEdge(EEntType.POSI, end_posi_i);
        return Mathjs.setIntersect(start_edges_i, end_edges_i);
    }
    // ============================================================================
    // Wires
    // ============================================================================
    /**
     * Check if a wire is closed.
     * @param wire_i
     */
    public isWireClosed(wire_i: number): boolean {
        // get the wire start and end verts
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this._geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this._geom.nav.navEdgeToVert(end_edge_i)[1];
        // if start and end verts are the same, then wire is closed
        return (start_vert_i === end_vert_i);
    }
    /**
     * Check if a wire belongs to a pline, a pgon or a pgon hole.
     */
    public getWireType(wire_i: number): EWireType {
        // get the wire start and end verts
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        if (this._geom.nav.navWireToPline(wire_i) !== undefined) {
            return EWireType.PLINE;
        }
        const face_i: number = this._geom.nav.navWireToFace(wire_i);
        const face: TFace = this._geom.nav.getFace(face_i);
        const index: number = face[0].indexOf(wire_i);
        if (index === 0) { return EWireType.PGON; }
        if (index > 0) { return EWireType.PGON_HOLE; }
        throw new Error('Inconsistencies found in the internal data structure.');
    }
    /**
     * Returns the vertices.
     * For a closed wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     * @param wire_i
     */
    public getWireVerts(wire_i: number): number[] {
        const edges_i: number[] = this._geom_arrays.dn_wires_edges[wire_i];
        const verts_i: number[] = [];
        // walk the edges chain
        let next_edge_i: number = edges_i[0];
        for (let i = 0; i < edges_i.length; i++) {
            const edge_verts_i: number[] = this._geom_arrays.dn_edges_verts[next_edge_i];
            verts_i.push(edge_verts_i[0]);
            next_edge_i = this.getNextEdge(next_edge_i);
            // are we at the end of the chain
            if (next_edge_i === null) { // open wire
                verts_i.push(edge_verts_i[1]);
                break;
            } else if (next_edge_i === edges_i[0]) { // closed wire
                break;
            }
        }
        return verts_i;
    }
    // ============================================================================
    // Objects
    // ============================================================================
    /**
     * Returns three arrays of pairs of maps, for points, plines, and pgons.
     * This is used for creating a timeline, and is based on an attribute called "visible"
     * on collections.
     * The visible attribute is an array of strings, where each string is a time-stamp label.
     * ~
     * For the first map in each pair, keys are the group names, and values are a set of entitie IDs.
     * For the second map in each pair, keys are the time-stamp names, and values are a set of group names.
     * @return Array of arrays of maps.
     */
    public getObjVisGroups(): [ {}, Map<string, Set<string>> ] {
        if (!this._geom.model.attribs.query.hasAttrib(EEntType.COLL, 'visible')) {
            return null;
        }
        // return the result
        const colls_i: number[] = this.getEnts(EEntType.COLL, false);

        const full_obj_grp = {'default': []};
        const full_lbl_grp = new Map<string, Set<string>>();
        const grps = [  this._getObjVisGroups(colls_i, EEntType.POINT),
                        this._getObjVisGroups(colls_i, EEntType.EDGE),
                        this._getObjVisGroups(colls_i, EEntType.TRI)];
        for (let i = 0; i < grps.length; i ++) {
            const grp = grps[i];
            console.log(grp)
            full_obj_grp['default'][i] = grp[0].get('default');
            grp[1].forEach((val, key) => {
                let lbl_grp = full_lbl_grp.get(key);
                if (!lbl_grp) { lbl_grp = new Set<string>(); }
                for (const v of val) {
                    lbl_grp.add(v);
                    if (!full_obj_grp[v]) {
                        full_obj_grp[v] = [null, null, null];
                    }
                    full_obj_grp[v][i] = grp[0].get(v);
                }
                full_lbl_grp.set(key, lbl_grp);
            });
        }
        return [full_obj_grp, full_lbl_grp];
    }
    private _getObjVisGroups(colls_i: number[], ent_type: EEntType): [Map<string, Set<number>>, Map<string, Set<string>>] {
        // get objects
        const objs_i: number[] = this.getEnts(ent_type, false);
        // create overlapping groups of objects
        // keys are for example "2020", "2021" etc
        // objects can be in more than one group
        const obj_groups: Map<string, Set<number>> = new Map();
        for (const coll_i of colls_i) {
            const visibility: string[] = this._geom.model.attribs.query.getAttribVal(EEntType.COLL, 'visible', coll_i) as string[];
            if (visibility !== undefined) {
                // points
                const coll_objs_i: number[] = this._geom.nav.navAnyToAny(EEntType.COLL, ent_type, coll_i);
                if (coll_objs_i.length > 0) {
                    for (const label of visibility) {
                        if (!obj_groups.has(label)) { obj_groups.set(label, new Set()); }
                    }
                    for (const i of coll_objs_i) {
                        for (const label of visibility) { obj_groups.get(label).add(i); }
                    }
                }
            }
        }
        // create non-overlapping groups of objects
        // keys are for example "2020_2021", "2022_2023_2024" etc
        // objects will only be in one group
        const obj_groups2: Map<string, Set<number>> = new Map();
        const obj_labels2: Map<string, Set<string>> = new Map();
        obj_groups2.set('default', new Set());
        for (const i of objs_i) {
            const labels: string[] = [];
            obj_groups.forEach( (group, label) => {
                if (group.has(i)) { labels.push(label); }
            });
            if (labels.length > 0) {
                const label2 = labels.sort().join('_');
                if (!obj_groups2.has(label2)) { obj_groups2.set(label2, new Set()); }
                obj_groups2.get(label2).add(i);
                for (const label of labels) {
                    if (!obj_labels2.has(label)) { obj_labels2.set(label, new Set()); }
                    obj_labels2.get(label).add(label2);
                }
            } else {
                obj_groups2.get('default').add(i);
            }
        }
        // return the result
        return [obj_groups2, obj_labels2];
    }
    // ============================================================================
    // Collections
    // ============================================================================
    /**
     * Get the parent of a collection.
     * @param coll_i
     */
    public getCollParent(coll_i: number): number {
        return this._geom_arrays.dn_colls_objs[coll_i][0];
    }
    /**
     * Get the children collections of a collection.
     * @param coll_i
     */
    public getCollChildren(coll_i: number): number[] {
        const children: number[] = [];
        for (let i = 0; i < this._geom_arrays.dn_colls_objs.length; i++) {
            const coll: TColl = this._geom_arrays.dn_colls_objs[i];
            if (coll !== null && coll[0] === coll_i) {
                children.push(i);
            }
        }
        return children;
    }
    /**
     * Get the ancestor collections of a collection.
     * @param coll_i
     */
    public getCollAncestors(coll_i: number): number[] {
        const ancestor_colls_i: number[] = [];
        let parent_coll_i: number = this._geom_arrays.dn_colls_objs[coll_i][0];
        while (parent_coll_i !== -1) {
            ancestor_colls_i.push(parent_coll_i);
            parent_coll_i = this._geom_arrays.dn_colls_objs[parent_coll_i][0];
        }
        return ancestor_colls_i;
    }
    /**
     * Get the descendent collections of a collection.
     * @param coll_i
     */
    public getCollDescendents(coll_i: number): number[] {
        const descendent_colls_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.dn_colls_objs.length; i++) {
            const coll: TColl = this._geom_arrays.dn_colls_objs[i];
            if (coll !== null && coll[0] !== -1 && i !== coll_i) {
                if (this.isCollDescendent(i, coll_i)) {
                    descendent_colls_i.push(i);
                }
            }
        }
        return descendent_colls_i;
    }
    /**
     * Returns true if the first coll is a descendent of the second coll.
     * @param coll_i
     */
    public isCollDescendent(coll1_i: number, coll2_i: number): boolean {
        let parent_coll_i: number = this._geom_arrays.dn_colls_objs[coll1_i][0];
        while (parent_coll_i !== -1) {
            if (parent_coll_i === coll2_i) { return true; }
            parent_coll_i = this._geom_arrays.dn_colls_objs[parent_coll_i][0];
        }
        return false;
    }
    /**
     * Returns true if the first coll is an ancestor of the second coll.
     * @param coll_i
     */
    public isCollAncestor(coll1_i: number, coll2_i: number): boolean {
        let parent_coll_i: number = this._geom_arrays.dn_colls_objs[coll2_i][0];
        while (parent_coll_i !== -1) {
            if (parent_coll_i === coll1_i) { return true; }
            parent_coll_i = this._geom_arrays.dn_colls_objs[parent_coll_i][0];
        }
        return false;
    }
    // /**
    //  * I am not sure what this is... TODO
    //  * A collection can only have one parent
    //  * @param coll_i
    //  */
    // public getCollParents(coll_i: number) {
    //     const coll: TColl = this._geom_arrays.dn_colls_objs[coll_i];
    //     // @ts-ignore
    //     const _parents = coll.flat(1).filter(function (el) {return el != null; });
    //     return _parents;
    // }
    // ============================================================================
    // Faces
    // ============================================================================
    /**
     *
     * @param face_i
     */
    public getFaceBoundary(face_i: number): number {
        const wires_i: number[] = this._geom_arrays.dn_faces_wirestris[face_i][0];
        return wires_i[0];
    }
    /**
     *
     * @param face_i
     */
    public getFaceHoles(face_i: number): number[] {
        const wires_i: number[] = this._geom_arrays.dn_faces_wirestris[face_i][0];
        return wires_i.slice(1);
    }
    /**
     *
     * @param face_i
     */
    public getFaceNormal(face_i: number): Txyz {
        const normal: Txyz = [0, 0, 0];
        const tris_i: number[] = this._geom._geom_arrays.dn_faces_wirestris[face_i][1];
        let count = 0;
        for (const tri_i of tris_i) {
            const posis_i: number[] = this._geom_arrays.dn_tris_verts[tri_i].map(vert_i => this._geom_arrays.dn_verts_posis[vert_i]);
            const xyzs: Txyz[] = posis_i.map(posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i));
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
    // Calculate
    // ============================================================================
    /**
     *
     * @param ent_i
     */
    public getCentroid(ent_type: EEntType, ent_i: number): Txyz {
        const posis_i: number[] = this._geom.nav.navAnyToPosi(ent_type, ent_i);
        const centroid: Txyz = [0, 0, 0];
        for (const posi_i of posis_i) {
            const xyz: Txyz = this._geom.model.attribs.query.getPosiCoords(posi_i);
            centroid[0] += xyz[0];
            centroid[1] += xyz[1];
            centroid[2] += xyz[2];
        }
        return vecDiv(centroid, posis_i.length);
    }
    /**
     * Gets a normal from a wire.
     *
     * It triangulates the wire and then adds up all the normals of all the triangles.
     * Each edge has equal weight, irrespective of length.
     *
     * In some cases, the triangles may cancel each other out.
     * In such a case, it will choose the side' where the wire edges are the longest.
     *
     * @param wire_i
     */
    public getWireNormal(wire_i: number): Txyz {
        const edges_i: number[] = this._geom._geom_arrays.dn_wires_edges[wire_i];
        // deal with special case, just a single edge
        if (edges_i.length === 1) {
            const posis_i: number[] = this._geom_arrays.dn_edges_verts[edges_i[0]].map(vert_i => this._geom_arrays.dn_verts_posis[vert_i]);
            const xyz0: Txyz = this._geom.model.attribs.query.getPosiCoords(posis_i[0]);
            const xyz1: Txyz = this._geom.model.attribs.query.getPosiCoords(posis_i[1]);
            if (xyz0[2] === xyz1[2]) { return [0, 0, 1]; }
            if (xyz0[1] === xyz1[1]) { return [0, 1, 0]; }
            if (xyz0[0] === xyz1[0]) { return [1, 0, 0]; }
            return vecNorm(vecCross(vecFromTo(xyz0, xyz1), [0, 0, 1]));
        }
        // proceed with multiple edges
        const centroid: Txyz = this.getCentroid(EEntType.WIRE, wire_i);
        const normal: Txyz = [0, 0, 0];
        const tri_normals: Txyz[] = [];
        // let count = 0;
        for (const edge_i of edges_i) {
            const posis_i: number[] = this._geom_arrays.dn_edges_verts[edge_i].map(vert_i => this._geom_arrays.dn_verts_posis[vert_i]);
            const xyzs: Txyz[] = posis_i.map(posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i));
            const vec_a: Txyz = vecFromTo(centroid, xyzs[0]);
            const vec_b: Txyz = vecFromTo(centroid, xyzs[1]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            tri_normals.push(tri_normal);
            normal[0] += tri_normal[0];
            normal[1] += tri_normal[1];
            normal[2] += tri_normal[2];
        }
        // if we have a non-zero normal, then return it
        if (Math.abs(normal[0]) > 1e-6 || Math.abs(normal[1]) > 1e-6 || Math.abs(normal[2]) > 1e-6) {
            return vecNorm(normal);
        }
        // check for special case of a symmetrical shape where all triangle normals are
        // cancelling each other out, we need to look at both 'sides', see which is bigger
        const normal_a: Txyz = [0, 0, 0];
        const normal_b: Txyz = [0, 0, 0];
        let len_a = 0;
        let len_b = 0;
        let first_normal_a = null;
        for (const edge_i of edges_i) {
            const posis_i: number[] = this._geom_arrays.dn_edges_verts[edge_i].map(vert_i => this._geom_arrays.dn_verts_posis[vert_i]);
            const xyzs: Txyz[] = posis_i.map(posi_i => this._geom.model.attribs.query.getPosiCoords(posi_i));
            const vec_a: Txyz = vecFromTo(centroid, xyzs[0]);
            const vec_b: Txyz = vecFromTo(centroid, xyzs[1]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                if (first_normal_a === null) {
                    first_normal_a = tri_normal;
                    normal_a[0] = tri_normal[0];
                    normal_a[1] = tri_normal[1];
                    normal_a[2] = tri_normal[2];
                    len_a += vecLen(vecFromTo(xyzs[0], xyzs[1]));
                } else {
                    if (vecDot(first_normal_a, tri_normal) > 0) {
                        normal_a[0] += tri_normal[0];
                        normal_a[1] += tri_normal[1];
                        normal_a[2] += tri_normal[2];
                        len_a += vecLen(vecFromTo(xyzs[0], xyzs[1]));
                    } else {
                        normal_b[0] += tri_normal[0];
                        normal_b[1] += tri_normal[1];
                        normal_b[2] += tri_normal[2];
                        len_b += vecLen(vecFromTo(xyzs[0], xyzs[1]));
                    }
                }
            }
        }
        // return the normal for the longest set of edges in the wire
        // if they are the same length, return the normal associated with the start of the wire
        if (len_a >= len_b) {
            return vecNorm(normal_a);
        }
        return vecNorm(normal_b);
    }
    // ============================================================================
    // Other methods
    // ============================================================================
    /**
     * Given a set of vertices, get the welded neighbour entities.
     * @param ent_type
     * @param verts_i
     */
    public neighbor(ent_type: EEntType, verts_i: number[]): number[] {
        const neighbour_ents_i: Set<number> = new Set();
        for (const vert_i of verts_i) {
            const posi_i: number = this._geom.nav.navVertToPosi(vert_i);
            const found_verts_i: number[] = this._geom.nav.navPosiToVert(posi_i);
            for (const found_vert_i of found_verts_i) {
                if (verts_i.indexOf(found_vert_i) === -1) {
                    const found_ents_i: number[] = this._geom.nav.navAnyToAny(EEntType.VERT, ent_type, found_vert_i);
                    found_ents_i.forEach( found_ent_i => neighbour_ents_i.add(found_ent_i) );
                }
            }
        }
        return Array.from(neighbour_ents_i);
    }
    /**
     * Given a set of edges, get the perimeter entities.
     * @param ent_type
     * @param edges_i
     */
    public perimeter(ent_type: EEntType, edges_i: number[]): number[] {
        const edge_posis_map: Map<number, number[]> = new Map();
        const edge_to_posi_pairs_map: Map<number, [number, number]> = new Map();
        for (const edge_i of edges_i) {
            const posi_pair_i: [number, number] = this._geom.nav.navAnyToPosi(EEntType.EDGE, edge_i) as [number, number];
            if (!edge_posis_map.has(posi_pair_i[0])) {
                edge_posis_map.set(posi_pair_i[0], []);
            }
            edge_posis_map.get(posi_pair_i[0]).push(posi_pair_i[1]);
            edge_to_posi_pairs_map.set(edge_i, posi_pair_i );
        }
        const perimeter_ents_i: Set<number> = new Set();
        for (const edge_i of edges_i) {
            const posi_pair_i: [number, number] = edge_to_posi_pairs_map.get(edge_i);
            if (!edge_posis_map.has(posi_pair_i[1]) || edge_posis_map.get(posi_pair_i[1]).indexOf(posi_pair_i[0]) === -1) {
                const found_ents_i: number[] = this._geom.nav.navAnyToAny(EEntType.EDGE, ent_type, edge_i);
                found_ents_i.forEach( found_ent_i => perimeter_ents_i.add(found_ent_i) );
            }
        }
        return Array.from(perimeter_ents_i);
    }
    /**
     * Get the object type of a topo entity.
     * @param ent_type
     * @param index
     */
    public getTopoObjType(ent_type: EEntType, index: number): EEntType {
        switch (ent_type) {
            case EEntType.FACE:
                return EEntType.PGON;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                if (this._geom.nav.navAnyToFace(ent_type, index).length !== 0) {
                    return EEntType.PGON;
                } else if (this._geom.nav.navAnyToWire(ent_type, index).length !== 0) {
                    return EEntType.PLINE;
                } else if (this._geom.nav.navAnyToVert(ent_type, index).length !== 0) {
                    return EEntType.POINT;
                }
                break;
            default:
                throw new Error('Invalid entity type: Must be a topo entity.');
        }
    }
}
