/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.

 */

/**
 *
 */

import { checkCommTypes, TypeCheckObj } from '../_check_args';

// ================================================================================================
/**
 * Adds one or more key-value pairs to a dict. Existing keys with the same name will be overwritten.
 * ~
 * @param dict Dictionary to add the key-value to.
 * @param keys_values A key-value pair [key, value], or list of key-value pairs.
 * @returns void
 */
export function Add(dict: object, keys_values: [string, any]|[string, any][]): void {
    // --- Error Check ---
    const fn_name = 'dict.Add';
    checkCommTypes(fn_name, 'key_value', keys_values, [TypeCheckObj.isList]);
    // --- Error Check ---
    if (keys_values.length > 0) {
        if (!Array.isArray(keys_values[0])) { keys_values = [keys_values] as [string, any][]; }
    }
    for (const key_value of keys_values) {
        if (key_value.length !== 2) {
            throw new Error('dict.Add: Key-value pairs must be of length 2; \
                the following key-value pair is not valid: "' + key_value + '".');
        }
        if (typeof key_value[0] !== 'string') {
            throw new Error('dict.Add: Keys must be of type string; \
                the following key is not valid: "' + key_value[0] + '".');
        }
        dict[key_value[0]] = key_value[1];
    }
}
// ================================================================================================
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * ~
 * @param dict The dict in which to remove keys
 * @param key The key or list of keys to remove.
 * @returns void
 */
export function Remove(dict: object, keys: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'dict.Remove';
    checkCommTypes(fn_name, 'key', keys, [TypeCheckObj.isString, TypeCheckObj.isStringList]);
    // --- Error Check ---
    if (!Array.isArray(keys)) { keys = [keys] as string[]; }
    keys = keys as string[];
    for (const key of keys) {
        if (typeof key !== 'string') {
            throw new Error('dict.Remove: Keys must be strings; \
                the following key is not valid:"' + key + '".');
        }
        if (key in dict) {
            delete dict[key];
        }
    }
}
// ================================================================================================
/**
 * Replaces keys in a dict. If the key does not exist, no action is taken and no error is thrown.
 * ~
 * @param dict The dict in which to replace keys
 * @param key_pairs Pairs of keys, [old_key, new_key], or list of pairs of keys.
 * @returns void
 */
export function Replace(dict: object, key_pairs: [string, string]|[string, string][]): void {
    // --- Error Check ---
    const fn_name = 'dict.Replace';
    checkCommTypes(fn_name, 'key_pairs', key_pairs, [TypeCheckObj.isStringList, TypeCheckObj.isStringStringList]);
    // --- Error Check ---
    if (!Array.isArray(key_pairs[0])) { key_pairs = [key_pairs] as [string, string][]; }
    key_pairs = key_pairs as [string, string][];
    for (let i = 0; i < key_pairs.length; i++) {
        if (key_pairs[i].length !== 2) {
            throw new Error('dict.Replace: Key pairs must be of length 2; \
                the following key pair is not valid: "' + key_pairs[i] + '".');
        }
        for (const key of key_pairs[i]) {
            if (typeof key !== 'string') {
                throw new Error('dict.Replace: Keys must be strings; \
                    the following key is not valid:"' + key + '".');
            }
        }
        const old_key: string = key_pairs[i][0];
        const new_key: string = key_pairs[i][1];
        if (old_key in dict) {
            dict[new_key] = dict[old_key];
            delete dict[old_key];
        }
    }
}
// ================================================================================================

