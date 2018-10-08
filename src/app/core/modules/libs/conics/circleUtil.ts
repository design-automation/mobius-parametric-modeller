import * as gs from "gs-json";
import * as mathjs from "mathjs";
import * as three from "three";
import * as threex from "../threex/threex";
const EPS = 1e-6;

/**
 * Check if a points is within the circle arc
 * @param circle
 * @param point
 * @returns True is it is inside
 */
export function pointInCircle(circle: gs.ICircle, point: gs.IPoint) {
    if (circle.isClosed()) {return true;}
    // create matrix to map from the 3D plane for circle into the XY plane
    const origin: gs.XYZ = circle.getOrigin().getPosition();
    const axes: [gs.XYZ, gs.XYZ, gs.XYZ] = circle.getAxes();
    const matrix: three.Matrix4 = threex.xformMatrixFromXYZAxes(origin, axes, true);
    // map the point onto the XY plane
    const vpoint: three.Vector3 = new three.Vector3(...point.getPosition());
    vpoint.applyMatrix4(matrix);
    // calculate the angle between the point vector and the x axis, in radians
    let angle_rad = Math.atan2(vpoint.y, vpoint.x);
    if (angle_rad < 0) {angle_rad += (2 * Math.PI); }
    const angle_deg: number = angle_rad * (180 / Math.PI);
    // mow check angle
    return angleInCircle(circle, angle_deg);
}

/**
 * Check if a t value (for closed circle) is within the circle arc
 * @param circle
 * @param t
 * @returns True is it is inside
 */
export function tInCircle(circle: gs.ICircle, t: number) {
    if (circle.isClosed()) {return true;}
    const angle: number = t * (180 / Math.PI);
    return angleInCircle(circle, angle);
}

/**
 * Check if an angle (in degrees) isf within the circle arc
 * @param circle
 * @param angle
 * @returns True is it is inside
 */
export function angleInCircle(circle: gs.ICircle, angle: number) {
    if (circle.isClosed()) {return true;}
    // convert angle to 0 to 360
    if (angle < 0) {angle = 360 + (angle % 360);}
    if (angle > 360) {angle = angle % 360;}
    // get the angles, calc start and end, incl EPS
    const angles: [number, number] = circle.getAngles();
    const start: number = angles[0] - EPS;
    const end: number = angles[1] + EPS;
    // return result
    if (angles[0] < angles[1]) {
        if ((angle >= start) && (angle <= end)) {return true;}
    } else {
        if ((angle >= start) || (angle <= end)) {return true;}
    }
    return false;
}
