/**
 * The `util` module has some utility functions used for debugging.
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';
import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType, TId, TEntTypeIdx, EAttribNames, EAttribDataTypeStrs, IModelJSONData } from '@libs/geo-info/common';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { idsBreak, idsMake } from '@assets/libs/geo-info/common_id_funcs';
import { _getFile } from './io';

// ================================================================================================
/**
 * Select entities in the model.
 *
 * @param __model__
 * @param entities
 * @returns void
 */
export function Select(__model__: GIModel, entities: string|string[]|string[][]): void {
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    entities = ((Array.isArray(entities)) ? entities : [entities]) as string[];
    const [ents_id_flat, ents_indices] = _flatten(entities);
    const ents_arr: TEntTypeIdx[] = idsBreak(ents_id_flat) as TEntTypeIdx[];
    const attrib_name = '_selected';
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr: TEntTypeIdx = ents_arr[i];
        const ent_indices: number[] = ents_indices[i];
        const attrib_value: string = 'selected[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
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
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) { continue; }
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
 *
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
    const names: string[] = __model__.modeldata.attribs.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__: GIModel, ent_type: EEntType, ent_i: number): string[] {
    const ssid: number = __model__.modeldata.active_ssid;
    let colls_i: number[] = [];
    if (ent_type === EEntType.COLL) {
        const parent: number = __model__.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
        if (parent !== -1) { colls_i = [parent]; }
    } else {
        colls_i = __model__.modeldata.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.COLL, EAttribNames.COLL_NAME)) {
            coll_name = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME) as string;
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
    const ssid: number = this.modeldata.active_ssid;
    let info = '';
    // get the data
    let coll_name = 'None';
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.COLL, EAttribNames.COLL_NAME)) {
        coll_name = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME) as string;
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
    const children: number[] = __model__.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
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
 * Returns an html string representation of the contents of this model
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelInfo(__model__: GIModel): string {
    let info = '<h4>Model Information:</h4>';
    info += '<ul>';
    // model attribs
    const model_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.MOD);
    if (model_attribs.length !== 0) { info += '<li>Model attribs: ' + model_attribs.join(', ') + '</li>'; }
    // collections
    const num_colls: number = __model__.modeldata.geom.query.numEnts(EEntType.COLL);
    const coll_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.COLL);
    info += '<li>';
    info += '<b>Collections</b>: ' + num_colls; // + ' (Deleted: ' + num_del_colls + ') ';
    if (coll_attribs.length !== 0) { info += 'Attribs: ' + coll_attribs.join(', '); }
    info += '</li>';
    // pgons
    const num_pgons: number = __model__.modeldata.geom.query.numEnts(EEntType.PGON);
    const pgon_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.PGON);
    info += '<li>';
    info += '<b>Polygons</b>: ' + num_pgons; // + ' (Deleted: ' + num_del_pgons + ') ';
    if (pgon_attribs.length !== 0) { info += 'Attribs: ' + pgon_attribs.join(', '); }
    info += '</li>';
    // plines
    const num_plines: number = __model__.modeldata.geom.query.numEnts(EEntType.PLINE);
    const pline_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.PLINE);
    info += '<li>';
    info += '<b>Polylines</b>: ' + num_plines; // + ' (Deleted: ' + num_del_plines + ') ';
    if (pline_attribs.length !== 0) { info += 'Attribs: ' + pline_attribs.join(', '); }
    info += '</li>';
    // points
    const num_points: number = __model__.modeldata.geom.query.numEnts(EEntType.POINT);
    const point_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.POINT);
    info += '<li>';
    info += '<b>Points</b>: ' + num_points; // + ' (Deleted: ' + num_del_points + ') ';
    if (point_attribs.length !== 0) { info += 'Attribs: ' + point_attribs.join(', '); }
    info += '</li>';
    // wires
    const num_wires: number = __model__.modeldata.geom.query.numEnts(EEntType.WIRE);
    const wire_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.WIRE);
    info += '<li>';
    info += '<b>Wires</b>: ' + num_wires; // + ' (Deleted: ' + num_del_wires + ') ';
    if (wire_attribs.length !== 0) { info += 'Attribs: ' + wire_attribs.join(', '); }
    info += '</li>';
    // edges
    const num_edges: number = __model__.modeldata.geom.query.numEnts(EEntType.EDGE);
    const edge_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.EDGE);
    info += '<li>';
    info += '<b>Edges</b>: ' + num_edges; // + ' (Deleted: ' + num_del_edges + ') ';
    if (edge_attribs.length !== 0) { info += 'Attribs: ' + edge_attribs.join(', '); }
    info += '</li>';
    // verts
    const num_verts: number = __model__.modeldata.geom.query.numEnts(EEntType.VERT);
    const vert_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.VERT);
    info += '<li>';
    info += '<b>Vertices</b>: ' + num_verts; // + ' (Deleted: ' + num_del_verts + ') ';
    if (vert_attribs.length !== 0) { info += 'Attribs: ' + vert_attribs.join(', '); }
    info += '</li>';
    // posis
    const num_posis: number = __model__.modeldata.geom.query.numEnts(EEntType.POSI);
    const posi_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.POSI);
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
 * Checks the internal consistency of the model.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelCheck(__model__: GIModel): string {
    console.log('==== ==== ==== ====');
    console.log('MODEL GEOM\n', __model__.modeldata.geom.toStr());
    // console.log('MODEL ATTRIBS\n', __model__.modeldata.attribs.toStr());
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
 * Compares two models.
 * The score that is calculated is based on whether the input model contains all the entities in this model.
 *
 * Additional entitis in the input model will not affect the score.
 * Attributes at the model level are ignored except for the `material` attributes.
 *
 * For grading, this model is assumed to be the answer model, and the input model is assumed to be
 * the model submitted by the student.
 *
 * Both models will be modified in the comparison process.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to compare this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelCompare(__model__: GIModel, input_data: string): Promise<string> {
    const input_data_str: string = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const input_model = new GIModel();
    input_model.importGI(input_data_str);
    const result: {score: number, total: number, comment: string} = __model__.compare(input_model, true, false, false);
    console.log(result);
    return result.comment;
}
// ================================================================================================
/**
 * Merges data from another model into this model.
 * This is the same as importing the model, except that no collection is created.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to import into this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]> {
    const input_data_str: string = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const ents_arr: TEntTypeIdx[] = __model__.importGI(input_data_str);
    return idsMake(ents_arr) as TId[];
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
