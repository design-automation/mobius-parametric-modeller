/**
 * Function for working with planes.
 */

/**
 * Planes are geometric objects definded by a single vertex and a set of parameters.
 * Planes represent an infinite plane in 3D space.
 * The parameters defined the orientation of the plane.
 * The orientation is defined by two vectors, the X and Y vectors of the plane. They must be orthogonal.
 */

import * as gs from "gs-json";
import * as three from "three";
import * as threex from "./libs/threex/threex";
import * as error from "./_error_msgs_dev";

//  ===============================================================================================================
//  Plane Get =====================================================================================================
//  ===============================================================================================================

/**
 * Gets a plane from the model based on an ID number.
 * In the viewer, the object label can display (it starts with 'o'), which contains the ID.
 * For example, if the label is "o123", then the ID is the number 123.
 *
 * @param model Model to get plane from.
 * @param id ID number of plane.
 * @returns The plane object.
 */
export function Get(model: gs.IModel, id: number): gs.IPlane {
    const obj: gs.IObj = error.checkObjID(model, id, gs.EObjType.plane);
    return obj as gs.IPlane;
}

/**
 * Create a copy of an existing plane.
 *
 * @param plane The plane object to copy.
 * @param copy_attribs If true, attributes are copied to the new plane.
 * @returns A new plane object.
 */
export function Copy(plane: gs.IPlane, copy_attribs?: boolean): gs.IPlane {
    error.checkObj(plane, gs.EObjType.plane);
    return plane.copy(copy_attribs) as gs.IPlane;
}

/**
 * Copies a plane from one model into another model.
 *
 * @param model The model to copy to.
 * @param plane The plane object to copy.
 * @returns The copied plane object in the model.
 */
export function CopyToModel(model: gs.IModel, plane: gs.IPlane): gs.IPlane {
    error.checkObj(plane, gs.EObjType.plane);
    if (plane.getModel() === model) {throw new Error("Error: plane is already in model.");}
    return model.getGeom().copyPlaneFromModel(plane);
}

//  ===============================================================================================================
//  Plane Constructors ============================================================================================
//  ===============================================================================================================

/**
 * Creates a plane object from an origin point and two vectors.
 *
 * @param origin Point object, the origin of plane.
 * @param vec_x XYZ vector, the x-axis of plane.
 * @param vec XYZ vector, a vector in the plane. (This vector must not be co-dir with vec_x.)
 * @returns New plane object.
 */
export function FromOriginVectors(origin: gs.IPoint, vec_x: gs.XYZ, vec: gs.XYZ): gs.IPlane {
    const model: gs.IModel = error.checkPoint(origin);
    error.checkXYZ(vec_x);
    error.checkXYZ(vec);
    return model.getGeom().addPlane(origin, vec_x, vec);
}

/**
 * Creates a plane object from an origin point, parallel to the WCS XY plane .
 *
 * @param origin Point object, the origin of plane.
 * @returns New plane object.
 */
export function FromOriginXY(origin: gs.IPoint): gs.IPlane {
    const model: gs.IModel = error.checkPoint(origin);
    return model.getGeom().addPlane(origin, [1,0,0], [0,1,0]);
}

/**
 * Creates a plane object from an origin point, parallel to the WCS YZ plane .
 *
 * @param origin Point object, the origin of plane.
 * @returns New plane object.
 */
export function FromOriginYZ(origin: gs.IPoint): gs.IPlane {
    const model: gs.IModel = error.checkPoint(origin);
    return model.getGeom().addPlane(origin, [0,1,0], [0,0,1]);
}

/**
 * Creates a plane object from an origin point, parallel to the WCS ZX plane .
 *
 * @param origin Point object, the origin of plane.
 * @returns New plane object.
 */
export function FromOriginZX(origin: gs.IPoint): gs.IPlane {
    const model: gs.IModel = error.checkPoint(origin);
    return model.getGeom().addPlane(origin, [0,0,1], [1,0,0]);
}

/**
 * Creates a plane from an origin point and two other points on the plane.
 *
 * @param origin Point object, the origin of plane.
 * @param point1 Point object, a point on the plane. This will be used to define the plane X axis.
 * @param point2 Point object, a point on the plane.
 * @returns New plane object.
 */
export function FromOriginPoints(origin: gs.IPoint, point1: gs.IPoint, point2: gs.IPoint ):gs.IPlane {
    const model: gs.IModel = error.checkPoint(origin);
    error.checkPoint(point1);
    error.checkPoint(point2);
    if(point1.getModel() !== model) { throw new Error("Points need to be in the same model");}
    if(point2.getModel() !== model) { throw new Error("Points need to be in the same model");}
    // create the plane
    const vec_x: gs.XYZ = threex.vectorFromPointsAtoB(origin, point1).toArray() as gs.XYZ;
    const vec: gs.XYZ = threex.vectorFromPointsAtoB(origin, point2).toArray() as gs.XYZ;
    const plane: gs.IPlane = model.getGeom().addPlane(origin, vec_x, vec);
    // return the new plane
    return plane;
}

/**
 * Creates a plane from a circle. The plane will have the same origin and orientation as the circle.
 *
 * @param circle The circle to create a plane from.
 * @returns New plane object.
 */
export function FromCircle(circle: gs.ICircle): gs.IPlane {
    const model: gs.IModel = error.checkObj(circle, gs.EObjType.circle);
    const vectors: gs.XYZ[] = circle.getAxes();
    return model.getGeom().addPlane(circle.getOrigin(), vectors[0], vectors[1]);
}

//  ===============================================================================================================
//  Plane Functions ===============================================================================================
//  ===============================================================================================================
