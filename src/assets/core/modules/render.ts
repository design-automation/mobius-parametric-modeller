/**
 * The `render` module has functions for defining various settings for the 3D viewer.
 * These settings are saved as attributes at the model level.
 * These include things like creating more advanced materials.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { Txyz } from '@assets/libs/geo-info/common';
import * as THREE from 'three';

export enum _ESide {
    FRONT =   'front_side',
    BACK =   'back_side',
    BOTH =   'both_sides'
}
function _convertSelectESideToNum(select: _ESide): number {
    switch (select) {
        case _ESide.FRONT:
            return THREE.FrontSide;
        case _ESide.BACK:
            return THREE.BackSide;
        default:
            return THREE.DoubleSide;
    }
}
export enum _EColours {
    NO_VERT_COLOURS =   'no_vertex_colours',
    VERT_COLOURS =   'vertex_colours'
}
function _convertSelectEColoursToNum(select: _EColours): number {
    switch (select) {
        case _EColours.NO_VERT_COLOURS:
            return THREE.NoColors;
        default:
            return THREE.VertexColors;
    }
}

enum _EMaterialType {
    STANDARD = 'MeshStandardMaterial',
    LAMBERT = 'MeshLambertMaterial',
    PHONG = 'MeshPhongMaterial',
    PHYSICAL = 'MeshPhysicalMaterial'
}
// ================================================================================================
/**
 * Creates a glass material with an opacity setting. The material will default to a standard Phong material.
 *
 * In order to assign a material to polygons in the model, a polygon attribute called 'material
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @returns void
 */
export function GlassMaterial(__model__: GIModel, name: string, opacity: number): void {
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    const settings_obj = {
        type: _EMaterialType.PHONG,
        opacity: opacity,
        transparent: transparent,
        shininess: 90,
        color: [1, 1, 1],
        emissive: [0, 0, 0],
        side: THREE.DoubleSide
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Lambert material and saves it in the model attributes.
 *
 * https://threejs.org/docs/scenes/material-browser.html#MeshLambertMaterial
 *
 * In order to assign a material to polygons in the model, a polygon attribute called 'material
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colours Enum, select whether to use vertex colours if they exist.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param diffuse_colour The diffuse colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param emissive_colour The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @returns void
 */
export function LambertMaterial(__model__: GIModel, name: string,
            select_side: _ESide,
            select_vert_colours: _EColours,
            opacity: number,
            diffuse_colour: Txyz,
            emissive_colour: Txyz
        ): void {
    const side: number = _convertSelectESideToNum(select_side);
    const vert_colours: number = _convertSelectEColoursToNum(select_vert_colours);
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(diffuse_colour);
    _clampArr01(emissive_colour);

    const settings_obj = {
        type: _EMaterialType.LAMBERT,
        side: side,
        vertexColors: vert_colours,
        opacity: opacity,
        transparent: transparent,
        color: diffuse_colour,
        emissive: emissive_colour
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Lambert material and saves it in the model attributes.
 *
 * https://threejs.org/docs/scenes/material-browser.html#MeshPhongMaterial
 *
 * In order to assign a material to polygons in the model, a polygon attribute called 'material
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colours Enum, select whether to use vertex colours if they exist.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param diffuse_colour The diffuse colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param emissive_colour The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param specular_colour The specular colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param shininess The shininess, between 0 and 100.
 * @returns void
 */
export function PhongMaterial(__model__: GIModel, name: string,
            select_side: _ESide,
            select_vert_colours: _EColours,
            opacity: number,
            diffuse_colour: Txyz,
            emissive_colour: Txyz,
            specular_colour: Txyz,
            shininess: number
        ): void {
    const side: number = _convertSelectESideToNum(select_side);
    const vert_colours: number = _convertSelectEColoursToNum(select_vert_colours);
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(diffuse_colour);
    _clampArr01(emissive_colour);
    _clampArr01(specular_colour);
    shininess = Math.floor(_clamp0100(shininess));

    const settings_obj = {
        type: _EMaterialType.PHONG,
        side: side,
        vertexColors: vert_colours,
        opacity: opacity,
        transparent: transparent,
        color: diffuse_colour,
        emissive: emissive_colour,
        specular: specular_colour,
        shininess: shininess
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Physical material and saves it in the model attributes.
 *
 * https://threejs.org/docs/scenes/material-browser.html#MeshPhysicalMaterial
 *
 * In order to assign a material to polygons in the model, a polygon attribute called 'material
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colours Enum, select whether to use vertex colours if they exist.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param diffuse_colour The diffuse colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param emissive_colour The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function PhysicalMaterial(__model__: GIModel, name: string,
            select_side: _ESide,
            select_vert_colours: _EColours,
            opacity: number,
            diffuse_colour: Txyz,
            emissive_colour: Txyz,
            roughness: number,
            metalness: number,
            reflectivity: number
        ): void {
    const side: number = _convertSelectESideToNum(select_side);
    const vert_colours: number = _convertSelectEColoursToNum(select_vert_colours);
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(diffuse_colour);
    _clampArr01(emissive_colour);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);
    reflectivity = _clamp01(reflectivity);

    const settings_obj = {
        type: _EMaterialType.PHYSICAL,
        side: side,
        vertexColors: vert_colours,
        opacity: opacity,
        transparent: transparent,
        color: diffuse_colour,
        emissive: emissive_colour,
        roughness: roughness,
        metalness: metalness,
        reflectivity: reflectivity
    };
    _setMaterialModelAttrib(__model__,name, settings_obj);
}
// ================================================================================================
function _clamp01(val: number): number {
    val = (val > 1) ? 1 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
function _clamp0100(val: number): number {
    val = (val > 100) ? 100 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
function _clampArr01(vals: number[]): void {
    for (let i = 0; i < vals.length; i++) {
        vals[i] = _clamp01(vals[i]);
    }
}
function _setMaterialModelAttrib(__model__: GIModel, name: string, settings_obj: object) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.attribs.query.hasModelAttrib(name)) {
        const exist_settings_str: string = __model__.attribs.query.getModelAttribValue(name) as string;
        const exist_settings_obj: object = JSON.parse(exist_settings_str);
        for (const key in Object.keys(exist_settings_obj)) {
            if (settings_obj[key] === undefined) {
                settings_obj[key] = exist_settings_obj[key];
            }
        }
    }
    const settings_str: string = JSON.stringify(settings_obj);
    __model__.attribs.add.setModelAttribValue(name, settings_str);
}
