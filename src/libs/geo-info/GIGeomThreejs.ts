import { GIGeom } from './GIGeom';
import { IGeomArrays } from './common';
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
    public get3jsTris(): number[] {
        return [].concat(...this._geom_arrays.dn_tris_verts);
    }
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsEdges(): number[] {
        return [].concat(...this._geom_arrays.dn_edges_verts);
    }
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    public get3jsPoints(): number[] {
        return this._geom_arrays.dn_points_verts;
    }
}
