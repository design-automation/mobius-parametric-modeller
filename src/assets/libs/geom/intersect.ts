import * as mathjs from 'mathjs';
import * as three from 'three';
import { vecAdd, vecCross, vecLen } from './vectors';

type Txyz = [number, number, number];
type TRay = [Txyz, Txyz];
type TPlane = [Txyz, Txyz, Txyz];

export function intersect(r1: TRay, r2: TRay|TPlane, met: number = 2): Txyz {
    function isInRange(num: number, range: [number, number]) {
        const range2: [number, number] = range[0] < range[1] ? range : [range[1], range[0]];
        if ((num < range2[0]) || (num > range2[1])) { return false; }
        return true;
    }
    // TODO
    // This has problems with rounding errors
    // Especially when lines are orthogonal
    function isOnLineSegment(coord: Txyz, start: Txyz, end: Txyz): boolean {
        const x_range: [number, number] = [start[0], end[0]];
        if (!isInRange(coord[0], x_range)) { return false; }
        const y_range: [number, number] = [start[1], end[1]];
        if (!isInRange(coord[1], y_range)) { return false; }
        const z_range: [number, number] = [start[2], end[2]];
        if (!isInRange(coord[2], z_range)) { return false; }
        return true;
    }
    // TODO
    // This has problems with rounding errors
    // Especially when lines are orthogonal
    function isOnRay(coord: Txyz, start: Txyz, end: Txyz): boolean {
        const x_range: [number, number] = [start[0], null];
        x_range[1] = start[0] === end[0] ? end[0] : start[0] < end[0] ? Infinity : -Infinity;
        if (!isInRange(coord[0], x_range)) { return false; }
        const y_range: [number, number] = [start[1], null];
        y_range[1] = start[1] === end[1] ? end[1] : start[1] < end[1] ? Infinity : -Infinity;
        if (!isInRange(coord[1], y_range)) { return false; }
        const z_range: [number, number] = [start[2], null];
        z_range[1] = start[2] === end[2] ? end[2] : start[2] < end[2] ? Infinity : -Infinity;
        if (!isInRange(coord[2], z_range)) { return false; }
        return true;
    }
    if (r2.length === 2) {
        const p0: Txyz = r1[0];
        const p1: Txyz = vecAdd(r1[0], r1[1]);
        const p2: Txyz = r2[0];
        const p3: Txyz = vecAdd(r2[0], r2[1]);
        const isect: Txyz = mathjs.intersect(p0, p1, p2, p3 );
        if (isect) {
            if (met === 2)  {
                return isect;
            } else if (met === 1) {
                if (isOnRay(isect, p0, p1) && isOnRay(isect, p2, p3)) { return isect; }
            } else if (met === 0) {
                if (isOnLineSegment(isect, p0, p1) && isOnLineSegment(isect, p2, p3)) { return isect; }
            } else {
                throw new Error('Error calculating intersection. Intersection method not valid. Must be 0, 1, or 2.');
            }
        }
        return null;
    } else if (r2.length === 3) {
        const p0: Txyz = r1[0];
        const p1: Txyz = vecAdd(r1[0], r1[1]);
        const [a, b, c]: Txyz = vecCross(r2[1], r2[2]);
        const [x1, y1, z1]: Txyz = r2[0];
        const d: number = a * x1 + b * y1 + c * z1;
        const isect: Txyz = mathjs.intersect(r1[0], vecAdd(r1[0], r1[1]), [a, b, c, d] );
        if (isect) {
            if (met === 2)  {
                return isect;
            } else if (met === 1) {
                if (isOnRay(isect, p0, p1)) { return isect; }
            } else if (met === 0) {
                if (isOnLineSegment(isect, p0, p1)) { return isect; }
            } else {
                throw new Error('Error calculating intersection. Intersection method not valid. Must be 0, 1, or 2.');
            }
        }
        return null;
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
