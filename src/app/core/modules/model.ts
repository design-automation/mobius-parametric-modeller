export module Model{
    /**
     * create a new model
     * @returns empty new model
     */
    export function New(): any[]{
        return [];
    }

    /**
     * create a new model
     * @returns empty new model
     */
    export function Merge(model1, model2): void{
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
    }

}