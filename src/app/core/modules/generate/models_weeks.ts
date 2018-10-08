import * as gs from "gs-json";
import * as gsm from "../index";
import * as threex from "../libs/threex/threex";

/**
 *
 */
export function genModelWeek3(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const g: gs.IGeom = m.getGeom();
    // function arc3p(a: number, b: number, c:number): gs.ICircle {
    //     const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,a,0] as gs.XYZ);
    //     const p2: gs.IPoint = gsm.point.FromXYZ(m, [0,b,15] as gs.XYZ);
    //     const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,c,30] as gs.XYZ);
    //     return gsm.circle.From3Points(p1, p2, p3, false);
    // }
    function arcyz(a: number, rad: number, flip: boolean): gs.ICircle {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,a,0] as gs.XYZ);
        if (flip) {
            return gsm.circle.FromOriginYZ(p1, rad, [0, 80]);
        } else {
            return gsm.circle.FromOriginYZ(p1, rad, [100, 180]);
        }
    }
    // const arc1: gs.ICircle = arc(0,2,10);
    // const arc2: gs.ICircle = arc(5,6,16);
    // const arc3: gs.ICircle = arc(24,22,17);
    // const arc4: gs.ICircle = arc(35,30,22);
    const arc1: gs.ICircle = arcyz(20,30,false);
    const arc2: gs.ICircle = arcyz(10,30,false);
    const arc3: gs.ICircle = arcyz(-10,30,true);
    const arc4: gs.ICircle = arcyz(-20,30,true);

    for (let i = 0; i < 10; i++) {
        const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,1 + (i*2)] as gs.XYZ);
        const plane: gs.IPlane = gsm.plane.FromOriginXY(o);
        const i1: gs.IPoint = gsm.intersect.circlePlane3D(arc1, plane)[0];
        const i2: gs.IPoint = gsm.intersect.circlePlane3D(arc2, plane)[0];
        const i3: gs.IPoint = gsm.intersect.circlePlane3D(arc3, plane)[0];
        const i4: gs.IPoint = gsm.intersect.circlePlane3D(arc4, plane)[0];
        const c1: gs.IPoint = gsm.point.FromPointsMean([i1, i3]);
        const c2: gs.IPoint = gsm.point.FromPointsMean([i2, i4]);
        const r1: number = gsm.calc.distBetweenPoints(i1, c1);
        const r2: number = gsm.calc.distBetweenPoints(i2, c2);
        const cir1: gs.ICircle = gsm.circle.FromOriginXY(c1, r1, null);
        const cir2: gs.ICircle = gsm.circle.FromOriginXY(c2, r2, null);
        const arcs: gs.ICircle[] = gsm.split.circleCircle2D(cir1, cir2);
        gsm.object.del([arcs[1], arcs[3], plane], false);
        gsm.point.del([i1, i2, i3, i4]);
    }
    gsm.object.del([arc1, arc2, arc3, arc4], false);
    return m;
}

