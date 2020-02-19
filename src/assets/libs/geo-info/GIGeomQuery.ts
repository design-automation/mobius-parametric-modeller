
import {  EEntType, IGeomArrays, EEntStrToGeomArray, TWire, Txyz, TColl, TEntTypeIdx, IGeomPack, TFace, EWireType, Txy } from './common';
import { isPosi, isVert, isPoint, isEdge, isWire, isPline, isFace, isPgon, isColl, isTri } from './id';
import { GIGeom } from './GIGeom';
import { vecFromTo, vecCross, vecDiv, vecNorm, vecLen, vecDot } from '../geom/vectors';
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
        return this.getEnts(ent_type, include_deleted).length;
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
        const posis_i_set: Set<number> = new Set();
        set_points_i.forEach( point_i => {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.POINT, point_i);
            for (const posi_i of posis_i) {
                posis_i_set.add(posi_i);
            }
        });
        set_plines_i.forEach( pline_i => {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            for (const posi_i of posis_i) {
                posis_i_set.add(posi_i);
            }
        });
        set_pgons_i.forEach( pgon_i => {
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            for (const posi_i of posis_i) {
                posis_i_set.add(posi_i);
            }
        });
        // if no invert, then return the result
        if (!invert) {
            return {
                posis_i: Array.from(set_posis_i),
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
        const inv_posis_i: number[] = [];
        for (let i = 0; i < this._geom_arrays.up_posis_verts.length; i++) {
            if (this._geom_arrays.up_posis_verts[i] !== null && !set_posis_i.has(i)) { inv_posis_i.push(i); }
        }
        return {
            posis_i: inv_posis_i,
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
        const verts_i: number[] = edges_i.map(edge_i => this._geom_arrays.dn_edges_verts[edge_i][0]);
        // if wire is open, then add final vertex
        if (this._geom_arrays.dn_edges_verts[edges_i[0]][0] !== this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1]) {
            verts_i.push(this._geom_arrays.dn_edges_verts[edges_i[edges_i.length - 1]][1]);
        }
        return verts_i;
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
        const centroid: Txyz = this.getCentroid(EEntType.WIRE, wire_i);
        const edges_i: number[] = this._geom._geom_arrays.dn_wires_edges[wire_i];
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
}
