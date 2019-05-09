/**
 * The `render` module has functions for defining various settings for the 3D viewer.
 * These settings are saved as attributes at the model level.
 * These include things like creating more advanced materials.
 * For more informtion, see the threejs docs: https://threejs.org/
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { Txyz } from '@assets/libs/geo-info/common';
import * as THREE from 'three';

export enum _ESide {
    FRONT =   'front',
    BACK =   'back',
    BOTH =   'both'
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
    NO_VERT_COLOURS =   'none',
    VERT_COLOURS =   'apply_rgb'
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
    BASIC = 'MeshBasicMaterial',
    LAMBERT = 'MeshLambertMaterial',
    PHONG = 'MeshPhongMaterial',
    STANDARD = 'MeshStandardMaterial',
    PHYSICAL = 'MeshPhysicalMaterial'
}
// ================================================================================================
/**
 * Creates a glass material with an opacity setting. The material will default to a Phong material.
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
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
        color: new THREE.Color(1, 1, 1),
        emissive: new THREE.Color(0, 0, 0),
        side: THREE.DoubleSide
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}

// ================================================================================================
/**
 * Creates a Basic material and saves it in the model attributes.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)
 * ~
 * The colour pf teh material can either ignore or apply the vertex rgb colours.
 * If 'apply' id selected, then the actual colour will be a combination of the material colour
 * and the vertex colours, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material colour is set to white, then it will
 * have no effect, and the colour will be defined by the vertex [r,g,b] values.
 * ~
 * Additional material properties can be set by calling the functions for the more advanced materials.
 * These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
 * Each of these more advanced materials allows you to specify certain additional settings.
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'.
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param colour The diffuse colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colours Enum, select whether to use vertex colours if they exist.
 * @returns void
 */
export function BasicMaterial(__model__: GIModel, name: string,
            colour: Txyz,
            opacity: number,
            select_side: _ESide,
            select_vert_colours: _EColours
        ): void {
    const side: number = _convertSelectESideToNum(select_side);
    const vert_colours: number = _convertSelectEColoursToNum(select_vert_colours);
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(colour);

    const settings_obj = {
        type: _EMaterialType.BASIC,
        side: side,
        vertexColors: vert_colours,
        opacity: opacity,
        transparent: transparent,
        color: _colour(colour)
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Lambert material and saves it in the model attributes.
 * If a Basic material with the same name already exits, these settings will be added to the basic material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param emissive The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @returns void
 */
export function LambertMaterial(__model__: GIModel, name: string,
            emissive: Txyz
        ): void {
    _clampArr01(emissive);

    const settings_obj = {
        type: _EMaterialType.LAMBERT,
        emissive: _colour(emissive)
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Phong material and saves it in the model attributes.
 * If a Basic material with the same name already exits, these settings will be added to the basic material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param emissive The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param specular The specular colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param shininess The shininess, between 0 and 100.
 * @returns void
 */
export function PhongMaterial(__model__: GIModel, name: string,
            emissive: Txyz,
            specular: Txyz,
            shininess: number
        ): void {
    _clampArr01(emissive);
    _clampArr01(specular);
    shininess = Math.floor(_clamp0100(shininess));

    const settings_obj = {
        type: _EMaterialType.PHONG,
        emissive: _colour(emissive),
        specular: _colour(specular),
        shininess: shininess
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Standard material and saves it in the model attributes.
 * If a Basic material with the same name already exits, these settings will be added to the basic material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param emissive The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function StandardlMaterial(__model__: GIModel, name: string,
            emissive: Txyz,
            roughness: number,
            metalness: number
        ): void {
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);

    const settings_obj = {
        type: _EMaterialType.STANDARD,
        emissive: _colour(emissive),
        roughness: roughness,
        metalness: metalness
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Physical material and saves it in the model attributes.
 * If a Basic material with the same name already exits, these settings will be added to the basic material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 *
 * @param name The name of the material.
 * @param emissive The emissive colour, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function PhysicalMaterial(__model__: GIModel, name: string,
            emissive: Txyz,
            roughness: number,
            metalness: number,
            reflectivity: number
        ): void {
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);
    reflectivity = _clamp01(reflectivity);

    const settings_obj = {
        type: _EMaterialType.PHYSICAL,
        emissive: _colour(emissive),
        roughness: roughness,
        metalness: metalness,
        reflectivity: reflectivity
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
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
function _colour(col: Txyz): THREE.Color {
    return new THREE.Color(col[0], col[1], col[2]);
}
function _setMaterialModelAttrib(__model__: GIModel, name: string, settings_obj: object) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.attribs.query.hasModelAttrib(name)) {
        const exist_settings_str: string = __model__.attribs.query.getModelAttribValue(name) as string;
        const exist_settings_obj: object = JSON.parse(exist_settings_str);
        // check that the existing material is a Basic one
        if (exist_settings_obj['type'] !== _EMaterialType.BASIC) {
            if (settings_obj['type'] !== exist_settings_obj['type']) {
                throw new Error('Error creating material: non-basic material with this name already exists.');
            }
        }
        // copy the settings from the existing material to the new material
        for (const key of Object.keys(exist_settings_obj)) {
            if (settings_obj[key] === undefined) {
                settings_obj[key] = exist_settings_obj[key];
            }
        }
    }
    const settings_str: string = JSON.stringify(settings_obj);
    __model__.attribs.add.setModelAttribValue(name, settings_str);
}
