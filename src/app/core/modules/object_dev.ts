import * as gs from "gs-json";
//import * as utils from "./utils";
import * as three from "three";

//  ===============================================================================================================
//  Object Constructors ===========================================================================================
//  ===============================================================================================================

/**
 * Copy an object from one model to another model
 *
 * If the specified model is the same as the model the object is located in, the specified object is
 * duplicated
 * @param model Model to add the object to
 * @param obj Object to copy in other model
 * @returns Added object in specified model
 * <h4>Examples</h4>
 * <code>This is some code.</code>
 */
export function Copy(model: gs.IModel, obj: gs.IObj): gs.IObj {
    //return model.getGeom().addPoint(point.getPosition());
    throw new Error("Method not implemented");
}

/**
 * Copies all objects from one model to another
 * @param model_1 Model to copy from
 * @param model_2 Model to copy to
 * @returns List of objects copied into specified model if successful
 */
export function CopyFromModel(model_1: gs.IModel, model_2: gs.IModel ): gs.IObj[] {
    throw new Error("Method not implemented");
}

// - WEEK 2 -
/**
 * Gets an object from the model
 * @param model Model to get object from
 * @param index Index of object to get
 * @returns Specified object if successful, null if unsuccessful or on error
 */
export function GetFromModel(model: gs.IModel, index: number[]): gs.IObj {
    throw new Error("Method not implemented");
}

//  ===============================================================================================================
//  Object Functions ==============================================================================================
//  ===============================================================================================================

/**
 * Gets faces from an object
 * @param obj Object to get faces from
 * @returns List of faces if successful, null if unsuccesful or on error
 */
export function getFaces(obj: gs.IObj): gs.IFace[] {
    throw new Error("Method not implemented");
}

// - Possibly Assignment 1 (WEEK 2-3) -
/**
 * Gets points from an object
 * @param obj Object to get points from
 * @returns List of  points if successful, null if unsuccesful or on error
 */
export function getPoints(obj: gs.IObj): gs.IPoint[] {
    throw new Error("Method not implemented");
}

/**
 * Gets wires from an object
 * @param obj Object to get wires from
 * @returns List of  wires if successful, null if unsuccesful or on error
 */
export function getWires(obj: gs.IObj): gs.IWire[] {
    throw new Error("Method not implemented");
}

// - WEEK 2 -
/**
 * Gets the type of an object
 * @param obj Object
 * @returns Type of object represented as a number (...)
 */
export function getType(obj: gs.IObj): number /*enum TO-DO*/ {
    throw new Error("Method not implemented");
}

/**
 * Joins vertices of a list of objects
 *
 * Forces vertices (from list of objects) that are at the same position (within a tolerance of 1)
 * to share the same point
 * @param objs List of objects
 * @param copy Performs transformation on duplicate copy of input objects
 * @returns Number of vertices joined
 */
export function join(objs: gs.IObj[], copy: boolean): number {
    throw new Error("Method not implemented");
}

/**
 * Separates vertices of a list of objects
 *
 * Forces vertices (from list of objects) that share the same point to split into individual points
 * @param objs List of objects
 * @param copy Performs transformation on duplicate copy of input objects
 * @returns Number of vertices unjoined
 */
export function unjoin(objs: gs.IObj[], copy: boolean): number {
    throw new Error("Method not implemented");
}

/**
 * Gets the number of faces in an object
 * @param obj Object to get number of faces from
 * @returns Number of faces if successful, null if unsuccesful or on error
 */
export function numFaces(obj: gs.IObj): number {
    throw new Error("Method not implemented");
}

/**
 * Gets the number of points in an object
 * @param obj Object to get number of points from
 * @returns Number of points if successful, null if unsuccesful or on error
 */
export function numPoints(obj: gs.IObj): number {
    throw new Error("Method not implemented");
}

/**
 * Gets the number of wires in an object
 * @param obj Object to get number of wires from
 * @returns Number of wires if successful, null if unsuccesful or on error
 */
export function numWires(obj: gs.IObj): number {
    throw new Error("Method not implemented");
}


//  ===============================================================================================================
//  Old Functions No Longer in API ================================================================================
//  ===============================================================================================================

/**
 * Returns the distance from a 3D point to a plane
 * @param A plane and a 3 dimension point
 * @return The distance if successful, otherwise null
 */
//  http://developer.rhino3d.com/api/RhinoScriptSyntax/#plane
export function DistanceToPlane(m: gs.IModel, xyz: number[], plane: gs.IPlane): number {
    const distance: number = undefined;
    // To Be Implemented
    return distance;
}

// =================================================================================================
// To be added at a later time
// http://developer.rhino3d.com/api/RhinoScriptSyntax/#object-IsObjectSolid
// http://developer.rhino3d.com/api/RhinoScriptSyntax/#object-IsObjectValid
