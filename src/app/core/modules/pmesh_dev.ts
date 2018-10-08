import * as gs from "gs-json";
import * as three from "three";
import * as threex from "./libs/threex/threex";
import * as poly from "./libs/poly/poly";
import * as utils from "./_utils_dev";
import {Arr} from "./libs/arr/arr";

/**
 * Offsets a polymesh along its normal by a specified distance
 *
 * Each face is moved by specified distance in the direction of its normal and rejoined (extended or
 * trimmed to fit) to create a new surface
 * @param pmesh Polymesh object
 * @param distance Distance to offset polymesh
 * @returns New offset polymesh if successful
 */
export function offset(pmesh: gs.IPolymesh, distance: number): gs.IPolymesh {
    // check args
    if (!pmesh.exists()) {throw new Error("polymesh has been deleted.");}
    const model: gs.IModel = pmesh.getModel();
    const geom: gs.IGeom = model.getGeom();
    // make a copy
    pmesh = pmesh.copy(true) as gs.IPolymesh;
    // create a map of point -> vertices in this pmesh
    const vertices: gs.IVertex[] = Arr.flatten(pmesh.getVertices(gs.EGeomType.faces));
    const vertices_map: Map<number, gs.IVertex[]> = new Map();
    for (const vertex of vertices) {
        const id: number = vertex.getPoint().getID();
        if (!vertices_map.has(id)) {vertices_map.set(id, []);}
        vertices_map.get(id).push(vertex);
    }
    // move each point
    for (const [point_id, vertices] of vertices_map.entries()) {
        let normal: three.Vector3;
        if (vertices.length ===1) {
            normal = poly.getVertexNormal(vertices[0]);
            normal.setLength(distance);
        } else {
            // get the normal mean
            const vertex_normals: three.Vector3[] = [];
            normal = new three.Vector3();
            for (const vertex of vertices) {
                const vertex_normal: three.Vector3 = poly.getVertexNormal(vertex);
                vertex_normals.push(vertex_normal);
                normal.add(vertex_normal);
            }
            const angle = normal.angleTo(vertex_normals[0]);
            const len: number = distance / Math.cos(angle);
            normal.setLength(len);
        }
        // set the point position
        const point: gs.IPoint = geom.getPoint(point_id);
        const old_pos: gs.XYZ = point.getPosition();
        const new_pos: gs.XYZ = [old_pos[0] + normal.x, old_pos[1] + normal.y, old_pos[2] + normal.z];
        point.setPosition(new_pos);
    }
    return pmesh;
}


/**
 * Flips all faces
 * @param pmesh Polymeshes to flipFaces
 * @returns New polymesh created from weld if successful, null if unsuccessful or on error
 */
export function flipFaces(pmesh: gs.IPolymesh): gs.IPolymesh {
    // check args
    if (!pmesh.exists()) {throw new Error("polymesh has been deleted.");}
    throw new Error("Not implemented exception");
}


/**
 * Join a set of polymeshes to form a single polymesh.
 *
 * Returns null if polymeshes do not intersect or touch
 * @param pmeshes List of polymeshes to weld
 * @returns New polymesh created from weld if successful, null if unsuccessful or on error
 */
export function join(pmeshes: gs.IPolymesh[]): gs.IPolymesh[] {
    // check args
    const model: gs.IModel = pmeshes[0].getModel();
    for (const pmesh of pmeshes) {
        if (!pmesh.exists()) {throw new Error("polymesh has been deleted.");}
        if (pmesh.getModel() !== model) {throw new Error("Polymeshes have to be in same model.");}
    }
    // collect the faces together in a points arr
    const mesh_points: gs.IPoint[][] = [];
    for (const pmesh of pmeshes) {
        for (const face of pmesh.getFaces()) {
            const points: gs.IPoint[] = face.getVertices().map((v) => v.getPoint());
            mesh_points.push(points);
        }
    }
    // create a new pmesh
    const new_pmesh: gs.IPolymesh = model.getGeom().addPolymesh(mesh_points);

    // TODO check for disjoint polymeshes

    // return the new mesh
    return [new_pmesh];
}

/**
 * Thicken ...
 *
 * @param pmesh A Polymesh to create a polymesh with a single polygon face.
 * @returns A polymesh if successful, null if unsuccessful or on error.
 */
export function thicken(pmesh: gs.IPolymesh, dist1: number, dist2: number): gs.IPolymesh {
    // check args
    if (!pmesh.exists()) {throw new Error("polymesh has been deleted.");}
    const model: gs.IModel = pmesh.getModel();
    const pmesh1: gs.IPolymesh = offset(pmesh, dist1);
    const pmesh2: gs.IPolymesh = offset(pmesh, dist2 * -1); // TODO flip faces
    const wires1: gs.IWire[] = pmesh1.getWires();
    const wires2: gs.IWire[] = pmesh2.getWires();
    if (wires1.length !== wires2.length) {throw new Error("Error occured while thickening mesh.");}
    const sides: gs.IPolymesh[] = [];
    for (let i = 0; i < wires1.length; i++) {
        const points1 = wires1[i].getVertices().map((v) => v.getPoint());
        const points2 = wires2[i].getVertices().map((v) => v.getPoint());
        if (points1.length !== points2.length) {throw new Error("Error occured while thickening mesh.");}
        points1.push(points1[0]);
        points2.push(points2[0]);
        const mesh_points: gs.IPoint[][] = [];
        for (let j = 0; j < points1.length - 1; j++) {
            mesh_points.push([points1[j], points1[j+1], points2[j+1], points2[j]])
        }
        const side_mesh: gs.IPolymesh = model.getGeom().addPolymesh(mesh_points);
        sides.push(side_mesh);
    }
    return join([pmesh1, pmesh2, ...sides])[0];
}

/**
 * Loft a set of polylines with equal numbers of vertices.
 *
 * @param pmesh A polymesh to extrude
 * @param vector The vector defining the extrusion length and direction.
 * @returns A polymesh if successful, null if unsuccessful or on error.
 */
export function loft(pmeshes: gs.IPolymesh[], internal_edges: boolean): gs.IPolymesh {
    for (const pmesh of pmeshes) {
        if (!pmesh.exists()) {throw new Error("Pline has been deleted.");}
    }
    const m: gs.IModel = pmeshes[0].getModel();
    throw new Error("method not implemented");
}


/**
 * Copies polymeshes from one model to another
 * @param model_1 Model to copy from
 * @param model_2 Model to copy to
 * @returns List of polymeshes copied into specified model if successful
 */
export function _CopyFromModel(model_1: gs.IModel, model_2: gs.IModel ): gs.IPolymesh[] {
    throw new Error("Method not implemented");
}

/**
 * Creates one or more polygons from planar polylines
 * http://developer.rhino3d.com/api/RhinoScriptSyntax/#surface-AddPlanarSrf
 * http://verbnurbs.com/docs/geom/ISurface/ (?)
 *
 * If a closed polyline is specified, it is used as the edge of the polygon<br/>
 * If multiple open polylines are specified, their intersections are found and if the resulting segments form
 * a closed polyline, the resulting closed polyline is used as the edge of the polygon<br/>
 * Returns null if closed polylines are not planar, or if polylines specified are not coplanar<br/>
 * Returns null if polylines specified do not intersect to form a closed polyline
 * @param plines List of polylines to create planar polygon from
 * @returns List of polygons created if successful, null if unsuccessful or on error
 */

function FromPlines(pline: gs.IPolyline): gs.IPolymesh {
    const model: gs.IModel = pline.getModel();
    return model.getGeom().addPolymesh([pline.getPointsArr()]);
}

/**
 * Creates a closed box polymesh on a plane
 *
 * Box will be constructed with its top and bottom faces parallel to the plane specified, with the origin as
 * its volume centroid and its sides parallel to the x and y axis of the plane.
 * @param plane Plane to construct box on
 * @param length_x Length in x-direction
 * @param length_y Length in y-direction
 * @param length_z Length in z-direction
 * @returns New polymesh if successful, null if unsuccessful or on error
 */
function _BoxFromPlane(plane: gs.IPlane, length_x: number, length_y: number, length_z: number ): gs.IPolymesh {
    throw new Error("Method not implemented");
}

// - Possibly Assignment 1 (WEEK 2-3) -
/**
 * Creates a piped polymesh along a input polyline
 * http://developer.rhino3d.com/api/RhinoScriptSyntax/#surface-AddPipe
 *
 * Pipe constructed will have a circular cross section with the specified radius, angled to be perpendicular
 * to the input polyline throughout its length
 * @param polyline Rail polyline
 * @param radius List of radius values
 * @param cap Caps end with a flat surface if true
 * @returns New polymesh if successful, null if unsuccessful or on error
 */
function _PipeFromPline(polyline: gs.IPolyline, radius: [number, number], cap: boolean): gs.IPolymesh {
    throw new Error("Method not implemented");
}

/**
 * Creates a rectangular polygon on a plane
 *
 * Rectangular polygon with be constructed parallel to the specified plane, with the origin as the area
 * centroid of the rectangle and its edges parallel to the x and y axis
 * @param plane Plane to construct rectangle on. Origin will be center of the rectangle
 * @param length_x Length in x-direction
 * @param length_y Length in y-direction
 * @returns New polymesh if successful, null if unsuccessful or on error
 */
function _RectFromPlane(plane: gs.IPlane, length_x: number, length_y: number ): gs.IPolymesh {
    throw new Error("Method not implemented");
}

//  ===============================================================================================================
//  Pmesh Functions ===============================================================================================
//  ===============================================================================================================

/**
 * Calculates total surface area of a polymesh
 *
 * Each face is considered only once (does not take into account front and back of faces)
 * @param pmesh Polymesh object
 * @returns Total surface area of polymesh if successful
 */
export function _area(pmesh: gs.IPolymesh): boolean {
    throw new Error("Method not implemented");
}

/**
 * Checks if the polymesh is closed
 * @param pmesh Polymesh object
 * @returns True if the polymesh is closed
 */
export function _isClosed(pmesh: gs.IPolymesh): number {
    //return pmesh.isClosed();
    throw new Error("Method not implemented");
}

/**
 * Explodes a polymesh into individual polygons
 *
 * Each polygonal face in the polymesh is returned as a separate polymesh object
 * @param pmesh Polymesh to explode
 * @param copy Perfroms transformation on duplicate copy of input polymesh
 * @returns List of new polymeshes created from explode
 */
export function _explode(pmesh: gs.IPolymesh, copy: boolean): gs.IPolymesh[] {
    throw new Error("Method not implemented");
}

/**
 * Extracts a list of polygons from a polymesh
 *
 * Specified polygonal faces are removed from the polymesh and returned as individual polymesh objects<br/>
 * The remainder of the polymesh is rejoined as much as possible and returned as one polymesh if still intact,
 * or multiple polymeshes if they have been broken up<br/>
 * List returned is in order (from face 0 of orginal input pline)
 * @param pmesh Polymesh to extract segments from
 * @param polygon_index Index numbers of polygons to extract
 * @param return_remainder Returns polymeshes created from the remainder of the polymesh if true, returns only
 *                         specified segments if false
 * @param copy Perfroms transformation on duplicate copy of input polymesh
 * @returns List of new polymeshes created from extract
 */
export function _extract(pmesh: gs.IPolymesh, polygon_index: number[], return_remainder: boolean,
                        copy: boolean): gs.IPolymesh[] {
    throw new Error("Method not implemented");
}

// http://docs.autodesk.com/3DSMAX/15/ENU/3ds-Max-Help/images/GUID-72B1FF18-945C-4788-813B-E8FCC491F36C-low.png
/**
 * Offsets a polymesh along its normal by a specified distance
 *
 * Each face is moved by specified distance in the direction of its normal and rejoined (extended or
 * trimmed to fit) to create a new surface
 * @param pmesh Polymesh object
 * @param distance Distance to offset polymesh
 * @param copy Perfroms transformation on duplicate copy of input polymesh
 * @returns New offset polymesh if successful
 */
export function _offset(pmesh: gs.IPolymesh, distance: number, copy: boolean): gs.IPolymesh {
    throw new Error("Method not implemented");
}

/**
 * Calculates perimeter of a polymesh
 * @param pmesh Polymesh object
 * @returns Perimeter of polymesh if successful
 */
export function _perimeter(pmesh: gs.IPolymesh): boolean {
    throw new Error("Method not implemented");
}

/**
 * Weld a list of polymeshes together
 *
 * Joins polymeshes together and returns a single polymesh<br/>
 * Returns null if polymeshes do not intersect or touch
 * @param pmeshes List of polymeshes to weld
 * @param is_closed Creates a closed polymesh object if true
 * @returns New polymesh created from weld if successful, null if unsuccessful or on error
 */
export function _weld(pmeshes: gs.IPolymesh[], is_closed: boolean): gs.IPolymesh {
    throw new Error("Method not implemented");
}

//  ===============================================================================================================
//  Old Functions No Longer in API ================================================================================
//  ===============================================================================================================

/**
 * Creates a polymesh by extruding a polymesh along a path polyline.
 * http://developer.rhino3d.com/api/RhinoScriptSyntax/#surface-ExtrudeSurface
 * @param m Model
 * @param polymesh Polymesh to extrude.
 * @param polyline Polyline to extrude along.
 * @param cap Extrusion capped at both ends if true. Open if false.
 * @returns New polymesh if successful, null if unsuccessful or on error
 */
function _Extrude(m: gs.IModel, polymesh: gs.IPolymesh, polyline: gs.IPolyline, cap: boolean): gs.IPolymesh {
    throw new Error("Method not implemented");
}

/*
 * Performs a boolean difference operation on two 2D input polymeshes on a plane.
 * http://www.angusj.com/delphi/clipper.php
 * @param m Model
 * @param input0 Polymesh to subtract from.
 * @param input1 Polymesh to subtract.
 * @param plane Plane on which input polymeshes lie.
 * @param delete__input Deletes all input objects if true.
 * @returns New polymesh if successful, null if unsuccessful or on error
 */
function _BooleanDifference2D(m: gs.IModel, input0: gs.IPolymesh, input1: gs.IPolymesh,
                             plane: gs.IPlane, delete_input: boolean): gs.IPolymesh {
    throw new Error("Method not implemented");
}
