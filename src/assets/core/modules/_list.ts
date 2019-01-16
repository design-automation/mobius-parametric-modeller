/**
 * list functions that obtain and return information from an input list. Does not modify input list.
 */


export function range(min: number, max: number): number[] {
    if (min === undefined) { throw new Error('Invalid arg: min must be defined.'); }
    if (max === undefined) { throw new Error('Invalid arg: max must be defined.'); }
    const len: number = max - min;
    if (len <= 0) {return []; }
    return Array.apply(0, new Array(len)).map((v, i) => i + min);
}

export function length(list: any[]): number {
    if (list === undefined) { throw new Error('Invalid arg: list must be defined.'); }
    return list.length;
}

export function shuffle(list: any[]): any[] {
    const new_list: any[] = list.slice();
    new_list.sort(() => .5 - Math.random());
    return new_list;
}

export function zip(lists: any[][]): any[] {
    const shortest = lists.length === 0 ? [] : lists.reduce((a, b) => {
        return a.length < b.length ? a : b;
    });
    return shortest.map((_, i) => lists.map(array => array[i] ));
}

export function zip2(lists: any[][]): any[] {
    const longest = lists.length === 0 ? [] : lists.reduce((a, b) => {
        return a.length > b.length ? a : b;
    });
    return longest.map((_, i) => lists.map(array => array[i] ));
}
