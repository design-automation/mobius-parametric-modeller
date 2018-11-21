export module Output{
    /**
     * return certain value from the model
     * @param __model__  Model of the node.
     * @param index  index of the value to be returned.
     * @returns value
     */
    export function return_value(__model__: any[], index: number): any{
        if (index > __model__.length) return __model__;
        return __model__[index].value;
    }
}