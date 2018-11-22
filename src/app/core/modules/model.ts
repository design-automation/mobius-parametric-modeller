<<<<<<< HEAD
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
 * Creates a new model and populates the model with data.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function FromData(model_data: any): gs.IModel {
    if (typeof model_data == 'string'){
        return new gs.Model(JSON.parse(model_data));
=======
export module Model{
    /**
     * set a value in the model
     * @param __model__  Model of the node.
     * @param var_value  Value to be set.
     * @returns index of the set value
     */
    export function set(__model__: any[], var_value: any): number[]{
        for (let i = 0; i < __model__.length; i++){
            if (__model__[i]["value"] == var_value){
                return [i]
            }
        }
        var obj = {  
            "value": var_value,
            "properties":{}
         };
        __model__.push(obj);
        return [__model__.length-1];
    }

    /**
     * get a value from the model with a list of indices
     * @param __model__  Model of the node.
     * @param indices  list of indices of the values to be retrieved from the model.
     * @returns value
     */
    export function get(__model__: JSON[], indices: number[]): any{
        let result = [];
        
        for (let i of indices){
            if (i > __model__.length || i < 0){
                continue
            }
            result.push(__model__[i]);
        }
        return result
    }

    /**
     * remove certain value from the model with a list of indices
     * @param __model__  Model of the node.
     * @param indices  list of indices of the values to be removed from the model.
     */
    export function remove(__model__: JSON[], indices: number[]): void{
        indices.sort((a,b)=>{return b-a})
        indices.map((index)=>{
            if (index > __model__.length) {
                return;
            } 
            __model__.splice(index,1);
        });
>>>>>>> d918d8aa32772cdff5b668b3d8ab951b1e8685e1
    }
    else{
        return new gs.Model(model_data);
    }
}

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
