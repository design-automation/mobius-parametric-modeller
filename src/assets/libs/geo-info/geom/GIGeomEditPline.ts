import { TWire, IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for modifying plines.
 */
export class GIGeomEditPline {
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
     * Close a polyline.
     * ~
     * If the pline is already closed, do nothing.
     * ~
     */
    public closePline(pline_i: number): number {
        const wire_i: number = this.modeldata.geom.nav.navPlineToWire(pline_i);
        // get the wire start and end verts
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
        if (start_vert_i === end_vert_i) { return; }
        // add the edge to the model
        const new_edge_i: number = this.modeldata.geom.add._addEdge(end_vert_i, start_vert_i);
        // update the down arrays
        this._geom_maps.dn_wires_edges.get(wire_i).push(new_edge_i);
        // update the up arrays
        this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
        // return the new edge
        return new_edge_i;
    }
    /**
     * Open a wire, by deleting the last edge.
     * ~
     * If the wire is already open, do nothing.
     * ~
     * If the wire does not belong to a pline, then do nothing.
     * @param wire_i The wire to close.
     */
    public openPline(pline_i: number): void {
        const wire_i: number = this.modeldata.geom.nav.navPlineToWire(pline_i);
        // get the wire start and end verts
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        // check wire has more than two edges
        const num_edges: number = wire.length;
        if (num_edges < 3) { return; }
        // get start and end
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
        // if this wire is not closed, then return
        if (start_vert_i !== end_vert_i) { return; }
        // del the end edge from the pline
        throw new Error('Not implemented');
    }
    /**
     *
     * @param pline_i
     * @param posi_i
     * @param to_end
     */
    public appendVertToOpenPline(pline_i: number, posi_i: number, to_end: boolean): number {
        const wire_i: number = this.modeldata.geom.nav.navPlineToWire(pline_i);
        // get the wire start and end verts
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        if (to_end) {
            const end_edge_i: number = wire[wire.length - 1];
            const end_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
            // create one new vertex and one new edge
            const new_vert_i: number = this.modeldata.geom.add._addVertex(posi_i);
            const new_edge_i: number = this.modeldata.geom.add._addEdge(end_vert_i, new_vert_i);
            // update the down arrays
            wire.push(new_edge_i);
            // update the up arrays for edges to wires
            this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
            // return the new edge
            return new_edge_i;

        } else {
            const start_edge_i: number = wire[0];
            const start_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
            // create one new vertex and one new edge
            const new_vert_i: number = this.modeldata.geom.add._addVertex(posi_i);
            const new_edge_i: number = this.modeldata.geom.add._addEdge(new_vert_i, start_vert_i);
            // update the down arrays
            wire.splice(0, 0, new_edge_i);
            // update the up arrays for edges to wires
            this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
            // return the new edge
            return new_edge_i;
        }
    }
}
