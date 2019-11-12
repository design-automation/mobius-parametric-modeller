import { TPlane, TRay, Txyz } from '@assets/libs/geo-info/common';
import { vecCross, vecMult, vecsAdd, vecRot, vecNorm, vecMakeOrtho, vecAdd, vecFromTo, vecDot } from '@assets/libs/geom/vectors';

/**
 * Plane functions that modify planes. These functions do not modify input plane.
 */

export function plnMake(origin: Txyz, x_vec: Txyz, xy_vec: Txyz): TPlane {
    const x_axis: Txyz = vecNorm(x_vec);
    const y_axis: Txyz = vecNorm(vecMakeOrtho(xy_vec, x_vec));
    return [origin.slice() as Txyz, x_axis, y_axis];
}

export function plnCopy(pln: TPlane): TPlane {
    return [pln[0].slice() as Txyz, pln[1].slice() as Txyz, pln[2].slice() as Txyz];
}

export function plnMove(pln: TPlane, vec: Txyz): TPlane {
    return [vecAdd(pln[0], vec), pln[1].slice() as Txyz, pln[2].slice() as Txyz];
}

export function plnRot(pln: TPlane, ray: TRay, ang: number): TPlane {
    const from_ray_o_to_pln_o: Txyz = vecFromTo(ray[0], pln[0]);
    const rot_pln_origin: Txyz = vecAdd(ray[0], vecRot(from_ray_o_to_pln_o, ray[1], ang));
    return [rot_pln_origin, vecRot(pln[1], ray[1], ang), vecRot(pln[2], ray[1], ang)];
}

export function plnLMove(pln: TPlane, vec: Txyz): TPlane {
    const z_vec: Txyz = vecCross(pln[1], pln[2]);
    const x_move_vec: Txyz = vecMult(pln[1], vec[0]);
    const y_move_vec: Txyz = vecMult(pln[2], vec[1]);
    const z_move_vec: Txyz = vecMult(z_vec, vec[2]);
    const origin: Txyz = vecsAdd([pln[0], x_move_vec, y_move_vec, z_move_vec], false);
    return [origin, pln[1].slice() as Txyz, pln[2].slice() as Txyz];
}

export function plnLRotX(pln: TPlane, ang: number): TPlane {
    const y_axis: Txyz = vecRot(pln[2], pln[1], ang);
    return [pln[0].slice() as Txyz, pln[1].slice() as Txyz, y_axis];
}

export function plnLRotY(pln: TPlane, ang: number): TPlane {
    const x_axis: Txyz = vecRot(pln[1], pln[2], ang);
    return [pln[0].slice() as Txyz, x_axis, pln[2].slice() as Txyz];
}

export function plnLRotZ(pln: TPlane, ang: number): TPlane {
    const z_vec: Txyz = vecCross(pln[1], pln[2]);
    const x_axis: Txyz = vecRot(pln[1], z_vec, ang);
    const y_axis: Txyz = vecRot(pln[2], z_vec, ang);
    return [pln[0].slice() as Txyz, x_axis, y_axis];
}

export function plnFromRay(ray: TRay): TPlane {
    const z_vec: Txyz = vecNorm(ray[1]);
    let vec: Txyz = [0, 0, 1];
    if (vecDot(vec, z_vec) === 1) {
        vec = [1, 0, 0];
    }
    const x_axis: Txyz = vecCross(vec, z_vec);
    const y_axis: Txyz = vecCross(x_axis, z_vec);
    return [ray[0].slice() as Txyz, x_axis, y_axis];
}
