import * as gs from "gs-json";
import * as mathjs from "mathjs";
import * as three from "three";
import * as threex from "../threex/threex";
import * as kld from "kld-intersections";
import * as circleUtil from "./circleUtil";
const EPS = 1e-6;

/**
 * Circle-circle intersection
 * @param circle1
 * @param circle2
 * @returns An array of intersection points
 */
export function isectCircleCircle2D(circle1: gs.ICircle, circle2: gs.ICircle): gs.IPoint[] {
    const m1: gs.IModel = circle1.getModel();
    const m2: gs.IModel = circle2.getModel();
    if (m1 !== m2) { throw new Error("Entities must be in the same model."); }
    const v1: [gs.XYZ, gs.XYZ, gs.XYZ] = circle1.getAxes();
    const v2: [gs.XYZ, gs.XYZ, gs.XYZ] = circle2.getAxes();
    if (!threex.planesAreCoplanar(circle1.getOrigin(), v1[2], circle2.getOrigin(), v2[2])) {
        throw new Error("Entities must be coplanar.");
    }
    const g1: gs.IGeom = m1.getGeom();
    const r: number = circle1.getRadius() + circle2.getRadius();
    const O1O2: three.Vector3 = threex.vectorFromPointsAtoB(circle1.getOrigin(), circle2.getOrigin(), false);
    if (O1O2.length() > r) { return null; }
    // Direct Orthonormal Basis of reference
    const O1: three.Vector3 = new three.Vector3(0, 0, 0);
    const e1: three.Vector3 = new three.Vector3(1, 0, 0);
    const e2: three.Vector3 = new three.Vector3(0, 1, 0);
    const e3: three.Vector3 = new three.Vector3(0, 0, 1);
    // Circle 1 Direct Orthonormal Basis
    const C1: three.Vector3 = new three.Vector3(...circle1.getOrigin().getPosition());
    const U1: three.Vector3 = new three.Vector3(...v1[0]).normalize();
    const V1: three.Vector3 = new three.Vector3(...v1[1]).normalize();
    const W1: three.Vector3 = threex.crossVectors(U1, V1, true);
    let angles1: [number, number] = circle1.getAngles();
    if (angles1 === null) { angles1 = [0, 360]; }
    const angles_circle_1: number = angles1[1] - angles1[0];
    // Circle 2 Direct Orthonormal Basis
    const C2: three.Vector3 = new three.Vector3(...circle2.getOrigin().getPosition());
    const U2: three.Vector3 = new three.Vector3(...v2[0]).normalize();
    const V2: three.Vector3 = new three.Vector3(...v2[1]).normalize();
    const W2: three.Vector3 = threex.crossVectors(U2, V2, true);
    let angles2: [number, number] = circle2.getAngles();
    if (angles2 === null) { angles2 = [0, 360]; }
    const angles_circle_2: number = angles2[1] - angles2[0];

    // Rotation Matrix expressed in the reference direct orthonormal basis
    // Circle 1
    const C1O1: three.Vector3 = threex.subVectors(O1, C1, false);
    const vec_O_1: three.Vector3 = new three.Vector3(
        threex.dotVectors(C1O1, U1),
        threex.dotVectors(C1O1, V1),
        threex.dotVectors(C1O1, W1),
    );
    const x1: three.Vector3 = new three.Vector3(
        threex.dotVectors(e1, U1),
        threex.dotVectors(e1, V1),
        threex.dotVectors(e1, W1),
    );
    const y1: three.Vector3 = new three.Vector3(
        threex.dotVectors(e2, U1),
        threex.dotVectors(e2, V1),
        threex.dotVectors(e2, W1),
    );
    const rotation1: three.Matrix4 = threex.xformMatrixNeg(vec_O_1, x1, y1);
    // Initial Rotation Matrix expressed in the reference direct orthonormal basis
    // Circle 1
    const O1C1: three.Vector3 = threex.subVectors(C1, O1, false);
    const init_vec_O_1: three.Vector3 = new three.Vector3(
        threex.dotVectors(O1C1, e1),
        threex.dotVectors(O1C1, e2),
        threex.dotVectors(O1C1, e3),
    );
    const init_x1: three.Vector3 = new three.Vector3(
        threex.dotVectors(U1, e1),
        threex.dotVectors(U1, e2),
        threex.dotVectors(U1, e3),
    );
    const init_y1: three.Vector3 = new three.Vector3(
        threex.dotVectors(V1, e1),
        threex.dotVectors(V1, e2),
        threex.dotVectors(V1, e3),
    );
    const init_rotation1: three.Matrix4 = threex.xformMatrixNeg(init_vec_O_1, init_x1, init_y1);
    const a: three.Vector3 = threex.multVectorMatrix(C1, init_rotation1);
    const b: three.Vector3 = threex.multVectorMatrix(C2, init_rotation1);
    const circle_1 = {
        center: new kld.Point2D(a.x, a.y),
        radius: circle1.getRadius(),
    };
    const circle_2 = {
        center: new kld.Point2D(b.x, b.y),
        radius: circle2.getRadius(),
    };
    const result: kld.Intersection = kld.Intersection.intersectCircleCircle(circle_1.center, circle_1.radius,
        circle_2.center, circle_2.radius);
    // Retransforming into original coordinates system
    const results: three.Vector3[] = [];
    for (const point of result.points) {
        results.push(new three.Vector3(point.x, point.y, 0));
    }
    const results_c1: three.Vector3[] = [];
    for (const point of results) {
        results_c1.push(threex.multVectorMatrix(point, rotation1));
    }
    const points: gs.IPoint[] = [];
    for (const point of results_c1) {
        const c1_to_point: three.Vector3 = new three.Vector3(point.x - C1.x, point.y - C1.y, point.z - C1.z);
        const c2_to_point: three.Vector3 = new three.Vector3(point.x - C2.x, point.y - C2.y, point.z - C2.z);
        let angle_1: number = U1.angleTo(c1_to_point) * 180 / Math.PI;
        if (threex.crossVectors(U1, c1_to_point).dot(threex.crossVectors(U1, V1)) < 0) { angle_1 = 360 - angle_1; }
        let angle_2: number = U2.angleTo(c2_to_point) * 180 / Math.PI;
        if (threex.crossVectors(U2, c2_to_point).dot(threex.crossVectors(U2, V2)) < 0) { angle_2 = 360 - angle_2; }
        // if (angles_circle_1 - angle_1 >= 0 && angles_circle_2 - angle_2 >= 0) {
        //     points.push(g1.addPoint([point.x, point.y, point.z]));
        // }
        if (circleUtil.angleInCircle(circle1, angle_1) && circleUtil.angleInCircle(circle2, angle_2)) {
            points.push(g1.addPoint([point.x, point.y, point.z]));
        }
    }
    return points;
}

/**
 * Find the inner tangents of two coplanar circles.
 * @param circle1
 * @param circle2
 * @returns An array of start and end points of the two tangent lines
 */
export function innerTangentsCircleCircle2D(circle1: gs.ICircle, circle2: gs.ICircle): [gs.IPolyline, gs.IPolyline] {
    const c1_origin: three.Vector3 = new three.Vector3(...circle1.getOrigin().getPosition());
    const c1_axes: three.Vector3[] = circle1.getAxes().map((v) => new three.Vector3(...v));
    const c2_origin: three.Vector3 = new three.Vector3(...circle2.getOrigin().getPosition());
    const c2_axes: three.Vector3[] = circle2.getAxes().map((v) => new three.Vector3(...v));
    if (!threex.planesAreCoplanar(c1_origin, c1_axes[2], c2_origin, c2_axes[2])) {
        throw new Error("Circles must be coplanar.");
    }
    // set the x axis to be from o1 to o2
    const x_vec: three.Vector3 = new three.Vector3().subVectors(c2_origin, c1_origin).normalize();
    const y_vec: three.Vector3 = new three.Vector3().crossVectors(x_vec, c1_axes[2]);
    // make matrixes
    const matrix_pos: three.Matrix4 = threex.xformMatrixPos(c1_origin, x_vec, y_vec);
    const matrix_neg: three.Matrix4 = threex.xformMatrixNeg(c1_origin, x_vec, y_vec);
    // transform origins from 3d to 2d
    c1_origin.applyMatrix4(matrix_neg);
    c2_origin.applyMatrix4(matrix_neg);
    // get the radii
    const r1: number = circle1.getRadius();
    const r2: number = circle2.getRadius();
    // check that circles do not overlap
    if ((r1 + r2) >= c2_origin.x) {return null;}
    // calc mid point
    const dist: number = c2_origin.x;
    const dist1: number = dist * ( r1 / (r1 + r2));
    const dist2: number = dist - dist1;
    // calc angles, a1 is the angle to the start point
    const a1: number = Math.acos(r1 / dist1);
    // calc start and end of each inner tangent line
    const t1_start: three.Vector3 = new three.Vector3(
        r1 * Math.cos(a1), r1 * Math.sin(a1), 0);
    const t2_start: three.Vector3 = new three.Vector3(t1_start.x, -t1_start.y, 0);
    const t1_end: three.Vector3 = new three.Vector3(
        dist - (r2 * Math.cos(a1)), -r2 * Math.sin(a1), 0);
    const t2_end: three.Vector3 = new three.Vector3(t1_end.x, -t1_end.y, 0);
    // tranform points from 2d to 3d
    t1_start.applyMatrix4(matrix_pos);
    t2_start.applyMatrix4(matrix_pos);
    t1_end.applyMatrix4(matrix_pos);
    t2_end.applyMatrix4(matrix_pos);
    // create points in the model
    const g: gs.IGeom = circle1.getModel().getGeom();
    const t1_start_point: gs.IPoint = g.addPoint(t1_start.toArray() as gs.XYZ);
    const t2_start_point: gs.IPoint = g.addPoint(t2_start.toArray() as gs.XYZ);
    const t1_end_point: gs.IPoint = g.addPoint(t1_end.toArray() as gs.XYZ);
    const t2_end_point: gs.IPoint = g.addPoint(t2_end.toArray() as gs.XYZ);
    // return the two polylines
    return [
        g.addPolyline([t1_start_point, t1_end_point], false),
        g.addPolyline([t2_start_point, t2_end_point], false)
    ];
}

/**
 * Find the outer tangents of two coplanar circles.
 * @param circle1
 * @param circle2
 * @returns An array of two tangent lines
 */
export function outerTangentsCircleCircle2D(circle1: gs.ICircle, circle2: gs.ICircle): [gs.IPolyline, gs.IPolyline] {
    const c1_origin: three.Vector3 = new three.Vector3(...circle1.getOrigin().getPosition());
    const c1_axes: three.Vector3[] = circle1.getAxes().map((v) => new three.Vector3(...v));
    const c2_origin: three.Vector3 = new three.Vector3(...circle2.getOrigin().getPosition());
    const c2_axes: three.Vector3[] = circle2.getAxes().map((v) => new three.Vector3(...v));
    if (!threex.planesAreCoplanar(c1_origin, c1_axes[2], c2_origin, c2_axes[2])) {
        throw new Error("Circles must be coplanar.");
    }
    // set the x axis to be from o1 to o2
    const x_vec: three.Vector3 = new three.Vector3().subVectors(c2_origin, c1_origin).normalize();
    const y_vec: three.Vector3 = new three.Vector3().crossVectors(x_vec, c1_axes[2]);
    // make matrixes
    const matrix_pos: three.Matrix4 = threex.xformMatrixPos(c1_origin, x_vec, y_vec);
    const matrix_neg: three.Matrix4 = threex.xformMatrixNeg(c1_origin, x_vec, y_vec);
    // transform origins from 3d to 2d
    c1_origin.applyMatrix4(matrix_neg);
    c2_origin.applyMatrix4(matrix_neg);
    // get the radii
    const r1: number = circle1.getRadius();
    const r2: number = circle2.getRadius();
    // check that circles do not overlap
    if ((r1 + r2) >= c2_origin.x) {return null;}
    // dist between origins
    const dist: number = c2_origin.x;
    // calc angles, a1 is the angle to the start point
    let a1: number;
    if (r1 > r1) {
        a1 = Math.acos((r2 - r1) / dist);
    } else {
        a1 = -Math.acos((r1 - r2) / dist);
    }
    // calc start and end of each inner tangent line
    const t1_start: three.Vector3 = new three.Vector3(
        r1 * Math.cos(a1), r1 * Math.sin(a1), 0);
    const t1_end: three.Vector3 = new three.Vector3(
        dist + (r2 * Math.cos(a1)), r2 * Math.sin(a1), 0);
    const t2_start: three.Vector3 = new three.Vector3(t1_start.x, -t1_start.y, 0);
    const t2_end: three.Vector3 = new three.Vector3(t1_end.x, -t1_end.y, 0);
    // tranform points from 2d to 3d
    t1_start.applyMatrix4(matrix_pos);
    t2_start.applyMatrix4(matrix_pos);
    t1_end.applyMatrix4(matrix_pos);
    t2_end.applyMatrix4(matrix_pos);
    // create points in the model
    const g: gs.IGeom = circle1.getModel().getGeom();
    const t1_start_point: gs.IPoint = g.addPoint(t1_start.toArray() as gs.XYZ);
    const t2_start_point: gs.IPoint = g.addPoint(t2_start.toArray() as gs.XYZ);
    const t1_end_point: gs.IPoint = g.addPoint(t1_end.toArray() as gs.XYZ);
    const t2_end_point: gs.IPoint = g.addPoint(t2_end.toArray() as gs.XYZ);
    // return the two polylines
    return [
        g.addPolyline([t1_start_point, t1_end_point], false),
        g.addPolyline([t2_start_point, t2_end_point], false)
    ];
}
