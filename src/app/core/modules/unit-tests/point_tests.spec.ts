import * as gs from "gs-json";
import * as gsm from "@modules";
import {} from "jasmine";

describe("Tests for Point Module", () => {
    it("test_point_FromXYZ", () => {
        expect( test_point_FromXYZ() ).toBe(true);
    });
    it("test_point_FromXYZs", () => {
        expect( test_point_FromXYZs() ).toBe(true);
    });
    it("test_point_Get", () => {
        expect( test_point_Get() ).toBe(true);
    });
    it("test_point_Gets", () => {
        expect( test_point_Gets() ).toBe(true);
    });
    it("test_point_groups", () => {
        expect( test_point_groups() ).toBe(true);
    });
    it("test_point_move", () => {
        expect( test_point_move() ).toBe(true);
    });
});

export function test_point_FromXYZ(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point: gs.IPoint = gsm.point.FromXYZ(m, [1,2,3]) as gs.IPoint;
    if (point === undefined) {return false;}
    return true;
}

export function test_point_FromXYZs(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    if (point === undefined) {return false;}
    return true;
}

export function test_point_Get(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    if (gsm.point.Get(m, 2).getPosition()[0] !== -1) {return false;}
    return true;
}

export function test_point_Gets(): boolean {
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    const result: gs.IPoint[] = gsm.point.Gets(m, [1,2,3]);
    if (result.length !== 3) {return false;}
    if (result[0].getPosition()[0] !== 2) {return false;}
    return true;
}

export function test_point_groups(): boolean {
    const m: gs.IModel = gsm.model.New();
    const ok: boolean = gsm.group.Create(m, "test");
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    gsm.point.addToGroup([points[0], points[2]], "test");
    const points2: gs.IPoint[] = gsm.point.GetFromGroup(m, "test");
    if (points2.length !== 2) {return false;}
    gsm.point.removeFromGroup(points[2], "test");
    const points3: gs.IPoint[] = gsm.point.GetFromGroup(m, "test");
    if (points3.length !== 1) {return false;}
    return true;
}

export function test_point_move(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,1,1]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [2,2,2]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    gsm.point.move([p2,p3], [1,2,3], false);
    if (m.getGeom().numPoints() !== 3) {return false;}
    if (gsm.point.getXYZ(p2)[2] !== 5) {return false;}
    return true;
}
