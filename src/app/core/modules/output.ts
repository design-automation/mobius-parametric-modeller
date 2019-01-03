import { GIModel } from '@libs/geo-info/GIModel';

/**
* Return certain value from the model for the flowchart's end node
 * @summary Return a specific value
 * @param {any[]} __model__  Model of the node.
 * @param {number} index  Index of the value to be returned.
 * @returns {any} Value
 */
<<<<<<< HEAD
export function return_value(__model__: any[], index: number): any {
    if (index > __model__.length) { return __model__; }
    return __model__[index].value;
}
=======
export function Return(__model__: GIModel, value: any): any {
    return value;
}


>>>>>>> 757534e6382bc233f54db88be55420e74c5c3db4
