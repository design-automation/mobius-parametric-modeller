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
 * @param keys_values A key-value pair, or list of key-value pairs.
 * @returns void
 */
export function Add(dict: any[], keys_values: [string, any]|[string, any][]): void {
    // --- Error Check ---
    const fn_name = 'dict.Add';
    checkCommTypes(fn_name, 'key_value', keys_values, [TypeCheckObj.isList]);
    // --- Error Check ---
    if (keys_values.length > 0) {
        if (!Array.isArray(keys_values[0])) { keys_values = [keys_values] as [string, any][]; }
    }
    for (const pair of keys_values) {
        if (pair.length !== 2) {
            throw new Error('dict.Add: Key-value pairs must be of length 2; the following key-value pair is not valid: "' + pair + '".');
        }
        if (typeof pair[0] !== 'string') {
            throw new Error('dict.Add: Keys must be of type string; the following key is not valid: "' + pair[0] + '".');
        }
        dict[pair[0]] = pair[1];
    }
}
// ================================================================================================
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * ~
 * @param dict The list in which to remove items
 * @param key The key or list of keys to remove.
 * @returns void
 */
export function Remove(dict: any[], key: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'dict.Remove';
    checkCommTypes(fn_name, 'key', key, [TypeCheckObj.isString, TypeCheckObj.isStringList]);
    // --- Error Check ---
    if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
            delete dict[key[i]];
        }
    } else {
        delete dict[key];
    }
}
// ================================================================================================

