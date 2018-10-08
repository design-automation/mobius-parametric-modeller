import * as gs from "gs-json";
import * as gsm from "../index";
import {} from "jasmine";

describe("Tests for Intersect Module", () => {
    it("test_intersect_circlePlane3D", () => {
        expect( test_intersect_circlePlane3D() ).toBe(true);
    });
    it("test_intersect_polylinePolyline2D", () => {
        expect( test_intersect_polylinePolyline2D() ).toBe(true);
    });
    it("test_intersect_polylinePolyline2D_v2", () => {
        expect( test_intersect_polylinePolyline2D_v2() ).toBe(true);
    });
    it("test_intersect_polylinePolyline2D_v3", () => {
        expect( test_intersect_polylinePolyline2D_v3() ).toBe(true);
    });
    it("test_intersect_polylinePlane3D", () => {
        expect( test_intersect_polylinePlane3D() ).toBe(true);
    });
    it("test_intersect_polylinePlane3D_v2", () => {
        expect( test_intersect_polylinePlane3D_v2() ).toBe(true);
    });
    it("test_intersect_circlePlane3D_v2", () => {
        expect( test_intersect_circlePlane3D_v2() ).toBe(true);
    });
    it("test_intersect_polylinePlane3D_v3", () => {
        expect( test_intersect_polylinePlane3D_v3() ).toBe(true);
    });
    it("test_intersect_polylinePlane3D_v4", () => {
        expect( test_intersect_polylinePlane3D_v4() ).toBe(true);
    });
});

export function test_intersect_circlePlane3D(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const point2: gs.IPoint = gsm.point.FromXYZ(m, [4,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginYZ(point1, 10, [270, 90]);
    const plane: gs.IPlane = gsm.plane.FromOriginXY(point2);
    const isect_points: gs.IPoint[] = gsm.intersect.circlePlane3D(circle, plane);
    if(isect_points.length !== 1) {return false;}
    return true;
}

export function test_intersect_polylinePolyline2D(): boolean {
    const m: gs.IModel = gsm.model.New();
    const points1: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,0,0],[3,4,0]]);
    const points2: gs.IPoint[] = gsm.point.FromXYZs(m, [[4,0,0],[0,5,0]]);
    const pline1: gs.IPolyline = gsm.pline.FromPoints(points1, false);
    const pline2: gs.IPolyline = gsm.pline.FromPoints(points2, false);
    const isect_points: gs.IPoint[] = gsm.intersect.polylinePolyline2D(pline1, pline2);
    //console.log(isect_points[0].getPosition());
    if(isect_points.length !== 1) {return false;}
    return true;
}

export function test_intersect_polylinePolyline2D_v2(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const c1: gs.ICircle = gsm.circle.FromOriginXY(p1, 5, null);
    const pl1: gs.IPolyline = gsm.pline.FromCircle(c1, 6);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [4.1,0.1,0]);
    const c2: gs.ICircle = gsm.circle.FromOriginXY(p2, 5, null);
    const pl2: gs.IPolyline = gsm.pline.FromCircle(c2, 6);
    const res: gs.IPoint[] = gsm.intersect.polylinePolyline2D(pl1, pl2);
    if (res.length !== 2) {return false;}
    return true;
}

export function test_intersect_polylinePolyline2D_v3(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const c1: gs.ICircle = gsm.circle.FromOriginXY(p1, 5, null);
    const pl1: gs.IPolyline = gsm.pline.FromCircle(c1, 6);
    const pnts: gs.IPoint[] = gsm.point.FromXYZs(m, [[-10,-1,0], [10,1,0]]);
    const pl2: gs.IPolyline = gsm.pline.FromPoints(pnts);
    const res: gs.IPoint[] = gsm.intersect.polylinePolyline2D(pl1, pl2);
    if (res.length !== 2) {return false;}
    return true;
}

export function test_intersect_polylinePlane3D(): boolean {
    //console.log("START v1===============");
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,0,0],[2,2,5],[-1,-2,10],[1.1,2.2,15]]);
    const pline1: gs.IPolyline = gsm.pline.FromPoints(points, false);
    const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,9]);
    const plane: gs.IPlane = gsm.plane.FromOriginXY(o);
    const isect_points: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline1, plane);
    //console.log("num isect = ", isect_points.length);
    if(isect_points.length !== 1) {return false;}
    return true;
}

export function test_intersect_polylinePlane3D_v2(): boolean {
    //console.log("START v2===============");
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    const pline: gs.IPolyline = gsm.pline.FromPoints(points, false);
    const origin: gs.IPoint = gsm.point.FromXYZ(m, [0.5,0.5,0.5]);
    const plane: gs.IPlane = gsm.plane.FromOriginVectors(origin, [1,0,0], [0,1,0]);
    const isect_points: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline, plane);
    //console.log("num isect = ", isect_points.length);
    if(isect_points.length !== 2) {return false;}
    return true;
}

export function test_intersect_circlePlane3D_v2(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(point1, 10, null);
    const plane: gs.IPlane = gsm.plane.FromOriginZX(point1);
    const isect_points: gs.IPoint[] = gsm.intersect.circlePlane3D(circle, plane);
    if(isect_points.length !== 2) {return false;}
    return true;
}

export function test_intersect_polylinePlane3D_v3(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(point1, 20, null);
    const pline: gs.IPolyline = gsm.pline.FromCircle(circle, 100);
    for (let i = 0; i < 22; i++) {
        const point2: gs.IPoint = gsm.point.FromXYZ(m, [0,i,0]);
        const plane: gs.IPlane = gsm.plane.FromOriginZX(point2);
        const isect_points: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline, plane);
        //console.log("Num points = ", isect_points.length);
        //console.log(isect_points.map((p) => p.getPosition()));
        //if(isect_points.length !== 2) {return false;}

    }
    return true;
}

export function test_intersect_polylinePlane3D_v4(): boolean {
    const m: gs.IModel = gsm.model.New();
    const point1a: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const point1b: gs.IPoint = gsm.point.FromXYZ(m, [0,0,10]);
    const pline: gs.IPolyline = gsm.pline.From2Points(point1a, point1b);
    const pline2: gs.IPolyline = gsm.pline.divide(pline, 9);
    for (let i = 0; i <= 10; i++) {
        const point2: gs.IPoint = gsm.point.FromXYZ(m, [0,0,i]);
        const plane: gs.IPlane = gsm.plane.FromOriginXY(point2);
        const isect_points: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline2, plane);
        //console.log("Num points v4 = ", isect_points.length);
        //console.log(isect_points.map((p) => p.getPosition()));
        //if(isect_points.length !== 2) {return false;}

    }
    return true;
}
