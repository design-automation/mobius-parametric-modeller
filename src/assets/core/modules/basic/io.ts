/**
 * The `io` module has functions for importing and exporting.
 */

/**
 *
 */
import { checkIDs, IdCh } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { importObj, exportPosiBasedObj, exportVertBasedObj } from '@libs/geo-info/io_obj';
import { importGeojson, exportGeojson } from '@libs/geo-info/io_geojson';
import { download } from '@libs/filesys/download';
import { TId, EEntType, Txyz, TPlane, TRay, IGeomPack, IModelData, IGeomPackTId, TEntTypeIdx } from '@libs/geo-info/common';
import { __merge__ } from '../_model';
import { _model } from '..';
import { idsMake, idsBreak } from '@libs/geo-info/id';
import { arrMakeFlat } from '@assets/libs/util/arrs';

// ================================================================================================
declare global {
    interface Navigator {
        webkitPersistentStorage: {
            requestQuota: (a, b, c) => {}
        };
    }
}
// ================================================================================================
// Import / Export data types
export enum _EIODataFormat {
    GI = 'gi',
    OBJ = 'obj',
    GEOJSON = 'geojson'
}
export enum _EIODataSource {
    DEFAULT = 'From URL',
    FILESYS = 'From Local Storage'
}
export enum _EIODataTarget {
    DEFAULT = 'Save to Hard Disk',
    FILESYS = 'Save to Local Storage'
}
// ================================================================================================
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
export function Read(__model__: GIModel, data: string|{}): string|{} {
    return data;
}
// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export function Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Boolean {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return download(data, file_name);
        }
        return saveResource(data, file_name);
    } catch (ex) {
        return false;
    }
}
// ================================================================================================
/**
 * Imports data into the model.
 * ~
 * Model data can be pasted in directly as a string, or can be retrieved as a file.
 * ~
 * If model data is retrieved from a file, there are two ways of specifying the file location:
 * - A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
 * - A file name in the local storage, e.g. "my_data.obj".
 * ~
 * To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
 * Note that a codescript using a file in local storage will not be shareable with others.
 * ~
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
export function Import(__model__: GIModel, model_data: string|{}, data_format: _EIODataFormat): TId|{} {
    if (!model_data) {
        throw new Error('Invalid imported model data');
    }
    let coll_i: number = null;
    if (model_data.constructor === {}.constructor) {
        let import_func: Function;
        switch (data_format) {
            case _EIODataFormat.GI:
                import_func  = _importGI;
                break;
            case _EIODataFormat.OBJ:
                import_func  = _importObj;
                break;
            case _EIODataFormat.GEOJSON:
                import_func  = _importGeojson;
                break;
            default:
                throw new Error('Import type not recognised');
        }
        const coll_results = {};
        for (const data_name in <Object> model_data) {
            if (model_data[data_name]) {
                coll_i  = import_func(__model__, <string> model_data[data_name]);
                coll_results[data_name] = idsMake([EEntType.COLL, coll_i]) as TId;
            }
        }
        return coll_results;
    }
    switch (data_format) {
        case _EIODataFormat.GI:
            coll_i  = _importGI(__model__, <string> model_data);
            break;
        case _EIODataFormat.OBJ:
            coll_i  = _importObj(__model__, <string> model_data);
            break;
        case _EIODataFormat.GEOJSON:
            coll_i  = _importGeojson(__model__, <string> model_data);
            break;
        default:
            throw new Error('Import type not recognised');
    }
    return idsMake([EEntType.COLL, coll_i]) as TId;
}
function _importGI(__model__: GIModel, model_data: string): number {
    // get number of ents before merge
    const num_ents_before: number[] = __model__.geom.query.numEntsAll(true);
    // import
    const gi_json: IModelData = JSON.parse(model_data) as IModelData;
    const gi_model: GIModel = new GIModel(gi_json);
    __model__.merge(gi_model);
    // get number of ents after merge
    const num_ents_after: number[] = __model__.geom.query.numEntsAll(true);
    // return the result
    return _createGIColl(__model__, num_ents_before, num_ents_after);
}
function _importObj(__model__: GIModel, model_data: string): number {
    // get number of ents before merge
    const num_ents_before: number[] = __model__.geom.query.numEntsAll(true);
    // import
    const obj_model: GIModel = importObj(model_data);
    __model__.merge(obj_model);
    // get number of ents after merge
    const num_ents_after: number[] = __model__.geom.query.numEntsAll(true);
    // return the result
    return _createColl(__model__, num_ents_before, num_ents_after);
}
function _importGeojson(__model__: GIModel, model_data: string): number {
    // get number of ents before merge
    const num_ents_before: number[] = __model__.geom.query.numEntsAll(true);
    // import
    importGeojson(__model__, model_data, 0);
    // get number of ents after merge
    const num_ents_after: number[] = __model__.geom.query.numEntsAll(true);
    // return the result
    return _createColl(__model__, num_ents_before, num_ents_after);
}
function _createGIColl(__model__: GIModel, before: number[], after: number[]): number {
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    for (let point_i = before[1]; point_i < after[1]; point_i++) {
        if (__model__.geom.query.entExists(EEntType.POINT, point_i)) {
            points_i.push( point_i );
        }
    }
    for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
        if (__model__.geom.query.entExists(EEntType.PLINE, pline_i)) {
            plines_i.push( pline_i );
        }
    }
    for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
        if (__model__.geom.query.entExists(EEntType.PGON, pgon_i)) {
            pgons_i.push( pgon_i );
        }
    }
    if (points_i.length + plines_i.length + pgons_i.length === 0) { return null; }
    const container_coll_i: number = __model__.geom.add.addColl(null, points_i, plines_i, pgons_i);
    for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
        if (__model__.geom.query.entExists(EEntType.COLL, coll_i)) {
            __model__.geom.modify_coll.setCollParent(coll_i, container_coll_i);
        }
    }
    return container_coll_i;
}
function _createColl(__model__: GIModel, before: number[], after: number[]): number {
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    for (let point_i = before[1]; point_i < after[1]; point_i++) {
        points_i.push( point_i );
    }
    for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
        plines_i.push( pline_i );
    }
    for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
        pgons_i.push( pgon_i );
    }
    if (points_i.length + plines_i.length + pgons_i.length === 0) { return null; }
    const container_coll_i: number = __model__.geom.add.addColl(null, points_i, plines_i, pgons_i);
    for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
        __model__.geom.modify_coll.setCollParent(coll_i, container_coll_i);
    }
    return container_coll_i;
}
// ================================================================================================
export enum _EIOExportDataFormat {
    GI = 'gi',
    OBJ_VERT = 'obj_v',
    OBJ_POSI = 'obj_ps',
    // DAE = 'dae',
    GEOJSON = 'geojson'
}
/**
 * Export data from the model as a file.
 * This will result in a popup in your browser, asking you to save the file.
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @param data_target Enum, where the data is to be exported to.
 * @returns void.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
export function Export(__model__: GIModel, entities: TId|TId[]|TId[][],
        file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): void {
    if ( typeof localStorage === 'undefined') { return; }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            ents_arr = checkIDs(fn_name, 'entities', entities,
                [IdCh.isIdL], [EEntType.PLINE, EEntType.PGON, EEntType.COLL])  as TEntTypeIdx[];
        }
        checkArgs(fn_name, 'file_name', file_name, [ArgCh.isStr, ArgCh.isStrL]);
    } else {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON, EEntType.COLL])  as TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
    }
    // --- Error Check ---
    _export(__model__, ents_arr, file_name, data_format, data_target);
}
function _export(__model__: GIModel, ents_arr: TEntTypeIdx[],
    file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): boolean {
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            let gi_data = '';
            if (ents_arr === null) {
                gi_data = JSON.stringify(__model__.copy().getData());
            } else {
                // make a clone of the model (warning: do not copy, copy will change entity IDs)
                const model_clone: GIModel = __model__.clone();
                // get the ents
                const gp: IGeomPack = model_clone.geom.query.createGeomPack(ents_arr, true);
                // delete the ents
                model_clone.geom.del.delColls(gp.colls_i, true);
                model_clone.geom.del.delPgons(gp.pgons_i, true);
                model_clone.geom.del.delPlines(gp.plines_i, true);
                model_clone.geom.del.delPoints(gp.points_i, true);
                model_clone.geom.del.delPosis(gp.posis_i);
                model_clone.geom.del.delUnusedPosis(gp.posis2_i);
                model_clone.purge();
                gi_data = JSON.stringify(model_clone.getData());
            }
            // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
            gi_data = gi_data.replace(/\\/g, '\\\\'); // TODO temporary fix
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(gi_data , file_name);
            }
            return saveResource(gi_data, file_name);
        case _EIOExportDataFormat.OBJ_VERT:
            const obj_verts_data: string = exportVertBasedObj(__model__, ents_arr);
            // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(obj_verts_data , file_name);
            }
            return saveResource(obj_verts_data, file_name);
        case _EIOExportDataFormat.OBJ_POSI:
            const obj_posis_data: string = exportPosiBasedObj(__model__, ents_arr);
            // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(obj_posis_data , file_name);
            }
            return saveResource(obj_posis_data, file_name);
        // case _EIOExportDataFormat.DAE:
        //     const dae_data: string = exportDae(__model__);
        //     // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
        //     if (data_target === _EIODataTarget.DEFAULT) {
        //         return download(dae_data, file_name);
        //     }
        //     return saveResource(dae_data, file_name);
        //     break;
        case _EIOExportDataFormat.GEOJSON:
            const geojson_data: string = exportGeojson(__model__, ents_arr, true); // flatten
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(geojson_data , file_name);
            }
            return saveResource(geojson_data, file_name);
        default:
            throw new Error('Data type not recognised');
    }
}

// ================================================================================================
/**
 * Functions for saving and loading resources to file system.
 */

function saveResource(file: string, name: string): boolean {
    const itemstring = localStorage.getItem('mobius_backup_list');
    if (!itemstring) {
        localStorage.setItem('mobius_backup_list', `["${name}"]`);
        localStorage.setItem('mobius_backup_date_dict', `{ "${name}": "${(new Date()).toLocaleString()}"}`);
    } else {
        const items: string[] = JSON.parse(itemstring);
        let check = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === name) {
                items.splice(i, 1);
                items.unshift(item);
                check = true;
                break;
            }
        }
        if (!check) {
            items.unshift(name);
            // if (items.length > 10) {
            //     const item = items.pop();
            //     localStorage.removeItem(item);
            // }
        }
        localStorage.setItem('mobius_backup_list', JSON.stringify(items));
        const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
        itemDates[itemstring] = (new Date()).toLocaleString();
        localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
    }
    const requestedBytes = 1024 * 1024 * 50;
    // window['_code__'] = name;
    // window['_file__'] = file;

    function saveToFS(fs) {
        const code = name;
        // console.log(code)
        fs.root.getFile(code, { create: true}, function (fileEntry) {
            fileEntry.createWriter(async function (fileWriter) {
                const bb = new Blob([file + '_|_|_'], {type: 'text/plain;charset=utf-8'});
                await fileWriter.write(bb);
            }, (e) => { console.log(e); });
        }, (e) => { console.log(e.code); });
    }

    navigator.webkitPersistentStorage.requestQuota (
        requestedBytes, function(grantedBytes) {
            // @ts-ignore
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS,
            function(e) { throw e; });
        }, function(e) { throw e; }
    );
    return true;
    // localStorage.setItem(code, file);
}

