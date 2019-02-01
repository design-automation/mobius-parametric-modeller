/**
 * The `render` module has functions for defining various settings for the 3D viewer.
 * These include things like creating more advanced materials such as glass.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';

// ================================================================================================
/**
 * Creates a glass material and saves it in the model attributes.
 *
 * In order to assign a material to polygons in the model, a polygon attribute called 'material
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param opacity The opacity of the glass, between 0 (totally opaque) and 1 (totally transparent).
 * @returns void
 */
export function MaterialGlass(__model__: GIModel, name: string, opacity: number): void {
    opacity = (opacity > 1) ? 1 : opacity;
    opacity = (opacity < 1) ? 0 : opacity;
    const val: string = JSON.stringify({opacity: opacity, transparent: true});
    __model__.attribs.add.setModelAttribValue(name, val);
}
// ================================================================================================
