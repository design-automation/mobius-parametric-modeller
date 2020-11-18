/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.

 */

/**
 *
 */

import { checkArgs, ArgCh } from '../_check_args';

// ================================================================================================
/**
 * Adds one or more key-value pairs to a dict. Existing keys with the same name will be overwritten.
 * ~
 * @param dict Dictionary to add the key-value pairs to.
 * @param keys A key or list of keys.
 * @param values A value of list of values.
 * @returns void
 */
export function Add(dict: object, keys: string|string[], values: any|any[]): void {
    // --- Error Check ---
    const fn_name = 'dict.Add';
    checkArgs(fn_name, 'keys', keys, [ArgCh.isStr, ArgCh.isStrL]);
    checkArgs(fn_name, 'values', keys, [ArgCh.isAny, ArgCh.isList]);
    keys = Array.isArray(keys) ? keys : [keys];
    values = Array.isArray(values) ? values : [values];
    if (keys.length !== values.length) {
        throw new Error(fn_name + ': The list of keys must be the same length as the list of values.');
    }
    // --- Error Check ---
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];
        dict[key] = dict[value];
    }
}
// ================================================================================================
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * ~
 * @param dict The dict in which to remove keys
 * @param keys The key or list of keys to remove.
 * @returns void
 */
export function Remove(dict: object, keys: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'dict.Remove';
    checkArgs(fn_name, 'key', keys, [ArgCh.isStr, ArgCh.isStrL]);
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
 * @param old_keys The old key or list of keys.
 * @param new_keys The new key or list of keys.
 * @returns void
 */
export function Replace(dict: object, old_keys: string|string[], new_keys: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'dict.Replace';
    checkArgs(fn_name, 'old_keys', old_keys, [ArgCh.isStr, ArgCh.isStrL]);
    checkArgs(fn_name, 'new_keys', new_keys, [ArgCh.isStr, ArgCh.isStrL]);
    old_keys = Array.isArray(old_keys) ? old_keys : [old_keys];
    new_keys = Array.isArray(new_keys) ? new_keys : [new_keys];
    if (old_keys.length !== new_keys.length) {
        throw new Error(fn_name + ': The list of new keys must be the same length as the list of old keys.');
    }
    // --- Error Check ---
    for (let i = 0; i < old_keys.length; i++) {
        const old_key = old_keys[i];
        const new_key = new_keys[i];
        if (old_key in dict) {
            dict[new_key] = dict[old_key];
            delete dict[old_key];
        }
    }
}
// ================================================================================================

