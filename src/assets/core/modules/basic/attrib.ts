/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * ~
 * ~
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkAttribValue, checkAttribName,
    checkAttribIdxKey, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../_check_attribs';

import uscore from 'underscore';
import { GIModel } from '@libs/geo-info/GIModel';
import { TId, EEntType, TEntTypeIdx,
    EAttribPush, TAttribDataTypes, EEntTypeStr, EAttribDataTypeStrs } from '@libs/geo-info/common';
import { getArrDepth, idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import * as lodash from 'lodash';
// ================================================================================================

export enum _EEntType {
    POSI =   'ps',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    FACE =   '_f',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co'
}
export enum _EEntTypeAndMod {
    POSI =   'ps',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    FACE =   '_f',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co',
    MOD =    'mo'
}
export enum _EAttribPushTarget {
    POSI =   'ps',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    FACE =   '_f',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co',
    COLLP =  'cop',
    COLLC =  'coc',
    MOD =    'mo'
}
export enum _EDataType {
    NUMBER =   'number',
    STRING =   'string',
    BOOLEAN = 'boolean',
    LIST =   'list',
    DICT = 'dict'
}
function _getEntTypeFromStr(ent_type_str: _EEntType|_EEntTypeAndMod): EEntType {
    switch (ent_type_str) {
        case _EEntTypeAndMod.POSI:
            return EEntType.POSI;
        case _EEntTypeAndMod.VERT:
            return EEntType.VERT;
        case _EEntTypeAndMod.EDGE:
            return EEntType.EDGE;
        case _EEntTypeAndMod.WIRE:
            return EEntType.WIRE;
        case _EEntTypeAndMod.POINT:
            return EEntType.POINT;
        case _EEntTypeAndMod.PLINE:
            return EEntType.PLINE;
        case _EEntTypeAndMod.PGON:
            return EEntType.PGON;
        case _EEntTypeAndMod.COLL:
            return EEntType.COLL;
        case _EEntTypeAndMod.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
function _getAttribPushTarget(ent_type_str: _EAttribPushTarget): EEntType|string {
    switch (ent_type_str) {
        case _EAttribPushTarget.POSI:
            return EEntType.POSI;
        case _EAttribPushTarget.VERT:
            return EEntType.VERT;
        case _EAttribPushTarget.EDGE:
            return EEntType.EDGE;
        case _EAttribPushTarget.WIRE:
            return EEntType.WIRE;
        case _EAttribPushTarget.POINT:
            return EEntType.POINT;
        case _EAttribPushTarget.PLINE:
            return EEntType.PLINE;
        case _EAttribPushTarget.PGON:
            return EEntType.PGON;
        case _EAttribPushTarget.COLL:
            return EEntType.COLL;
        case _EAttribPushTarget.COLLC:
            return 'coll_children';
        case _EAttribPushTarget.COLLP:
            return 'coll_parent';
        case _EAttribPushTarget.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
// ================================================================================================
/**
 * Set an attribute value for one or more entities.
 * ~
 * If entities is null, then model level attributes will be set.
 * ~
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param value The attribute value, or list of values.
 * @param method Enum
 */
export function Set(__model__: GIModel, entities: TId|TId[]|TId[][],
        attrib: string|[string, number|string], value: TAttribDataTypes|TAttribDataTypes[], method: _ESet): void {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = uscore.flatten(entities); }
    // --- Error Check ---
    const fn_name = 'attrib.Set';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    let attrib_name: string;
    let attrib_idx_key: number|string;
    if (__model__.debug) {
        if (value === undefined) {
            throw new Error(fn_name + ': value is undefined');
        }
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isNull, ID.isID, ID.isIDL], null) as TEntTypeIdx|TEntTypeIdx[];
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name , attrib_name);
    } else {
        if (entities !== null) {
            ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, attrib_name, value, attrib_idx_key, method);
}
export enum _ESet {
    ONE_VALUE =   'one_value',
    MANY_VALUES =   'many_values'
}
function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], idx_or_key: number|string, method: _ESet): void {
    // check the ents_arr
    if (ents_arr === null) {
        _setModelAttrib(__model__, attrib_name, attrib_values as TAttribDataTypes, idx_or_key);
        return;
    } else if (ents_arr.length === 0) {
        return;
    } else if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    ents_arr = ents_arr as TEntTypeIdx[];
    // all ents get the same attribute value
    if (method === _ESet.MANY_VALUES) {
        _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], idx_or_key);
    } else {
        _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, idx_or_key);
    }
    return;
}
function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number|string): void {
    if (typeof idx_or_key === 'number') {
        __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value as number);
    } if (typeof idx_or_key === 'string') {
        __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value as string);
    } else {
        __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
    }
}
function _setEachEntDifferentAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes[], idx_or_key?: number|string): void {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error(
            'If multiple entities are being set to multiple values, then the number of entities must match the number of values.');
    }
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    for (let i = 0; i < ents_arr.length; i++) {
        // --- Error Check ---
        if (__model__.debug) {
            const fn_name = 'entities@' + attrib_name;
            checkAttribValue(fn_name, attrib_values[i]);
            if (idx_or_key !== null) { checkAttribIdxKey(fn_name, idx_or_key); }
        }
        // --- Error Check ---
        // if this is a complex type, make a deep copy
        let val: TAttribDataTypes = attrib_values[i];
        if (val instanceof Object) { val = lodash.cloneDeep(val); }
        if (typeof idx_or_key === 'number') {
            __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        } if (typeof idx_or_key === 'string') {
            __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        } else {
            __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i[i], attrib_name, val);
        }
    }
}
function _setEachEntSameAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
        attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number|string): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'entities@' + attrib_name;
        checkAttribValue(fn_name , attrib_value);
    }
    // --- Error Check ---
    // if this is a complex type, make a deep copy
    if (attrib_value instanceof Object) { attrib_value = lodash.cloneDeep(attrib_value); }
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    if (typeof idx_or_key === 'number') {
        __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    } else if (typeof idx_or_key === 'string') {
        __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    } else {
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i, attrib_name, attrib_value);
    }
}
function _getEntsIndices(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = [];
    for (let i = 0; i < ents_arr.length; i++) {
        if (ents_arr[i][0] !== ent_type) {
            throw new Error('If an attribute is being set for multiple entities, then they must all be of the same type.');
        }
        ents_i.push(ents_arr[i][1]);
    }
    return ents_i;
}
// ================================================================================================
/**
 * Get attribute values for one or more entities.
 * ~
 * If entities is null, then model level attributes will be returned.
 * ~
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @returns One attribute value, or a list of attribute values.
 */
export function Get(__model__: GIModel, entities: TId|TId[]|TId[][],
        attrib: string|[string, number|string]): TAttribDataTypes|TAttribDataTypes[] {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = uscore.flatten(entities); }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    let attrib_name: string;
    let attrib_idx_key: number|string;
    const fn_name = 'attrib.Get';
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL], null) as TEntTypeIdx|TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name, attrib_name);
    } else {
        if (entities !== null && entities !== undefined) {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, attrib_name, attrib_idx_key);
}
function _get(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_idx_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
    const has_idx_key: boolean = attrib_idx_key !== null && attrib_idx_key !== undefined;
    if (ents_arr === null) {
        // get the attrib values from the model
        if (typeof attrib_idx_key === 'number') {
            return __model__.modeldata.attribs.get.getModelAttribListIdxVal(attrib_name, attrib_idx_key);
        } else if (typeof attrib_idx_key === 'string') {
            return __model__.modeldata.attribs.get.getModelAttribDictKeyVal(attrib_name, attrib_idx_key);
        } else {
            return __model__.modeldata.attribs.get.getModelAttribVal(attrib_name);
        }
    } else if (ents_arr.length === 0) {
        return [];
    } else if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        // check if this is ID
        if (attrib_name === '_id') {
            if (has_idx_key) { throw new Error('The "_id" attribute does have an index.'); }
            return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
        }
        // get the attrib values from the ents
        let val: TAttribDataTypes;
        if (typeof attrib_idx_key === 'number') {
            val =  __model__.modeldata.attribs.get.getEntAttribListIdxVal(ent_type, ent_i, attrib_name, attrib_idx_key as number);
        } else if (typeof attrib_idx_key === 'string') {
            val =  __model__.modeldata.attribs.get.getEntAttribDictKeyVal(ent_type, ent_i, attrib_name, attrib_idx_key as string);
        } else {
            val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, attrib_name);
        }
        // if this is a complex type, make a deep copy
        if (val instanceof Object) { val = lodash.cloneDeep(val); }
        return val;
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr =>
            _get(__model__, ent_arr, attrib_name, attrib_idx_key) ) as TAttribDataTypes[];
    }
}
// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute
 * @param attribs A single attribute name, or a list of attribute names.
 */
export function Add(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, data_type_sel: _EDataType, attribs: string|string[]): void {
    // --- Error Check ---

    const fn_name = 'attrib.Add';
    const arg_name = 'ent_type_sel';
    let ent_type: EEntType;

    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' The xyz attribute already exists.');
         }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
            'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
        for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
    } else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
    }

    // --- Error Check ---
    // set the data type
    let data_type: EAttribDataTypeStrs = null;
    switch (data_type_sel) {
        case _EDataType.NUMBER:
            data_type = EAttribDataTypeStrs.NUMBER;
            break;
        case _EDataType.STRING:
            data_type = EAttribDataTypeStrs.STRING;
            break;
        case _EDataType.BOOLEAN:
            data_type = EAttribDataTypeStrs.BOOLEAN;
            break;
        case _EDataType.LIST:
            data_type = EAttribDataTypeStrs.LIST;
            break;
        case _EDataType.DICT:
            data_type = EAttribDataTypeStrs.DICT;
            break;
        default:
            throw new Error('Data type not recognised.');
            break;
    }
    // create the attribute
    for (const attrib of attribs) {
        __model__.modeldata.attribs.add.addAttrib(ent_type, attrib, data_type);
    }
}
// ================================================================================================
/**
 * Delete one or more attributes from the model.
 * The column in the attribute table will be deleted.
 * All values will also be deleted.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param attribs A single attribute name, or a list of attribute names. In 'null' all attributes will be deleted.
 */
export function Delete(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, attribs: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'attrib.Delete';
    const arg_name = 'ent_type_sel';
    let ent_type: EEntType;
    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' Deleting xyz attribute is not allowed.');
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
            'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (attribs === null) { attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type); }
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
        for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
    } else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (attribs === null) { attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type); }
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
    }
    // --- Error Check ---
    // delete the attributes
    for (const attrib of attribs) {
        __model__.modeldata.attribs.del.delEntAttrib(ent_type, attrib);
    }
}
// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param old_attrib The old attribute name.
 * @param new_attrib The old attribute name.
 */
export function Rename(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, old_attrib: string, new_attrib: string): void {
    if (ent_type_sel === 'ps' && old_attrib === 'xyz') { return; }
    // --- Error Check ---
    const fn_name = 'attrib.Rename';
    const arg_name = 'ent_type_sel';
    const ent_type: EEntType = _getEntTypeFromStr(ent_type_sel);
    if (__model__.debug) {
        checkAttribName(fn_name , old_attrib);
        checkAttribName(fn_name , new_attrib);
        // --- Error Check ---
        // convert the ent_type_str to an ent_type
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
            'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
    }
    // create the attribute
    __model__.modeldata.attribs.renameAttrib(ent_type, old_attrib, new_attrib);
}
// ================================================================================================
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * ~
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index_or_key]`,
 * `[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.
 * @param ent_type_sel Enum, the target entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
export function Push(__model__: GIModel, entities: TId|TId[],
        attrib: string|[string, number|string]|[string, number|string, string]|[string, number|string, string, number|string],
        ent_type_sel: _EAttribPushTarget, method_sel: _EPushMethodSel): void {
    if (entities !== null) {
        const depth = getArrDepth(entities);
        if (depth === 0) {
            entities = [entities] as TId[];
        } else if (depth === 2) {
            // @ts-ignore
            entities = uscore.flatten(entities) as TId[];
        }
    }
    // --- Error Check ---
    const fn_name = 'attrib.Push';

    let ents_arr: TEntTypeIdx[] = null;
    let source_attrib_name: string;
    let source_attrib_idx_key: number|string;
    let target_attrib_name: string;
    let target_attrib_idx_key: number|string;
    let source_ent_type: EEntType;
    const indices: number[] = [];
    let target: EEntType|string;
    let source_attrib: [string, number|string] = null;
    let target_attrib: [string, number|string] = null;
    if (Array.isArray(attrib)) {
        // set source attrib
        source_attrib = [
            attrib[0] as string,
            (attrib.length > 1 ? attrib[1] : null) as number|string
        ];
        // set target attrib
        target_attrib = [
            (attrib.length > 2 ? attrib[2] : attrib[0]) as string,
            (attrib.length > 3 ? attrib[3] : null) as number|string
        ];
    } else {
        source_attrib = [attrib, null];
        target_attrib = [attrib, null];
    }

    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        }
        [source_attrib_name, source_attrib_idx_key] = checkAttribNameIdxKey(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = checkAttribNameIdxKey(fn_name, target_attrib);
        // --- Error Check ---
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] !== source_ent_type) {
                throw new Error('The entities must all be of the same type.');
            }
            indices.push(ent_arr[1]);
        }
        // check the names
        checkAttribName(fn_name, source_attrib_name);
        checkAttribName(fn_name, target_attrib_name);
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
        if (source_ent_type === target) {
            throw new Error('The new attribute is at the same level as the existing attribute.');
        }
    } else {
        if (entities !== null && entities !== undefined) {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        [source_attrib_name, source_attrib_idx_key] = splitAttribNameIdxKey(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = splitAttribNameIdxKey(fn_name, target_attrib);

        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            indices.push(ent_arr[1]);
        }
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
        //
        throw new Error('Snapshot Not implemented');
    }

    // let ents_arr: TEntTypeIdx[] = null;
    // if (entities !== null && entities !== undefined) {
    //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    // }
    // let source_attrib: [string, number|string] = null;
    // let target_attrib: [string, number|string] = null;
    // if (Array.isArray(attrib)) {
    //     // set source attrib
    //     source_attrib = [
    //         attrib[0] as string,
    //         (attrib.length > 1 ? attrib[1] : null) as number|string
    //     ];
    //     // set target attrib
    //     target_attrib = [
    //         (attrib.length > 2 ? attrib[2] : attrib[0]) as string,
    //         (attrib.length > 3 ? attrib[3] : null) as number|string
    //     ];
    // } else {
    //     source_attrib = [attrib, null];
    //     target_attrib = [attrib, null];
    // }
    // const [source_attrib_name, source_attrib_idx_key]: [string, number|string] = checkAttribNameIdxKey(fn_name, source_attrib);
    // const [target_attrib_name, target_attrib_idx_key]: [string, number|string] = checkAttribNameIdxKey(fn_name, target_attrib);
    // // --- Error Check ---
    // // get the source ent_type and indices
    // const source_ent_type: EEntType = ents_arr[0][0];
    // const indices: number[] = [];
    // for (const ent_arr of ents_arr) {
    //     if (ent_arr[0] !== source_ent_type) {
    //         throw new Error('The entities must all be of the same type.');
    //     }
    //     indices.push(ent_arr[1]);
    // }
    // // check the names
    // checkAttribName(fn_name, source_attrib_name);
    // checkAttribName(fn_name, target_attrib_name);
    // // get the target ent_type
    // const target: EEntType|string = _getAttribPushTarget(ent_type_sel);
    // if (source_ent_type === target) {
    //     throw new Error('The new attribute is at the same level as the existing attribute.');
    // }

    // get the method
    const method: EAttribPush = _convertPushMethod(method_sel);
    // do the push
    __model__.modeldata.attribs.push.pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, indices,
                                         target,          target_attrib_name, target_attrib_idx_key, method);
}
export enum _EPushMethodSel {
    FIRST = 'first',
    LAST = 'last',
    AVERAGE = 'average',
    MEDIAN = 'median',
    SUM = 'sum',
    MIN = 'min',
    MAX = 'max'
}
function _convertPushMethod(select: _EPushMethodSel): EAttribPush {
    switch (select) {
        case _EPushMethodSel.AVERAGE:
            return EAttribPush.AVERAGE;
        case _EPushMethodSel.MEDIAN:
            return EAttribPush.MEDIAN;
        case _EPushMethodSel.SUM:
            return EAttribPush.SUM;
        case _EPushMethodSel.MIN:
            return EAttribPush.MIN;
        case _EPushMethodSel.MAX:
            return EAttribPush.MAX;
        case _EPushMethodSel.FIRST:
            return EAttribPush.FIRST;
        case _EPushMethodSel.LAST:
            return EAttribPush.LAST;
        default:
            break;
    }
}
// ================================================================================================
