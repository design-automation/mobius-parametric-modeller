/**
 * The `util` module has some utility functions used for debugging.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';

import { download } from '@libs/filesys/download';
import { EEntType, IModelData } from '@libs/geo-info/common';
import { __merge__ } from '../_model';
import { _model } from '..';


// ================================================================================================
/**
 * Export data from the model as a file.
 * This will result in a popup in your browser, asking you to save the filel.
 * @param __model__
 * @param __console__
 * @param __constList__
 * @param __fileName__
 * @param file_name Name of the file as a string.
 * @param exportParams Enum.
 * @param exportContent Enum.
 * @returns Boolean.
 * @example util.ExportIO('my_model.json')
 * @example_info Exports all the data in the model as an OBJ.
 */
export function ExportIO(__model__: GIModel, __console__: string[], __constList__: any, __fileName__: string,
                        file_name: string, exportParams: _EIOExportParams, exportContent: _EIOExportContents): boolean {
    // let gi_data: string = JSON.stringify(__model__.getData());
    // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
    const consolidatedConsole = [];
    for (const logStr of __console__) {
        if (!logStr.match('<p style="padding: 2px 0px 2px 10px;"><b><i>')) {
            continue;
        }
        const replacedStr = logStr.replace('<p style="padding: 2px 0px 2px 10px;"><b><i>', '')
                               .replace('</i></b> ', '').replace('</p>', '').replace('<br>', '\n');
        consolidatedConsole.push(replacedStr);
    }
    const newConstList = {};
    for (const obj in __constList__) {
        if (__constList__.hasOwnProperty(obj)) {
            newConstList[obj] = convertString(__constList__[obj]);
        }
    }
    const edxAnswer = {
        'fileName': __fileName__,
        'params' : newConstList,
        'console': consolidatedConsole.join('\n'),
        'model'  : __model__.getData()
    };
    if (exportParams === _EIOExportParams.NO) {
        edxAnswer['params'] = undefined;
    }
    if (exportContent === _EIOExportContents.CONSOLE) {
        edxAnswer['model'] = undefined;
    } else if (exportContent === _EIOExportContents.MODEL) {
        edxAnswer['console'] = undefined;
    }

    return download(JSON.stringify(edxAnswer) , file_name);
}
export enum _EIOExportParams {
    YES = 'Add Params',
    NO = 'No Params'
}
export enum _EIOExportContents {
    BOTH = 'Both',
    CONSOLE = 'Console Only',
    MODEL = 'Model Only'
}
function convertString(value) {
    let val;
    if (!value) {
        val = value;
    } else if (typeof value === 'number' || value === undefined) {
        val = value;
    } else if (typeof value === 'string') {
        val = '"' + value + '"';
    } else if (value.constructor === [].constructor) {
        val = JSON.stringify(value);
    } else if (value.constructor === {}.constructor) {
        val = JSON.stringify(value);
    } else {
        val = value;
    }
    return val;
}
// ================================================================================================
/**
 * Returns a text summary of the contents of this model
 *
 * @param __model__
 * @param __constList__
 * @returns Text that summarises what is in the model.
 */
export function ParamInfo(__model__: GIModel, __constList__: {}): string {
    return JSON.stringify(__constList__);
}
// ================================================================================================
/**
 * Returns a text summary of the contents of this model
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelInfo(__model__: GIModel): string {
    return JSON.stringify(
        {
            'geometry': {
                'num_positions': __model__.geom.query.numEnts(EEntType.POSI, false),
                'num_vertices': __model__.geom.query.numEnts(EEntType.VERT, false),
                'num_edges': __model__.geom.query.numEnts(EEntType.EDGE, false),
                'num_wires': __model__.geom.query.numEnts(EEntType.WIRE, false),
                'num_faces': __model__.geom.query.numEnts(EEntType.FACE, false),
                'num_points': __model__.geom.query.numEnts(EEntType.POINT, false),
                'num_polylines': __model__.geom.query.numEnts(EEntType.PLINE, false),
                'num_polygons': __model__.geom.query.numEnts(EEntType.PGON, false),
                'num_collections': __model__.geom.query.numEnts(EEntType.COLL, false)
            },
            'attributes': {
                'position_attribs': __model__.attribs.query.getAttribNames(EEntType.POSI),
                'vertex_attribs': __model__.attribs.query.getAttribNames(EEntType.VERT),
                'edge_attribs': __model__.attribs.query.getAttribNames(EEntType.EDGE),
                'wire_attribs': __model__.attribs.query.getAttribNames(EEntType.WIRE),
                'face_attribs': __model__.attribs.query.getAttribNames(EEntType.FACE),
                'point_attribs': __model__.attribs.query.getAttribNames(EEntType.POINT),
                'polyline_attribs': __model__.attribs.query.getAttribNames(EEntType.PLINE),
                'polygon_attribs': __model__.attribs.query.getAttribNames(EEntType.PGON),
                'collection_attribs': __model__.attribs.query.getAttribNames(EEntType.COLL),
                'model_attribs': __model__.attribs.query.getAttribNames(EEntType.MOD)
            }
        },
    );
}
export enum _ECOmpareMethod {
    THIS_IS_SUBSET = 'subset',
    THIS_IS_SUPERSET = 'superset',
    THIS_IS_EQUAL = 'equal'
}
// ================================================================================================
/**
 * Compare the GI data in this model to the GI data in another model.
 * ~
 * If method = subset, then this model is the answer, and the other model is the submitted model.
 * It will check that all entites in this model also exist in the other model.
 * ~
 * If method = superset, then this model is the submitted model, and the other model is the answer model.
 * It will check that all entites in the other model also exist in this model.
 * ~
 * For specifying the location of the GI Model, you can either specify a URL,
 * or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param gi_model The location of the GI Model to compare this model to.
 * @param method Enum, method used to compare this model to the other model specified in the gi_model parameter.
 * @returns Text that summarises the comparison between the two models.
 */
export function ModelCompare(__model__: GIModel, gi_model: string, method: _ECOmpareMethod): string {
    const gi_obj: IModelData = JSON.parse(gi_model) as IModelData;
    const other_model = new GIModel(gi_obj);
    let result: {score: number, total: number, comment: string} = null;
    // compare function has three boolean args
    // normalize: boolean
    // check_geom_equality: boolean
    // check_attrib_equality: boolean
    switch (method) {
        case _ECOmpareMethod.THIS_IS_SUBSET:
            result = __model__.compare(other_model, true, false, false);
            break;
        case _ECOmpareMethod.THIS_IS_SUPERSET:
            result = other_model.compare(__model__, true, false, false);
            break;
        case _ECOmpareMethod.THIS_IS_EQUAL:
            result = __model__.compare(other_model, true, true, false);
            break;
        default:
            throw new Error('Compare method not recognised');
    }
    return result.comment;
}
// ================================================================================================
/**
 * Check the internal consistency of the model.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelCheck(__model__: GIModel): string {
    const check: string[] = __model__.check();
    if (check.length > 0) {
        console.log(__model__);
        return String(check);
    }
    return 'No internal inconsistencies have been found.';
}
// ================================================================================================
