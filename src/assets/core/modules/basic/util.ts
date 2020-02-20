/**
 * The `util` module has some utility functions used for debugging.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';

import { download } from '@libs/filesys/download';
import { EEntType, IModelData, TId, TEntTypeIdx } from '@libs/geo-info/common';
import { __merge__ } from '../_model';
import { _model } from '..';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { checkIDs, IDcheckObj } from '../_check_args';


// ================================================================================================
/**
 * Returns an html string representation of the contents of this model
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
 * Returns am html string representation of the parameters in this model
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
 * Returns an html string representation of one or more entities in the model.
 * ~
 * @param __model__
 * @param entities One or more objects ot collections.
 * @returns void
 */
export function EntityInfo(__model__: GIModel, entities: TId|TId[]): string {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'collection.Info';
    const ents_arr = checkIDs(fn_name, 'coll', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.COLL, EEntType.PGON, EEntType.PLINE, EEntType.POINT]) as TEntTypeIdx[];
    // --- Error Check ---
    let result = '<h4>Entity Information:</h4>';
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        switch (ent_type) {
            case EEntType.COLL:
                result += _collInfo(__model__, ent_i);
                break;
            case EEntType.PGON:
                result += _pgonInfo(__model__, ent_i);
                break;
            case EEntType.PLINE:
                result += _plineInfo(__model__, ent_i);
                break;
            case EEntType.POINT:
                result += _pointInfo(__model__, ent_i);
                break;
            default:
                break;
        }
    }
    return result;
}
function _getAttribs(__model__: GIModel, ent_type: EEntType, ent_i: number): string[] {
    const names: string[] = __model__.attribs.query.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.attribs.query.getAttribVal(ent_type, name, ent_i);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__: GIModel, ent_type: EEntType, ent_i: number): string[] {
    let colls_i: number[] = [];
    if (ent_type === EEntType.COLL) {
        const parent: number = __model__.geom.query.getCollParent(ent_i);
        if (parent !== -1) { colls_i = [parent]; }
    } else {
        colls_i = __model__.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.attribs.query.hasAttrib(EEntType.COLL, 'name')) {
            coll_name = __model__.attribs.query.getAttribVal(EEntType.COLL, 'name', coll_i) as string;
        }
        colls_names.push(coll_name);
    }
    return colls_names;
}
function _pointInfo(__model__: GIModel, point_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, EEntType.POINT, point_i);
    const colls_names = _getColls(__model__, EEntType.POINT, point_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Point</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _plineInfo(__model__: GIModel, pline_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, EEntType.PLINE, pline_i);
    const num_verts: number = __model__.geom.nav.navAnyToVert(EEntType.PLINE, pline_i).length;
    const num_edges: number = __model__.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i).length;
    const colls_names = _getColls(__model__, EEntType.PLINE, pline_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polyline</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_verts) { info += '<li>Num verts: ' + num_verts + '</li>'; }
    if (num_edges) { info += '<li>Num edges: ' + num_edges + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _pgonInfo(__model__: GIModel, pgon_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, EEntType.PGON, pgon_i);
    const num_verts: number = __model__.geom.nav.navAnyToVert(EEntType.PGON, pgon_i).length;
    const num_edges: number = __model__.geom.nav.navAnyToEdge(EEntType.PGON, pgon_i).length;
    const num_wires: number = __model__.geom.nav.navAnyToWire(EEntType.PGON, pgon_i).length;
    const colls_i: number[] = __model__.geom.nav.navPgonToColl(pgon_i);
    const colls_names = _getColls(__model__, EEntType.PGON, pgon_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polygon</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_verts) { info += '<li>Num verts: ' + num_verts + '</li>'; }
    if (num_edges) { info += '<li>Num edges: ' + num_edges + '</li>'; }
    if (num_wires) { info += '<li>Num wires: ' + num_wires + '</li>'; }
    if (colls_i.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_i.length > 1) {
        info += '<li>In ' + colls_i.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _collInfo(__model__: GIModel, coll_i: number): string {
    let info = '';
    // get the data
    let coll_name = 'None';
    if (__model__.attribs.query.hasAttrib(EEntType.COLL, 'name')) {
        coll_name = __model__.attribs.query.getAttribVal(EEntType.COLL, 'name', coll_i) as string;
    }
    const attribs: string[] = _getAttribs(__model__, EEntType.COLL, coll_i);
    const num_pgons: number = __model__.geom.nav.navCollToPgon(coll_i).length;
    const num_plines: number = __model__.geom.nav.navCollToPline(coll_i).length;
    const num_points: number = __model__.geom.nav.navCollToPoint(coll_i).length;
    const colls_names = _getColls(__model__, EEntType.COLL, coll_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Collection</b></li>';
    info += '<ul>';
    info += '<li>Name: <b>' + coll_name + '</b></li>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_pgons) { info += '<li>Num pgons: ' + num_pgons + '</li>'; }
    if (num_plines) { info += '<li>Num plines: ' + num_plines + '</li>'; }
    if (num_points) { info += '<li>Num points: ' + num_points + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    const children: number[] = __model__.geom.query.getCollChildren(coll_i);
    if (children.length > 0) {
        info += '<li>Child collections: </li>';
        for (const child of children) {
            info += _collInfo(__model__, child);
        }
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
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
