import * as test from "../list";
import {} from "jasmine";

describe("Tests for List Module", () => {
    it("test_Copy", () => {
        expect( test_Copy() ).toBe(true);
    });
    it("test_FromRange", () => {
        expect( test_FromRange() ).toBe(true);
    });
    it("test_len", () => {
        expect( test_len() ).toBe(true);
    });
    it("test_append", () => {
        expect( test_append() ).toBe(true);
    });
    it("test_appendFront", () => {
        expect( test_appendFront() ).toBe(true);
    });
    it("test_extend", () => {
        expect( test_extend() ).toBe(true);
    });
    it("test_extendFront", () => {
        expect( test_extendFront() ).toBe(true);
    });
    it("test_flatten", () => {
        expect( test_flatten() ).toBe(true);
    });
    it("test_removeIndex", () => {
        expect( test_removeIndex() ).toBe(true);
    });
    it("test_removeValue", () => {
        expect( test_removeValue() ).toBe(true);
    });
    it("test_reverse", () => {
        expect( test_reverse() ).toBe(true);
    });
    it("test_sortAlpha", () => {
        expect( test_sortAlpha() ).toBe(true);
    });
    it("test_sortNum", () => {
        expect( test_sortNum() ).toBe(true);
    });
    it("test_slice", () => {
        expect( test_slice() ).toBe(true);
    });
    it("test_splice", () => {
        expect( test_splice() ).toBe(true);
    });
});


export function test_Copy() {
    const x: any[] = [1,2,"abc", 1.23];
    const y: any[] = test.Copy(x);
    if (x[1] !== y[1]) {return false;}
    return true;
}

export function test_FromRange() {
    const x: number[] = test.FromRange(10,20);
    if (x[0] !== 10) {return false;}
    if (x.length !== 10) {return false;}
    if (x[9] !== 19) {return false;}
    return true;
}

export function test_len() {
    const x: number[] = [0,1,2,3,4];
    if (x.length !== 5) {return false;}
    return true;
}

export function test_append() {
    const x: number[] = [1,2,3];
    const y: number[] = test.append(x, 10);
    if (y[3] !== 10) {return false;}
    return true;
}

export function test_appendFront() {
    const x: number[] = [1,2,3];
    const y: number[] = test.appendFront(x, 10);
    if (y[0] !== 10) {return false;}
    return true;
}

export function test_extend() {
    const x: number[] = [1,2,3];
    const y: number[] = test.extend(x, [7,6,5]);
    if (y[5] !== 5) {return false;}
    return true;
}

export function test_extendFront() {
    const x: number[] = [1,2,3];
    const y: number[] = test.extendFront(x, [7,6,5]);
    if (y[0] !== 7) {return false;}
    return true;
}

export function test_flatten() {
    const x: any[] = [1,[7,8,9],[3,4,5]];
    const y: number[] = test.flatten(x);
    if (y[6] !== 5) {return false;}
    return true;
}

export function test_removeIndex() {
    const x: any[] = [10, 20, 30, 40];
    const y: number[] = test.removeIndex(x, 1);
    if (y[2] !== 40) {return false;}
    return true;
}

export function test_removeValue() {
    const x: number[] = [10, 20, 30, 40, 20];
    const y1: number[] = test.removeValue(x, 20, true);
    const y2: number[] = test.removeValue(x, 20, false);
    if (y1.length !== 3) {return false;}
    if (y2.length !== 4) {return false;}
    return true;
}

export function test_reverse() {
    const x: number[] = [10, 20, 30, 40, 20];
    const y: number[] = test.reverse(x);
    if (y[0] !== 20) {return false;}
    return true;
}

export function test_sortAlpha() {
    const x: string[] = ["b", "a", "d", "c"];
    const y: string[] = test.sortAlpha(x);
    if (y[0] !== "a") {return false;}
    return true;
}

export function test_sortNum() {
    const x: number[] = [2, 1, 4, 3];
    const y: number[] = test.sortNum(x);
    if (y[0] !== 1) {return false;}
    return true;
}

export function test_slice() {
    const x: number[] = [2, 1, 4, 3];
    const y: number[] = test.slice(x, 1, 3);
    if (y[0] !== 1) {return false;}
    if (y.length !== 2) {return false;}
    return true;
}

export function test_splice() {
    const x: number[] = [2, 1, 4, 3];
    const y: number[] = test.splice(x, 1, 2, [10, 20, 30]);
    if (y[1] !== 10) {return false;}
    if (y.length !== 5) {return false;}
    return true;
}
