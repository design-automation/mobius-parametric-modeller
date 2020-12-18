/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */
import lodash from 'lodash';
import { checkArgs } from '../modules/_check_args';
import * as chk from '../modules/_check_types';
import { checkListsSameLen, checkNumArgs } from './_check_inline_args';
/**
 * Generates a list of integers, from start to end, with a step size of 1
 * Generates a list of integers, from start to end, with a specified step size
 *
 * @param start The start of the range, inclusive.
 * @param end (Optional) The end of the range, exclusive.
 * @param step (Optional) The step size.
 */
export function range(debug: boolean, start: number, end?: number, step?: number): number[] {
    if (debug) {
        checkNumArgs('range', arguments, 3, 1);
        checkArgs('range', 'start', start, [chk.isInt]);
        if (end !== undefined) { checkArgs('range', 'end', end, [chk.isInt]); }
        if (step !== undefined) { checkArgs('range', 'step', step, [chk.isInt]); }
    }
    if (start === undefined) { throw new Error('Invalid inline arg: min must be defined.'); }
    if (end === undefined) { end = start; start = 0; }
    if (step === 0) { throw new Error('Invalid inline arg: step must not be 0.'); }
    const len: number = end - start;
    if (step === undefined) {
        step = len > 0 ? 1 : -1;
    }
    const negStep = step < 0;
    if (len > 0 !== step > 0) { return []; }
    const list: number[] = [];
    let current: number = start;
    while (current !== end && (current < end) !== negStep) {
        list.push(current);
        current += step;
    }
    return list;
}
/**
 * Returns the number of times the value is in the list
 *
 * @param list The list.
 * @param val The value, can be aby type.
 */
export function listCount(debug: boolean, list: any[], val: any): number {
    if (debug) {
        checkNumArgs('listCount', arguments, 2);
        checkArgs('listCount', 'list', list, [chk.isList]);
    }
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === val) {
            count += 1;
        }
    }
    return count;
}
/**
 * Returns a shallow copy of the list.
 *
 * @param list The list.
 */
export function listCopy(debug: boolean, list: any[]): any[] {
    if (debug) {
        checkNumArgs('listCopy', arguments, 1);
        checkArgs('listCopy', 'list', list, [chk.isList]);
    }
    return list.slice();
}
/**
 * Returns a new list that repeats the contents of the input list n times.
 *
 * @param list The list.
 * @param n
 */
export function listRep(debug: boolean, list: any, n: number): any[] {
    if (debug) {
        checkNumArgs('listRep', arguments, 2);
        checkArgs('listRep', 'n', n, [chk.isInt]);
    }
    list = Array.isArray(list) ? list : [list];
    const result: any[] = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < list.length; j++) {
            result.push(list[j]);
        }
    }
    return result;
}
/**
 * Returns the item in the list specified by index, either a positive or negative integer.
 *
 * @param list  The list.
 * @param idx The index, an integer or a list of integers.
 */
export function listGet(debug: boolean, list: any[], idx: number|number[]): any|any[] {
    if (debug) {
        checkNumArgs('listGet', arguments, 2);
        checkArgs('listGet', 'list', list, [chk.isList]);
        checkArgs('listGet', 'index', idx, [chk.isInt, chk.isIntL]);
    }
    if (Array.isArray(idx)) { return idx.map( a_idx => listGet(debug, list, a_idx)) as any[]; }
    if (idx < 0) { idx = list.length + idx; }
    return list[idx] as any;
}
/**
 * Returns the index of the first occurence of the value in the list.
 *
 * If the value does not exist, returns null.
 *
 * @param list The list.
 * @param val The value, can be of any type.
 */
export function listFind(debug: boolean, list: any[], val: any): number {
    if (debug) {
        checkNumArgs('listFind', arguments, 2);
        checkArgs('listFind', 'list', list, [chk.isList]);
    }
    const index = list.indexOf(val);
    if (index === -1) {
        return null;
    }
    return index;
}
/**
 * Returns true if the list contains the value, false otherwise
 *
 * @param list The list.
 * @param val The value, can be any type.
 */
export function listHas(debug: boolean, list: any[], val: any): boolean {
    if (debug) {
        checkNumArgs('listHas', arguments, 2);
        checkArgs('listHas', 'list', list, [chk.isList]);
    }
    return list.indexOf(val) !== -1;
}
/**
 * Joins two or more lists into a single list.
 *
 * If the arguments are not lists, then they will be converted into lists.
 *
 * This functions accepts any number of arguments.
 *
 * @param list1 The first list.
 * @param list2 The second list.
 */
export function listJoin(debug: boolean, list1: any[], list2: any[]): any[] {
    if (debug) {
        // nothing to check
    }
    const new_list: any[] = [];
    for (let i = 1; i < arguments.length; i++) {
        const arg: any = arguments[i];
        if (Array.isArray(arg)) {
            for (const item of arg) {
                new_list.push(item);
            }
        } else {
            new_list.push(arg);
        }
    }
    return new_list;
}
/**
 * Returns a flattened copy of the list.
 *
 * If no depth is specified, then it is flattened my the maximum amount.
 *
 * @param list The list.
 * @param depth (Optional) The depth to flatten to, an integer.
 */
export function listFlat(debug: boolean, list: any[], depth?: number): any[] {
    if (debug) {
        checkNumArgs('listFlat', arguments, 2, 1);
        checkArgs('listFlat', 'list', list, [chk.isList]);
        if (depth !== undefined) { checkArgs('listFlat', 'depth', depth, [chk.isInt]); }
    }
    if (depth !== undefined) {
        return lodash.flattenDepth(list);
    }
    return lodash.flattenDeep(list);
}
/**
 * Return a list that is rotated, i.e. items from the end of the list are moved to the start of the list.
 * For a positive rotation, items are move from the end to the start of the list.
 * For a negative rotation, items are moved from the start to the end of the list.
 *
 * @param list The list.
 * @param rot The number of items to rotate, an integer.
 */
export function listRot(debug: boolean, list: any[], rot: number): any[] {
    if (debug) {
        checkNumArgs('listRot', arguments, 2);
        checkArgs('listRot', 'list', list, [chk.isList]);
        checkArgs('listRot', 'rot', rot, [chk.isInt]);
    }
    const len: number = list.length;
    const split: number = (len - rot) % len;
    const start: any[] = list.slice(split, len);
    const end: any[] = list.slice(0, split);
    return start.concat(end);
}
/**
 * Return a sub-list from the list.
 *
 * @param list The list.
 * @param start The start index of the slice operation, an integer.
 * @param end (Optional) The end index of the slice operation, an integer. Defaults to the length of the list.
 */
export function listSlice(debug: boolean, list: any[], start: number, end?: number): any[] {
    if (debug) {
        checkNumArgs('listSlice', arguments, 3, 2);
        checkArgs('listSlice', 'list', list, [chk.isList]);
        checkArgs('listSlice', 'start', start, [chk.isInt]);
        if (end !== undefined) { checkArgs('listSlice', 'end', end, [chk.isInt]); }
    }
    return list.slice(start, end);
}
/**
 * Creates a new list, with the items in reverse order.
 *
 * @param lists  The list to reverse.
 */
export function listRev(debug: boolean, list: any[]): any[] {
    if (debug) {
        checkNumArgs('listRev', arguments, 1);
        checkArgs('listRev', 'list', list, [chk.isList]);
    }
    return list.slice().reverse();
}
/**
 * Returns a new list of all the values that evaluate to true.
 *
 * If the second argument is provided, then it
 * returns a new list of all the values in list1 that evaluate to true in list2.
 *
 * @param list1 The list.
 * @param list2 (Optional) A list of values, to be used to cull the first list.
 */
export function listCull(debug: boolean, list1: any[], list2?: any[]): any[] {
    if (debug) {
        checkNumArgs('listCull', arguments, 2);
        checkArgs('listCull', 'list1', list1, [chk.isList]);
        checkArgs('listCull', 'list2', list2, [chk.isList]);
    }
    list2 = list2 ? list2 : list1;
    const result: any[] = [];
    const list2_len =  list2.length;
    for (let i = 0; i < list1.length; i++) {
        const val = (i < list2_len) ? list2[i] : list2[i % list2_len];
        if (val) {
            result.push(list1[i]);
        }
    }
    return result;
}
/**
 * Creates a new list, with the items in sorted order.
 *
 * If no second argument is provided, then the list is sorted in ascending order.
 *
 * If a second argument is provided, then it should be a list of the same length as the first argument.
 * In this case, the first list is sorted according to ascending order of the values in the second list.
 *
 * @param lists  The list of lists.
 */
export function listSort(debug: boolean, list1: any[], list2?: any[]): any[] {
    if (debug) {
        checkNumArgs('listSort', arguments, 2, 1);
        checkArgs('listSort', 'list1', list1, [chk.isList]);
        if (list2 !== undefined) {
            checkArgs('listSort', 'list2', list1, [chk.isList]);
            checkListsSameLen('listSort', arguments);
        }
    }
    if (list2 !== undefined) {
        const zipped = lodash.zip(list1, list2);
        zipped.sort( (a, b) => a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0 );
        const unzipped = lodash.unzip(zipped);
        return unzipped[0];
    }
    return list1.slice().sort( (a, b) => a > b ? 1 : a < b ? -1 : 0 );
}
/**
 * Converts a set of lists from rows into columns.
 *
 * If no second argument is provided, it assume the the first argument consists of a list of lists.
 *
 * If a second argument is provided, then it should be a list of the same length as the first argument.
 * In this case, the items in the first and second lists are reaarranged to generate a new set of lists.
 *
 * This function also accepts additional lists of arguments.
 *
 * @param list1  The first row list.
 * @param list2  (Optional) The second row list, which must have the same length as the first.
 */
export function listZip(debug: boolean, list1: any[], list2?: any[]): any[] {
    if (debug) {
        if (list2 === undefined) {
            checkArgs('listZip', 'list1', list1, [chk.isLList]);
        } else {
            checkArgs('listZip', 'list1', list1, [chk.isList]);
            checkListsSameLen('listZip', arguments);
        }
    }
    if (arguments.length === 2) {
        return lodash.unzip(list1);
    }
    const lists = Array.from(arguments).slice(1);
    return lodash.zip(...lists);
}
/**
 * Returns true if the values in the two lists are equal.
 *
 * @param list1 The first list.
 * @param list2 The second list.
 */
export function listEq(debug: boolean, list1: any[], list2: any[]): boolean {
    if (debug) {
        checkNumArgs('listEq', arguments, 2);
        checkArgs('listEq', 'list1', list1, [chk.isList]);
        checkArgs('listEq', 'list2', list2, [chk.isList]);
    }
    return lodash.isEqual(list1, list2);
}

