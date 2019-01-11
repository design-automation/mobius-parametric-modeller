import { checkCommTypes } from './_check_args';

/**
 * ================================================================================================
 * list functions that obtain and return information from an input list. Does not modify input list.
 */

export enum _EIndexOfMethod {
    SEARCH_ALL = 'search_all',
    SEARCH_FIRST = 'search_first'
}
/**
 * Searches for a value in an list and returns the index position if found.
 * Items must match both the value and type of specified value.
 *
 * Returns -1 if no values in list match specified value.
 *
 * @param list List.
 * @param value Value to search for.
 * @param method Enum, specifies whether to search all occurances or only the first.
 * @returns Index position or list of index positions containing specified value.
 * @example positions = list.indexOf(list,2,true)
 * @example_info where list = [6,2,2,7]
 * Expected value of positions is [1,2].
 */
export function IndexOf(list: any[], value: any, method: _EIndexOfMethod): number|number[] {
    // --- Error Check ---
    const fn_name = 'list.IndexOf';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'value', value, ['isAny']);
    // --- Error Check ---
    const positions = [];
    for (let i = 0 ; i < list.length; i++) {
        if (list[i] === value) {
            positions.push(i);
            if (method === _EIndexOfMethod.SEARCH_FIRST) {
                return i;
            }
        }
    }
    if (positions.length > 0) {
        return positions;
    } else {
        return -1;
    }
}
/**
 * Searches for a value in an list and returns true if found.
 * Items must match both the value and type of specified value.
 *
 * Returns false if no values in list match specified value.
 *
 * @param list List.
 * @param value Value to search for.
 * @returns Returns true if value can be found in list, false if value cannot be found.
 * @example exists = list.includes(list,2)
 * @example_info where list = [6,2,2,7]
 * Expected value of exists is true.
 */
export function Includes(list: any[], value: any): boolean {
    // --- Error Check ---
    const fn_name = 'list.Includes';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'value', value, ['isAny']);
    // --- Error Check ---
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === value) {
            return true;
        }
    }
    return false;
}
/**
 * ================================================================================================
 * list functions that return a new list. The input list is not modified.
 */
/**
 * Creates a new list by creating a new list by making a copy of an existing list.
 *
 * @param list List to copy.
 * @returns New duplicated list.
 * @example copy = list.byCopy(list)
 * @example_info where list = [1,2,3]
 * Expected value of copy is [1,2,3].
 */
export function Copy(list: any[]): any[] {
    // --- Error Check ---
    checkCommTypes('list.Copy', 'list', list, ['isList']);
    // --- Error Check ---
    return list.slice();
}
/**
 * Creates a new list by combining two lists into a new list.
 *
 * @param list1 First list.
 * @param list2 Second list.
 * @returns Combined list (list1 first, followed by list2).
 * @example newlist = list.concat(list1,list2)
 * @example_info where list1 = [1,2,3]
 * and list2 = [9,0]
 * Expected value of newlist is [1,2,3,9,0].
 */
export function Concat(list1: any[], list2: any[]): any[] {
    // --- Error Check ---
    const fn_name = 'list.Concat';
    checkCommTypes(fn_name, 'list1', list1, ['isList']);
    checkCommTypes(fn_name, 'list2', list2, ['isList']);
    // --- Error Check ---
    return list1.concat(list2);
}
/**
 * Creates a new list by flattening an n-dimensional list into a one-dimensional list.
 *
 * @param list List to flatten.
 * @returns Flattened list.
 * @example flatten = list.flatten(list)
 * @example_info where list = [1,2,3,[4,5]]
 * Expected value of flatten is [1,2,3,4,5].
 */
export function Flatten(list: any[]): any[] {
    // --- Error Check ---
    checkCommTypes('list.Flatten', 'list', list, ['isList']);
    // --- Error Check ---
    return _flattenDeep(list);
}
function _flattenDeep(list: any[]): any[] {
    return list.reduce((acc, val) => Array.isArray(val) ? acc.concat(_flattenDeep(val)) : acc.concat(val), []);
}
/**
 * Creates a new list by copying a portion of an existing list, from start index to end index (end not included).
 *
 * @param list List to slice.
 * @param start Zero-based index at which to begin slicing.
 *      A negative index can be used, indicating an offset from the end of the sequence.
 *      If start is undefined, slice begins from index 0.
 * @param end Zero-based index before which to end slicing. Slice extracts up to but not including end.
 *      A negative index can be used, indicating an offset from the end of the sequence.
 *      If end is undefined, slice extracts through the end of the sequence.
 * @returns A new list.
 * @example result = list.slice(list,1,3)
 * @example_info where list = [1,2,3,4,5]
 * Expected value of result is [2,3].
 */
export function Slice(list: any[], start: number, end: number): any[] {
    // --- Error Check ---
    const fn_name = 'list.Slice';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'start', start, ['isInt']);
    checkCommTypes(fn_name, 'end', end, ['isInt']);
    // --- Error Check ---
    return list.slice(start, end);
}
/**
 * ================================================================================================
 * list functions that modify the original input list. Return void.
 */
export enum _EAppendMethod {
    TO_START = 'to_start',
    TO_END = 'to_end'
}
/**
 * Adds one value to the end of an list
 * If value is an list, the entire list will be appended as one value.
 *
 * @param list List to add to.
 * @param value Item to add.
 * @param method Enum, append to start or end.
 * @example append = list.append(list,4. 'at_end')
 * @example_info where list = [1,2,3]
 * Expected value of list is [1,2,3,4].
 */
export function Append(list: any[], value: any, method: _EAppendMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Append';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'value', value, ['isAny']);
    // --- Error Check ---
    if (method === _EAppendMethod.TO_END) {
        list.push(value);
    } else {
        list.unshift(value);
    }
}
/**
 * Removes the value at the specified index from an list
 *
 * @param list List to remove value from.
 * @param index Zero-based index number of value to remove.
 * @example remove = list.removeIndex(list,1)
 * @example_info where list = [1,2,3]
 * Expected value of remove is [1,3].
 */
export function RemoveIndex(list: any[], index: number): void {
    // --- Error Check ---
    const fn_name = 'list.RemoveIndex';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'index', index, ['isInt']);
    // --- Error Check ---
    list.splice(index, 1);
}
export enum _ERemoveValueMethod {
    REMOVE_ALL = 'remove_all',
    REMOVE_FIRST = 'remove_first'
}
/**
 * Removes values that match specified value from an list
 * Items must match both the value and type of specified value
 *
 * Returns original list if no values in list match specified value.
 *
 * @param list List to remove value from.
 * @param value Value to search for.
 * @param method Enum, specifies whether to remove all occurances or only the first.
 * @example remove = list.removeValue(list,2,'remove_all')
 * @example_info where list = [1,2,2,3]
 * Expected value of remove is [1,3].
 */
export function RemoveValue(list: any[], value: any, method: _ERemoveValueMethod): void {
    // --- Error Check ---
    const fn_name = 'list.RemoveValue';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'value', value, ['isAny']);
    // --- Error Check ---
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === value) {
            list.splice(i, 1);
            if (method === _ERemoveValueMethod.REMOVE_FIRST) {break; }
        }
    }
}
export enum _EReplaceValueMethod {
    REPLACE_ALL = 'replace_all',
    REPLACE_FIRST = 'replace_first'
}
/**
 * Replaces values that match specified value from an list with a new value
 * Items must match both the value and type of specified value
 *
 * Returns original list if no values in list match specified value.
 *
 * @param list List to remove value from.
 * @param value1 Value to search for.
 * @param value2 Value to replace existing value with.
 * @param method Enum, specifies whether to replace all occurances or only the first.
 * @example replace = list.replaceValue(list,2,9,true)
 * @example_info where list = [1,2,2,3]
 * Expected value of replace is [1,9,9,3].
 */
export function ReplaceValue(list: any[], value1: any, value2: any, method: _EReplaceValueMethod): void {
    // --- Error Check ---
    const fn_name = 'list.ReplaceValue';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'value1', value1, ['isAny']);
    checkCommTypes(fn_name, 'value2', value2, ['isAny']);
    // --- Error Check ---
    for (let i = 0 ; i < list.length ; i++) {
        if (list[i] === value1) {
            list[i] = value2;
            if (method === _EReplaceValueMethod.REPLACE_FIRST) {break; }
        }
    }
}
/**
 * Reverses the order of values in an list and returns a new list.
 *
 * @param list List to reverse.
 * @returns New reversed list.
 * @example result = list.reverse(list)
 * @example_info where list = [1,2,3]
 * Expected value of result is [3,2,1].
 */
export function Reverse(list: any[]): void {
    // --- Error Check ---
    checkCommTypes('list.Reverse', 'list', list, ['isList']);
    // --- Error Check ---
    list.reverse();
}
export enum _ESortMethod {
    'ALPHA' = 'alpha_descending',
    'REV_ALPHA' = 'alpha_ascending',
    'NUM' = 'numeric_descending',
    'REV_NUM' = 'numeric_ascending',
    'SHIFT' = 'shift_1',
    'REV_SHIFT' = 'reverse_shift_1',
    'RANDOM' = 'random'
}
/**
 * Sorts an list of values.
 *
 * For alphabetical sort, values are sorted according to string Unicode code points
 * (character by character, numbers before upper case alphabets, upper case alphabets before lower case alphabets)
 *
 * @param list List to sort.
 * @param method Enum, specifies the sort method to use.
 * @example sort = list.sortAlpha(list, 'alpha')
 * @example_info where list = ["1","2","10","Orange","apple"]
 * Expected value of list is ["1","10","2","Orange","apple"].
 * @example sort = list.sortNum(list, 'numeric')
 * @example_info where list = [56,6,48]
 * Expected value of list is [6,48,56].
 */
export function Sort(list: any[], method: _ESortMethod): void {
    // --- Error Check ---
    checkCommTypes('list.Sort', 'list', list, ['isList']);
    // --- Error Check ---
    switch (method) {
        case _ESortMethod.ALPHA:
            list.sort();
            break;
        case _ESortMethod.REV_ALPHA:
            list.sort().reverse();
            break;
        case _ESortMethod.NUM:
            list.sort((a, b) => a - b);
            break;
        case _ESortMethod.REV_NUM:
            list.sort((a, b) => a - b).reverse();
            break;
        case _ESortMethod.SHIFT:
            const first: any = list.shift();
            list.push(first);
            break;
        case _ESortMethod.REV_SHIFT:
            const last: any = list.pop();
            list.unshift(last);
            break;
        case _ESortMethod.RANDOM:
            list.sort(() => .5 - Math.random());
            break;
        default:
            throw new Error('list.Sort: Sort method not recognised.');
            break;
    }
}
/**
 * Adds and/or removes values to/from an list
 *
 * If no values_to_add are specified, then values are only removed.
 * If num_to_remove is 0, then values are only added.
 *
 * @param list List to splice
 * @param index Zero-based index at which to add/remove values. (Items are added/removed after specified index)
 * @param num_to_remove Number of values to remove.
 * @param values_to_add list of values to add.
 * @example result = list.splice(list, 1, 3, [2.2, 3.3])
 * @example_info where list = [10, 20, 30, 40, 50]
 * Expected value of result is [10, 2.2, 3.2, 50].
 */
export function Splice(list: any[], index: number, num_to_remove: number, values_to_add: any[]): void {
    // --- Error Check ---
    const fn_name = 'list.Splice';
    checkCommTypes(fn_name, 'list', list, ['isList']);
    checkCommTypes(fn_name, 'index', index, ['isInt']);
    checkCommTypes(fn_name, 'num_to_remove', num_to_remove, ['isInt']);
    checkCommTypes(fn_name, 'values_to_add', values_to_add, ['isList']);
    // --- Error Check ---

    // const list2 = list.slice();
    // list2.splice(index, num_to_remove, ...values_to_add);
    // return list2;
    list.splice(index, num_to_remove, ...values_to_add);
}
