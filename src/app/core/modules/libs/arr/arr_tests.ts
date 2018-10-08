import {Arr} from "./arr";

export function test_make(): boolean {
    const a: number[] = Arr.make(10, 5);
    if (a[0] !== 5) {return false; }
    if (a[9] !== 5) {return false; }
    if (a.length !== 10) {return false; }
    if (Arr.make(0, 5).length !== 0) {return false; }
    if (!Arr.equal(Arr.make(0, 5), [])) {return false; }
    return true;
}

export function test_makeSeq(): boolean {
    const a: number[] = Arr.makeSeq(4);
    if (a[0] !== 0) {return false; }
    if (a[1] !== 1) {return false; }
    if (a[2] !== 2) {return false; }
    if (a[3] !== 3) {return false; }
    if (a.length !== 4) {return false; }
    return true;
}

export function test_equal(): boolean {
    if (!Arr.equal([1, 2, 3], [1, 2, 3])) {return false; }
    if (Arr.equal([1, 2, 3], [1, 2])) {return false; }
    if (Arr.equal([1, 2], [1, 2, 3])) {return false; }
    if (!Arr.equal([1.1, 2.2], [1.1, 2.2])) {return false; }
    if (!Arr.equal([], [])) {return false;}
    if (!Arr.equal([null, null], [null, null])) {return false;}
    if (Arr.equal([1,2,3], null)) {return false;}
    if (Arr.equal(null, [1,2,3])) {return false;}
    // sparse arrays
    const x: number[] = [];
    x[2] = 5;
    const y: number[] = [];
    y[2] = 5;
    if (!Arr.equal(x, y)) {return false;}
    return true;
}

export function test_indexOf(): boolean {
    if (Arr.indexOf([0, 1, 2, 3], 2) !== 2) {return false; }
    if (Arr.indexOf([0, 1, null, 3], null) !== 2) {return false; }
    if (Arr.indexOf([null], [1, 2]) !== -1) {return false; }
    if (Arr.indexOf([[], [2], [1, 2], [3, 4]], [1, 2]) !== 2) {return false; }
    if (Arr.indexOf([[], [1, null], [2], [1, null], [3, 4]], [1, null]) !== 1) {return false; }
    if (Arr.indexOf([[], [1, null], [2], [1, null], [3, 4]], [1, 3]) !== -1) {return false; }
    if (Arr.indexOf([1,2,3], null) !== -1) {return false;}
    if (Arr.indexOf([null,2,3], null) !== 0) {return false;}

    // sparse arrays
    const x: number[][] = [];
    x[2] = [1, 2];
    if (Arr.indexOf(x, [1, 2]) !== 2) {return false; }
    return true;
}

export function test_flatten(): boolean {
    if (!Arr.equal(Arr.flatten([[], [2], [1, 2], [3, 4]]), [2, 1, 2, 3, 4])) {return false; }
    // sparse arrays
    const x: number[][] = [];
    x[2] = [1, 2];
    if (Arr.equal(Arr.flatten(x), [, , 1, 2])) {return false; }
    return true;
}

export function test_deepCopy(): boolean {
    const x: any[] = [1, 2, [3, 4, [5, 6, [7, 8]]]];
    let y: any[] = Arr.deepCopy(x);
    y[2][1] = 100;
    x[2][2][2] = 200;
    if (x[2][1] !== 4) {return false; }
    if (y[2][1] !== 100) {return false; }
    if (x[2][2][2] !== 200) {return false; }
    if (!Arr.equal(y[2][2][2], [7, 8])) {return false; }
    // sparse arrays
    x[5] = 1;
    y = Arr.deepCopy(x);
    if (y[5] !== 1) {return false; }
    return true;
}

export function test_deepFill(): boolean {
    const x: any[] = [1, 2, [3, 4, [5, 6, [7, 8]]]];
    Arr.deepFill(x, 0);
    if (x[0] !== 0) {return false; }
    if (!Arr.equal(x[2][2][2], [0, 0])) {return false; }
    // sparse arrays
    x[5] = 1; // x[3] and x[4] are undefined
    Arr.deepFill(x, 0);
    if (x[5] !== 0) {return false; }
    return true;
}

export function test_deepCount(): boolean {
    const x: any[] = [1, 2, [3, 4, [5, 6, [7, 8]]]];
    if (Arr.deepCount([]) !== 0) {return false; }
    if (Arr.deepCount([1, 2, 3]) !== 3) {return false; }
    if (Arr.deepCount(x) !== 8) {return false; }
    // sparse arrays
    x[5] = 1;
    Arr.deepFill(x, 0);
    if (Arr.deepCount(x) !== 9) {return false; }
    return true;
}
