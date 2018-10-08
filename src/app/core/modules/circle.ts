/**
 * Functions for working with circles.
 * Circles are geometric objects definded by a single vertex and a set of parameters.
 * The circle object can be either a closed circle or an open arc.
 */

/**
 * The parameters defined the orientation, radius, and arc angles of the circle.
 * The orientation is defined by two vectors, the X and Y vectors of the plane.
 * The radius is defined by the length of the X vector.
 * The arc angles define are two angles between 0 and 360 that define the start and end of the arc.
 * If the arc angles are null, then the circle is assumed to be a closed circle.
 */

import * as gs from "gs-json";
import * as util from "./circle_dev";
import * as three from "three";
import * as threex from "./libs/threex/threex";
import * as circles from "./libs/conics/circles";
import * as error from "./_error_msgs_dev";

//  ===============================================================================================================
//  Circle Get and Copy =====================================================================================================
//  ===============================================================================================================

/**
 * Gets a circle from the model based on an ID number.
 * In the viewer, the object label can display (it starts with 'o'), which contains the ID.
 * For example, if the label is "o123", then the ID is the number 123.
 *
 * @param model Model to get circle object from.
 * @param id ID number of circle object.
 * @returns Circle object.
 */
export function Get(model: gs.IModel, id: number): gs.ICircle {
    // check args
    const obj: gs.IObj = error.checkObjID(model, id, gs.EObjType.circle);
    // return the circle
    return obj as gs.ICircle;
}

/**
 * Create a copy of a circle object.
 *
 * @param circle The circle object to copy.
 * @param copy_attribs If true, attributes are copied to the new circle.
 * @returns Circle object.
 */
export function Copy(circle: gs.ICircle, copy_attribs?: boolean): gs.ICircle {
    // check args
    error.checkObj(circle, gs.EObjType.circle);
    // copy and return
    return circle.copy(copy_attribs) as gs.ICircle;
}

/**
 * Copies a circle from one model into another model.
 *
 * @param model The model to copy to.
 * @param circle The circle object to copy.
 * @returns The copied circle object in the model.
 */
export function CopyToModel(model: gs.IModel, circle: gs.ICircle): gs.ICircle {
    // check args
    error.checkObj(circle, gs.EObjType.circle);
    // check it is not already in the model
    if (circle.getModel() === model) { throw new Error("Error: circle is already in model."); }
    // copy circle and return it
    return model.getGeom().copyCircleFromModel(circle);
}

//  ===============================================================================================================
//  Constructors ============================================================================================
//  ===============================================================================================================

/**
 * Creates a circle from an origin point parallel to a plane defined by the two X and Y vectors.
 * The radius will be equal to the length of the X vector.
 * If no angle is defined, a circle is created. Otherwise, an arc is created, with the specified angles
 * starting at the x-axis in an anti-clockwise direction.
 *
 * @param origin Point object, the center of the circle.
 * @param vec_x X-axis of the circle plane. (The length of the vecor described the radius.)
 * @param vec Vector on the circle plane.
 * @param angles Two angles between 0 and 360, or null for a circle.
 * @returns Circle object.
 */
export function FromOrigin2Vectors(origin: gs.IPoint, vec_x: gs.XYZ, vec: gs.XYZ,
    angles: [number, number]): gs.ICircle {
    error.checkPoint(origin);
    error.checkXYZ(vec_x);
    error.checkXYZ(vec);
    // make the circle
    return origin.getGeom().addCircle(origin, vec_x, vec, util._argsCheckAngles(angles));
}

/**
 * Create a circle at the origin point parallel to a plane that passes through two other points.
 * The radius will be equal to the distance from the origin to point1.
 * If angle is undefined, a circle is created. Otherwise, an arc is created, with the specified angles
 * starting at point1 in an anti-clockwise direction.
 *
 * @param origin Point object, the center of the circle.
 * @param point1 Point object, on the circle perimeter, and defining teh x-axis of the plane.
 * @param point2 Point object, on the plane.
 * @param angles Two angles between 0 and 360, or null for a circle.
 * @returns Circle object.
 */
export function FromOrigin2Points(origin: gs.IPoint, point1: gs.IPoint, point2: gs.IPoint,
    angles: [number, number]): gs.ICircle {
    error.checkPoint(origin);
    error.checkPoint(point1);
    error.checkPoint(point2);
    // create the vectors
    const vec_x: gs.XYZ = threex.vectorFromPointsAtoB(origin, point1).toArray() as gs.XYZ;
    const vec: gs.XYZ = threex.vectorFromPointsAtoB(origin, point2).toArray() as gs.XYZ;
    // make the circle
    return origin.getGeom().addCircle(origin, vec_x, vec, util._argsCheckAngles(angles));
}

/**
 * Create a circle at the origin point parallel to the WCS XY plane, with the specified radius.
 * If angle is undefined, a circle is created. Otherwise, an arc is created, with the specified angles
 * starting at point1 in an anti-clockwise direction.
 *
 * @param origin Point object, the center of the circle.
 * @param radius Radius of circle.
 * @param angles Two angles between 0 and 360, or null for a circle.
 * @returns Circle object.
 */
export function FromOriginXY(origin: gs.IPoint, radius: number, angles: [number, number]): gs.ICircle {
    error.checkPoint(origin);
    error.checkPosNum(radius);
    // create the vectors
    const vec_x: gs.XYZ = [radius, 0, 0];
    const vec: gs.XYZ = [0, 1, 0];
    // make the circle
    return origin.getGeom().addCircle(origin, vec_x, vec, util._argsCheckAngles(angles));
}

/**
 * Create a circle at the origin point parallel to the WCS YZ plane, with the specified radius.
 * If angle is undefined, a circle is created. Otherwise, an arc is created, with the specified angles
 * starting at point1 in an anti-clockwise direction.
 *
 * @param origin Point object, the center of the circle.
 * @param radius Radius of circle.
 * @param angles Two angles between 0 and 360, or null for a circle.
 * @returns Circle object.
 */
export function FromOriginYZ(origin: gs.IPoint, radius: number, angles: [number, number]): gs.ICircle {
    error.checkPoint(origin);
    error.checkPosNum(radius);
    // create the vectors
    const vec_x: gs.XYZ = [0, radius, 0];
    const vec: gs.XYZ = [0, 0, 1];
    // make the circle
    return origin.getGeom().addCircle(origin, vec_x, vec, util._argsCheckAngles(angles));
}

/**
 * Create a circle at the origin point parallel to the WCS ZX plane, with the specified radius.
 * If angle is undefined, a circle is created. Otherwise, an arc is created, with the specified angles
 * starting at point1 in an anti-clockwise direction.
 *
 * @param origin Point object, the center of the circle.
 * @param radius Radius of circle.
 * @param angles Two angles between 0 and 360, or null for a circle.
 * @returns New circle (or arc).
 */
export function FromOriginZX(origin: gs.IPoint, radius: number, angles: [number, number]): gs.ICircle {
    error.checkPoint(origin);
    error.checkPosNum(radius);
    // create the vectors
    const vec_x: gs.XYZ = [0, 0, radius];
    const vec: gs.XYZ = [1, 0, 0];
    // make the circle
    return origin.getGeom().addCircle(origin, vec_x, vec, util._argsCheckAngles(angles));
}

/**
 * Create a circle from a plane, with the specified radius.
 * If angle is undefined, a circle is created. Otherwise, an arc is created, with the specified angles
 * starting at point1 in an anti-clockwise direction.
 *
 * @param plane Plane object to construct circle on.
 * @param radius Radius of circle.
 * @param angles Two angles between 0 and 360, or null for a circle.
 * @returns New circle object.
 */
export function FromPlane(plane: gs.IPlane, radius: number, angles: [number, number]): gs.ICircle {
    error.checkObj(plane, gs.EObjType.plane);
    error.checkPosNum(radius);
    // create the vectors
    const vecs: gs.XYZ[] = plane.getAxes();
    const vec_x: gs.XYZ = new three.Vector3(...vecs[0]).setLength(radius).toArray() as gs.XYZ;
    const vec: gs.XYZ = vecs[1];
    // make the circle
    return plane.getGeom().addCircle(plane.getOrigin(), vec_x, vec, util._argsCheckAngles(angles));
}

/**
 * Create a circle that passes through three points.
 * If is_closed is false, an arc is created. Otherwise, an arc is created.
 *
 * @param point1 Point object, on the circle.
 * @param point2 Point object, on the circle.
 * @param point3 Point object, on the circle.
 * @param is_closed If false, an arc is generated that starts at point1 and end at point3, passing through point 2.
 * @returns New circle object.
 */
export function From3Points(point1: gs.IPoint, point2: gs.IPoint, point3: gs.IPoint, is_closed: boolean): gs.ICircle {
    const model: gs.IModel = error.checkPointList([point1, point2, point3], 3);
    // do the maths
    const result = circles.circleFrom3Points(
        point1.getPosition(), point2.getPosition(), point3.getPosition(), is_closed);
    const origin: gs.IPoint = model.getGeom().addPoint(result.origin);
    // make the circle or arc
    if (is_closed) {
        return origin.getGeom().addCircle(origin, result.vec_x, result.vec_y);
    } else {
        return origin.getGeom().addCircle(origin, result.vec_x, result.vec_y, [0, result.angle]);
    }
}

//  ===============================================================================================================
//  Get and Set ===================================================================================================
//  ===============================================================================================================

/**
 * Gets the origin of the circle.
 * @param circle Circle objject to obtain origin from.
 * @returns Point object, the origin of teh circle.
 */
export function getOrigin(circle: gs.ICircle): gs.IPoint {
    error.checkObj(circle, gs.EObjType.circle);
    return circle.getOrigin();
}

/**
 * Gets the X and Y vectors of the circle plane. The circle radius is equal to the length of the X vector.
 *
 * @param circle Circle object to get vectors from.
 * @returns Two vectors, the X and Y vectors of teh circle plane.
 */
export function getAxes(circle: gs.ICircle): gs.XYZ[] {
    error.checkObj(circle, gs.EObjType.circle);
    return circle.getAxes();
}

/**
 * Gets the arc angles of the circle.
 *
 * @param circle Circle object to get angles from.
 * @returns The angles, or null if it is a closed circle.
 */
export function getArcAngles(circle: gs.ICircle): [number, number] {
    error.checkObj(circle, gs.EObjType.circle);
    return circle.getAngles();
}

/**
 * Sets the angles for the arc.
 *
 * @param circle Circle object to set angles for.
 * @param angles The angles to set, two numbers between 0 and 360. If null, then the circle is closed.
 */
export function setArcAngles(circle: gs.ICircle, angles: [number, number]): [number, number] {
    error.checkObj(circle, gs.EObjType.circle);
    const old_angles: [number, number] = circle.getAngles();
    circle.setAngles(util._argsCheckAngles(angles));
    return old_angles;
}

/**
 * Checks if a circle object is closed. If it is not closed, then it must be an arc.
 *
 * @param circle Circle object to test.
 * @returns True if the circle is closed.
 */
export function isClosed(circle: gs.ICircle): boolean {
    error.checkObj(circle, gs.EObjType.circle);
    return circle.isClosed();
}

/**
 * Closes the arc, so that it becomes a circle.
 *
 * @param circle Circle object to close.
 * @return True if the open circle was closed, false if the circle was already closed.
 */
export function close(circle: gs.ICircle): boolean {
    error.checkObj(circle, gs.EObjType.circle);
    if (circle.isClosed()) { return false; }
    circle.setAngles(undefined);
    return true;
}

//  ===============================================================================================================
//  Functions =====================================================================================================
//  ===============================================================================================================

/**
 * Returns the perimeter length of a circle.
 * If the circle is an open arc, then the length of the arc is returned.
 *
 * @param circle Circle object to calculate length for.
 * @returns Length of circle or arc.
 */
export function calcLength(circle: gs.ICircle): number {
    error.checkObj(circle, gs.EObjType.circle);
    return circle.length();
}

/**
 * Returns a point by evaluating the position along a circle.
 * The position is specified by a t parameter that starts at 0 and ends at 1.
 * If the circle object is closed, 0 and 1 will have the same position.
 * Values for of t<0 and t>1 are valid, they will loop around.
 * If the circle object is an open arc, the 0 will be the start of the arc, and 1 will be the end of the arc.
 * Values for of t<0 and t>1 are automatically converted to 0 and 1 respectively.
 *
 * @param circle Cricle object to evaluate.
 * @param t Parameter to evaluate (0 is the start of the circular arc, 1 is the end of the circular arc)
 * @returns Point.
 */
export function evalParam(circle: gs.ICircle, t: number): gs.IPoint {
    error.checkObj(circle, gs.EObjType.circle);
    error.checkNum(t);
    if (circle.isClosed()) {
        if (t < 0) {t = (t % 1) + 1;}
        if (t > 1) {t = (t % 1) - 1;}
    } else {
        if (t < 0) {t = 0;}
        if (t > 1) {t = 1;}
    }
    return circle.evalParam(t);
}

/**
 * Returns a tangent unit vector by evaluating the position along a circle.
 * The position is specified by a t parameter that starts at 0 and ends at 1.
 * If the circle object is closed, 0 and 1 will have the same position.
 * Values for of t<0 and t>1 are valid, they will loop around.
 * If the circle object is an open arc, the 0 will be the start of the arc, and 1 will be the end of the arc.
 * Values for of t<0 and t>1 are automatically converted to 0 and 1 respectively.
 *
 * @param circle Cricle object to evaluate.
 * @param t Parameter to evaluate (0 is the start of the circular arc, 1 is the end of the circular arc)
 * @returns Tangent unit vector (a list of three numbers).
 */
export function evalParamTangent(circle: gs.ICircle, t: number): gs.XYZ {
    error.checkObj(circle, gs.EObjType.circle);
    error.checkNum(t);
    if (circle.isClosed()) {
        if (t < 0) {t = (t % 1) + 1;}
        if (t > 1) {t = (t % 1) - 1;}
    } else {
        if (t < 0) {t = 0;}
        if (t > 1) {t = 1;}
    }
    return circle.evalParamTangent(t);
}

/**
 * Returns a t parameter by projecting a point onto a circle.
 * The t parameter represents a position on the circle.
 * The parameter starts at 0 and ends at 1.
 * If the circle object is closed, 0 and 1 will have the same position.
 * If the circle object is an open arc, the 0 will be the start of the arc, and 1 will be the end of the arc.
 * The point is projected onto the closest point on the circle, and t is then caclulated for that point.
 *
 * @param circle Cricle object to evaluate.
 * @param point The point to be projected onto the circle or arc.
 * @returns t parameter.
 */
export function evalPoint(circle: gs.ICircle, point: gs.IPoint): number {
    error.checkObj(circle, gs.EObjType.circle);
    error.checkPoint(point);
    return circle.evalPoint(point);
}

/**
 * Returns two polylines that are tangential (inner tangents) to two coplanar circles.
 *
 * @param circle1 The first circle.
 * @param circle2 The second circle.
 * @returns Two polylines, or null if inner tangents cannot be calculated.
 */
export function tangentPlinesInner2D(circle1: gs.ICircle, circle2: gs.ICircle, ): [gs.IPolyline, gs.IPolyline] {
    error.checkObj(circle1, gs.EObjType.circle);
    error.checkObj(circle2, gs.EObjType.circle);
    error.checkObjsSameModel([circle1, circle2]);
    return circles.innerTangentsCircleCircle2D(circle1, circle2);
}

/**
 * Returns two polylines that are tangential (outer tangents) to two coplanar circles.
 *
 * @param circle1 The first circle.
 * @param circle2 The second circle.
 * @returns Two polylines, or null if outer tangents cannot be calculated.
 */
export function tangentPlinesOuter2D(circle1: gs.ICircle, circle2: gs.ICircle, ): [gs.IPolyline, gs.IPolyline] {
    error.checkObj(circle1, gs.EObjType.circle);
    error.checkObj(circle2, gs.EObjType.circle);
    error.checkObjsSameModel([circle1, circle2]);
    return circles.outerTangentsCircleCircle2D(circle1, circle2);
}

