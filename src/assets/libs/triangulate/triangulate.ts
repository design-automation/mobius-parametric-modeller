
import * as three from 'three';
import * as threex from './threex';
import * as earcut from './earcut';
import { Txyz } from '../geo-info/common';
import { area } from '../geom/triangle';
// import { ConvexHull } from 'three/examples/jsm/math/ConvexHull';
// import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
// import { Earcut } from 'three/Earcut';

const EPS = 1e-6;


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
 * Gtes three extreme points that can be used to calculate the transform matrix
 */
function _getThreePoints(points: three.Vector3[]): three.Vector3[] {
    // console.log("_getExtremePoints")
    // basic case, a triangle with holes
    if (points.length === 3) {
        return points;
    }
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
    const x_size: number = Math.abs(points[extremes[3]].x - points[extremes[0]].x);
    const y_size: number = Math.abs(points[extremes[4]].y - points[extremes[1]].y);
    const z_size: number = Math.abs(points[extremes[5]].z - points[extremes[2]].z);
    // add the extreme points
    const set_selected: Set<number> = new Set();
    if (x_size > 0) { set_selected.add(extremes[0]); set_selected.add(extremes[3]); }
    if (y_size > 0) { set_selected.add(extremes[1]); set_selected.add(extremes[4]); }
    if (z_size > 0) { set_selected.add(extremes[2]); set_selected.add(extremes[5]); }
    // get three points that are not too close together
    const LIMIT = 0.0001; /// I am not sure what to set this to
    const selected: number[] = Array.from(set_selected).sort((a, b) => a - b );
    let three_selected: number[] = [selected[0]];
    for (let i = 1; i < selected.length; i++) {
        // I am not really sure if this distance check is needed
        // we already got extreme points
        // but it is possible that two or even three extreme points are right next to each other
        // squashed together in a corner... so I leave this check for now
        if (points[selected[i - 1]].manhattanDistanceTo(points[selected[i]]) > LIMIT) {
            three_selected.push(selected[i]);
        }
        if (three_selected.length === 3) { break; }
    }
    // we should now have three points
    if (three_selected.length === 3) {
        // console.log("FAST METHOD");
        return three_selected.map( i => points[i] );
    } else if (three_selected.length === 2) {
        // there is always a special case... the dreaded diagonal shape
        // console.log("SLOW METHOD", [first, second]);
        const [first, second]: [number, number] = three_selected as [number, number];
        const line: three.Line3 = new three.Line3(points[first], points[second]);
        let third: number;
        let dist = 0;
        for (let i = 0; i < points.length; i++) {
            const cur_point: three.Vector3 = points[i];
            if (cur_point !== points[first] && cur_point !== points[second]) {
                const dummy: three.Vector3 = new three.Vector3();
                const close_point: three.Vector3   = line.closestPointToPoint(cur_point, true, dummy);
                const cur_dist = cur_point.manhattanDistanceTo(close_point);
                if (dist < cur_dist) {
                    third = i;
                    dist = cur_dist;
                }
            }
            if (dist > LIMIT) { break; }
        }
        if (third === undefined) { return null; }
        three_selected = [first, second, third].sort((a, b) => a - b );
        return three_selected.map( i => points[i] );
    }
    // else if (selected.size === 2) { // special diagonal case
    //     console.log("XXXXXXXXXXXXXXX")
    //     return null;
    //     // TODO replace with convex hull
    //     const pair_idxs: number[] = Array.from(selected.values());
    //     const line: three.Line3 = new three.Line3(points[pair_idxs[0]], points[pair_idxs[1]]);
    //     const line_len: number = line.delta(new three.Vector3()).manhattanLength();
    //     let max_dist = 1e-4;
    //     let third_point_idx = null;
    //     for (let i = 0; i < points.length; i++) {
    //         if (i !== pair_idxs[0] && i !== pair_idxs[1]) {
    //             const point_on_line: three.Vector3 = line.closestPointToPoint(points[i], false, new three.Vector3());
    //             const dist_to_line: number = point_on_line.manhattanDistanceTo(points[i]);
    //             if (dist_to_line > max_dist) {
    //                 third_point_idx = i;
    //                 max_dist = dist_to_line;
    //             }
    //             if (dist_to_line / line_len > 0.01) { break; }
    //         }
    //     }
    //     if (third_point_idx === null) { return null; }
    //     const extreme_points: three.Vector3[] =
    // [pair_idxs[0], pair_idxs[1], third_point_idx].sort((a, b) => a - b ).map( i => points[i] );
    //     return extreme_points;
    // }
    // could not find points
    return null;
}

/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are more or less co-planar.
 * Returns null if the plane cannot be found, e.g. points are all colinear.
 */
function _getMatrix(points: three.Vector3[]): three.Matrix4 {

    const three_points: three.Vector3[] = _getThreePoints(points);
    // if (extreme_points === null) {
    //     console.log("POINTS = ",points)
    //     extreme_points = _getExtremePointsConvex(points);
    // }
    if (three_points === null) { return null; }

    // console.log("points", points)
    // console.log("extremes", extremes)
    // console.log("selected", selected)
    // console.log("points2", points2)

    // calculate origin
    // const o: three.Vector3 = new three.Vector3();
    // o.x = (points2[0].x + points2[0].x + points2[0].x) / 3;
    // o.y = (points2[1].y + points2[1].y + points2[1].y) / 3;
    // o.z = (points2[2].z + points2[2].z + points2[2].z) / 3;

    const vx: three.Vector3 = threex.subVectors(three_points[1], three_points[0]).normalize();
    const v2: three.Vector3 = threex.subVectors(three_points[2], three_points[1]).normalize();
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
 * Triangulate a 4 sided shape
 * @param coords
 */
export function triangulateQuad(coords: Txyz[]): number[][] {
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
        return triangulateQuad(coords);
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
