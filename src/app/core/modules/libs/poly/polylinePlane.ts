import * as gs from "gs-json";
import * as three from "three";
import * as threex from "../threex/threex";

const EPS: number = 1e-6;

/**
 * Split polylines with a plane.
 */
export function splitPolylinePlane3D(pline: gs.IPolyline, plane: gs.IPlane): gs.IPolyline[] {
    const model: gs.IModel = pline.getModel();
    const points: gs.IPoint[] = pline.getPointsArr();
    const origin: gs.IPoint = plane.getOrigin();
    const axes: [gs.XYZ, gs.XYZ, gs.XYZ] = plane.getAxes();
    // Add points for closed polylines
    if (pline.isClosed()) {points.push(points[0]);}
    // Create vpoints
    const vpoints: three.Vector3[] = points.map((p) => new three.Vector3(...p.getPosition()));
    const vaxes: three.Vector3[] = axes.map((a) => new three.Vector3(...a));
    const vorigin: three.Vector3 = new three.Vector3(...origin.getPosition());
    // Create the matrixes to transform between 3d and 2d
    const matrix_neg: three.Matrix4 = threex.xformMatrixNeg(vorigin, vaxes[0], vaxes[1]);
    const matrix_pos: three.Matrix4 = threex.xformMatrixPos(vorigin, vaxes[0], vaxes[1]);
    // Project the polyline points
    for (const vpoint of vpoints) {
        vpoint.applyMatrix4(matrix_neg);
    }
    // Loop through each edge and check for intersections
    let pline_points_array: gs.IPoint[][] = [];
    let pline_points: gs.IPoint[] = [];
    for (let i = 0; i < vpoints.length - 1; i++) {
        pline_points.push(points[i]);
        const line1_start: three.Vector3 = vpoints[i];
        const line1_end: three.Vector3 = vpoints[i+1];
        const result: three.Vector3 =_isectLineXYPlane3D(line1_start, line1_end);
        if (result !== null) {
            const xyz: gs.XYZ = result.applyMatrix4(matrix_pos).toArray() as gs.XYZ;
            const isect_point: gs.IPoint = model.getGeom().addPoint(xyz);
            pline_points.push(isect_point);
            pline_points_array.push(pline_points);
            pline_points = [isect_point];
        }
        if (i === vpoints.length - 2) {
            pline_points.push(points[i + 1]);
            pline_points_array.push(pline_points);
        }
    }
    if (pline_points_array.length === 1) {return null; }
    if (pline.isClosed() && pline_points_array.length > 2) {
        const first: gs.IPoint[] = pline_points_array[0];
        const last: gs.IPoint[] = pline_points_array.pop();
        last.push(...first);
        pline_points_array[0] = last;
    }
    return pline_points_array.map((pts) => model.getGeom().addPolyline(pts, false));
}

/**
 * Isect polylines with a plane.
 */
export function isectPolylinePlane3D(pline: gs.IPolyline, plane: gs.IPlane): gs.IPoint[] {
    const model: gs.IModel = pline.getModel();
    const points: gs.IPoint[] = pline.getPointsArr();
    const origin: gs.IPoint = plane.getOrigin();
    const axes: [gs.XYZ, gs.XYZ, gs.XYZ] = plane.getAxes();
    // Add points for closed polylines
    if (pline.isClosed()) {points.push(points[0]);}
    // Create vpoints
    const vpoints: three.Vector3[] = points.map((p) => new three.Vector3(...p.getPosition()));
    const vaxes: three.Vector3[] = axes.map((a) => new three.Vector3(...a));
    const vorigin: three.Vector3 = new three.Vector3(...origin.getPosition());
    // Create the matrixes to transform between 3d and 2d
    const matrix_neg: three.Matrix4 = threex.xformMatrixNeg(vorigin, vaxes[0], vaxes[1]);
    const matrix_pos: three.Matrix4 = threex.xformMatrixPos(vorigin, vaxes[0], vaxes[1]);
    // Project the polyline points
    for (const vpoint of vpoints) {
        vpoint.applyMatrix4(matrix_neg);
    }
    // Loop through each edge and check for intersections
    const isect_points: gs.IPoint[] = [];
    for (let i = 0; i < vpoints.length - 1; i++) {
        const line1_start: three.Vector3 = vpoints[i];
        const line1_end: three.Vector3 = vpoints[i+1];
        const result: three.Vector3 =_isectLineXYPlane3D(line1_start, line1_end);
        if (result !== null) {
            const xyz: gs.XYZ = result.applyMatrix4(matrix_pos).toArray() as gs.XYZ;
            const isect_point: gs.IPoint = model.getGeom().addPoint(xyz);
            isect_points.push(isect_point);
        }
    }
    return isect_points;
}

/**
 * Intersect line with XY plane.
 */
function _isectLineXYPlane3D(line_start: three.Vector3, line_end: three.Vector3): three.Vector3 {
    if (line_start.z === 0) {return  line_start.clone();}
    if (line_end.z === 0) {return  line_end.clone();}
    if ((line_start.z * line_end.z) > 0) {return null;}
    const start_z: number = Math.abs(line_start.z);
    const end_z: number = Math.abs(line_end.z);
    const scalar_z: number = start_z / (start_z + end_z);
    const line_vec: three.Vector3 = new three.Vector3()
        .subVectors(line_end, line_start).multiplyScalar(scalar_z);
    return new three.Vector3().addVectors(line_start, line_vec);
}
