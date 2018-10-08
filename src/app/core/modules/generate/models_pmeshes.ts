import * as gs from "gs-json";
import * as gsm from "../index";
import * as threex from "../libs/threex/threex";

export function randXYZ(): gs.XYZ {
    return [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30];
}

export function genModelTest1(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [1,2,3]);
    const c: gs.ICircle = gsm.circle.FromOriginZX(p1, 8, [30,300]);
    const pl: gs.IPolyline = gsm.pline.FromCircle(c, 10);
    pl.setIsClosed(true);
    const pm: gs.IPolymesh = gsm.pmesh.FromPline(pl);
    gsm.pmesh.extrude(pm, [0,1,0]);
    return m;
}

export function genModelTest2(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [1,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [1,1,0]);
    const p4: gs.IPoint = gsm.point.FromXYZ(m, [0,1,0]);
    const p5: gs.IPoint = gsm.point.FromXYZ(m, [-1,-1,0]);
    const p6: gs.IPoint = gsm.point.FromXYZ(m, [2,-1,0]);
    const p7: gs.IPoint = gsm.point.FromXYZ(m, [2,2,0]);
    const p8: gs.IPoint = gsm.point.FromXYZ(m, [-1,2,0]);

    const pm: gs.IPolymesh = gsm.pmesh.FromPoints([
        [p5,p1,p2,p6],
        [p6,p2,p3,p7],
        [p7,p3,p4,p8],
        [p8,p4,p1,p5]
    ]);
    gsm.pmesh.extrude(pm, [0,0,1]);
    return m;
}

export function genTriStrip(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [1,0,0]);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [2,0,0]);
    const p4: gs.IPoint = gsm.point.FromXYZ(m, [3,0,0]);

    const p5: gs.IPoint = gsm.point.FromXYZ(m, [0.8,2,0]);
    const p6: gs.IPoint = gsm.point.FromXYZ(m, [1.3,2,0]);
    const p7: gs.IPoint = gsm.point.FromXYZ(m, [2.1,2,0]);
    const p8: gs.IPoint = gsm.point.FromXYZ(m, [3.9,2,0]);
    const p9: gs.IPoint = gsm.point.FromXYZ(m, [4.5,2,0]);
    const p10: gs.IPoint = gsm.point.FromXYZ(m, [5.1,2,0]);

    const pm: gs.IPolymesh = gsm.pmesh.TriStripFromPoints([p1,p2,p3,p4],[p5,p6,p7,p8,p9,p10]);
    return m;
}
