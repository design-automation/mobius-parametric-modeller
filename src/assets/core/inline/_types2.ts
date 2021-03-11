/**
 * Functions to check types.
 */

import { checkNumArgs } from '../_check_inline_args';

// ['isNum(v)', 'Returns true if the value is a number, false otherwise.'],
// ['isInt(v)', 'Returns true if the value is a integer, false otherwise.'],
// ['isFlt(v)', 'Returns true if the value is a floating point number, false otherwise.'],
// ['isBool(v)', 'Returns true if the value is a boolean, false otherwise.'],
// ['isStr(v)', 'Returns true if the value is a string, false otherwise.'],
// ['isList(v)', 'Returns true if the value is a list, false otherwise.'],
// ['isDict(v)', 'Returns true if the value is a dictionary, false otherwise.'],
// ['isVec2(v)', 'Returns true if the value is a list of two numbers, false otherwise.'],
// ['isVec3(v)', 'Returns true if the value is a list of three numbers, false otherwise.'],
// ['isCol(v)', 'Returns true if the value is a list of three numbers in the range [0, 1], false otherwise.'],
// ['isRay(v)', 'Returns true if the value is a ray, false otherwise.'],
// ['isPln(v)', 'Returns true if the value is a plane, false otherwise.'],
// ['isNaN(v)', 'Returns true is the value is not a number (NaN), false otherwise.'],
// ['isNull(v)', 'Returns true is the value is null, false otherwise.'],
// ['isUndef(v)', 'Returns true is the value is undefined, false otherwise.'],

/**
 * Returns true if the value is a number, false otherwise.
 * @param v
 */
export function isNum(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isNum', arguments, 1);
    }
    return typeof v === 'number';
}
/**
 * Returns true if the value is a integer, false otherwise.
 * @param v
 */
export function isInt(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isInt', arguments, 1);
    }
    return Number.isInteger(v);
}
/**
 * Returns true if the value is a floating point number, false otherwise.
 * @param v
 */
export function isFlt(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isFlt', arguments, 1);
    }
    // return !Number.isNaN(v) && v % 1 > 0;
    return typeof v === 'number';
}
/**
 * Returns true if the value is a boolean, false otherwise.
 * @param v
 */
export function isBool(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isBool', arguments, 1);
    }
    return typeof v === 'boolean';
}
/**
 * Returns true if the value is a string, false otherwise.
 * @param v
 */
export function isStr(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isStr', arguments, 1);
    }
    return typeof v === 'string';
}
/**
 * Returns true if the value is a list, false otherwise.
 * @param v
 */
export function isList(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isList', arguments, 1);
    }
    return Array.isArray(v);
}
/**
 * Returns true if the value is a dictionary, false otherwise.
 * @param v
 */
export function isDict(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isDict', arguments, 1);
    }
    // return typeof v === 'object' && !Array.isArray(v);
    return v.constructor === Object;
}
/**
 * Returns true if the value is a list of two numbers, false otherwise.
 * @param v
 */
export function isVec2(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isVec2', arguments, 1);
    }
    return Array.isArray(v) && v.length === 2 &&
        typeof v[0] === 'number' && typeof v[1] === 'number';
}
/**
 * Returns true if the value is a list of three numbers, false otherwise.
 * @param v
 */
export function isVec3(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isVec3', arguments, 1);
    }
    return Array.isArray(v) && v.length === 3 &&
        typeof v[0] === 'number' && typeof v[1] === 'number' && typeof v[2] === 'number';
}
/**
 * Returns true if the value is a list of three numbers in the range [0, 1], false otherwise.
 * @param v
 */
export function isCol(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isCol', arguments, 1);
    }
    return isVec3(debug, v) && _isWithin(0, v[0], 1) && _isWithin(0, v[1], 1) && _isWithin(0, v[2], 1);
}
/**
 * Returns true if the value is a ray, false otherwise.
 * @param v
 */
export function isRay(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isRay', arguments, 1);
    }
    return Array.isArray(v) && v.length === 2 && isVec3(debug, v[0]) && isVec3(debug, v[1]);
}
/**
 * Returns true if the value is a plane, false otherwise.
 * @param v
 */
export function isPln(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isPln', arguments, 1);
    }
    return Array.isArray(v) && v.length === 3 && isVec3(debug, v[0]) && isVec3(debug, v[1]) && isVec3(debug, v[2]);
}
/**
 * Returns true is the value is not a number (NaN), false otherwise.
 * @param v
 */
export function isNaN(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isNaN', arguments, 1);
    }
    return Number.isNaN(v);
}
/**
 * Returns true is the value is null, false otherwise.
 * @param v
 */
export function isNull(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isNull', arguments, 1);
    }
    return v === null;
}
/**
 * Returns true is the value is undefined, false otherwise.
 * @param v
 */
export function isUndef(debug: boolean, v: any): boolean {
    if (debug) {
        checkNumArgs('isUndef', arguments, 1);
    }
    return v === undefined;
}
/**
 * To be completed...
 * @param v1
 * @param v2
 * @param v3
 */
export function _isIn(v1: any, v2: any, v3: any): boolean {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 < v2 && v2 < v3;
}
/**
 * To be completed...
 * @param v1
 * @param v2
 * @param v3
 */
export function _isWithin(v1: any, v2: any, v3: any): boolean {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 <= v2 && v2 <= v3;
}
