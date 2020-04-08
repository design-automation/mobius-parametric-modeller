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
export function round(num: number, decimal_places = 0): any {
    if (decimal_places === 0) { return Math.round(num); }
    const dec: number = Math.pow(10, decimal_places);
    return Math.round(num * dec) / dec;
}
