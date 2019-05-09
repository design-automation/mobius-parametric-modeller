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
import { importGeojson } from '@assets/libs/geo-info/io_geojson';
import { download } from '@libs/filesys/download';
import { TId, EEntType, Txyz, TPlane, TRay, IGeomPack, IModelData } from '@libs/geo-info/common';
import { __merge__ } from './_model';
import { _model } from '@modules';
import { idsMake } from '@libs/geo-info/id';

// ================================================================================================
// Import / Export data types
export enum _EIODataFormat {
    GI = 'gi',
    OBJ = 'obj',
    GEOJSON = 'geojson'
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
 * This will result in a popup in your browser, asking you to save the filel.
 * @param __model__
 * @param filename Name of the file as a string.
 * @param data_format Enum, the file format.
 * @returns Boolean.
 * @example util.ExportData ('my_model.obj', obj)
 * @example_info Exports all the data in the model as an OBJ.
 */
export function ExportData(__model__: GIModel, filename: string, data_format: _EIOExportDataFormat): boolean {
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            let gi_data: string = JSON.stringify(__model__.getData());
            gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
            return download(gi_data , filename);
            break;
        case _EIOExportDataFormat.OBJ:
            const obj_data: string = exportObj(__model__);
            //obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
            return download(obj_data, filename);
            break;
        case _EIOExportDataFormat.DAE:
            const dae_data: string = exportDae(__model__);
            //dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
            return download(dae_data, filename);
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
// ================================================================================================
/**
 * Check tje internal consistency of the model.
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
