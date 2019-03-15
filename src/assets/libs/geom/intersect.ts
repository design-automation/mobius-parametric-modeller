import * as mathjs from 'mathjs';
import * as three from 'three';
import { vecAdd, vecCross, vecLen } from './vectors';

type Txyz = [number, number, number];
type TRay = [Txyz, Txyz];
type TPlane = [Txyz, Txyz, Txyz];

export function intersect(r1: TRay, r2: TRay|TPlane): number {
    if (r2.length === 2) {
        return mathjs.intersect(r1[0], vecAdd(r1[0], r1[1]), r2[0], vecAdd(r2[0], r2[1]) );
    } else if (r2.length === 3) {
        const [a, b, c]: Txyz = vecCross(r2[1], r2[2]);
        const [x1, y1, z1]: Txyz = r2[0];
        const d: number = a * x1 + b * y1 + c * z1;
        return mathjs.intersect(r1[0], vecAdd(r1[0], r1[1]), [a, b, c, d] );
    } else {
        throw new Error('Error calculating intersection. Elements to intersect must be either rays or planes.');
    }
}

export function project(c: Txyz, r: TRay|TPlane): Txyz {
    if (r.length === 2) {
        const tjs_point_proj: three.Vector3 = new three.Vector3(c[0], c[1], c[2]);
        const tjs_origin: three.Vector3 =  new three.Vector3(r[0][0], r[0][1], r[0][2]);
        const p2: Txyz = vecAdd(r[0], r[1]);
        const tjs_point2: three.Vector3 =  new three.Vector3(p2[0], p2[1], p2[2]);
        const tjs_new_point: three.Vector3 = new three.Vector3();
        const tjs_line: three.Line3 = new three.Line3(tjs_origin, tjs_point2);
        // project
        tjs_line.closestPointToPoint( tjs_point_proj, false, tjs_new_point );
        return [tjs_new_point.x, tjs_new_point.y, tjs_new_point.z];
    } else if (r.length === 3) {
        const tjs_point_proj: three.Vector3 = new three.Vector3(c[0], c[1], c[2]);
        const tjs_new_point: three.Vector3 = new three.Vector3();
        const normal: Txyz = vecCross(r[1], r[2]);
        const tjs_normal: three.Vector3 = new three.Vector3(normal[0], normal[1], normal[2]);
        const tjs_origin: three.Vector3 = new three.Vector3(r[0][0], r[0][1], r[0][2]);
        const tjs_plane: three.Plane = new three.Plane();
        // project
        tjs_plane.setFromNormalAndCoplanarPoint( tjs_normal, tjs_origin );
        tjs_plane.projectPoint(tjs_point_proj, tjs_new_point);
        return [tjs_new_point.x, tjs_new_point.y, tjs_new_point.z];
    } else {
        throw new Error('Error calculating projection. Projection must be onto either rays or planes.');
    }
}
