import * as gs from "gs-json";
import * as three from "three";
import * as xform from "./libs/xform/xform";
import * as threex from "./libs/threex/threex";
import * as poly from "./libs/poly/poly";
import * as error from "./_error_msgs_dev";

/**
 * Returns a point by evaluating the position along a polyline or segment in the polyline.
 * The position is specified by a t parameter that starts at 0 and ends at 1.
 * The segment index is not -1, then it specified teh segment to evaluate.
 * If the polyline is closed and the segment index is -1, 0 and 1 will have the same position.
 *
 * @param pline Polyline to evaluate.
 * @param t Parameter to evaluate (0 is the start of the polyline, 1 is the end of the polyline)
 * @param segment_index The segment of the polyline to evaluate. When -1, the whole polyline is evaluated.
 * @returns Point.
 */
export function evalSegParam(pline: gs.IPolyline, t: number, segment_index: number): gs.IPoint {
    error.checkObj(pline, gs.EObjType.polyline);
    error.checkPosNum(t);
    error.checkPosNum(segment_index);
    let points: gs.IPoint[] = pline.getPointsArr();
    if (pline.isClosed()) {points.push(points[0]); }
    if (segment_index !== -1) {
        if (segment_index > points.length - 1) {throw new Error("segments_index is out of range."); }
        points = points.splice(segment_index, 2);
    }
    return poly.pointsEvaluate(points, t);
}

/**
 * Extends a non-closed polyline by specified distance. The original polyline is modified.
 *
 * Extension is straight and continues in the same direction as the extended segment<br/>
 *
 * @param pline Polyline object
 * @param extend_side 0 = start, 1 = end, 2 = both
 * @param length Distance to extend
 * @returns Polyline object if successful, null if unsuccessful or on error
 */
export function extend(pline: gs.IPolyline, extend_side: number, length: number,
                       create_points: boolean = true): gs.IPolyline {
    if (!pline.exists()) {throw new Error("Pline has been deleted.");}
    // extend? which side?
    switch (extend_side) {
        case 0: case 2:
            const edges1: gs.IEdge[] = pline.getEdges()[0][0];
            const first_edge = edges1[0];
            const points1: gs.IPoint[] = first_edge.getVertices().map((v) => v.getPoint());
            const extended1: gs.IPoint = poly.pointsExtend(points1[1], points1[0], length, create_points);
            if (create_points) {
                pline.insertVertex(first_edge, extended1);
            }
        case 1: case 2:
            const edges2: gs.IEdge[] = pline.getEdges()[0][0];
            const last_edge = edges2[edges2.length - 1];
            const points2: gs.IPoint[] = last_edge.getVertices().map((v) => v.getPoint());
            const extended2: gs.IPoint = poly.pointsExtend(points2[0], points2[1], length, create_points);
            if (create_points) {
                pline.insertVertex(last_edge, extended2);
            }
    }
    return pline;
}


/**
 * Sweeps a cross_section polyline along a rail polyline to create a polymesh.
 * The cross sesctions remain parallel.
 *
 * @param cross_section Polyline to sweep
 * @param rail Rail polyline to sweep along
 * @returns Polymesh created from sweep
 */
export function sweepParallel(cross_section: gs.IPolyline, rail: gs.IPolyline): gs.IPolymesh {
    if (!cross_section.exists()) {throw new Error("Cross section has been deleted.");}
    if (!rail.exists()) {throw new Error("Rail has been deleted.");}
    if (cross_section.getModel() !== rail.getModel()) {throw new Error("Cross section and rail must be in the same model.");}
    const m: gs.IModel = cross_section.getModel();
    if (rail.getModel() !== m) {throw new Error("The cross_section and the rail must be in the same model.");}
    const cross_points: gs.IPoint[] = cross_section.getPointsArr();
    if (cross_section.isClosed) {cross_points.push(cross_points[0]);}
    const rail_points: gs.IPoint[] = rail.getPointsArr();
    if (rail.isClosed) {rail_points.push(rail_points[0]);}
    const mesh_points: gs.IPoint[][] = [];
    const pline_start_pos: number[] = cross_points[0].getPosition();
    for (let i = 0; i< cross_points.length - 1; i++) {
        const pline_pos1: number[] = cross_points[i].getPosition();
        const pline_pos2: number[] = cross_points[i+1].getPosition();
        const vec1: number[] = [
            pline_pos1[0] - pline_start_pos[0],
            pline_pos1[1] - pline_start_pos[1],
            pline_pos1[2] - pline_start_pos[2],
        ];
        const vec2: number[] = [
            pline_pos2[0] - pline_start_pos[0],
            pline_pos2[1] - pline_start_pos[1],
            pline_pos2[2] - pline_start_pos[2],
        ];
        for (let j=0; j< rail_points.length-1;j++) {
            const rail_pos1: gs.XYZ = rail_points[j].getPosition();
            const rail_pos2: gs.XYZ = rail_points[j+1].getPosition();
            const j2 = j%2;
            let vec: number[];
            if (j2 === 0) {
                mesh_points.push([]);
                vec = vec1;
            } else {
                vec = vec2;
            }
            const face: gs.IPoint[] = mesh_points[mesh_points.length - 1];
            const pos1: gs.XYZ = [rail_pos1[0] + vec[0], rail_pos1[1] + vec[1], rail_pos1[2] + vec[2]];
            const pos2: gs.XYZ = [rail_pos2[0] + vec[0], rail_pos2[1] + vec[1], rail_pos2[2] + vec[2]];
            face[j2] = m.getGeom().addPoint(pos1);
            face[3 - j2] = m.getGeom().addPoint(pos2);
        }
    }
    const pmesh: gs.IPolymesh = m.getGeom().addPolymesh(mesh_points);
    return pmesh;
}

/**
 * Adds a polyline from the model based on a conic curve
 *
 * Creates equally spaced points along a conic curve and joins them to create a polyline<br/>
 * If specified conic curve is closed, returns a closed polyline
 * @param curve Conic curve to construct polyline from
 * @param segments Number of segments in polyline
 * @returns Polyline object if successful
 */
export function FromEllipse(curve: gs.ICircle|gs.IEllipse, segments: number): gs.IPolyline {
    // TODO
    throw new Error("Method not implemented");
}

//  http://developer.rhino3d.com/api/RhinoScriptSyntax/#curve-CurveClosestPoint
//  http://verbnurbs.com/docs/geom/NurbsSurface/#closestparam
/**
 * Returns a param along a polyline based on a point on the polyline
 *
 * Point should lie on polyline (within a tolerane of 0.1)<br/>
 * Returns null if point does not lie on polyline
 * @param pline Polyline to evaluate
 * @param point Point to evaluate
 * @returns Param on polyline if successful, null if unsuccessful or on error
 */
export function evalPoint(pline: gs.IPolyline, point: gs.IPoint): gs.IPoint {
    // TODO
    throw new Error("Method not implemented");
}

/**
 * Returns length of a polyline object
 * @param model Model
 * @param polyline Polyline object
 * @param segment_index Polyline segment index
 * @param sub_domain List of two numbers identifying the subdomain of the curve to calculate.
 * Ascending order. If omitted, entire polyline length is used. (optional, omit?)
 * @returns Length of polyline as number if successful, null if unsuccessful or on error
 */
export function length(model: gs.IModel, pline: gs.IPolyline, segment_index: number,
                        sub_domain: [number,number] ) {
    throw new Error("Method not implemented");
}

// - Possibly Assignment 1 (WEEK 2-3) -
/**
 * Offsets planar polyline along its plane by a specified distance
 * @param plines Polyline to offset
 * @param distance Distance to offset
 * @param copy Performs transformation on duplicate copy of input polyline
 * @returns New offset polyline
 */
export function offset(plines: gs.IPolyline[], distance: number, copy: boolean): gs.IPolymesh {
    throw new Error("Method not implemented");
}

// - Possibly Assignment 1 (WEEK 2-3) -
//  http://developer.rhino3d.com/api/RhinoScriptSyntax/#curve-DivideCurve
//  http://verbnurbs.com/docs/geom/NurbsCurve/#dividebyequalarclength
/**
 * Rebuilds and divides a polyline into specified number of segments
 * @param pline Polyline object
 * @param segments Number of segments
 * @returns New points of polyline
 */
export function rebuild(pline: gs.IPolyline, segments: number): gs.IPoint[] {
    throw new Error("Method not implemented");
}

/**
 * Revolves a polyline about a specified axis ray (or line?) to create a polymesh
 * @param pline Polyline to revolve
 * @param axis Axis ray to revolve about
 * @param angle_s Start angle of revolution in degrees
 * @param angle_e End angle of revolution in degrees
 * @returns Polymesh created from revolution
 */
export function revolve(pline: gs.IPolyline, axis: gs.IRay, angle_s: number, angle_e: number): gs.IPolymesh {
    throw new Error("Method not implemented");
}

/**
 * Weld a list of polylines together
 * @param plines List of polyline to weld
 * @param is_closed Creates a closed polyline object if true
 * @returns New polyline created from weld
 */
export function weld(plines: gs.IPolyline[], is_closed: boolean): gs.IPolyline {
    throw new Error("Method not implemented");
}

//  ===============================================================================================================
//  PRIVATE ======================================================================================================
//  ===============================================================================================================
