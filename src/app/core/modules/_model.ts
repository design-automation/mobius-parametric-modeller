import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribDataTypeStrs, TAttribDataTypes, EAttribNames, EEntityTypeStr, TId } from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';
import { checkIDs, checkCommTypes } from './_check_args';

//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================

/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function __new__(): GIModel {
    const model: GIModel = new GIModel();
    model.attribs.add.addAttrib(EEntityTypeStr.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
    return model;
}

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

/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
export function __postprocess__(__model__: GIModel): void {
    // TODO
    // Remove all undefined values for the arrays
}

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
/**
 * Returns a string representation of this model.
 * @param __model__
 */
export function __stringify__(__model__: GIModel): string {
    return JSON.stringify(__model__.getData());
}
/**
 * Sets an attribute in the model.
 * @param __model__
 */
export function __setAttrib__(__model__: GIModel, entities: TId|TId[],
    attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
    // --- Error Check ---
    const fn_name = 'Inline.__setAttrib__';
    checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], 'all');
    checkCommTypes(fn_name, 'attrib_value', attrib_value, ['isString', 'isNumber', 'isStringList', 'isNumberList']);
    // --- Error Check ---
    // console.log("__model__", __model__);
    // console.log("entities", entities);
    // console.log("attrib_name", attrib_name);
    // console.log("value", value);
    if (!Array.isArray(entities)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(entities as TId);
        if (attrib_index !== null && attrib_index !== undefined) {
            // --- Error Check ---
            checkCommTypes(fn_name, 'attrib_index', attrib_index, ['isNumber']);
            // --- Error Check ---
            const value_arr = __model__.attribs.query.getAttribValue(ent_type_str, attrib_name, index);
            value_arr[attrib_index] = attrib_value;
            __model__.attribs.add.setAttribValue(ent_type_str, index, attrib_name, value_arr);
        } else {
            __model__.attribs.add.setAttribValue(ent_type_str, index, attrib_name, attrib_value);
        }
    } else {
        for (const entity of entities) {
            __setAttrib__(__model__, entity , attrib_name, attrib_value, attrib_index);
        }
    }
}
/**
 * Gets an attribute from the model.
 * @param __model__
 */
export function __getAttrib__(__model__: GIModel, entities: TId|TId[],
    attrib_name: string, attrib_index?: number): TAttribDataTypes|TAttribDataTypes[] {
    // --- Error Check ---
    const fn_name = 'Inline.__getAttrib__';
    checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], 'all');
    checkCommTypes(fn_name, 'attrib_name', attrib_name, ['isString']);
    // --- Error Check ---
    // console.log("__model__", __model__);
    // console.log("entities", entities);
    // console.log("attrib_name", attrib_name);
    if (!Array.isArray(entities)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(entities as TId);
        if (attrib_index !== null && attrib_index !== undefined) {
            // --- Error Check ---
            checkCommTypes(fn_name, 'attrib_index', attrib_index, ['isNumber']);
            // --- Error Check ---
            return __model__.attribs.query.getAttribValue(ent_type_str, attrib_name, index)[attrib_index];
        } else {
            return __model__.attribs.query.getAttribValue(ent_type_str, attrib_name, index);
        }
    } else {
        return (entities as TId[]).map( entity => __getAttrib__(__model__, entity, attrib_name, attrib_index)) as TAttribDataTypes[];
    }
}
