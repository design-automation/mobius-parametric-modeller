import * as gs from "gs-json";
import * as gsm from "../index";
import {} from "jasmine";

describe("Tests for Pline Module", () => {
    it("test_circle_FromOriginVectors", () => {
        expect( test_circle_FromOriginVectors() ).toBe(true);
    });
    it("test_circle_From3Points", () => {
        expect( test_circle_From3Points() ).toBe(true);
    });
    it("test_circle_ArcFrom3Points", () => {
        expect( test_circle_ArcFrom3Points() ).toBe(true);
    });
    it("test_circle_testToJson", () => {
        expect( test_circle_testToJson() ).toBe(true);
    });
    it("test_circle_tangentPlinesInner2D", () => {
        expect( test_circle_tangentPlinesInner2D() ).toBe(true);
    });
});

export function test_circle_FromOriginVectors(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0, 0, 0]);
    const circle: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [0, 1, 0], [0, 0, 1], null);
    if (circle === undefined) { return false; }
    return true;
}

export function test_circle_From3Points(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0, 0, 0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [4, 10, 7]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [2, 1, -3]);
    const circle: gs.ICircle = gsm.circle.From3Points(p1, p2, p3, false);
    if (circle === undefined) { return false; }
    return true;
}

export function test_circle_ArcFrom3Points(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0, 0, 0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10, 0.5, 0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0, 1, 0]);
    const arc: gs.ICircle = gsm.circle.From3Points(p1, p2, p3, true);
    if (arc === undefined) { return false; }
    const p4: gs.IPoint = gsm.point.FromXYZ(m, [10, 0, 10]);
    const arc2: gs.ICircle = gsm.circle.From3Points(p1, p2, p4, true);
    if (arc2 === undefined) { return false; }
    return true;
}

export function test_circle_testToJson(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1, 0, 0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [2, 0, 0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3, 0, 0]);
    gsm.point.del([p2, p3]);
    const p4: gs.IPoint = gsm.point.FromXYZ(m, [4, 0, 0]);
    const circle: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [0, 1, 0], [0, 0, 1], null);
    const result: string = m.toJSON();
    if (!circle.isClosed() ) { return false;}
    //console.log(result);

    return true;
}

export function test_circle_tangentPlinesInner2D(): boolean {
    const m: gs.IModel = gsm.model.New();
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [-10.234, 0, 8]);
        const circle1: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [1, 0, 2], [-3, 0, 3], null);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [11, 0, -2.345]);
        const circle2: gs.ICircle = gsm.circle.FromOrigin2Vectors(p2, [2, 0, 7], [-1, 0, 1], null);
        const plines: gs.IPolyline[] = gsm.circle.tangentPlinesInner2D(circle1, circle2);
        if (plines === null) {return false;}
        if (plines[1] === undefined) {return false;}
    }
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
        const circle1: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [1, 0, 0], [0, 1, 0], null);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
        const circle2: gs.ICircle = gsm.circle.FromOrigin2Vectors(p2, [3, 0, 0], [0, 1, 0], null);
        const plines: gs.IPolyline[] = gsm.circle.tangentPlinesInner2D(circle1, circle2);
        if (plines === null) {return false;}
        if (plines[1] === undefined) {return false;}
    }
    return true;
}
