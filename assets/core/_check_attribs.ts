import * as chk from './_check_types';

// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
export function checkAttribName(fn_name: string, attrib_name: string): void {
    chk.isStr(attrib_name); // check arg is string
    if (attrib_name === undefined) {
        throw new Error (fn_name + ': ' + 'attrib_name is undefined');
    }
    if (attrib_name.length === 0) {
        throw new Error (fn_name + ': ' + 'attrib_name not specified');
    }
    if (attrib_name.search(/\W/) !== -1) {
        throw new Error (fn_name + ': ' + 'attrib_name contains restricted characters');
    }
    if (attrib_name[0].search(/[0-9]/) !== -1) {
        throw new Error (fn_name + ': ' + 'attrib_name should not start with numbers');
    }
    // blocks writing to id
    if (attrib_name === 'id') {
        throw new Error(fn_name + ': id is not modifiable!');
    }
}
export function checkAttribIdxKey(fn_name: string, idx_or_key?: number|string): void {
    // -- check defined index
    if (typeof idx_or_key === 'number') {
        // check if index is number
        chk.isNum(idx_or_key);
        // this is an item in a list, the item value can be any
    } else if (typeof idx_or_key === 'string') {
        // check if index is number
        chk.isStr(idx_or_key);
        // this is an item in an object, the item value can be any
    } else {
        throw new Error(fn_name + ': index or key is not a valid type: ' + idx_or_key);
    }
}
export function checkAttribNameIdxKey(fn_name: string, attrib: string|[string, number|string]): [string, number|string] {
    let attrib_name: string = null;
    let attrib_idx_key: number|string = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        if (attrib.length !== 2) {
            throw new Error (fn_name + ': ' + 'attrib_name not specified');
        }
        attrib_name = attrib[0] as string;
        attrib_idx_key = attrib[1] as number|string;
    } else {
        attrib_name = attrib as string;
    }
    // check that the name is ok
    checkAttribName(fn_name, attrib_name);
    // check that the array index or object key is ok
    if (attrib_idx_key !== null) {
        checkAttribIdxKey(fn_name, attrib_idx_key);
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}
export function splitAttribNameIdxKey(fn_name: string, attrib: string|[string, number|string]): [string, number|string] {
    let attrib_name: string = null;
    let attrib_idx_key: number|string = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        attrib_name = attrib[0] as string;
        attrib_idx_key = attrib[1] as number|string;
    } else {
        attrib_name = attrib as string;
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}

export function checkAttribValue(fn_name: string, attrib_value: any): void {
    // check the actual value
    chk.checkArgs(fn_name, 'attrib_value', attrib_value,
            [chk.isStr, chk.isNum, chk.isBool,
                chk.isNull, chk.isList, chk.isDict]);
}
