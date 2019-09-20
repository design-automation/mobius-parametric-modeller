import __ from 'underscore';
import { deepCopy } from './copy';
import { isDim2 } from '../geo-info/id';

/**
 * Remove an item from an array
 * @param arr
 * @param item
 */
export function arrRem(arr: any[], item: any): void {
    const index: number = arr.indexOf(item);
    if (index === -1) { return; }
    arr.splice(index, 1);
}

/**
 * Add an item to an array in an array
 * @param arr
 * @param item
 */
export function arrIdxAdd(arr: any[], idx: number, item: any): void {
    if (arr[idx] === undefined || arr[idx] === null) {
        arr[idx] = [];
    }
    arr[idx].push(item);
}
/**
 * Remove an item from an array in an array
 * @param arr
 * @param item
 */
export function arrIdxRem(arr: any[], idx: number, item: any, del_empty: boolean): void {
    if (arr[idx] === undefined || arr[idx] === null) {
        return;
    }
    const rem_index: number = arr[idx].indexOf(item);
    if (rem_index === -1) { return; }
    arr[idx].splice(rem_index, 1);
    if (del_empty && arr[idx].length === 0) {
        delete arr[idx];
    }
}
/**
 * Make flat array from anything.
 * ~
 * If it is not an array, then make it an array
 * ~
 * If it is an array, then make it flat
 * ~
 * @param data
 */
export function arrMakeFlat(data: any): any[] {
    if (!Array.isArray(data)) {
        return [data];
    }
    // const depth = arrMaxDepth(data);
    // // @ts-ignore
    // const new_array = data.flat(depth - 1);
    // return new_array;
    const flattend = [];
    function flat(data2: any) {
        data2.forEach(function(el: any) {
            if (Array.isArray(el)) {
                flat(el);
            } else {
                flattend.push(el);
            }
        });
    }
    flat(data);
    return flattend;
}
/**
 * Maximum depth of an array
 * @param data
 */
export function arrMaxDepth(data: any[]): number {
    let d1 = 0;
    if (Array.isArray(data)) {
        d1 = 1;
        let max = 0;
        for (const item of data) {
            if (Array.isArray(data)) {
                const d2 = arrMaxDepth(item);
                if (d2 > max) {
                    max = d2;
                }
            }
        }
        d1 += max;
    }
    return d1;
}
