import * as gs from "gs-json";
import * as three from "three";
import * as threex from "./libs/threex/threex";

//  ===============================================================================================================
//  Plane Constructors ============================================================================================
//  ===============================================================================================================

/**
 * Creates an orthogonal projected point on a plane
 * @param plane on which the orthogonal projection occurs
 * @param point to project
 * @returns New point if successful, null if unsuccessful or an error
 */
export function _PointOrthoProjectPlane(point: gs.IPoint, plane: gs.IPlane): gs.IPoint {
    const m1: gs.IModel = point.getModel();
    const m2: gs.IModel = plane.getModel();
    if(m1 !== m2) { throw new Error("Parameters need to be on the same model");}
    const vectors: gs.XYZ[] = plane.getAxes();
    const norm: number[] = [plane.getCartesians()[0],plane.getCartesians()[1],plane.getCartesians()[2]];
    const U1: three.Vector3 = new three.Vector3(vectors[0][0],vectors[0][1],vectors[0][2]).normalize();
    const W1: three.Vector3 = new three.Vector3(norm[0],norm[1],norm[2]).normalize();
    let V1: three.Vector3 = new three.Vector3();
    V1 = V1.crossVectors(W1,U1).normalize();
    const m: gs.IModel = new gs.Model();
    const _point: three.Vector3 = threex.vectorFromPointsAtoB(plane.getOrigin(),point);
    const _origin: three.Vector3 = threex.vectorFromPointsAtoB(m.getGeom().addPoint([0,0,0]),plane.getOrigin());
    let projected: three.Vector3 = new three.Vector3();
    projected = threex.addVectors(U1.multiplyScalar(U1.dot(_point)),V1.multiplyScalar(V1.dot(_point)),false);
    const p_xyz: three.Vector3 = threex.addVectors(_origin, projected);
    const xyz: number[] = [p_xyz.x,p_xyz.y,p_xyz.z];
    return m1.getGeom().addPoint([p_xyz.x,p_xyz.y,p_xyz.z]);
}

// - WEEK 3 -


//  ===============================================================================================================
//  Old Functions No Longer in API ================================================================================
//  ===============================================================================================================

/**
 * Creates a plane from an origin point and normal direction vector
 * http://developer.rhino3d.com/api/RhinoScriptSyntax/#plane-PlaneFromNormal
 * @param m Model
 * @param origin 3D point to use as origin of plane
 * @param normal 3D vector to define normal direction of plane
 * @param xaxis Vector to use define x-axis of plane (optional)
 * @returns New plane if successful, null if unsuccessful or on error
 */
export function _AddPlane(m: gs.IModel, origin: gs.IPoint, normal: [number, number, number]): gs.IPlane {
     const e3: three.Vector3 = new three.Vector3(...normal).normalize();
     const e1: three.Vector3 = new three.Vector3(-e3.y,e3.x,0).normalize();
     const e2: three.Vector3 = e3.cross(e1);
     return m.getGeom().addPlane(origin, e1.toArray() as gs.XYZ, e2.toArray() as gs.XYZ);
 }

/**
 * Returns intersections between an infinite plane and a curve/polyline object
 * http://developer.rhino3d.com/api/RhinoScriptSyntax/#plane-PlaneCurveIntersection
 * @param m Model
 * @param plane Plane to intersect
 * @param polyline Polyline to intersect
 * @returns List of intersection information if successful, null if unsuccessful or on error.
 * [0] = type of intersection. 1 = point, 2 = overlap
 * [1] = intersection point if [0] = 1, list of intersection start point and end point if [0] = 2
 */
export function _PlanePolylineIntersection(m: gs.IModel, plane: gs.IPlane, polyline: gs.IPolyline): void {
    throw new Error("Method not implemented");
}
