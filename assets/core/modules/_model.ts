import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribDataTypeStrs, TAttribDataTypes, EAttribNames, EEntType, TId, TEntTypeIdx, EEntTypeStr } from '@libs/geo-info/common';
import { getArrDepth, idsBreak } from '@libs/geo-info/id';
import { checkIDs, checkCommTypes, TypeCheckObj, IDcheckObj, checkAttribName, checkAttribValue } from './_check_args';
import __ from 'underscore';

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
    model.attribs.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.LIST);
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
 * Select entities in the model.
 * @param __model__
 */
export function __select__(__model__: GIModel, ents_id: string|string[]|string[][], var_name: string): void {
    __model__.geom.selected = [];
    ents_id = ((Array.isArray(ents_id)) ? ents_id : [ents_id]) as string[];
    const [ents_id_flat, ents_indices] = _flatten(ents_id);
    const ents_arr: TEntTypeIdx[] = idsBreak(ents_id_flat) as TEntTypeIdx[];
    const attrib_name: string = '_' + var_name;
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr: TEntTypeIdx = ents_arr[i];
        const ent_indices: number[] = ents_indices[i];
        const attrib_value: string = var_name + '[' + ent_indices.join('][') + ']';
        __model__.geom.selected.push(ent_arr);
        if (!__model__.attribs.query.hasAttrib(ent_arr[0], attrib_name)) {
            __model__.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
        }
        __model__.attribs.add.setAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
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
//  ===============================================================================================
/**
 * Checks the model for internal consistency.
 * @param __model__
 */
export function __checkModel__(__model__: GIModel): string[] {
    return __model__.check();
}

// Moved to attrib.ts
//  ===============================================================================================
/**
//  * Sets an attribute value in the model.
//  * @param __model__
//  */
// export function __setAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
//                               attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
//     // @ts-ignore
//     if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
//     // --- Error Check ---
//     const fn_name = 'entities@' + attrib_name;
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
//     if (entities !== null && entities !== undefined) {
//         ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     }
//     checkAttribName(fn_name , attrib_name);
//     // --- Error Check ---
//     _setAttrib(__model__, ents_arr, attrib_name, attrib_values, attrib_index);
// }
// function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
//         attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
//     // check the ents_arr
//     if (ents_arr === null) {
//         _setModelAttrib(__model__, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
//         return;
//     } else if (ents_arr.length === 0) {
//         return;
//     } else if (getArrDepth(ents_arr) === 1) {
//         ents_arr = [ents_arr] as TEntTypeIdx[];
//     }
//     ents_arr = ents_arr as TEntTypeIdx[];
//     // check attrib_values
//     // are we setting a list of ents to a list of values?
//     const attrib_values_depth: number = getArrDepth(attrib_values);
//     if (attrib_values_depth === 2) {
//         // attrib values is a list of lists
//         // we assume that we are trying to set a different value for each ent
//         // so we expect the list lengths to be equal
//         _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
//         return;
//     } else if (attrib_values_depth === 1) {
//         // check if ents_arr.length equals attrib_values.length
//         // then check if the first ent already has an attrib with the specified name
//         // if both are true, then we assume we are trying to set each ent to each value
//         const attrib_values_arr: number[]|string[] = attrib_values as number[]|string[];
//         if (ents_arr.length === attrib_values_arr.length) {
//             const first_ent_type: number = ents_arr[0][0];
//             if (__model__.attribs.query.hasAttrib(first_ent_type, attrib_name)) {
//                 _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
//                 return;
//             }
//         }
//     }
//     // all ents get the same attribute value
//     _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
//     return;
// }
// function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number): void {
//     if (typeof idx_or_key === 'number') {
//         __model__.attribs.add.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value);
//     } if (typeof idx_or_key === 'string') {
//         __model__.attribs.add.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value);
//     } else {
//         __model__.attribs.add.setModelAttribVal(attrib_name, attrib_value);
//     }
// }
// function _setEachEntDifferentAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
//         attrib_name: string, attrib_values: TAttribDataTypes[], attrib_index?: number): void {
//     if (ents_arr.length !== attrib_values.length) {
//         throw new Error(
//             'If multiple attributes are being set to multiple values, then the number of entities must match the number of values.');
//     }
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
//     for (let i = 0; i < ents_arr.length; i++) {
//         // --- Error Check ---
//         const fn_name = 'entities@' + attrib_name;
//         checkAttribValue(fn_name , attrib_values[i], attrib_index);
//         // --- Error Check ---
//         if (attrib_index !== null && attrib_index !== undefined) {
//             __model__.attribs.add.setAttribListIdxVal(ent_type, ents_i[i], attrib_name, attrib_index, attrib_values[i] as number|string);
//         } else {
//             __model__.attribs.add.setAttribVal(ent_type, ents_i[i], attrib_name, attrib_values[i]);
//         }
//     }
// }
// function _setEachEntSameAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
//         attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
//     // --- Error Check ---
//     const fn_name = 'entities@' + attrib_name;
//     checkAttribValue(fn_name , attrib_value, attrib_index);
//     // --- Error Check ---
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
//     if (attrib_index !== null && attrib_index !== undefined) {
//         __model__.attribs.add.setAttribListIdxVal(ent_type, ents_i, attrib_name, attrib_index, attrib_value as number|string);
//     } else {
//         __model__.attribs.add.setAttribVal(ent_type, ents_i, attrib_name, attrib_value);
//     }
// }
// function _getEntsIndices(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = [];
//     for (let i = 0; i < ents_arr.length; i++) {
//         if (ents_arr[i][0] !== ent_type) {
//             throw new Error('If an attribute is being set for multiple entities, then they must all be of the same type.');
//         }
//         ents_i.push(ents_arr[i][1]);
//     }
//     return ents_i;
// }
// //  ===============================================================================================
// /**
//  * Gets an attribute value from the model.
//  * @param __model__
//  */
// export function __getAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
//         attrib_name: string, idx_or_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
//     // @ts-ignore
//     if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
//     // --- Error Check ---
//     const fn_name = 'Inline.__getAttrib__';
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
//     if (entities !== null && entities !== undefined) {
//         ents_arr = checkIDs(fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     }
//     checkCommTypes(fn_name, 'attrib_name', attrib_name, [TypeCheckObj.isString]);
//     if (idx_or_key !== null && idx_or_key !== undefined) {
//         checkCommTypes(fn_name, 'attrib_index', idx_or_key, [TypeCheckObj.isNumber, TypeCheckObj.isString]);
//     }
//     // --- Error Check ---
//     return _getAttrib(__model__, ents_arr, attrib_name, idx_or_key);
// }
// function _getAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
//         attrib_name: string, idx_or_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
//     const has_idx_or_key: boolean = idx_or_key !== null && idx_or_key !== undefined;
//     if (ents_arr === null) {
//         if (has_idx_or_key && typeof idx_or_key === 'number') {
//             return __model__.attribs.query.getModelAttribListIdxVal(attrib_name, idx_or_key);
//         } else if (has_idx_or_key && typeof idx_or_key === 'string') {
//             return __model__.attribs.query.getModelAttribDictKeyVal(attrib_name, idx_or_key);
//         } else {
//             return __model__.attribs.query.getModelAttribVal(attrib_name);
//         }
//     } else if (ents_arr.length === 0) {
//         return;
//     } else if (getArrDepth(ents_arr) === 1) {
//         const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
//         if (attrib_name === 'id') {
//             if (has_idx_or_key) { throw new Error('The "id" attribute does have an index or key.'); }
//             return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
//         } else if (has_idx_or_key && typeof idx_or_key === 'number') {
//             return __model__.attribs.query.getAttribListIdxVal(ent_type, attrib_name, ent_i, idx_or_key);
//         } else if (has_idx_or_key && typeof idx_or_key === 'string') {
//             return __model__.attribs.query.getAttribDictKeyVal(ent_type, attrib_name, ent_i, idx_or_key);
//         } else {
//             return __model__.attribs.query.getAttribVal(ent_type, attrib_name, ent_i);
//         }
//     } else {
//         return (ents_arr as TEntTypeIdx[]).map( ent_arr =>
//             _getAttrib(__model__, ent_arr, attrib_name, idx_or_key) ) as TAttribDataTypes[];
//     }
// }
