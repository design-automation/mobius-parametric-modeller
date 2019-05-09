/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */

import * as Mathjs from 'mathjs';

export function setMake(list: any[]): any[] {
    return Array.from(new Set(list));
}

export function setUni(list1: any[], list2: any[]): any[] {
    return Mathjs.setUnion(list1, list2);
}

export function setInt(list1: any[], list2: any[]): any[] {
    return Mathjs.setIntersect(list1, list2);
}

export function setDif(list1: any[], list2: any[]): any[] {
    return Mathjs.setDifference(list1, list2);
}
