import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribDataTypeStrs, TAttribDataTypes, EAttribNames, EEntType, TId, TEntTypeIdx, EEntTypeStr } from '@libs/geo-info/common';
import { getArrDepth } from '@libs/geo-info/id';
import { checkIDs, checkCommTypes, checkAttribNameValue } from './_check_args';

//  ===============================================================================================
//  Functions used by Mobius
//  ===============================================================================================
/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function __new__(): GIModel {
    const model: GIModel = new GIModel();
    model.attribs.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
    return model;
}
//  ===============================================================================================
/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
export function __preprocess__(__model__: GIModel): void {
    // TODO
}
//  ===============================================================================================
/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
export function __postprocess__(__model__: GIModel): void {
    // TODO
    // Remove all undefined values for the arrays
}
//  ===============================================================================================
/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
export function __merge__(model1: GIModel, model2: GIModel): void {
    model1.merge(model2);
}
//  ===============================================================================================
/**
 * Returns a string representation of this model.
 * @param __model__
 */
export function __stringify__(__model__: GIModel): string {
    return JSON.stringify(__model__.getData());
}
//  ===============================================================================================
/**
 * Sets an attribute value in the model.
 * @param __model__
 */
export function __setAttrib__(__model__: GIModel, entities: TId|TId[],
                              attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
    // --- Error Check ---
    const fn_name = entities + '.Inline.__setAttrib__' + '[\'' + attrib_name + '\']';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkAttribNameValue(fn_name , attrib_name, attrib_value, attrib_index);
    // --- Error Check ---
    if (ents_arr === null) {
        if (attrib_index !== null && attrib_index !== undefined) {
            __model__.attribs.add.setModelAttribIndexedValue(attrib_name, attrib_index, attrib_value as number|string);
        } else {
            __model__.attribs.add.setModelAttribValue(attrib_name, attrib_value);
        }
        return;
    } else if (ents_arr.length === 0) {
        return;
    } else if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (attrib_index !== null && attrib_index !== undefined) {
            __model__.attribs.add.setAttribIndexedValue(ent_type, ent_i, attrib_name, attrib_index, attrib_value as number|string);
        } else {
            __model__.attribs.add.setAttribValue(ent_type, ent_i, attrib_name, attrib_value);
        }
    }
}
//  ===============================================================================================
function _getAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
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
            _getAttrib(__model__, ent_arr, attrib_name, attrib_index) ) as TAttribDataTypes[];
    }
}
/**
 * Gets an attribute value from the model.
 * @param __model__
 */
export function __getAttrib__(__model__: GIModel, entities: TId|TId[],
        attrib_name: string, attrib_index?: number): TAttribDataTypes|TAttribDataTypes[] {
    // --- Error Check ---
    const fn_name = 'Inline.__getAttrib__';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkCommTypes(fn_name, 'attrib_name', attrib_name, ['isString']);
    if (attrib_index !== null && attrib_index !== undefined) {
        checkCommTypes(fn_name, 'attrib_index', attrib_index, ['isNumber']);
    }
    // --- Error Check ---
    return _getAttrib(__model__, ents_arr, attrib_name, attrib_index);
}
//  ===============================================================================================
