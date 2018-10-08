import * as gs from "gs-json";
import * as gsm from "@modules";
import {} from "jasmine";

describe("Tests for Model Module", () => {
    it("test_model_New", () => {
        expect( test_model_New() ).toBe(true);
    });
    it("test_model_Load", () => {
        expect( test_model_FromData() ).toBe(true);
    });
    it("test_model_Save", () => {
        expect( test_model_Save() ).toBe(true);
    });
    it("test_model_merge", () => {
        expect( test_model_merge() ).toBe(true);
    });
});


export function test_model_New(): boolean {
    const m: gs.IModel = gsm.model.New();
    if (m === undefined) {return false;}
    return true;
}

export function test_model_FromData(): boolean {
    const m: gs.IModel = gsm.model.New();
    if (m === undefined) {return false;}
    gsm.point.FromXYZs(m, [[1,2,3],[2,3,4],[3,4,5]]);
    // const data: string = m.toJSON();
    // const m2: gs.IModel = gsm.model.FromData(data);
    // if (m2 === undefined) {return false;}
    // if (m2.getGeom().numPoints() !== 3) {return false;}
    return true;
}

export function test_model_Save(): boolean {
    const m: gs.IModel = gsm.model.New();
    if (m === undefined) {return false;}
    gsm.point.FromXYZs(m, [[1,2,3],[2,3,4],[3,4,5]]);
    //gsm.model.save(m, "file.json"); // diable to avoid model being downloaded every time
    return true;
}

export function test_model_merge(): boolean {
    const m1: gs.IModel = gsm.model.New();
    gsm.point.FromXYZs(m1, [[1,2,3],[2,3,4],[3,4,5]]);
    gsm.circle.FromOriginXY(gsm.point.FromXYZ(m1, [0,0,0]), 8, [300,100]);

    const m2: gs.IModel = gsm.model.New();
    gsm.point.FromXYZs(m2, [[1,2,3],[2,3,5],[3,4,6]]);
    gsm.circle.FromOriginXY(gsm.point.FromXYZ(m1, [0,0,7]), 8, [300,100]);

    gsm.model.merge(m1, m2);
    if (m1.getGeom().numPoints() !== 8) {return false;}
    if (m1.getGeom().numObjs() !== 2) {return false;}

    return true;
}
