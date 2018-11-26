/**
 * Rays are a type of object.
 *
 * Rays are imaginary lines that stretch infinitely along an axis and are defined by a single vector.
 */

import * as gs from "gs-json";

//  ===============================================================================================================
//  Ray Get =======================================================================================================
//  ===============================================================================================================

/**
 * Gets a ray from the model based on an index number
 * @param model Model to get ray from
 * @param id Index number of ray
 * @returns Ray object if successful
 */
export function Get(model: gs.IModel, id: number): gs.IRay {
    // check args
    const obj: gs.IObj = model.getGeom().getObj(id);
    if (obj === undefined) {return null;}
    if (obj.getObjType() !== gs.EObjType.ray) {
        throw new Error("Object is not a ray. Object type is: " + obj.getObjType());
    }
    // return the ray
    return obj as gs.IRay;
}

/**
 * Create a copy of a ray.
 *
 * @param ray The ray to copy.
 * @returns A new ray.
 */
export function Copy(ray: gs.IRay, copy_attribs?: boolean): gs.IRay {
    // check args
    if (!ray.exists()) {throw new Error("ray has been deleted.");}
    // copy and return
    return ray.copy(copy_attribs) as gs.IRay;
}

/**
 * Copies a ray from one model into another model.
 *
 * @param ray The ray object to copy.
 * @returns The ray object in the model.
 */
export function CopyToModel(model: gs.IModel, ray: gs.IRay): gs.IRay {
    // check args
    if (!ray.exists()) {throw new Error("Error: ray has been deleted.");}
    // check it is not already in the model
    if (ray.getModel() === model) {throw new Error("Error: ray is already in model.");}
    // copy circle and return it
    return model.getGeom().copyRayFromModel(ray);
}

//  ===============================================================================================================
//  Ray Constructors ==============================================================================================
//  ===============================================================================================================

/**
 * Creates a ray from an origin point and one direction vector describing its direction
 * @param origin 3D point to use as origin of plane
 * @param vector Direction vector describing direction of ray
 * @returns New ray if successful, null if unsuccessful or on error
 */
export function FromOriginVector(origin: gs.IPoint, vector: gs.XYZ): gs.IRay {
    // check args
    if (!origin.exists()) {throw new Error("Arg origin has been deleted.");}
    // create the new ray and return
    return origin.getGeom().addRay(origin, vector);
}

//  ===============================================================================================================
//  Ray Functions =================================================================================================
//  ===============================================================================================================
