import { GIModel } from '@libs/geo-info/GIModel';
import { exportObj } from '@libs/geo-info/export';
import { importObj } from '@libs/geo-info/import';
import { EIODataTypes } from '@libs/geo-info/common';
import { download } from '@libs/filesys/download';
import { __merge__ } from './_model';

/**
 * Import data into the model. 
 *
 * @param model_data The model data in gs-json string format.
 * @param data_type Enum of GI or OBJ.
 * @returns void
 * @example util.ImportData (file1, OBJ)
 * @example_info Imports the data from file1 (defining the .obj file uploaded in 'Start' node).
 */
export function ImportData(__model__: GIModel, model_data: string, data_type: EIODataTypes): void {
    switch (data_type) {
        case EIODataTypes.GI:
            const gi_model: GIModel = new GIModel(JSON.parse(model_data));
            __merge__(__model__, gi_model);
            break;
        case EIODataTypes.OBJ:
            const obj_model: GIModel = importObj(model_data);
            this.__merge__(__model__, obj_model);
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
}
/**
 * Export data from the model.
 * @param __model__
 * @param filename Name of the file as a string.
 * @param data_type Enum of GI or OBJ.
 * @returns Boolean.
 */
export function ExportData(__model__: GIModel, filename: string, data_type: EIODataTypes): boolean {
    switch (data_type) {
        case EIODataTypes.GI:
            return download( JSON.stringify(__model__.getData()), filename );
            break;
        case EIODataTypes.OBJ:
            const data: string = exportObj(__model__);
            return download( data, filename );
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
}
