import { GIModel } from '@libs/geo-info/GIModel';
import { exportObj } from '@libs/geo-info/export';
import { importObj } from '@libs/geo-info/import';
import { EEntityTypeStr, Txyz, EAttribDataTypeStrs, TAttribDataTypes } from '@libs/geo-info/common';
import { download } from '@libs/filesys/download';

//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================

/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function __new__(): GIModel {
    const model: GIModel = new GIModel();
    model.attribs.add.addPosiAttrib('coordinates', EAttribDataTypeStrs.FLOAT, 3);
    return model;
}

/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
export function __preprocess__(__model__: GIModel): void {
    // TODO
}

/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
export function __postprocess__(__model__: GIModel): void {
    // TODO
    // Remove all undefined values for the arrays
}

/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
export function __merge__(model1: GIModel, model2: GIModel): void {
    model1.merge(model2);
}
/**
 * Returns a string representation of this model.
 * @param __model__
 */
export function __stringify__(__model__: GIModel): string {
    return JSON.stringify(__model__.getData());
}

/**
 * Query entities in the model
 * @param __model__
 * @param query_str
 */
export function __query__(__model__: GIModel, query_str: string): string[] {
    return __model__.attribs.query.queryAttribs(query_str);
}
//  ===============================================================================================================
//  Functions visible in the Mobius interface.
//  ===============================================================================================================

/**
 * Add new data to the model.
 *
 * @param model_data The model data in gs-json string format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function addGiData(__model__: GIModel, model_data: string): void {
    const model: GIModel = new GIModel(JSON.parse(model_data));
    __merge__(__model__, model);
}

/**
 *  Gets the number of points in the model.
 * @param __model__
 */
export function numPoints(__model__: GIModel): number {
    return __model__.geom.query.numPoints();
}
/**
 *  Gets the number of linestrings in the model.
 * @param __model__
 */
export function numPolylines(__model__: GIModel): number {
    return __model__.geom.query.numLines();
}
/**
 *  Gets the number of polygons in the model.
 * @param __model__
 */
export function numPolygons(__model__: GIModel): number {
    return __model__.geom.query.numPgons();
}
/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords
 */
export function addPosition(__model__: GIModel, coords: Txyz): string {
    const posi_id: string = __model__.geom.add.addPosition();
    __model__.attribs.add.setAttribValue(posi_id, 'coordinates', coords);
    return posi_id;
}
/**
 * Adds a new point to the model.
 * @param __model__
 * @param coords
 */
export function addPoint(__model__: GIModel, position: string): string {
    return __model__.geom.add.addPoint(position);
}
/**
 * Adds a new linestring to the model.
 * @param __model__
 * @param coords
 */
export function addPolyline(__model__: GIModel, positions: string[]): string {
    return __model__.geom.add.addPline(positions);
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param coords
 */
export function addPolygon(__model__: GIModel, positions: string[]): string {
    return __model__.geom.add.addPgon(positions);
}
/**
 * Gets all the positions in the model.
 * @param __model__
 */
export function getPositions(__model__: GIModel): string[] {
    return __model__.geom.query.getPosis();
}
/**
 * Gets all the points in the model.
 * @param __model__
 */
export function getPoints(__model__: GIModel): string[] {
    return __model__.geom.query.getPoints();
}
/**
 * Gets all the lines in the model.
 * @param __model__
 */
export function getPolylines(__model__: GIModel): string[] {
    return __model__.geom.query.getLines();
}
/**
 * Gets all the points in the model.
 * @param __model__
 */
export function getPolygons(__model__: GIModel): string[] {
    return __model__.geom.query.getPgons();
}
/**
 * Gets all the collections in the model.
 * @param __model__
 */
export function getCollections(__model__: GIModel): string[] {
    return __model__.geom.query.getColls();
}
/**
 * Create a new attribute.
 * @param __model__
 * @param entity_type
 * @enum entity_type:['a','b','c']
 * @param name
 * @param data_type
 * @param data_size
 */
export function createAttrib(__model__: GIModel, entity_type: EEntityTypeStr,
        name: string, data_type: EAttribDataTypeStrs, data_size: number): void {
    switch (entity_type) {
        case EEntityTypeStr.POSI:
            __model__.attribs.add.addPosiAttrib(name, data_type, data_size);
            break;
        case EEntityTypeStr.VERT:
            __model__.attribs.add.addVertAttrib(name, data_type, data_size);
            break;
        case EEntityTypeStr.EDGE:
            __model__.attribs.add.addEdgeAttrib(name, data_type, data_size);
            break;
        case EEntityTypeStr.WIRE:
            __model__.attribs.add.addWireAttrib(name, data_type, data_size);
            break;
        case EEntityTypeStr.FACE:
            __model__.attribs.add.addFaceAttrib(name, data_type, data_size);
            break;
        case EEntityTypeStr.COLL:
            __model__.attribs.add.addCollAttrib(name, data_type, data_size);
            break;
        default:
            break;
    }
}
/**
 * Get attribute value.
 * @param __model__
 * @param id
 */
export function getAttribValue(__model__: GIModel, id: string): TAttribDataTypes {
    return __model__.attribs.query.getAttribValue(id, name);
}
/**
 * Set attribute value.
 * @param __model__
 * @param id
 */
export function setAttribValue(__model__: GIModel, id: string, name: string, value: TAttribDataTypes): void {
    return __model__.attribs.add.setAttribValue(id, name, value);
}
/**
 * Query
 * @param __model__
 * @param query_str
 */
export function queryAttribValue(__model__: GIModel, query_str: string): string[] {
    return __query__(__model__, query_str);
}

/**
 * Save
 * @param __model__
 * @param filename
 */
export function save(__model__: GIModel, filename: string): boolean {
    return download( JSON.stringify(__model__.getData()), filename );
}


/**
 * Export the model in obj format.
 * @param __model__
 * @param filename
 */
export function saveObj(__model__: GIModel, filename: string): boolean {
    const data: string = exportObj(__model__);
    return download( data, filename );
}

/**
 * Import the model in obj format.
 * @param __model__
 * @param filename
 */
export function addObjData(__model__: GIModel, data: string): void {
    const model: GIModel = importObj(data);
    this.__merge__(__model__, model);
}
