import { EEntType, IGeomMaps, EWireType } from './common';
import { GIGeom } from './GIGeom';

/**
 * Class for deleting geometry.
 */
export class GIGeomDelEdge {
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
     * Delete edges.
     * ~
     * If heal=true, the gap where teh edge was get healed
     *
     */
    public delEdges(edges_i: number|number[], del_unused_posis: boolean, heal: boolean): void {
        // del attribs
        this._geom.modeldata.attribs.add.delEntFromAttribs(EEntType.EDGE, edges_i);
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
