/**
 * The `util` module has some utility functions used for debugging.
 */

/**
 *
 */

import { checkIDs, ID } from '../_check_ids';

import { GIModel } from '@libs/geo-info/GIModel';
import { download } from '@libs/filesys/download';
import { EEntType, IModelJSONData, TId, TEntTypeIdx } from '@libs/geo-info/common';
// import { __merge__ } from '../_model';
// import { _model } from '..';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { idsBreak } from '@assets/libs/geo-info/id';
import { _getFile } from './io';

export enum _ECOmpareMethod {
    THIS_IS_SUBSET = 'subset',
    THIS_IS_SUPERSET = 'superset',
    THIS_IS_EQUAL = 'equal'
}
// ================================================================================================
/**
 * Removes all deleted entities from the model.
 * The IDs of other entities may change as a result.
 * ~
 * For example, if 'pg0' was deleted and 'pg1' still exists, then after purge
 * 'pg1' will get renumbered, and will get the ID 'pg0'.
 *
 * @param __model__
 * @returns void
 */
export function ModelPurge(__model__: GIModel): void {
    __model__.purge();
}
// ================================================================================================
/**
 * Returns an html string representation of the contents of this model
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelInfo(__model__: GIModel): string {
    let info = '<h4>Model Information:</h4>';
    info += '<ul>';
    // model attribs
    const model_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.MOD);
    if (model_attribs.length !== 0) { info += '<li>Model attribs: ' + model_attribs.join(', ') + '</li>'; }
    // collections
    const num_colls: number = __model__.modeldata.geom.query.numEnts(EEntType.COLL);
    // const num_del_colls: number = __model__.modeldata.geom.query.numEnts(EEntType.COLL, true) - num_colls;
    const coll_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.COLL);
    info += '<li>';
    info += '<b>Collections</b>: ' + num_colls; // + ' (Deleted: ' + num_del_colls + ') ';
    if (coll_attribs.length !== 0) { info += 'Attribs: ' + coll_attribs.join(', '); }
    info += '</li>';
    // pgons
    const num_pgons: number = __model__.modeldata.geom.query.numEnts(EEntType.PGON);
    // const num_del_pgons: number = __model__.modeldata.geom.query.numEnts(EEntType.PGON, true) - num_pgons;
    const pgon_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.PGON);
    info += '<li>';
    info += '<b>Polygons</b>: ' + num_pgons; // + ' (Deleted: ' + num_del_pgons + ') ';
    if (pgon_attribs.length !== 0) { info += 'Attribs: ' + pgon_attribs.join(', '); }
    info += '</li>';
    // plines
    const num_plines: number = __model__.modeldata.geom.query.numEnts(EEntType.PLINE);
    // const num_del_plines: number = __model__.modeldata.geom.query.numEnts(EEntType.PLINE, true) - num_plines;
    const pline_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.PLINE);
    info += '<li>';
    info += '<b>Polylines</b>: ' + num_plines; // + ' (Deleted: ' + num_del_plines + ') ';
    if (pline_attribs.length !== 0) { info += 'Attribs: ' + pline_attribs.join(', '); }
    info += '</li>';
    // points
    const num_points: number = __model__.modeldata.geom.query.numEnts(EEntType.POINT);
    // const num_del_points: number = __model__.modeldata.geom.query.numEnts(EEntType.POINT, true) - num_points;
    const point_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.POINT);
    info += '<li>';
    info += '<b>Points</b>: ' + num_points; // + ' (Deleted: ' + num_del_points + ') ';
    if (point_attribs.length !== 0) { info += 'Attribs: ' + point_attribs.join(', '); }
    info += '</li>';
    // faces
    const num_faces: number = __model__.modeldata.geom.query.numEnts(EEntType.FACE);
    // const num_del_faces: number = __model__.modeldata.geom.query.numEnts(EEntType.FACE, true) - num_faces;
    const face_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.FACE);
    info += '<li>';
    info += '<b>Faces</b>: ' + num_faces; // + ' (Deleted: ' + num_del_faces + ') ';
    if (face_attribs.length !== 0) { info += 'Attribs: ' + face_attribs.join(', '); }
    info += '</li>';
    // wires
    const num_wires: number = __model__.modeldata.geom.query.numEnts(EEntType.WIRE);
    // const num_del_wires: number = __model__.modeldata.geom.query.numEnts(EEntType.WIRE, true) - num_wires;
    const wire_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.WIRE);
    info += '<li>';
    info += '<b>Wires</b>: ' + num_wires; // + ' (Deleted: ' + num_del_wires + ') ';
    if (wire_attribs.length !== 0) { info += 'Attribs: ' + wire_attribs.join(', '); }
    info += '</li>';
    // edges
    const num_edges: number = __model__.modeldata.geom.query.numEnts(EEntType.EDGE);
    // const num_del_edges: number = __model__.modeldata.geom.query.numEnts(EEntType.EDGE, true) - num_edges;
    const edge_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.EDGE);
    info += '<li>';
    info += '<b>Edges</b>: ' + num_edges; // + ' (Deleted: ' + num_del_edges + ') ';
    if (edge_attribs.length !== 0) { info += 'Attribs: ' + edge_attribs.join(', '); }
    info += '</li>';
    // verts
    const num_verts: number = __model__.modeldata.geom.query.numEnts(EEntType.VERT);
    // const num_del_verts: number = __model__.modeldata.geom.query.numEnts(EEntType.VERT, true) - num_verts;
    const vert_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.VERT);
    info += '<li>';
    info += '<b>Vertices</b>: ' + num_verts; // + ' (Deleted: ' + num_del_verts + ') ';
    if (vert_attribs.length !== 0) { info += 'Attribs: ' + vert_attribs.join(', '); }
    info += '</li>';
    // posis
    const num_posis: number = __model__.modeldata.geom.query.numEnts(EEntType.POSI);
    // const num_del_posis: number = __model__.modeldata.geom.query.numEnts(EEntType.POSI, true) - num_posis;
    const posi_attribs: string[] = __model__.modeldata.attribs.query.getAttribNames(EEntType.POSI);
    info += '<li>';
    info += '<b>Positions</b>: ' + num_posis; // + ' (Deleted: ' + num_del_posis + ') ';
    if (posi_attribs.length !== 0) { info += 'Attribs: ' + posi_attribs.join(', '); }
    info += '</li>';
    // end
    info += '</ul>';
    // return the string
    return info;
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
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'coll', entities,
            [ID.isID, ID.isIDL],
            [EEntType.COLL, EEntType.PGON, EEntType.PLINE, EEntType.POINT]) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'coll', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList],
        //     [EEntType.COLL, EEntType.PGON, EEntType.PLINE, EEntType.POINT]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
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
    const names: string[] = __model__.modeldata.attribs.query.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.modeldata.attribs.query.getAttribVal(ent_type, name, ent_i);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__: GIModel, ent_type: EEntType, ent_i: number): string[] {
    let colls_i: number[] = [];
    if (ent_type === EEntType.COLL) {
        const parent: number = __model__.modeldata.geom.query.getCollParent(ent_i);
        if (parent !== -1) { colls_i = [parent]; }
    } else {
        colls_i = __model__.modeldata.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.modeldata.attribs.query.hasAttrib(EEntType.COLL, 'name')) {
            coll_name = __model__.modeldata.attribs.query.getAttribVal(EEntType.COLL, 'name', coll_i) as string;
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
    const num_verts: number = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i).length;
    const num_edges: number = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i).length;
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
    const num_verts: number = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i).length;
    const num_edges: number = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PGON, pgon_i).length;
    const num_wires: number = __model__.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i).length;
    const colls_i: number[] = __model__.modeldata.geom.nav.navPgonToColl(pgon_i);
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
    if (__model__.modeldata.attribs.query.hasAttrib(EEntType.COLL, 'name')) {
        coll_name = __model__.modeldata.attribs.query.getAttribVal(EEntType.COLL, 'name', coll_i) as string;
    }
    const attribs: string[] = _getAttribs(__model__, EEntType.COLL, coll_i);
    const num_pgons: number = __model__.modeldata.geom.nav.navCollToPgon(coll_i).length;
    const num_plines: number = __model__.modeldata.geom.nav.navCollToPline(coll_i).length;
    const num_points: number = __model__.modeldata.geom.nav.navCollToPoint(coll_i).length;
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
    const children: number[] = __model__.modeldata.geom.query.getCollChildren(coll_i);
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

export enum _EIOExportParams {
    YES = 'Add Params',
    NO = 'No Params'
}
export enum _EIOExportContents {
    BOTH = 'Both',
    CONSOLE = 'Console Only',
    MODEL = 'Model Only'
}
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
        'model'  : __model__.getModelData()
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
 * @param input_data The location of the GI Model to compare this model to.
 * @param method Enum, method used to compare this model to the other model specified in the gi_model parameter.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelCompare(__model__: GIModel, input_data: string, method: _ECOmpareMethod): Promise<string> {
    const gi_model = await _getFile(input_data);
    const gi_obj: IModelJSONData = JSON.parse(gi_model) as IModelJSONData;
    const other_model = new GIModel();
    other_model.setModelData(gi_obj);
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
    console.log('==== ==== ==== ====');
    console.log('MODEL GEOM\n', __model__.modeldata.geom.toStr());
    console.log('MODEL ATTRIBS\n', __model__.modeldata.attribs.toStr());
    console.log('META\n', __model__.metadata.toDebugStr());
    console.log('==== ==== ==== ====');
    console.log(__model__);
    const check: string[] = __model__.check();
    if (check.length > 0) {
        return String(check);
    }
    return 'No internal inconsistencies have been found.';
}
// ================================================================================================
/**
 * Post a message to the parent window.
 *
 * @param __model__
 * @param data The data to send, a list or a dictionary.
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function SendData(__model__: GIModel, data: any): void {
    window.parent.postMessage(data, '*');
}
// ================================================================================================
