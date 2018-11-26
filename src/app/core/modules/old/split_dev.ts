import * as gs from "gs-json";

//  ===============================================================================================================
//  Split Functions ===============================================================================================
//  ===============================================================================================================

// - WEEK 2 -
/**
 * Splits 2 intersecting co-planar conic curves at their intersection points
 *
 * Lists of curves returned is in order (starts from t=0 to t=1 of curve_1 and curve_2)<br/>
 * Conic curves must be parallel and lie on the same plane<br/>
 * Returns null if conic curves are not co-planar<br/>
 * Returns null if conic curves do not intersect
 * @param curve_1 Conic curve 1
 * @param curve_2 Conic curve 2
 * @param copy Peforms split function on duplicate copies of input curves
 * @returns List of new conic curves if successful, none if unsuccessful or on error
 *          ([[List of curves from curve_1],[List of curves from curve_2]])
 */
export function conicConic2D(curve_1: gs.ICircle|gs.IEllipse, curve_2: gs.ICircle|gs.IEllipse, copy: boolean): [gs.ICircle|gs.IEllipse[],gs.ICircle|gs.IEllipse[]] {
    throw new Error("Method not implemented");
}

/**
 * Splits a conic curve using an intersecting plane at their intersection points
 *
 * List of curves returned is in order (starts from t=0 to t=1 of curve)<br/>
 * Returns null if conic curve and plane do not intersect
 * @param curve Conic curve
 * @param plane Plane
 * @param copy Peforms split function on duplicate copies of input curve
 * @returns List of new conic curves if successful, none if unsuccessful or on error
 */
export function conicPlane(curve: gs.ICircle|gs.IEllipse, plane: gs.IPlane, copy: boolean): gs.ICircle|gs.IEllipse[] {
    throw new Error("Method not implemented");
}

/**
 * Splits a coplanar conic curve and polyline at their intersection points
 *
 * Lists of curves and polylines returned is in order (starts from t=0 to t=1 of curve and pline)<br/>
 * Conic curve and polyline must be parallel and lie on the same plane<br/>
 * Returns null if conic curve and polyline are not co-planar<br/>
 * Returns null if conic curve and polyline do not intersect
 * @param curve Conic curve
 * @param pline Polyline
 * @param copy Peforms split function on duplicate copies of input curve and polyline
 * @returns List of new conic curves and polylines if successful, none if unsuccessful or on error
 *          ([[List of curves from curve],[List of polylines from pline]])
 */
export function conicPline2D(curve: gs.ICircle|gs.IEllipse, pline: gs.IPolyline, copy: boolean): [gs.ICircle|gs.IEllipse[],gs.IPolyline[]] {
    throw new Error("Method not implemented");
}

/**
 * Splits a conic curve and a polymesh at their intersection points and/or intersecting edges
 *
 * Lists of curves and polymeshes returned is in order (starts from t=0 to t=1 of curve and face 0 of
 * pmesh)<br/>
 * Returns null if conic curve and polymesh do not intersect<
 * @param curve Conic curve
 * @param pmesh Polymesh
 * @param copy Peforms split function on duplicate copies of input curve and polymesh
 * @returns List of new conic curves and polymeshes if successful, none if unsuccessful or on error
 */
export function conicPmesh(curve: gs.ICircle|gs.IEllipse, pmesh: gs.IPolymesh, copy: boolean): [gs.ICircle|gs.IEllipse[],gs.IPolymesh[]] {
    throw new Error("Method not implemented");
}

/**
 * Splits 2 coplanar intersecting polylines at their intersection points
 *
 * Lists of polylines returned is in order (starts from t=0 to t=1 of pline_1 and pline_2)<br/>
 * Polylines must be parallel and lie on the same plane<br/>
 * Returns null if polylines are not co-planar<br/>
 * Returns null if polylines do not intersect
 * @param pline_1 Polyline 1
 * @param pline_2 Polyline 2
 * @param copy Peforms split function on duplicate copies of input polylines
 * @returns List of new polylines if successful, none if unsuccessful or on error
 *          ([[List of polylines from pline_1],[List of polylines from pline_2]])
 */
export function plinePline2D(pline_1: gs.IPolyline, pline_2: gs.IPolyline, copy: boolean): [gs.IPolyline[],gs.IPolyline[]] {
    throw new Error("Method not implemented");
}

/**
 * Splits a polyline using an intersecting plane at their intersection points
 *
 * List of polylines returned is in order (starts from t=0 to t=1 of pline)<br/>
 * Returns null if polylines do not intersect
 * @param pline Polyline
 * @param plane Plane
 * @param copy Peforms split function on duplicate copies of input polyline
 * @returns List of new polylines if successful, none if unsuccessful or on error
 */
export function plinePlane(pline: gs.IPolyline, plane: gs.IPlane, copy: boolean): gs.IPolyline[] {
    throw new Error("Method not implemented");
}

/**
 * Splits a polyline and a polymesh at their intersection points and/or intersecting edges
 *
 * Lists of polylines and polymeshes returned is in order (starts from t=0 to t=1 of pline and face 0 of
 * pmesh)<br/>
 * Returns null if polyline and polymesh do not intersect
 * @param pline Polyline
 * @param pmesh Polymesh
 * @param copy Peforms split function on duplicate copies of input polyline and polymesh
 * @returns List of new polylines and polymeshes if successful, none if unsuccessful or on error
 */
export function plinePmesh(pline: gs.IPolyline, pmesh: gs.IPolymesh, copy: boolean): [gs.IPolyline[],gs.IPolymesh[]] {
    throw new Error("Method not implemented");
}

/**
 * Splits 2 intersecting polymeshes along their intersecting edges
 *
 * Lists of polymeshes returned is in order (starts face 0 of pmesh_1 and pmesh_2)<br/>
 * Returns null if polymeshes do not intersect
 * @param pmesh_1 Polymesh 1
 * @param pmesh_2 Polymesh 2
 * @param copy Peforms split function on duplicate copies of input polymeshes
 * @returns List of new polymeshes if successful, none if unsuccessful or on error
 *          ([[List of polymeshes from pmesh_1],[List of polymeshes from pmesh_2]])
 */
export function pmeshPmesh(pmesh_1: gs.IPolymesh, pmesh_2: gs.IPolymesh, copy: boolean): [gs.IPolymesh[],gs.IPolymesh[]] {
    throw new Error("Method not implemented");
}

/**
 * Splits a polymesh using an intersecting plane along their intersecting edges
 *
 * List of polymeshes returned is in order (starts face 0 of pmesh)<br/>
 * Returns null if polymesh and plane do not intersect
 * @param pmesh Polymesh
 * @param plane Plane
 * @param copy Peforms split function on duplicate copies of input polymesh
 * @returns List of new polylines if successful, none if unsuccessful or on error
 */
export function pmeshPlane(pmesh: gs.IPolymesh, plane: gs.IPlane, copy:boolean): gs.IPolymesh[] {
    throw new Error("Method not implemented");
}
