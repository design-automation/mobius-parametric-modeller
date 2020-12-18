import { getArrDepth } from '@assets/libs/util/arrs';
import { TEntTypeIdx, TRay, TBBox, TPlane, Txyz, TColor, Txy } from '@libs/geo-info/common';
import * as check_types from './_check_types';
import { getDataTypeStrFromValue } from './_check_types';

export class ArgCh {
    static isAny(arg: string): void {
        check_types.isAny(arg);
    }
    static isNull(arg: any): void {
        check_types.isNull(arg);
    }
    static isNullL(arg: number[]): void {
        check_types.isNullL(arg);
    }
    static isDict(arg: any): void {
        check_types.isDict(arg);
    }
    static isList(arg: any[]): void {
        check_types.isList(arg);
    }
    static isBool(arg: boolean): void {
        check_types.isBool(arg);
    }
    static isBoolL(arg: boolean[]): void {
        check_types.isBoolL(arg);
    }
    static isStr(arg: string): void {
        check_types.isStr(arg);
    }
    static isStrL(arg: string[]): void {
        check_types.isStrL(arg);
    }
    static isStrStr(arg: [string, string]): void {
        check_types.isStrL(arg);
        check_types.isLLen(arg, 2);
    }
    static isStrNum(arg: [string, number]): void {
        check_types.isLLen(arg, 2);
        check_types.isStr(arg[0]);
        check_types.isNum(arg[1]);
    }
    static isNum(arg: number): void {
        check_types.isNum(arg);
    }static isNum01(arg: number): void {
        check_types.isNum01(arg);
    }
    static isNumL(arg: number[]): void {
        check_types.isNumL(arg);
    }
    static isInt(arg: number): void {
        check_types.isInt(arg);
    }
    static isXY(arg: Txy): void {
        check_types.isNumL(arg);
        check_types.isLLen(arg, 2);
    }
    static isXYInt(arg: Txy): void {
        check_types.isIntL(arg);
        check_types.isLLen(arg, 2);
    }
    static isColor(arg: TColor): void { // TColor = [number, number, number]
        check_types.isNumL(arg);
        check_types.isLLen(arg, 3);
        check_types.isNum01L(arg);
        return;
    }
    static isXYZ(arg: Txyz): void { // Txyz = [number, number, number]
        check_types.isNumL(arg);
        check_types.isLLen(arg, 3);
    }
    static isXYZL(arg: Txyz[]): void {
        check_types.isList(arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isXYZ(arg[i]);
        }
    }
    static isXYZLL(arg: Txyz[][]): void {
        check_types.isList(arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isXYZL(arg[i]);
        }
    }
    static isPln(arg: TPlane): void { // TPlane = [Txyz, Txyz, Txyz]
        ArgCh.isXYZL(arg);
        check_types.isLLen(arg, 3);
    }
    static isPlnL(arg: TPlane[]): void {
        check_types.isList(arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isPln(arg[i]);
        }
    }
    static isBBox(arg: TBBox): void { // TBbox = [Txyz, Txyz, Txyz, Txyz]
        ArgCh.isXYZL(arg);
        check_types.isLLen(arg, 4);
    }
    static isBBoxL(arg: TBBox[]): void {
        check_types.isList(arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isBBox(arg[i]);
        }
    }
    static isRay(arg: TRay): void { // TRay = [Txyz, Txyz]
        ArgCh.isXYZL(arg);
        check_types.isLLen(arg, 2);
    }
    static isRayL(arg: TRay[]): void {
        check_types.isList(arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isRay(arg[i]);
        }
    }
    static isRayLL(arg: TRay[][]): void {
        check_types.isList(arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isRayL(arg[i]);
        }
    }
}
export function checkArgs(fn_name: string, arg_name: string, arg: any, check_fns: Function[]): void|TEntTypeIdx|
                               TEntTypeIdx[]|TEntTypeIdx[][] {
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
            '<li>Argument value: ' + JSON.stringify(arg) + ' </li>' +
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
function _getDataTypeStrFromFunc(check_fn: any): string {
    switch (check_fn) {
        case ArgCh.isAny:
            return 'anything';
        case ArgCh.isNull:
            return 'a null value';
        case ArgCh.isNullL:
            return 'a list of null values';
        case ArgCh.isList:
            return 'a list of values';
        case ArgCh.isDict:
            return 'a dictionary of values';
        case ArgCh.isBool:
            return 'a boolean value';
        case ArgCh.isBoolL:
            return 'a list of booleans';
        case ArgCh.isStr:
            return 'a string';
        case ArgCh.isStrL:
            return 'a list of strings';
        case ArgCh.isStrStr:
            return 'a list containing two strings';
        case ArgCh.isStrNum:
            return 'a list containg one string and one number';
        case ArgCh.isNum:
            return 'a number';
        case ArgCh.isNumL:
            return 'a list of numbers';
        case ArgCh.isInt:
            return 'an integer';
        case ArgCh.isXY:
            return 'a list containing two numbers';
        case ArgCh.isXYInt:
            return 'a list containing two integers';
        case ArgCh.isColor:
            return 'a list containing three numbers between 0 and 1';
        case ArgCh.isXYZ:
            return 'a list containing three numbers';
        case ArgCh.isXYZL:
            return 'a list of lists conatining three numbers';
        case ArgCh.isXYZLL:
            return 'a nested list of lists conatining three numbers';
        case ArgCh.isPln:
            return 'a plane, defined by a list of three lists, each conatining three numbers';
        case ArgCh.isPlnL:
            return 'a list of planes, each defined by a list of three lists, each conatining three numbers';
        case ArgCh.isBBox:
            return 'a bounding box, defined by a list of four lists, each conatining three numbers';
        case ArgCh.isBBoxL:
            return 'a list of bounding boxes, each defined by a list of four lists, each conatining three numbers';
        case ArgCh.isRay:
            return 'a ray, defined by a list of two lists, each conatining three numbers';
        case ArgCh.isRayL:
            return 'a list of rays, each defined by a list of two lists, each conatining three numbers';
        case ArgCh.isRayLL:
            return 'a nested list of rays, each defined by a list of two lists, each conatining three numbers';
        default:
            return 'sorry... arg type not found';
    }
}
