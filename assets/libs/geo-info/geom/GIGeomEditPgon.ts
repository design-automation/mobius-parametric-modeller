import { EEntType, IGeomMaps, Txyz } from '../common';
import { arrRem } from '../../util/arrs';
import { vecDot } from '../../geom/vectors';
import { GIModelData } from '../GIModelData';

/**
 * Class for geometry.
 */
export class GIGeomEditPgon {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Creates one or more holes in a polygon.
     * Updates time stamp for the polygon.
     * ~
     */
    public cutPgonHoles(pgon_i: number, posis_i_arr: number[][]): number[] {
        // get the normal of the face
        const face_normal: Txyz = this.modeldata.geom.query.getPgonNormal(pgon_i);
        // make the wires for the holes
        const hole_wires_i: number[] = [];
        for (const hole_posis_i of posis_i_arr) {
            const hole_vert_i_arr: number[] = hole_posis_i.map( posi_i => this.modeldata.geom.add._addVertex(posi_i));
            const hole_edges_i_arr: number[] = [];
            for (let i = 0; i < hole_vert_i_arr.length - 1; i++) {
                hole_edges_i_arr.push( this.modeldata.geom.add._addEdge(hole_vert_i_arr[i], hole_vert_i_arr[i + 1]));
            }
            hole_edges_i_arr.push( this.modeldata.geom.add._addEdge(hole_vert_i_arr[hole_vert_i_arr.length - 1], hole_vert_i_arr[0]));
            const hole_wire_i: number = this.modeldata.geom.add._addWire(hole_edges_i_arr, true);
            // get normal of wire and check if we need to reverse the wire
            const wire_normal: Txyz = this.modeldata.geom.query.getWireNormal(hole_wire_i);
            if (vecDot(face_normal, wire_normal) > 0) {
                this.modeldata.geom.edit_topo.reverse(hole_wire_i);
            }
            // add to list of holes
            hole_wires_i.push(hole_wire_i);
        }
        // create the holes, does everything at face level
        this._cutPgonHoles(pgon_i, hole_wires_i);
        // update the time stamp
        // snapshot: new ts no longer required
        // this.modeldata.geom.timestamp.updateObjsTs(EEntType.PGON, pgon_i);
        // no need to change either the up or down arrays
        // return the new wires
        return hole_wires_i;
    }
    /**
     * Retriangulate the polygons.
     * Updates time stamp for the polygons.
     * ~
     */
    public triPgons(pgons_i: number|number[]): void {
        if (!Array.isArray(pgons_i)) {
            const pgon_i: number = pgons_i as number;
            const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
            const outer_i: number = wires_i[0];
            const holes_i: number[] = wires_i.slice(1);
            // create the triangles
            const new_tris_i: number[] = this.modeldata.geom.add._addTris(outer_i, holes_i);
            // delete the old trianges
            const old_pgon_tris_i: number[] = this._geom_maps.dn_pgons_tris.get(pgon_i);
            for (const old_face_tri_i of old_pgon_tris_i) {
                // verts to tris
                for (const vert_i of this._geom_maps.dn_tris_verts.get(old_face_tri_i)) {
                    const vert_tris_i: number[] = this._geom_maps.up_verts_tris.get(vert_i);
                    arrRem(vert_tris_i, old_face_tri_i);
                }
                // tris to verts
                this._geom_maps.dn_tris_verts.delete(old_face_tri_i);
                // tris to faces
                this._geom_maps.up_tris_pgons.delete(old_face_tri_i);
            }
            // update up array for tri to pgon
            for (const new_tri_i of new_tris_i) {
                this._geom_maps.up_tris_pgons.set(new_tri_i, pgon_i);
            }
            // update down array for pgon to tri
            this._geom_maps.dn_pgons_tris.set(pgon_i, new_tris_i);
        } else { // An array of pgons
            pgons_i.forEach(pgon_i => this.triPgons(pgon_i));
        }
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
    private _cutPgonHoles(pgon_i: number, hole_wires_i: number[]): number {
        // get the wires and triangles arrays
        const pgon_wires_i: number[] = this._geom_maps.dn_pgons_wires.get(pgon_i);
        const old_pgon_tris_i: number[] = this._geom_maps.dn_pgons_tris.get(pgon_i);
        // get the outer wire
        const outer_wire_i: number = pgon_wires_i[0];
        // get the hole wires
        const all_hole_wires_i: number[] = [];
        if (pgon_wires_i.length > 1) {
            pgon_wires_i.slice(1).forEach(wire_i => all_hole_wires_i.push(wire_i));
        }
        hole_wires_i.forEach(wire_i => all_hole_wires_i.push(wire_i));
        // create the triangles
        const new_tris_i: number[] = this.modeldata.geom.add._addTris(outer_wire_i, all_hole_wires_i);
        // create the wires
        const new_wires_i: number[] = pgon_wires_i.concat(hole_wires_i);
        // update down arrays
        this._geom_maps.dn_pgons_wires.set(pgon_i, new_wires_i);
        this._geom_maps.dn_pgons_tris.set(pgon_i, new_tris_i);
        // update up arrays
        hole_wires_i.forEach(hole_wire_i => this._geom_maps.up_wires_pgons.set(hole_wire_i, pgon_i));
        new_tris_i.forEach( tri_i => this._geom_maps.up_tris_pgons.set(tri_i, pgon_i ));
        // delete the old trianges
        for (const old_face_tri_i of old_pgon_tris_i) {
            // remove these deleted tris from the verts
            for (const vert_i of this._geom_maps.dn_tris_verts.get(old_face_tri_i)) {
                const tris_i: number[] = this._geom_maps.up_verts_tris.get(vert_i);
                arrRem(tris_i, old_face_tri_i);
            }
            // tris to verts
            this._geom_maps.dn_tris_verts.delete(old_face_tri_i);
            // tris to faces
            this._geom_maps.up_tris_pgons.delete(old_face_tri_i);
        }
        // return the numeric index of the pgon
        return pgon_i;
    }

    /**
     * Updates the tris in a face
     * @param pgon_i
     */
    private _updatePgonTris(pgon_i: number) {
        const wires_i: number[] = this._geom_maps.dn_pgons_wires.get(pgon_i);
        // get the wires
        const border_wire_i: number = wires_i[0];
        // get the border and holes
        const holes_wires_i: number[] = wires_i.slice(1);
        const tris_i: number[] = this.modeldata.geom.add._addTris(border_wire_i, holes_wires_i);
        // delete the old tris
        for (const tri_i of this._geom_maps.dn_pgons_tris.get(pgon_i)) {
            // update the verts
            const verts_i: number[] = this._geom_maps.dn_tris_verts.get(tri_i);
            for (const vert_i of verts_i) {
                this._geom_maps.up_verts_tris.delete(vert_i); // up
            }
            // tris to verts
            this._geom_maps.dn_tris_verts.delete(tri_i); // down
            // tris to pgons
            this._geom_maps.up_tris_pgons.delete(tri_i); // up
        }
        // update down arrays
        this._geom_maps.dn_pgons_tris.set(pgon_i, tris_i);
        // update up arrays
        for (const tri_i of tris_i) {
            this._geom_maps.up_tris_pgons.set(tri_i, pgon_i);
        }
    }
}
