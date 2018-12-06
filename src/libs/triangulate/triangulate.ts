
import * as three from 'three';
import * as threex from '../threex/threex';
import * as earcut from './earcut';
import {TCoord} from '../geo-info/GIJson';
import {Arr} from '../arr/arr';  // TODO remove dependence on this

//  3D to 2D ======================================================================================================

/**
 * Function to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are co-planar.
 * Returns a set of three Vectors that represent points on the xy plane.
 */
function _makeVertices2D(points: three.Vector3[]): three.Vector3[] {
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
            vx =  threex.subVectors(points[i], o).normalize();
            if (vx.lengthSq() !== 0) {got_vx = true; }
        } else {
            vz = threex.crossVectors(vx, threex.subVectors(points[i], o).normalize()).normalize();
            if (vz.lengthSq() !== 0) {break; }
        }
        if (i === points.length - 1) {return null; }
    }
    const vy: three.Vector3 =  threex.crossVectors(vz, vx);
    const m: three.Matrix4 = threex.xformMatrix(o, vx, vy, vz);
    const points_2d: three.Vector3[] = points.map((v) => threex.multVectorMatrix(v, m));
    return points_2d;
}

/**
 * Triangulates a polygon
 * @param coords
 */
export function triangulate(coords: TCoord[]): number[][] {
    const vects: three.Vector3[] = _makeVertices2D(coords.map( coord => new three.Vector3(...coord)) );
    const flat_vert_xys: number[] = Arr.flatten(vects.map((v) => [v.x, v.y])); // TODO remove dependency
    const flat_tris_i: number[] = earcut.Earcut.triangulate(flat_vert_xys);
    const tris_i: number[][] = [];
    for (let i = 0; i < flat_tris_i.length; i += 3) {
        tris_i.push([flat_tris_i[i], flat_tris_i[i + 1], flat_tris_i[i + 2]]);
    }
    return tris_i;
}
