import * as isect from '@libs/geom/intersect';
import * as dist from '@libs/geom/distance';
import { checkNumArgs } from '../_check_inline_args';
type Txyz = [number, number, number];
type TRay = [Txyz, Txyz];
type TPlane = [Txyz, Txyz, Txyz];

/**
 * Returns the intersection xyz between two rays, where...
    ['intersect(r1, r2)', 'Returns the intersection xyz between two infinite rays'],
    ['intersect(r1, r2, m)', 'Returns the intersection xyz between two rays, where ' +
        'if m=2, rays are infinite in both directions, ' +
        'if m=1 rays are infinite in one direction, ' +
        'and if m=0, rays are not infinite.'],
    ['intersect(r, p)', 'Returns the intersection xyz between an infinite ray r and an infinite plane p'],
    ['intersect(r, p, m)', 'Returns the intersection xyz between a ray r and an infinite plane p, where ' +
        'if m=2, the ray is infinite in both directions, ' +
        'if m=1 the ray is infinite in one direction, ' +
        'and if m=0, the ray is not infinite.'],
 * @param r1
 * @param r2
 * @param met
 */
export function intersect(debug: boolean, r1: TRay, r2: TRay|TPlane, met: number = 2) {
    if (debug) {
        checkNumArgs('intersect', arguments, 3, 2);
    }
    return isect.intersect(r1, r2, met);
}
/**
 * Returns the xyz from projecting an xyz c onto an infinite ray r...
    ['project(c, r)', 'Returns the xyz from projecting an xyz c onto an infinite ray r'],
    ['project(c, r, m)', 'Returns the xyz from projecting an xyz c onto an infinite ray r, where ' +
        'if m=2, the ray is infinite in both directions, ' +
        'if m=1 the ray is infinite in one direction, ' +
        'and if m=0, the ray is not infinite.'],
    ['project(c, p)', 'Returns the xyz from projecting an xyz c onto an infinite plane p']
 * @param c
 * @param r
 * @param met
 */
export function project(debug: boolean, c: Txyz, r: TRay|TPlane, met: number = 2) {
    if (debug) {
        checkNumArgs('project', arguments, 3, 2);
    }
    return isect.project(c, r, met);
}
/**
 * Returns the Euclidean distance between two xyzs, c1 and c2'
 * Returns the Euclidean distance between an xyz c and an infinite ray r'
 * Returns the Euclidean distance between an xyz c and an infinite plane p'
 * @param c1
 * @param c2
 */
export function distance(debug: boolean, c1: Txyz, c2: Txyz|TRay|TPlane) {
    if (debug) {
        checkNumArgs('distance', arguments, 2);
    }
    return dist.distance(c1, c2);
}
/**
 * Returns the Manhattan distance between two xyzs, c1 and c2
 * Returns the Manhattan distance between an xyz c and an infinite ray r'
 * Returns the Manhattan distance between an xyz c and an infinite plane p'
 * @param c1
 * @param c2
 */
export function distanceM(debug: boolean, c1: Txyz, c2: Txyz|TRay|TPlane) {
    if (debug) {
        checkNumArgs('distanceM', arguments, 2);
    }
    return dist.distanceManhattan(c1, c2);
}
/**
 * Returns the Manhattan squared distance between two xyzs, c1 and c2
 * Returns the Manhattan squared distance between an xyz c and an infinite ray r'
 * Returns the Manhattan squared distance between an xyz c and an infinite plane p'
 * @param c1
 * @param c2
 */
export function distanceMS(debug: boolean, c1: Txyz, c2: Txyz|TRay|TPlane) {
    if (debug) {
        checkNumArgs('distanceMS', arguments, 2);
    }
    return dist.distanceManhattanSq(c1, c2);
}


