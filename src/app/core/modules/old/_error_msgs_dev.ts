/**
 * Objects are a type of entity. They consist of conics, polylines, polymeshes, planes and rays.
 *
 * Objects are formed by a combination of topologies. More information can be found on the page for topo.
 */

import * as gs from "gs-json";

//  ===============================================================================================================
//  Error messages for end users ====================================================================================================
//  ===============================================================================================================

// Entities ====================================================================================================

export function checkEnt(ent: gs.IEnt): gs.IModel {
    if (!(ent instanceof gs.Ent)) {notEnt();}
    if (!ent.exists()) {entNotExist();}
    return ent.getModel();
}

export function checkEntList(ents: gs.IEnt[], min_len: number): gs.IModel {
    if (!Array.isArray(ents)) {mustBeEntList();}
    if (ents.length < min_len) {objListTooFew();}
    if (!(ents[0] instanceof gs.Ent)) {notEntInList();}
    const model: gs.IModel = ents[0].getModel();
    for (const ent of ents) {
        if (!(ent instanceof gs.Ent)) {notEntInList();}
        if (!ent.exists()) {entNotExist();}
        if (ent.getModel() !== model) {entInOtherModel();}
    }
    return model;
}

export function notEnt():void {
    throw new Error("The argument must be a point or object.");
}

export function notEntInList():void {
    throw new Error("One of the items in the list was neither a point nor an object.");
}

export function entNotExist():void {
    throw new Error("Point or object does not exist. It was probably deleted.");
}

export function mustBeEntList():void {
    throw new Error("A list of objects and/or points must be given.");
}

export function entListTooFew():void {
    throw new Error("The list conatins too few objects and/or points.");
}

export function entInOtherModel():void {
    throw new Error("Entity is in a different model.");
}

// Objects ====================================================================================================

export function checkObjID(model: gs.IModel, obj_id: number, obj_tye?: gs.EObjType):gs.IObj {
    const obj: gs.IObj = model.getGeom().getObj(obj_id);
    if (!obj.exists()) {objNotExist();}
    if (obj.getModel() !== model) {objInOtherModel();}
    if (obj_tye !== undefined) {
        if (obj.getObjType() !== obj_tye) {objWrongType();}
    }
    return obj;
}

export function checkObj(obj: gs.IObj, obj_tye?: gs.EObjType): gs.IModel {
    if (!obj.exists()) {objNotExist();}
    if (obj_tye !== undefined) {
        if (obj.getObjType() !== obj_tye) {objWrongType();}
    }
    return obj.getModel();
}

export function checkObjList(objs: gs.IObj[], min_len: number, obj_tye?: gs.EObjType): gs.IModel {
    if (!Array.isArray(objs)) {mustBeObjList();}
    if (objs.length < min_len) {objListTooFew();}
    const model: gs.IModel = objs[0].getModel();
    if (model === undefined) {mustBeObjList();}
    for (const obj of objs) {
        if (!obj.exists()) {objNotExist();}
        if (obj.getModel() !== model) {objInOtherModel();}
        if (obj_tye !== undefined) {
            if (obj.getObjType() !== obj_tye) {objWrongType();}
        }
    }
    return model;
}

export function checkObjsSameModel(objs: gs.IObj[]): void {
    if (!Array.isArray(objs)) {mustBeObjList();}
    const model: gs.IModel = objs[0].getModel();
    for (const obj of objs) {
        if (obj.getModel() !== model) {objInOtherModel();}
    }
}

export function objNotExist():void {
    throw new Error("Object does not exist. It was probably deleted.");
}

export function objInOtherModel():void {
    throw new Error("Object is in a different model.");
}

export function objWrongType():void {
    throw new Error("Object is of wrong type.");
}

export function pointNotExist():void {
    throw new Error("Point does not exist. It was probably deleted.");
}

export function objListTooFew():void {
    throw new Error("The list conatins too few objects.");
}

export function objListEmpty():void {
    throw new Error("The list of objects was empty.");
}

export function mustBeObjList():void {
    throw new Error("A list of objects must be given.");
}

// Points ====================================================================================================

export function checkPointID(model: gs.IModel, point_id: number):gs.IPoint {
    const point: gs.IPoint = model.getGeom().getPoint(point_id);
    if (!point.exists()) {pointNotExist();}
    if (point.getModel() !== model) {pointInOtherModel();}
    return point;
}

export function checkPoint(point: gs.IPoint): gs.IModel {
    if (!point.exists()) {objNotExist();}
    return point.getModel();
}

export function checkPointList(points: gs.IPoint[], min_len: number): gs.IModel {
    if (!Array.isArray(points)) {mustBePointList();}
    if (points.length < min_len) {pointListTooFew();}
    const model: gs.IModel = points[0].getModel();
    for (const point of points) {
        if (!point.exists()) {pointNotExist();}
        if (point.getModel() !== model) {pointInOtherModel();}
    }
    return model;
}

export function checkPointNestedList(points: gs.IPoint[][], min_len1: number, min_len2: number): gs.IModel {
    if (!Array.isArray(points)) {mustBePointNestedList();}
    const list_len1: number = points.length;
    if (list_len1 < min_len1) {pointNestedListTooFew();}
    const list_len2: number = points[0].length;
    if (list_len2 < min_len2) {pointListTooFew();}
    const model: gs.IModel = points[0][0].getModel();
    for (const point_list of points) {
        if (!Array.isArray(point_list)) {mustBePointList();}
        if (point_list.length < min_len2) {pointListTooFew();}
        for (const point of point_list) {
            if (!point.exists()) {pointNotExist();}
            if (point.getModel() !== model) {pointInOtherModel();}
        }
    }
    return model;
}

export function checkPointsSameModel(points: gs.IPoint[]): void {
    if (!Array.isArray(points)) {mustBePointList();}
    const model: gs.IModel = points[0].getModel();
    for (const point of points) {
        if (point.getModel() !== model) {pointInOtherModel();}
    }
}

export function pointInOtherModel():void {
    throw new Error("Point is in a different model.");
}

export function pointListEmpty():void {
    throw new Error("The list of points was empty.");
}

export function pointListTooFew():void {
    throw new Error("The list of points did not contain enough points.");
}

export function pointNestedListTooFew():void {
    throw new Error("The list did not contain enough points lists.");
}

export function pointNestedListJagged():void {
    throw new Error("The lists of points must all be of equal length.");
}

export function mustBePointList():void {
    throw new Error("A list of points must be given.");
}

export function mustBePointNestedList():void {
    throw new Error("A list of lists of points must be given.");
}

// IDs ====================================================================================================

export function invalidID():void {
    throw new Error("The ID is invalid. It must be an integer number.");
}

export function mustBeIDList():void {
    throw new Error("A list of IDs must be given.");
}

// GROUPS ====================================================================================================

export function checkGroup(model: gs.IModel,group_name: string):gs.IGroup {
    const group: gs.IGroup = model.getGroup(group_name);
    if (group === undefined) {groupNotExist();}
    return group;
}

export function groupNotExist():void {
    throw new Error("Group does not exist.");
}

// XYZ ====================================================================================================

export function checkXYZ(xyz: gs.XYZ):void {
    if (xyz === undefined) {argUndefined();}
    if (!Array.isArray(xyz)) {xyzNotList()}
    if (xyz.length !== 3 ) {xyzWrongLength();}
    if (isNaN(xyz[0]) || isNaN(xyz[1]) || isNaN(xyz[2])) {xyzInvalidData();}
}

export function xyzWrongLength():void {
    throw new Error("XYZ list is wrong length. It should consist of three numbers.");
}

export function xyzInvalidData():void {
    throw new Error("XYZ list contains invalid data. It should consist of three numbers.");
}

export function xyzNotList():void {
    throw new Error("XYZ list must be a list of three numbers.");
}

// Angles ====================================================================================================

// export function checkAngles(angles: [number, number]):void {
//     if (angles === undefined) {argUndefined();}
//     if (angles.length !== 2 ) {anglesWrongLength();}
//     if (isNaN(angles[0]) || isNaN(angles[1])) {anglesInvalidData();}
//     if (angles[0] < 0 || angles[0] > 360) {anglesInvalidData();}
//     if (angles[1] < 0 || angles[1] > 360) {anglesInvalidData();}
// }

// export function anglesWrongLength():void {
//     throw new Error("Angles list is wrong length. It should consist of two numbers between 0 and 360.");
// }

// export function anglesInvalidData():void {
//     throw new Error("Angles list contains invalid data. It should consist of two numbers between 0 and 360.");
// }

// Numbers ====================================================================================================

export function checkNum(x: number):void {
    if (x === undefined) {argUndefined();}
}

export function checkPosNum(x: number):void {
    if (x === undefined) {argUndefined();}
    if (x < 0 ) {numMustBePos();}
}

export function checkPosNums(nums: number[]):void {
    if (nums === undefined) {argUndefined();}
    for (const num of nums) {
        if (num < 0 ) {numMustBePos();}
    }
}

export function checkNumListLength(list: any[], length:number):void {
    if (list === undefined) {argUndefined();}
    if (!Array.isArray(list)) {argMustBeNumList(length);}
    if (list.length !== length) {argNumListWrongLength(length);}
}

export function argMustBeNumList(length: number):void {
    throw new Error("Argument must be a list of " + length + "numbers.");
}

export function argNumListWrongLength(length: number):void {
    throw new Error("Argument must be a list of " + length + " numbers.");
}

export function numMustBePos():void {
    throw new Error("Argument must be a positive number.");
}

// GENERAL ====================================================================================================

export function argUndefined():void {
    throw new Error("Argument is undefined.");
}


