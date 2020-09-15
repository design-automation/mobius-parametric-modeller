import { EEntType, IGeomMaps, TColl, IEntSets } from './common';
import { GIGeom } from './GIGeom';
import { arrRem, arrIdxAdd } from '../util/arrs';
import { vecDot } from '../geom/vectors';

/**
 * Class for deleting geometry.
 */
export class GIGeomDel {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
    // ============================================================================
    // Delete geometry
    // ============================================================================
    /**
     * Delete ents
     * @param ent_sets
     */
    public del(ent_sets: IEntSets): void {
        // delete the ents
        this.delColls(Array.from(ent_sets.colls_i));
        this.delPgons(Array.from(ent_sets.pgons_i), true);
        this.delPlines(Array.from(ent_sets.plines_i), true);
        this.delPoints(Array.from(ent_sets.points_i), true);
        this.delPosis(Array.from(ent_sets.posis_i));
        this.delUnusedPosis(Array.from(ent_sets.obj_posis_i));
    }
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
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            // update up arrays
            const verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
            if ( verts_i.length === 0) { // only delete posis with no verts
                this._geom_maps.up_posis_verts.delete(posi_i);
                // del time stamp
                this._geom.time_stamp.delEntTs(EEntType.POSI, posi_i);
                // save deleted posi
                deleted_posis_i.push(posi_i);
            }
            // no need to update down arrays
        }
        // delete all the posi attributes, for all posis that were deleted
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.POSI, deleted_posis_i);
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
            if (!this._geom_maps.up_posis_verts.has(posi_i)) { continue; } // already deleted
            // delete all verts for this posi
            const copy_verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i).slice(); // make a copy
            copy_verts_i.forEach(vert_i => this._geom.del_vert.delVert(vert_i));
            // delete the posi
            this._geom_maps.up_posis_verts.delete(posi_i);
            // del time stamp
            this._geom.time_stamp.delEntTs(EEntType.POSI, posi_i);
            // save deleted posi
            deleted_posis_i.push(posi_i);
            // no need to update down arrays
        }
        // delete all the posi attributes, for all posis that were deleted
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.POSI, deleted_posis_i);
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
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.POINT, points_i);
        // loop
        for (const point_i of points_i) {
            // first get all the arrays so we dont break navigation
            const vert_i: number = this._geom_maps.dn_points_verts.get(point_i);
            if (vert_i === undefined) { continue; } // already deleted
            const posi_i: number = this._geom_maps.dn_verts_posis.get(vert_i);
            // delete the point and check collections
            const colls_i: number[] = this._geom_maps.up_points_colls.get(point_i);
            if (colls_i) {
                colls_i.forEach( coll_i => arrRem(this._geom_maps.dn_colls_points.get(coll_i), point_i) );
            }
            this._geom_maps.dn_points_verts.delete(point_i);
            this._geom_maps.dn_points_verts.delete(point_i);
            // delete the vert by setting the up and down arrays to undefined
            this._geom_maps.dn_verts_posis.delete(vert_i);
            this._geom_maps.up_verts_points.delete(vert_i);
            // remove the vert from up_posis_verts
            const posi_verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
            arrRem(posi_verts_i, vert_i);
            // delete unused posis
            if (del_unused_posis) {
                this.delUnusedPosis(posi_i);
            }
            // del time stamp
            this._geom.time_stamp.delEntTs(EEntType.POINT, point_i);
        }
    }
    /**
     * Del plines.
     * Pline attributes will also be deleted.
     * @param plines_i
     */
    public delPlines(plines_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.PLINE, plines_i);
        // create array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        if (!plines_i.length) { return; }
        // loop
        for (const pline_i of plines_i) {
            // first get all the arrays so we dont break navigation
            const wire_i: number = this._geom_maps.dn_plines_wires.get(pline_i);
            if (wire_i === undefined) { continue; } // already deleted
            const edges_i: number[] = this._geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
            const verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            // delete the pline and check collections
            const colls_i: number[] = this._geom_maps.up_plines_colls.get(pline_i);
            if (colls_i) {
                colls_i.forEach( coll_i => arrRem(this._geom_maps.dn_colls_plines.get(coll_i), pline_i) );
            }
            this._geom_maps.dn_plines_wires.delete(pline_i);
            this._geom_maps.up_plines_colls.delete(pline_i);
            // delete the wire
            this._geom_maps.dn_wires_edges.delete(wire_i);
            this._geom_maps.up_wires_plines.delete(wire_i);
            // delete the edges
            edges_i.forEach( edge_i => {
                this._geom_maps.dn_edges_verts.delete(edge_i);
                this._geom_maps.up_edges_wires.delete(edge_i);
            });
            // delete the verts
            verts_i.forEach( vert_i => {
                this._geom_maps.dn_verts_posis.delete(vert_i);
                this._geom_maps.up_verts_edges.delete(vert_i);
            });
            // remove the verts from up_posis_verts
            for (const posi_i of posis_i) {
                const posi_verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
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
            // del time stamp
            this._geom.time_stamp.delEntTs(EEntType.PLINE, pline_i);
        }
    }
    /**
     * Del pgons.
     * Pgon attributes will also be deleted.
     * @param pgons_i
     */
    public delPgons(pgons_i: number|number[], del_unused_posis: boolean): void {
        // del attribs
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.PGON, pgons_i);
        // create array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        if (!pgons_i.length) { return; }
        // loop
        for (const pgon_i of pgons_i) {
            // first get all the arrays so we dont break navigation
            const face_i: number = this._geom_maps.dn_pgons_faces.get(pgon_i);
            if (face_i === undefined) { continue; } // already deleted
            const wires_i: number[] = this._geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
            const edges_i: number[] = this._geom.nav.navAnyToEdge(EEntType.PGON, pgon_i);
            const verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.PGON, pgon_i);
            const tris_i: number[] = this._geom.nav.navAnyToTri(EEntType.PGON, pgon_i);
            const posis_i: number[] = this._geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            // delete the pgon and check the collections
            const colls_i: number[] = this._geom_maps.up_pgons_colls.get(pgon_i);
            if (colls_i) {
                colls_i.forEach( coll_i => arrRem(this._geom_maps.dn_colls_pgons.get(coll_i), pgon_i) );
            }
            this._geom_maps.dn_pgons_faces.delete(pgon_i);
            this._geom_maps.up_pgons_colls.delete(pgon_i);
            // delete the face
            this._geom_maps.dn_faces_wires.delete(face_i);
            this._geom_maps.dn_faces_tris.delete(face_i);
            this._geom_maps.up_faces_pgons.delete(face_i);
            // delete the wires
            wires_i.forEach( wire_i => {
                this._geom_maps.dn_wires_edges.delete(wire_i);
                this._geom_maps.up_wires_faces.delete(wire_i);
            });
            // delete the edges
            edges_i.forEach( edge_i => {
                this._geom_maps.dn_edges_verts.delete(edge_i);
                this._geom_maps.up_edges_wires.delete(edge_i);
            });
            // delete the verts
            verts_i.forEach( vert_i => {
                this._geom_maps.dn_verts_posis.delete(vert_i);
                this._geom_maps.up_verts_edges.delete(vert_i);
                this._geom_maps.up_verts_tris.delete(vert_i);
            });
            // delete the tris
            tris_i.forEach( tri_i => {
                this._geom_maps.dn_tris_verts.delete(tri_i);
                this._geom_maps.up_tris_faces.delete(tri_i);
            });
            // clean up, posis up arrays point to verts that may have been deleted
            for (const posi_i of posis_i) {
                const posi_verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
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
            // del time stamp
            this._geom.time_stamp.delEntTs(EEntType.PGON, pgon_i);
        }
    }
    /**
     * Delete a collection.
     * Collection attributes will also be deleted.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    public delColls(colls_i: number|number[]): void {
        // del attribs
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.COLL, colls_i);
        // create array
        colls_i = (Array.isArray(colls_i)) ? colls_i : [colls_i];
        if (!colls_i.length) { return; }
        // loop
        for (const coll_i of colls_i) {
            const coll_parent: number = this._geom_maps.up_colls_colls.get(coll_i);
            if (coll_parent === undefined) { continue; } // already deleted
            // up arrays, delete points, plines, pgons
            this._geom_maps.up_colls_colls.delete(coll_i);
            const points_i: number[] = this._geom_maps.dn_colls_points.get(coll_i);
            points_i.forEach(point_i =>  {
                const other_colls_i: number[] = this._geom_maps.up_points_colls.get(point_i);
                arrRem(other_colls_i, coll_i);
                if (other_colls_i.length === 0) {
                    this._geom_maps.up_points_colls.delete(point_i);
                }
            });
            const plines_i: number[] = this._geom_maps.dn_colls_plines.get(coll_i);
            plines_i.forEach(pline_i =>  {
                const other_colls_i: number[] = this._geom_maps.up_plines_colls.get(pline_i);
                arrRem(other_colls_i, coll_i);
                if (other_colls_i.length === 0) {
                    this._geom_maps.up_plines_colls.delete(pline_i);
                }
            });
            const pgons_i: number[] = this._geom_maps.dn_colls_pgons.get(coll_i);
            pgons_i.forEach(pgon_i =>  {
                const other_colls_i: number[] = this._geom_maps.up_pgons_colls.get(pgon_i);
                arrRem(other_colls_i, coll_i);
                if (other_colls_i.length === 0) {
                    this._geom_maps.up_pgons_colls.delete(pgon_i);
                }
            });
            // down arrays
            this._geom_maps.dn_colls_points.delete(coll_i);
            this._geom_maps.dn_colls_plines.delete(coll_i);
            this._geom_maps.dn_colls_pgons.delete(coll_i);
            // del time stamp
            this._geom.time_stamp.delEntTs(EEntType.COLL, coll_i);
        }
        // check if the deleted coll is a parent of other colls
        const set_colls_i: Set<number> = new Set(colls_i);
        this._geom_maps.up_colls_colls.forEach( (coll_parent, coll_i) => {
            if (set_colls_i.has(coll_parent)) {
                this._geom_maps.up_colls_colls.set(coll_i, -1);
                // update time stamp
                this._geom.time_stamp.updateEntTs(EEntType.COLL, coll_i);
            }
        });
    }
}
