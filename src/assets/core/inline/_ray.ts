import { TRay, TPlane, Txyz } from '@assets/libs/geo-info/common';
import { vecCross, vecMult, vecsAdd, vecSetLen, vecNorm, vecAdd, vecRot, vecFromTo } from '@assets/libs/geom/vectors';

/**
 * Ray functions that modify rays. These functions do not modify input ray.
 */


export function rayMake(origin: Txyz, dir: Txyz, len?: number): TRay {
    const ray_vec: Txyz = len ? vecSetLen(dir, len) : dir;
    return [origin.slice() as Txyz, ray_vec];
}

export function rayCopy(ray: TRay): TRay {
    return [ray[0].slice() as Txyz, ray[1].slice() as Txyz];
}

export function rayMove(ray: TRay, vec: Txyz): TRay {
    return [vecAdd(ray[0], vec), ray[1].slice() as Txyz];
}

export function rayRot(ray1: TRay, ray2: TRay, ang: number): TRay {
    const from_ray2_o_to_ray1_o: Txyz = vecFromTo(ray2[0], ray1[0]);
    const rot_ray1_origin: Txyz = vecAdd(ray2[0], vecRot(from_ray2_o_to_ray1_o, ray2[1], ang));
    return [rot_ray1_origin, vecRot(ray1[1], ray2[1], ang)];
}

export function rayLMove(ray: TRay, dist: number): TRay {
    const vec: Txyz = vecMult(vecNorm(ray[1]), dist);
    return [vecAdd(ray[0], vec), ray[1].slice() as Txyz];
}

export function rayFromPln(pln: TPlane): TRay {
    return [pln[0].slice() as Txyz, vecCross(pln[1], pln[2])];
}
