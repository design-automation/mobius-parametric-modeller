import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribDataTypeStrs, TAttribDataTypes, EAttribNames, EEntType, TId, TEntTypeIdx, EEntTypeStr } from '@libs/geo-info/common';
import { getArrDepth, idsBreak } from '@libs/geo-info/id';
import { checkIDs, checkCommTypes, checkAttribNameValue, TypeCheckObj, IDcheckObj } from './_check_args';

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
function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
    // check the ents_arr
    if (ents_arr === null) {
        const model_attrib_value: TAttribDataTypes = attrib_values as TAttribDataTypes;
        if (attrib_index !== null && attrib_index !== undefined) {
            __model__.attribs.add.setModelAttribIndexedValue(attrib_name, attrib_index, model_attrib_value as number|string);
        } else {
            __model__.attribs.add.setModelAttribValue(attrib_name, model_attrib_value);
        }
        return;
    } else if (ents_arr.length === 0) {
        return;
    } else if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // check attrib_values
    const attrib_values_depth: number = getArrDepth(attrib_values);
    if (attrib_values_depth === 2) {
        // attrib values is a list of lists
        const attrib_values_arrs: TAttribDataTypes[] = attrib_values as TAttribDataTypes[];
        if (ents_arr.length !== attrib_values_arrs.length) {
            throw new Error('If multiple values are given, then the number of values must be equal to the number of entities.');
        }
        for (let i = 0; i < ents_arr.length; i++) {
            _setAttrib(__model__, ents_arr[i] as TEntTypeIdx, attrib_name, attrib_values_arrs[i], attrib_index);
        }
        return;
    } else if (attrib_values_depth === 1) {
        // check if ents_arr.length equals attrib_values.length
        // if true, then maybe we are trying to set each ent to each value
        const attrib_values_arr: number[]|string[] = attrib_values as number[]|string[];
        if (ents_arr.length === attrib_values_arr.length) {
            const first_ent_type: number = ents_arr[0][0];
            if (__model__.attribs.query.hasAttrib(first_ent_type, attrib_name)) {
                // if (__model__.attribs.query.getAttribDataSize(first_ent_type, attrib_name) === 1) {
                    // we can assume that we are trying to set each ent to each value
                    // we could also check that all ents are of same type but that seems unecessary
                    for (let i = 0; i < ents_arr.length; i++) {
                        _setAttrib(__model__, ents_arr[i] as TEntTypeIdx, attrib_name, attrib_values_arr[i], attrib_index);
                    }
                    return;
                //  }
            }
        }
    }
    // set the attribute value
    const attrib_value: TAttribDataTypes = attrib_values as TAttribDataTypes;
    // --- Error Check ---
    const fn_name = ents_arr + '.Inline.__setAttrib__' + '[\'' + attrib_name + '\']';
    checkAttribNameValue(fn_name , attrib_name, attrib_value, attrib_index);
    // --- Error Check ---
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (attrib_index !== null && attrib_index !== undefined) {
            __model__.attribs.add.setAttribIndexedValue(ent_type, ent_i, attrib_name, attrib_index, attrib_value as number|string);
        } else {
            __model__.attribs.add.setAttribValue(ent_type, ent_i, attrib_name, attrib_value);
        }
    }
    // console.log(__model__);
}
/**
 * Sets an attribute value in the model.
 * @param __model__
 */
export function __setAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
                              attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = entities.flat(); }
    // --- Error Check ---
    const fn_name = entities + '.Inline.__setAttrib__' + '[\'' + attrib_name + '\']';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    // checkAttribNameValue(fn_name , attrib_name, attrib_value, attrib_index);
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, attrib_name, attrib_values, attrib_index);
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
export function __getAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
        attrib_name: string, attrib_index?: number): TAttribDataTypes|TAttribDataTypes[] {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = entities.flat(); }
    // --- Error Check ---
    const fn_name = 'Inline.__getAttrib__';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (entities !== null && entities !== undefined) {
        ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
    }
    checkCommTypes(fn_name, 'attrib_name', attrib_name, [TypeCheckObj.isString]);
    if (attrib_index !== null && attrib_index !== undefined) {
        checkCommTypes(fn_name, 'attrib_index', attrib_index, [TypeCheckObj.isNumber]);
    }
    // --- Error Check ---
    return _getAttrib(__model__, ents_arr, attrib_name, attrib_index);
}
//  ===============================================================================================
function _flatten(arrs: string|string[]|string[][]): [string[], number[][]] {
    const arr_flat: string[] = [];
    const arr_indices: number[][] = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        } else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}
/**
 * Select entities in the model.
 * @param __model__
 */
export function __select__(__model__: GIModel, ents_id: string|string[]|string[][], var_name: string): void {
    __model__.geom.selected = [];
    ents_id = ((Array.isArray(ents_id)) ? ents_id : [ents_id]) as string[];
    const [ents_id_flat, ents_indices] = _flatten(ents_id);
    const ents_arr: TEntTypeIdx[] = idsBreak(ents_id_flat) as TEntTypeIdx[];
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr: TEntTypeIdx = ents_arr[i];
        const ent_indices: number[] = ents_indices[i];
        const attrib_name: string = '_' + var_name;
        const attrib_value: string = var_name + '[' + ent_indices.join('][') + ']';
        __model__.geom.selected.push(ent_arr);
        if (!__model__.attribs.query.hasAttrib(ent_arr[0], attrib_name)) {
            __model__.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING, 1);
        }
        __model__.attribs.add.setAttribValue(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
//  ===============================================================================================
/**
 * Checks the model for internal consistency.
 * @param __model__
 */
export function __checkModel__(__model__: GIModel): string[] {
    return __model__.check();
}
