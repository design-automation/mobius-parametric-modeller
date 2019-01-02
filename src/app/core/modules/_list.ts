/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */

/**
 * Creates a new list of integer numbers between two bounds.
 * Lower bound is inclusive and upper bound is exclusive.
 *
 * @param min Lower bound integer.
 * @param max Upper bound integer.
 * @returns New list.
 * @example list = list.range(0,5)
 * @example_info Expected value of list is [0,1,2,3,4].
 */
export function range(min: number, max: number): number[] {
    if (min === undefined) { throw new Error('Invalid arg: min must be defined.'); }
    if (max === undefined) { throw new Error('Invalid arg: max must be defined.'); }
    const len: number = max - min;
    if (len <= 0) {return []; }
    return Array.apply(0, new Array(len)).map((v, i) => i + min);
}
/**
 * Creates a new list of integer numbers between two bounds.
 * Lower bound is inclusive and upper bound is exclusive.
 *
 * @param min Lower bound integer.
 * @param max Upper bound integer.
 * @returns New list.
 * @example list = list.range(0,5)
 * @example_info Expected value of list is [0,1,2,3,4].
 */
export function length(list: any[]): number {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    return list.length;
}
