import { GIModel } from '../../../libs/geo-info/GIModel';
import { TCoord, EAttribDataTypeStrs } from '../../../libs/geo-info/json_data';

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
    model.attribs().addPosiAttrib('coordinates', EAttribDataTypeStrs.FLOAT, 3);
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

//  ===============================================================================================================
//  Functions visible in the Mobius interface.
//  ===============================================================================================================

/**
 * Add new data to the model.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function addData(__model__: GIModel, model: any): any {
    __merge__(__model__, model);
}

/**
 *  Gets the number of points in the model.
 * @param __model__
 */
export function numPoints(__model__: GIModel): number {
    return __model__.geom().numPoints();
}
/**
 *  Gets the number of linestrings in the model.
 * @param __model__
 */
export function numLinestrings(__model__: GIModel): number {
    return __model__.geom().numLines();
}
/**
 *  Gets the number of polygons in the model.
 * @param __model__
 */
export function numPolygons(__model__: GIModel): number {
    return __model__.geom().numPgons();
}
/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords
 */
export function addPosition(__model__: GIModel, coords: TCoord): number {
    const posi_i: number = __model__.geom().addPosition();
    __model__.attribs().setPosiAttribValue(posi_i, 'coordinates', coords);
    return posi_i;
}
/**
 * Adds a new point to the model.
 * @param __model__
 * @param coords
 */
export function addPoint(__model__: GIModel, position: number) {
    return __model__.geom().addPoint(position);
}
/**
 * Adds a new linestring to the model.
 * @param __model__
 * @param coords
 */
export function addLinestring(__model__: GIModel, positions: number[]) {
    return __model__.geom().addLine(positions);
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param coords
 */
export function addPolygon(__model__: GIModel, positions: number[]) {
    return __model__.geom().addPgon(positions);
}
