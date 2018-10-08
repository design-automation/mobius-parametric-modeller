import * as gs from "gs-json";
import * as gsm from "../index";
import {} from "jasmine";

describe("Tests for calc Module", () => {
    it("test_calc_distBetweenPoints", () => {
        expect( test_calc_distBetweenPoints() ).toBe(true);
    });
});

export function test_calc_distBetweenPoints(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [12,0,0]);
    const dist: number = gsm.calc.distBetweenPoints(p1, p2);
    if (dist !== 12) {return false;}
    return true;
}
