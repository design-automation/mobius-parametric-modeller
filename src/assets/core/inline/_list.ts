/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */
import __ from 'underscore';
import { arrMakeFlat } from '@libs/util/arrs';

export function range(start: number, end: number, step?: number): number[] {
    if (start === undefined) { throw new Error('Invalid inline arg: min must be defined.'); }
    if (end === undefined) { throw new Error('Invalid inline arg: max must be defined.'); }
    const len: number = end - start;
    if (len <= 0) {return []; }
    if (step === undefined) { step = 1; }
    const list: number[] = [];
    let current: number = start;
    while (current < end) {
        list.push(current);
        current += step;
    }
    return list;
}

export function isList(list: any): boolean {
    return Array.isArray(list);
}

export function listLen(list: any[]): number {
    return list.length;
}

export function listCount(list: any[], val: any): number {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === val) {
            count += 1;
        }
    }
    return count;
}

export function listCopy(list: any[]): any[] {
    return list.slice();
}

export function listLast(list: any[]): number {
    return list[list.length - 1];
}

export function listGet(list: any[], index: number|number[]): any|any[] {
    if (Array.isArray(index)) { return index.map( i => listGet(list, i)) as any[]; }
    if (index < 0) { index = list.length + index; }
    return list[index] as any;
}

export function listFind(list: any[], val: any): number {
    const index = list.indexOf(val);
    if (index === -1) {
        return null;
    }
    return index;
}

export function listHas(list: any[], val: any): boolean {
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === val) {
            return true;
        }
    }
    return false;
}

export function listJoin(list1: any[], list2: any[]): any[] {
    if (!Array.isArray(list1)) { list1 = [list1]; }
    if (!Array.isArray(list2)) { list2 = [list2]; }
    return list1.concat(list2);
}

export function listFlat(list: any[], depth?: number): any[] {
    if (depth !== undefined) {
        // @ts-ignore
        return list.flat(depth);
    }
    return arrMakeFlat(list);
}

export function listSlice(list: any[], start: number, end?: number): any[] {
    return list.slice(start, end);
}

export function listZip(lists: any[][]): any[] {
    const shortest = lists.length === 0 ? [] : lists.reduce((a, b) => {
        return a.length < b.length ? a : b;
    });
    return shortest.map((_, i) => lists.map(array => array[i] ));
}

export function listZip2(lists: any[][]): any[] {
    const longest = lists.length === 0 ? [] : lists.reduce((a, b) => {
        return a.length > b.length ? a : b;
    });
    return longest.map((_, i) => lists.map(array => array[i] ));
}


















// =============================== DEPRECATED

export function shuffle(list: any[]): any[] {
    console.log('WARNING: This function has been deprecated. Please use the list.Sort() function, and select random.');
    const new_list: any[] = list.slice();
    new_list.sort(() => .5 - Math.random());
    return new_list;
}

export function zip(lists: any[][]): any[] {
    console.log('WARNING: This function has been deprecated. Please use the inline listZip() function.');
    return listZip(lists);
}

export function zip2(lists: any[][]): any[] {
    console.log('WARNING: This function has been deprecated. Please use the inline listZip2() function.');
    return listZip2(lists);
}

export function length(list: any[]): number {
    if (list === undefined) { throw new Error('Invalid inline arg: list must be defined.'); }
    return list.length;
}
