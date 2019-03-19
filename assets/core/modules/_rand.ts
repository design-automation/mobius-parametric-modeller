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
    if (seed !== undefined) {
        const rand_picks: number[] = [];
        for (let i = 0; i < num; i++) {
            rand_picks.push(list[Math.floor(_randWithSeed(seed + 0.001) * list.length)]);
        }
        return rand_picks;
    } else {
        return mathjs.pickRandom(list, num);
    }
}

function _randWithSeed(s: number): number {
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    /* tslint:disable */
    var x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
    //return (2**31-1&(s=Math.imul(48271,s)))/2**31;
    /* tslint:enable */
}
