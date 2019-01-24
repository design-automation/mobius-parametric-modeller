
import * as three from 'three';
import * as threex from './threex';
import * as earcut from './earcut';
import { Txyz } from '../geo-info/common';
import { area } from '../geom/triangle';

//  3D to 2D ======================================================================================================

/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are more or less co-planar.
 * Returns a set of three Vectors that represent points on the xy plane.
 * Returns null if the plane cannot be found, e.g. points are all colinear.
 */
function _getMatrix(points: three.Vector3[]): three.Matrix4 {

    // calculate origin
    const o: three.Vector3 = new three.Vector3();
    for (const v of points) {
        o.add(v);
    }
    o.divideScalar(points.length);

    // find three vectors
    let vx: three.Vector3;
    let vz: three.Vector3;
    let got_vx = false;
    for (let i = 0; i < points.length; i++) {
        if (!got_vx) {
            vx =  threex.subVectors(points[i], o);
            if (vx.lengthSq() !== 0) {got_vx = true; }
        } else {
            vz = threex.crossVectors(vx, threex.subVectors(points[i], o));
            if (vz.lengthSq() !== 0) { break; }
        }
        if (i === points.length - 1) { return null; } // could not find any pair of vectors
    }
    const vy: three.Vector3 =  threex.crossVectors(vz, vx);

    // create matrix
    vx.normalize();
    vy.normalize();
    vz.normalize();
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(vx, vy, vz);
    m2.getInverse(m2);
    return m2;
}

/**
 * Triangulates a set of coords in 3d with holes
 * If the coords cannot be triangulated, it returns [].
 * @param coords
 */
export function triangulate(coords: Txyz[], holes?: Txyz[][]): number[][] {

    // check if we have holes
    const has_holes: boolean = (holes !== undefined && holes.length !== 0);

    // basic case, a triangle with no holes
    if (coords.length === 3 && !has_holes) {
        return [[0, 1, 2]];
    }

    // basic case, a quad with no holes
    if (coords.length === 4 && !has_holes) {
        // TODO this does not take into account degenerate cases
        // TODO two points in same location
        // TODO Three points that are colinear
        const area1: number = area(coords[0], coords[1], coords[2]) + area(coords[2], coords[3], coords[0]);
        const area2: number = area(coords[0], coords[1], coords[3]) + area(coords[1], coords[2], coords[3]);
        const tri1a: Txyz[] = [coords[0], coords[1], coords[2]];
        const tri1b: Txyz[] = [coords[2], coords[3], coords[0]];
        const tri2a: Txyz[] = [coords[0], coords[1], coords[3]];
        const tri2b: Txyz[] = [coords[1], coords[2], coords[3]];
        if (area1 < area2) {
            return [[0, 1, 2], [2, 3, 0]];
        } else {
            return [[0, 1, 3], [1, 2, 3]];
        }
    }

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
    if (has_holes) {
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

    // convert the triangles into lists of three
    const tris_i: number[][] = [];
    for (let i = 0; i < flat_tris_i.length; i += 3) {
        tris_i.push([flat_tris_i[i], flat_tris_i[i + 1], flat_tris_i[i + 2]]);
    }

    // return the list of triangles
    return tris_i;
}
