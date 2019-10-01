/**
 * The `util` module has functions for importing data into the model and
 * exporting data out of the model.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { importObj, exportObj } from '@libs/geo-info/io_obj';
import { importDae, exportDae } from '@libs/geo-info/io_dae';
import { importGeojson } from '@libs/geo-info/io_geojson';
import { download } from '@libs/filesys/download';
import { TId, EEntType, Txyz, TPlane, TRay, IGeomPack, IModelData } from '@libs/geo-info/common';
import { __merge__ } from '../_model';
import { _model } from '..';
import { idsMake } from '@libs/geo-info/id';

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
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
export function ReadData(__model__: GIModel, data: string): string {
    return data;
}
/**
 * Save data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export function WriteData(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Boolean {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return download(data, file_name);
        }
        return saveResource(data, file_name);
    } catch (ex) {
        return false;
    }
}
/**
 * Imports data into the model.
 * In order to get the model data from a file, you need to define the File or URL parameter
 * in the Start node of the flowchart.
 *
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example util.ImportData (file1_data, obj)
 * @example_info Imports the data from file1 (defining the .obj file uploaded in 'Start' node).
 */
export function ImportData(__model__: GIModel, model_data: string, data_format: _EIODataFormat): TId[] {
    let geom_pack: IGeomPack;
    switch (data_format) {
        case _EIODataFormat.GI:
            const gi_json: IModelData = JSON.parse(model_data) as IModelData;
            geom_pack = __model__.setData(gi_json);
            break;
        case _EIODataFormat.OBJ:
            throw new Error('Not implemented');
            // const obj_model: GIModel = importObj(model_data);
            // geom_pack = __merge__(__model__, obj_model);
            break;
        case _EIODataFormat.GEOJSON:
            geom_pack = importGeojson(__model__, model_data, 0);
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
    if (geom_pack === undefined) {
        return [];
    }
    const posis_id: TId[] =  geom_pack.posis_i.map(  posi_i =>  idsMake([EEntType.POSI,  posi_i])) as TId[];
    const points_id: TId[] = geom_pack.points_i.map( point_i => idsMake([EEntType.POINT, point_i])) as TId[];
    const plines_id: TId[] = geom_pack.plines_i.map( pline_i => idsMake([EEntType.PLINE, pline_i])) as TId[];
    const pgons_id: TId[] =  geom_pack.pgons_i.map(  pgon_i =>  idsMake([EEntType.PGON,  pgon_i])) as TId[];
    const colls_id: TId[] =  geom_pack.colls_i.map(  coll_i =>  idsMake([EEntType.COLL,  coll_i])) as TId[];
    return [...posis_id, ...points_id, ...plines_id, ...pgons_id, ...colls_id];
}
// ================================================================================================
export enum _EIOExportDataFormat {
    GI = 'gi',
    OBJ = 'obj',
    DAE = 'dae',
    GEOJSON = 'geojson'
}
/**
 * Export data from the model as a file.
 * This will result in a popup in your browser, asking you to save the file.
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param filename Name of the file as a string.
 * @param data_format Enum, the file format.
 * @param data_target Enum, where the data is to be exported to.
 * @returns Boolean.
 * @example util.ExportData ('my_model.obj', obj)
 * @example_info Exports all the data in the model as an OBJ.
 */
export function ExportData(__model__: GIModel, entities: TId|TId[]|TId[][],
        filename: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): boolean {
    // TODO implement export of entities
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            let gi_data: string = JSON.stringify(__model__.getData());
            gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(gi_data , filename);
            }
            return saveResource(gi_data, filename);
            break;
        case _EIOExportDataFormat.OBJ:
            const obj_data: string = exportObj(__model__);
            // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(obj_data , filename);
            }
            return saveResource(obj_data, filename);
            break;
        case _EIOExportDataFormat.DAE:
            const dae_data: string = exportDae(__model__);
            // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(dae_data, filename);
            }
            return saveResource(dae_data, filename);
            break;
        // case _EIODataFormat.GEOJSON:
        //     const geojson_data: string = exportObj(__model__);
        //     return download(obj_data, filename);
        //     break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
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

/**
 * Export data from the model as a file.
 * This will result in a popup in your browser, asking you to save the filel.
 * @param __model__
 * @param __console__
 * @param __constList__
 * @param __fileName__
 * @param filename Name of the file as a string.
 * @param exportParams Enum.
 * @param exportContent Enum.
 * @returns Boolean.
 * @example util.ExportIO('my_model.json')
 * @example_info Exports all the data in the model as an OBJ.
 */
export function ExportIO(__model__: GIModel, __console__: string[], __constList__: any, __fileName__: string,
                        filename: string, exportParams: _EIOExportParams, exportContent: _EIOExportContents): boolean {
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

    return download(JSON.stringify(edxAnswer) , filename);
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
/**
 * Functions for saving and loading resources to file system.
 */

function saveResource(file: string, name: string): boolean {
    const itemstring = localStorage.getItem('mobius_backup_list');
    if (!itemstring) {
        localStorage.setItem('mobius_backup_list', `["${name}"]`);
    } else {
        const items: string[] = JSON.parse(itemstring);
        let check = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === name) {
                items.splice(i, 1);
                items.push(item);
                check = true;
                break;
            }
        }
        if (!check) {
            items.push(name);
            if (items.length > 5) {
                const item = items.shift();
                localStorage.removeItem(item);
            }
            localStorage.setItem('mobius_backup_list', JSON.stringify(items));
        }
    }
    const requestedBytes = 1024 * 1024 * 50;
    window['_code_'] = name;
    window['_file_'] = file;
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

function saveToFS(fs) {
    fs.root.getFile(window['_code_'], { create: true}, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
            const bb = new Blob([window['_file_']], {type: 'text/plain;charset=utf-8'});
            fileWriter.write(bb);
            window['_code_'] = undefined;
            window['_file_'] = undefined;
        }, (e) => { console.log(e); });
    }, (e) => { console.log(e.code); });
}
