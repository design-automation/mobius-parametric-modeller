import * as gs from "gs-json";
import * as gsm from "../index";
import * as threex from "../libs/threex/threex";

function randXYZ(scale: number): gs.XYZ {
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
    for (let i = 0; i < 2; i++) {
        gsm.object.move(pl, randXYZ(10), true);
    }
    return m;
}

export function genModelTest2(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [10,10,0]);
    const c: gs.ICircle = gsm.circle.FromOriginXY(p1, 8, [0,180]);
    let pl: gs.IPolyline = gsm.pline.FromCircle(c, 4);
    for (let i = 0; i < 30; i++) {
        pl = gsm.object.move(pl, [0,0,1], true) as gs.IPolyline;
        pl = gsm.object.rotate(pl, [10,10,0], [0,0,1], 5, false) as gs.IPolyline;
        pl = gsm.object.scale(pl, [10,10,0], [0.9,0.9,1], false) as gs.IPolyline;
    }
    return m;
}

export function genModelTest3(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [10,10,0]);
    const c1: gs.ICircle = gsm.circle.FromOriginXY(p1, 5, null);
    const c2: gs.ICircle = gsm.object.mirror(c1, [0,0,0], [1,0,0], true) as gs.Circle;
    return m;
}

export function genModelTest4(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const pts: gs.IPoint[] = gsm.point.FromXYZs(m, [[-5,-5,0],[5,-5,0],[5,5,0],[-5,5,0]]);
    const mesh: gs.IPolymesh = gsm.pmesh.FromPoints([pts]);
    gsm.object.rotate(mesh, [0,0,0], [1,1,0], 30, false);
    gsm.object.move(mesh, [10, 10, 10], false);
    const origin1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginXY(origin1, 8, null);
    const points: gs.IPoint[] = gsm.pmesh.getPoints(mesh);
    const origin2: gs.IPoint = gsm.point.FromPointsMean(points);
    const vec1 = threex.vectorFromPointsAtoB(points[1], points[0]);
    const vec2 = threex.vectorFromPointsAtoB(points[1], points[2]);
    gsm.object.xformGcs2Lcs(circle, origin2, vec1.toArray() as gs.XYZ, vec2.toArray() as gs.XYZ, true);
    return m;
}
