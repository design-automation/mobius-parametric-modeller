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
 * Returns -1 if no items in list match specified value.
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
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (value === undefined) { throw new Error('Invalid arg: value must be defined.'); }
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
 * Returns false if no items in list match specified value.
 *
 * @param list List.
 * @param value Value to search for.
 * @returns Returns true if value can be found in list, false if value cannot be found.
 * @example exists = list.includes(list,2)
 * @example_info where list = [6,2,2,7]
 * Expected value of exists is true.
 */
export function Includes(list: any[], value: any): boolean {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (value === undefined) { throw new Error('Invalid arg: value must be defined.'); }
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
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
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
    if (list1 === undefined) { throw new Error('Invalid arg: list1 must be defined.'); }
    if (list2 === undefined) { throw new Error('Invalid arg: list2 must be defined.'); }
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
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
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
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (start === undefined) { throw new Error('Invalid arg: start must be defined.'); }
    if (end === undefined) { throw new Error('Invalid arg: end must be defined.'); }
    return list.slice(start, end);
}
/**
 * ================================================================================================
 * list functions that modify the original input list. Return void.
 */
/**
 * Adds one item to the end of an list
 * If item is an list, the entire list will be appended as one item.
 *
 * @param list List to add to.
 * @param item Item to add.
 * @example append = list.append(list,4)
 * @example_info where list = [1,2,3]
 * Expected value of list is [1,2,3,4].
 */
export function Append(list: any[], item: any): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (item === undefined) { throw new Error('Invalid arg: item must be defined.'); }
    list.push(item);
}
/**
 * Adds one item to the front of an list
 * If the item is an list, the entire list will be appended as one item.
 *
 * @param list List to add to.
 * @param item Item to add.
 * @example append = list.appendFront(list,4)
 * @example_info where list = [1,2,3]
 * Expected value of list is [4,1,2,3].
 */
export function Prepend(list: any[], item: any): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (item === undefined) { throw new Error('Invalid arg: item must be defined.'); }
    list.unshift(item);
}
/**
 * Removes the item at the specified index from an list
 *
 * @param list List to remove item from.
 * @param index Zero-based index number of item to remove.
 * @example remove = list.removeIndex(list,1)
 * @example_info where list = [1,2,3]
 * Expected value of remove is [1,3].
 */
export function RemoveIndex(list: any[], index: number): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (index === undefined) { throw new Error('Invalid arg: index must be defined.'); }
    list.splice(index, 1);
}
export enum _ERemoveValueMethod {
    REMOVE_ALL = 'remove_all',
    REMOVE_FIRST = 'remove_first'
}
/**
 * Removes items that match specified value from an list
 * Items must match both the value and type of specified value
 *
 * Returns original list if no items in list match specified value.
 *
 * @param list List to remove item from.
 * @param value Value to search for.
 * @param method Enum, specifies whether to remove all occurances or only the first.
 * @example remove = list.removeValue(list,2,'remove_all')
 * @example_info where list = [1,2,2,3]
 * Expected value of remove is [1,3].
 */
export function RemoveValue(list: any[], value: any, method: _ERemoveValueMethod): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (value === undefined) { throw new Error('Invalid arg: value must be defined.'); }
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === value) {
            list.splice(i, 1);
            if (method === _ERemoveValueMethod.REMOVE_FIRST) {break; }
        }
    }
}
export enum _EReplaceValueMethod {
    REMOVE_ALL = 'replace_all',
    REMOVE_FIRST = 'replace_first'
}
/**
 * Replaces items that match specified value from an list with a new value
 * Items must match both the value and type of specified value
 *
 * Returns original list if no items in list match specified value.
 *
 * @param list List to remove item from.
 * @param value Value to search for.
 * @param value2 Value to replace existing value with.
 * @param method Enum, specifies whether to replace all occurances or only the first.
 * @example replace = list.replaceValue(list,2,9,true)
 * @example_info where list = [1,2,2,3]
 * Expected value of replace is [1,9,9,3].
 */
export function ReplaceValue(list: any[], value1: any, value2: any, method: _EReplaceValueMethod): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (value1 === undefined) { throw new Error('Invalid arg: value1 must be defined.'); }
    if (value2 === undefined) { throw new Error('Invalid arg: value2 must be defined.'); }
    for (let i = 0 ; i < list.length ; i++) {
        if (list[i] === value1) {
            list[i] = value2;
            if (method === _EReplaceValueMethod.REMOVE_FIRST) {break; }
        }
    }
}
/**
 * Reverses the order of items in an list and returns a new list.
 *
 * @param list List to reverse.
 * @returns New reversed list.
 * @example result = list.reverse(list)
 * @example_info where list = [1,2,3]
 * Expected value of result is [3,2,1].
 */
export function Reverse(list: any[]): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    list.reverse();
}
/**
 * Sorts an list of strings alphabetically
 * If items are not strings, they are treated as strings.
 *
 * Items are sorted according to string Unicode code points (character by character, numbers before upper case
 * alphabets, upper case alphabets before lower case alphabets)
 *
 * @param list List to sort.
 * @example sort = list.sortAlpha(list)
 * @example_info where list = ["1","2","10","Orange","apple"]
 * Expected value of list is ["1","10","2","Orange","apple"].
 */
export function SortAlpha(list: any[]): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    list.sort();
}
/**
 * Sorts an list of numbers in ascending order
 * The list must contain numbers.
 *
 * @param list List to add to.
 * @example sort = list.sortNum(list)
 * @example_info where list = [56,6,48]
 * Expected value of list is [6,48,56].
 */
export function SortNum(list: any[]): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    list.sort((a, b) => a - b);
}
/**
 * Adds and/or removes items to/from an list
 *
 * If no items_to_add are specified, then items are only removed.
 * If num_to_remove is 0, then items are only added.
 *
 * @param list List to splice
 * @param index Zero-based index at which to add/remove items. (Items are added/removed after specified index)
 * @param num_to_remove Number of items to remove.
 * @param items_to_add list of items to add.
 * @example result = list.splice(list, 1, 3, [2.2, 3.3])
 * @example_info where list = [10, 20, 30, 40, 50]
 * Expected value of result is [10, 2.2, 3.2, 50].
 */
export function Splice(list: any[], index: number, num_to_remove: number, items_to_add: any[]): void {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    if (index === undefined) { throw new Error('Invalid arg: index must be defined.'); }
    // const list2 = list.slice();
    // list2.splice(index, num_to_remove, ...items_to_add);
    // return list2;
    list.splice(index, num_to_remove, ...items_to_add);
}
