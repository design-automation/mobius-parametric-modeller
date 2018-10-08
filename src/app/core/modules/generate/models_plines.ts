import * as gs from "gs-json";
import * as gsm from "../index";
import * as threex from "../libs/threex/threex";

export function randXYZ(scale: number): gs.XYZ {
    return [
        (Math.random() - 0.5) * scale,
        (Math.random() - 0.5) * scale,
        (Math.random() - 0.5) * scale];
}

export function genModelTest1(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,2,3]);
    const c: gs.ICircle = gsm.circle.FromOriginZX(p1, 8, [30,300]);
    const pl: gs.IPolyline = gsm.pline.FromCircle(c, 10);
    return m;
}

export function genModelTest2(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,2,3]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [6,5,4]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    const c: gs.ICircle = gsm.circle.FromOriginXY(p1, 8, [300,45]);
    const pl: gs.IPolyline = gsm.pline.FromCircle(c, 10);
    const pm: gs.IPolymesh = gsm.pline.extrude(pl, [4,5,6], false);
    return m;
}

export function genModelTest3(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [12,5,12]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    const pl: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], true);
    for (let i = 0; i < 10; i++) {
        const p10: gs.IPoint = gsm.pline.evalParam(pl, i/9);
        const xyz: gs.XYZ = gsm.point.getXYZ(p10);
        const p20: gs.IPoint = gsm.point.FromXYZ(m, [xyz[0], xyz[1], xyz[2]+1]);
        const pl2: gs.IPolyline = gsm.pline.From2Points(p10, p20);
    }
    return m;
}

export function genModelTest4(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [12,5,12]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    const pl1: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    const pl2: gs.IPolyline = gsm.pline.FromPoints([p3, p1], false);
    const joined_plines: gs.IPolyline[] = gsm.pline.join([pl1, pl2]);
    const pm: gs.IPolymesh = gsm.pmesh.FromPline(joined_plines[0]);
    return m;
}

export function genModelTest5(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,2,3]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [6,5,4]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    const c: gs.ICircle = gsm.circle.FromOriginXY(p1, 8, [300,45]);
    const pl: gs.IPolyline = gsm.pline.FromCircle(c, 100);
    gsm.pline.extrude(pl, randXYZ(1), false);
    // const exploded: gs.IPolyline[] = gsm.pline.explode(pl);
    // for (const pline of exploded) {
    //     gsm.pline.extrude(pline, randXYZ(2), false);
    // }
    return m;
}

export function genModelTest6(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,2,3]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [6,5,4]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [3,3,3]);
    const pl: gs.IPolyline = gsm.pline.FromPoints([p1, p2, p3], false);
    for (let i = 0; i < 10; i++) {
        //gsm.pline.extend(pl, 2, 2.2);
    }
    return m;
}

export function genModelTest7(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,10,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [0,20,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,30,0]);
    const p4: gs.IPoint = gsm.point.FromXYZ(m, [0,40,0]);
    const c1: gs.ICircle = gsm.circle.FromOriginZX(p1, 12, [300,45]);
    const c2: gs.ICircle = gsm.circle.FromOriginZX(p2, 2,  [200,45]);
    const c3: gs.ICircle = gsm.circle.FromOriginZX(p3, 14, [250,45]);
    const c4: gs.ICircle = gsm.circle.FromOriginZX(p4, 8,  [270,45]);
    const pl1: gs.IPolyline = gsm.pline.FromCircle(c1, 10);
    const pl2: gs.IPolyline = gsm.pline.FromCircle(c2, 10);
    const pl3: gs.IPolyline = gsm.pline.FromCircle(c3, 10);
    const pl4: gs.IPolyline = gsm.pline.FromCircle(c4, 10);
    gsm.pline.loft([pl1, pl2, pl3, pl4], false);
    return m;
}

export function genModelTest8(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,0,0],[2,2,0],[-1,-2,0],[1.1,2.2,0]]);
    const pline1: gs.IPolyline = gsm.pline.FromPoints(points, false);
    const pline2: gs.IPolyline = gsm.object.move(pline1, [1,0,0], true) as gs.IPolyline;
    gsm.object.rotate([pline1, pline2], [5,2,0], [1,1,0], 30, false);
    const isect_points: gs.IPoint[] = gsm.intersect.polylinePolyline2D(pline1, pline2);
    return m;
}

export function genModelTest9(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const points1: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,0,0],[2,2,0],[4,0,0]]);
    const pline1: gs.IPolyline = gsm.pline.FromPoints(points1, false);
    const points2: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,1,0],[4,1,0]]);
    const pline2: gs.IPolyline = gsm.pline.FromPoints(points2, false);
    const result: gs.IPolyline[][] = gsm.split.polylinePolyline2D(pline1, pline2);
    return m;
}

export function genModelTest10(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const points1: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,0,0],[2,2,0],[4,0,0]]);
    const pline1: gs.IPolyline = gsm.pline.FromPoints(points1, false);
    gsm.pline.divide(pline1, [6,2]);
    const points2: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,1,0],[4,1,0]]);
    const pline2: gs.IPolyline = gsm.pline.FromPoints(points2, false);
    gsm.pline.divideMaxLength(pline2, 0.234);
    gsm.object.del([pline1, pline2]);
    return m;
}

export function genModelTest11(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const c1: gs.ICircle = gsm.circle.FromOriginXY(p1, 5, null);
    const pl1: gs.IPolyline = gsm.pline.FromCircle(c1, 6);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [4.1,0.1,0]);
    const c2: gs.ICircle = gsm.circle.FromOriginXY(p2, 5, null);
    const pl2: gs.IPolyline = gsm.pline.FromCircle(c2, 6);
    const res: gs.IPoint[] = gsm.intersect.polylinePolyline2D(pl1, pl2);
    return m;
}

export function genModelTest12(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const points: gs.IPoint[] = gsm.point.FromXYZs(m, [[0,0,0],[2,2,5],[-1,-2,10],[1.1,2.2,15]]);
    const pline1: gs.IPolyline = gsm.pline.FromPoints(points, false);
    const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,9]);
    const plane: gs.IPlane = gsm.plane.FromOriginXY(o);
    const isect_points: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline1, plane);

    const o2: gs.IPoint = gsm.point.FromXYZ(m, [0,0,12]);
    const plane2: gs.IPlane = gsm.plane.FromOriginXY(o2);
    const isect_points2: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline1, plane2);

    const o3: gs.IPoint = gsm.point.FromXYZ(m, [0,0,16]);
    const plane3: gs.IPlane = gsm.plane.FromOriginXY(o3);
    const isect_points3: gs.IPoint[] = gsm.intersect.polylinePlane3D(pline1, plane3);
    return m;
}

export function genModelTest13(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const c1: gs.ICircle = gsm.circle.FromOriginXY(p1, 5, null);
    const pl1: gs.IPolyline = gsm.pline.FromCircle(c1, 12);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [4.1,0.1,0]);
    const c2: gs.ICircle = gsm.circle.FromOriginXY(p2, 5, null);
    const pl2: gs.IPolyline = gsm.pline.FromCircle(c2, 12);
    const res: gs.IPolyline[][] = gsm.split.polylinePolyline2D(pl1, pl2);
    return m;
}

export function genModelTest14(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    const pt1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(pt1, 9, null);
    const pline: gs.IPolyline = gsm.pline.FromCircle(circle, 24);
    const pt2: gs.IPoint = gsm.point.FromXYZ(m, [5,0,0]);
    const plane: gs.IPlane = gsm.plane.FromOriginYZ(pt2);
    const split_plines: gs.IPolyline[] = gsm.split.polylinePlane3D(pline, plane);
    //gsm.object.move(split_plines[0], [1,0,0]);
    //gsm.object.move(split_plines[1], [-1,0,0]);
    return m;
}

export function genModelTest15(): gs.IModel {
    const m: gs.IModel = new gs.Model();
    {
        const pt1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
        const circle: gs.ICircle = gsm.circle.FromOriginXY(pt1, 9, null);
        const pline: gs.IPolyline = gsm.pline.FromCircle(circle, 3);
        const pipe: gs.IPolymesh = gsm.pline.pipe(pline, 2, 4);
    }
    {
        const pt1: gs.IPoint = gsm.point.FromXYZ(m, [20,0,0]);
        const pt2: gs.IPoint = gsm.point.FromXYZ(m, [20,0,20]);
        const pline: gs.IPolyline = gsm.pline.FromPoints([pt1, pt2], false);
        const pipe: gs.IPolymesh = gsm.pline.pipe(pline, 3, 7);
    }
    {
        const pt1: gs.IPoint = gsm.point.FromXYZ(m, [30,0,0]);
        const pt2: gs.IPoint = gsm.point.FromXYZ(m, [30,0,20]);
        const pline: gs.IPolyline = gsm.pline.FromPoints([pt1, pt2], false);
        const pline2: gs.IPolyline = gsm.pline.divide(pline, 5);
        const pipe: gs.IPolymesh = gsm.pline.pipe(pline2, 3, 7);
    }
    {
        const pt1: gs.IPoint = gsm.point.FromXYZ(m, [50,0,0]);
        const circle: gs.ICircle = gsm.circle.FromOriginZX(pt1, 9, [200, 80]);
        const pline: gs.IPolyline = gsm.pline.FromCircle(circle, 12);
        const pipe: gs.IPolymesh = gsm.pline.pipe(pline, 2, 4);
    }
    {
        const pt1: gs.IPoint = gsm.point.FromXYZ(m, [70,0,0]);
        const circle: gs.ICircle = gsm.circle.FromOriginYZ(pt1, 9, [300, 150]);
        const pline: gs.IPolyline = gsm.pline.FromCircle(circle, 12);
        const pipe: gs.IPolymesh = gsm.pline.pipe(pline, 2, 4);
    }
    return m;
}
