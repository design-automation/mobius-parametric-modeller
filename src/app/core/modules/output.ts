
/**
 * return certain value from the model
 * @param {any[]} __model__  Model of the node.
 * @param {number} index  index of the value to be returned.
 * @returns {any} value
 */
export function return_value(__model__: any[], index: number): any{
    if (index > __model__.length) return __model__;
    return __model__[index].value;
}