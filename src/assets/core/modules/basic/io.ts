/**
 * The `io` module has functions for importing and exporting.
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { importObj, exportPosiBasedObj, exportVertBasedObj } from '@assets/libs/geo-info/io/io_obj';
import { importGeojson, exportGeojson } from '@assets/libs/geo-info/io/io_geojson';
import { download } from '@libs/filesys/download';
import { TId, EEntType, TEntTypeIdx, IEntSets } from '@libs/geo-info/common';
// import { __merge__ } from '../_model';
// import { _model } from '..';
import { idsMake, idsBreak, idsMakeFromIdxs, idMake } from '@assets/libs/geo-info/common_id_funcs';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import JSZip from 'jszip';

const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota

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
export async function Read(__model__: GIModel, data: string): Promise<string|{}> {
    return _getFile(data);
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
export async function Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean> {
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
 * \n
 * There are two ways of specifying the file location to be imported:
 * - A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
 * - A file name in the local storage, e.g. "my_data.obj".
 * \n
 * To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
 * Note that a codescript using a file in local storage may fail when others try to open the file.
 * \n
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
export async function Import(__model__: GIModel, input_data: string, data_format: _EIODataFormat): Promise<TId|TId[]|{}> {
    const model_data = await _getFile(input_data);
    if (!model_data) {
        throw new Error('Invalid imported model data');
    }
    // zip file
    if (model_data.constructor === {}.constructor) {
        const coll_results = {};
        for (const data_name in <Object> model_data) {
            if (model_data[data_name]) {
                coll_results[data_name]  = _import(__model__, <string> model_data[data_name], data_format);
            }
        }
        return coll_results;
    }
    // single file
    return _import(__model__, model_data, data_format);
}
export function _import(__model__: GIModel, model_data: string, data_format: _EIODataFormat): TId|TId[] {
    switch (data_format) {
        case _EIODataFormat.GI:
            const gi_colls_i: number[]  = _importGI(__model__, <string> model_data);
            return idsMakeFromIdxs(EEntType.COLL, gi_colls_i) as TId|TId[];
        case _EIODataFormat.OBJ:
            const obj_coll_i: number  = _importObj(__model__, <string> model_data);
            return idMake(EEntType.COLL, obj_coll_i) as TId;
        case _EIODataFormat.GEOJSON:
            const gj_coll_i: number  = _importGeojson(__model__, <string> model_data);
            return idMake(EEntType.COLL, gj_coll_i) as TId;
        default:
            throw new Error('Import type not recognised');
    }
}
export function _importGI(__model__: GIModel, json_str: string): number[] {
    // get number of ents before merge
    const num_ents_before: number[] = __model__.metadata.getEntCounts();
    // import
    __model__.importGI(json_str);
    // get number of ents after merge
    const num_ents_after: number[] = __model__.metadata.getEntCounts();
    // return the result
    const colls_i: number[] = [];
    for (let coll_i = num_ents_before[4]; coll_i < num_ents_after[4]; coll_i++) {
        colls_i.push( coll_i );
    }
    return colls_i;
}
function _importObj(__model__: GIModel, model_data: string): number {
    // get number of ents before merge
    const num_ents_before: number[] = __model__.metadata.getEntCounts();
    // import
    importObj(__model__, model_data);
    // get number of ents after merge
    const num_ents_after: number[] = __model__.metadata.getEntCounts();
    // return the result
    return _createColl(__model__, num_ents_before, num_ents_after);
}
function _importGeojson(__model__: GIModel, model_data: string): number {
    // get number of ents before merge
    const num_ents_before: number[] = __model__.metadata.getEntCounts();
    // import
    importGeojson(__model__, model_data, 0);
    // get number of ents after merge
    const num_ents_after: number[] = __model__.metadata.getEntCounts();
    // return the result
    return _createColl(__model__, num_ents_before, num_ents_after);
}
// function _createGIColl(__model__: GIModel, before: number[], after: number[]): number {
//     throw new Error('Not implemented');
//     // const points_i: number[] = [];
//     // const plines_i: number[] = [];
//     // const pgons_i: number[] = [];
//     // for (let point_i = before[1]; point_i < after[1]; point_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.POINT, point_i)) {
//     //         points_i.push( point_i );
//     //     }
//     // }
//     // for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.PLINE, pline_i)) {
//     //         plines_i.push( pline_i );
//     //     }
//     // }
//     // for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.PGON, pgon_i)) {
//     //         pgons_i.push( pgon_i );
//     //     }
//     // }
//     // if (points_i.length + plines_i.length + pgons_i.length === 0) { return null; }
//     // const container_coll_i: number = __model__.modeldata.geom.add.addColl(null, points_i, plines_i, pgons_i);
//     // for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.COLL, coll_i)) {
//     //         __model__.modeldata.geom.modify_coll.setCollParent(coll_i, container_coll_i);
//     //     }
//     // }
//     // return container_coll_i;
// }
function _createColl(__model__: GIModel, before: number[], after: number[]): number {
    const ssid: number = __model__.modeldata.active_ssid;
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const colls_i: number[] = [];
    for (let point_i = before[1]; point_i < after[1]; point_i++) {
        points_i.push( point_i );
    }
    for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
        plines_i.push( pline_i );
    }
    for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
        pgons_i.push( pgon_i );
    }
    for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
        colls_i.push( coll_i );
    }
    if (points_i.length + plines_i.length + pgons_i.length === 0) { return null; }
    const container_coll_i: number = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, colls_i);
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
 * \n
 * If you expore to your  hard disk,
 * it will result in a popup in your browser, asking you to save the file.
 * \n
 * If you export to Local Storage, there will be no popup.
 * \n
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @param data_target Enum, where the data is to be exported to.
 * @returns void.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
export async function Export(__model__: GIModel, entities: TId|TId[]|TId[][],
        file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget) {
    if ( typeof localStorage === 'undefined') { return; }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL], [EEntType.PLINE, EEntType.PGON, EEntType.COLL])  as TEntTypeIdx[];
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
    await _export(__model__, ents_arr, file_name, data_format, data_target);
}
async function _export(__model__: GIModel, ents_arr: TEntTypeIdx[],
    file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): Promise<boolean> {
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            let model_data = '';
            model_data = __model__.exportGI(ents_arr);
            // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
            model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
            // === save the file ===
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(model_data , file_name);
            }
            return saveResource(model_data, file_name);
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

async function saveResource(file: string, name: string): Promise<boolean> {
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

async function getURLContent(url: string): Promise<any> {
    url = url.replace('http://', 'https://');
    if (url.indexOf('dropbox') !== -1) {
        url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
    }
    if (url[0] === '"' || url[0] === '\'') {
        url = url.substring(1);
    }
    if (url[url.length - 1] === '"' || url[url.length - 1] === '\'') {
        url = url.substring(0, url.length - 1);
    }
    const p = new Promise((resolve) => {
        fetch(url).then(res => {
            if (!res.ok) {
                resolve('HTTP Request Error: Unable to retrieve file from ' + url);
                return '';
            }
            if (url.indexOf('.zip') !== -1) {
                res.blob().then(body => resolve(body));
            } else {
                res.text().then(body => resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1')));
            }
        });

    });
    return await p;
}
async function openZipFile(zipFile) {
    let result = '{';
    await JSZip.loadAsync(zipFile).then(async function (zip) {
        for (const filename of Object.keys(zip.files)) {
            // const splittedNames = filename.split('/').slice(1).join('/');
            await zip.files[filename].async('text').then(function (fileData) {
                result += `"${filename}": \`${fileData.replace(/\\/g, '\\\\')}\`,`;
            });
        }
    });
    result += '}';
    return result;
}
async function loadFromFileSystem(filecode): Promise<any> {
    const p = new Promise((resolve) => {
        navigator.webkitPersistentStorage.requestQuota (
            requestedBytes, function(grantedBytes) {
                // @ts-ignore
                window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function(fs) {
                    fs.root.getFile(filecode, {}, function(fileEntry) {
                        fileEntry.file((file) => {
                            const reader = new FileReader();
                            reader.onerror = () => {
                                resolve('error');
                            };
                            reader.onloadend = () => {
                                if ((typeof reader.result) === 'string') {
                                    resolve((<string>reader.result).split('_|_|_')[0]);
                                    // const splitted = (<string>reader.result).split('_|_|_');
                                    // let val = splitted[0];
                                    // for (const i of splitted) {
                                    //     if (val.length < i.length) {
                                    //         val = i;
                                    //     }
                                    // }
                                    // resolve(val);
                                } else {
                                    resolve(reader.result);
                                }
                            };
                            reader.readAsText(file, 'text/plain;charset=utf-8');
                        });
                    });
                });
            }, function(e) { console.log('Error', e); }
        );
    });
    return await p;
}
export async function _getFile(source: string) {
    if (source.indexOf('__model_data__') !== -1) {
        return source.split('__model_data__').join('');
    } else if (source[0] === '{') {
        return source;
    } else if (source.indexOf('://') !== -1) {
        const val = source.replace(/ /g, '');
        const result = await getURLContent(val);
        if (result === undefined) {
            return source;
        } else if (result.indexOf && result.indexOf('HTTP Request Error') !== -1) {
            throw new Error(result);
        } else if (val.indexOf('.zip') !== -1) {
            return await openZipFile(result);
        } else {
            return result;
        }
    } else {
        if (source.length > 1 && source[0] === '{') {
            return null;
        }
        const val = source.replace(/\"|\'/g, '');
        const backup_list: string[] = JSON.parse(localStorage.getItem('mobius_backup_list'));
        if (val.indexOf('*') !== -1) {
            const splittedVal = val.split('*');
            const start = splittedVal[0] === '' ? null : splittedVal[0];
            const end = splittedVal[1] === '' ? null : splittedVal[1];
            let result = '{';
            for (const backup_name of backup_list) {
                let valid_check = true;
                if (start && !backup_name.startsWith(start)) {
                    valid_check = false;
                }
                if (end && !backup_name.endsWith(end)) {
                    valid_check = false;
                }
                if (valid_check) {
                    const backup_file = await loadFromFileSystem(backup_name);
                    result += `"${backup_name}": \`${backup_file.replace(/\\/g, '\\\\')}\`,`;
                }
            }
            result += '}';
            return result;
        } else {
            if (backup_list.indexOf(val) !== -1) {
                const result = await loadFromFileSystem(val);
                if (!result || result === 'error') {
                    throw(new Error(`File named ${val} does not exist in the local storage`));
                    // return source;
                } else {
                    return result;
                }
            } else {
                throw(new Error(`File named ${val} does not exist in the local storage`));
            }
        }
    }
}
