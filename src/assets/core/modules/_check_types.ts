// =====================================================================================================================
// util - check type
// =====================================================================================================================
// Dict
export function isDict(fn_name: string, arg_name: string, arg: any): void {
    if (Array.isArray(arg) || typeof arg !== 'object') {
        throw new Error (fn_name + ': ' + arg_name + ' is not a dict');
    }
}
// List
export function isList(fn_name: string, arg_name: string, arg: any): void {
    if (!Array.isArray(arg)) {
        throw new Error (fn_name + ': ' + arg_name + ' is not a list');
    }
}
// List of specified length
export function isLLen(fn_name: string, arg_name: string, arg: any[], len: number): void {
    if (arg.length !== len) {
        throw new Error (fn_name + ': ' + arg_name + ' is not a list of length ' + len);
    }
}
// Any
export function isAny(fn_name: string, arg_name: string, arg: any): void {
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' must be defined');
    }
}
// Any list
export function isAnyL(fn_name: string, arg_name: string, arg: any): void {
    isList(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isAny(fn_name, arg_name + '[' + i + ']', arg[i]);
    }
}
// Null
export function isNull(fn_name: string, arg_name: string, arg: any): void {
    if (arg !== null) {
        throw new Error(fn_name + ': ' + arg_name + ' is not null');
    }
}
// Null list
export function isNullL(fn_name: string, arg_name: string, arg: any): void {
    isList(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isNull(fn_name, arg_name + '[' + i + ']', arg[i]);
    }
}
// Boolean
export function isBool(fn_name: string, arg_name: string, arg: boolean): void {
    if (typeof arg !== 'boolean') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a boolean');
    }
}
// Boolean list
export function isBoolL(fn_name: string, arg_name: string, arg: boolean[]): void {
    isList(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isBool(fn_name, arg_name + '[' + i + ']', arg[i]);
    }
}
// String
export function isStr(fn_name: string, arg_name: string, arg: string): void {
    if (typeof arg !== 'string') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a string');
    }
}
// String list
export function isStrL(fn_name: string, arg_name: string, arg: string[]): void {
    isList(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isStr(fn_name, arg_name + '[' + i + ']', arg[i]);
    }
}
// Numbers
export function isNum(fn_name: string, arg_name: string, arg: number): void {
    if (isNaN(arg)) { // } || isNaN(parseInt(arg, 10))) {
        throw new Error(fn_name + ': ' + arg_name + ' is not a number');
    }
}
// Number list
export function isNumL(fn_name: string, arg_name: string, arg: number[]): void {
    isList(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isNum(fn_name, arg_name + '[' + i + ']', arg[i]);
    }
}
// Number between 0 and 1
export function isNum01(fn_name: string, arg_name: string, arg: any): void {
    isNum(fn_name, arg_name, arg);
    if (arg < 0 || arg > 1) {
        throw new Error(fn_name + ': ' + arg_name + ' must be between 0 and 1');
    }
}
// Number list between 0 and 1
export function isNum01L(fn_name: string, arg_name: string, arg: any): void {
    isNumL(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isNum01(fn_name, arg_name + '[' + i + ']', arg[i]);
    }
}
// Integer
export function isInt(fn_name: string, arg_name: string, arg: any): void {
    if (!Number.isInteger(arg)) {
        throw new Error(fn_name + ': ' + arg_name + ' is not an integer');
    }
}
// Integer list
export function isIntL(fn_name: string, arg_name: string, arg: any[]): void {
    isList(fn_name, arg_name, arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(fn_name, arg_name, arg[i]);
    }
}
