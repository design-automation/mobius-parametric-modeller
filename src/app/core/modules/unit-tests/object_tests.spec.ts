import * as gs from "gs-json";
import * as threex from "../libs/threex/threex";
import * as gsm from "@modules";
import {} from "jasmine";

describe("Tests for Obj Module", () => {
    it("test_obj_Get", () => {
        expect( test_obj_Get() ).toBe(true);
    });
    it("test_obj_Gets", () => {
        expect( test_obj_Gets() ).toBe(true);
    });
    it("test_obj_groups", () => {
        expect( test_obj_groups() ).toBe(true);
    });
    it("test_obj_move", () => {
        expect( test_obj_move() ).toBe(true);
    });
    it("test_obj_rotate", () => {
        expect( test_obj_rotate() ).toBe(true);
    });
    it("test_obj_xform", () => {
        expect( test_obj_xform() ).toBe(true);
    });
    it("test_obj_mirror", () => {
        expect( test_obj_mirror() ).toBe(true);
    });
    it("test_obj_xformGCS", () => {
        expect( test_obj_xformGCS() ).toBe(true);
    });
});

export function test_obj_Get(): boolean {
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    const x = gsm.pline.FromPoints(points, false);
    const obj: gs.IObj = gsm.object.Get(m, 0);
    if(obj === undefined) {return false;}
    return true;
}

export function test_obj_Gets(): boolean {
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    gsm.pline.FromPoints(points, false);
    gsm.circle.FromOriginXY(points[3], 12, [20,30]);
    const objs: gs.IObj[] = gsm.object.Gets(m, [0, 1]);
    if(objs[0] === undefined) {return false;}
    if(objs[1] === undefined) {return false;}
    return true;
}

export function test_obj_groups(): boolean {
    const m: gs.IModel = gsm.model.New();
    const ok: boolean = gsm.group.Create(m, "test");
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    const pline: gs.IPolyline = gsm.pline.FromPoints(points, false);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(points[1], 5, null);
    gsm.object.addToGroup([pline, circle], "test");
    const objs: gs.IObj[] = gsm.object.GetFromGroup(m, "test");
    if (objs.length !== 2) {return false;}
    gsm.object.removeFromGroup(circle, "test");
    const objs2: gs.IObj[] = gsm.object.GetFromGroup(m, "test");
    if (objs2.length !== 1) {return false;}
    return true;
}

export function test_obj_move(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,1,1]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [2,2,2]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    const circle: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [0, 1, 0], [0, 0, 1], null);
    gsm.object.move(circle, [1,2,3]);
    if (circle.getOrigin().getPosition()[1] !== 3) { return false; }
    return true;
}

export function test_obj_rotate(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,0,1]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [2,2,6]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [4,1,3]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const circle: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [0, 1, 0], [0, 0, 1], null);
    gsm.object.rotate(circle, [0,0,0], [0,0,1], 30, true);
    gsm.object.rotate(pline, [0,0,0], [0,0,1], 60, true);
    if (m.getGeom().numPoints() !== 7) {return false; }
    return true;
}

export function test_obj_xform(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [1,0,0], [0,1,0], null);
    gsm.object.xformGcs2Lcs(circle, [7,8,9], [1,0,0], [0,1,0], true);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [1,1,1]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [2,2,2]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p2, p3], false);
    gsm.object.xformGcs2Lcs(pline, [5,6,7], [1,0,0], [0,1,0], false);
    //if (m.getGeom().numPoints() !== 2) {return false; }
    return true;
}

export function test_obj_mirror(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,0,1]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [2,2,6]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [4,1,3]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const circle: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [0, 1, 0], [0, 0, 1], null);
    gsm.object.mirror([pline, circle], p1, [1,2,3], true);
    if (m.getGeom().numPoints() !== 6) {return false; }
    return true;
}

export function test_obj_xformGCS(): boolean {
    const m: gs.IModel = gsm.model.New();
    const pts: gs.IPoint[] = gsm.point.FromXYZs(m, [[-5,-5,0],[5,-5,0],[5,5,0],[-5,5,0]]);
    const mesh: gs.IPolymesh = gsm.pmesh.FromPoints([pts]);
    gsm.object.rotate(mesh, [0,0,0], [1,1,0], 30, false);
    gsm.object.move(mesh, [10, 10, 10], false);
    const origin1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(origin1, 8, null);
    const points: gs.IPoint[] = gsm.pmesh.getPoints(mesh);
    const origin2: gs.IPoint = gsm.point.FromPointsMean(points);
    const vec1 = threex.vectorFromPointsAtoB(points[0], points[1]);
    const vec2 = threex.vectorFromPointsAtoB(points[0], points[3]);
    gsm.object.xformGcs2Lcs(circle, origin2, vec1.toArray() as gs.XYZ, vec2.toArray() as gs.XYZ, true);
    return true;
}
