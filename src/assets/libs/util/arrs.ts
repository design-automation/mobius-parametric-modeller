import lodash from 'lodash';
/**
 * Remove an item from an array
 * Return teh index where the item was removed.
 * Returns -1 if teh item was not found.
 * @param arr
 * @param item
 */
export function arrRem(arr: any[], item: any): number {
    const index: number = arr.indexOf(item);
    if (index === -1) { return -1; }
    arr.splice(index, 1);
    return index;
}
/**
 * Remove an item from an array
 * Treats array as set of unique items
 * @param arr
 * @param item
 */
export function arrAddToSet(arr: any[], item: any): number {
    const index: number = arr.indexOf(item);
    if (index !== -1) { return index; }
    return arr.push(item) - 1;
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
 * Make flat array (depth = 1) from anything.
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
    return lodash.flattenDeep(data);
    // const depth = arrMaxDepth(data);
    // // @ts-ignore
    // const new_array = data.flat(depth - 1);
    // return new_array;
    // const flattend = [];
    // function flat(data2: any) {
    //     data2.forEach(function(el: any) {
    //         if (Array.isArray(el)) {
    //             flat(el);
    //         } else {
    //             flattend.push(el);
    //         }
    //     });
    // }
    // flat(data);
    // return flattend;
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

/**
 * Converts a value to an array of specified length.
 * ~
 * @param data
 */
export function arrFill(data: any, length: number): any[] {
    if (! Array.isArray(data)) {
        data = [data];
    }
    data = data as any[];
    const last = data[data.length - 1];
    for (let i = data.length; i < length; i++)  {
        data[i] = last;
    }
    if (data.length > length)   {
        data = data.slice(0, length);
    }
    return data;
}

export function getArrDepth(arr: any): number {
    if (Array.isArray(arr)) {
        return 1 + getArrDepth(arr[0]);
    }
    return 0;
}

export function isEmptyArr(arr: any): boolean {
    if (Array.isArray(arr) && !arr.length) {
        return true;
    }
    return false;
}
