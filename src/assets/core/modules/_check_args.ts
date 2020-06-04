import { TEntTypeIdx, TRay, TBBox, TPlane, Txyz, TColor, Txy } from '@libs/geo-info/common';
import * as check_types from './_check_types';

export class ArgCh {
    static isAny(fn_name: string, arg_name: string, arg: string): void {
        check_types.isAny(fn_name, arg_name, arg);
    }
    // null: allow Null input
    static isNull(fn_name: string, arg_name: string, arg: any): void {
        check_types.isNull(fn_name, arg_name, arg);
    }
    // dict
    static isDict(fn_name: string, arg_name: string, arg: any): void {
        check_types.isDict(fn_name, arg_name, arg);
    }
    // list
    static isList(fn_name: string, arg_name: string, arg: any[]): void {
        check_types.isList(fn_name, arg_name, arg);
    }
    // booleans
    static isBool(fn_name: string, arg_name: string, arg: boolean): void {
        check_types.isBool(fn_name, arg_name, arg);
    }
    static isBoolL(fn_name: string, arg_name: string, arg: boolean[]): void {
        check_types.isBoolL(fn_name, arg_name, arg);
    }
    // strings
    static isStr(fn_name: string, arg_name: string, arg: string): void {
        check_types.isStr(fn_name, arg_name, arg);
    }
    static isStrL(fn_name: string, arg_name: string, arg: string[]): void {
        check_types.isStrL(fn_name, arg_name, arg);
    }
    static isStrStr(fn_name: string, arg_name: string, arg: [string, string]): void {
        check_types.isStrL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 2);
    }
    static isStrNum(fn_name: string, arg_name: string, arg: [string, number]): void {
        check_types.isLLen(fn_name, arg_name, arg, 2);
        check_types.isStr(fn_name, arg_name, arg[0]);
        check_types.isNum(fn_name, arg_name, arg[1]);
    }
    static isNum(fn_name: string, arg_name: string, arg: number): void {
        check_types.isNum(fn_name, arg_name, arg);
    }static isNum01(fn_name: string, arg_name: string, arg: number): void {
        check_types.isNum01(fn_name, arg_name, arg);
    }
    static isNumL(fn_name: string, arg_name: string, arg: number[]): void {
        check_types.isNumL(fn_name, arg_name, arg);
    }
    static isNullL(fn_name: string, arg_name: string, arg: number[]): void {
        check_types.isNullL(fn_name, arg_name, arg);
    }
    static isInt(fn_name: string, arg_name: string, arg: number): void {
        check_types.isInt(fn_name, arg_name, arg);
    }
    static isXY(fn_name: string, arg_name: string, arg: Txy): void {
        check_types.isNumL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 2);
        check_types.isNumL(fn_name, arg_name, arg);
    }
    static isXYInt(fn_name: string, arg_name: string, arg: Txy): void {
        check_types.isIntL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 2);
        check_types.isIntL(fn_name, arg_name, arg);
    }
    static isColor(fn_name: string, arg_name: string, arg: TColor): void { // TColor = [number, number, number]
        check_types.isNumL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 3);
        check_types.isNum01L(fn_name, arg_name, arg);
        return;
    }
    static isXYZ(fn_name: string, arg_name: string, arg: Txyz): void { // Txyz = [number, number, number]
        check_types.isNumL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 3);
    }
    static isXYZL(fn_name: string, arg_name: string, arg: Txyz[]): void {
        check_types.isList(fn_name, arg_name, arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isXYZ(fn_name, arg_name, arg[i]);
        }
    }
    static isXYZLL(fn_name: string, arg_name: string, arg: Txyz[][]): void {
        check_types.isList(fn_name, arg_name, arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isXYZL(fn_name, arg_name + '[' + i + ']', arg[i]);
        }
    }
    static isPln(fn_name: string, arg_name: string, arg: TPlane): void { // TPlane = [Txyz, Txyz, Txyz]
        ArgCh.isXYZL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 3);
    }
    static isPlnL(fn_name: string, arg_name: string, arg: TPlane[]): void {
        check_types.isList(fn_name, arg_name, arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isPln(fn_name, arg_name + '[' + i + ']', arg[i]);
        }
    }
    static isBBox(fn_name: string, arg_name: string, arg: TBBox): void { // TBbox = [Txyz, Txyz, Txyz, Txyz]
        ArgCh.isXYZL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 4);
    }
    static isBBoxL(fn_name: string, arg_name: string, arg: TBBox[]): void {
        check_types.isList(fn_name, arg_name, arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isBBox(fn_name, arg_name + '[' + i + ']', arg[i]);
        }
    }
    static isRay(fn_name: string, arg_name: string, arg: TRay): void { // TRay = [Txyz, Txyz]
        ArgCh.isXYZL(fn_name, arg_name, arg);
        check_types.isLLen(fn_name, arg_name, arg, 2);
    }
    static isRayL(fn_name: string, arg_name: string, arg: TRay[]): void {
        check_types.isList(fn_name, arg_name, arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isRay(fn_name, arg_name + '[' + i + ']', arg[i]);
        }
    }
    static isRayLL(fn_name: string, arg_name: string, arg: TRay[][]): void {
        check_types.isList(fn_name, arg_name, arg);
        for (let i = 0; i < arg.length; i++) {
            ArgCh.isRayL(fn_name, arg_name + '[' + i + ']', arg[i]);
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
           ret = check_fns[i](fn_name, arg_name, arg);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret;
}
