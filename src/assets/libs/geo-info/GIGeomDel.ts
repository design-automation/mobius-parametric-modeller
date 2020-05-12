import { EEntType, TTri, TEdge, TWire, TFace, IGeomArrays, Txyz, TColl, TVert, EWireType } from './common';
import { GIGeom } from './GIGeom';
import { arrRem, arrIdxAdd } from '../util/arrs';
import { vecDot } from '../geom/vectors';

/**
 * Class for deleting geometry.
 */
export class GIGeomDel {
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
            if ( !verts_i || verts_i.length === 0) { // only delete posis with no verts
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
            copy_verts_i.forEach(vert_i => this._geom.del_vert.delVert(vert_i));
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
                if (coll !== null) {
                    const coll_points_i: number[] = coll[1];
                    arrRem(coll_points_i, point_i);
                }
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
            const edges_i: number[] = this._geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
            const verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            // delete the pline and check collections
            this._geom_arrays.dn_plines_wires[pline_i] = null;
            for (const coll of this._geom_arrays.dn_colls_objs) {
                if (coll !== null) {
                    const coll_plines_i: number[] = coll[2];
                    arrRem(coll_plines_i, pline_i);
                }
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
            const wires_i: number[] = this._geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
            const edges_i: number[] = this._geom.nav.navAnyToEdge(EEntType.PGON, pgon_i);
            const verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.PGON, pgon_i);
            const tris_i: number[] = this._geom.nav.navAnyToTri(EEntType.PGON, pgon_i);
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            // delete the pgon and check the collections
            this._geom_arrays.dn_pgons_faces[pgon_i] = null;
            for (const coll of this._geom_arrays.dn_colls_objs) {
                if (coll !== null) {
                    const coll_pgons_i: number[] = coll[3];
                    arrRem(coll_pgons_i, pgon_i);
                }
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
        // check parents
        const set_colls_i: Set<number> = new Set(colls_i);
        for (const coll of this._geom_arrays.dn_colls_objs) {
            if (coll !== null && set_colls_i.has(coll[0])) {
                coll[0] = -1;
            }
        }
    }
    /**
     * Delete edges.
     * ~
     * If heal=true, the gap where teh edge was get healed
     *
     */
    public delEdges(edges_i: number|number[], del_unused_posis: boolean, heal: boolean): void {
        // del attribs
        this._geom.model.attribs.add.delEntFromAttribs(EEntType.EDGE, edges_i);
        // create array
        edges_i = (Array.isArray(edges_i)) ? edges_i : [edges_i];
        if (!edges_i.length) { return; }
        // loop
        for (const edge_i of edges_i) {
            if (!this._geom.query.entExists(EEntType.EDGE, edge_i)) { continue; } // already deleted
            // first get all the arrays so we dont break navigation
            const wire_i: number = this._geom.nav.navEdgeToWire(edge_i);
            const face_i: number = this._geom.nav.navWireToFace(wire_i); // may be undefined
            const verts_i: number[] = this._geom.nav.navEdgeToVert(edge_i);
            const posi0_i: number = this._geom.nav.navVertToPosi(verts_i[0]);
            const posi1_i: number = this._geom.nav.navVertToPosi(verts_i[1]);
            // getthe type of wire
            const wire_typ: EWireType = this._geom.query.getWireType(wire_i);
            // TODO
            throw new Error('Not implemented.');
        }
    }
}
