import * as test from "../string";
import {} from "jasmine";

describe("Tests for String Module", () => {
    it("test_endsWith", () => {
        expect( test_endsWith() ).toBe(true);
    });
    it("test_startsWith", () => {
        expect( test_startsWith() ).toBe(true);
    });
    it("test_includes", () => {
        expect( test_includes() ).toBe(true);
    });
    it("test_len", () => {
        expect( test_len() ).toBe(true);
    });
    it("test_replace", () => {
        expect( test_replace() ).toBe(true);
    });
    it("test_search", () => {
        expect( test_search() ).toBe(true);
    });
    it("test_split", () => {
        expect( test_split() ).toBe(true);
    });
    it("test_substring", () => {
        expect( test_substring() ).toBe(true);
    });
});

export function test_endsWith() {
    return test.endsWith("abc", "bc");
}

export function test_startsWith() {
    return test.startsWith("abc", "ab");
}

export function test_includes() {
    return test.includes("abcdef", "bc");
}

export function test_len() {
    return test.len("abcdef") === 6;
}

export function test_replace() {
    const x: string = "abcdef";
    const y = test.replace(x, "bc", "BC");
    if (y[1] !== "B") {return false;}
    if (y.length !== 6) {return false;}
    return true;
}

export function test_search() {
    return test.search("abcdef", "cde") === 2;
}

export function test_split() {
    const x: string = "this is some text with spaces";
    const y = test.split(x, " ");
    if (y[0] !== "this") {return false;}
    if (y.length !== 6) {return false;}
    return true;
}

export function test_substring() {
    const x: string = "this is some text with spaces";
    const y = test.substring(x, 8, 12);
    if (y !== "some") {return false;}
    return true;
}
