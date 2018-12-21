import { GIModel } from '@libs/geo-info/GIModel';
import { exportObj as _exportObj } from '@libs/geo-info/export';
import { importObj as _importObj } from '@libs/geo-info/import';
import { download } from '@libs/filesys/download';
import { __merge__ } from './_model';

//  ===============================================================================================================
//  Functions to make stuff
//  ===============================================================================================================

/**
 * Add new data to the model.
 *
 * @param model_data The model data in gs-json string format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function importGi(__model__: GIModel, model_data: string): void {
    const model: GIModel = new GIModel(JSON.parse(model_data));
    __merge__(__model__, model);
}
/**
 * Save
 * @param __model__
 * @param filename
 */
export function exportGi(__model__: GIModel, filename: string): boolean {
    return download( JSON.stringify(__model__.getData()), filename );
}
/**
 * Import the model in obj format.
 * @param __model__
 * @param model_data
 */
export function importObj(__model__: GIModel, model_data: string): void {
    const model: GIModel = _importObj(model_data);
    this.__merge__(__model__, model);
}
/**
 * Export the model in obj format.
 * @param __model__
 * @param filename
 */
export function exportObj(__model__: GIModel, filename: string): boolean {
    const data: string = _exportObj(__model__);
    return download( data, filename );
}

