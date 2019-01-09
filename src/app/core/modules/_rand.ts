import * as mathjs from 'mathjs';

//._mathjs.random;
//._mathjs.randomInt;
//._mathjs.pickRandom;

export function rand(min: number, max: number): number {
    return mathjs.random(min, max);
}
export function randInt(min: number, max: number): number {
    return mathjs.randomInt(min, max);
}
export function randPick(list: any[]): number {
    return mathjs.pickRandom(list);
}
