/**
 * Set functions for working with sets, using lists as a data structure. Does not modify input list.
 */

import * as Mathjs from 'mathjs';
/**
 * Generates a list of unique items.
 * @param list 
 */
export function setMake(debug: boolean, list: any[]): any[] {
    return Array.from(new Set(list));
}
/**
 * Generates a list of unique items from the union of the two input lists.
 * @param list1 
 * @param list2 
 */
export function setUni(debug: boolean, list1: any[], list2: any[]): any[] {
    return Mathjs.setUnion(list1, list2);
}
/**
 * Generates a list of unique items from the intersection of the two input lists.
 * @param list1 
 * @param list2 
 */
export function setInt(debug: boolean, list1: any[], list2: any[]): any[] {
    return Mathjs.setIntersect(list1, list2);
}
/**
 * Generates a list of unique items from the difference of the two input lists.
 * @param list1 
 * @param list2 
 */
export function setDif(debug: boolean, list1: any[], list2: any[]): any[] {
    return Mathjs.setDifference(list1, list2);
}
