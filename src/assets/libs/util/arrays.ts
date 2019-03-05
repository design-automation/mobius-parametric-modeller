

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
