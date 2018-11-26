/**
 * Objects are a type of entity. They consist of conics, polylines, polymeshes, planes and rays.
 *
 * Objects are formed by a combination of topologies. More information can be found on the page for topo.
 */

import * as gs from "gs-json";
import * as three from "three";
import * as error from "./_error_msgs_dev";
import * as threex from "./libs/threex/threex"

//  ===============================================================================================================
//  Object Get ====================================================================================================
//  ===============================================================================================================

/**
 * Gets an object from the model
 * @param model Model to get object from
 * @param id ID of object to get
 * @returns An object. Null if object does not exist.
 */
export function Get(model: gs.IModel, id: number): gs.IObj {
    const obj: gs.IObj = error.checkObjID(model, id);
    switch (obj.getObjType()) {
        case gs.EObjType.ray:
            return obj as gs.IRay;
        case gs.EObjType.plane:
            return obj as gs.IPlane;
        case gs.EObjType.circle:
            return obj as gs.ICircle;
        case gs.EObjType.ellipse:
            return obj as gs.IEllipse;
        case gs.EObjType.polyline:
            return obj as gs.IPolyline;
        case gs.EObjType.polymesh:
            return obj as gs.IPolymesh;
        default:
            throw new Error("Object type not found: " + obj.getObjType());
    }
}

/**
 * Gets a list of objects from the model.
 * @param model Model to get objects from.
 * @param ids A point ID or list of point IDs, integer numbers. If null, then all objects are returned.
 * @returns A list of objects.
 */
export function Gets(model: gs.IModel, ids?: number | number[]): gs.IObj[] {
    if (ids === undefined || ids === null) {return model.getGeom().getAllObjs();}
    if (!Array.isArray(ids)) {ids = [ids];}
    let objs: gs.IObj[] = [];
    for (const id of ids) {
        const obj: gs.IObj = Get(model, id);
        if (obj !== null) {objs.push(obj);}
    }
    return objs;
}

/**
 * Gets all the objects from a group.
 * @param model Model to get the objects from.
 * @param group_name The group name.
 * @returns List of objects.
 */
export function GetFromGroup(model: gs.IModel, group_name: string): gs.IObj[] {
    const group: gs.IGroup = error.checkGroup(model, group_name);
    return group.getObjs();
}

//  ===============================================================================================================
//  Object Constructors ===========================================================================================
//  ===============================================================================================================

//  ===============================================================================================================
//  Object Functions ==============================================================================================
//  ===============================================================================================================

/**
 * Moves objects by a translation vector.
 *
 * @param objs An object or a list of objects.
 * @param vector Translation vector.
 * @param copy If true, objects are copied before being moved.
 * @returns The moved objects.
 */
export function move(objs: gs.IObj | gs.IObj[], vector: gs.XYZ, copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    error.checkXYZ(vector);
    // translation matrix
    const matrix_trn: three.Matrix4 = new three.Matrix4();
    matrix_trn.makeTranslation(vector[0], vector[1], vector[2]);
    // copy the objs
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_trn);
    // return either a single obj or array of objs
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Rotates object or a list of objects around an axis.
 *
 * @param objs An object or a list of objects.
 * @param origin An point on the axis, can be either a list of three numbers or a point.
 * @param axis An xyz vector along the axis.
 * @param angle The angle, in degrees, between 0 and 360.
 * @param copy If true, objects are copied before being rotated.
 * @returns The rotated objects.
 */
export function rotate(objs: gs.IObj | gs.IObj[], origin: gs.XYZ|gs.IPoint, axis: gs.XYZ,
                       angle: number, copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let origin_xyz: gs.XYZ;
    if (origin instanceof gs.Point) {
        origin_xyz = origin.getPosition();
    } else {
        origin_xyz = origin as gs.XYZ;
        error.checkXYZ(origin_xyz);
    }
    error.checkXYZ(axis);
    const angle_rad: number = (angle / 180) * Math.PI;
    // rotation matrix
    const matrix_rot: three.Matrix4 = new three.Matrix4();
    matrix_rot.makeRotationAxis(new three.Vector3(...axis), angle_rad);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin_xyz[0], -origin_xyz[1], -origin_xyz[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin_xyz[0], origin_xyz[1], origin_xyz[2]);
    // copy objects
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_trn2.multiply(matrix_rot.multiply(matrix_trn1)));
    // return the result, either single obj or array
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Scales an object or a list of objects relative to an origin point.
 * The scale factor is specified by three vales, for scaling in x, y, and z.
 * Primitive objects, such as circles and arcs, can only be scaled uniformly.
 *
 * @param objs An object or a list of objects.
 * @param origin An origin point of the scale, can be either a list of three numbers or a point.
 * @param factor The scale factor, along the x, y and z axes.
 * @param copy If true, objects are copied before being scaled.
 * @returns The scaled objects.
 */
export function scale(objs: gs.IObj | gs.IObj[], origin: gs.XYZ|gs.IPoint,
                      factor: gs.XYZ, copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let origin_xyz: gs.XYZ;
    if (origin instanceof gs.Point) {
        origin_xyz = origin.getPosition();
    } else {
        origin_xyz = origin as gs.XYZ;
        error.checkXYZ(origin_xyz);
    }
    error.checkXYZ(factor);
    // scale matrix
    const matrix_scale: three.Matrix4 = new three.Matrix4();
    matrix_scale.makeScale(factor[0], factor[1], factor[2]);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin_xyz[0], -origin_xyz[1], -origin_xyz[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin_xyz[0], origin_xyz[1], origin_xyz[2]);
    // copy objects
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_trn2.multiply(matrix_scale.multiply(matrix_trn1)));
    // return the result, either single obj or array
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Transforms an object or list of objects to a target coordinate system (CS).
 * The source CS is assumed to be the Global Coordinate System (GCS).
 * The target coordinate system is specified by an origin,
 * a vector parallel to the x axis, and a vector in the xy plane (not parallel to the x axis).
 *
 * @param objs An object or a list of objects.
 * @param target_origin The origin point of the target coordinate system, can be either a list of three numbers or a point.
 * @param target_vec_x A vector parallel to the target x axis.
 * @param target_vec A vector in the target xy plane (not paralle to the x axis).
 * @param copy If true, objects are copied before being scaled.
 * @returns The transformed objects.
 */
export function xformGcs2Lcs(objs: gs.IObj | gs.IObj[],
                             target_origin: gs.XYZ|gs.IPoint,
                             target_vec_x: gs.XYZ, target_vec: gs.XYZ,
                             copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let target_origin_xyz: gs.XYZ;
    if (target_origin instanceof gs.Point) {
        target_origin_xyz = target_origin.getPosition();
    } else {
        target_origin_xyz = target_origin as gs.XYZ;
        error.checkXYZ(target_origin_xyz);
    }
    error.checkXYZ(target_vec_x);
    error.checkXYZ(target_vec);
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_gcs_to_target: three.Matrix4 = threex.xformMatrixFromXYZVectors(
        target_origin_xyz, target_vec_x, target_vec, false);
    // copy objects
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_gcs_to_target);
    // return the result, either single obj or array
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Transforms an object or list of objects from a source local coordinate system (LCS)
 * to the global coordinate system (GCS).
 * The source coordinate system is specified by an origin,
 * a vector parallel to the x axis, and a vector in the xy plane (not parallel to the x axis).
 *
 * @param objs An object or a list of objects.
 * @param source_origin The origin point of the source coordinate system, can be either a list of three numbers or a point.
 * @param source_vec_x A vector parallel to the source x axis.
 * @param source_vec A vector in the source xy plane (not paralle to the x axis).
 * @param copy If true, objects are copied before being scaled.
 * @returns The transformed objects.
 */
export function xformLcs2Gcs(objs: gs.IObj | gs.IObj[],
                             source_origin: gs.XYZ|gs.IPoint,
                             source_vec_x: gs.XYZ, source_vec: gs.XYZ,
                             copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let source_origin_xyz: gs.XYZ;
    if (source_origin instanceof gs.Point) {
        source_origin_xyz = source_origin.getPosition();
    } else {
        source_origin_xyz = source_origin as gs.XYZ;
        error.checkXYZ(source_origin_xyz);
    }
    error.checkXYZ(source_vec_x);
    error.checkXYZ(source_vec);
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_source_to_gcs: three.Matrix4 = threex.xformMatrixFromXYZVectors(
        source_origin_xyz, source_vec_x, source_vec, true);
    // copy objects
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_source_to_gcs);
    // return the result, either single obj or array
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Transforms an object or list of objects from a source to a target local coordinate system (LCS).
 * Each coordinate system is specified by an origin,
 * a vector parallel to the x axis, and a vector in the xy plane (not parallel to the x axis).
 *
 * @param objs An object or a list of objects.
 * @param source_origin The origin point of the source coordinate system, can be either a list of three numbers or a point.
 * @param source_vec_x A vector parallel to the source x axis.
 * @param source_vec A vector in the source xy plane (not paralle to the x axis).
 * @param target_origin The origin point of the target coordinate system, can be either a list of three numbers or a point.
 * @param target_vec_x A vector parallel to the target x axis.
 * @param target_vec A vector in the target xy plane (not paralle to the x axis).
 * @param copy If true, objects are copied before being scaled.
 * @returns The transformed objects.
 */
export function xformLcs2Lcs(objs: gs.IObj | gs.IObj[],
                             source_origin: gs.XYZ|gs.IPoint,
                             source_vec_x: gs.XYZ, source_vec: gs.XYZ,
                             target_origin: gs.XYZ|gs.IPoint,
                             target_vec_x: gs.XYZ, target_vec: gs.XYZ,
                             copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let source_origin_xyz: gs.XYZ;
    if (source_origin instanceof gs.Point) {
        source_origin_xyz = source_origin.getPosition();
    } else {
        source_origin_xyz = source_origin as gs.XYZ;
        error.checkXYZ(source_origin_xyz);
    }
    error.checkXYZ(source_vec_x);
    error.checkXYZ(source_vec);
    let target_origin_xyz: gs.XYZ;
    if (target_origin instanceof gs.Point) {
        target_origin_xyz = target_origin.getPosition();
    } else {
        target_origin_xyz = target_origin as gs.XYZ;
        error.checkXYZ(target_origin_xyz);
    }
    error.checkXYZ(target_vec_x);
    error.checkXYZ(target_vec);
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_source_to_gcs: three.Matrix4 = threex.xformMatrixFromXYZVectors(
        source_origin_xyz, source_vec_x, source_vec, true);
    const matrix_gcs_to_target: three.Matrix4 = threex.xformMatrixFromXYZVectors(
        target_origin_xyz, target_vec_x, target_vec, false);
    // copy objects
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_gcs_to_target.multiply(matrix_source_to_gcs));
    // return the result, either single obj or array
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Mirrors an object or a list of objects in a mirror plane.
 * The plane is defined by a point and a normal vector.
 *
 * @param objs An object or a list of objects.
 * @param origin An origin point on the mirror plane, can be either a list of three numbers or a point.
 * @param normal The normal vector of the mirror plane, a list of three numbers.
 * @param copy If true, objects are copied before being scaled.
 * @returns The scaled objects.
 */
export function mirror(objs: gs.IObj | gs.IObj[], origin: gs.XYZ|gs.IPoint,
                      normal: gs.XYZ, copy: boolean = false): gs.IObj | gs.IObj[] {
    const is_array: boolean = Array.isArray(objs);
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let origin_xyz: gs.XYZ;
    if (origin instanceof gs.Point) {
        origin_xyz = origin.getPosition();
    } else {
        origin_xyz = origin as gs.XYZ;
        error.checkXYZ(origin_xyz);
    }
    error.checkXYZ(normal);
    // plane normal
    const [a,b,c]: number[] = new three.Vector3(...normal).normalize().toArray();
    // mirror matrix
    const matrix_mirror: three.Matrix4 = new three.Matrix4();
    matrix_mirror.set(
        1 - (2 * a * a), -2 * a * b, -2 * a * c, 0,
        -2 * a * b, 1 - (2 * b * b), -2 * b * c, 0,
        -2 * a * c, -2 * b * c, 1 - (2 * c * c), 0,
        0, 0, 0, 1
    );
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin_xyz[0], -origin_xyz[1], -origin_xyz[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin_xyz[0], origin_xyz[1], origin_xyz[2]);
    // copy objects
    if (copy) {objs = model.getGeom().copyObjs(objs, true); }
    // do the xform
    model.getGeom().xformObjs(objs, matrix_trn2.multiply(matrix_mirror.multiply(matrix_trn1)));
    // return the result, either single obj or array
    if (is_array) {return objs;}
    return objs[0];
}

/**
 * Deletes object or a list of objects from the model.
 *
 * @param objs Object or list of objects to delete.
 * @param keep_points If false, points that are not used in any other objects will be deleted.
 * @returns True if all objects we successfully deleted.
 */
export function del(objs: gs.IObj | gs.IObj[], keep_points: boolean = false): boolean {
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    let ok: boolean = true;
    for (const obj of objs) {
        if (!model.getGeom().delObj(obj, keep_points)) {ok = false;}
    }
    return ok;
}

/**
 * Unwelds objects, so that thier vertices no longer share any points.
 *
 * @param objs Object or list of objects to unweld.
 * @returns A list of new points generated by the unwelding process.
 */
export function unweld(objs: gs.IObj | gs.IObj[]): gs.IPoint[] {
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    return model.getGeom().unweldObjs(objs);
}

//  ===============================================================================================================
//  Groups ==============================================================================================
//  ===============================================================================================================

/**
 * Add objects to a group.
 *
 * @param group Name of group to add to.
 * @param objs List of objects to add.
 * @returns True if all objects we successfully added.
 */
export function addToGroup(objs: gs.IObj | gs.IObj[], group_name: string): boolean {
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    const group: gs.IGroup = error.checkGroup(model, group_name);
    let ok: boolean = true;
    for (const obj of objs) {
        if (!group.addObj(obj as gs.IObj)) {ok = false;}
    }
    return ok;
}

/**
 * Remove object from a group.
 *
 * @param group Name of group to add to.
 * @param objs List of object to remove.
 * @returns True if all objects we successfully removed.
 */
export function removeFromGroup(objs: gs.IObj | gs.IObj[], group_name: string): boolean {
    if (!Array.isArray(objs)) {objs = [objs];}
    const model: gs.IModel = error.checkObjList(objs, 1);
    const group: gs.IGroup = error.checkGroup(model, group_name);
    let ok: boolean = true;
    for (const obj of objs) {
        if (!group.removeObj(obj as gs.IObj)) {ok = false;}
    }
    return ok;
}
