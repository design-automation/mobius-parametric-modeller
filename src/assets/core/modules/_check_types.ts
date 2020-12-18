// =====================================================================================================================
// util - check type
// =====================================================================================================================
// Dict
export function isDict(arg: any): void {
    if (Array.isArray(arg) || typeof arg !== 'object') {
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
// List of specified length
export function isLLen(arg: any[], len: number): void {
    if (arg.length !== len) {
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
// Integer list
export function isIntL(arg: any[]): void {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(arg[i]);
    }
}
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
    if (Array.isArray(arg)) { return 'list'; }
    if (typeof arg === 'object') { return 'dict'; }
    return typeof arg;
}

