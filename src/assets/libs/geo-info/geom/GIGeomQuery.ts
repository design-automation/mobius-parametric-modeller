
import {  EEntType, IGeomMaps, EEntStrToGeomMaps, TWire, Txyz, TEntTypeIdx,
    EWireType, TEdge, IEntSets } from '../common';
import { vecFromTo, vecCross, vecDiv, vecNorm, vecLen, vecDot } from '../../geom/vectors';
import * as Mathjs from 'mathjs';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export class GIGeomQuery {
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
    // Entities
    // ============================================================================
    /**
     * Returns a list of indices for ents.
     * @param ent_type
     */
    public getEnts(ent_type: EEntType): number[] {
        const geom_map_key: string = EEntStrToGeomMaps[ent_type];
        // collections
        if (ent_type === EEntType.COLL) { return Array.from(this._geom_maps[geom_map_key]); }
        // get ents indices array from down arrays
        const geom_map: Map<number, any> = this._geom_maps[geom_map_key];
        return Array.from(geom_map.keys());
    }
    /**
     * Returns the number of entities
     */
    public numEnts(ent_type: EEntType): number {
        const geom_array_key: string = EEntStrToGeomMaps[ent_type];
        return this._geom_maps[geom_array_key].size;
    }
    /**
     * Returns the number of entities for [posis, point, polylines, polygons, collections].
     */
    public numEntsAll(): number[] {
        return [
            this.numEnts(EEntType.POSI),
            this.numEnts(EEntType.POINT),
            this.numEnts(EEntType.PLINE),
            this.numEnts(EEntType.PGON),
            this.numEnts(EEntType.COLL)
        ];
    }
    /**
     * Check if an entity exists
     * @param ent_type
     * @param index
     */
    public entExists(ent_type: EEntType, index: number): boolean {
        const geom_maps_key: string = EEntStrToGeomMaps[ent_type];
        return this._geom_maps[geom_maps_key].has(index);
    }
    /**
     * Fill a map of sets of unique indexes
     */
    public getEntsMap(ents: TEntTypeIdx[], ent_types: number[]): Map<number, Set<number>> {
        const set_ent_types: Set<number> = new Set(ent_types);
        const map: Map<number, Set<number>> = new Map();
        ent_types.forEach( ent_type => map.set(ent_type, new Set()) );
        for (const [ent_type, ent_i] of ents) {
            if (set_ent_types.has(EEntType.COLL)) {
                this.modeldata.geom.nav.navAnyToColl(ent_type, ent_i).forEach( coll_i => map.get(EEntType.COLL).add(coll_i) );
            }
            if (set_ent_types.has(EEntType.PGON)) {
                this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i).forEach( pgon_i => map.get(EEntType.PGON).add(pgon_i) );
            }
            if (set_ent_types.has(EEntType.PLINE)) {
                this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i).forEach( pline_i => map.get(EEntType.PLINE).add(pline_i) );
            }
            if (set_ent_types.has(EEntType.POINT)) {
                this.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i).forEach( point_i => map.get(EEntType.POINT).add(point_i) );
            }
            if (set_ent_types.has(EEntType.WIRE)) {
                this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i).forEach( wire_i => map.get(EEntType.WIRE).add(wire_i) );
            }
            if (set_ent_types.has(EEntType.EDGE)) {
                this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i).forEach( edge_i => map.get(EEntType.EDGE).add(edge_i) );
            }
            if (set_ent_types.has(EEntType.VERT)) {
                this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i).forEach( vert_i => map.get(EEntType.VERT).add(vert_i) );
            }
            if (set_ent_types.has(EEntType.POSI)) {
                this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i).forEach( posi_i => map.get(EEntType.POSI).add(posi_i) );
            }
        }
        return map;
    }
    /**
     * Returns true if the first coll is a descendent of the second coll.
     * @param coll_i
     */
    public isCollDescendent(coll1_i: number, coll2_i: number): boolean {
        const ssid: number = this.modeldata.active_ssid;
        let parent_coll_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, coll1_i);
        while (parent_coll_i !== undefined) {
            if (parent_coll_i === coll2_i) { return true; }
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return false;
    }
    /**
     * Returns true if the first coll is an ancestor of the second coll.
     * @param coll_i
     */
    public isCollAncestor(coll1_i: number, coll2_i: number): boolean {
        const ssid: number = this.modeldata.active_ssid;
        let parent_coll_i: number = this.modeldata.geom.snapshot.getCollParent(ssid, coll2_i);
        while (parent_coll_i !== undefined) {
            if (parent_coll_i === coll1_i) { return true; }
            parent_coll_i = this.modeldata.geom.snapshot.getCollParent(ssid, parent_coll_i);
        }
        return false;
    }
    // ============================================================================
    // Posis
    // ============================================================================
    /**
     * Returns a list of indices for all posis that have no verts
     */
    public getUnusedPosis(): number[] {
        const posis_i: number[] = [];
        this._geom_maps.up_posis_verts.forEach( (posi, posi_i) => {
            if (posi.length === 0) { posis_i.push(posi_i); }
        });
        return posis_i;
    }
    // ============================================================================
    // Verts
    // ============================================================================
    /**
     * Get two edges that are adjacent to this vertex that are both not zero length.
     * In some cases wires and polygons have edges that are zero length.
     * This causes problems for calculating normals etc.
     * The return value can be either one edge (in open polyline [null, edge_i], [edge_i, null])
     * or two edges (in all other cases) [edge_i, edge_i].
     * If the vert has no non-zero edges, then [null, null] is returned.
     * @param vert_i
     */
    public getVertNonZeroEdges(vert_i: number): number[] {
        // get the wire start and end verts
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
        const posi_coords: Txyz[] = [];
        // get the first edge
        let edge0 = null;
        if (edges_i[0] !== null || edges_i[0] !== undefined) {
            let prev_edge_i: number = edges_i[0];
            while (edge0 === null) {
                if (prev_edge_i === edges_i[1]) { break; }
                const edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(prev_edge_i);
                // first
                const posi0_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[0]);
                if ( posi_coords[posi0_i] === undefined) {
                    posi_coords[posi0_i] = this.modeldata.attribs.posis.getPosiCoords(posi0_i);
                }
                const xyz0: Txyz = posi_coords[posi0_i];
                // second
                const posi1_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[1]);
                if ( posi_coords[posi1_i] === undefined) {
                    posi_coords[posi1_i] = this.modeldata.attribs.posis.getPosiCoords(posi1_i);
                }
                const xyz1: Txyz = posi_coords[posi1_i];
                // check
                if (Math.abs(xyz0[0] - xyz1[0]) > 0 || Math.abs(xyz0[1] - xyz1[1]) > 0 || Math.abs(xyz0[2] - xyz1[2]) > 0) {
                    edge0 = prev_edge_i;
                } else {
                    prev_edge_i = this._geom_maps.up_verts_edges.get(edge_verts_i[0])[0];
                    if (prev_edge_i === null || prev_edge_i === undefined) { break; }
                }
            }
        }
        // get the second edge
        let edge1 = null;
        if (edges_i[1] !== null || edges_i[1] !== undefined) {
            let next_edge_i: number = edges_i[1];
            while (edge1 === null) {
                if (next_edge_i === edges_i[0]) { break; }
                const edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(next_edge_i);
                // first
                const posi0_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[0]);
                if ( posi_coords[posi0_i] === undefined) {
                    posi_coords[posi0_i] = this.modeldata.attribs.posis.getPosiCoords(posi0_i);
                }
                const xyz0: Txyz = posi_coords[posi0_i];
                // second
                const posi1_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[1]);
                if ( posi_coords[posi1_i] === undefined) {
                    posi_coords[posi1_i] = this.modeldata.attribs.posis.getPosiCoords(posi1_i);
                }
                const xyz1: Txyz = posi_coords[posi1_i];
                // check
                if (Math.abs(xyz0[0] - xyz1[0]) > 0 || Math.abs(xyz0[1] - xyz1[1]) > 0 || Math.abs(xyz0[2] - xyz1[2]) > 0) {
                    edge1 = next_edge_i;
                } else {
                    next_edge_i = this._geom_maps.up_verts_edges.get(edge_verts_i[1])[1];
                    if (next_edge_i === null || next_edge_i === undefined) { break; }
                }
            }
        }
        // return the two edges, they can be null
        return [edge0, edge1];
    }
    // ============================================================================
    // Edges
    // ============================================================================
    /**
     * Get the next edge in a sequence of edges
     * @param edge_i
     */
    public getNextEdge(edge_i: number): number {
        // get the wire start and end verts
        const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(edge[1]);
        if (edges_i.length === 1) { return null; }
        return edges_i[1];
    }
    /**
     * Get the previous edge in a sequence of edges
     * @param edge_i
     */
    public getPrevEdge(edge_i: number): number {
        // get the wire start and end verts
        const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(edge[0]);
        if (edges_i.length === 1) { return null; }
        return edges_i[1];
    }
    /**
     * Get a list of edges that are neighbours ()
     * The list will include the input edge.
     * @param edge_i
     */
    public getNeighborEdges(edge_i: number): number[] {
        // get the wire start and end verts
        const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const start_posi_i: number = this._geom_maps.dn_verts_posis.get(edge[0]);
        const end_posi_i: number = this._geom_maps.dn_verts_posis.get(edge[1]);
        const start_edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, start_posi_i);
        const end_edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, end_posi_i);
        return Mathjs.setIntersect(start_edges_i, end_edges_i);
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
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
        // if start and end verts are the same, then wire is closed
        return (start_vert_i === end_vert_i);
    }
    /**
     * Check if a wire belongs to a pline, a pgon or a pgon hole.
     */
    public getWireType(wire_i: number): EWireType {
        // get the wire start and end verts
        if (this.modeldata.geom.nav.navWireToPline(wire_i) !== undefined) {
            return EWireType.PLINE;
        }
        const pgon_i: number = this.modeldata.geom.nav.navWireToPgon(wire_i);
        const wires_i: number[] = this._geom_maps.dn_pgons_wires.get(pgon_i); // nav.getFace(face_i);
        const index: number = wires_i.indexOf(wire_i);
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
        const edges_i: number[] = this._geom_maps.dn_wires_edges.get(wire_i); // WARNING BY REF
        const verts_i: number[] = [];
        // walk the edges chain
        let next_edge_i: number = edges_i[0];
        for (let i = 0; i < edges_i.length; i++) {
            const edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(next_edge_i);
            verts_i.push(edge_verts_i[0]);
            next_edge_i = this.getNextEdge(next_edge_i);
            // are we at the end of the chain
            if (next_edge_i === null) { // open wire
                verts_i.push(edge_verts_i[1]);
                break;
            } else if (next_edge_i === edges_i[0]) { // closed wire
                break;
            }
        }
        return verts_i;
    }
    // ============================================================================
    // Faces
    // ============================================================================
    /**
     *
     * @param pgon_i
     */
    public getPgonBoundary(pgon_i: number): number {
        return this._geom_maps.dn_pgons_wires.get(pgon_i)[0];
    }
    /**
     *
     * @param pgon_i
     */
    public getPgonHoles(pgon_i: number): number[] {
        return this._geom_maps.dn_pgons_wires.get(pgon_i).slice(1);
    }
    /**
     *
     * @param pgon_i
     */
    public getPgonNormal(pgon_i: number): Txyz {
        return this.modeldata.geom.snapshot.getPgonNormal(this.modeldata.active_ssid, pgon_i);
    }
    // ============================================================================
    // Calculate
    // ============================================================================
    /**
     *
     * @param ent_i
     */
    public getCentroid(ent_type: EEntType, ent_i: number): Txyz {
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        const centroid: Txyz = [0, 0, 0];
        for (const posi_i of posis_i) {
            const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
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
        const edges_i: number[] = this.modeldata.geom._geom_maps.dn_wires_edges.get(wire_i);
        // deal with special case, just a single edge
        if (edges_i.length === 1) {
            const posis_i: number[] = this._geom_maps.dn_edges_verts.get(edges_i[0]).map(
                vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyz0: Txyz = this.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
            const xyz1: Txyz = this.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
            if (xyz0[2] === xyz1[2]) { return [0, 0, 1]; }
            if (xyz0[1] === xyz1[1]) { return [0, 1, 0]; }
            if (xyz0[0] === xyz1[0]) { return [1, 0, 0]; }
            return vecNorm(vecCross(vecFromTo(xyz0, xyz1), [0, 0, 1]));
        }
        // proceed with multiple edges
        const centroid: Txyz = this.getCentroid(EEntType.WIRE, wire_i);
        const normal: Txyz = [0, 0, 0];
        const tri_normals: Txyz[] = [];
        // let count = 0;
        for (const edge_i of edges_i) {
            const posis_i: number[] = this._geom_maps.dn_edges_verts.get(edge_i).map(
                vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs: Txyz[] = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
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
            const posis_i: number[] = this._geom_maps.dn_edges_verts.get(edge_i).map(
                vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs: Txyz[] = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
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
            const posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const found_verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(posi_i);
            for (const found_vert_i of found_verts_i) {
                if (verts_i.indexOf(found_vert_i) === -1) {
                    const found_ents_i: number[] = this.modeldata.geom.nav.navAnyToAny(EEntType.VERT, ent_type, found_vert_i);
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
            const posi_pair_i: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i) as [number, number];
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
                const found_ents_i: number[] = this.modeldata.geom.nav.navAnyToAny(EEntType.EDGE, ent_type, edge_i);
                found_ents_i.forEach( found_ent_i => perimeter_ents_i.add(found_ent_i) );
            }
        }
        return Array.from(perimeter_ents_i);
    }
    /**
     * Get the object of a topo entity.
     * Returns a point, pline, or pgon. (no posis)
     * @param ent_type
     * @param ent_i
     */
    public getTopoObj(ent_type: EEntType, ent_i: number): TEntTypeIdx {
        switch (ent_type) {
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                const pgons_i: number[] = this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                if (pgons_i.length !== 0) {
                    return [EEntType.PGON, pgons_i[0]];
                }
                const plines_i: number[] = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                if (plines_i.length !== 0) {
                    return [EEntType.PLINE, plines_i[0]];
                }
                const points_i: number[] = this.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
                if (this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i).length !== 0) {
                    return [EEntType.POINT, points_i[0]];
                }
                break;
            default:
                throw new Error('Invalid entity type: Must be a topo entity.');
        }
    }
    /**
     * Get the object type of a topo entity.
     * @param ent_type
     * @param ent_i
     */
    public getTopoObjType(ent_type: EEntType, ent_i: number): EEntType {
        switch (ent_type) {
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                if (this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i).length !== 0) {
                    return EEntType.PGON;
                } else if (this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i).length !== 0) {
                    return EEntType.PLINE;
                } else if (this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i).length !== 0) {
                    return EEntType.POINT;
                }
                break;
            default:
                throw new Error('Invalid entity type: Must be a topo entity.');
        }
    }
    /**
     * Get the topo entities of an object
     * @param ent_type
     * @param ent_i
     */
    public getObjTopo(ent_type: EEntType, ent_i: number): [number[], number[], number[]] {
        return [
            this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i),
            this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i),
            this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i)
        ];
    }
    /**
     * Get the entities under a collection or object.
     * Returns a list of entities in hierarchical order.
     * For polygons and polylines, the list is ordered like this:
     * wire, vert, posi, edge, vert, posi, edge, vert, posi
     * @param ent_type
     * @param ent_i
     */
    public getEntSubEnts(ent_type: EEntType, ent_i: number): TEntTypeIdx[] {
        const tree: TEntTypeIdx[] = [];
        switch (ent_type) {
            case EEntType.COLL:
                {
                    for (const coll_i of this.modeldata.geom.nav.navCollToCollChildren(ent_i)) {
                        tree.push([EEntType.COLL, coll_i]);
                    }
                }
                return tree;
            case EEntType.PGON:
                {
                    for (const wire_i of this.modeldata.geom.nav.navPgonToWire(ent_i)) {
                        this._addtWireSubEnts(wire_i, tree);
                    }
                }
                return tree;
            case EEntType.PLINE:
                {
                    const wire_i: number = this.modeldata.geom.nav.navPlineToWire(ent_i);
                    this._addtWireSubEnts(wire_i, tree);
                }
                return tree;
            case EEntType.POINT:
                {
                    const vert_i: number = this.modeldata.geom.nav.navPointToVert(ent_i);
                    tree.push([EEntType.VERT, vert_i]);
                    tree.push([EEntType.POSI, this.modeldata.geom.nav.navVertToPosi(vert_i)]);
                }
                return tree;
            default:
                break;
        }
    }
    private _addtWireSubEnts(wire_i: number, tree: TEntTypeIdx[]): void {
        tree.push([EEntType.WIRE, wire_i]);
        const edges_i: number[] = this.modeldata.geom.nav.navWireToEdge(wire_i);
        for (const edge_i of edges_i) {
            const [vert0_i, vert1_i]: number[] = this.modeldata.geom.nav.navEdgeToVert(edge_i);
            const posi0_i: number = this.modeldata.geom.nav.navVertToPosi(vert0_i);
            tree.push([EEntType.VERT, vert0_i]);
            tree.push([EEntType.POSI, posi0_i]);
            tree.push([EEntType.EDGE, edge_i]);
            if (edge_i === edges_i[edges_i.length - 1]) {
                const posi1_i: number = this.modeldata.geom.nav.navVertToPosi(vert1_i);
                tree.push([EEntType.VERT, vert1_i]);
                tree.push([EEntType.POSI, posi1_i]);
            }
        }
    }
}
