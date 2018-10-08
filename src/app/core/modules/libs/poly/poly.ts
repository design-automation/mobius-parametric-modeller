import * as gs from "gs-json";
import * as three from "three";
import * as threex from "../threex/threex";

const EPS: number = 1e-6;

/**
 * Get a normal from a face vertex
 */
export function getVertexNormal(vertex: gs.IVertex): three.Vector3 {
    let next: gs.IVertex = vertex.next();
    let prev: gs.IVertex = vertex.previous();
    let vector_next: three.Vector3 = threex.vectorFromVerticesAtoB(vertex, next);
    let vector_prev: three.Vector3 = threex.vectorFromVerticesAtoB(vertex, prev);
    let normal: three.Vector3 = threex.crossVectors(vector_next, vector_prev);
    //console.log("normal", normal.lengthSq());
    if (normal.lengthSq() > EPS) {return normal;} //TODO normal length looks big
    // this will be executed for degenerate cases, e.g. colinear points

    for (let i = 0; i < vertex.getWireOrFace().numVertices() - 2; i++) {
        if (vector_prev.lengthSq() < EPS) {
            prev = prev.previous();
            vector_prev = threex.vectorFromVerticesAtoB(vertex, prev);
        }
        next = next.next();
        vector_next = threex.vectorFromVerticesAtoB(vertex, next);
        normal = threex.crossVectors(vector_next, vector_prev);
        if (normal.lengthSq() > EPS) {return normal;}
    }
    throw new Error("Failed to get normal from face.");
}

/**
 *  Loop through a list of list of points, and loft.
 *  The lists represent rows, each row has sub lists. The sub lists get lofted.
 */
export function pointsLoftLoop(points_lists: gs.IPoint[][][], is_closed: boolean): gs.IPoint[][] {
    const mesh_points: gs.IPoint[][] = [];
    const num_lists: number = points_lists.length;
    const list_length: number = points_lists[0].length;
    for (let list_pos = 0; list_pos < list_length; list_pos++) {
        const points_list: gs.IPoint[][] = [];
        for (let list_num = 0; list_num < num_lists; list_num++) {
            points_list.push(points_lists[list_num][list_pos]);
        }
        mesh_points.push(...pointsLoft(points_list, is_closed));
    }
    return mesh_points;
}
/**
 *  Generate a nested list of points, ready for creating polymesh faces.
 */
export function pointsLoft(points: gs.IPoint[][], is_closed: boolean): gs.IPoint[][] {
    const mesh_points: gs.IPoint[][] = [];
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = 0; j < points[i].length; j++) {
            if (j < points[i].length - 1) {
                mesh_points.push([points[i][j], points[i][j + 1], points[i + 1][j + 1], points[i + 1][j]]);
            } else {
                if (is_closed) {
                    mesh_points.push([points[i][j], points[i][0], points[i + 1][0], points[i + 1][j]]);
                }
            }
        }
    }
    return mesh_points;
}

/**
 * Moves the end point away from the start point by distance.
 * If create_point is true, then a new point get created, otherwise the existing point gets moved.
 */
export function pointsExtend(start: gs.IPoint, end: gs.IPoint, distance: number, create: boolean = true): gs.IPoint {
    const start_vec: three.Vector3 = new three.Vector3(...start.getPosition());
    const end_vec: three.Vector3 = new three.Vector3(...end.getPosition());
    const dir_vec: three.Vector3 = threex.subVectors(end_vec, start_vec);
    dir_vec.setLength(distance);
    const new_xyz: gs.XYZ = threex.addVectors(end_vec, dir_vec).toArray() as gs.XYZ;
    if (create) {
        const geom: gs.IGeom = start.getGeom();
        return geom.addPoint(new_xyz);
    } else {
        end.setPosition(new_xyz);
        return end;
    }
}

/**
 * Evaluates the position between a sequence of points.
 * A new point is always created.
 */
export function pointsEvaluate(points: gs.IPoint[], t_param: number): gs.IPoint {
    const geom: gs.IGeom = points[0].getGeom();
    if (t_param === 0) {return geom.addPoint(points[0].getPosition());}
    if (t_param === 1) {return geom.addPoint(points[points.length - 1].getPosition());}
    if (t_param < 0 || t_param > 1) {throw new Error("t parameter is out of range");}
    const vec_points: three.Vector3[] = points.map((point) => new three.Vector3(...point.getPosition()));
    const num_segs = points.length - 1;
    const dists_to_segends: number[] = [0];
    let total_length: number = 0;
    for  (let i = 0; i < num_segs; i++) {
        const seg_vec: three.Vector3 = threex.subVectors(vec_points[i+1], vec_points[i]);
        total_length += seg_vec.length();
        dists_to_segends.push(total_length);
    }
    const t_mapped = t_param * total_length;
    for  (let i = 0; i < vec_points.length - 1; i++) {
        if (t_mapped >= dists_to_segends[i] && t_mapped < dists_to_segends[i + 1]) {
            const start_seg: three.Vector3 = vec_points[i];
            const end_seg: three.Vector3 = vec_points[i + 1];
            const seg_vec: three.Vector3 = threex.subVectors(end_seg, start_seg);
            const start_dist: number = dists_to_segends[i];
            seg_vec.setLength(t_mapped - start_dist);
            const xyz: gs.XYZ = threex.addVectors(start_seg, seg_vec).toArray() as gs.XYZ;
            return geom.addPoint(xyz);
        }
    }
    throw new Error("Something went wrong evaluating the t parameter.");
}

/**
 * Intersect polylines.
 */
export function _isectPolylinePolyline2D(pline1: gs.IPolyline, pline2: gs.IPolyline): gs.IPoint[] {
    const model: gs.IModel = pline1.getModel();
    const points1: gs.IPoint[] = pline1.getPointsArr();
    const points2: gs.IPoint[] = pline2.getPointsArr();
    // Add points for closed polylines
    if (pline1.isClosed()) {points1.push(points1[0]);}
    if (pline2.isClosed()) {points2.push(points2[0]);}
    // Create vpoints
    const points1_vec: three.Vector3[] = points1.map((p) => new three.Vector3(...p.getPosition()));
    const points2_vec: three.Vector3[] = points2.map((p) => new three.Vector3(...p.getPosition()));
    const ortho_vecs: [three.Vector3, three.Vector3] = threex.orthoVectorsFromPlanarVPoints(
            [...points1_vec, ...points2_vec]);
    // Create the matrixes to transform between 3d and 2d
    if (ortho_vecs === null) {
        throw new Error("Entities must be coplanar.");
    }
    const matrix_neg: three.Matrix4 = threex.xformMatrixNeg(
        points1_vec[0], ortho_vecs[0], ortho_vecs[1]);
    const matrix_pos: three.Matrix4 = threex.xformMatrixPos(
        points1_vec[0], ortho_vecs[0], ortho_vecs[1]);
    // Make the polyline points 2D, and also check that they really are 2d
    for (const point of points1_vec) {
        point.applyMatrix4(matrix_neg);
        if (Math.abs(point.z) > EPS) {return null;}
    }
    for (const point of points2_vec) {
        point.applyMatrix4(matrix_neg);
        if (Math.abs(point.z) > EPS) {return null;}
    }
    // Loop through each edge and check for intersections
    const isect_points: gs.IPoint[] = [];
    for (let i = 0; i < points1_vec.length - 1; i++) {
        const line1_start: three.Vector3 = points1_vec[i];
        const line1_end: three.Vector3 = points1_vec[i+1];
        for (let j = 0; j < points2_vec.length - 1; j++) {
            const line2_start: three.Vector3 = points2_vec[j];
            const line2_end: three.Vector3 = points2_vec[j+1];
            const result: {isect_point: three.Vector3, t1: number, t2: number} =
                _isectLineLine2D(line1_start, line1_end, line2_start, line2_end);
            if (result !== null) {
                const xyz: gs.XYZ = result.isect_point.applyMatrix4(matrix_pos).toArray() as gs.XYZ;
                const isect_point: gs.IPoint = model.getGeom().addPoint(xyz);
                // add the point
                isect_points.push(isect_point);
            }
        }
    }
    return isect_points;
}

/**
 * Split polylines.
 */
export function _splitPolylinePolyline2D(pline1: gs.IPolyline, pline2: gs.IPolyline): gs.IPolyline[][] {
    const model: gs.IModel = pline1.getModel();
    const points1: gs.IPoint[] = pline1.getPointsArr();
    const points2: gs.IPoint[] = pline2.getPointsArr();
    // Add points for closed polylines
    if (pline1.isClosed()) {points1.push(points1[0]);}
    if (pline2.isClosed()) {points2.push(points2[0]);}
    // Create vpoints
    const points1_vec: three.Vector3[] = points1.map((p) => new three.Vector3(...p.getPosition()));
    const points2_vec: three.Vector3[] = points2.map((p) => new three.Vector3(...p.getPosition()));
    const ortho_vecs: [three.Vector3, three.Vector3] = threex.orthoVectorsFromPlanarVPoints(
            [...points1_vec, ...points2_vec]);
    // Create the matrixes to transform between 3d and 2d
    if (ortho_vecs === null) {
        throw new Error("Entities must be coplanar.");
    }
    const matrix_neg: three.Matrix4 = threex.xformMatrixNeg(
        points1_vec[0], ortho_vecs[0], ortho_vecs[1]);
    const matrix_pos: three.Matrix4 = threex.xformMatrixPos(
        points1_vec[0], ortho_vecs[0], ortho_vecs[1]);
    // Make the polyline points 2D, and also check that they really are 2d
    for (const point of points1_vec) {
        point.applyMatrix4(matrix_neg);
        if (Math.abs(point.z) > EPS) {return null;}
    }
    for (const point of points2_vec) {
        point.applyMatrix4(matrix_neg);
        if (Math.abs(point.z) > EPS) {return null;}
    }
    // Loop through each edge and check for intersections
    const isect1_map: Map<number, {t:number, isect_point:gs.IPoint}[]> = new Map();
    const isect2_map: Map<number, {t:number, isect_point:gs.IPoint}[]> = new Map();
    for (let i = 0; i < points1_vec.length - 1; i++) {
        const line1_start: three.Vector3 = points1_vec[i];
        const line1_end: three.Vector3 = points1_vec[i+1];
        for (let j = 0; j < points2_vec.length - 1; j++) {
            const line2_start: three.Vector3 = points2_vec[j];
            const line2_end: three.Vector3 = points2_vec[j+1];
            const result: {isect_point: three.Vector3, t1: number, t2: number} =
                _isectLineLine2D(line1_start, line1_end, line2_start, line2_end);
            if (result !== null) {
                const xyz: gs.XYZ = result.isect_point.applyMatrix4(matrix_pos).toArray() as gs.XYZ;
                const isect_point: gs.IPoint = model.getGeom().addPoint(xyz);
                // add the point for pline1
                if (!isect1_map.has(i)) {isect1_map.set(i, []);}
                isect1_map.get(i).push({t:result.t1, isect_point:isect_point});
                // add the point for pline2
                if (!isect2_map.has(j)) {isect2_map.set(j, []);}
                isect2_map.get(j).push({t:result.t2, isect_point:isect_point});
            }
        }
    }
    // make the list of points for pline 1
    const new_points1: gs.IPoint[][] = [[points1[0]]];
    for (let i = 0; i < points1.length - 1; i++) {
        if (isect1_map.has(i)) {
            // sort the points in the list by t value
            const isects: {t:number, isect_point:gs.IPoint}[] = isect1_map.get(i);
            isects.sort((a, b) => a.t - b.t);
            // for each isect, start a new array of points
            for (const isect of isects) {
                new_points1[new_points1.length - 1].push(isect.isect_point);
                new_points1.push([isect.isect_point]);
            }
        }
        // add the next point
        new_points1[new_points1.length - 1].push(points1[i + 1]);
    }
    // if the polyline was closed, then merge first and last lists
    if (pline1.isClosed()) {
        const last: gs.IPoint[] = new_points1[new_points1.length - 1];
        last.push(...new_points1[0])
        new_points1[0] = last;
        new_points1.pop();
    }
    // make the list of points for pline 2
    const new_points2: gs.IPoint[][] = [[points2[0]]];
    for (let i = 0; i < points2.length - 1; i++) {
        if (isect2_map.has(i)) {
            // sort the points in the list by t value
            const isects: {t:number, isect_point:gs.IPoint}[] = isect2_map.get(i);
            isects.sort((a, b) => a.t - b.t);
            // for each isect, start a new array of points
            for (const isect of isects) {
                new_points2[new_points2.length - 1].push(isect.isect_point);
                new_points2.push([isect.isect_point]);
            }
        }
        // add the next point
        new_points2[new_points2.length - 1].push(points2[i + 1]);
    }
    // if the polyline was closed, then merge first and last lists
    if (pline2.isClosed()) {
        const last: gs.IPoint[] = new_points2[new_points2.length - 1];
        last.push(...new_points2[0])
        new_points2[0] = last;
        new_points2.pop();
    }
    // delete the old plines
    model.getGeom().delObjs([pline1, pline2], true);
    // return an array of new plines
    const new_plines1: gs.IPolyline[] = new_points1.map((pts) => model.getGeom().addPolyline(pts, false));
    const new_plines2: gs.IPolyline[] = new_points2.map((pts) => model.getGeom().addPolyline(pts, false));
    return [new_plines1, new_plines2];
}

/**
 * Intersect lines.
 * http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
 */
function _isectLineLine2D(line1_start: three.Vector3, line1_end: three.Vector3,
                          line2_start: three.Vector3, line2_end: three.Vector3):
    {isect_point: three.Vector3, t1: number, t2: number} {
    const denominator: number =
        ((line2_end.y - line2_start.y) * (line1_end.x - line1_start.x)) -
        ((line2_end.x - line2_start.x) * (line1_end.y - line1_start.y));
    // lines are parallel
    if (denominator === 0) {return null;}
    // calc intersection
    let t1: number = line1_start.y - line2_start.y;
    let t2: number = line1_start.x - line2_start.x;
    const numerator1: number = ((line2_end.x - line2_start.x) * t1) - ((line2_end.y - line2_start.y) * t2);
    const numerator2: number = ((line1_end.x - line1_start.x) * t1) - ((line1_end.y - line1_start.y) * t2);
    t1 = numerator1 / denominator;
    t2 = numerator2 / denominator;
    // check intersection point is on both line segments
    if ((t1 <= 0) || (t1 > 1)) {return null;}
    if ((t2 <= 0) || (t2 > 1)) {return null;}
    // intersection point
    const result_x: number = line1_start.x + (t1 * (line1_end.x - line1_start.x));
    const result_y: number = line1_start.y + (t1 * (line1_end.y - line1_start.y));
    // return the result
    return {isect_point: new three.Vector3(result_x, result_y, 0), t1: t1, t2: t2} ;
}
