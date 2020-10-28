import { EEntType, TTri, TEdge, TWire, IGeomMaps, Txyz, TPgonTri, TPgon } from '../common';
import { arrRem } from '../../util/arrs';
import { GIModelData } from '../GIModelData';

/**
 * Class for geometry.
 */
export class GIGeomEditTopo {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
    /**
     * Insert a vertex into an edge and updates the wire with the new edge
     * ~
     * Applies to both plines and pgons.
     * ~
     * Plines can be open or closed.
     * ~
     */
    public insertVertIntoWire(edge_i: number, posi_i: number): number {
        const wire_i: number = this.modeldata.geom.nav.navEdgeToWire(edge_i);
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        const old_edge_verts_i: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const old_and_prev_edge_i: number[] = this._geom_maps.up_verts_edges.get(old_edge_verts_i[0]);
        const old_and_next_edge_i: number[] = this._geom_maps.up_verts_edges.get(old_edge_verts_i[1]);
        // check prev edge
        if (old_and_prev_edge_i.length === 2) {
            if (old_and_prev_edge_i[0] === edge_i) {
                throw new Error('Edges are in wrong order');
            }
        }
        // check next edge amd save the next edge
        if (old_and_next_edge_i.length === 2) {
            if (old_and_next_edge_i[1] === edge_i) {
                throw new Error('Edges are in wrong order');
            }
            this._geom_maps.up_verts_edges.set(old_edge_verts_i[1], [old_and_next_edge_i[1]]);
        } else {
            this._geom_maps.up_verts_edges.set(old_edge_verts_i[1], []);
        }
        // create one new vertex and one new edge
        const new_vert_i: number = this.modeldata.geom.add._addVertex(posi_i);
        this._geom_maps.up_verts_edges.set(new_vert_i, [edge_i]);
        const new_edge_i: number = this.modeldata.geom.add._addEdge(new_vert_i, old_edge_verts_i[1]);
        // update the down arrays
        old_edge_verts_i[1] = new_vert_i;
        wire.splice(wire.indexOf(edge_i), 1, edge_i, new_edge_i);
        // update the up arrays for edges to wires
        this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
        // return the new edge
        return new_edge_i;
    }
/**
     * Insert multiple vertices into an edge and updates the wire with the new edges
     * ~
     * Applies to both plines and pgons.
     * ~
     * Plines can be open or closed.
     * ~
     */
    public insertVertsIntoWire(edge_i: number, posis_i: number[]): number[] {
        // check that there are no duplicates in the list
        if (posis_i.length > 1) {
            posis_i = Array.from(new Set(posis_i));
        }
        // check tha the posis being inserted are not already the start or end of this edge
        const edge_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE,  edge_i);
        if (edge_posis_i[0] === posis_i[0]) {
            posis_i = posis_i.slice(1);
        }
        if (edge_posis_i[1] === posis_i[posis_i.length - 1]) {
            posis_i = posis_i.slice(0, posis_i.length - 1);
        }
        // if no more posis, then return empty list
        if (posis_i.length === 0) { return []; }
        // proceed to insert posis
        const wire_i: number = this.modeldata.geom.nav.navEdgeToWire(edge_i);
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        const end_vert_i: number = this._geom_maps.dn_edges_verts.get(edge_i)[1];
        const next_edge_i: number = this._geom_maps.up_verts_edges.get(end_vert_i)[1];
        // check next edge amd save the next edge
        if (next_edge_i !== undefined) {
            this._geom_maps.up_verts_edges.set(end_vert_i, [next_edge_i]); // there is next edge
        } else {
            this._geom_maps.up_verts_edges.set(end_vert_i, []); // there is no next edge
        }
        // create the new vertices
        const new_verts_i: number [] = [];
        for (const posi_i of posis_i) {
            const new_vert_i: number = this.modeldata.geom.add._addVertex(posi_i);
            new_verts_i.push(new_vert_i);
        }
        new_verts_i.push(end_vert_i);
        // update the down/ip arrays for teh old edge
        // the old edge becomes the first edge in this list, and it gets a new end vertex
        this._geom_maps.dn_edges_verts.get(edge_i)[1] = new_verts_i[0];
        this._geom_maps.up_verts_edges.set(new_verts_i[0], [edge_i]);
        // create the new edges
        const new_edges_i: number[] = [];
        for (let i = 0; i < new_verts_i.length - 1; i++) {
            const new_edge_i: number = this.modeldata.geom.add._addEdge(new_verts_i[i], new_verts_i[i + 1]);
            // update the up arrays for edges to wires
            this._geom_maps.up_edges_wires.set(new_edge_i, wire_i);
            // add to the list
            new_edges_i.push(new_edge_i);
        }
        // update the down arrays for the wire
        wire.splice(wire.indexOf(edge_i) + 1, 0, ...new_edges_i);
        // return the new edge
        return new_edges_i;
    }
    /**
     * Replace all positions in an entity with a new set of positions.
     * ~
     */
    public replacePosis(ent_type: EEntType, ent_i: number, new_posis_i: number[]): void {
        const old_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        if (old_posis_i.length !== new_posis_i.length) {
            throw new Error('Replacing positions operation failed due to incorrect number of positions.');
        }
        const old_posis_i_map: Map<number, number> = new Map(); // old_posi_i -> index
        for (let i = 0; i < old_posis_i.length; i++) {
            const old_posi_i: number = old_posis_i[i];
            old_posis_i_map[old_posi_i] = i;
        }
        const verts_i: number[] = this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
        for (const vert_i of verts_i) {
            const old_posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const i: number = old_posis_i_map[old_posi_i];
            const new_posi_i: number = new_posis_i[i];
            // set the down array
            this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
            // update the up arrays for the old posi, i.e. remove this vert
            arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
            // update the up arrays for the new posi, i.e. add this vert
            this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
        }
    }
    /**
     * Replace the position of a vertex with a new position.
     * ~
     * If the result is an edge with two same posis, then the vertex will be deleted if del_if_invalid = true.
     * If del_if_invalid = false, no action will be taken.
     * ~
     * Called by modify.Fuse() and poly2d.Stitch().
     */
    public replaceVertPosi(vert_i: number, new_posi_i: number, del_if_invalid: boolean = true): void {
        // special case
        // check if this is a vert for an edge
        const edges_i: number[] = this.modeldata.geom.nav.navVertToEdge(vert_i);
        const num_edges: number = edges_i.length;
        switch (num_edges) {
            case 1:
                // we must be at an edge at the start or end of an open wire
                const edge_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[0]);
                if (edge_posis_i[0] === new_posi_i || edge_posis_i[1]  === new_posi_i) {
                    // special case where start or end has new_posi_i
                    if (del_if_invalid) {
                        this.modeldata.geom.del_vert.delVert(vert_i);
                    }
                    return;
                }
                break;
            case 2:
                // we must be in the middle of a wire
                const prev_edge_i: number = edges_i[0];
                const next_edge_i: number = edges_i[1];
                const [a_posi_i, b1_posi_i]: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, prev_edge_i) as [number, number];
                const [b2_posi_i, c_posi_i]: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, next_edge_i) as [number, number];
                if (a_posi_i === new_posi_i && c_posi_i  === new_posi_i) {
                    // special case where both adjacent edges has new_posi_i
                    const [b2_vert_i, c_vert_i]: [number, number] =
                        this.modeldata.geom.nav.navEdgeToVert(next_edge_i) as [number, number];
                    if (vert_i !== b2_vert_i) {
                        throw new Error('Bad navigation in geometry data structure.');
                    }
                    if (del_if_invalid) {
                        this.modeldata.geom.del_vert.delVert(c_vert_i);
                        this.modeldata.geom.del_vert.delVert(vert_i);
                    }
                    return;
                } else if (a_posi_i === new_posi_i || c_posi_i === new_posi_i) {
                    // special case where one adjacent edges has new_posi_i
                    if (del_if_invalid) {
                        this.modeldata.geom.del_vert.delVert(vert_i);
                    }
                    return;
                }
                break;
            // default:
            //     break;
        }

        // normal case
        const old_posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
        // set the down array
        this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
        // update the up arrays for the old posi, i.e. remove this vert
        arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
        // update the up arrays for the new posi, i.e. add this vert
        this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
    }
    /**
     * Unweld the vertices on naked edges.
     * ~
     */
    public unweldVertsShallow(verts_i: number[]): number[] {
        // create a map, for each posi_i, count how many verts there are in the input verts
        const exist_posis_i_map: Map<number, number> = new Map(); // posi_i -> count
        for (const vert_i of verts_i) {
            const posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            if (!exist_posis_i_map.has(posi_i)) {
                exist_posis_i_map.set(posi_i, 0);
            }
            const vert_count: number = exist_posis_i_map.get(posi_i);
            exist_posis_i_map.set(posi_i, vert_count + 1);
        }
        // copy positions on the perimeter and make a map
        const old_to_new_posis_i_map: Map<number, number> = new Map();
        exist_posis_i_map.forEach( (vert_count, old_posi_i) => {
            const all_old_verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(old_posi_i);
            const all_vert_count: number = all_old_verts_i.length;
            if (vert_count !== all_vert_count) {
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    const new_posi_i: number = this.modeldata.geom.add.copyPosis(old_posi_i, true) as number;
                    old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                }
            }
        });
        // now go through the geom again and rewire to the new posis
        for (const vert_i of verts_i) {
            const old_posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            if (old_to_new_posis_i_map.has(old_posi_i)) {
                const new_posi_i: number = old_to_new_posis_i_map.get(old_posi_i);
                // update the down arrays
                this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
                // update the up arrays for the old posi, i.e. remove this vert
                arrRem(this._geom_maps.up_posis_verts.get(old_posi_i), vert_i);
                // update the up arrays for the new posi, i.e. add this vert
                this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
            }
        }
        // return all the new positions
        return Array.from(old_to_new_posis_i_map.values());
    }
    /**
     * Unweld all vertices by cloning the positions that are shared.
     * ~
     * Attributes on the positions are copied.
     * ~
     * @param verts_i
     */
    public cloneVertPositions(verts_i: number[]): number[] {
        const new_posis_i: number[] = [];
        for (const vert_i of verts_i) {
            const exist_posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const all_verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(exist_posi_i);
            const all_verts_count: number = all_verts_i.length;
            if (all_verts_count > 1) {
                const new_posi_i: number = this.modeldata.geom.add.copyPosis(exist_posi_i, true) as number;
                // update the down arrays
                this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
                // update the up arrays for the old posi, i.e. remove this vert
                arrRem(this._geom_maps.up_posis_verts.get(exist_posi_i), vert_i);
                // update the up arrays for the new posi, i.e. add this vert
                this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
                // add the new posi_i to the list, to be returned later
                new_posis_i.push(new_posi_i);
            }
        }
        // return all the new positions
        return new_posis_i;
    }
    /**
     * Weld all vertices by merging the positions that are equal, so that they become shared.
     * ~
     * The old positions are deleted if unused. Attributes on those positions are discarded.
     * ~
     * @param verts_i
     */
    public mergeVertPositions(verts_i: number[]): number {
        const ssid: number = this.modeldata.active_ssid;
        // get a list of unique posis to merge
        // at the same time, make a sparse array vert_i -> posi_i
        const map_posis_to_merge_i: Map<number, number[]> = new Map();
        const vert_i_to_posi_i: number[] = []; // sparese array
        for (const vert_i of verts_i) {
            const exist_posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            vert_i_to_posi_i[vert_i] = exist_posi_i;
            if (!map_posis_to_merge_i.has(exist_posi_i)) {
                map_posis_to_merge_i.set(exist_posi_i, []);
            }
            map_posis_to_merge_i.get(exist_posi_i).push(vert_i);
        }
        // calculate the new xyz
        // at the same time make a list of posis to del
        const posis_to_del_i: number[] = [];
        const new_xyz: Txyz = [0, 0, 0];
        for (const [exist_posi_i, merge_verts_i] of Array.from(map_posis_to_merge_i)) {
            const posi_xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(exist_posi_i);
            new_xyz[0] += posi_xyz[0];
            new_xyz[1] += posi_xyz[1];
            new_xyz[2] += posi_xyz[2];
            const all_verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(exist_posi_i);
            const all_verts_count: number = all_verts_i.length;
            if (all_verts_count === merge_verts_i.length) {
                posis_to_del_i.push(exist_posi_i);
            }
        }
        // make the new posi
        const num_posis: number = map_posis_to_merge_i.size;
        new_xyz[0] = new_xyz[0] / num_posis;
        new_xyz[1] = new_xyz[1] / num_posis;
        new_xyz[2] = new_xyz[2] / num_posis;
        const new_posi_i: number = this.modeldata.geom.add.addPosi() as number;
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, new_xyz);
        // replace the verts posi
        for (const vert_i of verts_i) {
            // update the down arrays
            this._geom_maps.dn_verts_posis.set(vert_i, new_posi_i);
            // update the up arrays for the old posi, i.e. remove this vert
            arrRem(this._geom_maps.up_posis_verts.get(vert_i_to_posi_i[vert_i]), vert_i);
            // update the up arrays for the new posi, i.e. add this vert
            this._geom_maps.up_posis_verts.get(new_posi_i).push(vert_i);
        }
        // del the posis that are no longer used, i.e. have zero verts
        this.modeldata.geom.snapshot.delPosis(ssid, posis_to_del_i);
        // return all the new positions
        return new_posi_i;
    }
    /**
     * Reverse the edges of a wire.
     * This lists the edges in reverse order, and flips each edge.
     * ~
     * The attributes will not be affected. So the order of edge attribtes will also become reversed.
     *
     * TODO
     * This does not reverse the order of the edges.
     * The method, getWireVertices() in GeomQuery returns the correct vertices.
     * However, you need to be careful with edge order.
     * The next edge after edge 0 may not be edge 1.
     * If reversed it will instead be the last edge.
     */
    public reverse(wire_i: number): void {
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        wire.reverse();
        // reverse the edges
        for (const edge_i of wire) {
            const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
            edge.reverse();
            // the verts pointing up to edges also need to be reversed
            const edges_i: number[] = this._geom_maps.up_verts_edges.get(edge[0]);
            edges_i.reverse();
        }
        // if this is the first wire in a face, reverse the triangles
        const pgon_i: number = this._geom_maps.up_wires_pgons.get(wire_i);
        if (pgon_i !== undefined) {
            const pgon: TPgon = this._geom_maps.dn_pgons_wires.get(pgon_i);
            const pgon_tris: TPgonTri = this._geom_maps.dn_pgons_tris.get(pgon_i);
            if (pgon[0] === wire_i) {
                for (const tri_i of pgon_tris) {
                    const tri: TTri = this._geom_maps.dn_tris_verts.get(tri_i);
                    tri.reverse();
                }
            }
        }
    }
    /**
     * Shifts the edges of a wire.
     * ~
     * The attributes will not be affected. For example, lets say a polygon has three edges
     * e1, e2, e3, with attribute values 5, 6, 7
     * If teh edges are shifted by 1, the edges will now be
     * e2, e3, e1, withh attribute values 6, 7, 5
     */
    public shift(wire_i: number, offset: number): void {
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        wire.unshift.apply( wire, wire.splice( offset, wire.length ) );
    }

}
