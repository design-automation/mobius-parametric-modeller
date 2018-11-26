/**
 * Function for intersecting geometric objects.
 */

/**
 * Intersect functions find points of intersection where the geometry of two objects intersect.
 * The functions return the intersections and overlaps and do not alter the original input objects.
 * Intersecting can be done either in 2D or in 3D, as indicated by the name of the intersect function.
 * The result of a intersect function will vary depending on the types of objects being intersected.
 */

import * as gs from "gs-json";
import * as three from "three";
import * as threex from "./libs/threex/threex";
import * as circles from "./libs/conics/circles";
import * as poly from "./libs/poly/poly";
import * as polylinePlane from "./libs/poly/polylinePlane";
import * as error from "./_error_msgs_dev";

//  ===============================================================================================================
//  Intersect Functions ===========================================================================================
//  ===============================================================================================================

/**
 * Finds the intersection points between two intersecting co-planar circles.
 *
 * @param circle1 Circle 1
 * @param circle2 Circle 2
 * @returns List of intersection points.
 */
export function circleCircle2D(circle1: gs.ICircle, circle2: gs.ICircle): gs.IPoint[] {
    error.checkObjList([circle1, circle2], 2, gs.EObjType.circle);
    return circles.isectCircleCircle2D(circle1, circle2);
}

/**
 * Finds the intersection points between two coplanar polylines.
 *
 * @param pline1 Polyline 1
 * @param pline2 Polyline 2
 * @returns List of intersection points.
 */
export function polylinePolyline2D(pline1: gs.IPolyline, pline2: gs.IPolyline): gs.IPoint[] {
    error.checkObjList([pline1, pline2], 2, gs.EObjType.polyline);
    return poly._isectPolylinePolyline2D(pline1, pline2);
}

/**
 * Finds the intersection points between a circle and a plane.
 * If no intersection points are found, or if the circle and plane are co-planar,
 * an empty list is returned.
 *
 * @param circle Circle
 * @param plane Plane
 * @returns List of intersection points (0, 1 or 2).
 */
export function circlePlane3D(circle: gs.ICircle, plane: gs.IPlane): gs.IPoint[] {
    error.checkObj(circle, gs.EObjType.circle);
    error.checkObj(plane, gs.EObjType.plane);
    error.checkObjsSameModel([circle, plane]);
    return circles.isectCirclePlane3D(circle, plane);
}

/**
 * Finds the intersection points between a polyine and a plane.
 * If no intersection points are found, an empty list is returned.
 *
 * @param pline Polyline
 * @param plane Plane
 * @returns List of intersection points.
 */
export function polylinePlane3D(pline: gs.IPolyline, plane: gs.IPlane): gs.IPoint[] {
    const model: gs.IModel = error.checkObj(pline, gs.EObjType.polyline);
    error.checkObj(plane, gs.EObjType.plane);
    error.checkObjsSameModel([pline, plane]);
    return polylinePlane.isectPolylinePlane3D(pline, plane);
}
