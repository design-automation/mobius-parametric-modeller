
import * as three from 'three';
import * as threex from './threex';
import * as earcut from './earcut';
import {Txyz} from '../geo-info/common';
import {Arr} from './arr';  // TODO remove dependence on this

//  3D to 2D ======================================================================================================

/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are co-planar.
 * Returns a set of three Vectors that represent points on the xy plane.
 * Returns null if the points 
 */
function _getMatrix(points: three.Vector3[]): three.Matrix4 {
    const o: three.Vector3 = new three.Vector3();
    for (const v of points) {
        o.add(v);
    }
    o.divideScalar(points.length);
    let vx: three.Vector3;
    let vz: three.Vector3;
    let got_vx = false;
    for (let i = 0; i < points.length; i++) {
        if (!got_vx) {
            vx =  threex.subVectors(points[i], o).normalize(); // TODO why normalize
            if (vx.lengthSq() !== 0) {got_vx = true; }
        } else {
            vz = threex.crossVectors(vx, threex.subVectors(points[i], o).normalize()).normalize(); // TODO why normalize
            if (vz.lengthSq() !== 0) {break; }
        }
        if (i === points.length - 1) { return null; } // could not find any pair of vectors
    }
    const vy: three.Vector3 =  threex.crossVectors(vz, vx);
    const m: three.Matrix4 = threex.xformMatrix(o, vx, vy, vz);
    return m;
    // const points_2d: three.Vector3[] = points.map((v) => threex.multVectorMatrix(v, m));
    // return points_2d;
}

/**
 * Triangulates a set of coords in 3d with holes
 * If the coords cannot be triangulated, it returns [].
 * @param coords
 */
export function triangulate(coords: Txyz[], holes?: Txyz[][]): number[][] {

    // get the matrix to transform from 2D to 3D
    const coords_v: three.Vector3[] = coords.map( coord => new three.Vector3(...coord));
    const matrix: three.Matrix4 = _getMatrix( coords_v );

    // check for null, which means no plane could be found
    if (matrix === null) {
        return [];
    }

    // create an array to store all x y vertex coordinates
    const flat_vert_xys: number[] = [];

    // get the perimeter vertices and add them to the array
    const coords_v_2d: three.Vector3[] = coords_v.map((coord_v) => threex.multVectorMatrix(coord_v, matrix));
    if (coords_v_2d === undefined || coords_v_2d === null || coords_v_2d.length === 0) {
        console.log('WARNING: triangulation failed.');
        return [];
    }
    coords_v_2d.forEach(coord_v_2d => flat_vert_xys.push(coord_v_2d.x, coord_v_2d.y));

    // hole vertices uing EARCUT
    // holes is an array of hole indices if any (e.g. [5, 8] for a 12-vertex input would mean 
    // one hole with vertices 5–7 and another with 8–11).
    const hole_indices: number[] = [];
    let index_counter: number = coords_v.length;
    if (holes !== undefined && holes.length) {
        for (const hole of holes) {
            hole_indices.push(index_counter);
            if (hole.length) {
                const hole_coords_v: three.Vector3[] = hole.map( hole_coord => new three.Vector3(...hole_coord));
                const hole_coords_v_2d: three.Vector3[] = hole_coords_v.map((hole_coord_v) =>
                    threex.multVectorMatrix(hole_coord_v, matrix));
                const one_hole: number[] = [];
                hole_coords_v_2d.forEach(hole_coord_v => flat_vert_xys.push(hole_coord_v.x, hole_coord_v.y));
                index_counter += hole.length;
            }
        }
    }

    // do the triangulation
    const flat_tris_i: number[] = earcut.Earcut.triangulate(flat_vert_xys, hole_indices);

    // convert the triangles into lists of three and return them
    const tris_i: number[][] = [];
    for (let i = 0; i < flat_tris_i.length; i += 3) {
        tris_i.push([flat_tris_i[i], flat_tris_i[i + 1], flat_tris_i[i + 2]]);
    }

    // return the list of triangles
    return tris_i;
}
