import { TRay, TPlane, Txyz } from '@assets/libs/geo-info/common';
import { vecCross, vecMult, vecsAdd, vecSetLen, vecNorm, vecAdd, vecRot, vecFromTo, vecSub } from '@assets/libs/geom/vectors';
import { getArrDepth2 } from '@assets/libs/util/arrs';
import { multMatrix, xformMatrix } from '@assets/libs/geom/matrix';

/**
 * Ray functions that modify rays. These functions do not modify input ray.
 *
 * The function is overloaded.
 */
export function rayMake(origin: Txyz|Txyz[], dir: Txyz|Txyz[], len?: number): TRay|TRay[] {
    // overloaded case
    const origin_dep: number = getArrDepth2(origin);
    const dir_dep: number = getArrDepth2(dir);
    if (origin_dep === 2 || dir_dep === 2) {
        if (dir_dep === 1) {
            // only origin is Txyz[]
            return (origin as Txyz[]).map( origin_val => rayMake(origin_val as Txyz, dir as Txyz, len) as TRay);
        } else if (origin_dep === 1) {
            // only dir is Txyz[]
            return (dir as Txyz[]).map( dir_val => rayMake(origin as Txyz, dir_val as Txyz, len) as TRay);
        } else {
            // both origin and dir are Txyz[], they must be equal length
            if (origin.length === dir.length) {
                const vecs: TRay[] = [];
                for (let i = 0; i < origin.length; i++) {
                    vecs.push( rayMake(origin[i] as Txyz, dir[i] as Txyz, len) as TRay );
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

export function rayCopy(ray: TRay|TRay[]): TRay|TRay[] {
    // overloaded case
    const ray_dep: number = getArrDepth2(ray);
    if (ray_dep === 3) { return (ray as TRay[]).map(ray_one => rayCopy(ray_one)) as TRay[]; }
    // normal case
    return [ray[0].slice() as Txyz, ray[1].slice() as Txyz];
}

export function rayMove(ray: TRay|TRay[], vec: Txyz|Txyz[]): TRay|TRay[] {
    // overloaded case
    const ray_dep: number = getArrDepth2(ray);
    const vec_dep: number = getArrDepth2(vec);
    if (ray_dep === 3) {
        ray = ray as TRay[];
        if (vec_dep === 1) {
            vec = vec as Txyz;
            return ray.map(ray_one => rayMove(ray_one, vec)) as TRay[];
        } else if (vec_dep === 2 && ray.length === vec.length) {
            vec = vec as Txyz[];
            const rays: TRay[] = [];
            for (let i = 0; i < ray.length; i++) {
                rays.push( rayMove(ray[i], vec[i]) as TRay );
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

export function rayRot(ray1: TRay|TRay[], ray2: TRay|TRay[], ang: number|number[]): TRay|TRay[] {
    // overloaded case
    const ray1_dep: number = getArrDepth2(ray1);
    const ray2_dep: number = getArrDepth2(ray2);
    const ang_dep: number = getArrDepth2(ang);
    if (ray1_dep === 3) {
        ray1 = ray1 as TRay[];
        if (ray2_dep === 2 && ang_dep === 0) {
            ray2 = ray2 as TRay;
            ang = ang as number;
            return ray1.map(ray1_one => rayRot(ray1_one, ray2, ang)) as TRay[];
        } else if (ray2_dep === 3 && ang_dep === 1 && ray1.length === ray2.length && ray1.length === (ang as number[]).length) {
            ray2 = ray2 as TRay[];
            ang = ang as number[];
            const rays: TRay[] = [];
            for (let i = 0; i < ray1.length; i++) {
                rays.push( rayRot(ray1[i], ray2[i], ang[i]) as TRay );
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

export function rayLMove(ray: TRay|TRay[], dist: number|number[]): TRay|TRay[] {
    // overloaded case
    const ray_dep: number = getArrDepth2(ray);
    const dist_dep: number = getArrDepth2(dist);
    if (ray_dep === 3) {
        ray = ray as TRay[];
        if (dist_dep === 0) {
            dist = dist as number;
            return ray.map(ray_one => rayLMove(ray_one, dist)) as TRay[];
        } else if (dist_dep === 1 && ray.length === (dist as number[]).length) {
            dist = dist as number[];
            const rays: TRay[] = [];
            for (let i = 0; i < ray.length; i++) {
                rays.push( rayLMove(ray[i], dist[i]) as TRay );
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

export function rayFromPln(pln: TPlane|TPlane[]): TRay|TRay[] {
    // overloaded case
    const pln_dep: number = getArrDepth2(pln);
    if (pln_dep === 3) { return (pln as TPlane[]).map( pln_one => rayFromPln(pln_one) ) as TRay[]; }
    // normal case
    pln = pln as TPlane;
    return [pln[0].slice() as Txyz, vecCross(pln[1], pln[2])];
}
// ================================================================================================
export function rayLtoG(r: TRay|TRay[], p: TPlane|TPlane[]): TRay|TRay[] {
    return rayXForm(r, p, true);
}
export function rayGtoL(r: TRay|TRay[], p: TPlane|TPlane[]): TRay|TRay[] {
    return rayXForm(r, p, false);
}
function rayXForm(r: TRay|TRay[], p: TPlane|TPlane[], to_global: boolean): TRay|TRay[] {
    // overloaded case
    const depth1: number = getArrDepth2(r);
    const depth2: number = getArrDepth2(p);
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
