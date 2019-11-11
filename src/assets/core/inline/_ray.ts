import { TRay, TPlane, Txyz } from '@assets/libs/geo-info/common';
import { vecCross, vecMult, vecsAdd, vecSetLen, vecNorm, vecAdd, vecRot } from '@assets/libs/geom/vectors';

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

export function rayRot(ray: TRay, vec: Txyz, ang: number): TRay {
    return [ray[0].slice() as Txyz, vecRot(ray[1], vec, ang)];
}

export function rayLMove(ray: TRay, dist: number): TRay {
    const vec: Txyz = vecMult(vecNorm(ray[1]), dist);
    return [vecAdd(ray[0], vec), ray[1].slice() as Txyz];
}

export function rayFromPln(pln: TPlane): TRay {
    return [pln[0].slice() as Txyz, vecCross(pln[1], pln[2])];
}
