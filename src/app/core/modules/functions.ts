/**
 * Functions for working with gs-json models.
 * Models are datastructures that contain geometric entities with attributes.
 */

//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================

/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function __new__(): any {
    return {
        geometry:{
            positions: [],
            coordinates: [],
            triangles: [],
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        },
        semantics:{
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        }
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
export function __merge__(model1: any, model2: any): any {
    // TO DO
    return model1;
}

//  ===============================================================================================================
//  End user functions
//  ===============================================================================================================

/**
 * Creates a new model and populates the model with data.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function addData(__model__: any, model_data: any): any {
    // TO DO use the merge function to keep existing data
    __model__ = model_data;
    
}
