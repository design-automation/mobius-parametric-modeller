import * as gs from "gs-json";
import * as threex from "./libs/threex/threex";
import * as conic from "./libs/conics/circles";

//  ===============================================================================================================
//  Intersect Functions ===========================================================================================
//  ===============================================================================================================

/**
 * Returns the intersection points and/or overlapping arcs of two intersecting co-planar conic curves
 *
 * List of points returned is in order (starts from t=0 to t=1 of curve_1)<br/>
 * Conic curves must lie on the same plane<br/>
 * Returns null if conic curves are not co-planar<br/>
 * Returns null if conic curves do not intersect
 * @param curve1 Conic curve 1
 * @param curve2 Conic curve 2
 * @returns List of intersection points and/or overlapping arcs if successful,
 *          null if unsuccessful or on error
 */
// export function conicConic2D(curve1: gs.ICircle|gs.IEllipse, curve2: gs.ICircle|gs.IEllipse): gs.IPoint[] {
//     // check that the curves have the same plane
//     if (!threex.planesAreCoplanar(curve1.getOrigin(), curve1.getAxes()[2],
//         curve2.getOrigin(), curve2.getAxes()[2])) { return null; }
//     // calculate the intersection points
//     if (curve1.getObjType() === gs.EObjType.circle) {
//         if(curve2.getObjType() === gs.EObjType.circle) {
//             return conic._isectCircleCircle2D(curve1 as gs.ICircle, curve2  as gs.ICircle);
//         } else {
//             return conic._isectCircleEllipse2D(curve1 as gs.ICircle, curve2  as gs.IEllipse);
//         }
//     } else  {
//         if(curve2.getObjType() === gs.EObjType.circle) {
//             return conic._isectCircleEllipse2D(curve2 as gs.ICircle, curve1 as gs.IEllipse);
//         } else {
//             return conic._isectEllipseEllipse2D(curve1 as gs.IEllipse, curve2  as gs.IEllipse);
//         }
//     }
// }

/**
 * Returns the intersection points and/or overlapping arcs of a conic curve and an intersecting plane
 *
 * List of entities returned is in order (starts from t=0 to t=1 of curve)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if curve and plane do not intersect
 * @param curve Conic curve
 * @param plane Plane
 * @returns List of intersection points and/or overlapping arcs if successful,
 *          null if unsuccessful or on error
 */
export function conicPlane(curve: gs.ICircle|gs.IEllipse, plane: gs.IPlane): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points of a co-planar conic curve and polyline
 *
 * List of points returned is in order (starts from t=0 to t=1 of curve)<br/>
 * Conic curve and polyline must be parallel and lie on the same plane<br/>
 * Returns null if curve and pline are not co-planar<br/>
 * Returns null if curve and pline do not intersect
 * @param curve Conic curve
 * @param pline Polyline
 * @returns List of intersection points if successful, null if unsuccessful or on error
 */
export function conicPline2D(curve: gs.ICircle|gs.IEllipse, pline: gs.IPolyline): gs.IPoint[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping arcs of a conic curve and a polymesh
 *
 * List of entities returned is in order (starts from t=0 to t=1 of curve)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if curve and polymesh do not intersect
 * @param curve Conic curve
 * @param pmesh Polymesh
 * @returns List of intersection points and/or overlapping arcs if successful,
 *          null if unsuccessful or on error
 */
export function conicPmesh(curve: gs.ICircle|gs.IEllipse, pmesh: gs.IPolymesh): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points of a conic curve and a ray
 *
 * List of points returned is in order (starts from t=0 to t=1 of curve)<br/>
 * Returns null if curve and ray do not intersect
 * @param curve Conic curve
 * @param ray Ray
 * @returns List of intersection points if successful, null if unsuccessful or on error
 */
export function conicRay(curve: gs.ICircle|gs.IEllipse, ray: gs.IRay): gs.IPoint[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping segments of two intersecting co-planar polylines
 *
 * List of entities returned is in order (starts from t=0 to t=1 of pline_1)<br/>
 * List must be cast before being used for other functions<br/>
 * Polylines must be parallel and lie on the same plane<br/>
 * Returns null if polylines are not co-planar<br/>
 * Returns null if polylines do not intersect
 * @param pline_1 Polyline 1
 * @param pline_2 Polyline 2
 * @returns List of intersection points and/or overlapping segments if successful,
 *          null if unsuccessful or on error
 */
export function plinePline2D(pline_1: gs.IPolyline, pline_2: gs.IPolyline): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping segments of two intersecting polylines
 *
 * List of entities returned is in order (starts from t=0 to t=1 of pline_1)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polylines do not intersect
 * @param pline_1 Polyline 1
 * @param pline_2 Polyline 2
 * @returns List of intersection points and/or overlaping segments if successful,
 *          null if unsuccessful or on error
 */
export function plinePline(pline_1: gs.IPolyline, pline_2: gs.IPolyline): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping segments of a polyline and an intersecting plane
 *
 * List of entities returned is in order (starts from t=0 to t=1 of pline)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polyline and plane do not intersect
 * @param pline Polyline
 * @param plane Plane
 * @returns List of intersection points and/or overlapping segments if successful,
 *          null if unsuccessful or on error
 */
export function plinePlane(pline: gs.IPolyline, plane: gs.IPlane): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping segments of a polyline and a polymesh
 *
 * List of entities returned is in order (starts from t=0 to t=1 of pline)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polyline and polymesh do not intersect
 * @param pline Polyline
 * @param pmesh Polymesh
 * @returns List of intersection points and/or overlapping segments if successful,
 *          null if unsuccessful or on error
 */
export function plinePmesh(pline: gs.IPolyline, pmesh: gs.IPolymesh): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping segments of a polyline and a ray
 *
 * List of entities returned is in order (starts from t=0 to t=1 of pline)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polyline and ray do not intersect
 * @param pline Polyline
 * @param ray Ray
 * @returns List of intersection points and/or overlapping segments if successful,
 *          null if unsuccessful or on error
 */
export function plineRay(pline: gs.IPolyline, ray: gs.IRay): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or intersecting edges and/or overlapping polymeshes of two intersecting
 * polymeshes
 *
 * List of entities returned is in order (starts from face 0 of pmesh_1)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polymeshes do not intersect
 * @param pmesh_1 Polymesh 1
 * @param pmesh_2 Polymesh 2
 * @returns List of intersection points and/or intersecting edges and/or overlapping polymeshes if successful,
 *          null if unsuccessful or on error
 */
export function pmeshPmesh(pmesh_1: gs.IPolymesh, pmesh_2: gs.IPolymesh): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or intersecting edges and/or overlapping polymeshes of a polymesh and
 * an intersecting plane
 *
 * List of entities returned is in order (starts from face 0 of pmesh)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polymesh and plane do not intersect
 * @param pmesh Polymesh
 * @param plane Plane
 * @returns List of intersection points and/or intersecting edges and/or overlapping polymeshes if successful,
 *          null if unsuccessful or on error
 */
export function pmeshPlane(pmesh: gs.IPolymesh, plane: gs.IPlane): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection points and/or overlapping segments of a polymesh and a ray
 *
 * List of entities returned is in order (starts from face 0 of pmesh)<br/>
 * List must be cast before being used for other functions<br/>
 * Returns null if polymesh and ray do not intersect
 * @param pmesh Polymesh
 * @param ray Ray
 * @returns List of intersection points and/or overlapping segments if successful,
 *          null if unsuccessful or on error
 */
export function pmeshRay(pmesh: gs.IPolymesh, ray: gs.IRay): gs.IEnt[] {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersecting edge of two non-coplanar intersecting planes
 *
 * Returns null if planes do not intersect<br/>
 * Returns null if planes are co-planar
 * @param plane_1 Plane
 * @param plane_2 Plane
 * @returns Intersecting edge as a ray if successful, null if unsuccessful or on error
 */
export function planePlane(plane_1: gs.IPlane, plane_2: gs.IPlane): gs.IRay {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection point of a non-coplanar plane and ray
 *
 * Returns null if plane and ray do not intersect<br/>
 * Returns null if plane and ray are co-planar
 * @param plane Plane
 * @param ray Ray
 * @returns Intersection point if successful, null if unsuccessful or on error
 */
export function planeRay(plane: gs.IPlane, ray: gs.IRay): gs.IPoint {
    throw new Error("Method not implemented");
}

/**
 * Returns the intersection point 2 intersecting rays
 *
 * Returns null if rays do not intersect
 * @param ray_1 Ray 1
 * @param ray_2 Ray 1
 * @returns Intersection point if successful, null if unsuccessful or on error
 */
export function rayRay(ray_1: gs.IRay, ray_2: gs.IRay): gs.IPoint {
    throw new Error("Method not implemented");
}
