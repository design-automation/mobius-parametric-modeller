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
import { checkArgs, ArgCh } from '../_check_args';

import { idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { TEntTypeIdx } from '@libs/geo-info/common';
import { getArrDepth } from '@assets/libs/util/arrs';


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
    checkArgs(fn_name, 'list', list, [ArgCh.isList]);
    checkArgs(fn_name, 'value', item, [ArgCh.isAny]);
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
    REMOVE_INDEX = 'index',
    REMOVE_FIRST_VALUE = 'first_value',
    REMOVE_LAST_VALUE = 'last_value',
    REMOVE_ALL_VALUES = 'all_values'
}
/**
 * Removes items in a list.
 * \n
 * If @param method is set to 'index', then @param item should be the index of the item to be replaced.
 * Negative indexes are allowed.
 * If @param method is not set to 'index', then @param item should be the value.
 *
 * @param list The list in which to remove items
 * @param item The item to remove, either the index of the item or the value. Negative indexes are allowed.
 * @param method Enum, select the method for removing items from the list.
 * @returns void
 */
export function Remove(list: any[], item: any, method: _ERemoveMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Remove';
    checkArgs(fn_name, 'list', list, [ArgCh.isList]);
    checkArgs(fn_name, 'item', item, [ArgCh.isAny]);
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
 * \n
 * If @param method is set to 'index', then @param old_item should be the index of the item to be replaced. Negative indexes are allowed.
 * If @param method is not set to 'index', then @param old_item should be the value.
 *
 * @param list The list in which to replace items
 * @param old_item The old item to replace.
 * @param new_item The new item.
 * @param method Enum, select the method for replacing items in the list.
 * @returns void
 */
export function Replace(list: any[], old_item: any, new_item: any, method: _EReplaceMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Replace';
    checkArgs(fn_name, 'list', list, [ArgCh.isList]);
    checkArgs(fn_name, 'item', old_item, [ArgCh.isAny]);
    checkArgs(fn_name, 'new_value', new_item, [ArgCh.isAny]);
    // --- Error Check ---
    let index: number;
    switch (method) {
        case _EReplaceMethod.REPLACE_INDEX:
            index = old_item;
            if (! isNaN(index) ) {
                if (index < 0) { index = list.length + index; }
                list[index] = new_item;
            }
            break;
        case _EReplaceMethod.REPLACE_FIRST_VALUE:
            index = list.indexOf(old_item);
            if (index !== -1) { list[index] = new_item; }
            break;
        case _EReplaceMethod.REPLACE_LAST_VALUE:
            index = list.lastIndexOf(old_item);
            if (index !== -1) { list[index] = new_item; }
            break;
        case _EReplaceMethod.REPLACE_ALL_VALUES:
            for (index = 0; index < list.length; index++) {
                if (list[index] === old_item) {
                    list[index] = new_item;
                }
            }
            break;
        default:
            throw new Error('list.Replace: Replace method not recognised.');
    }
}
// ================================================================================================
/**
 * Sorts an list, based on the values of the items in the list.
 * \n
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
    checkArgs('list.Sort', 'list', list, [ArgCh.isList]);
    // --- Error Check ---
    _sort(list, method);
}
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
function _compareNumList(l1: any[], l2: any[], depth: number): number {
    if (depth === 1) { return l1[0] - l2[0] as number; }
    if (depth === 2) { return l1[0][0] - l2[0][0] as number; }
    let val1 = l1;
    let val2 = l2;
    for (let i = 0; i < depth; i++) {
        val1 = val1[0];
        val2 = val2[0];
    }
    return (val1 as unknown as number) - (val2 as unknown as number);
}
function _sort(list: any[], method: _ESortMethod): void {
    switch (method) {
        case _ESortMethod.REV:
            list.reverse();
            break;
        case _ESortMethod.ALPHA:
            list.sort().reverse();
            break;
        case _ESortMethod.REV_ALPHA:
            list.sort();
            break;
        case _ESortMethod.NUM:
            if (Array.isArray(list[0])) {
                const depth: number = getArrDepth(list[0]);
                list.sort((a, b) => _compareNumList(a, b, depth)).reverse();
            } else {
                list.sort((a, b) => b - a);
            }
            break;
        case _ESortMethod.REV_NUM:
            if (Array.isArray(list[0])) {
                const depth: number = getArrDepth(list[0]);
                list.sort((a, b) => _compareNumList(a, b, depth));
            } else {
                list.sort((a, b) => a - b);
            }
            break;
        case _ESortMethod.ID:
            list.sort(_compareID).reverse();
            break;
        case _ESortMethod.REV_ID:
            list.sort(_compareID);
            break;
        case _ESortMethod.SHIFT:
            const last: any = list.pop();
            list.unshift(last);
            break;
        case _ESortMethod.REV_SHIFT:
            const first: any = list.shift();
            list.push(first);
            break;
        case _ESortMethod.RANDOM:
            list.sort(() => .5 - Math.random());
            break;
        default:
            throw new Error('list.Sort: Sort method not recognised.');
    }
}
// ================================================================================================
/**
 * Removes and inserts items in a list.
 * \n
 * If no items_to_add are specified, then items are only removed.
 * If num_to_remove is 0, then values are only inserted.
 *
 * @param list List to splice.
 * @param index Zero-based index after which to starting removing or inserting items.
 * @param num_to_remove Number of items to remove.
 * @param items_to_insert Optional, list of items to add, or null.
 * @returns void
 * @example result = list.Splice(list1, 1, 3, [2.2, 3.3])
 * @example_info where list1 = [10, 20, 30, 40, 50]
 * Expected value of result is [10, 2.2, 3.3, 50]. New items were added where the items were removed.
 */
export function Splice(list: any[], index: number, num_to_remove: number, items_to_insert: any[]): void {
    // --- Error Check ---
    const fn_name = 'list.Splice';
    checkArgs(fn_name, 'list', list, [ArgCh.isList]);
    checkArgs(fn_name, 'index', index, [ArgCh.isInt]);
    checkArgs(fn_name, 'num_to_remove', num_to_remove, [ArgCh.isInt]);
    checkArgs(fn_name, 'values_to_add', items_to_insert, [ArgCh.isList]);
    // --- Error Check ---

    // avoid the spread operator
    list.splice(index, num_to_remove);
    if (items_to_insert !== null && items_to_insert.length) {
        for (let i = 0; i < items_to_insert.length; i++) {
            list.splice(index + i, 0, items_to_insert[i]);
        }
    }
}


