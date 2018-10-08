import * as gs from "gs-json";
import * as gsm from "../index";
import * as threex from "../libs/threex/threex";
import * as cir from "../circle_dev"; //TODO

export function randXYZ(): gs.XYZ {
    return [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100];
}

/**
 *
 */
export function genModelTest1(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const plane: gs.IPlane = gsm.plane.FromOriginYZ(gsm.point.FromXYZ(m, [3,0,0]));
    for (let i = 0; i < 10; i++) {
        const points: gs.IPoint[] = gsm.point.FromXYZs(m, [
            randXYZ(),
            randXYZ(),
            randXYZ(),
        ]);

        const arc = cir.From3Points(points[0], points[1], points[2], false);
        const pline: gs.IPolyline = gsm.pline.FromPoints(points, false);
        gsm.intersect.circlePlane3D(arc, plane);

    }
    return m;
}

/**
 *
 */
export function genModelTest1b(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const plane: gs.IPlane = gsm.plane.FromOriginYZ(gsm.point.FromXYZ(m, [3,0,0]));
    const the_points: gs.IPoint[] = [];
    let points: gs.IPoint[] = null;
    for (let i = 0; i < 80; i++) {
        const origin: gs.IPoint = gsm.point.FromXYZ(m, randXYZ());
        const arc = gsm.circle.FromOrigin2Vectors(origin, randXYZ(), randXYZ(),
            [Math.random()*360, Math.random()*360]);
        points =gsm.intersect.circlePlane3D(arc, plane);
        if (points[0] !== undefined) {the_points.push(points[0]);}
        if (points[1] !== undefined) {the_points.push(points[1]);}
    }
    if (the_points !== null) {const pline: gs.IPolyline = gsm.pline.FromPoints(the_points, false);}

    return m;
}

/**
 *
 */
export function genModelTest1c(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    // test1
    const circle1: gs.ICircle = gsm.circle.FromOriginYZ(gsm.point.FromXYZ(m, [-2,8,0]), 9, [270, 250]);
    const circle2: gs.ICircle = gsm.circle.FromOriginYZ(gsm.point.FromXYZ(m, [2,8,0]), 9, [270, 90]);
    const circle3: gs.ICircle = gsm.circle.FromOriginZX(gsm.point.FromXYZ(m, [8,2,0]), 9, [30, 230]);
    const circle4: gs.ICircle = gsm.object.mirror(circle3, [8,2.5,0], [0,1,0], true ) as gs.ICircle;

    const plane1: gs.IPlane = gsm.plane.FromOriginXY(gsm.point.FromXYZ(m, [0,0,2]));
    const plane2: gs.IPlane = gsm.plane.FromOriginXY(gsm.point.FromXYZ(m, [0,0,4]));
    const plane3: gs.IPlane = gsm.plane.FromOriginXY(gsm.point.FromXYZ(m, [0,0,6]));


    // isect
    gsm.intersect.circlePlane3D(circle1, plane1);
    gsm.intersect.circlePlane3D(circle1, plane2);
    gsm.intersect.circlePlane3D(circle1, plane3);

    gsm.intersect.circlePlane3D(circle2, plane1);
    gsm.intersect.circlePlane3D(circle2, plane2);
    gsm.intersect.circlePlane3D(circle2, plane3);

    gsm.intersect.circlePlane3D(circle3, plane1);
    gsm.intersect.circlePlane3D(circle3, plane2);
    gsm.intersect.circlePlane3D(circle3, plane3);

    gsm.intersect.circlePlane3D(circle4, plane1);
    gsm.intersect.circlePlane3D(circle4, plane2);
    gsm.intersect.circlePlane3D(circle4, plane3);

    return m;
}

export function genModelTest1d(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    // test1
    const point1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const point2: gs.IPoint = gsm.point.FromXYZ(m, [4,0,0]);
    const circle: gs.ICircle = gsm.circle.FromOriginYZ(point1, 10, [270, 90]);
    const plane: gs.IPlane = gsm.plane.FromOriginXY(point2);
    const isect_points: gs.IPoint[] = gsm.intersect.circlePlane3D(circle, plane);

    return m;
}
/**
 *
 */
export function genModelTest2(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    // for (let i = 0; i < 5; i++) {
    //     const points: gs.IPoint[] = gsm.point.FromXYZs(m, [
    //         randPt(),
    //         randPt(),
    //         randPt(),
    //     ]);
    //     const arc = gsm.circle.FromOrigin2Points(points[1], points[0], points[2], true);
    //     const pline: gs.IPolyline = gsm.pline.FromPoints(points, false);
    // }

    const p0: gs.IPoint = gsm.point.FromXYZ(m, [0,0,-10] as gs.XYZ);
    const arc0 = gsm.circle.FromOrigin2Vectors(p0, [10,0,0], [0,10,0], null);

    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0] as gs.XYZ);
    const arc1 = gsm.circle.FromOrigin2Vectors(p1, [10,0,0], [0,10,0], [0,315]);

    const pa: gs.IPoint = gsm.point.FromXYZ(m, [0,0,10] as gs.XYZ);
    const pb: gs.IPoint = gsm.point.FromXYZ(m, [10,0,10] as gs.XYZ);
    const pc: gs.IPoint = gsm.point.FromXYZ(m, [10,10,10] as gs.XYZ);
    const arc2 = gsm.circle.FromOrigin2Points(pa, pb, pc, [0,315]);

    const p10: gs.IPoint = gsm.point.FromXYZ(m, [0,0,20] as gs.XYZ);
    const arc3 = gsm.circle.FromOriginXY(p10, 10, [0,315]);
    //const pline: gs.IPolyline = gsm.pline.FromPoints([p2, p1, p3], false);

    const p100: gs.IPoint = gsm.point.FromXYZ(m, [10,0,30] as gs.XYZ);
    const p200: gs.IPoint = gsm.point.FromXYZ(m, [-10,0,30] as gs.XYZ);
    const p300: gs.IPoint = gsm.point.FromXYZ(m, [0,-10,30] as gs.XYZ);
    //const arc4 = gsm.circle.From3Points(p100, p200, p300, false);

    const plane: gs.IPlane = gsm.plane.FromOriginYZ(gsm.point.FromXYZ(m, [3,0,0]));
    gsm.intersect.circlePlane3D(arc0, plane);
    gsm.intersect.circlePlane3D(arc1, plane);
    gsm.intersect.circlePlane3D(arc2, plane);
    gsm.intersect.circlePlane3D(arc3, plane);
    //gsm.intersect.circlePlane3D(arc4, plane);

    return m;
}

/**
 *
 */
export function genModelTest3(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0] as gs.XYZ);
        const cir1 = gsm.circle.FromOriginXY(p1, 10, null);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [5,0,0] as gs.XYZ);
        const cir2 = gsm.circle.FromOriginXY(p2, 10, null);
        const points2: gs.IPoint[] = gsm.intersect.circleCircle2D(cir1, cir2);
    }
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [20,0,0] as gs.XYZ);
        const cir1 = gsm.circle.FromOriginXY(p1, 10, [30,230]);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [25,0,0] as gs.XYZ);
        const cir2 = gsm.circle.FromOriginXY(p2, 10, [40,180]);
        const points2: gs.IPoint[] = gsm.intersect.circleCircle2D(cir1, cir2);
    }
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [40,0,0] as gs.XYZ);
        const cir1 = gsm.circle.FromOriginXY(p1, 10, [270,100]);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [45,0,0] as gs.XYZ);
        const cir2 = gsm.circle.FromOriginXY(p2, 10, [200,180]);
        const points2: gs.IPoint[] = gsm.intersect.circleCircle2D(cir1, cir2);
    }
    {
        const p1: gs.IPoint = gsm.point.FromXYZ(m, [60,0,0] as gs.XYZ);
        const cir1 = gsm.circle.FromOriginXY(p1, 10, [20,220]);
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [65,0,0] as gs.XYZ);
        const cir2 = gsm.circle.FromOriginXY(p2, 10, [220,20]);
        const points2: gs.IPoint[] = gsm.intersect.circleCircle2D(cir1, cir2);
    }
    return m;
}

/**
 *
 */
export function genModelTest4(): gs.IModel {
    const m: gs.IModel = gsm.model.New();

    const p1: gs.IPoint = gsm.point.FromXYZ(m, [6,2,0] as gs.XYZ);
    const cir1 = gsm.circle.FromOriginXY(p1, 5, [10,300]);

    for (let i = 0; i < 10; i++) {
        const p2: gs.IPoint = gsm.point.FromXYZ(m, [i,0,0] as gs.XYZ);
        const plane: gs.IPlane = gsm.plane.FromOriginYZ(p2);
        gsm.intersect.circlePlane3D(cir1, plane);
    }
    return m;
}

/**
 *
 */
export function genModelTest5(): gs.IModel {
    const m: gs.IModel = gsm.model.New();

    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0] as gs.XYZ);
    const cir1 = gsm.circle.FromOriginXY(p1, 10, null);

    const p2: gs.IPoint = gsm.point.FromXYZ(m, [5,0,0] as gs.XYZ);
    const cir2 = gsm.circle.FromOriginXY(p2, 10, null);

    // isect
    const points2: gs.IPoint[] = gsm.intersect.circleCircle2D(cir1, cir2);
    //m.getGeom().addPolyline(points2, false);

    //split
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [7,0,0] as gs.XYZ);
    const cir3 = gsm.circle.FromOriginXY(p3, 10, [0,180]);
    const arcs: gs.ICircle[] = gsm.split.circleCircle2D(cir1, cir3);

    //m.getGeom().delObjs([arcs[1]], true); //ERRROR

    return m;
}

/**
 *
 */
export function genModelTest6(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const g: gs.IGeom = m.getGeom();
    // points and arc
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0] as gs.XYZ);

    const arc0: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1,
        [6.25,0,-15],
        [0.923076923076923, 0, 0.38461538461538486],
        [0, 134.7602701039191 ]);

    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,15] as gs.XYZ);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,0,30] as gs.XYZ);
    //const arc1: gs.ICircle = gsm.circle.From3Points(p1, p2, p3, false);
    //console.log("ARC1", arc1.getAxes(), arc1.getAngles());

    const arc2 = gsm.circle.FromOriginYZ(p1, 20, [0,80]);
    //console.log("ARC2", arc2.getAxes(), arc2.getAngles());
    //
    for (let i = 0; i < 10; i++) {
        const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,1 + (i*2)] as gs.XYZ);
        const plane: gs.IPlane = gsm.plane.FromOriginXY(o);
        const i0: gs.IPoint[] = gsm.intersect.circlePlane3D(arc0, plane);
        //const i1: gs.IPoint[] = gsm.intersect.circlePlane3D(arc1, plane);
        const i2: gs.IPoint[] = gsm.intersect.circlePlane3D(arc2, plane);
    }
    return m;
}

/**
 *
 */
export function genModelTest7(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const g: gs.IGeom = m.getGeom();
    // points and arc
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0] as gs.XYZ);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,15] as gs.XYZ);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,0,30] as gs.XYZ);
    //const arc1: gs.ICircle = gsm.circle.From3Points(p1, p2, p3, false);
    for (let i = 0; i < 10; i++) {
        const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,1 + (i*2)] as gs.XYZ);
        const plane: gs.IPlane = gsm.plane.FromOriginXY(o);
        //const i1: gs.IPoint[] = gsm.intersect.circlePlane3D(arc1, plane);
    }
    return m;
}

/**
 *
 */
export function genModelTest8(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const g: gs.IGeom = m.getGeom();
    // points and arc
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0] as gs.XYZ);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [10,0,15] as gs.XYZ);
    const p3: gs.IPoint = gsm.point.FromXYZ(m, [0,0,30] as gs.XYZ);
    gsm.point.del([p1, p2, p3]);
    return m;
}

export function genModelTest9(): gs.IModel {
    const m: gs.IModel = gsm.model.New();
    const p1: gs.IPoint = gsm.point.FromXYZ(m, [-10, 0, 8]);
    const circle1: gs.ICircle = gsm.circle.FromOrigin2Vectors(p1, [7, 0, 7], [-3, 0, 3], null);
    const p2: gs.IPoint = gsm.point.FromXYZ(m, [11, 0, -2]);
    const circle2: gs.ICircle = gsm.circle.FromOrigin2Vectors(p2, [2, 0, 2], [-1, 0, 1], null);
    const plines: gs.IPolyline[] = gsm.circle.tangentPlinesInner2D(circle1, circle2);
    const plines2: gs.IPolyline[] = gsm.circle.tangentPlinesOuter2D(circle1, circle2);
    return m;
}
