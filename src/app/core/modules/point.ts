/**
 * Function for working with points.
 */

/**
 * Points define a point in a model, with XYZ coordinates.
 * Points are the fundamental building blocks of making 3D geometry.
 * Geometric objects have one or more vertices, and the position of each vertex is defined by linking to a point.
 * Each vertex most be linked to exactly one point.
 * Each point can have zero or more vertices linking to it.
 * If a point is moved, all vertcies linked to that point will move with it.
 */

import * as gs from "gs-json";
import * as three from "three";
import * as error from "./_error_msgs_dev";

//  ===============================================================================================================
//  Point Get Copy ================================================================================================
//  ===============================================================================================================

/**
 * Gets a point from a model.
 *
 * @param model Model to get point from.
 * @param id ID of point to get.
 * @returns Point.
 */
export function Get(model: gs.IModel, id: number): gs.IPoint {
    const point: gs.IPoint = error.checkPointID(model, id);
    return point;
}

/**
 * Gets a list of points from the model.
 *
 * @param model Model to get points from.
 * @param ids A point ID or list of point IDs, integer numbers. If null, then all points are returned.
 * @returns A list of points.
 */
export function Gets(model: gs.IModel, ids?: number | number[]): gs.IPoint[] {
    if (ids === undefined || ids === null) {return model.getGeom().getAllPoints();}
    if (!Array.isArray(ids)) {ids = [ids];}
    const points: gs.IPoint[] = [];
    for (const id of ids) {
        const point: gs.IPoint = Get(model, id);
        if (point !== null) {points.push(point);}
    }
    return points;
}

/**
 * Gets all the points from a group.
 *
 * @param model Model to get the points from.
 * @param group_name The group name.
 * @returns List of points.
 */
export function GetFromGroup(model: gs.IModel, group_name: string): gs.IPoint[] {
    const group: gs.IGroup = error.checkGroup(model, group_name);
    return group.getPoints();
}

/**
 * Gets a list of unique points for a list of objects.
 *
 * @param objs An object or list of objects.
 * @returns List of points.
 */
export function GetFromObjs(objs: gs.IObj | gs.IObj[]): gs.IPoint[] {
    // TODO error checking of args
    if (!Array.isArray(objs)) {objs = [objs];}
    const points_map: Map<number, gs.IPoint> = new Map();
    const obj_points: gs.IPoint[] = [];
    for (const obj of objs) {
        for (const point of obj.getPointsArr()) {
            points_map.set(point.getID(), point);
        }
    }
    return Array.from(points_map.values());
}

/**
 * Copy a point within a model.
 *
 * @param point Point to copy.
 * @returns New point.
 */
export function Copy(point: gs.IPoint): gs.IPoint {
    const model: gs.IModel = error.checkPoint(point);
    return model.getGeom().addPoint(point.getPosition());
}

/**
 * Copy a point from one model into another model.
 *
 * @param model The model to copy to.
 * @param plane The plane object to copy.
 * @returns The copied plane object in the model.
 */
export function CopyToModel(model: gs.IModel, point: gs.IPoint): gs.IPoint {
    error.checkPoint(point);
    // check it is not already in the model
    if (point.getModel() === model) {throw new Error("Error: point is already in model.");}
    // copy circle and return it
    return model.getGeom().addPoint(point.getPosition());
}

//  ===============================================================================================================
//  Point Constructors ============================================================================================
//  ===============================================================================================================

/**
 * Creates a point from XYZ coordinates.
 *
 * @param model Model to add points to.
 * @param xyz XYZ coordinates, as a list of three numbers.
 * @returns New point if successful, null if unsuccessful or on error.
 */
export function FromXYZ(model: gs.IModel, xyz: gs.XYZ): gs.IPoint {
    error.checkXYZ(xyz);
    return model.getGeom().addPoint(xyz);
}

/**
 * Creates a list of points from a list of X, Y and Z coordinates.
 * Points are returned in list order.
 *
 * @param model Model to add points to.
 * @param xyzs A list XYZ coordinates, as a list of lists of three numbers.
 * @returns New list of points if successful, null if unsuccessful or on error
 */
export function FromXYZs(model: gs.IModel, xyzs: gs.XYZ[]): gs.IPoint[] {
    const points: gs.IPoint[] = [];
    for (const xyz of xyzs as gs.XYZ[]) {
        error.checkXYZ(xyz);
        points.push(model.getGeom().addPoint(xyz));
    }
    return points;
}

/**
 * Creates a point that is at the center of a cluster of points.
 *
 * @param points List of points.
 * @returns New point if successful, null if unsuccessful or on error.
 */
export function FromPointsMean(points: gs.IPoint[]): gs.IPoint {
    const model: gs.IModel = error.checkPointList(points, 2);
    const xyz: number[] = [0,0,0];
    for (const point of points) {
        const pos: number[] = point.getPosition();
        xyz[0] += pos[0];
        xyz[1] += pos[1];
        xyz[2] += pos[2];
    }
    return model.getGeom().addPoint([xyz[0]/points.length, xyz[1]/points.length, xyz[2]/points.length]);
}

//  ===============================================================================================================
//  Point Functions ============================================================================================
//  ===============================================================================================================

/**
 * Moves a point or a list of points by a translation vector.
 *
 * @param points A point or a list of points.
 * @param vector Translation vector.
 * @param copy If true, points are copied before being moved.
 * @returns The moved points.
 */
export function move(points: gs.IPoint | gs.IPoint[], vector: gs.XYZ,
                     copy: boolean = false): gs.IPoint | gs.IPoint[] {
    const is_array: boolean = Array.isArray(points);
    if (!Array.isArray(points)) {points = [points];}
    const model: gs.IModel = error.checkPointList(points, 1);
    error.checkXYZ(vector);
    // translation matrix
    const matrix_trn: three.Matrix4 = new three.Matrix4();
    matrix_trn.makeTranslation(vector[0], vector[1], vector[2]);
    // copy points
    if (copy) {points = model.getGeom().copyPoints(points, true); }
    // do the xform
    model.getGeom().xformPoints(points, matrix_trn);
    // return either a single point or array of points
    if (is_array) {return points;}
    return points[0];
}

/**
 * Rotates a point or a list of points around an axis.
 *
 * @param points A point or a list of points.
 * @param origin An xyz point on the axis.
 * @param axis An xyz vector along the axis.
 * @param angle The angle, in degrees, between 0 and 360.
 * @param copy If true, points are copied before being rotated.
 * @returns The rotated points.
 */
export function rotate(points: gs.IPoint | gs.IPoint[], origin: gs.XYZ, axis: gs.XYZ,
                       angle: number, copy: boolean = false): gs.IPoint | gs.IPoint[] {
    // check args
    const is_array: boolean = Array.isArray(points);
    if (!Array.isArray(points)) {points = [points];}
    const model: gs.IModel = error.checkPointList(points, 1);
    error.checkXYZ(origin);
    error.checkXYZ(axis);
    const angle_rad: number = (angle / 180) * Math.PI;
    // rotation matrix
    const matrix_rot: three.Matrix4 = new three.Matrix4();
    matrix_rot.makeRotationAxis(new three.Vector3(...axis), angle_rad);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // copy points
    if (copy) {points = model.getGeom().copyPoints(points, true); }
    // do the xform
    model.getGeom().xformPoints(points, matrix_trn2.multiply(matrix_rot.multiply(matrix_trn1)));
    // return either a single point or array of points
    if (is_array) {return points;}
    return points[0];
}

/**
 * Scales a point or a list of points around an origin.
 *
 * @param points A point or a list of points.
 * @param origin An xyz origin point of the scale.
 * @param factor The scale factor, along the x, y and z axes.
 * @param copy If true, points are copied before being scaled.
 * @returns The scaled points.
 */
export function scale(points: gs.IPoint | gs.IPoint[], origin: gs.XYZ,
                      factor: gs.XYZ, copy: boolean = false): gs.IPoint | gs.IPoint[] {
    // check args
    const is_array: boolean = Array.isArray(points);
    if (!Array.isArray(points)) {points = [points];}
    const model: gs.IModel = error.checkPointList(points, 1);
    error.checkXYZ(origin);
    error.checkXYZ(factor);
    // scale matrix
    const matrix_scale: three.Matrix4 = new three.Matrix4();
    matrix_scale.makeScale(factor[0], factor[1], factor[2]);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // copy points
    if (copy) {points = model.getGeom().copyPoints(points, true); }
    // do the xform
    model.getGeom().xformPoints(points, matrix_trn2.multiply(matrix_scale.multiply(matrix_trn1)));
    // return either a single point or array of points
    if (is_array) {return points;}
    return points[0];
}

/**
 * Deletes a point or a list of points from the model.
 *
 * @param points Point or list of points to delete.
 * @returns True if successful
 */
export function del(points: gs.IPoint | gs.IPoint[]): boolean {
    if (!Array.isArray(points)) {points = [points];}
    const model: gs.IModel = error.checkPointList(points, 1);
    let ok: boolean = true;
    for (const point of points) {
        if (!point.exists()) {error.pointNotExist();}
        if (point.getModel() !== model) {error.pointInOtherModel();}
        if (!model.getGeom().delPoint(point)) {ok = false;}
    }
    return ok;
}

/**
 * Get the XYZ coordinates of the point.
 *
 * @param point Point to get coordinates from.
 * @returns The XYZ coordinates if successful, null if unsuccessful or on error.
 */
export function getXYZ(point: gs.IPoint): gs.XYZ {
    error.checkPoint(point);
    return point.getPosition();
}

/**
 * Set the XYZ coordinates of the point.
 *
 * @param point Point to set coorinates for.
 * @param xyz The new XYZ coordinates, as a list of three numbers.
 * @returns The old XYZ coordinates if successful, null if unsuccessful or on error.
 */
export function setXYZ(point: gs.IPoint, xyz: gs.XYZ): gs.XYZ {
    error.checkPoint(point);
    error.checkXYZ(xyz);
    return point.setPosition(xyz);
}

/**
 * Merges point or a list of points in the model.
 *
 * @param points Point or list of points to delete.
 * @returns True if successful, false otherwise.
 */
export function mergeByTol(points: gs.IPoint[], tolerance: number): gs.IPoint[] {
    const model: gs.IModel = error.checkPointList(points, 2);
    error.checkPosNum(tolerance);
    for (const point of points) {
        if (point.getModel() !== model) {throw new Error("Points must all be in same model.");}
        if (!point.exists()) {throw new Error("Point has been deleted.");}
    }
    return model.getGeom().mergePoints(points, tolerance);
}

/**
 * Merges a cluster of points into a single point.
 * The cluster of points are deletetd and replaced by one new point located at the center of the cluster.
 * All objects in the model that are using those points will be updated.
 *
 * @param points Cluster of points to merge.
 * @returns New point if successful, null if unsuccessful or on error.
 */
export function merge(points: gs.IPoint[]): gs.IPoint {
    const model: gs.IModel = error.checkPointList(points, 2);
    for (const point of points) {
        if (point.getModel() !== model) {error.pointInOtherModel();}
        if (!point.exists()) {error.pointNotExist();}
    }
    return model.getGeom().mergePoints(points)[0];
}

//  ===============================================================================================================
//  Groups ==============================================================================================
//  ===============================================================================================================

/**
 * Add points to a group.
 *
 * @param points List of points to add.
 * @param group_name Name of group to add to.
 * @returns True if all points were successfully added.
 */
export function addToGroup(points: gs.IPoint | gs.IPoint[], group_name: string): boolean {
    if (!Array.isArray(points)) {points = [points];}
    const model: gs.IModel = error.checkPointList(points, 1);
    const group: gs.IGroup = error.checkGroup(model, group_name);
    let ok: boolean = true;
    for (const point of points) {
        if (!point.exists()) {error.pointNotExist();}
        if (point.getModel() !== model) {error.pointInOtherModel();}
        if (!group.addPoint(point as gs.IPoint)) {ok = false;}
    }
    return ok;
}

/**
 * Remove points from a group.
 *
 * @param group Name of group to remove from.
 * @param objs List of point to remove.
 * @returns True if all points we successfully removed.
 */
export function removeFromGroup(points: gs.IPoint[] | gs.IPoint, group_name: string): boolean {
    if (!Array.isArray(points)) {points = [points];}
    const model: gs.IModel = error.checkPointList(points, 1);
    const group: gs.IGroup = error.checkGroup(model, group_name);
    let ok: boolean = true;
    for (const point of points) {
        if (!point.exists()) {error.pointNotExist();}
        if (point.getModel() !== model) {error.pointInOtherModel();}
        if (!group.removePoint(point as gs.IPoint)) {ok = false;}
    }
    return ok;
}

