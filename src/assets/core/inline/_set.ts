/**
 * Set functions for working with sets, using lists as a data structure. Does not modify input list.
 */

import * as Mathjs from 'mathjs';
import { checkNumArgs } from '../_check_inline_args';
/**
 * Generates a list of unique items.
 * @param list
 */
export function setMake(debug: boolean, list: any[]): any[] {
    if (debug) {
        checkNumArgs('setMake', arguments, 1);
    }
    return Array.from(new Set(list));
}
/**
 * Generates a list of unique items from the union of the two input lists.
 * @param list1
 * @param list2
 */
export function setUni(debug: boolean, list1: any[], list2: any[]): any[] {
    if (debug) {
        checkNumArgs('setUni', arguments, 2);
    }
    return Mathjs.setUnion(list1, list2);
}
/**
 * Generates a list of unique items from the intersection of the two input lists.
 * @param list1
 * @param list2
 */
export function setInt(debug: boolean, list1: any[], list2: any[]): any[] {
    if (debug) {
        checkNumArgs('setInt', arguments, 2);
    }
    return Mathjs.setIntersect(list1, list2);
}
/**
 * Generates a list of unique items from the difference of the two input lists.
 * @param list1
 * @param list2
 */
export function setDif(debug: boolean, list1: any[], list2: any[]): any[] {
    if (debug) {
        checkNumArgs('setDif', arguments, 2);
    }
    return Mathjs.setDifference(list1, list2);
}
