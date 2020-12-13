import { EEntType, IGeomMaps } from '../common';
import { arrRem } from '../../util/arrs';
import { GIModelData } from '../GIModelData';

/**
 * Class for deleting geometry.
 */
export class GIGeomDelVert {
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
     * Call by GIGeomEditTopo.replaceVertPosi()
     *
     * Checks time stamps.
     * @param vert_i
     */
    public delVert(vert_i: number): void {
        const ssid: number = this.modeldata.active_ssid;
        // pgon
        if (this.modeldata.geom._geom_maps.up_verts_tris.has(vert_i)) {
            const pgon_i: number = this.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i)[0];
            this.delPgonVerts(pgon_i, [vert_i]);
            return;
        }
        // point
        if (this.modeldata.geom._geom_maps.up_verts_points.has(vert_i)) {
            const point_i: number = this.modeldata.geom._geom_maps.up_verts_points.get(vert_i);
            this.modeldata.geom.snapshot.delPoints(ssid, point_i);
            return;
        }
        // pline
        const pline_i: number = this.modeldata.geom.nav.navAnyToPline(EEntType.VERT, vert_i)[0];
        this.delPgonVerts(pline_i, [vert_i]);
        return;
    }
    /**
     * Deletes multiple verts in a pline.
     *
     * Checks time stamps.
     */
    public delPlineVerts(pline_i: number, verts_i: number[]): void {
        const ssid: number = this.modeldata.active_ssid;
        // get the posis, edges, and wires, and other info
        const wire_i: number = this._geom_maps.dn_plines_wires.get(pline_i);
        const wire_edges_i: number[] = this._geom_maps.dn_wires_edges.get(wire_i);
        const wire_verts_i: number[] = this.modeldata.geom.query.getWireVerts(wire_i);
        const wire_is_closed: boolean = this.modeldata.geom.query.isWireClosed(wire_i);
        const num_verts: number = wire_verts_i.length;
        // do we have to delete the whole pline?
        if (num_verts - verts_i.length < 2) {
            const pline_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
            this.modeldata.geom.snapshot.delPlines(ssid, pline_i);
            this.modeldata.geom.snapshot.delUnusedPosis(ssid, pline_posis_i);
        }
        // check the object time stamp
        this.modeldata.getObjsCheckTs(EEntType.PLINE, pline_i);
        // delete the verts
        for (const vert_i of verts_i) {
            // check, has it already been deleted
            if (!this._geom_maps.dn_verts_posis.has(vert_i)) { return; }
            // get the index of this vert
            const index_vert_i: number = wire_verts_i.indexOf(vert_i);
             // update the edges and wires
            if (!wire_is_closed && num_verts === 2) {
                // special case, open pline with 2 verts
                this.__delVert__OpenPline1Edge(wire_i);
            } else if (!wire_is_closed && index_vert_i === 0) {
                // special case, open pline, delete start edge and vert
                this.__delVert__OpenPlineStart(wire_edges_i, wire_verts_i, vert_i);
            } else if (!wire_is_closed && index_vert_i === num_verts - 1) {
                // special case, open pline, delete end edge and vert
                this.__delVert__OpenPlineEnd(wire_edges_i, wire_verts_i, vert_i);
            } else {
                // standard case, delete the prev edge and reqire the next edge
                this.__delVert__StandardCase(wire_edges_i, vert_i);
            }
        }
    }
    /**
     * Deletes multiple verts in a pline.
     *
     * Checks time stamps.
     */
    public delPgonVerts(pgon_i: number, verts_i: number[]): void {
        const ssid: number = this.modeldata.active_ssid;
        // get the pwires, and total num verts in whole pgon
        const wires_i: number[] = this._geom_maps.dn_pgons_wires.get(pgon_i);
        const num_verts: number = this.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i).length;
        // do we have to delete the whole pgon?
        if (num_verts - verts_i.length < 3) {
            const pgon_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            this.modeldata.geom.snapshot.delPgons(ssid, pgon_i);
            this.modeldata.geom.snapshot.delUnusedPosis(ssid, pgon_posis_i);
        }
        // check the object time stamp
        this.modeldata.getObjsCheckTs(EEntType.PGON, pgon_i);
        // delete the verts
        for (const vert_i of verts_i) {
            const wire_i: number = this.modeldata.geom.nav.navAnyToWire(EEntType.VERT, vert_i)[0];
            const wire_edges_i: number[] = this._geom_maps.dn_wires_edges.get(wire_i);
            // update the edges and wires
            if (num_verts === 3) {
                const index_face_wire: number = wires_i.indexOf(wire_i);
                // special case, pgon with three verts
                if (index_face_wire === 0) {
                    // special case, pgon boundary with verts, delete the pgon
                    this.__delVert__PgonBoundaryWire3Edge(pgon_i);
                } else {
                    // special case, pgon hole with verts, delete the hole
                    this.__delVert__PgonHoleWire3Edge(pgon_i, wire_i);
                }
            } else {
                // standard case, delete the prev edge and reqire the next edge
                this.__delVert__StandardCase(wire_edges_i, vert_i);
                // for pgons, also update tris
            }
        }
        this.modeldata.geom.edit_pgon.triPgons(pgon_i);
    }
    /**
     * Special case, delete the pline
     * @param wire_i
     */
    private __delVert__OpenPline1Edge(wire_i: number) {
        const ssid: number = this.modeldata.active_ssid;
        const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
        this.modeldata.geom.snapshot.delPlines(ssid, pline_i);
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
        this.modeldata.attribs.del.delEnt(EEntType.EDGE, start_edge_i);
        // update the second vert
        const second_vert_i: number = wire_verts_i[1];
        arrRem(this._geom_maps.up_verts_edges.get(second_vert_i), start_edge_i);
        // update the wire
        arrRem(wire_edges_i, start_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this.modeldata.attribs.del.delEnt(EEntType.VERT, vert_i);
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
        this.modeldata.attribs.del.delEnt(EEntType.EDGE, end_edge_i);
        // update the one before last vert
        const before_last_vert_i: number = wire_verts_i[wire_verts_i.length - 2];
        arrRem(this._geom_maps.up_verts_edges.get(before_last_vert_i), end_edge_i);
        // update the wire
        arrRem(wire_edges_i, end_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this.modeldata.attribs.del.delEnt(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
    /**
     * Special case, delete the pgon
     * @param face_i
     */
    private __delVert__PgonBoundaryWire3Edge(pgon_i: number) {
        const ssid: number = this.modeldata.active_ssid;
        // TODO do we need to del posis?
        this.modeldata.geom.snapshot.delPgons(ssid, pgon_i);
    }
    /**
     * Special case, delete either the hole
     * @param vert_i
     */
    private __delVert__PgonHoleWire3Edge(pgon_i: number, wire_i: number) {
        // TODO
        console.log('Not implemented: Deleting posis in holes.');
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
        this.modeldata.attribs.del.delEnt(EEntType.EDGE, next_edge_i);
        // update the wire
        arrRem(wire_edges_i, next_edge_i);
        // delete the vert
        this._geom_maps.dn_verts_posis.delete(vert_i);
        this._geom_maps.up_verts_edges.delete(vert_i);
        this.modeldata.attribs.del.delEnt(EEntType.VERT, vert_i);
        // update the posis
        arrRem(this._geom_maps.up_posis_verts.get(posi_i), vert_i);
    }
}
