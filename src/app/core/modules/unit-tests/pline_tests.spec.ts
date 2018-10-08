import * as gs from "gs-json";
import * as gsm from "@modules";
import {} from "jasmine";

describe("Tests for Pline Module", () => {
    it("test_pline_fromPoints", () => {
        expect( test_pline_fromPoints() ).toBe(true);
    });
    it("test_pline_From2Points", () => {
        expect( test_pline_From2Points() ).toBe(true);
    });
    it("test_pline_evalParam", () => {
        expect( test_pline_evalParam() ).toBe(true);
    });
    it("test_pline_join", () => {
        expect( test_pline_join() ).toBe(true);
    });

    it("test_pline_extract", () => {
        expect( test_pline_extract() ).toBe(true);
    });
    it("test_pline_explode", () => {
        expect( test_pline_explode() ).toBe(true);
    });
    it("test_pline_extend", () => {
        expect( test_pline_extend() ).toBe(true);
    });
    it("test_pline_extrude", () => {
        expect( test_pline_extrude() ).toBe(true);
    });
    it("test_pline_FromCircle", () => {
        expect( test_pline_FromCircle() ).toBe(true);
    });
    it("test_pline_loft", () => {
        expect( test_pline_loft() ).toBe(true);
    });
    it("test_pline_divideMaxLength", () => {
        expect( test_pline_divideMaxLength() ).toBe(true);
    });

    it("test_pline_pipe", () => {
        expect( test_pline_pipe() ).toBe(true);
    });

});

export function test_pline_fromPoints(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    if (pline === undefined) {return false;}
    return true;
}

export function test_pline_From2Points(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const pline: gs.IPolyline = gsm.pline.From2Points(p1, p2);
    if (pline === undefined) {return false;}
    return true;
}

export function test_pline_evalParam(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [10,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const pt4: gs.IPoint = gsm.pline.evalParam(pline, 0.5);
    if (pt4 === undefined) {return false;}
    const pt5: gs.IPoint = gsm.pline.evalParam(pline, 0.75);
    if (pt5 === undefined) {return false;}
    const pt6: gs.IPoint = gsm.pline.evalParam(pline, 0);
    if (pt6 === undefined) {return false;}
    const pt7: gs.IPoint = gsm.pline.evalParam(pline, 1);
    if (pt7 === undefined) {return false;}
    return true;
}

export function test_pline_join(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const p4: gs.IPoint = gsm.point.FromXYZ(m, [1,5,9]);
    const p5: gs.IPoint = gsm.point.FromXYZ(m, [12,5,33]);
    //another test
    const aaa: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const bbb: gs.IPolyline = gsm.pline.FromPoints([p3, p4, p5, p1], false);
    const result: gs.IPolyline[] = gsm.pline.join([aaa, bbb]);
    if (result.length !== 1) {return false;}
    if (m.getGeom().numObjs() !== 1) {return false;}
    //some more random lines
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], true);
    const plines: gs.IPolyline[] = gsm.pline.extract(pline, [0,1,2]);
    const more: gs.IPolyline = gsm.pline.FromPoints([p2, p5, p4], true);
    const more2: gs.IPolyline = gsm.pline.FromPoints([p2, p3, p5, p1], true);
    const more3: gs.IPolyline = gsm.pline.FromPoints([p3, p1], true);
    const new_plines: gs.IPolyline[] = gsm.pline.join([...plines, more, more2, more3]);
    return true;
}

export function test_pline_extract(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], true);
    const plines: gs.IPolyline[] = gsm.pline.extract(pline, [0,1,2]);
    if (plines.length !== 3) {return false;}
    return true;
}

export function test_pline_explode(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const plines: gs.IPolyline[] = gsm.pline.explode(pline);
    if (plines.length !== 2) {return false;}
    const pline2: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], true);
    const plines2: gs.IPolyline[] = gsm.pline.explode(pline2);
    if (plines2.length !== 3) {return false;}
    return true;
}

export function test_pline_extend(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    //gsm.pline.extend(pline, 0, 5, true); // create points and copy
    //gsm.pline.extend(pline, 1, 7, false); // dont create points, dont copy
    return true;
}

export function test_pline_extrude(): boolean {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const pline: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const mesh: gs.IPolymesh = gsm.pline.extrude(pline, [1,2,3], false);
    const mesh2: gs.IPolymesh = gsm.pline.extrude(pline, [5,0,0], false);
    return true;
}
export function test_pline_FromCircle(): boolean {

    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();

    // London City Hall
    const pt1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const pt2: gs.IPoint = gsm.point.FromXYZ(m, [5,0,0]);
    const circle1: gs.ICircle = gsm.circle.FromOrigin2Vectors(pt1, [6,0,0],[0,6,0],[0,360]);
    const circle2: gs.ICircle = gsm.circle.FromOrigin2Vectors(pt2, [2,0,0],[0,2,0],[0,360]);
    const split: gs.ICircle[] = gsm.split.circleCircle2D(circle1,circle2);
    const pline1: gs.IPoint[] = gsm.pline.FromCircle(split[0],20).getPoints()[0][0];

    const pline2: gs.IPoint[] = gsm.pline.FromCircle(split[0],10).getPoints()[0][0];
    for( const pli1 of pline1) {
        pli1.getPosition();
    }
    for( const pli2 of pline2) {
        pli2.getPosition();
    }
    // Circle 1, Radius 1
    const pt3: gs.IPoint = gsm.point.FromXYZ(m, [-0.5,0,0]);
    const pt4: gs.IPoint = gsm.point.FromXYZ(m, [0.5,0,0]);
    const circle3: gs.ICircle = gsm.circle.FromOrigin2Vectors(pt3, [1,0,0],[0,1,0],[0,360]);
    const circle4: gs.ICircle = gsm.circle.FromOrigin2Vectors(pt4, [1,0,0],[0,1,0],[0,360]);
    const split3: gs.ICircle[] = gsm.split.circleCircle2D(circle3,circle4);
    const pline3: gs.IPoint[] = gsm.pline.FromCircle(split3[0],20).getPoints()[0][0];
    const pline4: gs.IPolyline = gsm.pline.FromCircle(split3[0],10);
    return true;
}

export function test_pline_loft(): boolean {

    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();

    const pt1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const pt2: gs.IPoint = gsm.point.FromXYZ(m, [5,0,0]);
    const circle1: gs.ICircle = gsm.circle.FromOrigin2Vectors(pt1, [6,0,0],[0,1,0],[350, 90]);
    const circle2: gs.ICircle = gsm.circle.FromOrigin2Vectors(pt2, [2,0,0],[0,1,0],[340, 80]);
    const pline1: gs.IPolyline = gsm.pline.FromCircle(circle1, 10);
    const pline2: gs.IPolyline = gsm.pline.FromCircle(circle2, 10);
    const mesh: gs.IPolymesh = gsm.pline.loft([pline1, pline2], false);
    if (mesh.numFaces() !== 10) {return false;}

    return true;
}

export function test_pline_divideMaxLength(): boolean {
    const m: gs.IModel = new gs.Model();
    {
        const pt1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
        const pt2: gs.IPoint = gsm.point.FromXYZ(m, [5,0,0]);
        const pline: gs.IPolyline = gsm.pline.FromPoints([pt1, pt2]);
        gsm.pline.divide(pline, 10);
        //console.log(m.getGeom().numPoints());
        if (m.getGeom().numPoints() !== 11) {return false;}
    }
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,0]);
        const p3: gs.IPoint = gsm.point.FromXYZ(m, [10,10,0]);
        // divide uneven
        let pline0: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
        pline0 = gsm.pline.divide(pline0, [2,3]);
        if (pline0.numVertices() !== 6) {return false;}
        // two edges
        let pline1: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
        pline1 = gsm.pline.divideMaxLength(pline1, 2.1);
        if (pline1.numVertices() !== 11) {return false;}
        // three edges
        let pline2: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], true);
        pline2 = gsm.pline.divideMaxLength(pline2, 2.1);
        if (pline2.numVertices() !== 17) {return false;}
        // three edges
        let pline3: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], true);
        pline3 = gsm.pline.divideMaxLength(pline3, [2.1, 2.1, 8]);
        if (pline3.numVertices() !== 12) {return false;}
    }
    return true;
}

export function test_pline_pipe(): boolean {

    const m: gs.IModel = new gs.Model();
    const pt1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(pt1, 9, null);
    const pline: gs.IPolyline = gsm.pline.FromCircle(circle, 3);
    const pipe: gs.IPolymesh = gsm.pline.pipe(pline, 2, 12);

    return true;
}

