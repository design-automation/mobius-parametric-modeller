import * as mathjs from 'mathjs';

export function rand(min: number, max: number): number {
    return mathjs.random(min, max);
}
export function randInt(min: number, max: number): number {
    return mathjs.randomInt(min, max);
}
export function randPick(list: any[], num: number): number {
    return mathjs.pickRandom(list, num);
}
