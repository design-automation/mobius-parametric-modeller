
/**
 * Return certain value from the model for the flowchart's end node
 * @summary Return a specific value
 * @param {any[]} __model__  Model of the node.
 * @param {number} index  Index of the value to be returned.
 * @returns {any} Value
 */
export function return_value(__model__: any[], index: number): any {
    if (index > __model__.length) { return __model__; }
    return __model__[index].value;
}
