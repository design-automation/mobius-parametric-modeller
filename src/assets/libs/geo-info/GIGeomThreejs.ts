import { GIGeom } from './GIGeom';
import { IGeomArrays, TTri, TEdge, TPgon, TPoint } from './common';
import { GIAttribs } from './GIAttribs';

/**
 * Class for geometry.
 */
export class GIGeomThreejs {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    /**
     * Creates an object to store the geometry data.
     * @param geom The GIGeom obect
     * @param geom_arrays The geometry arrays
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
    }
    // ============================================================================
    // ThreeJS
    // Get arrays for threejs, these retrun arrays of indexes to positions
    // For a method to get the array of positions, see the attrib class
    // getSeqCoords()
    // ============================================================================
    /**
     * Returns a flat list of all vertices.
     * The indices in the list point to the sequential coordinates.
     */
    public get3jsVerts(): number[] {
        return this._geom_arrays.dn_verts_posis;
    }
    /**
     * Returns a flat list of the sequence of verices for all the triangles.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsTris(vertex_map: Map<number, number>): [number[], Map<number, number>] {
        const tris_verts_i_filt: TTri[] = [];
        const tri_select_map: Map<number, number> = new Map();
        let gi_i = 0;
        const l = this._geom_arrays.dn_tris_verts.length;
        for (; gi_i < l; gi_i++) {
            const tri_verts_i: TTri = this._geom_arrays.dn_tris_verts[gi_i];
            if (tri_verts_i !== null) {
                const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
                const tjs_i = tris_verts_i_filt.push(new_tri_verts_i) - 1;
                tri_select_map.set(tjs_i, gi_i);
            }
        }
        // @ts-ignore
        return [tris_verts_i_filt.flat(1), tri_select_map];

        // return this._geom_arrays.dn_tris_verts.flat(1);
        // return [].concat(...this._geom_arrays.dn_tris_verts);
    }
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsEdges(vertex_map: Map<number, number>): [number[], Map<number, number>] {
        const edges_verts_i_filt: TEdge[] = [];
        const edge_select_map: Map<number, number> = new Map();
        let gi_i = 0;
        const l = this._geom_arrays.dn_edges_verts.length;
        for (; gi_i < l; gi_i++) {
            const edge_verts_i: TEdge = this._geom_arrays.dn_edges_verts[gi_i];
            if (edge_verts_i !== null) {
                const new_edge_verts_i: TEdge = edge_verts_i.map(e => vertex_map.get(e)) as TEdge;
                const tjs_i = edges_verts_i_filt.push(new_edge_verts_i) - 1;
                edge_select_map.set(tjs_i, gi_i);
            }
        }
        // @ts-ignore
        return [edges_verts_i_filt.flat(1), edge_select_map];

        // @ts-ignore
        // return this._geom_arrays.dn_edges_verts.flat(1);
        // return [].concat(...this._geom_arrays.dn_edges_verts);
    }
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    public get3jsPoints(vertex_map: Map<number, number>): [number[], Map<number, number>] {
        const points_verts_i_filt: TPoint[] = [];
        const point_select_map: Map<number, number> = new Map();
        let gi_i = 0;
        const l = this._geom_arrays.dn_points_verts.length;
        for (; gi_i < l; gi_i++) {
            const point_verts_i: TPoint = this._geom_arrays.dn_points_verts[gi_i];
            if (point_verts_i !== null) {
                const new_point_verts_i: TPoint = vertex_map.get(point_verts_i) as TPoint;
                const tjs_i = points_verts_i_filt.push(new_point_verts_i) - 1;
                point_select_map.set(tjs_i, gi_i);
            }
        }
        return [points_verts_i_filt, point_select_map];
        // return this._geom_arrays.dn_points_verts;
    }
}
