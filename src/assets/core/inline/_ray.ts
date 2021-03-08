import { TRay, TPlane, Txyz } from '@assets/libs/geo-info/common';
import { vecCross, vecMult, vecsAdd, vecSetLen, vecNorm, vecAdd, vecRot, vecFromTo, vecSub } from '@assets/libs/geom/vectors';
import { getArrDepth } from '@assets/libs/util/arrs';
import { multMatrix, xformMatrix } from '@assets/libs/geom/matrix';
import { checkNumArgs } from '../_check_inline_args';

/**
 * Creates a ray from an origin "o" and a direction vector "d".
 * Creates a ray from an origin "o", a direction vector "d", and length "l".
 * @param origin
 * @param dir
 * @param len
 */
export function rayMake(debug: boolean, origin: Txyz|Txyz[], dir: Txyz|Txyz[], len?: number): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayMake', arguments, 3, 2);
    }
    // overloaded case
    const origin_dep: number = getArrDepth(origin);
    const dir_dep: number = getArrDepth(dir);
    if (origin_dep === 2 || dir_dep === 2) {
        if (dir_dep === 1) {
            // only origin is Txyz[]
            return (origin as Txyz[]).map( origin_val => rayMake(debug, origin_val as Txyz, dir as Txyz, len) as TRay);
        } else if (origin_dep === 1) {
            // only dir is Txyz[]
            return (dir as Txyz[]).map( dir_val => rayMake(debug, origin as Txyz, dir_val as Txyz, len) as TRay);
        } else {
            // both origin and dir are Txyz[], they must be equal length
            if (origin.length === dir.length) {
                const vecs: TRay[] = [];
                for (let i = 0; i < origin.length; i++) {
                    vecs.push( rayMake(debug, origin[i] as Txyz, dir[i] as Txyz, len) as TRay );
                }
                return vecs;
            } else {
                throw new Error('Error making rays with lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both origin and dir are Txyz
    const ray_vec: Txyz = len ? vecSetLen(dir as Txyz, len) : dir as Txyz;
    return [origin.slice() as Txyz, ray_vec];
}
/**
 * Creates a ray between to points.
 * @param xyz1
 * @param xyz2
 */
export function rayFromTo(debug: boolean, xyz1: Txyz|Txyz[], xyz2: Txyz|Txyz[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayFromTo', arguments, 2);
    }
    // overloaded case
    const depth1: number = getArrDepth(xyz1);
    const depth2: number = getArrDepth(xyz2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only xyz1 is Txyz[]
            return (xyz1 as Txyz[]).map( a_xyz1 => [a_xyz1, vecFromTo(a_xyz1 as Txyz, xyz2 as Txyz)] as TRay );
        } else if (depth1 === 1) {
            // only xyz2 is Txyz[]
            return (xyz2 as Txyz[]).map( a_xyz2 => [xyz1, vecFromTo(xyz1 as Txyz, a_xyz2 as Txyz)] as TRay );
        } else {
            // both xyz1 and xyz2 are Txyz[], they must be equal length
            if (xyz1.length === xyz2.length) {
                const rays: TRay[] = [];
                for (let i = 0; i < xyz1.length; i++) {
                    rays.push( [xyz1[i], vecFromTo(xyz1[i] as Txyz, xyz2[i] as Txyz)] as TRay );
                }
                return rays;
            } else {
                throw new Error(
                    'Error calculating vectors between two between lists of coordinates: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both xyz1 and xyz2 are Txyz
    return [xyz1, vecFromTo(xyz1 as Txyz, xyz2 as Txyz)] as TRay;
}
/**
 * Make a copy of the ray "r"
 * @param ray
 */
export function rayCopy(debug: boolean, ray: TRay|TRay[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayCopy', arguments, 1);
    }
    // overloaded case
    const ray_dep: number = getArrDepth(ray);
    if (ray_dep === 3) { return (ray as TRay[]).map(ray_one => rayCopy(debug, ray_one)) as TRay[]; }
    // normal case
    return [ray[0].slice() as Txyz, ray[1].slice() as Txyz];
}
/**
 * Move the ray "r" relative to the global X, Y, and Z axes, by vector "v".
 * @param ray
 * @param vec
 */
export function rayMove(debug: boolean, ray: TRay|TRay[], vec: Txyz|Txyz[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayMove', arguments, 2);
    }
    // overloaded case
    const ray_dep: number = getArrDepth(ray);
    const vec_dep: number = getArrDepth(vec);
    if (ray_dep === 3) {
        ray = ray as TRay[];
        if (vec_dep === 1) {
            vec = vec as Txyz;
            return ray.map(ray_one => rayMove(debug, ray_one, vec)) as TRay[];
        } else if (vec_dep === 2 && ray.length === vec.length) {
            vec = vec as Txyz[];
            const rays: TRay[] = [];
            for (let i = 0; i < ray.length; i++) {
                rays.push( rayMove(debug, ray[i], vec[i]) as TRay );
            }
        } else {
            throw new Error('Error moving a list rays with a list of vectors: The two lists must be of equal length.');
        }
    }
    // normal case
    ray = ray as TRay;
    vec = vec as Txyz;
    return [vecAdd(ray[0], vec), ray[1].slice() as Txyz];
}
/**
 * Rotate the ray "r1" around the ray "r2", by angle "a" (in radians).
 * @param ray1
 * @param ray2
 * @param ang
 */
export function rayRot(debug: boolean, ray1: TRay|TRay[], ray2: TRay|TRay[], ang: number|number[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayRot', arguments, 3);
    }
    // overloaded case
    const ray1_dep: number = getArrDepth(ray1);
    const ray2_dep: number = getArrDepth(ray2);
    const ang_dep: number = getArrDepth(ang);
    if (ray1_dep === 3) {
        ray1 = ray1 as TRay[];
        if (ray2_dep === 2 && ang_dep === 0) {
            ray2 = ray2 as TRay;
            ang = ang as number;
            return ray1.map(ray1_one => rayRot(debug, ray1_one, ray2, ang)) as TRay[];
        } else if (ray2_dep === 3 && ang_dep === 1 && ray1.length === ray2.length && ray1.length === (ang as number[]).length) {
            ray2 = ray2 as TRay[];
            ang = ang as number[];
            const rays: TRay[] = [];
            for (let i = 0; i < ray1.length; i++) {
                rays.push( rayRot(debug, ray1[i], ray2[i], ang[i]) as TRay );
            }
            return rays as TRay[];
        } else {
            throw new Error('Error rotating a list planes with a list of ray2s and angles: The three lists must be of equal length.');
        }
    }
    // normal case
    ray1 = ray1 as TRay;
    ray2 = ray2 as TRay;
    ang = ang as number;
    const from_ray2_o_to_ray1_o: Txyz = vecFromTo(ray2[0], ray1[0]);
    const rot_ray1_origin: Txyz = vecAdd(ray2[0], vecRot(from_ray2_o_to_ray1_o, ray2[1], ang));
    return [rot_ray1_origin, vecRot(ray1[1], ray2[1], ang)];
}
/**
 * Move the ray "r" relative to the ray direction vector, by distance "d".
 * @param ray
 * @param dist
 */
export function rayLMove(debug: boolean, ray: TRay|TRay[], dist: number|number[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayLMove', arguments, 2);
    }
    // overloaded case
    const ray_dep: number = getArrDepth(ray);
    const dist_dep: number = getArrDepth(dist);
    if (ray_dep === 3) {
        ray = ray as TRay[];
        if (dist_dep === 0) {
            dist = dist as number;
            return ray.map(ray_one => rayLMove(debug, ray_one, dist)) as TRay[];
        } else if (dist_dep === 1 && ray.length === (dist as number[]).length) {
            dist = dist as number[];
            const rays: TRay[] = [];
            for (let i = 0; i < ray.length; i++) {
                rays.push( rayLMove(debug, ray[i], dist[i]) as TRay );
            }
        } else {
            throw new Error('Error moving a list rays with a list of distances: The two lists must be of equal length.');
        }
    }
    // normal case
    ray = ray as TRay;
    dist = dist as number;
    const vec: Txyz = vecMult(vecNorm(ray[1]), dist);
    return [vecAdd(ray[0], vec), ray[1].slice() as Txyz];
}
/**
 * Create a ray from a plane "p", with the same origin and with a direction along the plane z axis.
 * @param pln
 */
export function rayFromPln(debug: boolean, pln: TPlane|TPlane[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayFromPln', arguments, 1);
    }
    // overloaded case
    const pln_dep: number = getArrDepth(pln);
    if (pln_dep === 3) { return (pln as TPlane[]).map( pln_one => rayFromPln(debug, pln_one) ) as TRay[]; }
    // normal case
    pln = pln as TPlane;
    return [pln[0].slice() as Txyz, vecCross(pln[1], pln[2])];
}
/**
 * Transforms a ray from a local coordinate system define by plane "p" to the global coordinate system.
 * @param r
 * @param p
 */
export function rayLtoG(debug: boolean, r: TRay|TRay[], p: TPlane|TPlane[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayLtoG', arguments, 2);
    }
    return _rayXForm(debug, r, p, true);
}
/**
 * Transforms a ray from the global coordinate system to a local coordinate system define by plane "p".
 * @param r
 * @param p
 */
export function rayGtoL(debug: boolean, r: TRay|TRay[], p: TPlane|TPlane[]): TRay|TRay[] {
    if (debug) {
        checkNumArgs('rayGtoL', arguments, 2);
    }
    return _rayXForm(debug, r, p, false);
}
function _rayXForm(debug: boolean, r: TRay|TRay[], p: TPlane|TPlane[], to_global: boolean): TRay|TRay[] {
    // overloaded case
    const depth1: number = getArrDepth(r);
    const depth2: number = getArrDepth(p);
    if (depth1 === 2 && depth2 === 2) {
        // r is TRay and p is TPlane
        r = r as TRay;
        p = p as TPlane;
        const p2: TPlane = [[0, 0, 0], p[1], p[2]];
        const origin: Txyz = multMatrix(r[0], xformMatrix(p, to_global));
        const dir: Txyz = multMatrix(r[1], xformMatrix(p2, to_global));
        return [origin, dir] as TRay;
    } else if (depth1 === 3 && depth2 === 2) {
        // r is TRay[] and p is TPlane
        r = r as TRay[];
        p = p as TPlane;
        const p2: TPlane = [[0, 0, 0], p[1], p[2]];
        const m = xformMatrix(p as TPlane, to_global);
        const m2 = xformMatrix(p2 as TPlane, to_global);
        const result: TRay[] = [];
        for (const a_r of r) {
            const origin: Txyz = multMatrix(a_r[0], m);
            const dir: Txyz = multMatrix(a_r[1], m2);
            result.push([origin, dir]);
        }
        return result;
    } else if (depth1 === 2 && depth2 === 3) {
        // r is TRay and p is TPlane[]
        r = r as TRay;
        p = p as TPlane[];
        const result: TRay[] = [];
        for (const a_p of p) {
            const p2: TPlane = [[0, 0, 0], a_p[1], a_p[2]];
            const origin: Txyz = multMatrix(r[0], xformMatrix(a_p, to_global));
            const dir: Txyz = multMatrix(r[1], xformMatrix(p2, to_global));
            result.push([origin, dir]);
        }
        return result;
    } else if (depth1 === 3 && depth2 === 3) {
        // r is TRay[] p is TPlane[], they must be equal length
        r = r as TRay[];
        p = p as TPlane[];
        if (r.length !== p.length) {
            throw new Error(
                'Error transforming rays: The list of rays and list of planes must be of equal length.');
        }
        const result: TRay[] = [];
        for (let i = 0; i < r.length; i++) {
            const p2: TPlane = [[0, 0, 0], p[i][1], p[i][2]];
            const origin: Txyz = multMatrix(r[i][0], xformMatrix(p[i], to_global));
            const dir: Txyz = multMatrix(r[i][1], xformMatrix(p2, to_global));
            result.push([origin, dir]);
        }
        return result;
    }
    throw new Error(
        'Error transforming rays: Cannot process the input lists.');
}
