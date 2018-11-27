/**
 * Create a new model
 * @summary New model
 * 
 * @returns {any[]} Empty new model
 */
export function New(): any[]{
    return [];
}

/**
 * Merge two models, first model will be modified
 * @summary Merge two models
 * 
 * @param {any[]} model1 First model to be merged, will be modified to become the merged model after execution of the function
 * @param {any[]} model2 Second model to be merged, unchanged after execution of the function
 * 
 * @returns {any[]} Merged model
 */
export function Merge(model1, model2): any[]{
    for (let j of model2){
        let existing = false;
        for(let i of model1){
            if (i.value == j.value){
                existing = true;
            }
        }
        if (!existing){
            model1.push(j)
        }
    }
    return model1;
}

/**
 * Register a value in the model
 * @summary Set a value
 * 
 * @test test1
 * @param {any[]} __model__  Model of the node.
 * @param {any} var_value  Value to be set.
 * 
 * @returns {number[]} Index of the set value
 */
export function set(__model__: any[], var_value: any): number[]{
    for (let i = 0; i < __model__.length; i++){
        if (__model__[i]["value"] == var_value){
            return [i]
        }
    }
    let obj = {  
        "value": var_value,
        "properties":{}
    };
    __model__.push(obj);
    return [__model__.length-1];
}

/**
 * Get a value from the model with a list of indices
 * @summary Get a specific value
 * 
 * @param {any[]} __model__  Model of the node.
 * @param {number[]}}indices  List of indices of the values to be retrieved from the model.
 * 
 * @returns Value
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
 * Remove certain value from the model with a list of indices
 * @summary Remove a specific value
 * 
 * @param {any[]} __model__  Model of the node.
 * @param {number[]} indices  List of indices of the values to be removed from the model.
 */
export function remove(__model__: JSON[], indices: number[]): void{
    indices.sort((a,b)=>{return b-a})
    indices.map((index)=>{
        if (index > __model__.length) {
            return;
        } 
        __model__.splice(index,1);
    });
}
