
import * as three from 'three';
import * as threex from './threex';
import * as earcut from './earcut';
import { Txyz } from '../geo-info/common';
import { area } from '../geom/triangle';

//  3D to 2D ======================================================================================================

/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are more or less co-planar.
 * Returns null if the plane cannot be found, e.g. points are all colinear.
 */
// function _getMatrixOld(points: three.Vector3[]): three.Matrix4 {
//     // calculate origin
//     const o: three.Vector3 = new three.Vector3();
//     for (const v of points) {
//         o.add(v);
//     }
//     o.divideScalar(points.length);
//     // find three vectors
//     let vx: three.Vector3;
//     let vz: three.Vector3;
//     let got_vx = false;
//     for (let i = 0; i < points.length; i++) {
//         if (!got_vx) {
//             vx =  threex.subVectors(points[i], o);
//             if (vx.lengthSq() !== 0) {got_vx = true; }
//         } else {
//             vz = threex.crossVectors(vx, threex.subVectors(points[i], o));
//             if (vz.lengthSq() !== 0) { break; }
//         }
//         if (i === points.length - 1) { return null; } // could not find any pair of vectors
//     }
//     const vy: three.Vector3 =  threex.crossVectors(vz, vx);
//     // create matrix
//     vx.normalize();
//     vy.normalize();
//     vz.normalize();
//     const m2: three.Matrix4 = new three.Matrix4();
//     m2.makeBasis(vx, vy, vz);
//     m2.getInverse(m2);
//     return m2;
// }


/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are more or less co-planar.
 * Returns null if the plane cannot be found, e.g. points are all colinear.
 */
function _getMatrix(points: three.Vector3[]): three.Matrix4 {

    // find the extreme points
    const extremes: number[] = [0, 0, 0, 0, 0, 0];
    // min x, min y, min z, max x, max y, max z
    for (let i = 0; i < points.length; i++) {
        if (points[i].x < points[extremes[0]].x) {
            extremes[0] = i;
        }
        if (points[i].y < points[extremes[1]].y) {
            extremes[1] = i;
        }
        if (points[i].z < points[extremes[2]].z) {
            extremes[2] = i;
        }
        if (points[i].x > points[extremes[3]].x) {
            extremes[3] = i;
        }
        if (points[i].y > points[extremes[4]].y) {
            extremes[4] = i;
        }
        if (points[i].z > points[extremes[5]].z) {
            extremes[5] = i;
        }
    }
    // calc sizes
    const x_size: number = points[extremes[3]].x - points[extremes[0]].x;
    const y_size: number = points[extremes[4]].x - points[extremes[1]].x;
    const z_size: number = points[extremes[5]].x - points[extremes[2]].x;
    // add the extreme points
    const selected: Set<number> = new Set();
    if (x_size > 0) { selected.add(extremes[0]); selected.add(extremes[3]); }
    if (y_size > 0) { selected.add(extremes[1]); selected.add(extremes[4]); }
    if (z_size > 0) { selected.add(extremes[2]); selected.add(extremes[5]); }
    // get three points
    let points2: three.Vector3[] = [];
    // TODO optimize...
    if (selected.size >= 3) { // ok
        points2 = Array.from(selected).sort((a, b) => a - b ).map( i => points[i] );
        // TODO maybe we should check if the dit between oints is not too small
    } else if (selected.size === 2) { // special diagonal case
        // TODO replace with convex hull
        const pair_idxs: number[] = Array.from(selected.values());
        const line: three.Line3 = new three.Line3(points[pair_idxs[0]], points[pair_idxs[1]]);
        const line_len: number = line.delta(new three.Vector3()).manhattanLength();
        let max_dist = 1e-4;
        let third_point_idx = null;
        for (let i = 0; i < points.length; i++) {
            if (i !== pair_idxs[0] && i !== pair_idxs[1]) {
                const point_on_line: three.Vector3 = line.closestPointToPoint(points[i], false, new three.Vector3());
                const dist_to_line: number = point_on_line.manhattanDistanceTo(points[i]);
                if (dist_to_line > max_dist) {
                    third_point_idx = i;
                    max_dist = dist_to_line;
                }
                if (dist_to_line / line_len > 0.01) { break; }
            }
        }
        if (third_point_idx === null) { return null; }
        points2 = [pair_idxs[0], pair_idxs[1], third_point_idx].sort((a, b) => a - b ).map( i => points[i] );
    } else if  (selected.size < 2) {
        return null;  // could not find points
    }

    // console.log("points", points)
    // console.log("extremes", extremes)
    // console.log("selected", selected)
    // console.log("points2", points2)

    // calculate origin
    // const o: three.Vector3 = new three.Vector3();
    // o.x = (points2[0].x + points2[0].x + points2[0].x) / 3;
    // o.y = (points2[1].y + points2[1].y + points2[1].y) / 3;
    // o.z = (points2[2].z + points2[2].z + points2[2].z) / 3;

    const vx: three.Vector3 = threex.subVectors(points2[1], points2[0]).normalize();
    const v2: three.Vector3 = threex.subVectors(points2[2], points2[1]).normalize();
    const vz: three.Vector3 = threex.crossVectors(vx, v2).normalize();
    const vy: three.Vector3 =  threex.crossVectors(vz, vx).normalize();
    
    // console.log(vx, vy, vz)

    // create matrix
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
        // const tri1a: Txyz[] = [coords[0], coords[1], coords[2]];
        // const tri1b: Txyz[] = [coords[2], coords[3], coords[0]];
        // const tri2a: Txyz[] = [coords[0], coords[1], coords[3]];
        // const tri2b: Txyz[] = [coords[1], coords[2], coords[3]];
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
