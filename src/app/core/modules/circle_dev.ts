import * as gs from "gs-json";
import * as threex from "./libs/threex/threex";
import * as three from "three";
import * as circles from "./libs/conics/circles";
import { Arr } from "./libs/arr/arr";

//  ==========================================================================================================
//  Util method
//  ==========================================================================================================
export function _argsCheckAngles(angles: [number, number]): [number, number] {
    //export function checkCircleAngles(angles: [number, number]): [number, number] {
    if (angles === undefined || angles === null) { return null; }
    // fix angle 0
    if (Math.abs(angles[0]) > 360) {
        angles[0] = angles[0] % 360;
    }
    if (angles[0] < 0) {
        angles[0] = 360 + angles[0];
    }
    // fix angle 1
    if (Math.abs(angles[1]) > 360) {
        angles[1] = angles[1] % 360;
    }
    if (angles[1] < 0) {
        angles[1] = 360 + angles[1];
    }
    // return the fixed angles
    return angles;
}

//  ===============================================================================================================
//  Circle Constructors ============================================================================================
//  ===============================================================================================================

// Still not working

/**
 * Create a circle that passes three points.
 * If is_arc is false, a circle is created.
 * Otherwise, an arc is created.
 *
 * @param point1 Point object, on the circle.
 * @param point2 Point object, on the circle.
 * @param point3 Point object, on the circle.
 * @param is_arc If true, an arc is generated that starts at point1 and end at point3, passing through point 2.
 * @returns New circle object.
 */
export function From3Points(point1: gs.IPoint, point2: gs.IPoint, point3: gs.IPoint, is_closed: boolean): gs.ICircle {
    if (!point1.exists()) { throw new Error("Error: point1 has been deleted."); }
    if (!point2.exists()) { throw new Error("Error: point2 has been deleted."); }
    if (!point3.exists()) { throw new Error("Error: point3 has been deleted."); }
    // check
    const model: gs.IModel = point1.getModel();
    if (point2.getModel() !== model) { throw new Error("Error: Points must all be in same model."); }
    if (point3.getModel() !== model) { throw new Error("Error: Points must all be in same model."); }
    // do the maths
    const result = circles.circleFrom3Points(
        point1.getPosition(), point2.getPosition(), point3.getPosition(), is_closed);
    const origin: gs.IPoint = model.getGeom().addPoint(result.origin);
    const vec_x: gs.XYZ = result.vec_x;
    const vec: gs.XYZ = result.vec_y;
    // make the circle or arc
    if (is_closed) {
        return origin.getGeom().addCircle(origin, vec_x, vec);
    } else {
        return origin.getGeom().addCircle(origin, vec_x, vec, [0, result.angle]);
    }
}

/**
 * Adds an arc to the model based on three points
 *
 * All points are taken to be points along the arc
 * @param pt1 Start point of arc
 * @param pt2 Second point on arc
 * @param pt3 End point of arc
 * @returns New arc if successful
 */
export function ArcFrom3Points(pt1: gs.IPoint, pt2: gs.IPoint, pt3: gs.IPoint): gs.ICircle {
    const m1: gs.IModel = pt1.getModel();
    const m2: gs.IModel = pt2.getModel();
    const m3: gs.IModel = pt3.getModel();
    if (m1 !== m2) { throw new Error("Points must be in the same model."); }
    if (m1 !== m3) { throw new Error("Points must be in the same model."); }
    const g1: gs.IGeom = m1.getGeom();
    if (threex.vectorsAreCodir(threex.subPoints(pt1, pt2),
            threex.subPoints(pt1, pt3))) { throw new Error("Points must be not aligned"); }
    const AB: three.Vector3 = threex.vectorFromPointsAtoB(pt1, pt2);
    const AC: three.Vector3 = threex.vectorFromPointsAtoB(pt1, pt3);
    const BC: three.Vector3 = threex.vectorFromPointsAtoB(pt2, pt3);
    const radius: number = BC.length() / (2 * threex.crossVectors(AB.normalize(), AC.normalize(), false).length());
    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();
    const circle_1: gs.ICircle = g.addCircle(pt1, [radius, 0, 0], [0, radius, 0]);
    const circle_2: gs.ICircle = g.addCircle(pt2, [radius, 0, 0], [0, radius, 0]);
    const circle_3: gs.ICircle = g.addCircle(pt3, [radius, 0, 0], [0, radius, 0]);
    const c1: gs.IPoint[] = circles.isectCircleCircle2D(circle_1, circle_2);
    const c2: gs.IPoint[] = circles.isectCircleCircle2D(circle_1, circle_3);

    let center: gs.IPoint = null;
    if (Arr.equal(c1[0].getPosition(), c2[0].getPosition())) {
        center = g.addPoint(c1[0].getPosition());
        // center = g1.addPoint(c1[0].getPosition());
    }
    if (Arr.equal(c1[0].getPosition(), c2[1].getPosition())) {
        center = g.addPoint(c1[0].getPosition());
        // center = g1.addPoint(c1[0].getPosition());
    }
    if (Arr.equal(c1[1].getPosition(), c2[0].getPosition())) {
        center = g.addPoint(c1[1].getPosition());
        // center = g1.addPoint(c1[1].getPosition());
    }
    if (Arr.equal(c1[1].getPosition(), c2[1].getPosition())) {
        center = g.addPoint(c1[1].getPosition());
        // center = g1.addPoint(c1[1].getPosition());
    }
    if (center === null) { throw new Error("Review thresholds"); }

    const center_pt1: three.Vector3 = threex.vectorFromPointsAtoB(center, pt1);
    const center_pt2: three.Vector3 = threex.vectorFromPointsAtoB(center, pt2);
    const center_pt3: three.Vector3 = threex.vectorFromPointsAtoB(center, pt3);

    const angle: number = Math.max(
        Math.min(center_pt1.angleTo(center_pt2), center_pt2.angleTo(center_pt1)),
        Math.min(center_pt1.angleTo(center_pt3), center_pt3.angleTo(center_pt1)),
        Math.min(center_pt2.angleTo(center_pt3), center_pt3.angleTo(center_pt2)));

    let start_point: gs.IPoint = null;
    if (angle === center_pt1.angleTo(center_pt2)) {
        start_point = g.addPoint(pt1.getPosition());
    }
    if (angle === center_pt2.angleTo(center_pt1)) {
        start_point = g.addPoint(pt2.getPosition());
    }
    if (angle === center_pt1.angleTo(center_pt3)) {
        start_point = g.addPoint(pt1.getPosition());
    }
    if (angle === center_pt3.angleTo(center_pt1)) {
        start_point = g.addPoint(pt3.getPosition());
    }
    if (angle === center_pt2.angleTo(center_pt3)) {
        start_point = g.addPoint(pt2.getPosition());
    }
    if (angle === center_pt3.angleTo(center_pt2)) {
        start_point = g.addPoint(pt3.getPosition());
    }
    const u: three.Vector3 = threex.vectorFromPointsAtoB(center, start_point);
    let normal: three.Vector3 = null;
    normal = threex.crossVectors(u, center_pt1);
    if (normal.length() === 0) { normal = threex.crossVectors(u, center_pt2); }
    if (normal.length() === 0) { normal = threex.crossVectors(u, center_pt3); }
    const v: three.Vector3 = threex.crossVectors(normal.normalize(), u);

    return g1.addCircle(g1.addPoint(center.getPosition()), [u[0], u[1], u[2]], [v[0], v[1], v[2]], [0, angle]);
}

/**
 * Adds a closed circle to the model based on three points
 *
 * All points are taken to be points along the circumference of the circle
 * @param pt1 First point on circle
 * @param pt2 Second point on circle
 * @param pt3 Third point on circle
 * @returns New circle if successful
 */
export function CircleFrom3Points(pt1: gs.IPoint, pt2: gs.IPoint, pt3: gs.IPoint): gs.ICircle {
    const m1: gs.IModel = pt1.getModel();
    const m2: gs.IModel = pt2.getModel();
    const m3: gs.IModel = pt3.getModel();
    if (m1 !== m2) {
        throw new Error("Points must be in the same model.");
    }
    if (m1 !== m3) {
        throw new Error("Points must be in the same model.");
    }
    if (threex.vectorsAreCodir(threex.subPoints(pt1, pt2),
            threex.subPoints(pt1, pt3))) { throw new Error("Points must be not aligned"); }
    const AB: three.Vector3 = threex.vectorFromPointsAtoB(pt1, pt2);
    const AC: three.Vector3 = threex.vectorFromPointsAtoB(pt1, pt3);
    const BC: three.Vector3 = threex.vectorFromPointsAtoB(pt2, pt3);
    const radius: number = BC.length() / (2 * threex.crossVectors(AB.normalize(), AC.normalize(), false).length());
    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();
    const circle_1: gs.ICircle = g.addCircle(pt1, [radius, 0, 0], [0, radius, 0], [0, 360]);
    const circle_2: gs.ICircle = g.addCircle(pt2, [radius, 0, 0], [0, radius, 0], [0, 360]);
    const circle_3: gs.ICircle = g.addCircle(pt3, [radius, 0, 0], [0, radius, 0], [0, 360]);
    const c1: gs.IPoint[] = circles.isectCircleCircle2D(circle_1, circle_2);
    const c2: gs.IPoint[] = circles.isectCircleCircle2D(circle_1, circle_3);
    const g1: gs.IGeom = m1.getGeom();
    if (Arr.equal(c1[0].getPosition(), c2[0].getPosition())) {
        return g1.addCircle(g1.addPoint(c1[0].getPosition()), [radius, 0, 0], [0, radius, 0], [0, 360]);
    }
    if (Arr.equal(c1[0].getPosition(), c2[1].getPosition())) {
        return g1.addCircle(g1.addPoint(c1[0].getPosition()), [radius, 0, 0], [0, radius, 0], [0, 360]);
    }
    if (Arr.equal(c1[1].getPosition(), c2[0].getPosition())) {
        return g1.addCircle(g1.addPoint(c1[1].getPosition()), [radius, 0, 0], [0, radius, 0], [0, 360]);
    }
    if (Arr.equal(c1[1].getPosition(), c2[1].getPosition())) {
        return g1.addCircle(g1.addPoint(c1[1].getPosition()), [radius, 0, 0], [0, radius, 0], [0, 360]);
    }
    throw new Error("Review thresholds");
}

//  ===============================================================================================================
//  Conic Functions ===============================================================================================
//  ===============================================================================================================

// - WEEK 6 -
/**
 * Returns a point on a conic curve based on a parameter between 0 and 1
 *
 * @param curve Conic curve to evaluate
 * @param t Parameter along curve to evaluate (0 is the start of the curve and 1 is the end)
 * @returns Point on curve
 */
export function evalParam(curve: gs.ICircle | gs.IEllipse, t: number): gs.IPoint {
    throw new Error("Method not implemented");
}

// - WEEK 6 -
/**
 * Returns a parameter along a conic curve based on a point on the curve
 *
 * Returns null if point specified does not lie on the curve (within a tolerance of 0.1)
 * @param curve Conic curve to evaluate
 * @param point Point to evaluate
 * @returns Parameter on curve if successful, null if unsuccessful or on error
 */
export function evalPoint(curve: gs.ICircle | gs.IEllipse, point: gs.IPoint): number {
    throw new Error("Method not implemented");
}

/**
 * Extends an arc
 *
 * Changes the starting and ending angles for a conic curve such that the curve is lengthened<br/>
 * Conic curve should be either a circular arc or an elliptical arc<br/>
 * Extension will follow the original curvature of the circle or ellipse the arc was constructed from<br>
 * If extension causes length of curve to exceed the circumference of the underlying circle or ellipse,
 * returns a closed circle or ellipse.<br/>
 * Returns null if distance is negative
 * @param curve Conic curve to extend
 * @param direction Direction to extend curve in (0-Start, 1-End, 2-Both)
 * @param distance Distance to extend curve
 * @param copy Performs transformation on a duplicate copy of the input curve if true
 * @returns Extended conic curve, null if unsuccessful or on error
 */
export function extendArc(curve: gs.ICircle, direction: number, distance: number, copy: boolean):
gs.ICircle {
    throw new Error("Method not implemented");
}

/**
 * Extends an elliptical arc
 *
 * Changes the starting and ending angles for a conic curve such that the curve is lengthened<br/>
 * Conic curve should be either a circular arc or an elliptical arc<br/>
 * Extension will follow the original curvature of the circle or ellipse the arc was constructed from<br>
 * If extension causes length of curve to exceed the circumference of the underlying circle or ellipse,
 * returns a closed circle or ellipse.<br/>
 * Returns null if distance is negative
 * @param curve Conic curve to extend
 * @param direction Direction to extend curve in (0-Start, 1-End, 2-Both)
 * @param distance Distance to extend curve
 * @param copy Performs transformation on a duplicate copy of the input curve if true
 * @returns Extended conic curve, null if unsuccessful or on error
 */
export function extendEllArc(curve: gs.IEllipse, direction: number, distance: number, copy: boolean):
gs.IEllipse {
    throw new Error("Method not implemented");
}
