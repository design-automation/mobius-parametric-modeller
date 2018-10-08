import * as gs from "gs-json";
import * as gsm from "@modules";
import * as fs from "fs";
import {} from "jasmine";

describe("Tests for PMesh Module", () => {
    it("test_pmesh_fromPoints", () => {
        expect( test_pmesh_fromPoints() ).toBe(true);
    });
    it("test_pmesh_fromPline", () => {
        expect( test_pmesh_fromPline() ).toBe(true);
    });
    it("test_pmesh_offset", () => {
        expect( test_pmesh_offset() ).toBe(true);
    });
    it("test_pmesh_thicken", () => {
        expect( test_pmesh_thicken() ).toBe(true);
    });
    it("test_pmesh_TriStripFromPoints", () => {
        expect( test_pmesh_TriStripFromPoints() ).toBe(true);
    });
    it("test_pmesh_explode", () => {
        expect( test_pmesh_explode() ).toBe(true);
    });
});

export function test_pmesh_fromPoints(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pmesh: gs.IPolymesh = gsm.pmesh.FromPoints([[p1, p2, p3]]);
    if (pmesh === undefined) {return false;}
    return true;
}

export function test_pmesh_fromPline(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const pmesh: gs.IPolymesh = gsm.pmesh.FromPline(pline);
    if (pmesh === undefined) {return false;}
    return true;
}

export function test_pmesh_offset(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pmesh: gs.IPolymesh = gsm.pmesh.FromPoints([[p1, p2, p3]]);
    //gsm.pmesh.offset(pmesh, 0.2);
    //if (pmesh === undefined) {return false;}
    //if (pmesh.numFaces() !== 1) {return false;}
    return true;
}

export function test_pmesh_thicken(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pmesh: gs.IPolymesh = gsm.pmesh.FromPoints([[p1, p2, p3]]);
    //const pmesh_thick: gs.IPolymesh = gsm.pmesh.thicken(pmesh, 0.2, 0.4);
    //if (pmesh_thick === undefined) {return false;}
    //if (pmesh_thick.numFaces() !== 5) {return false;}
    return true;
}

export function test_pmesh_TriStripFromPoints(): boolean {
    const m: gs.IModel = gsm.model.New();
    const list1: gs.IPoint[] = [
        gsm.point.FromXYZ(m, [2,0,0]),
        gsm.point.FromXYZ(m, [5,0,0]),
        gsm.point.FromXYZ(m, [9,0,0])
    ];
    const list2: gs.IPoint[] = [
        gsm.point.FromXYZ(m, [3,3,0]),
        gsm.point.FromXYZ(m, [6,3,0]),
        gsm.point.FromXYZ(m, [8,4,0]),
        gsm.point.FromXYZ(m, [10,4,0]),
        gsm.point.FromXYZ(m, [12,4,0])
    ];
    const pmesh: gs.IPolymesh = gsm.pmesh.TriStripFromPoints(list1, list2);
    if (pmesh === undefined) {return false;}
    if (pmesh.numFaces() !== 6) {return false;}
    return true;
}

export function test_pmesh_explode(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pmesh: gs.IPolymesh = gsm.pmesh.FromPoints([[p1, p2, p3]]);
    const pmesh2: gs.IPolymesh = gsm.pmesh.extrude(pmesh, [0,0,5]);
    const result: gs.IPolymesh[] = gsm.pmesh.explode(pmesh2);
    // console.log(result);
    if (result.length !== 5) {return false;}
    return true;
}
