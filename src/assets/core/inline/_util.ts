import { checkNumArgs } from '../_check_inline_args';

/**
 * Returns true if the absolute difference between the two numbers is less than the tolerance, t
 * @param n1
 * @param n2
 * @param t
 */
export function isApprox(debug: boolean, n1: number, n2: number, t: number) {
    if (debug) {
        checkNumArgs('isApprox', arguments, 1);
    }
    return Math.abs(n1 - n2) < t;
}
/**
 * Returns v1 < v2 < v3.
 * @param v1
 * @param v2
 * @param v3
 */
export function isIn(debug: boolean, v1: any, v2: any, v3: any): boolean {
    if (debug) {
        checkNumArgs('isIn', arguments, 1);
    }
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 < v2 && v2 < v3;
}
/**
 * Returns v1 <= v2 <= v3.
 * @param v1
 * @param v2
 * @param v3
 */
export function isWithin(debug: boolean, v1: any, v2: any, v3: any): boolean {
    if (debug) {
        checkNumArgs('isWithin', arguments, 1);
    }
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 <= v2 && v2 <= v3;
}
