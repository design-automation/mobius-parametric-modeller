/**
 * Functions for working with dictionaries. The functions do not modify input dictionaries.
 */

/**
 * Returns the item in the dictionary specified by key.
 * If the key does nto exist, undefined is returned.
 * @param dict
 * @param key
 */
export function dictGet(debug: boolean, dict: object, key: string|string[]): any|any[] {
    if (Array.isArray(key)) { return key.map( a_key => dict[a_key]) as any[]; }
    return dict[key] as any;
}
/**
 * Returns an array of all the keys in a dictionary.
 * @param dict
 */
export function dictKeys(debug: boolean, dict: object): string[] {
    return Object.keys(dict);
}
/**
 * Returns an array of all the values in a dictionary.
 * @param dict
 */
export function dictVals(debug: boolean, dict: object): string[] {
    return Object.values(dict);
}
/**
 * Returns true if the dictionary contains the given key, false otherwsie.
 * @param dict
 */
export function dictHasKey(debug: boolean, dict: object, key:string|string[]): boolean|boolean[] {
    if (Array.isArray(key)) { return key.map( a_key => dict.hasOwnProperty(a_key)) as boolean[]; }
    return dict.hasOwnProperty(key);
}
/**
 * Returns true if the dictionary contains the given value, false otherwsie.
 * @param dict
 * @param val
 */
export function dictHasVal(debug: boolean, dict: object, val: any|any[]): boolean|boolean[] {
    if (Array.isArray(val)) { return val.map( a_val => dictHasVal(false, dict, a_val)) as boolean[]; }
    return Object.values(dict).indexOf(val) !== -1;
}
/**
 * Returns the first key in the dictionary that has the given value.
 * If the value does not exist, returns undefined.
 * @param dict
 * @param val
 */
export function dictGetKey(debug: boolean, dict: object, val: any|any[]): string|string[] {
    if (Array.isArray(val)) { return val.map( a_val => dictGetKey(false, dict, a_val)) as string[]; }
    for (const key of Object.keys(dict)) {
        if (dict[key] === val) { return key; }
    }
    return undefined;
}
/**
 * Returns a shallow copy of the dict.
 * @param dict
 */
export function dictCopy(debug: boolean, dict: object): object {
    return {...dict};
}








