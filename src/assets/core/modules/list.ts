/**
 * The `list` module has functions for working with lists of items.
 * These functions have no direct link with the model, the are generic functions for manipulating lists.
 * The functions are often used when manipulating lists of IDs of entities in the model.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also various inline functions available for working with lists.
 */

/**
 *
 */

import { checkCommTypes, TypeCheckObj } from './_check_args';
import { idsBreak } from '@libs/geo-info/id';
import { TEntTypeIdx } from '@libs/geo-info/common';


// ================================================================================================
export enum _EAddMethod {
    TO_START = 'to_start',
    TO_END = 'to_end',
    EXTEND_START = 'extend_start',
    EXTEND_END = 'extend_end',
    SORTED_ALPHA = 'alpha_descending',
    SORTED_REV_ALPHA = 'alpha_ascending',
    SORTED_NUM = 'numeric_descending',
    SORTED_REV_NUM = 'numeric_ascending',
    SORTED_ID = 'ID_descending',
    SORTED_REV_ID = 'ID_ascending'
}
/**
 * Adds an item to a list.
 *
 * @param list List to add the item to.
 * @param item Item to add.
 * @param method Enum, select the method.
 * @returns void
 * @example append = list.Add([1,2,3], 4, 'at_end')
 * @example_info Expected value of list is [1,2,3,4].
 * @example append = list.Add([1,2,3], [4, 5], 'at_end')
 * @example_info Expected value of list is [1,2,3,[4,5]].
 * @example append = list.Add([1,2,3], [4,5], 'extend_end')
 * @example_info Expected value of list is [1,2,3,4,5].
 * @example append = list.Add(["a", "c", "d"], "b", 'alpha_descending')
 * @example_info Expected value of list is ["a", "b", "c", "d"].
 */
export function Add(list: any[], item: any|any[], method: _EAddMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Add';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'value', item, [TypeCheckObj.isAny]);
    // --- Error Check ---
    let str_value: string;
    switch (method) {
        case _EAddMethod.TO_START:
            list.unshift(item);
            break;
        case _EAddMethod.TO_END:
            list.push(item);
            break;
        case _EAddMethod.EXTEND_START:
            if (!Array.isArray(item)) { item = [item]; }
            for (let i = item.length - 1; i >= 0; i--) {
                list.unshift(item[i]);
            }
            break;
        case _EAddMethod.EXTEND_END:
            if (!Array.isArray(item)) { item = [item]; }
            for (let i = 0; i < item.length; i++) {
                list.push(item[i]);
            }
            break;
        case _EAddMethod.SORTED_ALPHA:
            str_value = item + '';
            for (let i = 0; i < list.length + 1; i++) {
                if (str_value < list[i] + '' || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_REV_ALPHA:
            str_value = item + '';
            for (let i = 0; i < list.length + 1; i++) {
                if (str_value > list[i] + '' || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_NUM:
            for (let i = 0; i < list.length + 1; i++) {
                if (item - list[i] > 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_REV_NUM:
            for (let i = 0; i < list.length + 1; i++) {
                if (item - list[i] < 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_ID:
            for (let i = 0; i < list.length + 1; i++) {
                if (_compareID(item, list[i]) > 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_REV_ID:
            for (let i = 0; i < list.length + 1; i++) {
                if (_compareID(item, list[i]) < 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        default:
            break;
    }
}
// ================================================================================================
export enum _ERemoveMethod {
    REMOVE_INDEX = 'remove_index',
    REMOVE_FIRST_VALUE = 'remove_first_value',
    REMOVE_LAST_VALUE = 'remove_last_value',
    REMOVE_ALL_VALUES = 'remove_all_values'
}
/**
 * Removes items in a list.
 *
 * @param list The list in which to remove items
 * @param item The item to remove, either the index of the item or the value. Negative indexes are allowed.
 * @param method Enum, select the method for removing items from the list.
 * @returns void
 */
export function Remove(list: any[], item: any, method: _ERemoveMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Remove';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'item', item, [TypeCheckObj.isAny]);
    // --- Error Check ---
    let index: number;
    switch (method) {
        case _ERemoveMethod.REMOVE_INDEX:
            index = item;
            if (! isNaN(index) ) {
                if (index < 0) { index = list.length + index; }
                list.splice(index, 1);
            }
            break;
        case _ERemoveMethod.REMOVE_FIRST_VALUE:
            index = list.indexOf(item);
            if (index !== -1) { list.splice(index, 1); }
            break;
        case _ERemoveMethod.REMOVE_LAST_VALUE:
            index = list.lastIndexOf(item);
            if (index !== -1) { list.splice(index, 1); }
            break;
        case _ERemoveMethod.REMOVE_ALL_VALUES:
            for (index = 0; index < list.length; index++) {
                if (list[index] === item) {
                    list.splice(index, 1);
                    index -= 1;
                }
            }
            break;
        default:
            throw new Error('list.Remove: Remove method not recognised.');
    }
}
// ================================================================================================
export enum _EReplaceMethod {
    REPLACE_INDEX = 'index',
    REPLACE_FIRST_VALUE = 'first_value',
    REPLACE_LAST_VALUE = 'last_value',
    REPLACE_ALL_VALUES = 'all_values'
}
/**
 * Replaces items in a list.
 *
 * @param list The list in which to replace items
 * @param item The item to replace, either the index of the item or the value. Negative indexes are allowed.
 * @param new_value The new value.
 * @param method Enum, select the method for replacing items in the list.
 * @returns void
 */
export function Replace(list: any[], item: any, new_value: any, method: _EReplaceMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Replace';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'item', item, [TypeCheckObj.isAny]);
    checkCommTypes(fn_name, 'new_value', new_value, [TypeCheckObj.isAny]);
    // --- Error Check ---
    let index: number;
    switch (method) {
        case _EReplaceMethod.REPLACE_INDEX:
            index = item;
            if (! isNaN(index) ) {
                if (index < 0) { index = list.length + index; }
                list[index] = new_value;
            }
            break;
        case _EReplaceMethod.REPLACE_FIRST_VALUE:
            index = list.indexOf(item);
            if (index !== -1) { list[index] = new_value; }
            break;
        case _EReplaceMethod.REPLACE_LAST_VALUE:
            index = list.lastIndexOf(item);
            if (index !== -1) { list[index] = new_value; }
            break;
        case _EReplaceMethod.REPLACE_ALL_VALUES:
            for (index = 0; index < list.length; index++) {
                if (list[index] === item) {
                    list[index] = new_value;
                }
            }
            break;
        default:
            throw new Error('list.Replace: Replace method not recognised.');
    }
}
// ================================================================================================
export enum _ESortMethod {
    REV = 'reverse',
    ALPHA = 'alpha_descending',
    REV_ALPHA = 'alpha_ascending',
    NUM = 'numeric_descending',
    REV_NUM = 'numeric_ascending',
    ID = 'ID_descending',
    REV_ID = 'ID_ascending',
    SHIFT = 'shift_1',
    REV_SHIFT = 'reverse_shift_1',
    RANDOM = 'random'
}
function _compareID(id1: string, id2: string): number {
    const [ent_type1, index1]: TEntTypeIdx = idsBreak(id1) as TEntTypeIdx;
    const [ent_type2, index2]: TEntTypeIdx = idsBreak(id2) as TEntTypeIdx;
    if (ent_type1 !== ent_type2) { return ent_type1 -  ent_type2; }
    if (index1 !== index2) { return index1 -  index2; }
    return 0;
}
function _sort(list: any[], method: _ESortMethod): void {
    switch (method) {
        case _ESortMethod.REV:
            list.reverse();
            break;
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
        case _ESortMethod.ID:
            list.sort(_compareID);
            break;
        case _ESortMethod.REV_ID:
            list.sort(_compareID).reverse();
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
    }
}
/**
 * Sorts an list, based on the values of the items in the list.
 * ~
 * For alphabetical sort, values are sorted character by character,
 * numbers before upper case alphabets, upper case alphabets before lower case alphabets.
 *
 * @param list List to sort.
 * @param method Enum; specifies the sort method to use.
 * @returns void
 * @example list.Sort(list, 'alpha')
 * @example_info where list = ["1","2","10","Orange","apple"]
 * Expected value of list is ["1","10","2","Orange","apple"].
 * @example list.Sort(list, 'numeric')
 * @example_info where list = [56,6,48]
 * Expected value of list is [6,48,56].
 */
export function Sort(list: any[], method: _ESortMethod): void {
    // --- Error Check ---
    checkCommTypes('list.Sort', 'list', list, [TypeCheckObj.isList]);
    // --- Error Check ---
    _sort(list, method);
}
// ================================================================================================
/**
 * Removes and inserts items in a list.
 * ~
 * If no items_to_add are specified, then items are only removed.
 * If num_to_remove is 0, then values are only inserted.
 *
 * @param list List to splice.
 * @param index Zero-based index after which to starting removing or inserting items.
 * @param num_to_remove Number of items to remove.
 * @param items_to_insert List of items to add, or null.
 * @returns void
 * @example result = list.Splice(list1, 1, 3, [2.2, 3.3])
 * @example_info where list1 = [10, 20, 30, 40, 50]
 * Expected value of result is [10, 2.2, 3.3, 50]. New items were added where the items were removed.
 */
export function Splice(list: any[], index: number, num_to_remove: number, items_to_insert: any[]): void {
    // --- Error Check ---
    const fn_name = 'list.Splice';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'index', index, [TypeCheckObj.isInt]);
    checkCommTypes(fn_name, 'num_to_remove', num_to_remove, [TypeCheckObj.isInt]);
    checkCommTypes(fn_name, 'values_to_add', items_to_insert, [TypeCheckObj.isList]);
    // --- Error Check ---

    // avoid the spread operator
    list.splice(index, num_to_remove);
    if (items_to_insert !== null && items_to_insert.length) {
        for (let i = 0; i < items_to_insert.length; i++) {
            list.splice(index + i, 0, items_to_insert[i]);
        }
    }
}





























// ================================================================================================
// ================================================================================================
// ================================================================================================
// DEPRECATED
// ================================================================================================
// ================================================================================================
// ================================================================================================
/**
 * ================================================================================================
 * list functions that obtain and return information from an input list. Does not modify input list.
 */
export enum _EAppendMethod {
    TO_START = 'to_start',
    TO_END = 'to_end'
}
/**
 * Adds an item to a list.
 * If item is a list, the entire list will be appended as a single item.
 *
 * @param list List to append the item to.
 * @param value Item to append.
 * @param method Enum, select the method.
 * @returns void
 * @example append = list.Append(list, 4, 'at_end')
 * @example_info where list = [1,2,3]
 * Expected value of list is [1,2,3,4].
 */
export function _Append(list: any[], value: any, method: _EAppendMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Append';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'value', value, [TypeCheckObj.isAny]);
    // --- Error Check ---
    switch (method) {
        case _EAppendMethod.TO_START:
            list.unshift(value);
            break;
        case _EAppendMethod.TO_END:
            list.push(value);
            break;
        default:
            break;
    }
}
// ================================================================================================
/**
 * Removes the value at the specified index from a list.
 * ~
 * WARNING: This function has been deprecated. Please use the list.Modify() function.
 *
 * @param list List to remove value from.
 * @param index Zero-based index number of value to remove.
 * @example remove = list.RemoveIndex(list,1)
 * @example_info where list = [1,2,3]
 * Expected value of remove is [1,3].
 */
export function _RemoveIndex(list: any[], index: number): void {
    // --- Error Check ---
    const fn_name = 'list.RemoveIndex';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'index', index, [TypeCheckObj.isInt]);
    // --- Error Check ---
    list.splice(index, 1);
}
// ================================================================================================
export enum _ERemoveValueMethod {
    REMOVE_ALL = 'remove_all',
    REMOVE_FIRST = 'remove_first'
}
/**
 * Removes values that matches specified value from a list.
 * Items must match both the value and type of specified value.
 * ~
 * Returns original list if no values in list match specified value.
 * ~
 * WARNING: This function has been deprecated. Please use the list.Modify() function.
 *
 * @param list List to remove value from.
 * @param value Value to search for.
 * @param method Enum; specifies whether to remove all occurances or only the first.
 * @example remove = list.RemoveValue(list,2,'remove_all')
 * @example_info where list = [1,2,2,3]
 * Expected value of remove is [1,3].
 */
export function _RemoveValue(list: any[], value: any, method: _ERemoveValueMethod): void {
    // --- Error Check ---
    const fn_name = 'list.RemoveValue';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'value', value, [TypeCheckObj.isAny]);
    // --- Error Check ---
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === value) {
            list.splice(i, 1);
            if (method === _ERemoveValueMethod.REMOVE_FIRST) {break; }
        }
    }
}
// ================================================================================================
export enum _EReplaceValueMethod {
    REPLACE_ALL = 'replace_all',
    REPLACE_FIRST = 'replace_first'
}
/**
 * Replaces values that matches specified value from an list with a new value
 * Items must match both the value and type of specified value
 * ~
 * Returns original list if no value in list matches specified value.
 * ~
 * WARNING: This function has been deprecated. Please use the list.Modify() function.
 *
 * @param list List to remove value from.
 * @param value1 Value to search for.
 * @param value2 Value to replace existing value with.
 * @param method Enum; specifies whether to replace all occurances or only the first.
 * @example replace = list.ReplaceValue(list,2,9,'replace_all')
 * @example_info where list = [1,2,2,3]
 * Expected value of replace is [1,9,9,3].
 */
export function _ReplaceValue(list: any[], value1: any, value2: any, method: _EReplaceValueMethod): void {
    // --- Error Check ---
    const fn_name = 'list.ReplaceValue';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'value1', value1, [TypeCheckObj.isAny]);
    checkCommTypes(fn_name, 'value2', value2, [TypeCheckObj.isAny]);
    // --- Error Check ---
    for (let i = 0 ; i < list.length ; i++) {
        if (list[i] === value1) {
            list[i] = value2;
            if (method === _EReplaceValueMethod.REPLACE_FIRST) {break; }
        }
    }
}


export enum _EIndexOfMethod {
    SEARCH_ALL = 'search_all',
    SEARCH_FIRST = 'search_first'
}
/**
 * Searches for a value in a list and returns the index position if found.
 * Items must match both the value and type of specified value.
 * ~
 * Returns -1 if no values in list match specified value.
 * ~
 * WARNING: This function has been deprecated. Please use the inline listFind() function.
 *
 * @param list List.
 * @param value Value to search for.
 * @param method Enum, specifies whether to search all occurances or only the first.
 * @returns Index position or list of index positions containing specified value.
 * @example positions = list.IndexOf(list,2,true)
 * @example_info where list = [6,2,2,7]
 * Expected value of positions is [1,2].
 */
export function _IndexOf(list: any[], value: any, method: _EIndexOfMethod): number|number[] {
    // --- Error Check ---
    const fn_name = 'list.IndexOf';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'value', value, [TypeCheckObj.isAny]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the inline listFind() function.');
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
// ================================================================================================
/**
 * Searches for a value in an list and returns true if found.
 * Items must match both the value and type of specified value.
 * ~
 * Returns false if no values in list match specified value.
 * ~
 * WARNING: This function has been deprecated. Please use the inline listHas() function.
 *
 * @param list List.
 * @param value Value to search for.
 * @returns Returns true if value can be found in list, false if value cannot be found.
 * @example exists = list.Includes(list,2)
 * @example_info where list = [6,2,2,7]
 * Expected value of exists is true.
 */
export function _Includes(list: any[], value: any): boolean {
    // --- Error Check ---
    const fn_name = 'list.Includes';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'value', value, [TypeCheckObj.isAny]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the inline listHas() function.');
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === value) {
            return true;
        }
    }
    return false;
}
// ================================================================================================
/**
 * Creates a new list by creating a new list by making a copy of an existing list.
 * ~
 * WARNING: This function has been deprecated. Please use the inline listCopy() function.
 *
 * @param entities List to copy.
 * @returns New duplicated list.
 * @example copy1 = list.Copy(list)
 * @example_info where list = [1,2,3]
 * Expected value of copy is [1,2,3].
 */
export function _Copy(entities: any[]): any[] {
    // --- Error Check ---
    checkCommTypes('list.Copy', 'list', entities, [TypeCheckObj.isList]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the inline listCopy() function.');
    return entities.slice();
}
// ================================================================================================
/**
 * Creates a new list by combining two lists into a new list.
 * ~
 * WARNING: This function has been deprecated. Please use the inline listJoin() function.
 *
 * @param list1 First list.
 * @param list2 Second list.
 * @returns Combined list (list1 first, followed by list2).
 * @example newlist = list.Concat(list1,list2)
 * @example_info where list1 = [1,2,3]
 * and list2 = [9,0]
 * Expected value of newlist is [1,2,3,9,0].
 */
export function _Concat(list1: any[], list2: any[]): any[] {
    // --- Error Check ---
    const fn_name = 'list.Concat';
    checkCommTypes(fn_name, 'list1', list1, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'list2', list2, [TypeCheckObj.isList]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the inline listJoin() function.');
    return list1.concat(list2);
}
// ================================================================================================
/**
 * Creates a new list by flattening an n-dimensional list into a one-dimensional list.
 * ~
 * WARNING: This function has been deprecated. Please use the inline listFlat() function.
 *
 * @param list List to flatten.
 * @returns Flattened list.
 * @example flatten = list.Flatten(list)
 * @example_info where list = [1,2,3,[4,5]]
 * Expected value of flatten is [1,2,3,4,5].
 */
export function _Flatten(list: any[]): any[] {
    // --- Error Check ---
    checkCommTypes('list.Flatten', 'list', list, [TypeCheckObj.isList]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the inline listFlat() function.');
    return _flattenDeep(list);
}
function _flattenDeep(list: any[]): any[] {
    return list.reduce((acc, val) => Array.isArray(val) ? acc.concat(_flattenDeep(val)) : acc.concat(val), []);
}
// ================================================================================================
/**
 * Creates a new list by copying a portion of an existing list, from start index to end index (end not included).
 * ~
 * WARNING: This function has been deprecated. Please use the inline listSlice() function.
 *
 * @param list List to slice.
 * @param start Zero-based index at which to begin slicing.
 *      A negative index can be used, indicating an offset from the end of the sequence.
 *      If start is undefined, slice begins from index 0.
 * @param end Zero-based index before which to end slicing. Slice extracts up to but not including end.
 *      A negative index can be used, indicating an offset from the end of the sequence.
 *      If end is undefined, slice extracts through the end of the sequence.
 * @returns A new list.
 * @example result = list.Slice(list,1,3)
 * @example_info where list = [1,2,3,4,5]
 * Expected value of result is [2,3].
 */
export function _Slice(list: any[], start: number, end: number): any[] {
    // --- Error Check ---
    const fn_name = 'list.Slice';
    checkCommTypes(fn_name, 'list', list, [TypeCheckObj.isList]);
    checkCommTypes(fn_name, 'start', start, [TypeCheckObj.isInt]);
    checkCommTypes(fn_name, 'end', end, [TypeCheckObj.isInt]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the inline listSlice() function.');
    return list.slice(start, end);
}
// ================================================================================================
/**
 * Reverses the order of values in a list and returns a new list.
 * ~
 * WARNING: This function has been deprecated. Please use the list.Sort() function.
 *
 * @param entities List to reverse.
 * @returns New reversed list.
 * @example result = list.Reverse(list1)
 * @example_info where list1 = [1,2,3]
 * Expected value of result is [3,2,1].
 */
export function _Reverse(entities: any[]): void {
    // --- Error Check ---
    checkCommTypes('list.Reverse', 'entities', entities, [TypeCheckObj.isList]);
    // --- Error Check ---
    console.log('WARNING: This function has been deprecated. Please use the list.Sort() function.');
    entities.reverse();
}
// ================================================================================================
