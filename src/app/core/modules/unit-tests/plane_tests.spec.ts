import * as gs from "gs-json";
import * as gsm from "@modules";
import {} from "jasmine";

describe("Tests for Plane Module", () => {
    it("test_plane_FromOriginVectors", () => {
        expect(test_plane_FromOriginVectors()).toBe(true);
    });
    it("test_plane_FromOriginPoints", () => {
        expect(test_plane_FromOriginPoints()).toBe(true);
    });
    it("test_plane_FromOriginWCS", () => {
        expect(test_plane_FromOriginXY()).toBe(true);
    });
});


export function test_plane_FromOriginVectors(): boolean {
    const m: gs.IModel = new gs.Model();
    const origin: gs.IPoint = m.getGeom().addPoint([1,2,3]);
    const vec_x: gs.XYZ = [0, 0, 1];
    const vec_y: gs.XYZ = [1, 0, 0];
    const plane: gs.IPlane = gsm.plane.FromOriginVectors(origin, vec_x, vec_y);
    if (plane === undefined) {return false;}
    return true;
}

export function test_plane_FromOriginPoints(): boolean {
    const m: gs.IModel = new gs.Model();
    const origin: gs.IPoint = m.getGeom().addPoint([1,2,3]);
    const point_on_x: gs.IPoint = m.getGeom().addPoint([0,1,0]);
    const point_on_y: gs.IPoint = m.getGeom().addPoint([1,0,0]);
    const plane: gs.IPlane = gsm.plane.FromOriginPoints(origin, point_on_x, point_on_y);
    if (plane === undefined) {return false;}
    return true;
}

export function test_plane_FromOriginXY(): boolean {
    const m: gs.IModel = new gs.Model();
    const origin: gs.IPoint = m.getGeom().addPoint([1,2,3]);
    const plane: gs.IPlane = gsm.plane.FromOriginXY(origin);
    if (plane === undefined) {return false;}
    return true;
}
