import * as Mathjs from 'mathjs';
import { checkNumArgs } from '../_check_inline_args';
/**
 * To be completed...
 * @param val
 */
export function boolean(debug: boolean, val: number) {
    if (debug) {
        checkNumArgs('boolean', arguments, 1);
    }
    return Mathjs.boolean(val);
}
/**
 * To be completed...
 * @param val
 */
export function number(debug: boolean, val: number) {
    if (debug) {
        checkNumArgs('number', arguments, 1);
    }
    return Mathjs.number(val);
}
/**
 * To be completed...
 * @param val
 */
export function string(debug: boolean, val: number) {
    if (debug) {
        checkNumArgs('string', arguments, 1);
    }
    return Mathjs.string(val);
}
/**
 * Returns the median absolute deviation of the list
 * @param list
 */
export function mad(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('mad', arguments, 1);
    }
    return Mathjs.mad(list);
}
/**
 * Returns the mean value of the list
 * @param list
 */
export function mean(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('mean', arguments, 1);
    }
    return Mathjs.mean(list);
}
/**
 * Returns the median of the list
 * @param list
 */
export function median(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('median', arguments, 1);
    }
    return Mathjs.median(list);
}
/**
 * Returns the mode of the list
 * @param list
 */
export function mode(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('mode', arguments, 1);
    }
    return Mathjs.mode(list);
}
/**
 * Returns the product of all values in a list
 * @param list
 */
export function prod(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('prod', arguments, 1);
    }
    return Mathjs.prod(list);
}
/**
 * Returns the standard deviation of the list
 * @param list
 */
export function std(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('std', arguments, 1);
    }
    return Mathjs.std(list);
}
/**
 * Returns the variance of the list
 * @param list
 */
export function vari(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('vari', arguments, 1);
    }
    return Mathjs.var(list);
}
/**
 * Returns the sum of all values in a list
 * @param list
 */
export function sum(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('sum', arguments, 1);
    }
    return Mathjs.sum(list);
}
/**
 * Returns the hypotenuse of all values in a list
 * @param list
 */
export function hypot(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('hypot', arguments, 1);
    }
    return Mathjs.hypot(list);
}
/**
 * Returns the norm of a list
 * @param list
 */
export function norm(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('norm', arguments, 1);
    }
    return Mathjs.norm(list);
}
/**
 * Returns the square of the number
 * @param list
 */
export function square(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('square', arguments, 1);
    }
    return Mathjs.square(list);
}
/**
 * Returns the cube of the number
 * @param list
 */
export function cube(debug: boolean, list: number) {
    if (debug) {
        checkNumArgs('cube', arguments, 1);
    }
    return Mathjs.cube(list);
}
