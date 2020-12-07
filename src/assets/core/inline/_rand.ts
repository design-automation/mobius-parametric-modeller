import * as mathjs from 'mathjs';
/**
 * Returns a random number in the specified range
 * Returns a random number in the specified range, given a numeric seed
 * @param min 
 * @param max 
 * @param seed 
 */
export function rand(debug: boolean, min: number, max: number, seed?: number): number {
    if (seed !== undefined) {
        return min + (_randWithSeed(seed) * (max - min));
    } else {
        return mathjs.random(min, max);
    }
}
/**
 * Returns a random integer in the specified range
 * Returns a random integer in the specified range, given a numeric seed
 * @param min 
 * @param max 
 * @param seed 
 */
export function randInt(debug: boolean, min: number, max: number, seed?: number): number {
    if (seed !== undefined) {
        return Math.floor(min + (_randWithSeed(seed) * (max - min)));
    } else {
        return mathjs.randomInt(min, max);
    }
}
/**
 * Returns a random set of items from the list
 * Returns a random set of items from the list, given a numeric seed
 * @param list 
 * @param num 
 * @param seed 
 */
export function randPick(debug: boolean, list: any[], num: number, seed?: number): number[] {
    const list_copy: any[] = list.slice();
    _randShuffleWithSeed(list_copy, seed);
    return list_copy.slice(0, num);
}
// TODO is there a better random function than this?
function _randWithSeed(s: number): number {
    // const x = (Math.sin(s) + Math.sin(s * Math.E / 2) + Math.sin((s + 1) * (Math.PI / 3))) * 10000;
    // return x - Math.floor(x);

    // return (Math.sin(s / 2 + 1) + Math.cos(s + 2) * 5) * 10000 % 1;
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    /* tslint:disable */
    var x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
    //return (2**31-1&(s=Math.imul(48271,s)))/2**31;
    /* tslint:enable */
}
function _randShuffleWithSeed(arr: any[], s?: number) {
    let ctr = arr.length;
    while (ctr > 0) {
        const r: number = (s === undefined) ? Math.random() : _randWithSeed(ctr + s);
        const index: number = Math.floor(r * ctr);
        ctr--;
        const temp: number = arr[ctr];
        arr[ctr] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

