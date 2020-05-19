export function min(list: any): any {
    const args = Array.prototype.slice.call (arguments, min.length);
    if (args.length === 0) {
        if (list.constructor === [].constructor) {
            return Math.min.apply(Math, list);
        }
        return list;
    }
    args.push(list);
    return Math.min.apply(Math, args);
}
// max(1,2,3)
// max([1,2,3])
export function max(list: any): any {
    const args = Array.prototype.slice.call (arguments, min.length);
    if (args.length === 0) {
        if (list.constructor === [].constructor) {
            return Math.max.apply(Math, list);
        }
        return list;
    }
    args.push(list);
    return Math.max.apply(Math, args);
}
export function round(num: number|number[], decimal_places = 0): number|number[] {
    if (Array.isArray(num)) {
        return num.map( a_num => round(a_num, decimal_places) ) as number[];
    }
    num = num as number;
    if (decimal_places === 0) { return Math.round(num); }
    if (decimal_places > 0) {
        const dec: number = Math.pow(10, decimal_places);
        return Math.round(num * dec) / dec;
    } else {
        const dec: number = Math.pow(10, Math.abs(decimal_places));
        return Math.round(num / dec) * dec;
    }
}
export function sigFig(num: number|number[], sig_figs: number): number|number[] {
    if (Array.isArray(num)) {
        return num.map( a_num => sigFig(a_num, sig_figs) ) as number[];
    }
    if (num === 0) { return 0; }
    num = num as number;
    const round_val: number = sig_figs - 1 - Math.floor(Math.log10(Math.abs(num)));
    return round(num, round_val) as number;
    // return parseFloat(num.toPrecision(sig_figs));
}
