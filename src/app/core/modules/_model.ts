import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribDataTypeStrs, TAttribDataTypes, EAttribNames, EEntType, TId, IGeomPack, TEntTypeIdx } from '@libs/geo-info/common';
import { idsBreak } from '@libs/geo-info/id';
import { checkIDs, checkCommTypes, checkAttribNameValue } from './_check_args';

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
    model.attribs.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
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
export function __merge__(model1: GIModel, model2: GIModel): IGeomPack {
    return model1.merge(model2);
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
    const fn_name = entities + '.Inline.__setAttrib__' + '[\'' + attrib_name + '\']';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDlist'], null);
    checkAttribNameValue(fn_name , attrib_name, attrib_value, attrib_index);
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        if (attrib_index !== null && attrib_index !== undefined) {
            const value_arr = __model__.attribs.query.getAttribValue(ent_type, attrib_name, index);
            value_arr[attrib_index] = attrib_value;
            __model__.attribs.add.setAttribValue(ent_type, index, attrib_name, value_arr);
        } else {
            __model__.attribs.add.setAttribValue(ent_type, index, attrib_name, attrib_value);
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
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], null);
    checkCommTypes(fn_name, 'attrib_name', attrib_name, ['isString']);
    // --- Error Check ---
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        if (attrib_index !== null && attrib_index !== undefined) {
            // --- Error Check ---
            checkCommTypes(fn_name, 'attrib_index', attrib_index, ['isNumber']);
            // --- Error Check ---
            return __model__.attribs.query.getAttribValue(ent_type, attrib_name, index)[attrib_index];
        } else {
            return __model__.attribs.query.getAttribValue(ent_type, attrib_name, index);
        }
    }
}
