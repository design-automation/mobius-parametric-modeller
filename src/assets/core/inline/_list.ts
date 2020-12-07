/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */
import { arrMakeFlat } from '@libs/util/arrs';
/**
 * Generates a list of integers, from start to end, with a step size of 1
 * Generates a list of integers, from start to end, with a specified step size
 * @param start 
 * @param end 
 * @param step 
 */
export function range(debug: boolean, start: number, end?: number, step?: number): number[] {
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
 * 
 * @param list 
 */
export function isList(debug: boolean, list: any): boolean {
    return Array.isArray(list);
}
/**
 * Returns the number of items in the list
 * @param list 
 */
export function listLen(debug: boolean, list: any[]): number {
    return list.length;
}
/**
 * Returns the number of times the value is in the list
 * @param list 
 * @param val 
 */
export function listCount(debug: boolean, list: any[], val: any): number {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === val) {
            count += 1;
        }
    }
    return count;
}
/**
 * Returns a copy of the list
 * @param list 
 */
export function listCopy(debug: boolean, list: any[]): any[] {
    return list.slice();
}
/**
 * Returns a new list that repeats the contents of the input list n times.
 * @param list 
 * @param n 
 */
export function listRep(debug: boolean, list: any[], n: number): any[] {
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
 * Returns the last item in a list
 * @param list 
 */
export function listLast(debug: boolean, list: any[]): number {
    return list[list.length - 1];
}
/**
 * Returns the item in the list specified by index, either a positive or negative integer
 * @param list 
 * @param index 
 */
export function listGet(debug: boolean, list: any[], index: number|number[]): any|any[] {
    if (Array.isArray(index)) { return index.map( i => listGet(debug, list, i)) as any[]; }
    if (index < 0) { index = list.length + index; }
    return list[index] as any;
}
/**
 * Returns the index of the first occurence of the value in the list, or -1 if not found
 * @param list 
 * @param val 
 */
export function listFind(debug: boolean, list: any[], val: any): number {
    const index = list.indexOf(val);
    if (index === -1) {
        return null;
    }
    return index;
}
/**
 * Returns true if the list contains the value, false otherwise
 * @param list 
 * @param val 
 */
export function listHas(debug: boolean, list: any[], val: any): boolean {
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === val) {
            return true;
        }
    }
    return false;
}
/**
 * Joins two lists into a single list
 * @param list1 
 * @param list2 
 */
export function listJoin(debug: boolean, list1: any[], list2: any[]): any[] {
    if (!Array.isArray(list1)) { list1 = [list1]; }
    if (!Array.isArray(list2)) { list2 = [list2]; }
    return list1.concat(list2);
}
/**
 * Returns a copy of the nested list, flattened to a depth of 1
 * Returns a copy of the nested list, reduced to the specified depth
 * @param list 
 * @param depth 
 */
export function listFlat(debug: boolean, list: any[], depth?: number): any[] {
    if (depth !== undefined) {
        // @ts-ignore
        return list.flat(depth);
    }
    return arrMakeFlat(list);
}
/**
 * Return a sub-list from the list
 * @param list 
 * @param start 
 * @param end 
 */
export function listSlice(debug: boolean, list: any[], start: number, end?: number): any[] {
    return list.slice(start, end);
}
/**
 * Returns a new list of all the values that evaluate to true.
 * Returns a new list of all the values in list1 that evaluate to true in list2.
 * @param list 
 * @param list2 
 */
export function listCull(debug: boolean, list: any[], list2?: any[]): any[] {
    list2 = list2 ? list2 : list;
    const result: any[] = [];
    const list2_len =  list2.length;
    for (let i = 0; i < list.length; i++) {
        const val = (i < list2_len) ? list2[i] : list2[i % list2_len];
        if (val) {
            result.push(list[i]);
        }
    }
    return result;
}
/**
 * Converts a set of lists from rows into columns, based on the shortest list
 * @param lists 
 */
export function listZip(debug: boolean, lists: any[][]): any[] {
    const shortest = lists.length === 0 ? [] : lists.reduce((a, b) => {
        return a.length < b.length ? a : b;
    });
    return shortest.map((_, i) => lists.map(array => array[i] ));
}
/**
 * Converts a set of lists from rows into columns, based on the longest list
 * @param lists 
 */
export function listZip2(debug: boolean, lists: any[][]): any[] {
    const longest = lists.length === 0 ? [] : lists.reduce((a, b) => {
        return a.length > b.length ? a : b;
    });
    return longest.map((_, i) => lists.map(array => array[i] ));
}



















