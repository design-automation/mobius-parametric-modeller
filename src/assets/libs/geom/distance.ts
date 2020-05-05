import * as three from 'three';
import { vecAdd, vecCross } from './vectors';
const EPS = 1e-6;

type Txyz = [number, number, number];
type TRay = [Txyz, Txyz];
type TPlane = [Txyz, Txyz, Txyz];


function _distEuclidean(c1: Txyz, c2: Txyz): number {
    const v: Txyz = [
        c1[0] - c2[0],
        c1[1] - c2[1],
        c1[2] - c2[2]
    ];
    return Math.hypot(v[0], v[1], v[2]);
}
function _distManhattan(c1: Txyz, c2: Txyz): number {
    const v: Txyz = [
        Math.abs(c1[0] - c2[0]),
        Math.abs(c1[1] - c2[1]),
        Math.abs(c1[2] - c2[2])
    ];
    return v[0] + v[1] + v[2];
}
function _distManhattanSq(c1: Txyz, c2: Txyz): number {
    const v: Txyz = [
        Math.abs(c1[0] - c2[0]),
        Math.abs(c1[1] - c2[1]),
        Math.abs(c1[2] - c2[2])
    ];
    return (v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]);
}
function _dist(c1: Txyz, c2: Txyz|TRay|TPlane, func: Function): number {
    if (!Array.isArray(c2[0])) {
        c2 = c2 as Txyz;
        return func(c1, c2);
    } else if (c2.length === 2) {
        c2 = c2 as TRay;
        const tjs_point_proj: three.Vector3 = new three.Vector3(c1[0], c1[1], c1[2]);
        const tjs_origin: three.Vector3 =  new three.Vector3(c2[0][0], c2[0][1], c2[0][2]);
        const p2: Txyz = vecAdd(c2[0], c2[1]);
        const tjs_point2: three.Vector3 =  new three.Vector3(p2[0], p2[1], p2[2]);
        const tjs_new_point: three.Vector3 = new three.Vector3();
        const tjs_line: three.Line3 = new three.Line3(tjs_origin, tjs_point2);
        // project
        tjs_line.closestPointToPoint( tjs_point_proj, false, tjs_new_point );
        return distance(c1, [tjs_new_point.x, tjs_new_point.y, tjs_new_point.z]);
    } else if (c2.length === 3) {
        c2 = c2 as TPlane;
        const tjs_point_proj: three.Vector3 = new three.Vector3(c1[0], c1[1], c1[2]);
        const tjs_new_point: three.Vector3 = new three.Vector3();
        const normal: Txyz = vecCross(c2[1], c2[2]);
        const tjs_normal: three.Vector3 = new three.Vector3(normal[0], normal[1], normal[2]);
        const tjs_origin: three.Vector3 = new three.Vector3(c2[0][0], c2[0][1], c2[0][2]);
        const tjs_plane: three.Plane = new three.Plane();
        // project
        tjs_plane.setFromNormalAndCoplanarPoint( tjs_normal, tjs_origin );
        tjs_plane.projectPoint(tjs_point_proj, tjs_new_point);
        return distance(c1, [tjs_new_point.x, tjs_new_point.y, tjs_new_point.z]);
    } else {
        throw new Error('Error calculating distance. Distance must to either an xyz, a ray, or a plane.');
    }
}

export function distance(c1: Txyz, c2: Txyz|TRay|TPlane): number {
    return _dist(c1, c2, _distEuclidean);
}
export function distanceManhattan(c1: Txyz, c2: Txyz|TRay|TPlane): number {
    return _dist(c1, c2, _distManhattan);
}
export function distanceManhattanSq(c1: Txyz, c2: Txyz|TRay|TPlane): number {
    return _dist(c1, c2, _distManhattanSq);
}
