import * as tr from "./trigo";
import {} from "jasmine";

describe("Tests for Trigonometric Solving", () => {
    it("test_Trigo", () => {
        expect( solve_trigo() ).toBe(true);
    });
});

export function solve_trigo(): boolean {
    let A: number = 0;
    let B: number = 0;
    let C: number = 0;
    let results: number[] = [];
    const eps: number = 1e-10;
    for (let k=0;k<10;k++) {
    A = Math.ceil(100 * Math.random());
    B = Math.ceil(100 * Math.random());
    C = Math.ceil(100 * Math.random());
    results = tr._solve_trigo(A,B,C);
    if(results !== null) {
        if(Math.abs(A + B*Math.cos(results[0]) + C*Math.sin(results[0]))>eps) {return false;}
        if(Math.abs(A + B*Math.cos(results[1]) + C*Math.sin(results[1]))>eps) {return false;}
        }
    }
    return true;
}
