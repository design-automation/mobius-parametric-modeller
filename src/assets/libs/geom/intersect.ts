import * as mathjs from 'mathjs';
import * as three from 'three';
import { vecAdd, vecCross, vecLen, vecFromTo, vecDot, vecNorm, vecMult, vecSetLen } from './vectors';

type Txyz = [number, number, number];
type TRay = [Txyz, Txyz];
type TPlane = [Txyz, Txyz, Txyz];

export function intersect(r1: TRay, r2: TRay|TPlane, met: number = 2): Txyz {
    // function isInRange(num: number, range: [number, number]) {
    //     const range2: [number, number] = range[0] < range[1] ? range : [range[1], range[0]];
    //     if ((num < range2[0]) || (num > range2[1])) { return false; }
    //     return true;
    // }
    // // TODO
    // // This has problems with rounding errors
    // // Especially when lines are orthogonal
    // function isOnLineSegment(coord: Txyz, start: Txyz, end: Txyz): boolean {
    //     const x_range: [number, number] = [start[0], end[0]];
    //     if (!isInRange(coord[0], x_range)) { return false; }
    //     const y_range: [number, number] = [start[1], end[1]];
    //     if (!isInRange(coord[1], y_range)) { return false; }
    //     const z_range: [number, number] = [start[2], end[2]];
    //     if (!isInRange(coord[2], z_range)) { return false; }
    //     return true;
    // }
    // // TODO
    // // This has problems with rounding errors
    // // Especially when lines are orthogonal
    // function isOnRay(coord: Txyz, start: Txyz, end: Txyz): boolean {
    //     const x_range: [number, number] = [start[0], null];
    //     x_range[1] = start[0] === end[0] ? end[0] : start[0] < end[0] ? Infinity : -Infinity;
    //     if (!isInRange(coord[0], x_range)) { return false; }
    //     const y_range: [number, number] = [start[1], null];
    //     y_range[1] = start[1] === end[1] ? end[1] : start[1] < end[1] ? Infinity : -Infinity;
    //     if (!isInRange(coord[1], y_range)) { return false; }
    //     const z_range: [number, number] = [start[2], null];
    //     z_range[1] = start[2] === end[2] ? end[2] : start[2] < end[2] ? Infinity : -Infinity;
    //     if (!isInRange(coord[2], z_range)) { return false; }
    //     return true;
    // }
    if (r2.length === 2) {
        return intersectRayRay(r1, r2, met);
        // const p0: Txyz = r1[0];
        // const p1: Txyz = vecAdd(r1[0], r1[1]);
        // const p2: Txyz = r2[0];
        // const p3: Txyz = vecAdd(r2[0], r2[1]);
        // const isect: Txyz = mathjs.intersect(p0, p1, p2, p3 );
        // if (isect) {
        //     if (met === 2)  {
        //         return isect;
        //     } else if (met === 1) {
        //         if (isOnRay(isect, p0, p1) && isOnRay(isect, p2, p3)) { return isect; }
        //     } else if (met === 0) {
        //         if (isOnLineSegment(isect, p0, p1) && isOnLineSegment(isect, p2, p3)) { return isect; }
        //     } else {
        //         throw new Error('Error calculating intersection. Intersection method not valid. Must be 0, 1, or 2.');
        //     }
        // }
        // return null;
    } else if (r2.length === 3) {
        return intersectRayPlane(r1, r2, met);
        // const p0: Txyz = r1[0];
        // const p1: Txyz = vecAdd(r1[0], r1[1]);
        // const [a, b, c]: Txyz = vecCross(r2[1], r2[2]);
        // const [x1, y1, z1]: Txyz = r2[0];
        // const d: number = a * x1 + b * y1 + c * z1;
        // const isect: Txyz = mathjs.intersect(r1[0], vecAdd(r1[0], r1[1]), [a, b, c, d] );
        // if (isect) {
        //     if (met === 2)  {
        //         return isect;
        //     } else if (met === 1) {
        //         if (isOnRay(isect, p0, p1)) { return isect; }
        //     } else if (met === 0) {
        //         if (isOnLineSegment(isect, p0, p1)) { return isect; }
        //     } else {
        //         throw new Error('Error calculating intersection. Intersection method not valid. Must be 0, 1, or 2.');
        //     }
        // }
        // return null;
    } else {
        throw new Error('Error calculating intersection. Elements to intersect must be either rays or planes.');
    }
}

export function intersectRayRay(r1: TRay, r2: TRay, met: number): Txyz {
    const dc: Txyz = vecFromTo(r1[0], r2[0]);
    const da: Txyz = r1[1];
    const db: Txyz = r2[1];
    if (vecDot(dc, vecCross(da, db)) !== 0) { return null; }
    const da_x_db: Txyz = vecCross(da, db);
    const da_x_db_norm2: number = (da_x_db[0] * da_x_db[0]) + (da_x_db[1] * da_x_db[1]) + (da_x_db[2] * da_x_db[2]);
    if (da_x_db_norm2 === 0) { return null; }
    const s = vecDot(vecCross(dc, db), da_x_db) / da_x_db_norm2;
    const t = vecDot(vecCross(dc, da), da_x_db) / da_x_db_norm2;
    switch (met) {
        case 2:
            return vecAdd(r1[0], vecMult(da, s));
        case 1:
            if ((s >= 0) && (t >= 0)) {
                return vecAdd(r1[0], vecMult(da, s));
            }
            return null;
        case 0:
            if ((s >= 0 && s <= 1) && (t >= 0 && t <= 1)) {
                return vecAdd(r1[0], vecMult(da, s));
            }
            return null;
        default:
            return null;
    }
}

export function intersectRayPlane(r: TRay, p: TPlane, met: number): Txyz {
    const normal: Txyz = vecCross(p[1], p[2]);
    const normal_dot_r: number = vecDot(normal, r[1]);
    if (normal_dot_r === 0) { return null; }
    const u: number = vecDot(normal, vecFromTo(r[0], p[0])) / normal_dot_r;
    switch (met) {
        case 2:
            return vecAdd(r[0], vecMult(r[1], u));
        case 1:
            if (u >= 0) {
                return vecAdd(r[0], vecMult(r[1], u));
            }
            return null;
        case 0:
            if (u >= 0 && u <= 1) {
                return vecAdd(r[0], vecMult(r[1], u));
            }
            return null;
        default:
            return null;
    }
}

export function project(c: Txyz, r: TRay|TPlane, met: number = 2): Txyz {
    if (r.length === 2) {
        return projectCoordOntoRay(c, r, met);
        // const tjs_point_proj: three.Vector3 = new three.Vector3(c[0], c[1], c[2]);
        // const tjs_origin: three.Vector3 =  new three.Vector3(r[0][0], r[0][1], r[0][2]);
        // const p2: Txyz = vecAdd(r[0], r[1]);
        // const tjs_point2: three.Vector3 =  new three.Vector3(p2[0], p2[1], p2[2]);
        // const tjs_new_point: three.Vector3 = new three.Vector3();
        // const tjs_line: three.Line3 = new three.Line3(tjs_origin, tjs_point2);
        // // project
        // tjs_line.closestPointToPoint( tjs_point_proj, false, tjs_new_point );
        // return [tjs_new_point.x, tjs_new_point.y, tjs_new_point.z];
    } else if (r.length === 3) {
        return projectCoordOntoPlane(c, r);
        // const tjs_point_proj: three.Vector3 = new three.Vector3(c[0], c[1], c[2]);
        // const tjs_new_point: three.Vector3 = new three.Vector3();
        // const normal: Txyz = vecCross(r[1], r[2]);
        // const tjs_normal: three.Vector3 = new three.Vector3(normal[0], normal[1], normal[2]);
        // const tjs_origin: three.Vector3 = new three.Vector3(r[0][0], r[0][1], r[0][2]);
        // const tjs_plane: three.Plane = new three.Plane();
        // // project
        // tjs_plane.setFromNormalAndCoplanarPoint( tjs_normal, tjs_origin );
        // tjs_plane.projectPoint(tjs_point_proj, tjs_new_point);
        // return [tjs_new_point.x, tjs_new_point.y, tjs_new_point.z];
    } else {
        throw new Error('Error calculating projection. Projection must be onto either rays or planes.');
    }
}

export function projectCoordOntoRay(c: Txyz, r: TRay, met: number): Txyz {
    const vec: Txyz = vecFromTo(r[0], c);
    const dot: number = vecDot(vec, vecNorm(r[1]));
    switch (met) {
        case 2:
            return vecAdd(r[0], vecSetLen(r[1], dot));
        case 1:
            if (dot <= 0) {
                return r[0].slice() as Txyz;
            }
            return vecAdd(r[0], vecSetLen(r[1], dot));
        case 0:
            const length: number = vecLen(r[1]);
            if (dot <= 0) {
                return r[0].slice() as Txyz;
            } else if (dot >= length) {
                return vecAdd(r[0], r[1]);
            }
            return vecAdd(r[0], vecSetLen(r[1], dot));
        default:
            return null;
    }
}

export function projectCoordOntoPlane(c: Txyz, p: TPlane): Txyz {
    const vec_to_c: Txyz = vecFromTo(p[0], c);
    const pln_z_vec: Txyz = vecCross(p[1], p[2]);
    const vec_a: Txyz = vecCross(vec_to_c, pln_z_vec);
    if (vecLen(vec_a) === 0) { return p[0].slice() as Txyz; }
    const vec_b: Txyz = vecCross(vec_a, pln_z_vec);
    const dot: number = vecDot(vec_to_c, vecNorm(vec_b));
    return vecAdd(p[0], vecSetLen(vec_b, dot));
}
