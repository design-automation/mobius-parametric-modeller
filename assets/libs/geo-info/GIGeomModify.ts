import { EEntType, TTri, TEdge, TWire, TFace, IGeomArrays, Txyz, TColl } from './common';
import { GIGeom } from './GIGeom';
import { arrRem } from '../util/arrays';
import { vecDot } from '../geom/vectors';

/**
 * Class for geometry.
 */
export class GIGeomModify {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
    }
    // ============================================================================
    // Delete geometry
    // ============================================================================
    /**
     * Del all unused posis in the model.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delUnusedPosis(posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // loop
        const deleted_posis_i: number[] = [];
        for (const posi_i of posis_i) {
            // update up arrays
            const verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
            if (verts_i.length === 0) { // only delete posis with no verts
                this._geom_arrays.up_posis_verts[posi_i] = null;
                deleted_posis_i.push(posi_i);
            }
            // no need to update down arrays
        }
        // delete all the posi attributes, for all posis that were deleted
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.POSI, deleted_posis_i);
    }
    /**
     * Del posis.
     * Posi attributes will also be deleted.
     * @param posis_i
     */
    public delPosis(posis_i: number|number[]): void {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) { return; }
        // loop
        const deleted_posis_i: number[] = [];
        for (const posi_i of posis_i) {
            if (this._geom_arrays.up_posis_verts[posi_i] === null) { continue; } // already deleted
            // delete all verts for this posi
            const copy_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i].slice(); // make a copy
            copy_verts_i.forEach(vert_i => this._delVert(vert_i));
            // delete the posi
            this._geom_arrays.up_posis_verts[posi_i] = null;
            deleted_posis_i.push(posi_i);
            // no need to update down arrays
        }
        // delete all the posi attributes, for all posis that were deleted
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.POSI, deleted_posis_i);
    }
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    public delPoints(points_i: number|number[], del_unused_posis: boolean): void {
        // create array
        points_i = (Array.isArray(points_i)) ? points_i : [points_i];
        if (!points_i.length) { return; }
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.POINT, points_i);
        // loop
        for (const point_i of points_i) {
            // first get all the arrays so we dont break navigation
            const vert_i: number = this._geom_arrays.dn_points_verts[point_i];
            if (vert_i === null) { continue; } // already deleted
            const posi_i: number = this._geom_arrays.dn_verts_posis[vert_i];
            // delete the point and check collections
            this._geom_arrays.dn_points_verts[point_i] = null;
            for (const coll of this._geom_arrays.dn_colls_objs) {
                const coll_points_i: number[] = coll[1];
                arrRem(coll_points_i, point_i);
            }
            // delete the vert by setting the up and down arrays to null
            this._geom_arrays.dn_verts_posis[vert_i] = null;
            delete this._geom_arrays.up_verts_points[vert_i];
            // remove the vert from up_posis_verts
            const posi_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
            arrRem(posi_verts_i, vert_i);
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posi_i);
            }
        }
    }
    /**
     * Del plines.
     * Pline attributes will also be deleted.
     * @param plines_i
     */
    public delPlines(plines_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.PLINE, plines_i);
        // create array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        if (!plines_i.length) { return; }
        // loop
        for (const pline_i of plines_i) {
            // first get all the arrays so we dont break navigation
            const wire_i: number = this._geom_arrays.dn_plines_wires[pline_i];
            if (wire_i === null) { continue; } // already deleted
            const edges_i: number[] = this._geom.query.navAnyToEdge(EEntType.PLINE, pline_i);
            const verts_i: number[] = this._geom.query.navAnyToVert(EEntType.PLINE, pline_i);
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.PLINE, pline_i);
            // delete the pline and check collections
            this._geom_arrays.dn_plines_wires[pline_i] = null;
            for (const coll of this._geom_arrays.dn_colls_objs) {
                const coll_plines_i: number[] = coll[2];
                arrRem(coll_plines_i, pline_i);
            }
            // delete the wire
            this._geom_arrays.dn_wires_edges[wire_i] = null;
            delete this._geom_arrays.up_wires_plines[wire_i];
            // delete the edges
            edges_i.forEach( edge_i => {
                this._geom_arrays.dn_edges_verts[edge_i] = null;
                delete this._geom_arrays.up_edges_wires[edge_i];
            });
            // delete the verts
            verts_i.forEach( vert_i => {
                this._geom_arrays.dn_verts_posis[vert_i] = null;
                delete this._geom_arrays.up_verts_edges[vert_i];
            });
            // remove the verts from up_posis_verts
            for (const posi_i of posis_i) {
                const posi_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
                // loop through deleted verts
                for (const vert_i of verts_i) {
                    arrRem(posi_verts_i, vert_i);
                    if (posi_verts_i.length === 0) { break; }
                }
            }
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posis_i);
            }
        }
    }
    /**
     * Del pgons.
     * Pgon attributes will also be deleted.
     * @param pgons_i
     */
    public delPgons(pgons_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.PGON, pgons_i);
        // create array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        if (!pgons_i.length) { return; }
        // loop
        for (const pgon_i of pgons_i) {
            // first get all the arrays so we dont break navigation
            const face_i: number = this._geom_arrays.dn_pgons_faces[pgon_i];
            if (face_i === null) { continue; } // already deleted
            const wires_i: number[] = this._geom.query.navAnyToWire(EEntType.PGON, pgon_i);
            const edges_i: number[] = this._geom.query.navAnyToEdge(EEntType.PGON, pgon_i);
            const verts_i: number[] = this._geom.query.navAnyToVert(EEntType.PGON, pgon_i);
            const tris_i: number[] = this._geom.query.navAnyToTri(EEntType.PGON, pgon_i);
            const posis_i: number[] = this._geom.query.navAnyToPosi(EEntType.PGON, pgon_i);
            // delete the pgon and check the collections
            this._geom_arrays.dn_pgons_faces[pgon_i] = null;
            for (const coll of this._geom_arrays.dn_colls_objs) {
                const coll_pgons_i: number[] = coll[3];
                arrRem(coll_pgons_i, pgon_i);
            }
            // delete the face
            this._geom_arrays.dn_faces_wirestris[face_i] = null;
            delete this._geom_arrays.up_faces_pgons[face_i];
            // delete the wires
            wires_i.forEach( wire_i => {
                this._geom_arrays.dn_wires_edges[wire_i] = null;
                delete this._geom_arrays.up_wires_faces[wire_i];
            });
            // delete the edges
            edges_i.forEach( edge_i => {
                this._geom_arrays.dn_edges_verts[edge_i] = null;
                delete this._geom_arrays.up_edges_wires[edge_i];

            });
            // delete the verts
            verts_i.forEach( vert_i => {
                this._geom_arrays.dn_verts_posis[vert_i] = null;
                delete this._geom_arrays.up_verts_edges[vert_i];
                delete this._geom_arrays.up_verts_tris[vert_i];
            });
            // delete the tris
            tris_i.forEach( tri_i => {
                this._geom_arrays.dn_tris_verts[tri_i] = null;
                delete this._geom_arrays.up_tris_faces[tri_i];
            });
            // clean up, posis up arrays point to verts that may have been deleted
            for (const posi_i of posis_i) {
                const posi_verts_i: number[] = this._geom_arrays.up_posis_verts[posi_i];
                // loop through deleted verts
                for (const vert_i of verts_i) {
                    arrRem(posi_verts_i, vert_i);
                    if (posi_verts_i.length === 0) { break; }
                }
            }
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posis_i);
            }
        }
    }
    /**
     * Delete a collection.
     * Collection attributes will also be deleted.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    public delColls(colls_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.COLL, colls_i);
        // create array
        colls_i = (Array.isArray(colls_i)) ? colls_i : [colls_i];
        if (!colls_i.length) { return; }
        // loop
        for (const coll_i of colls_i) {
            const coll: TColl = this._geom_arrays.dn_colls_objs[coll_i];
            if (coll === null) { continue; } // already deleted
            // up arrays, delete points, plines, pgons
            const points_i: number[] = coll[1];
            points_i.forEach(point_i =>  {
                const other_colls_i: number[] = this._geom_arrays.up_points_colls[point_i];
                arrRem(other_colls_i, coll_i);
            });
            const plines_i: number[] = coll[2];
            plines_i.forEach(pline_i =>  {
                const other_colls_i: number[] = this._geom_arrays.up_plines_colls[pline_i];
                arrRem(other_colls_i, coll_i);
            });
            const pgons_i: number[] = coll[3];
            pgons_i.forEach(pgon_i =>  {
                const other_colls_i: number[] = this._geom_arrays.up_pgons_colls[pgon_i];
                arrRem(other_colls_i, coll_i);
            });
            // down arrays
            this._geom_arrays.dn_colls_objs[coll_i] = null;
        }
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
    /**
     * Creates hole in a face
     * @param posis_id
     */
    public cutFaceHoles(face_i: number, posis_i_arr: number[][]): number[] {
        // get the normal of the face
        const face_normal: Txyz = this._geom.query.getFaceNormal(face_i);
        // make the wires for the holes
        const hole_wires_i: number[] = [];
        for (const hole_posis_i of posis_i_arr) {
            const hole_vert_i_arr: number[] = hole_posis_i.map( posi_i => this._geom.add._addVertex(posi_i));
            const hole_edges_i_arr: number[] = [];
            for (let i = 0; i < hole_vert_i_arr.length - 1; i++) {
                hole_edges_i_arr.push( this._geom.add._addEdge(hole_vert_i_arr[i], hole_vert_i_arr[i + 1]));
            }
            hole_edges_i_arr.push( this._geom.add._addEdge(hole_vert_i_arr[hole_vert_i_arr.length - 1], hole_vert_i_arr[0]));
            const hole_wire_i: number = this._geom.add._addWire(hole_edges_i_arr, true);
            // get normal of wire and check if we need to reverse the wire
            const wire_normal: Txyz = this._geom.query.getWireNormal(hole_wire_i);
            if (vecDot(face_normal, wire_normal) > 0) {
                this.reverse(hole_wire_i);
            }
            // add to list of holes
            hole_wires_i.push(hole_wire_i);
        }
        // create the holes
        this._cutFaceHoles(face_i, hole_wires_i);
        // no need to change either the up or down arrays
        // return the new wires
        return hole_wires_i;
    }
    /**
     * Close a wire
     * @param wire_i The wire to close.
     */
    public closeWire(wire_i: number): void {
        // get the wire start and end verts
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this._geom.query.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this._geom.query.navEdgeToVert(end_edge_i)[1];
        if (start_vert_i === end_vert_i) { return; }
        // add the edge to the model
        const new_edge_i: number = this._geom.add._addEdge(end_vert_i, start_vert_i);
        // update the down arrays
        this._geom_arrays.dn_wires_edges[wire_i].push(new_edge_i);
        // update the up arrays
        this._geom_arrays.up_edges_wires[new_edge_i] = wire_i;
    }
    /**
     * Open a wire, by making a new position for the last vertex.
     * @param wire_i The wire to close.
     */
    public openWire(wire_i: number): void {
        // This deletes an edge
        throw new Error('Not implemented');
    }
    /**
     * Insert a vertex into an edge and updates the wire with the new edge
     * @param wire_i The wire to close.
     */
    public insertVertIntoWire(edge_i: number, posi_i: number): number {
        const wire_i: number = this._geom.query.navEdgeToWire(edge_i);
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const old_edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
        // create one new vertex and one new edge
        const new_vert_i: number = this._geom.add._addVertex(posi_i);
        const new_edge_i: number = this._geom.add._addEdge(new_vert_i, old_edge[1]);
        // update the down arrays
        old_edge[1] = new_vert_i;
        wire.splice(wire.indexOf(edge_i), 1, edge_i, new_edge_i);
        // update the up arrays
        this._geom_arrays.up_edges_wires[new_edge_i] = wire_i;
        // return the new edge
        return new_edge_i;
    }
    /**
     * Replace positions
     * @param ent_type
     * @param ent_i
     * @param new_posis_i
     */
    public replacePosis(ent_type: EEntType, ent_i: number, new_posis_i: number[]): void {
        const verts_i: number[] = this._geom.query.navAnyToVert(ent_type, ent_i);
        if (verts_i.length !== new_posis_i.length) {
            throw new Error('Replacing positions operation failed due to incorrect number of positions.');
        }
        for (let i = 0; i < verts_i.length; i++) {
            this._geom_arrays.dn_verts_posis[verts_i[i]] = new_posis_i[i];
        }
    }
    /**
     * Unweld the vertices
     * TODO copy attributes onto new positions?
     * @param verts_i
     */
    public unweldVerts(verts_i: number[]): number[] {
        const exist_posis_i_map: Map<number, number> = new Map(); // posi_i -> count
        for (const vert_i of verts_i) {
            const posi_i: number = this._geom.query.navVertToPosi(vert_i);
            if (!exist_posis_i_map.has(posi_i)) {
                exist_posis_i_map.set(posi_i, 0);
            }
            const vert_count: number = exist_posis_i_map.get(posi_i);
            exist_posis_i_map.set(posi_i, vert_count + 1);
        }
        // copy positions on the perimeter and make a map
        const old_to_new_posis_i_map: Map<number, number> = new Map();
        exist_posis_i_map.forEach( (vert_count, old_posi_i) => {
            const all_old_verts_i: number[] = this._geom.query.navPosiToVert(old_posi_i);
            const all_vert_count: number = all_old_verts_i.length;
            if (vert_count !== all_vert_count) {
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    const new_posi_i: number = this._geom.add.copyPosis(old_posi_i, true) as number;
                    old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                }
            }
        });
        // now go through the geom again and rewire to the new posis
        for (const vert_i of verts_i) {
            const old_posi_i: number = this._geom.query.navVertToPosi(vert_i);
            let new_posi_i: number = old_posi_i;
            if (old_to_new_posis_i_map.has(old_posi_i)) {
                new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
            }
            // update the down arrays
            this._geom_arrays.dn_verts_posis[vert_i] = new_posi_i;
            // update the up arrays
            if (this._geom_arrays.up_posis_verts[new_posi_i] === undefined) {
                this._geom_arrays.up_posis_verts[new_posi_i] = [];
            }
            this._geom_arrays.up_posis_verts[new_posi_i].push(new_posi_i);
        }
        // return all the new positions
        return Array.from(old_to_new_posis_i_map.values());
    }
    /**
     * Reverse the edges of a wire.
     * This lists the edges in reverse order, and flips each edge.
     * The attributes ... TODO
     */
    public reverse(wire_i: number): void {
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        wire.reverse();
        // reverse the edges
        for (const edge_i of wire) {
            const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
            edge.reverse();
        }
        // if this is a face, reverse the triangles
        if (this._geom_arrays.up_wires_faces[wire_i] !== undefined) {
            const face_i: number = this._geom_arrays.up_wires_faces[wire_i];
            const face: TFace = this._geom_arrays.dn_faces_wirestris[face_i];
            for (const tri_i of face[1]) {
                const tri: TTri = this._geom_arrays.dn_tris_verts[tri_i];
                tri.reverse();
            }
        }
    }
    /**
     * Shifts the edges of a wire.
     * The attributes ... TODO
     */
    public shift(wire_i: number, offset: number): void {
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        wire.unshift.apply( wire, wire.splice( offset, wire.length ) );
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Adds a hole to a face and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    private _cutFaceHoles(face_i: number, hole_wires_i: number[]): number {
        // get the wires and triangles arrays
        const [face_wires_i, old_face_tris_i]: [number[], number[]] = this._geom_arrays.dn_faces_wirestris[face_i];
        // get the outer wire
        const outer_wire_i: number = face_wires_i[0];
        // get the hole wires
        const all_hole_wires_i: number[] = [];
        if (face_wires_i.length > 1) {
            face_wires_i.slice(1).forEach(wire_i => all_hole_wires_i.push(wire_i));
        }
        hole_wires_i.forEach(wire_i => all_hole_wires_i.push(wire_i));
        // create the triangles
        const new_tris_i: number[] = this._geom.add._addTris(outer_wire_i, all_hole_wires_i);
        // create the face
        const new_wires_i: number[] = face_wires_i.concat(hole_wires_i);
        const new_face: TFace = [new_wires_i, new_tris_i];
        // update down arrays
        this._geom_arrays.dn_faces_wirestris[face_i] = new_face;
        // update up arrays
        hole_wires_i.forEach(hole_wire_i => this._geom_arrays.up_wires_faces[hole_wire_i] = face_i);
        new_tris_i.forEach( tri_i => this._geom_arrays.up_tris_faces[tri_i] = face_i );
        // delete the old trianges
        for (const old_face_tri_i of old_face_tris_i) {
            // remove these deleted tris from the verts
            for (const vertex_i of this._geom_arrays.dn_tris_verts[old_face_tri_i]) {
                const tris_i: number[] = this._geom_arrays.up_verts_tris[vertex_i];
                arrRem(tris_i, old_face_tri_i);
            }
            // tris to verts
            this._geom_arrays.dn_tris_verts[old_face_tri_i] = null;
            // tris to faces
            delete this._geom_arrays.up_tris_faces[old_face_tri_i];
        }
        // TODO deal with the old triangles, stored in face_tris_i
        // TODO These are still there and are still pointing up at this face
        // TODO the have to be deleted...

        // return the numeric index of the face
        return face_i;
    }
    // ============================================================================
    // Private methods to delete topo
    // ============================================================================
    /**
     * Deletes a vert.
     *
     * In the general case, the two edges adjacent to the deleted vert will be merged.
     * This means that the next edge will be deleted.
     * The end vert of the previous edge will connect to the end posi of the next edge.
     *
     * The first special case is if the vert is for a point. In that case, just delete the point.
     *
     * Then there are two special cases for whicj we delete the whole object
     *
     * 1) If the wire is open and has only 1 edge, then delete the wire
     * 2) if the wire is closed pgon and has only 3 edges, then:
     *    a) If the wire is the boundary of the pgon, then delete the whole pgon
     *    b) If the wire is a hole in the pgon, then delete the hole
     *
     * Assuming the special cases above do not apply,
     * then there are two more special cases for open wires
     *
     * 1) If the vert is at the start of an open wire, then delete the first edge
     * 2) If teh vert is at the end of an open wire, then delete the last edge
     *
     * Finally, we come to the standard case.
     * The next edge is deleted, and the prev edge gets rewired.
     *
     * @param vert_i
     */
    private _delVert(vert_i: number): void {
        // check, has it already been deleted
        if (this._geom_arrays.dn_verts_posis[vert_i] === null) { return; }
        // check, is this a point, then delete the point and vertex
        const point_i: number = this._geom_arrays.up_verts_points[vert_i];
        if (point_i !== undefined && point_i !== null) {
            this.delPoints(point_i, false);
            return;
        }
        // get the posis, edges, and wires, and other info
        const edges_i: number[] = this._geom_arrays.up_verts_edges[vert_i];
        const wire_i: number = this._geom_arrays.up_edges_wires[edges_i[0]];
        const face_i: number = this._geom_arrays.up_wires_faces[wire_i]; // this may be undefined
        const wire_edges_i: number[] = this._geom_arrays.dn_wires_edges[wire_i];
        const wire_verts_i: number[] = this._geom.query.navAnyToVert(EEntType.WIRE, wire_i);
        const wire_is_closed: boolean = this._geom.query.istWireClosed(wire_i);
        const index_vert_i: number = wire_verts_i.indexOf(vert_i);
        const num_verts: number = wire_verts_i.length;

        // update the edges and wires
        if (!wire_is_closed && num_verts === 2) {

            // special case, open pline with 2 verts
            this.__delVert__OpenPline1Edge(wire_i);

        } else if (face_i !== undefined && face_i !== null && num_verts === 3) {

            // special case, pgon with three verts
            const wires_i: number[] = this._geom_arrays.dn_faces_wirestris[face_i][0];
            const index_face_wire: number = wires_i.indexOf(wire_i);
            if (index_face_wire === 0) {

                // special case, pgon boundary with verts, delete the pgon
                this.__delVert__PgonBoundaryWire3Edge(face_i);

            } else {

                // special case, pgon hole with verts, delete the hole
                this.__delVert__PgonHoleWire3Edge(face_i, wire_i);

            }
        } else if (!wire_is_closed && index_vert_i === 0) {

            // special case, open pline, delete start edge and vert
            this.__delVert__OpenPlineStart(wire_edges_i, wire_verts_i, vert_i);

        } else if (!wire_is_closed && index_vert_i === num_verts - 1) {

            // special case, open pline, delete end edge and vert
            this.__delVert__OpenPlineEnd(wire_edges_i, wire_verts_i, vert_i);

        } else {

            // standard case, delete the prev edge and reqire the next edge
            this.__delVert__StandardCase(wire_edges_i, vert_i, index_vert_i === 0);

            if (face_i !== undefined) {

                // for pgons, also update tris
                this._updateFaceTris(face_i);

            }
        }
    }
    /**
     * Special case, delete the pline
     * @param wire_i
     */
    private __delVert__OpenPline1Edge(wire_i: number) {
        const pline_i: number = this._geom_arrays.up_wires_plines[wire_i];
        this.delPlines(pline_i, false);
    }
    /**
     * Special case, delete either the pgon
     * @param face_i
     */
    private __delVert__PgonBoundaryWire3Edge(face_i: number) {
        const pgon_i: number = this._geom_arrays.up_faces_pgons[face_i];
        this.delPgons(pgon_i, false);
    }
    /**
     * Special case, delete either the hole
     * @param vert_i
     */
    private __delVert__PgonHoleWire3Edge(face_i: number, wire_i: number) {
    }
    /**
     * Special case, delete the first edge
     * @param vert_i
     */
    private __delVert__OpenPlineStart(wire_edges_i: number[], wire_verts_i: number[], vert_i: number) {
        const posi_i: number = this._geom_arrays.dn_verts_posis[vert_i];
        // vert_i is at the star of an open wire, we have one edge
        const start_edge_i: number = wire_edges_i[0];
        // delete the first edge
        this._geom_arrays.dn_edges_verts[start_edge_i] = null;
        delete this._geom_arrays.up_edges_wires[start_edge_i];
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.EDGE, start_edge_i);
        // update the second vert
        const second_vert_i: number = wire_verts_i[1];
        arrRem(this._geom_arrays.up_verts_edges[second_vert_i], start_edge_i);
        // update the wire
        arrRem(wire_edges_i, start_edge_i);
        // delete the vert
        this._geom_arrays.dn_verts_posis[vert_i] = null;
        delete this._geom_arrays.up_verts_edges[vert_i];
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_arrays.up_posis_verts[posi_i], vert_i);
    }
    /**
     * Special case, delete the last edge
     * @param vert_i
     */
    private __delVert__OpenPlineEnd(wire_edges_i: number[], wire_verts_i: number[], vert_i: number) {
        const posi_i: number = this._geom_arrays.dn_verts_posis[vert_i];
        // vert_i is at the end of an open wire, we have one edge
        const end_edge_i: number = wire_edges_i[wire_edges_i.length - 1];
        // delete the last edge
        this._geom_arrays.dn_edges_verts[end_edge_i] = null;
        delete this._geom_arrays.up_edges_wires[end_edge_i];
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.EDGE, end_edge_i);
        // update the one before last vert
        const before_last_vert_i: number = wire_verts_i[wire_verts_i.length - 2];
        arrRem(this._geom_arrays.up_verts_edges[before_last_vert_i], end_edge_i);
        // update the wire
        arrRem(wire_edges_i, end_edge_i);
        // delete the vert
        this._geom_arrays.dn_verts_posis[vert_i] = null;
        delete this._geom_arrays.up_verts_edges[vert_i];
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_arrays.up_posis_verts[posi_i], vert_i);
    }
    /**
     * Final case, delete the next edge, reqire the previous edge
     * For pgons, this does not update the tris
     * @param vert_i
     */
    private __delVert__StandardCase(wire_edges_i: number[], vert_i: number, is_first: boolean) {
        const posi_i: number = this._geom_arrays.dn_verts_posis[vert_i];
        // vert_i is in the middle of a wire, we must have two edges
        const edges_i: number[] = this._geom_arrays.up_verts_edges[vert_i];
        const prev_edge_i: number = is_first ? edges_i[1] : edges_i[0];
        const next_edge_i: number = is_first ? edges_i[0] : edges_i[1];
        // get the verts of the two edges
        const prev_edge_verts_i: number[] = this._geom_arrays.dn_edges_verts[prev_edge_i];
        const next_edge_verts_i: number[] = this._geom_arrays.dn_edges_verts[next_edge_i];
        const prev_vert_i: number = prev_edge_verts_i[0];
        const next_vert_i: number = next_edge_verts_i[1];
        // run some checks, TODO this can be removed later
        if (prev_vert_i === vert_i) { throw new Error('Unexpected vertex ordering 1'); }
        if (next_vert_i === vert_i) { throw new Error('Unexpected vertex ordering 2'); }
        if (prev_edge_verts_i[1] !== next_edge_verts_i[0]) { throw new Error('Unexpected vertex ordering 3'); }
        if (prev_edge_verts_i[1] !== vert_i) { throw new Error('Unexpected vertex ordering 4'); }
        // rewire the end vert of the previous edge to the end vert of the next edge
        prev_edge_verts_i[1] = next_vert_i;
        this._geom_arrays.up_verts_edges[next_vert_i][0] = prev_edge_i;
        // delete the next edge
        this._geom_arrays.dn_edges_verts[next_edge_i] = null;
        delete this._geom_arrays.up_edges_wires[next_edge_i];
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.EDGE, next_edge_i);
        // update the wire
        arrRem(wire_edges_i, next_edge_i);
        // delete the vert
        this._geom_arrays.dn_verts_posis[vert_i] = null;
        delete this._geom_arrays.up_verts_edges[vert_i];
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_arrays.up_posis_verts[posi_i], vert_i);
    }
    /**
     * Updates the tris in a face
     * @param face_i
     */
    private _updateFaceTris(face_i: number) {
        // get the wires
        const border_wire_i: number = this._geom_arrays.dn_faces_wirestris[face_i][0][0];
        // get the border and holes
        const holes_wires_i: number[] = [];
        const num_holes: number = this._geom_arrays.dn_faces_wirestris[face_i][0].length - 1;
        if (num_holes > 1) {
            for (let i = 1; i < num_holes + 1; i++) {
                const hole_wire_i: number = this._geom_arrays.dn_faces_wirestris[face_i][0][i];
                holes_wires_i.push(hole_wire_i);
            }
        }
        const tris_i: number[] = this._geom.add._addTris(border_wire_i, holes_wires_i);
        // delete the old tris
        for (const tri_i of this._geom_arrays.dn_faces_wirestris[face_i][1]) {
            // update the verts
            const verts_i: number[] = this._geom_arrays.dn_tris_verts[tri_i];
            for (const vert_i of verts_i) {
                delete this._geom_arrays.up_verts_tris[vert_i]; // up
            }
            // delete the tri
            this._geom_arrays.dn_tris_verts[tri_i] = null;
            delete this._geom_arrays.up_tris_faces[tri_i]; // up
        }
        // update down arrays
        this._geom_arrays.dn_faces_wirestris[face_i][1] = tris_i;
        // update up arrays
        for (const tri_i of tris_i) {
            this._geom_arrays.up_tris_faces[tri_i] = face_i;
        }
    }
}
