/**
 * Functions to check types.
 */

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

export function isNum(v: any): boolean {
    return typeof v === 'number';
}
export function isInt(v: any): boolean {
    return Number.isInteger(v);
}
export function isFlt(v: any): boolean {
    // return !Number.isNaN(v) && v % 1 > 0;
    return typeof v === 'number';
}
export function isBool(v: any): boolean {
    return typeof v === 'boolean';
}
export function isStr(v: any): boolean {
    return typeof v === 'string';
}
export function isList(v: any): boolean {
    return Array.isArray(v);
}
export function isDict(v: any): boolean {
    // return typeof v === 'object' && !Array.isArray(v);
    return v.constructor === Object;
}
export function isVec2(v: any): boolean {
    return Array.isArray(v) && v.length === 2 &&
        typeof v[0] === 'number' && typeof v[1] === 'number';
}
export function isVec3(v: any): boolean {
    return Array.isArray(v) && v.length === 3 &&
        typeof v[0] === 'number' && typeof v[1] === 'number' && typeof v[2] === 'number';
}
export function isCol(v: any): boolean {
    return isVec3(v) && isWithin(0, v[0], 1) && isWithin(0, v[1], 1) && isWithin(0, v[2], 1);
}
export function isRay(v: any): boolean {
    return Array.isArray(v) && v.length === 2 && isVec3(v[0]) && isVec3(v[1]);
}
export function isPln(v: any): boolean {
    return Array.isArray(v) && v.length === 3 && isVec3(v[0]) && isVec3(v[1]) && isVec3(v[2]);
}
export function isNaN(v: any): boolean {
    return Number.isNaN(v);
}
export function isNull(v: any): boolean {
    return v === null;
}
export function isUndef(v: any): boolean {
    return v === undefined;
}
export function isIn(v1: any, v2: any, v3: any): boolean {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 < v2 && v2 < v3;
}
export function isWithin(v1: any, v2: any, v3: any): boolean {
    return typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' &&
    v1 <= v2 && v2 <= v3;
}
