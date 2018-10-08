/**
 * A set of static methods for working with arrays of simple types.
 * The arrays can be nested, but they do not contain any objects.
 */

export class Arr {
    /**
     * Make an array of numbers. All elements in the array will have the same value.
     * @param length The length of the new array. If length is 0, then an empty array is returned.
     * @param value The values in the array.
     * @returns The resulting array.
     */
    public static make(length: number, value: any): number[] {
        if (length === 0) {return []; }
        return Array.apply(0, new Array(length)).map((v, i) => value);
    }
    /**
     * Make an array of numbers. All elements in the array will be a numerical sequence, 0, 1, 2, 3....
     * @param length  The length of the new array. If length is 0, then an empty array is returned.
     * @returns The resulting array.
     */
    public static makeSeq(length: number): number[] {
        if (length === 0) {return []; }
        return Array.apply(0, new Array(length)).map((v, i) => i);
    }
    /**
     * Check if two nD arrays are equal (i.e. that all elements in the array are equal, ===.).
     * If the arrays are unequal in length, false is returned.
     * Elements in the array can have any value.
     * @param arr1 The first value.
     * @param arr2 The second values.
     * @returns True or false.
     */
    public static equal(arr1: any, arr2: any): boolean {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {return arr1 === arr2; }
        if (arr1.length !== arr2.length) {return false; }
        for (let i = 0; i < arr1.length; i++) {
            if (!this.equal(arr1[i],arr2[i])) {return false;}
        }
        return true;
    }
    /**
     * Find the position of the first occurrence of a specified value in an array.
     * The value can be an array (which is not the case for Array.indexOf()).
     * If the value is not found or is undefined, return -1.
     * If the array is null or undefined, return -1.
     * @param value The value, can be a value or a 1D array of values.
     * @returns The index in the array of the first occurance of the value.
     */
    public static indexOf(arr: any[], value: any): number {
        if (!Array.isArray(arr)) {throw new Error("First argument must be a array."); }
        if (!Array.isArray(value)) {return arr.indexOf(value); }
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i]) && this.equal(value, arr[i])) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Replace all occurrences of a specified value in an array.
     * The input array is changed.
     * The value can be an array.
     * If the value is not found or is undefined, return -1.
     * @param old_value The old value to replace.
     * @param new_value The new value.
     * @param arr The array.
     */
    public static replace(arr: any[], old_value: any, new_value:any): void {
        if (!Array.isArray(arr)) {throw new Error("First argument must be a array."); }
        for (let i = 0; i < arr.length; i++) {
            if (this.equal(arr[i], old_value)) {
                arr[i] = new_value;
            }
        }
    }

    /**
     * Take an nD array and flattens it.
     * A new array is returned. The input array remains unchanged.
     * For example, [1, 2, [3, 4], [5, 6]] will become [1, 2, 3, 4, 5, 6].
     * If the input array is undefined, an empty array is returned.
     * @param arr The multidimensional array to flatten.
     * @returns A new 1D array.
     */
    public static flatten(arr: any[], depth?: number): any[] {
        if (arr === undefined) {return []; }
        return arr.reduce(function(flat, toFlatten) {
            if (depth === undefined) {
                return flat.concat(Array.isArray(toFlatten) ? Arr.flatten(toFlatten) : toFlatten);
            } else {
                return flat.concat((Array.isArray(toFlatten) && (depth !== 0)) ?
                    Arr.flatten(toFlatten, depth - 1) : toFlatten);
            }
        }, []);
    }
    /**
     * Make a copy of an nD array.
     * If the input is not an array, then just return the same thing.
     * A new array is returned. The input array remains unchanged.
     * If the input array is undefined, an empty array is returned.
     * If the input is s sparse array, then the output will alos be a sparse array.
     * @param arr The nD array to copy.
     * @returns The new nD array.
     */
    public static deepCopy(arr: any[]): any[] {
        if (arr === undefined) {return []; }
        if (!Array.isArray(arr)) {return arr; }
        const arr2: any[] = [];
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                arr2[i] = (Arr.deepCopy(arr[i]));
            } else {
                if (arr[i] !== undefined) {
                    arr2[i] = (arr[i]);
                }
            }
        }
        return arr2;
    }
    /**
     * Fills an nD array with new values (all the same value).
     * The input array is changed.
     * If the input array is undefined, an empty array is returned.
     * The input can be a sparse array.
     * @param arr The nD array to fill.
     * @param value The value to insert into the array.
     */
    public static deepFill(arr: any[], value: any): void {
        if (arr === undefined) {return; }
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                Arr.deepFill(arr[i], value);
            } else {
                if (arr[i] !== undefined) {
                    arr[i] = value;
                }
            }
        }
    }
    /**
     * Counts the number of values in an nD array .
     * The input array remains unchanged.
     * If the input array is undefined, 0 is returned.
     * The input can be a sparse array. Undefined values are ignored.
     * For example, for [1, 2, , , 3], the count will be 3.
     * @param arr The nD array to count.
     * @return The number of elements in the nD array.
     */
    public static deepCount(arr: any[]): number {
        if (arr === undefined) {return 0; }
        let a: number = 0 ;
        for ( const i in arr) {
            if (Array.isArray(arr[i])) {
                a = a + Arr.deepCount(arr[i]);
            } else {
                if (arr[i] !== undefined) {
                    a = a + 1 ;
                }
            }
        }
        return a ;
    }
}
