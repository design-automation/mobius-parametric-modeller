// =====================================================================================================================
// util - check type
// =====================================================================================================================

import { TBBox, TColor, TEntTypeIdx, TPlane, TRay, Txy, Txyz } from '@assets/libs/geo-info/common';

/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param check_fns
 */
export function checkArgs(fn_name: string, arg_name: string, arg: any, check_fns: Function[]): void | TEntTypeIdx |
    TEntTypeIdx[] | TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret;
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is undefined' + '<br>');
    }
    for (let i = 0; i < check_fns.length; i++) {
        try {
            ret = check_fns[i](arg);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        // const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        // throw new Error(ret_msg + err_arr.join(''));
        let err_msg =
            'One of the arguments passed to the ' + fn_name + ' function is invalid. ' +
            '<ul>' +
            '<li>Function name: "' + fn_name + '" </li>' +
            '<li>Parameter name: "' + arg_name + '" </li>' +
            '<li>Argument value: ' + _getSampleStr(arg) + ' </li>' +
            '<li>Argument value data type: ' + getDataTypeStrFromValue(arg) + ' </li>' +
            '</ul>' +
            'The "' + arg_name + '" parameter accepts the following data types:' +
            '<ul>';
        for (const check_fn of check_fns) {
            err_msg = err_msg + '<li>' + _getDataTypeStrFromFunc(check_fn) + ' </li>';
        }
        err_msg = err_msg +
            '</ul>' +
            ' Make sure that the agument passed to the "' + arg_name + '" parameter matches one of the above perimtted data types.';
        throw new Error(err_msg);
    }
    return ret;
}
function _getSampleStr(arg: any): string {
    let str: string;
    if (Array.isArray(arg)) {
        if (arg.length > 20) {
            str = JSON.stringify(arg.slice(0, 20)) + '...array items truncated';
        } else {
            str = JSON.stringify(arg);
        }
    } else {
        str = JSON.stringify(arg);
    }
    if (str.length > 1000) {
        return str.substring(0, 1000) + ' ...data truncated';
    }
    return str;
}


// Dict
export function isDict(arg: any): void {
    if (Array.isArray(arg) || typeof arg === 'string' || arg === null || typeof arg !== 'object') {
        throw new Error ();
    }
}
// List
export function isList(arg: any): void {
    if (!Array.isArray(arg)) {
        throw new Error ();
    }
}
// List
export function isLList(arg: any): void {
    if (!Array.isArray(arg) || !Array.isArray(arg[0])) {
        throw new Error ();
    }
}
// Any
export function isAny(arg: any): void {
    if (arg === undefined) {
        throw new Error();
    }
}
// Any list
export function isAnyL(arg: any): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isAny(arg[i]);
    }
}
// Null
export function isNull(arg: any): void {
    if (arg !== null) {
        throw new Error();
    }
}
// Null list
export function isNullL(arg: any): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNull(arg[i]);
    }
}
// Boolean
export function isBool(arg: boolean): void {
    if (typeof arg !== 'boolean') {
        throw new Error();
    }
}
// Boolean list
export function isBoolL(arg: boolean[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBool(arg[i]);
    }
}
// String
export function isStr(arg: string): void {
    if (typeof arg !== 'string') {
        throw new Error();
    }
}
// String list
export function isStrL(arg: string[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isStr(arg[i]);
    }
}
// Numbers
export function isNum(arg: number): void {
    if (isNaN(arg)) { // } || isNaN(parseInt(arg, 10))) {
        throw new Error();
    }
}
// Number list
export function isNumL(arg: number[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum(arg[i]);
    }
}
// Number between 0 and 1
export function isNum01(arg: any): void {
    isNum(arg);
    if (arg < 0 || arg > 1) {
        throw new Error();
    }
}
// Number list between 0 and 1
export function isNum01L(arg: any): void {
    isNumL(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum01(arg[i]);
    }
}
// Integer
export function isInt(arg: any): void {
    if (!Number.isInteger(arg)) {
        throw new Error();
    }
}
// List Integers
export function isIntL(arg: any[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(arg[i]);
    }
}
// List Two strings
export function isStrStr(arg: [string, string]): void {
    isStrL(arg);
    isLLen(arg, 2);
}
// List String and number
export function isStrNum(arg: [string, number]): void {
    isLLen(arg, 2);
    isStr(arg[0]);
    isNum(arg[1]);
}
// List Two numbers
export function isXY(arg: Txy): void {
    isNumL(arg);
    isLLen(arg, 2);
}
// List Number and Int
export function isXYInt(arg: Txy): void {
    isIntL(arg);
    isLLen(arg, 2);
}
// List Colour - three numbers between 0 and 1
export function isColor(arg: TColor): void { // TColor = [number, number, number]
    isNumL(arg);
    isLLen(arg, 3);
    isNum01L(arg);
    return;
}
// List Three Numbers
export function isXYZ(arg: Txyz): void { // Txyz = [number, number, number]
    isNumL(arg);
    isLLen(arg, 3);
}
// List of Lists Three numbers
export function isXYZL(arg: Txyz[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZ(arg[i]);
    }
}
export function isXYZLL(arg: Txyz[][]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZL(arg[i]);
}
    }
export function isPln(arg: TPlane): void { // TPlane = [Txyz, Txyz, Txyz]
    isXYZL(arg);
    isLLen(arg, 3);
}
export function isPlnL(arg: TPlane[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
    isPln(arg[i]);
}
    }
export function isBBox(arg: TBBox): void { // TBbox = [Txyz, Txyz, Txyz, Txyz]
    isXYZL(arg);
    isLLen(arg, 4);
}
export function isBBoxL(arg: TBBox[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
    isBBox(arg[i]);
}
    }
export function isRay(arg: TRay): void { // TRay = [Txyz, Txyz]
    isXYZL(arg);
    isLLen(arg, 2);
}
export function isRayL(arg: TRay[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRay(arg[i]);
    }
}
export function isRayLL(arg: TRay[][]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRayL(arg[i]);
    }
}

// List of specified length
export function isLLen(arg: any[], len: number): void {
    if (arg.length !== len) {
        throw new Error();
    }
}

/**
 *
 * @param check_fn
 */
function _getDataTypeStrFromFunc(check_fn: any): string {
    switch (check_fn) {
        case isAny:
            return 'anything';
        case isNull:
            return 'a null value';
        case isNullL:
            return 'a list of null values';
        case isList:
            return 'a list of values';
        case isLList:
            return 'a list of lists of values';
        case isDict:
            return 'a dictionary of values';
        case isBool:
            return 'a boolean value';
        case isBoolL:
            return 'a list of booleans';
        case isStr:
            return 'a string';
        case isStrL:
            return 'a list of strings';
        case isStrStr:
            return 'a list containing two strings';
        case isStrNum:
            return 'a list containg one string and one number';
        case isNum:
            return 'a number';
        case isNumL:
            return 'a list of numbers';
        case isInt:
            return 'an integer';
        case isXY:
            return 'a list containing two numbers';
        case isXYInt:
            return 'a list containing two integers';
        case isColor:
            return 'a list containing three numbers between 0 and 1';
        case isXYZ:
            return 'a list containing three numbers';
        case isXYZL:
            return 'a list of lists conatining three numbers';
        case isXYZLL:
            return 'a nested list of lists conatining three numbers';
        case isPln:
            return 'a plane, defined by a list of three lists, each conatining three numbers';
        case isPlnL:
            return 'a list of planes, each defined by a list of three lists, each conatining three numbers';
        case isBBox:
            return 'a bounding box, defined by a list of four lists, each conatining three numbers';
        case isBBoxL:
            return 'a list of bounding boxes, each defined by a list of four lists, each conatining three numbers';
        case isRay:
            return 'a ray, defined by a list of two lists, each conatining three numbers';
        case isRayL:
            return 'a list of rays, each defined by a list of two lists, each conatining three numbers';
        case isRayLL:
            return 'a nested list of rays, each defined by a list of two lists, each conatining three numbers';
        default:
            return 'sorry... arg type not found';
    }
}

/**
 *
 * @param arg
 */
export function getDataTypeStrFromValue(arg: any): string {
    if (Array.isArray(arg)) {
        if (arg.length === 0) {
            return 'empty list';
        }
        const types_set: Set<string> = new Set();
        for (const a_arg of arg) {
            types_set.add(_typeOf(a_arg));
        }
        const types_arr: string[] = Array.from(types_set.values());
        if (types_arr.length === 1) {
            return 'a list of ' + arg.length + ' ' + types_arr[0] + 's';
        } else {
            let str = 'a list of length ' + arg.length + ', containing ';
            for (let i = 0; i < types_arr.length; i++) {
                if (i < types_arr.length - 2) {
                    str += types_arr[i] + 's, ';
                } else if (i < types_arr.length - 1) {
                    str += types_arr[i] + 's and ';
                } else {
                    str += types_arr[i] + 's';
                }
            }
            return str;
        }
    }
    return _typeOf(arg);
}
function _typeOf(arg: any): string {
    if (arg === undefined) { return 'undefined'; }
    if (arg === null) { return 'null'; }
    if (Array.isArray(arg)) { return 'list'; }
    if (typeof arg === 'object') { return 'dict'; }
    return typeof arg;
}

