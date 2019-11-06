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
 * @param key The new key
 * @param value The new value
 * @param method Enum, select the method.
 * @returns void
 */
export function Add(dict: any[], key: string|string[], value: any): void {
    // --- Error Check ---
    const fn_name = 'dict.Add';
    checkCommTypes(fn_name, 'key', key, [TypeCheckObj.isString, TypeCheckObj.isStringList]);
    checkCommTypes(fn_name, 'value', value, [TypeCheckObj.isAny]);
    // --- Error Check ---
    if (Array.isArray(key)) {
        if (!Array.isArray(value) && key.length !== value.length) {
            throw new Error('dict.Add: If a list of keys of keys is provided, then the values must also be a list of teh same length.');
        }
        for (let i = 0; i < key.length; i++) {
            dict[key[i]] = value[i];
        }
    } else {
        dict[key] = value;
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

