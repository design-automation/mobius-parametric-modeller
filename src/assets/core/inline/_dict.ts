/**
 * Functions for working with dictionaries. The functions do not modify input dictionaries.
 */
import lodash from 'lodash';
import * as chk from '../_check_types';
import { isDict, isStr, isStrL } from '../_check_types';
import { checkNumArgs } from '../_check_inline_args';

/**
 * Returns the item in the dictionary specified by key.
 * If the key does nto exist, undefined is returned.
 *
 * If a list of keys is provided, then a list of values will be returned.
 *
 * @param dict The dictionary.
 * @param key The key, either a single string or a list of strings.
 */
export function dictGet(debug: boolean, dict: object, key: string|string[]): any|any[] {
    if (debug) {
        checkNumArgs('dictGet', arguments, 2);
        chk.checkArgs('dictGet', 'dict', dict, [isDict]);
        chk.checkArgs('dictGet', 'key', key, [isStr, isStrL]);
    }
    if (Array.isArray(key)) { return key.map( a_key => dict[a_key]) as any[]; }
    return dict[key] as any;
}
/**
 * Returns an array of all the keys in a dictionary.
 *
 * @param dict The dictionary.
 */
export function dictKeys(debug: boolean, dict: object): string[] {
    if (debug) {
        checkNumArgs('dictKeys', arguments, 1);
        chk.checkArgs('dictKeys', 'dict', dict, [isDict]);
    }
    return Object.keys(dict);
}
/**
 * Returns an array of all the values in a dictionary.
 *
 * @param dict The dictionary.
 */
export function dictVals(debug: boolean, dict: object): string[] {
    if (debug) {
        checkNumArgs('dictVals', arguments, 1);
        chk.checkArgs('dictVals', 'dict', dict, [isDict]);
    }
    return Object.values(dict);
}
/**
 * Returns true if the dictionary contains the given key, false otherwsie.
 *
 * If a list of keys is given, a list of true/false values will be returned.
 *
 * @param dict The dictionary.
 * @param key The key, either a string or a list of strings.
 */
export function dictHasKey(debug: boolean, dict: object, key: string|string[]): boolean|boolean[] {
    if (debug) {
        checkNumArgs('dictHasKey', arguments, 2);
        chk.checkArgs('dictHasKey', 'dict', dict, [isDict]);
        chk.checkArgs('dictHasKey', 'key', key, [isStr, isStrL]);
    }
    if (Array.isArray(key)) { return key.map( a_key => dict.hasOwnProperty(a_key)) as boolean[]; }
    return dict.hasOwnProperty(key);
}
/**
 * Returns true if the dictionary contains the given value, false otherwsie.
 *
 * @param dict The dictionary.
 * @param val The value to seach for, can be any type.
 */
export function dictHasVal(debug: boolean, dict: object, val: any): boolean {
    if (debug) {
        checkNumArgs('dictHasVal', arguments, 2);
        chk.checkArgs('dictHasVal', 'dict', dict, [isDict]);
    }
    return Object.values(dict).indexOf(val) !== -1;
}
/**
 * Returns the first key in the dictionary that has the given value.
 *
 * If the value does not exist, returns null.
 *
 * @param dict The dictionary.
 * @param val The value, can be any type.
 */
export function dictFind(debug: boolean, dict: object, val: any|any[]): string {
    if (debug) {
        checkNumArgs('dictFind', arguments, 2);
        chk.checkArgs('dictFind', 'dict', dict, [isDict]);
    }
    for (const key of Object.keys(dict)) {
        if (dict[key] === val) { return key; }
    }
    return null;
}
/**
 * Returns a deep copy of the dictionary.
 *
 * A deep copy means that changing values in the copied dictionary will not affect the original dictionary.
 *
 * @param dict The dictionary.
 */
export function dictCopy(debug: boolean, dict: object): object {
    if (debug) {
        checkNumArgs('dictCopy', arguments, 1);
        chk.checkArgs('dictCopy', 'dict', dict, [isDict]);
    }
    return lodash.cloneDeep(dict);
}
/**
 * Returns true if the values in the two dictionaries are equal.
 *
 * Performs a deep comparison between values to determine if they are equivalent.
 *
 * @param dict1 The first dictionary.
 * @param dict2 The second dictionary.
 */
export function dictEq(debug: boolean, dict1: any[], dict2: any[]): boolean {
    if (debug) {
        checkNumArgs('dictEq', arguments, 2);
        chk.checkArgs('dictEq', 'dict1', dict1, [isDict]);
        chk.checkArgs('dictEq', 'dict2', dict2, [isDict]);
    }
    return lodash.isEqual(dict1, dict2);
}







