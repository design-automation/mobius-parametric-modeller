/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * ~
 * ~
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntType, ESort, TEntTypeIdx,
    EAttribPush, TAttribDataTypes, EEntTypeStr} from '@libs/geo-info/common';
import { idsMake, getArrDepth, isEmptyArr } from '@libs/geo-info/id';
import { checkIDs, IDcheckObj, checkCommTypes, TypeCheckObj, checkAttribValue, checkAttribName } from './_check_args';

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
    COLL =   'co'
    // ,
    // OBJS =   'objects',
    // TOPOS =  'topologies',
    // ALL =    'all'
}
function _convertEntTypeSel(Sel: _EEntTypeSel): EEntType|EEntType[] {
    switch (Sel) {
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
        // case _EEntTypeEnum.OBJS:
        //     return [
        //         EEntType.POINT,
        //         EEntType.PLINE,
        //         EEntType.PGON
        //     ];
        // case _EEntTypeEnum.TOPOS:
        //     return [
        //         EEntType.VERT,
        //         EEntType.EDGE,
        //         EEntType.WIRE,
        //         EEntType.FACE
        //     ];
        // case _EEntTypeEnum.ALL:
        //     return [
        //         EEntType.POSI,
        //         EEntType.VERT,
        //         EEntType.EDGE,
        //         EEntType.WIRE,
        //         EEntType.FACE,
        //         EEntType.POINT,
        //         EEntType.PLINE,
        //         EEntType.PGON,
        //         EEntType.COLL
        //     ];
        default:
            throw new Error('Entity type not recognised.');
    }
}
// ================================================================================================
// ================================================================================================
/**
 * Add an attribute to the model.
 * The attribute will appear as a new column in the attribute table.
 * All attribute values will be set to null.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param name The attribute name.
 * @param template The template for the attribute. For example, 123 or "abc" or [1,2,3] or ["a", "b", "c"].
 * @returns True if the attribute was added. False otherwise.
 */
export function Add(__model__: GIModel, ent_type_sel: _EEntTypeSel, name: string, template: TAttribDataTypes): boolean {
    console.log('calling add attrib');
    return true;
}
// ================================================================================================
/**
 * Delete an attribute from the model.
 * The column in the attribute table will be deleted.
 * All values will also be deleted.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param name The attribute name.
 * @returns True if the attribute was deleted. False otherwise.
 */
export function Delete(__model__: GIModel, ent_type_sel: _EEntTypeSel, name: string): boolean {
    console.log('calling delete attrib');
    return true;
}
// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * ~
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param old_name The old attribute name.
 * @param new_name The old attribute name.
 * @returns True if the attribute was renamed. False otherwise.
 */
export function Rename(__model__: GIModel, ent_type_sel: _EEntTypeSel, old_name: string, new_name: string): boolean {
    console.log('calling rename attrib');
    return true;
}
// ================================================================================================
/**
 * Set an attribute value for one or more entities.
 * ~
 * If entities is null, then attributes will be created at the model level.
 * ~
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param name The attribute name.
 * @param index The attribute index if setting a value in a list, or null otherwise.
 * @param value The attribute value, or list of values.
 * @returns True if the attribute value was set successully for all entities. False otherwise.
 */
export function Set(__model__: GIModel, entities: TId|TId[]|TId[][],
                              name: string, index: number, value: TAttribDataTypes|TAttribDataTypes[]): boolean {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
    // --- Error Check ---
    const fn_name = 'entities@' + name;
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkAttribName(fn_name , name);
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, name, value, index);
    return true; // TODO fix this so that only return true if all were successful
}
function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
    if (attrib_index !== null && attrib_index !== undefined) {
        __model__.attribs.add.setModelAttribIndexedValue(attrib_name, attrib_index, attrib_value as number|string);
    } else {
        __model__.attribs.add.setModelAttribValue(attrib_name, attrib_value);
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
function _setEachEntDifferentAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes[], attrib_index?: number): void {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error(
            'If multiple attributes are being set to multiple values, then the number of entities must match the number of values.');
    }
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    for (let i = 0; i < ents_arr.length; i++) {
        // --- Error Check ---
        const fn_name = 'entities@' + attrib_name;
        checkAttribValue(fn_name , attrib_values[i], attrib_index);
        // --- Error Check ---
        if (attrib_index !== null && attrib_index !== undefined) {
            __model__.attribs.add.setAttribIndexedValue(ent_type, ents_i[i], attrib_name, attrib_index, attrib_values[i] as number|string);
        } else {
            __model__.attribs.add.setAttribValue(ent_type, ents_i[i], attrib_name, attrib_values[i]);
        }
    }
}
function _setEachEntSameAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
        attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
    // --- Error Check ---
    const fn_name = 'entities@' + attrib_name;
    checkAttribValue(fn_name , attrib_value, attrib_index);
    // --- Error Check ---
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    if (attrib_index !== null && attrib_index !== undefined) {
        __model__.attribs.add.setAttribIndexedValue(ent_type, ents_i, attrib_name, attrib_index, attrib_value as number|string);
    } else {
        __model__.attribs.add.setAttribValue(ent_type, ents_i, attrib_name, attrib_value);
    }
}
function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
    // check the ents_arr
    if (ents_arr === null) {
        _setModelAttrib(__model__, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
        return;
    } else if (ents_arr.length === 0) {
        return;
    } else if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    ents_arr = ents_arr as TEntTypeIdx[];
    // check attrib_values
    // are we setting a list of ents to a list of values?
    const attrib_values_depth: number = getArrDepth(attrib_values);
    if (attrib_values_depth === 2) {
        // attrib values is a list of lists
        // we assume that we are trying to set a different value for each ent
        // so we expect the list lengths to be equal
        _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
        return;
    } else if (attrib_values_depth === 1) {
        // check if ents_arr.length equals attrib_values.length
        // then check if the first ent already has an attrib with the specified name
        // if both are true, then we assume we are trying to set each ent to each value
        const attrib_values_arr: number[]|string[] = attrib_values as number[]|string[];
        if (ents_arr.length === attrib_values_arr.length) {
            const first_ent_type: number = ents_arr[0][0];
            if (__model__.attribs.query.hasAttrib(first_ent_type, attrib_name)) {
                _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
                return;
            }
        }
    }
    // all ents get the same attribute value
    _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
    return;
}

// ================================================================================================
/**
 * Get attribute values for one or more entities.
 * ~
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param name The attribute name.
 * @returns One attribute value, or a list of attribute values.
 */
export function Get(__model__: GIModel, entities: TId|TId[]|TId[][],
        name: string, index: number): TAttribDataTypes|TAttribDataTypes[] {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
    // --- Error Check ---
    const fn_name = 'attrib.Get';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkCommTypes(fn_name, 'name', name, [TypeCheckObj.isString]);
    if (index !== null && index !== undefined) {
        checkCommTypes(fn_name, 'index', index, [TypeCheckObj.isNumber]);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, name, index);
}
function _get(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_index?: number): TAttribDataTypes|TAttribDataTypes[] {
    const has_index: boolean = attrib_index !== null && attrib_index !== undefined;
    if (ents_arr === null) {
        if (has_index) {
            return __model__.attribs.query.getModelAttribIndexedValue(attrib_name, attrib_index);
        } else {
            return __model__.attribs.query.getModelAttribValue(attrib_name);
        }
    } else if (ents_arr.length === 0) {
        return;
    } else if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (attrib_name === 'id') {
            if (has_index) { throw new Error('The "id" attribute does have an index.'); }
            return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
        } else if (has_index) {
            return __model__.attribs.query.getAttribIndexedValue(ent_type, attrib_name, ent_i, attrib_index);
        } else {
            return __model__.attribs.query.getAttribValue(ent_type, attrib_name, ent_i);
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
 * @param name The attribute name, can be one or two names.
 * @param ent_type_sel Enum, the traget entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 * @returns True if the attribte was successfully pushed for all entities. False otherwise.
 */
export function Push(__model__: GIModel, entities: TId|TId[],
        name: string|[string, string], ent_type_sel: _EEntTypeSel, method_sel: _EPushMethodSel): boolean {
    console.log('calling push attrib');
    return true;
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
function _convertPromoteMethod(Selion: _EPushMethodSel): EAttribPush {
    switch (Selion) {
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
