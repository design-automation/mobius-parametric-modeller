import * as test from "../math";
import {} from "jasmine";

describe("Tests for List Module", () => {
    it("test_PI", () => {
        expect( test_PI() ).toBe(true);
    });
    it("test_POS_INF", () => {
        expect( test_POS_INF() ).toBe(true);
    });
    it("test_NEG_INF", () => {
        expect( test_NEG_INF() ).toBe(true);
    });
    it("test_cos", () => {
        expect( test_cos() ).toBe(true);
    });
    it("test_sin", () => {
        expect( test_sin() ).toBe(true);
    });
    it("test_tan", () => {
        expect( test_tan() ).toBe(true);
    });
    it("test_pow", () => {
        expect( test_pow() ).toBe(true);
    });
    it("test_ceiling", () => {
        expect( test_ceiling() ).toBe(true);
    });
    it("test_abs", () => {
        expect( test_abs() ).toBe(true);
    });
    it("test_max", () => {
        expect( test_max() ).toBe(true);
    });
    it("test_min", () => {
        expect( test_min() ).toBe(true);
    });
    it("test_rand", () => {
        expect( test_rand() ).toBe(true);
    });
    it("test_randInt", () => {
        expect( test_randInt() ).toBe(true);
    });
    it("test_randFloat", () => {
        expect( test_randFloat() ).toBe(true);
    });
});


export function test_PI() {
    return test.PI() > 3.14;
}

export function test_POS_INF() {
    return test.POS_INF() > 0;
}

export function test_NEG_INF() {
    return test.NEG_INF() < 0;
}

export function test_cos() {
    return test.cos(180) === -1;
}

export function test_sin() {
    return test.sin(90) === 1;
}

export function test_tan() {
    return test.tan(0) === 0;
}

export function test_pow() {
    return test.pow(2,3) === 8;
}

export function test_ceiling() {
    return test.ceiling(2.1) === 3;
}

export function test_floor() {
    return test.floor(2.9) === 2;
}

export function test_abs() {
    return test.abs(-2.9) === 2.9;
}

export function test_max() {
    return test.max([1, 3, -10, 9, 5]) === 9;
}

export function test_min() {
    return test.min([1, 3, -10, 9, 5]) === -10;
}

export function test_rand() {
    return test.rand() >= 0 && test.rand() < 1;
}

export function test_randInt() {
    return test.randInt(10, 20) >= 10 && test.randInt(10, 20) < 20;
}

export function test_randFloat() {
    return test.randFloat(1.5, 2.5) >= 1.5 && test.randInt(1.5, 2.5) < 2.5;
}
