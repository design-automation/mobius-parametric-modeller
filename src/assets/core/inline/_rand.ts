import * as mathjs from 'mathjs';

export function rand(min: number, max: number, seed?: number): number {
    if (seed !== undefined) {
        return min + (_randWithSeed(seed) * (max - min));
    } else {
        return mathjs.random(min, max);
    }
}
export function randInt(min: number, max: number, seed?: number): number {
    if (seed !== undefined) {
        return Math.floor(min + (_randWithSeed(seed) * (max - min)));
    } else {
        return mathjs.randomInt(min, max);
    }
}
export function randPick(list: any[], num: number, seed?: number): number[] {
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

