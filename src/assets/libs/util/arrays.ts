

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
