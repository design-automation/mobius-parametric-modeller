import * as gs from "gs-json";
import * as gsm from "../index";
import * as threex from "../libs/threex/threex";

export function genModelTest1(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [10,10,0]);
    const c: gs.ICircle = gsm.circle.FromOriginXY(p1, 8, [0,180]);
    const pl: gs.IPolyline = gsm.pline.FromCircle(c, 4);
    let points: gs.IPoint[] = gsm.point.GetFromObjs(pl);
    for (let i = 0; i < 30; i++) {
        points = gsm.point.move(points, [0,0,1], true) as gs.IPoint[];
        points = gsm.point.rotate(points, [10,10,0], [0,0,1], 5, false) as gs.IPoint[];
        points = gsm.point.scale(points, [10,10,0], [0.9,0.9,1], false) as gs.IPoint[];
    }
    return m;
}
