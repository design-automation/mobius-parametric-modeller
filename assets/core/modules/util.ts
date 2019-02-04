/**
 * The `util` module has functions for importing data into the model and
 * exporting data out of the model.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { exportObj } from '@libs/geo-info/export';
import { importObj } from '@libs/geo-info/import';
import { download } from '@libs/filesys/download';
import { TId, EEntType, Txyz, TPlane, TRay, IGeomPack, IModelData } from '@libs/geo-info/common';
import { __merge__ } from './_model';
import { _model } from '@modules';
import { idsMake } from '@libs/geo-info/id';

// ================================================================================================
// Import / Export data types
export enum _EIODataFormat {
    GI = 'gi',
    OBJ = 'obj'
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
            throw new Error("Not implemented");
            // const obj_model: GIModel = importObj(model_data);
            // geom_pack = __merge__(__model__, obj_model);
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
    const posis_id: TId[] =  geom_pack.posis_i.map(  posi_i =>  idsMake([EEntType.POSI,  posi_i])) as TId[];
    const points_id: TId[] = geom_pack.points_i.map( point_i => idsMake([EEntType.POINT, point_i])) as TId[];
    const plines_id: TId[] = geom_pack.plines_i.map( pline_i => idsMake([EEntType.PLINE, pline_i])) as TId[];
    const pgons_id: TId[] =  geom_pack.pgons_i.map(  pgon_i =>  idsMake([EEntType.PGON,  pgon_i])) as TId[];
    const colls_id: TId[] =  geom_pack.colls_i.map(  coll_i =>  idsMake([EEntType.COLL,  coll_i])) as TId[];
    return [...posis_id, ...points_id, ...plines_id, ...pgons_id, ...colls_id];
}
// ================================================================================================
/**
 * Export data from the model as a file.
 * This will result in a popup in your browser, asking you to save the filel.
 * @param __model__
 * @param filename Name of the file as a string.
 * @param data_format Enum, the file format.
 * @returns Boolean.
 * @example util.ExportData ('my_model.obj', obj)
 * @example_info Exports all the data in the model as an OBJ.
 */
export function ExportData(__model__: GIModel, filename: string, data_format: _EIODataFormat): boolean {
    switch (data_format) {
        case _EIODataFormat.GI:
            let gi_data: string = JSON.stringify(__model__.getData());
            gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
            return download(gi_data , filename);
            break;
        case _EIODataFormat.OBJ:
            const obj_data: string = exportObj(__model__);
            return download(obj_data, filename);
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
}
// ================================================================================================
