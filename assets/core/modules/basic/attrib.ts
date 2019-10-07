/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * ~
 * ~
 */

/**
 *
 */
import __ from 'underscore';
import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntType, ESort, TEntTypeIdx,
    EAttribPush, TAttribDataTypes, EEntTypeStr, EAttribDataTypeStrs} from '@libs/geo-info/common';
import { idsMake, getArrDepth, isEmptyArr } from '@libs/geo-info/id';
import { checkIDs, IDcheckObj, checkCommTypes, TypeCheckObj, checkAttribValue, checkAttribName } from '../_check_args';
import { GIAttribMap } from '@libs/geo-info/GIAttribMap';

// ================================================================================================
export enum _EEntTypeSel {
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

function _getEntTypeFromStr(ent_type_str: _EEntTypeSel): EEntType {
    switch (ent_type_str) {
        case _EEntTypeSel.POSI:
            return EEntType.POSI;
        case _EEntTypeSel.VERT:
            return EEntType.VERT;
        case _EEntTypeSel.EDGE:
            return EEntType.EDGE;
        case _EEntTypeSel.WIRE:
            return EEntType.WIRE;
        case _EEntTypeSel.FACE:
            return EEntType.FACE;
        case _EEntTypeSel.POINT:
            return EEntType.POINT;
        case _EEntTypeSel.PLINE:
            return EEntType.PLINE;
        case _EEntTypeSel.PGON:
            return EEntType.PGON;
        case _EEntTypeSel.COLL:
            return EEntType.COLL;
        case _EEntTypeSel.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
export enum _EDataTypeSel {
    NUMBER =   'number',
    STRING =   'string',
    BOOLEAN = 'boolean',
    LIST =   'list',
    DICT = 'dict'
}
// ================================================================================================
// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * All attribute values will be set to null.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute
 * @param attribs A single attribute name, or a list of attribute names.
 */
export function Add(__model__: GIModel, ent_type_sel: _EEntTypeSel, data_type_sel: _EDataTypeSel, attribs: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'attrib.Add';
    const arg_name = 'ent_type_sel';
    if (ent_type_sel === 'ps' && attribs === 'xyz') {
        throw new Error(fn_name + ': ' + arg_name + ' The xyz attribute already exists.');
     }
    // convert the ent_type_str to an ent_type
    const ent_type: EEntType = _getEntTypeFromStr(ent_type_sel);
    if (ent_type === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
        'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
    }
    // create an array of attrib names
    if (!Array.isArray(attribs)) { attribs = [attribs]; }
    attribs = attribs as string[];
    for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
    // --- Error Check ---
    // set the data type
    let data_type: EAttribDataTypeStrs = null;
    switch (data_type_sel) {
        case _EDataTypeSel.NUMBER:
            data_type = EAttribDataTypeStrs.NUMBER;
            break;
        case _EDataTypeSel.STRING:
            data_type = EAttribDataTypeStrs.STRING;
            break;
        case _EDataTypeSel.BOOLEAN:
            data_type = EAttribDataTypeStrs.BOOLEAN;
            break;
        case _EDataTypeSel.LIST:
            data_type = EAttribDataTypeStrs.LIST;
            break;
        case _EDataTypeSel.DICT:
            data_type = EAttribDataTypeStrs.DICT;
            break;
        default:
            throw new Error('Data type not recognised.');
            break;
    }
    // create the attribute
    for (const attrib of attribs) {
        __model__.attribs.add.addAttrib(ent_type, attrib, data_type);
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
export function Delete(__model__: GIModel, ent_type_sel: _EEntTypeSel, attribs: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'attrib.Delete';
    const arg_name = 'ent_type_sel';
    if (ent_type_sel === 'ps' && attribs === 'xyz') {
        throw new Error(fn_name + ': ' + arg_name + ' Deleting xyz attribute is not allowed.');
     }
    // convert the ent_type_str to an ent_type
    const ent_type: EEntType = _getEntTypeFromStr(ent_type_sel);
    if (ent_type === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
        'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
    }
    // create an array of attrib names
    if (attribs === null) { attribs = __model__.attribs.query.getAttribNamesUser(ent_type); }
    if (!Array.isArray(attribs)) { attribs = [attribs]; }
    attribs = attribs as string[];
    for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
    // --- Error Check ---
    // delete the attributes
    for (const attrib of attribs) {
        __model__.attribs.modify.delAttrib(ent_type, attrib);
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
export function Rename(__model__: GIModel, ent_type_sel: _EEntTypeSel, old_attrib: string, new_attrib: string): void {
    if (ent_type_sel === 'ps' && old_attrib === 'xyz') { return; }
    // --- Error Check ---
    const fn_name = 'attrib.Rename';
    const arg_name = 'ent_type_sel';
    checkAttribName(fn_name , old_attrib);
    checkAttribName(fn_name , new_attrib);
    // --- Error Check ---
    // convert the ent_type_str to an ent_type
    const ent_type: EEntType = _getEntTypeFromStr(ent_type_sel);
    if (ent_type === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
        'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
    }
    // create the attribute
    __model__.attribs.modify.renameAttrib(ent_type, old_attrib, new_attrib);
}
// ================================================================================================
/**
 * Set an attribute value for one or more entities.
 * ~
 * If entities is null, then model level attributes will be set.
 * ~
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param attrib The attribute name.
 * @param idx_or_key Optional, The attribute index if setting a value in a list, or null otherwise.
 * @param value The attribute value, or list of values.
 */
export function Set(__model__: GIModel, entities: TId|TId[]|TId[][],
                              attrib: string, idx_or_key: number, value: TAttribDataTypes|TAttribDataTypes[]): void {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
    // --- Error Check ---
    const fn_name = 'attrib.Set';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkAttribName(fn_name , attrib);
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, attrib, value, idx_or_key);
}
function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], idx_or_key?: number|string): void {
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
    // are we setting a list of ents to a list of values? ie many to many?
    const attrib_values_depth: number = getArrDepth(attrib_values);
    const first_ent_type: number = ents_arr[0][0];
    if (__model__.attribs.query.hasAttrib(first_ent_type, attrib_name)) {
        const attrib_data_type: EAttribDataTypeStrs = __model__.attribs.query.getAttribDataType(first_ent_type, attrib_name);
        const attrib_is_list: boolean = attrib_data_type === EAttribDataTypeStrs.LIST;
        const values_is_list: boolean = attrib_values_depth > 0;
        // many to many should only be true in cases where the opposite would cause an error
        if (!attrib_is_list && values_is_list) {
            _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], idx_or_key);
            return;
        }
    }
    // all ents get the same attribute value
    _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, idx_or_key);
    return;
}
function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number|string): void {
    if (typeof idx_or_key === 'number') {
        __model__.attribs.add.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value as number);
    } if (typeof idx_or_key === 'string') {
        __model__.attribs.add.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value as string);
    } else {
        __model__.attribs.add.setModelAttribVal(attrib_name, attrib_value);
    }
}
function _setEachEntDifferentAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes[], idx_or_key?: number|string): void {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error(
            'If multiple attributes are being set to multiple values, then the number of entities must match the number of values.');
    }
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    for (let i = 0; i < ents_arr.length; i++) {
        // --- Error Check ---
        const fn_name = 'entities@' + attrib_name;
        checkAttribValue(fn_name , attrib_values[i], idx_or_key);
        // --- Error Check ---
        if (typeof idx_or_key === 'number') {
            __model__.attribs.add.setAttribListIdxVal(ent_type, ents_i[i], attrib_name, idx_or_key, attrib_values[i]);
        } if (typeof idx_or_key === 'string') {
            __model__.attribs.add.setAttribDictKeyVal(ent_type, ents_i[i], attrib_name, idx_or_key, attrib_values[i]);
        } else {
            __model__.attribs.add.setAttribVal(ent_type, ents_i[i], attrib_name, attrib_values[i]);
        }
    }
}
function _setEachEntSameAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
        attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number|string): void {
    // --- Error Check ---
    const fn_name = 'entities@' + attrib_name;
    checkAttribValue(fn_name , attrib_value, idx_or_key);
    // --- Error Check ---
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    if (typeof idx_or_key === 'number') {
        __model__.attribs.add.setAttribListIdxVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    } else if (typeof idx_or_key === 'string') {
        __model__.attribs.add.setAttribDictKeyVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    } else {
        __model__.attribs.add.setAttribVal(ent_type, ents_i, attrib_name, attrib_value);
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
 * @param attrib The attribute name.
 * @returns One attribute value, or a list of attribute values.
 */
export function Get(__model__: GIModel, entities: TId|TId[]|TId[][],
        attrib: string, index: number): TAttribDataTypes|TAttribDataTypes[] {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
    // --- Error Check ---
    const fn_name = 'attrib.Get';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkAttribName(fn_name, attrib);
    // checkCommTypes(fn_name, 'name', name, [TypeCheckObj.isString]);
    if (index !== null && index !== undefined) {
        checkCommTypes(fn_name, 'index', index, [TypeCheckObj.isNumber, TypeCheckObj.isString]);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, attrib, index);
}
function _get(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_index?: number): TAttribDataTypes|TAttribDataTypes[] {
    const has_index: boolean = attrib_index !== null && attrib_index !== undefined;
    if (ents_arr === null) {
        if (has_index) {
            return __model__.attribs.query.getModelAttribListIdxVal(attrib_name, attrib_index);
        } else {
            return __model__.attribs.query.getModelAttribVal(attrib_name);
        }
    } else if (ents_arr.length === 0) {
        return [];
    } else if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (attrib_name === '_id') {
            if (has_index) { throw new Error('The "_id" attribute does have an index.'); }
            return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
        } else if (has_index) {
            return __model__.attribs.query.getAttribListIdxVal(ent_type, attrib_name, ent_i, attrib_index);
        } else {
            return __model__.attribs.query.getAttribVal(ent_type, attrib_name, ent_i);
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr =>
            _get(__model__, ent_arr, attrib_name, attrib_index) ) as TAttribDataTypes[];
    }
}
// ================================================================================================
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * ~
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute name, can be one or two names.
 * @param ent_type_sel Enum, the traget entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
export function Push(__model__: GIModel, entities: TId|TId[],
        attrib: string|[string, string], ent_type_sel: _EEntTypeSel, method_sel: _EPushMethodSel): void {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
    // --- Error Check ---
    const fn_name = 'attrib.Push';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // get the source ent_type and indices
    const source_ent_type: EEntType = ents_arr[0][0];
    const indices: number[] = [];
    for (const ent_arr of ents_arr) {
        if (ent_arr[0] !== source_ent_type) {
            throw new Error('The entities must all be of the same type.');
        }
        indices.push(ent_arr[1]);
    }
    // get the source and target names
    const is_array: boolean = Array.isArray(attrib);
    if (is_array && attrib.length < 2) { throw new Error('Two attribute names must be defined, the existing name and the new name.'); }
    const source_attrib: string =  is_array ? attrib[0] : attrib as string;
    const target_attrib: string =  is_array ? attrib[1] : attrib as string;
    // check the names
    checkAttribName(fn_name, source_attrib);
    checkAttribName(fn_name, target_attrib);
    // get the target enty_type
    const target_ent_type: EEntType = _getEntTypeFromStr(ent_type_sel);
    if (source_ent_type === target_ent_type) { throw new Error('The new attribute is at the same level as the existing attribute.'); }
    // get the method
    const method: EAttribPush = _convertPushMethod(method_sel);
    // do the push
    __model__.attribs.add.pushAttribVals(source_ent_type, source_attrib, indices, target_ent_type, target_attrib, method);
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
