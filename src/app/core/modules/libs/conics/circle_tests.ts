import * as gs from "gs-json";
import * as test from "./circles";
import * as kld from "kld-intersections";
import * as three from "three";

import {} from "jasmine";

describe("Tests for Math Conic Dev", () => {
    it("test_isectCircleCircle2D", () => {
        expect(test_isectCircleCircle2D()).toBe(true);
    });
    it("test_isectCirclePlane3D", () => {
        expect(test_isectCirclePlane3D()).toBe(true);
    });
});

export function test_isectCircleCircle2D() {
    // TOOO
    return true;
}
export function test_isectCirclePlane3D() {
    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();
    const plane_point: gs.IPoint = g.addPoint([3,0,0]);
    const plane: gs.IPlane = g.addPlane(plane_point, [0,1,0], [0,0,1]);
    const circle_point: gs.IPoint = g.addPoint([10.2,2.8,-12.7]);
    const circle: gs.ICircle = g.addCircle(circle_point, [8.376648782031275,-12.411067032321805,0.2706372332304663], [9.437161624911786,6.578546831064237,9.588471007782674], [0,267.88189588962683]);
    // const results: gs.IPoint[] = test._isectCirclePlane3D(circle, plane);
    const radius: number = circle.getRadius();
    const Vect_X: three.Vector3 = new three.Vector3(8.376648782031275,-12.411067032321805,0.2706372332304663).normalize();

    return true;
}
