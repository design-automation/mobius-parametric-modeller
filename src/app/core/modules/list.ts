/**
 * The <i>List</i> module provides a set of functions for working with lists.
 * Lists are containers that can hold other values. The values inside the list are called <i>items</i>.<br/>
 *
 * The items in a list can be of any data type.
 * The items can also be other lists, thereby allowing more complex nested data strictures to be created.
 * Items are ordered and will be returned in the same order or accessed by the same index unless
 * changes are made to alter it.<br/>
 *
 * When instantiating a list, use square brackets as follows: <code>[10,20,30]</code>.<br/>
 *
 * To refer to an item in a list, use index notation as follows: <code>list_name[index_num]</code>.
 */

import * as gs from "gs-json";
import {Arr} from "./libs/arr/arr";

//  ===============================================================================================================
//  List Constructors =============================================================================================
//  ===============================================================================================================

/**
 * Creates a new list by making a copy of an existing list.
 *
 * @param list List to copy.
 * @returns New duplicated list.
 *
 * <h3>Example:</h3>
 * <code>
 * list = [1,2,3]<br/>
 * copy = List.Copy(list)</code><br/><br/>
 * Expected value of copy is [1,2,3].
 */
export function Copy(list: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    return list.slice();
}

/**
 * Creates a new list of integer numbers between two bounds.
 * Lower bound is inclusive and upper bound is exclusive.
 *
 * @param min Lower bound integer.
 * @param max Upper bound integer.
 * @returns New list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = List.FromRange(0,5)</code><br/><br/>
 * Expected value of list is [0,1,2,3,4].
 */
export function FromRange(min: number, max: number): number[] {
    if (min === undefined) {throw new Error("Invalid arg: min must be defined.");}
    if (max === undefined) {throw new Error("Invalid arg: max must be defined.");}
    return Arr.makeSeq(max - min).map((v) => v + min);
}

//  ===============================================================================================================
//  List Functions ================================================================================================
//  ===============================================================================================================

/**
 * Returns the number of items in an list.
 *
 * @param list List.
 * @returns Length of the list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * len = List.len(list)</code><br/><br/>
 * Expected value of len is 3.
 */
export function len(list: any[]): number {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    return list.length;
}

/**
 * Adds an item to the end of a list.
 * If item is a list, the entire list will be appended as one item.
 *
 * @param list List to add to.
 * @param item Item to add.
 * @returns New list with added item.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * append = List.append(list,4)</code><br/><br/>
 * Expected value of list is [1,2,3,4].
 */
export function append(list: any[], item: any): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (item === undefined) {throw new Error("Invalid arg: item must be defined.");}
    const list2 = list.slice();
    list2.push(item);
    return list2;
}

/**
 * Adds an item to the front of a list.
 * If the item is a list, the entire list will be appended as one item.
 *
 * @param list List to add to.
 * @param item Item to add.
 * @returns New list with added item.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * append = List.appendFront(list,4)</code><br/><br/>
 * Expected value of list is [4,1,2,3].
 */
export function appendFront(list: any[], item: any): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (item === undefined) {throw new Error("Invalid arg: item must be defined.");}
    const list2 = list.slice();
    list2.unshift(item);
    return list2;
}

/**
 * Adds items (from a list) to the end of an list.
 * Items are added to list individually as seperate items.
 *
 * @param list List to add to.
 * @param items List of items to add.
 * @returns List with added items.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * list2 = [9,0]<br/>
 * extend = List.extend(list,list2)</code><br/><br/>
 * Expected value of extend is [1,2,3,9,0].
 */
export function extend(list: any[], items: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (items === undefined) {throw new Error("Invalid arg: items must be defined.");}
    return list.concat(items);
}

/**
 * Adds items (from a list) to the front of an list.
 * Items are added to list individually as seperate items.
 *
 * @param list List to add to.
 * @param items List of items to add.
 * @returns List with added items.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * list2 = [9,0]<br/>
 * extend = List.extend(list,list2)</code><br/><br/>
 * Expected value of extend is [9,0,1,2,3].
 */
export function extendFront(list: any[], items: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (items === undefined) {throw new Error("Invalid arg: items must be defined.");}
    return items.concat(list);
}

/**
 * Flattens an n-dimensional list into a one-dimensional list.
 *
 * @param list List to flatten.
 * @returns Flattened list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3,[4,5]]<br/>
 * flatten = List.flatten(list)</code><br/><br/>
 * Expected value of list is [1,2,3,4,5].
 */
export function flatten(list: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    return Arr.flatten(list);
}

/**
 * Removes the item at the specified index from a list.
 *
 * @param list List to remove item from.
 * @param index Zero-based index number of item to remove.
 * @returns List with item removed.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * remove = List.removeIndex(list,1)</code><br/><br/>
 * Expected value of list is [1,3].
 */
export function removeIndex(list: any[], index: number): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (index === undefined) {throw new Error("Invalid arg: index must be defined.");}
    const list2 = list.slice();
    list2.splice(index,1);
    return list2;
}

/**
 * Removes items that match specified value from a list.
 * Items must match both the value and type of specified value<br/>
 *
 * Returns original list if no items in list match specified value.
 *
 * @param list List to remove item from.
 * @param value Value to search for.
 * @param remove_all Removes all instances of specified value if true, removes only the first instance if
 *      false.
 * @returns List with item removed
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,2,3]<br/>
 * remove = List.removeValue(list,2,true)</code><br/><br/>
 * Expected value of list is [1,3].
 */
export function removeValue(list: any[], value: any, remove_all: boolean = true): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (value === undefined) {throw new Error("Invalid arg: value must be defined.");}
    const list2 = list.slice();
    for (let i = list2.length - 1; i >= 0; i--) {
        if (list2[i] === value) {
            list2.splice(i,1);
            if (remove_all === false) {break;}
        }
    }
    return list2;
}

/**
 * Reverses the order of items in an list.
 *
 * @param list List to reverse.
 * @returns New reversed list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3]<br/>
 * result = List.reverse(list)</code><br/><br/>
 * Expected value of result is [3,2,1].
 */
export function reverse(list: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    const list2 = list.slice();
    list2.reverse();
    return list2;
}

/**
 * Sorts a list of strings alphabetically.
 * If items are not strings, they are treated as strings.<br/>
 *
 * Items are sorted according to string Unicode code points (character by character, numbers before upper case
 * alphabets, upper case alphabets before lower case alphabets)
 *
 * @param list List to sort.
 * @returns New sorted list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = ["1","2","10","Orange","apple"]<br/>
 * sort = List.sortAlpha(list)</code><br/><br/>
 * Expected value of list is ["1","10","2","Orange","apple"].
 */
export function sortAlpha(list: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    const list2 = list.slice();
    list2.sort();
    return list2;
}

/**
 * Sorts a list of numbers in ascending order.
 * The list must contain numbers.
 *
 * @param list List to add to.
 * @returns New sorted list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [56,6,48]<br/>
 * sort = List.sortNum(list)</code><br/><br/>
 * Expected value of list is [6,48,56].
 */
export function sortNum(list: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    const list2 = list.slice();
    list2.sort((a, b) => a - b);
    return list2;
}

/**
 * Creates a copy of a portion of a list, from start index to end index (end not included).
 *
 * @param list List to slice.
 * @param start Zero-based index at which to begin slicing.
 *      A negative index can be used, indicating an offset from the end of the sequence.
 *      If start is undefined, slice begins from index 0.
 * @param end Zero-based index before which to end slicing. Slice extracts up to but not including end.
 *      A negative index can be used, indicating an offset from the end of the sequence.
 *      If end is undefined, slice extracts through the end of the sequence.
 * @returns A new list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [1,2,3,4,5]<br/>
 * result = List.slice(list,1,3)</code><br/><br/>
 * Expected value of result is [2,3].
 */
export function slice(list: any[], start: number, end: number): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (start === undefined) {throw new Error("Invalid arg: start must be defined.");}
    if (end === undefined) {throw new Error("Invalid arg: end must be defined.");}
    const list2 = list.slice();
    return list2.slice(start,end);
}

/**
 * Adds and/or removes items to/from a list.
 *
 * If no items_to_add are specified, then items are only removed.
 * If num_to_remove is 0, then items are only added.<br/>
 *
 * @param list List to splice
 * @param index Zero-based index at which to add/remove items. (Items are added/removed after specified index)
 * @param num_to_remove Number of items to remove.
 * @param items_to_add List of items to add.
 * @returns A new list.
 *
 * <h3>Example: </h3>
 * <code>
 * list = [10, 20, 30, 40, 50]<br/>
 * result = List.splice(list, 1, 3, [2.2, 3.3])</code><br/><br/>
 * Expected value of result is [10, 2.2, 3.2, 50].
 */
export function splice(list: any[], index: number, num_to_remove: number, items_to_add: any[]): any[] {
    if (list === undefined) {throw new Error("Invalid arg: list must be defined.");}
    if (index === undefined) {throw new Error("Invalid arg: index must be defined.");}
    const list2 = list.slice();
    list2.splice(index, num_to_remove, ...items_to_add);
    return list2;
}
