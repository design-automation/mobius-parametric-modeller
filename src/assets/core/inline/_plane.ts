import { TPlane, TRay, Txyz, Txy } from '@assets/libs/geo-info/common';
import { vecCross, vecMult, vecsAdd, vecRot, vecNorm, vecMakeOrtho, vecAdd, vecFromTo, vecDot } from '@assets/libs/geom/vectors';
import { getArrDepth2 } from '@assets/libs/util/arrs';

/**
 * Plane functions that modify planes. These functions do not modify input plane.
 *
 * Overloaded:
 * - origin[], x_vec,   xy_vec
 * - origin,   x_vec[], xy_vec[]
 * - origin[], x_vec[], xy_vec[]
 */

export function plnMake(origin: Txyz|Txyz[], x_vec: Txyz|Txyz[], xy_vec: Txyz|Txyz[]): TPlane|TPlane[] {
    // overloaded case
    const origin_dep: number = getArrDepth2(origin);
    const x_vec_dep: number = getArrDepth2(x_vec);
    const xy_vec_dep: number = getArrDepth2(xy_vec);
    if (origin_dep === 2 || x_vec_dep === 2) {
        if (x_vec_dep === 1) {
            // only origin is Txyz[]
            return (origin as Txyz[]).map( origin_val => plnMake(origin_val as Txyz, x_vec as Txyz, xy_vec as Txyz) as TPlane);
        } else if (origin_dep === 1) {
            // only x_vec and xy_vec are Txyz[], they must be equal length
            if (xy_vec_dep === 2 && x_vec.length === xy_vec.length) {
                const vecs: TPlane[] = [];
                for (let i = 0; i < origin.length; i++) {
                    vecs.push( plnMake(origin as Txyz, x_vec[i] as Txyz, xy_vec[i] as Txyz) as TPlane );
                }
                return vecs;
            } else {
                throw new Error('Error making planes with lists of vectors: The x_vec and xy_vec lists must be of equal length.');
            }
        } else {
            // all origin, x_vec and xy_vec are Txyz[], they must be equal length
            if (origin.length === x_vec.length && origin.length === xy_vec.length) {
                const vecs: TPlane[] = [];
                for (let i = 0; i < origin.length; i++) {
                    vecs.push( plnMake(origin[i] as Txyz, x_vec[i] as Txyz, xy_vec[i] as Txyz) as TPlane );
                }
                return vecs;
            } else {
                throw new Error('Error making planes with lists of vectors: The three lists must be of equal length.');
            }
        }
    }
    // normal case, both origin and x_vec and xy_vec are Txyz
    const x_axis: Txyz = vecNorm(x_vec as Txyz);
    const y_axis: Txyz = vecNorm(vecMakeOrtho(xy_vec as Txyz, x_vec as Txyz));
    return [origin.slice() as Txyz, x_axis, y_axis] as TPlane;
}

export function plnCopy(pln: TPlane|TPlane[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    if (pln_dep === 3) { return (pln as TPlane[]).map(pln_one => plnCopy(pln_one)) as TPlane[]; }
    // normal case
    pln = pln as TPlane;
    return [pln[0].slice() as Txyz, pln[1].slice() as Txyz, pln[2].slice() as Txyz];
}

export function plnMove(pln: TPlane|TPlane[], vec: Txyz|Txyz[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    const vec_dep: number = getArrDepth2(vec);
    if (pln_dep === 3) {
        pln = pln as TPlane[];
        if (vec_dep === 1) {
            vec = vec as Txyz;
            return pln.map(pln_one => plnMove(pln_one, vec)) as TPlane[];
        } else if (vec_dep === 2 && pln.length === vec.length) {
            vec = vec as Txyz[];
            const planes: TPlane[] = [];
            for (let i = 0; i < pln.length; i++) {
                planes.push( plnMove(pln[i], vec[i]) as TPlane );
            }
        } else {
            throw new Error('Error moving a list planes with a list of vectors: The two lists must be of equal length.');
        }
    }
    // normal case
    pln = pln as TPlane;
    vec = vec as Txyz;
    return [vecAdd(pln[0], vec), pln[1].slice() as Txyz, pln[2].slice() as Txyz];
}

export function plnRot(pln: TPlane|TPlane[], ray: TRay|TRay[], ang: number|number[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    const ray_dep: number = getArrDepth2(ray);
    const ang_dep: number = getArrDepth2(ang);
    if (pln_dep === 3) {
        pln = pln as TPlane[];
        if (ray_dep === 2 && ang_dep === 0) {
            ray = ray as TRay;
            ang = ang as number;
            return pln.map(pln_one => plnRot(pln_one, ray, ang)) as TPlane[];
        } else if (ray_dep === 3 && ang_dep === 1 && pln.length === ray.length && pln.length === (ang as number[]).length) {
            ray = ray as TRay[];
            ang = ang as number[];
            const planes: TPlane[] = [];
            for (let i = 0; i < pln.length; i++) {
                planes.push( plnRot(pln[i], ray[i], ang[i]) as TPlane );
            }
            return planes as TPlane[];
        } else {
            throw new Error('Error rotating a list planes with a list of rays and angles: The three lists must be of equal length.');
        }
    }
    // normal case
    pln = pln as TPlane;
    ray = ray as TRay;
    ang = ang as number;
    const from_ray_o_to_pln_o: Txyz = vecFromTo(ray[0], pln[0]);
    const rot_pln_origin: Txyz = vecAdd(ray[0], vecRot(from_ray_o_to_pln_o, ray[1], ang));
    return [rot_pln_origin, vecRot(pln[1], ray[1], ang), vecRot(pln[2], ray[1], ang)];
}

export function plnLMove(pln: TPlane|TPlane[], vec: Txyz|Txyz[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    const vec_dep: number = getArrDepth2(vec);
    if (pln_dep === 3) {
        pln = pln as TPlane[];
        if (vec_dep === 1) {
            vec = vec as Txyz;
            return pln.map(pln_one => plnMove(pln_one, vec)) as TPlane[];
        } else if (vec_dep === 2 && pln.length === vec.length) {
            vec = vec as Txyz[];
            const planes: TPlane[] = [];
            for (let i = 0; i < pln.length; i++) {
                planes.push( plnMove(pln[i], vec[i]) as TPlane );
            }
        } else {
            throw new Error('Error moving a list planes with a list of vectors: The two lists must be of equal length.');
        }
    }
    // normal case
    pln = pln as TPlane;
    vec = vec as Txyz;
    const z_vec: Txyz = vecCross(pln[1], pln[2]);
    const x_move_vec: Txyz = vecMult(pln[1], vec[0]);
    const y_move_vec: Txyz = vecMult(pln[2], vec[1]);
    const z_move_vec: Txyz = vecMult(z_vec, vec[2]);
    const origin: Txyz = vecsAdd([pln[0], x_move_vec, y_move_vec, z_move_vec], false);
    return [origin, pln[1].slice() as Txyz, pln[2].slice() as Txyz];
}

export function plnLRotX(pln: TPlane|TPlane[], ang: number|number[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    const ang_dep: number = getArrDepth2(ang);
    if (pln_dep === 3) {
        pln = pln as TPlane[];
        if (ang_dep === 0) {
            // many pln, one ang
            ang = ang as number;
            return pln.map(pln_one => plnLRotX(pln_one, ang)) as TPlane[];
        } else if (ang_dep === 12 && pln.length === (ang as number[]).length) {
            // many pln, many ang
            ang = ang as number[];
            const planes: TPlane[] = [];
            for (let i = 0; i < pln.length; i++) {
                planes.push( plnLRotX(pln[i], ang[i]) as TPlane );
            }
            return planes as TPlane[];
        } else {
            throw new Error('Error rotating a list planes with a list of angles: The two lists must be of equal length.');
        }
    }
    // normal case
    pln = pln as TPlane;
    ang = ang as number;
    const y_axis: Txyz = vecRot(pln[2], pln[1], ang);
    return [pln[0].slice() as Txyz, pln[1].slice() as Txyz, y_axis];
}

export function plnLRotY(pln: TPlane|TPlane[], ang: number|number[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    const ang_dep: number = getArrDepth2(ang);
    if (pln_dep === 3) {
        pln = pln as TPlane[];
        if (ang_dep === 0) {
            // many pln, one ang
            ang = ang as number;
            return pln.map(pln_one => plnLRotY(pln_one, ang)) as TPlane[];
        } else if (ang_dep === 1 && pln.length === (ang as number[]).length) {
            // many pln, many ang
            ang = ang as number[];
            const planes: TPlane[] = [];
            for (let i = 0; i < pln.length; i++) {
                planes.push( plnLRotY(pln[i], ang[i]) as TPlane );
            }
            return planes as TPlane[];
        } else {
            throw new Error('Error rotating a list planes with a list of angles: The two lists must be of equal length.');
        }
    }
    // normal case
    pln = pln as TPlane;
    ang = ang as number;
    const x_axis: Txyz = vecRot(pln[1], pln[2], ang);
    return [pln[0].slice() as Txyz, x_axis, pln[2].slice() as Txyz];
}

export function plnLRotZ(pln: TPlane|TPlane[], ang: number|number[]): TPlane|TPlane[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    const ang_dep: number = getArrDepth2(ang);
    if (pln_dep === 3) {
        pln = pln as TPlane[];
        if (ang_dep === 0) {
            // many pln, one ang
            ang = ang as number;
            return pln.map(pln_one => plnLRotZ(pln_one, ang)) as TPlane[];
        } else if (ang_dep === 1 && pln.length === (ang as number[]).length) {
            // many pln, many ang
            ang = ang as number[];
            const planes: TPlane[] = [];
            for (let i = 0; i < pln.length; i++) {
                planes.push( plnLRotZ(pln[i], ang[i]) as TPlane );
            }
            return planes as TPlane[];
        } else {
            throw new Error('Error rotating a list planes with a list of angles: The two lists must be of equal length.');
        }
    }
    // normal case
    pln = pln as TPlane;
    ang = ang as number;
    const z_vec: Txyz = vecCross(pln[1], pln[2]);
    const x_axis: Txyz = vecRot(pln[1], z_vec, ang);
    const y_axis: Txyz = vecRot(pln[2], z_vec, ang);
    return [pln[0].slice() as Txyz, x_axis, y_axis];
}

export function plnFromRay(ray: TRay|TRay[]): TPlane|TPlane[] {
    // overloaded case
    const ray_dep: number = getArrDepth2(ray);
    if (ray_dep === 3) { return (ray as TRay[]).map( ray_one => plnFromRay(ray_one) ) as TPlane[]; }
    // normal case
    ray = ray as TRay;
    const z_vec: Txyz = vecNorm(ray[1]);
    let vec: Txyz = [0, 0, 1];
    if (vecDot(vec, z_vec) === 1) {
        vec = [1, 0, 0];
    }
    const x_axis: Txyz = vecCross(vec, z_vec);
    const y_axis: Txyz = vecCross(x_axis, z_vec);
    return [ray[0].slice() as Txyz, x_axis, y_axis];
}
