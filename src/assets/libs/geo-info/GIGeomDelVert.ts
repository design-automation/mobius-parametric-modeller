import { EEntType, IGeomMaps } from './common';
import { GIGeom } from './GIGeom';
import { arrRem } from '../util/arrs';

/**
 * Class for deleting geometry.
 */
export class GIGeomDelVert {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
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
    public delVert(vert_i: number): void {
        // check, has it already been deleted
        if (!this._geom_maps.dn_verts_posis.has(vert_i)) { return; }
        // check, is this a point, then delete the point and vertex
        const point_i: number = this._geom_maps.up_verts_points.get(vert_i); // this may be undefined
        if (point_i !== undefined) {
            this._geom.del.delPoints(point_i, false);
            return;
        }
        // get the posis, edges, and wires, and other info
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
        const wire_i: number = this._geom_maps.up_edges_wires.get(edges_i[0]);
        const face_i: number = this._geom_maps.up_wires_faces.get(wire_i); // this may be undefined
        const wire_edges_i: number[] = this._geom_maps.dn_wires_edges.get(wire_i);
        const wire_verts_i: number[] = this._geom.nav.navAnyToVert(EEntType.WIRE, wire_i);
        const wire_is_closed: boolean = this._geom.query.isWireClosed(wire_i);
        const index_vert_i: number = wire_verts_i.indexOf(vert_i);
        const num_verts: number = wire_verts_i.length;

        // update the edges and wires
        if (!wire_is_closed && num_verts === 2) {

            // special case, open pline with 2 verts
            this.__delVert__OpenPline1Edge(wire_i);

        } else if (face_i !== undefined && num_verts === 3) {

            // special case, pgon with three verts
            const wires_i: number[] = this._geom_maps.dn_faces_wires.get(face_i);
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

            // time stamp
            const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
            this._geom.time_stamp.updateObjsTs(EEntType.PLINE, pline_i);

        } else if (!wire_is_closed && index_vert_i === num_verts - 1) {

            // special case, open pline, delete end edge and vert
            this.__delVert__OpenPlineEnd(wire_edges_i, wire_verts_i, vert_i);

            // time stamp
            const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
            this._geom.time_stamp.updateObjsTs(EEntType.PLINE, pline_i);

        } else {

            // standard case, delete the prev edge and reqire the next edge
            this.__delVert__StandardCase(wire_edges_i, vert_i);

            if (face_i === undefined) {

                // time stamp
                const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
                this._geom.time_stamp.updateObjsTs(EEntType.PLINE, pline_i);

            } else {

                // for pgons, also update tris
                const pgon_i: number = this._geom.nav.navFaceToPgon(face_i);
                this._geom.modify_pgon.triPgons(pgon_i);

                // triPgons() updates the time stamp

            }
        }
    }
    /**
     * Special case, delete the pline
     * @param wire_i
     */
    private __delVert__OpenPline1Edge(wire_i: number) {
        const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
        this._geom.del.delPlines(pline_i, false);
    }
    /**
     * Special case, delete either the pgon
     * @param face_i
     */
    private __delVert__PgonBoundaryWire3Edge(face_i: number) {
        const pgon_i: number = this._geom_maps.up_faces_pgons.get(face_i);
        this._geom.del.delPgons(pgon_i, false);
    }
    /**
     * Special case, delete either the hole
     * @param vert_i
     */
    private __delVert__PgonHoleWire3Edge(face_i: number, wire_i: number) {
        // TODO
        console.log('not implemented');
    }
    /**
     * Special case, delete the first edge
     * @param vert_i
     */
    private __delVert__OpenPlineStart(wire_edges_i: number[], wire_verts_i: number[], vert_i: number) {
        const posi_i: number = this._geom_maps.dn_verts_posis.get(vert_i);
        // vert_i is at the star of an open wire, we have one edge
        const start_edge_i: number = wire_edges_i[0];
        // delete the first edge
        this._geom_maps.dn_edges_verts.delete(start_edge_i);
        this._geom_maps.up_edges_wires.delete(start_edge_i);
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.EDGE, start_edge_i);
        // update the second vert
        const second_vert_i: number = wire_verts_i[1];
        arrRem(this._geom_maps.up_verts_edges.get(second_vert_i), start_edge_i);
        // update the wire
        arrRem(wire_edges_i, start_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
    /**
     * Special case, delete the last edge
     * @param vert_i
     */
    private __delVert__OpenPlineEnd(wire_edges_i: number[], wire_verts_i: number[], vert_i: number) {
        const posi_i: number = this._geom_maps.dn_verts_posis.get(vert_i);
        // vert_i is at the end of an open wire, we have one edge
        const end_edge_i: number = wire_edges_i[wire_edges_i.length - 1];
        // delete the last edge
        this._geom_maps.dn_edges_verts.delete(end_edge_i);
        this._geom_maps.up_edges_wires.delete(end_edge_i);
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.EDGE, end_edge_i);
        // update the one before last vert
        const before_last_vert_i: number = wire_verts_i[wire_verts_i.length - 2];
        arrRem(this._geom_maps.up_verts_edges.get(before_last_vert_i), end_edge_i);
        // update the wire
        arrRem(wire_edges_i, end_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
    /**
     * Final case, delete the next edge, reqire the previous edge
     * For pgons, this does not update the tris
     * @param vert_i
     */
    private __delVert__StandardCase(wire_edges_i: number[], vert_i: number) {
        const posi_i: number = this._geom_maps.dn_verts_posis.get(vert_i);
        // vert_i is in the middle of a wire, we must have two edges
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
        const prev_edge_i: number = edges_i[0]; // is_first ? edges_i[1] : edges_i[0];
        const next_edge_i: number = edges_i[1]; // is_first ? edges_i[0] : edges_i[1];
        // get the verts of the two edges
        const prev_edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(prev_edge_i);
        const next_edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(next_edge_i);
        const prev_vert_i: number = prev_edge_verts_i[0];
        const next_vert_i: number = next_edge_verts_i[1];
        // console.log(wire_edges_i);
        // console.log(vert_i);
        // console.log(is_first);
        // console.log(edges_i);
        // console.log(prev_edge_i, next_edge_i)
        // console.log(prev_edge_verts_i, next_edge_verts_i)
        // console.log(prev_vert_i, next_vert_i)
        // run some checks
        if (prev_vert_i === vert_i) {throw new Error('Unexpected vertex ordering 1'); }
        if (next_vert_i === vert_i) { throw new Error('Unexpected vertex ordering 2'); }
        if (prev_edge_verts_i[1] !== next_edge_verts_i[0]) { throw new Error('Unexpected vertex ordering 3'); }
        if (prev_edge_verts_i[1] !== vert_i) { throw new Error('Unexpected vertex ordering 4'); }
        // rewire the end vert of the previous edge to the end vert of the next edge
        prev_edge_verts_i[1] = next_vert_i;
        this._geom_maps.up_verts_edges.get(next_vert_i)[0] = prev_edge_i;
        // delete the next edge
        this._geom_maps.dn_edges_verts.delete(next_edge_i);
        this._geom_maps.up_edges_wires.delete(next_edge_i);
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.EDGE, next_edge_i);
        // update the wire
        arrRem(wire_edges_i, next_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
}
