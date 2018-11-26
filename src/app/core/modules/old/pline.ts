/**
 * Functions for working with polylines.
 */

/**
 * Polylines are geometric objects that have no faces and a single wire.
 * The wire has one or more edges and two or more vertices.
 * The edges are straight line segments joining two vertices.
 * The polyline can be either a closed or an open.
 * A closed polyline has not fill. For that, you need to create a polymesh.
 */

import * as gs from "gs-json";
import * as three from "three";
import * as threex from "./libs/threex/threex";
import * as poly from "./libs/poly/poly";
import * as polylinePipe from "./libs/poly/polylinePipe";
import * as utils from "./_utils_dev";
import * as error from "./_error_msgs_dev";
import {Arr} from "./libs/arr/arr";

//  ===============================================================================================================
//  Pline Get and Copy ============================================================================================
//  ===============================================================================================================

/**
 * Gets a polyline from the model based on an ID number.
 * In the viewer, the object label can display (it starts with 'o'), which contains the ID.
 * For example, if the label is "o123", then the ID is the number 123.
 *
 * @param model Model to get polyline object from.
 * @param id ID number of polyline object.
 * @returns Polyline object.
 */
export function Get(model: gs.IModel, id: number): gs.IPolyline {
    const obj: gs.IObj = error.checkObjID(model, id, gs.EObjType.polyline);
    return obj as gs.IPolyline;
}

/**
 * Create a copy of a polyline.
 *
 * @param polyline The polyline to copy.
 * @param copy_attribs If true, attributes are copied to the new circle.
 * @returns Polyline object.
 */
export function Copy(polyline: gs.IPolyline, copy_attribs: boolean = true): gs.IPolyline {
    error.checkObj(polyline, gs.EObjType.polyline);
    return polyline.copy(copy_attribs) as gs.IPolyline;
}

/**
 * Copies a polyline from one model into another model.
 *
 * @param model The model to copy to.
 * @param polyline The polyline object to copy.
 * @returns The copied polyline object in the model.
 */
export function CopyToModel(model: gs.IModel, polyline: gs.IPolyline): gs.IPolyline {
    error.checkObj(polyline, gs.EObjType.polyline);
    if (polyline.getModel() === model) {throw new Error("Error: polyline is already in model.");}
    //return model.getGeom().copyPolylineFromModel(polyline);
    throw new Error("Function not implemented yet...");
}

//  ===============================================================================================================
//  Pline Constructors ============================================================================================
//  ===============================================================================================================

/**
 * Creates a polyline by joining a list of points
 *
 * Straight line segments are cerated between every two points.
 *
 * @param points A list of points.
 * @param is_closed if true,
 *      creates a closed polyline object by joining the last point to the first point.
 * @returns Polyline object.
 */
export function FromPoints(points: gs.IPoint[], is_closed: boolean = false): gs.IPolyline {
    const model: gs.IModel = error.checkPointList(points, 2);
    return model.getGeom().addPolyline(points, is_closed);
}

/**
 * Create a polyline by dividing a circle or arc into straight line segments.
 *
 * If it is a circle, then a a closed polyline is returned.
 *
 * @param circle Circle or circular arc to construct polyline from.
 * @param segments Number of segments in resulting polyline.
 * @returns Polyline object.
 */
export function FromCircle(circle: gs.ICircle, segments: number): gs.IPolyline {
    error.checkObj(circle, gs.EObjType.circle);
    error.checkPosNum(segments);
    const m: gs.IModel = circle.getModel();
    const points: gs.IPoint[] = circle.equiPoints(segments + 1);
    return m.getGeom().addPolyline(points, circle.isClosed());
}

/**
 * Create a polyline with a single straight line segment, connecting two points.
 *
 * @param start Start point of line
 * @param end End point of line.
 * @returns Polyline object.
 */
export function From2Points(start: gs.IPoint, end: gs.IPoint): gs.IPolyline {
    error.checkPoint(start);
    error.checkPoint(end);
    return this.FromPoints([start, end], false);
}

//  ===============================================================================================================
//  Pline Simple Functions ===============================================================================================
//  ===============================================================================================================

/**
 * Checks if the polyline is closed.
 *
 * @param pline Polyline object.
 * @return True if the polyline is closed.
 */
export function isClosed(pline: gs.IPolyline): boolean {
    error.checkObj(pline, gs.EObjType.polyline);
    return pline.isClosed();
}

/**
 * Sets the polyline to be open or closed.
 *
 * @param pline Polyline object.
 * @param is_closed True for closed, false for open.
 * @return True if the value was changed, false otherwise.
 */
export function setIsClosed(pline: gs.IPolyline, is_closed: boolean): boolean {
    error.checkObj(pline, gs.EObjType.polyline);
    if (pline.isClosed() === is_closed) {return false;}
    pline.setIsClosed(is_closed);
    return true;
}

/**
 * Get the number of edges in the polyline.
 *
 * @param pline Polyline object.
 * @return The number of edges.
 */
export function numEdges(pline: gs.IPolyline): number {
    error.checkObj(pline, gs.EObjType.polyline);
    return pline.numEdges();
}

/**
 * Get the number of vertices in the polyline.
 *
 * @param pline Polyline object.
 * @return The number of vertices.
 */
export function numVertices(pline: gs.IPolyline): number {
    error.checkObj(pline, gs.EObjType.polyline);
    return pline.numVertices();
}

/**
 * Get all points in a polyline in sequence order.
 *
 * @param pline Polyline object.
 * @return A list of points.
 */
export function getPoints(pline: gs.IPolyline): gs.IPoint[] {
    error.checkObj(pline, gs.EObjType.polyline);
    return pline.getPointsArr();
}

/**
 * Get the start and end points of a polyline.
 *
 * @param pline Polyline object.
 * @return A list with two points, or null if the polyline is closed.
 */
export function getEndPoints(pline: gs.IPolyline): gs.IPoint[] {
    error.checkObj(pline, gs.EObjType.polyline);
    if (pline.isClosed()) {return null;}
    const points: gs.IPoint[] = pline.getPointsArr();
    return [points[0], points[points.length - 1]];
}

/**
 * Returns a point by evaluating the position along a polyline.
 * The position is specified by a t parameter that starts at 0 and ends at 1.
 * If the polyline is closed, 0 and 1 will have the same position.
 *
 * @param pline Polyline to evaluate.
 * @param t Parameter to evaluate (0 is the start of the polyline, 1 is the end of the polyline)
 * @returns Point.
 */
export function evalParam(pline: gs.IPolyline, t: number): gs.IPoint {
    error.checkObj(pline, gs.EObjType.polyline);
    error.checkPosNum(t);
    const points: gs.IPoint[] = pline.getPointsArr();
    if (pline.isClosed()) {points.push(points[0]); }
    return poly.pointsEvaluate(points, t);
}

//  ===============================================================================================================
//  Pline Modelling Functions ===============================================================================================
//  ===============================================================================================================


/**
 * Divides a polyline. Each edge of the polyline is divided into different numbers of segments.
 * The number of segments for each edge is calculated by dividing the edge length by max_lenth,
 * and then rounding up to the nearest integer.
 *
 * The original polyline is not modified.
 *
 * @param pline The polyline to divide.
 * @param max_length The target maximum length of the segment,
 * may either be a single number or an list of numbers. If it is an list, then
 * the list length must be equal to the number of edges.
 * @returns A new polyline with subdivided edges.
 */
export function divideMaxLength(pline: gs.IPolyline, max_length: number|number[]): gs.IPolyline {
    const model: gs.IModel = error.checkObj(pline, gs.EObjType.polyline);
    const num_edges: number = pline.numEdges();
    if (!Array.isArray(max_length)) {max_length = Arr.make(num_edges, max_length);}
    error.checkNumListLength(max_length, num_edges);
    // get points
    const old_points: gs.IPoint[] = pline.getPointsArr();
    if (pline.isClosed()) {old_points.push(old_points[0]);}
    // create array to store new points
    const new_points: gs.IPoint[] = [];
    // loop through and add points
    for (let i = 0; i < old_points.length - 1; i++) {
        new_points.push(old_points[i]);
        const vp1: three.Vector3 = new three.Vector3(...old_points[i].getPosition());
        const vp2: three.Vector3 = new three.Vector3(...old_points[i + 1].getPosition());
        const num_segments: number = Math.ceil(vp1.distanceTo(vp2) / max_length[i]);
        const vpoints: three.Vector3[] = threex.interpVPoints(vp1, vp2, num_segments - 1);
        for (const vpoint of vpoints) {
            const new_point: gs.IPoint = model.getGeom().addPoint(vpoint.toArray() as gs.XYZ);
            new_points.push(new_point);
        }
    }
    // add last point if pline is open
    if (!pline.isClosed()) {new_points.push(old_points[old_points.length - 1]);}
    // create the new polyline and return it
    return model.getGeom().addPolyline(new_points, pline.isClosed());
}

/**
 * Divides a polyline. Each edge of the polyline is divided into the same number of segments.
 * The original polyline is not modified.
 *
 * @param pline The polyline to divide.
 * @param num_segements The number of segments to create.
 * This may either be a single number or an list of numbers.
 * If it is an list, then the list length must be equal to the number of edges.
 * @returns A new polyline with subdivided edges.
 */
export function divide(pline: gs.IPolyline, num_segments: number|number[]): gs.IPolyline {
    const model: gs.IModel = error.checkObj(pline, gs.EObjType.polyline);
    if (!Array.isArray(num_segments)) {num_segments = Arr.make(pline.numEdges(), num_segments);}
    const num_edges: number = pline.numEdges();
    error.checkPosNums(num_segments);
    error.checkNumListLength(num_segments, num_edges);
    // get points
    const old_points: gs.IPoint[] = pline.getPointsArr();
    if (pline.isClosed()) {old_points.push(old_points[0]);}
    // create array to store new points
    const new_points: gs.IPoint[] = [];
    // loop through and add points
    for (let i = 0; i < old_points.length - 1; i++) {
        new_points.push(old_points[i]);
        const vp1: three.Vector3 = new three.Vector3(...old_points[i].getPosition());
        const vp2: three.Vector3 = new three.Vector3(...old_points[i + 1].getPosition());
        const vpoints: three.Vector3[] = threex.interpVPoints(vp1, vp2, num_segments[i] - 1);
        for (const vpoint of vpoints) {
            const new_point: gs.IPoint = model.getGeom().addPoint(vpoint.toArray() as gs.XYZ);
            new_points.push(new_point);
        }
    }
    // add last point if pline is open
    if (!pline.isClosed()) {new_points.push(old_points[old_points.length - 1]);}
    // create the new polyline and return it
    return model.getGeom().addPolyline(new_points, pline.isClosed());
}

/**
 * Joins polylines with shared end points. The original polylines are deleted.
 *
 * @param plines List of polylines to join.
 * @returns List of polyline objects.
 */
export function join(plines: gs.IPolyline[]): gs.IPolyline[] {
    const model: gs.IModel = error.checkObjList(plines, 2, gs.EObjType.polyline);
    const geom: gs.IGeom = model.getGeom();
    // create an array of array of points
    const point_ids_arrays: number[][] = [];
    for (const pline of plines) {
        const points: gs.IPoint[] = pline.getPointsArr();
        const start_end: [number, number] = [points[0].getID(), points[points.length - 1].getID()];
        if (start_end[1] < start_end[0]) {
            points.reverse();
        }
        point_ids_arrays.push(points.map((p) => p.getID()));
    }
    point_ids_arrays.sort();
    // create disjoint set
    const disjoint_sets: number[][][] = [];
    disjoint_sets.push([point_ids_arrays[0]]);
    point_ids_arrays.splice(0, 1);
    let max: number = 0;
    while (point_ids_arrays.length > 0 && max < 100) {
        max++;
        let tried_all: boolean = false;
        const last_disjoint_set: number[][] = disjoint_sets[disjoint_sets.length - 1];
        const last_point_ids = last_disjoint_set[last_disjoint_set.length - 1];
        let current_start: number = last_disjoint_set[0][0];
        let current_end: number = last_point_ids[last_point_ids.length - 1];
        tried_all = true;
        for (let i = 0; i < point_ids_arrays.length; i++) {
            const point_ids: number[] = point_ids_arrays[i];
            const point_ids_start: number = point_ids[0];
            const point_ids_end: number = point_ids[point_ids.length - 1];
            if (current_end === point_ids_start) {
                tried_all = false;
                last_disjoint_set.push(point_ids);
                current_end = last_point_ids[last_point_ids.length - 1];
                point_ids_arrays.splice(i, 1);
                break;
            } else if (current_start === point_ids_end) {
                tried_all = false;
                last_disjoint_set.unshift(point_ids);
                current_start = last_disjoint_set[0][0];
                point_ids_arrays.splice(i, 1);
                break;
            } else if (current_end === point_ids_end) {
                tried_all = false;
                last_disjoint_set.push(point_ids.reverse());
                current_end = last_point_ids[last_point_ids.length - 1];
                point_ids_arrays.splice(i, 1);
                break;
            } else if (current_start === point_ids_start) {
                tried_all = false;
                last_disjoint_set.unshift(point_ids.reverse());
                current_start = last_disjoint_set[0][0];
                point_ids_arrays.splice(i, 1);
                break;
            }
        }
        if (tried_all || (current_start === current_end)) {
            disjoint_sets.push([point_ids_arrays[0]]);
            point_ids_arrays.splice(0, 1);
        }
    }
    // create polylines
    const new_plines: gs.IPolyline[] = [];
    for (const disjoint_set of disjoint_sets) {
        const points: gs.IPoint[] = [];
        for (const point_ids of disjoint_set) {
            for (let i = 0; i< point_ids.length - 1; i++) {
                points.push(geom.getPoint(point_ids[i]));
            }
        }
        const start: number = disjoint_set[0][0];
        const last_array: number[] = disjoint_set[disjoint_set.length - 1];
        const end: number = last_array[last_array.length - 1];
        if (start === end) {
            new_plines.push(geom.addPolyline(points, true));
        } else {
            points.push(geom.getPoint(end));
            new_plines.push(geom.addPolyline(points, false));
        }
    }
    // delete the old polylines
    geom.delObjs(plines, true);
    // return the new plines
    return new_plines;
}

/**
 * Explodes a polyline into smaller polylines, each with only one segment.
 * The original polyline is not modified.
 *
 * @param pline Polyline to explode.
 * @returns List of polylines objects.
 */
export function explode(pline: gs.IPolyline): gs.IPolyline[] {
    error.checkObj(pline, gs.EObjType.polyline);
    return this.extract(pline, Arr.makeSeq(pline.numEdges()));
}

/**
 * Creates new polyline by extracting line segments from an existing polyline.
 * The original polyline is not modified.
 *
 * The individual segments are no joined.
 *
 * @param pline Polyline to extract segments from
 * @param segment_index Index numbers of polyline segments to extract
 * @returns List of new polylines created from extract
 */
export function extract(pline: gs.IPolyline, segment_index: number[]): gs.IPolyline[] {
    error.checkObj(pline, gs.EObjType.polyline);
    error.checkPosNums(segment_index);
    // do the extraction
    const m: gs.IModel = pline.getModel();
    const plines: gs.IPolyline[] = [];
    const points: gs.IPoint[] = pline.getPointsArr();
    if (pline.isClosed()) {points.push(points[0]); }
    for (const i of  segment_index) {
        if (i >= points.length - 1) {throw new Error("Segment index exceeds polyline length.");}
        plines.push(m.getGeom().addPolyline([points[i], points[i+1]], false));
    }
    return plines;
}

/**
 * Create a new polymesh by extruding a polyline by a specified vector.
 * The original polyline is not modified.
 *
 * New points are created by translating the existing points by the specified vector.
 * Four-sided faces are the created between the original and new points.
 * The faces are joined to create a polymesh.
 *
 * If cap is true, input pline and moved pline are used as edges to create two polygons. The polygones are
 * joined to the polymesh.
 *
 * @param pline Polyline to extrude.
 * @param vector Vector describing direction and distance of extrusion.
 * @param cap Closes polymesh by creating a polygon on each end of the extrusion if true.
 * @returns Polymesh object.
 */
export function extrude(pline: gs.IPolyline, vector: gs.XYZ, cap: boolean = false): gs.IPolymesh {
    error.checkObj(pline, gs.EObjType.polyline);
    error.checkXYZ(vector);
    // do the extrude
    const m: gs.IModel = pline.getModel();
    const g: gs.IGeom = m.getGeom();
    const points1: gs.IPoint[] = pline.getPointsArr();
    const points2: gs.IPoint[] = points1.map((p) => p.copy() as gs.IPoint);
    threex.movePointsAddXYZ(points2, vector);
    const mesh_points: gs.IPoint[][] = poly.pointsLoft([points1, points2], pline.isClosed());
    if (cap) {
        mesh_points.push(points1.reverse());
        mesh_points.push(points2);
    }
    const pmesh: gs.IPolymesh = m.getGeom().addPolymesh(mesh_points);
    return pmesh;
}

/**
 * Create a new polymesh by lofting a list of polylines with equal numbers of segments.
 * The original polylines are not modified.
 *
 * Four-sided faces are the created between the points of consecutive polylines.
 * The faces are joined to create a polymesh.
 *
 * Throws an error if polylines do not have the same number of segments
 *
 * @param plines List of polylines to loft (in order).
 * @param is_closed Closes polymesh by lofting back to first polyline if true.
 * @returns Polymesh object.
 */
export function loft(plines: gs.IPolyline[], is_closed: boolean=false): gs.IPolymesh {
    const m: gs.IModel = error.checkObjList(plines, 2, gs.EObjType.polyline);
    const g: gs.IGeom = m.getGeom();
    // get data
    if (is_closed) {plines.push(plines[0]);}
    const num_points: number = plines[0].numVertices();
    const num_plines: number = plines.length;
    const plines_closed: boolean = plines[0].isClosed();
    // get points
    const points: gs.IPoint[][] = [];
    for (let i = 0; i< num_plines; i++) {
        if (plines[i].numVertices() !== num_points) {
            throw new Error("Plines do not have equal numbers of points.");
        }
        if (plines[i].isClosed() !== plines_closed) {
            throw new Error("Plines must all be either open or closed.");
        }
        points.push(plines[i].getPointsArr());
    }
    // make polymesh from points and return it
    return g.addPolymesh(poly.pointsLoft(points, plines_closed));
}

/**
 * Create a new polymesh by piping a polyline.
 *
 * @param polyline Polyline to pipe.
 * @param radius The radius of the pipe.
 * @param segments The number of polygon segments around the cicumference of the pipe.
 * @returns Polymesh object.
 */
export function pipe(pline: gs.IPolyline, radius: number, segments: number): gs.IPolymesh {
    const m: gs.IModel = error.checkObj(pline, gs.EObjType.polyline);
    // make polymesh
    return polylinePipe.pipe(pline, radius, segments);
}
