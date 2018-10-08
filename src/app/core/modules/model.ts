/**
 * Functions for working with models.
 * Models are datastructures that contain geometric entities with attributes,
 * possibly organised into groups.
 */

/**
 * Models can contain two types of geometric entities: points and objects.
 * The objects are further sudivided into different types, e.g. polylines, polymeshes, circle, etc.
 */

import * as gs from "gs-json";
import * as util from "./model_dev";
import * as download from "./libs/filesys/download"

//  ===============================================================================================================
//  Model Constructors ===========================================================================================
//  ===============================================================================================================

/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function New(): gs.IModel {
    return new gs.Model();
}

//  ===============================================================================================================
//  Model Functions ============================================================================================
//  ===============================================================================================================

/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge.
 * @returns The merged model.
 */
export function merge(model1: gs.IModel, model2: gs.IModel): gs.IModel {
    model1.merge(model2);
    return model1;
}

/**
 * Export model as obj file. Only pline and pmeshes will be exported.
 *
 * @param model The model to export.
 * @param filepath The path to the obj file.
 * @returns True if successful.
 */
export function exportObj(model: gs.IModel, filename: string): boolean {
    return download.save(gs.exportObj(model), filename);
}
