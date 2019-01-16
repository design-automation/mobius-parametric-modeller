import { GIModel } from '@libs/geo-info/GIModel';

/**
* Return certain value from the model for the flowchart's end node
 * @summary Return a specific value
 * @param {any[]} __model__  Model of the node.
 * @param {number} value  Index of the value to be returned.
 * @returns {any} Value
 */
export function Return(__model__: GIModel, value: any): any {
    return value;
}
