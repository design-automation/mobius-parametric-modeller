/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { Txyz, EAttribNames, EAttribDataTypeStrs } from '@libs/geo-info/common';
import * as THREE from 'three';
import { TId, EEntType, TEntTypeIdx } from '@libs/geo-info/common';
import { isEmptyArr, idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { arrMakeFlat } from '@assets/libs/util/arrs';

// ================================================================================================
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
export enum _Ecolors {
    NO_VERT_COLORS =   'none',
    VERT_COLORS =   'apply_rgb'
}
function _convertSelectEcolorsToNum(select: _Ecolors): number {
    switch (select) {
        case _Ecolors.NO_VERT_COLORS:
            return THREE.NoColors;
        default:
            return THREE.VertexColors;
    }
}
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
function _getTjsColor(col: Txyz): THREE.Color {
    return new THREE.Color(col[0], col[1], col[2]);
}
enum _ELineMaterialType {
    BASIC = 'LineBasicMaterial',
    DASHED = 'LineDashedMaterial'
}
enum _EMeshMaterialType {
    BASIC = 'MeshBasicMaterial',
    LAMBERT = 'MeshLambertMaterial',
    PHONG = 'MeshPhongMaterial',
    STANDARD = 'MeshStandardMaterial',
    PHYSICAL = 'MeshPhysicalMaterial'
}
function _setMaterialModelAttrib(__model__: GIModel, name: string, settings_obj: object) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.modeldata.attribs.query.hasModelAttrib(name)) {
        const exist_settings_obj: object = __model__.modeldata.attribs.get.getModelAttribVal(name) as object;
        // check that the existing material is a Basic one
        if (exist_settings_obj['type'] !== _EMeshMaterialType.BASIC) {
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
    } else {
        __model__.modeldata.attribs.add.addAttrib(EEntType.MOD, name, EAttribDataTypeStrs.DICT);
    }
    // const settings_str: string = JSON.stringify(settings_obj);
    __model__.modeldata.attribs.set.setModelAttribVal(name, settings_obj);
}
// ================================================================================================
/**
 * Sets material by creating a polygon attribute called 'material' and setting the value.
 * The value is a sitring, which is the name of the material.
 * The properties of this material must be defined at the model level, using one of the material functions.
 * ~
 * @param entities The entities for which to set the material.
 * @param material The name of the material.
 * @returns void
 */
export function Set(__model__: GIModel, entities: TId|TId[], material: string|string[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'matrial.Set';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL, ID.isIDLL], null) as TEntTypeIdx[];
            checkArgs(fn_name, 'material', material, [ArgCh.isStr, ArgCh.isStrL]);
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        let material_dict: object;
        let is_list = false;
        if (Array.isArray(material)) {
            is_list = true;
            material_dict = __model__.modeldata.attribs.get.getModelAttribVal(material[0] as string) as object;
        } else {
            material_dict = __model__.modeldata.attribs.get.getModelAttribVal(material as string) as object;
        }
        if (!material_dict) {
            throw new Error('Material does not exist: ' + material);
        }
        const material_type = material_dict['type'];
        if (material_type === undefined) {
            throw new Error('Material is not valid: ' + material_dict);
        }
        if (material_type === _ELineMaterialType.BASIC || material_type === _ELineMaterialType.DASHED) {
            if (is_list) {
                throw new Error('A line can only have a single material: ' + material_dict);
            }
            _lineMaterial(__model__, ents_arr, material as string);
        } else {
            if (is_list) {
                if (material.length > 2) {
                    throw new Error('A maximum of materials can be specified, for the front and back of the polygon : ' + material);
                }
            } else {
                material = [material as string];
            }
            _meshMaterial(__model__, ents_arr, material as string[]);
        }
    }
}
function _lineMaterial(__model__: GIModel, ents_arr: TEntTypeIdx[], material: string): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.PLINE, EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.PLINE, EAttribNames.MATERIAL, EAttribDataTypeStrs.STRING);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        const plines_i: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        for (const pline_i of plines_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.MATERIAL, material);
        }
    }
}
function _meshMaterial(__model__: GIModel, ents_arr: TEntTypeIdx[], material: string[]): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.PGON, EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.PGON, EAttribNames.MATERIAL, EAttribDataTypeStrs.LIST);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        for (const pgon_i of pgons_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.MATERIAL, material);
        }
    }
}
// ================================================================================================
/**
 * Creates a line material and saves it in the model attributes.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)
 * ~
 * The color of the material can either ignore or apply the vertex rgb colors.
 * If 'apply' id selected, then the actual color will be a combination of the material color
 * and the vertex colors, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material color is set to white, then it will
 * have no effect, and the color will be defined by the vertex [r,g,b] values.
 * ~
 * In order to assign a material to polylines in the model, a polyline attribute called 'material'.
 * will be created. The value for each polyline must either be null, or must be a material name.
 * ~
 * For dashed lines, the 'dash_gap_scale' parameter can be set.
 * - If 'dash_gap_scale' is null will result in a continouse line.
 * - If 'dash_gap_scale' is a single number: dash = gap = dash_gap_scale, scale = 1.
 * - If 'dash_gap_scale' is a list of two numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = 1.
 * - If 'dash_gap_scale' is a list of three numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = dash_gap_scale[2].
 * ~
 * Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
 * line widths cannot be rendered. As a result, lines width will always be set to 1.
 * ~
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param dash_gap_scale Size of the dash and gap, and a scale factor. (The gap and scale are optional.)
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist.
 * @returns void
 */
export function LineMat(__model__: GIModel, name: string,
            color: Txyz,
            dash_gap_scale: number|number[],
            select_vert_colors: _Ecolors
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.LineMat';
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'color', color, [ArgCh.isColor]);
        checkArgs(fn_name, 'dash_gap_scale', dash_gap_scale, [ArgCh.isNull, ArgCh.isNum, ArgCh.isNumL]);
    }
    // --- Error Check ---
    const vert_colors: number = _convertSelectEcolorsToNum(select_vert_colors);
    _clampArr01(color);

    let settings_obj: object;
    if (dash_gap_scale === null) {
        settings_obj = {
            // type: _ELineMaterialType.BASIC,
            // color: _getTjsColor(color),
            // vertexColors: vert_colors
            type: _ELineMaterialType.DASHED,
            color: _getTjsColor(color),
            vertexColors: vert_colors,
            dashSize: 0,
            gapSize: 0,
            scale: 1
        };
    } else {
        dash_gap_scale = Array.isArray(dash_gap_scale) ? dash_gap_scale : [dash_gap_scale];
        const dash = dash_gap_scale[0] === undefined ? 0 : dash_gap_scale[0];
        const gap = dash_gap_scale[1] === undefined ? dash : dash_gap_scale[1];
        const scale = dash_gap_scale[2] === undefined ? 1 : dash_gap_scale[2];
        settings_obj = {
            type: _ELineMaterialType.DASHED,
            color: _getTjsColor(color),
            vertexColors: vert_colors,
            dashSize: dash,
            gapSize: gap,
            scale: scale
        };
    }
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a basic mesh material and saves it in the model attributes.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)
 * ~
 * The color of the material can either ignore or apply the vertex rgb colors.
 * If 'apply' id selected, then the actual color will be a combination of the material color
 * and the vertex colors, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material color is set to white, then it will
 * have no effect, and the color will be defined by the vertex [r,g,b] values.
 * ~
 * Additional material properties can be set by calling the functions for the more advanced materials.
 * These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
 * Each of these more advanced materials allows you to specify certain additional settings.
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'.
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * ~
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist.
 * @returns void
 */
export function MeshMat(__model__: GIModel, name: string,
            color: Txyz,
            opacity: number,
            select_side: _ESide,
            select_vert_colors: _Ecolors
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.MeshMat';
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'color', color, [ArgCh.isColor]);
        checkArgs(fn_name, 'opacity', opacity, [ArgCh.isNum01]);
    }
    // --- Error Check ---
    const side: number = _convertSelectESideToNum(select_side);
    const vert_colors: number = _convertSelectEcolorsToNum(select_vert_colors);
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(color);

    const settings_obj = {
        type: _EMeshMaterialType.BASIC,
        side: side,
        vertexColors: vert_colors,
        opacity: opacity,
        transparent: transparent,
        color: _getTjsColor(color)
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a glass material with an opacity setting. The material will default to a Phong material.
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * ~
 * @param name The name of the material.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @returns void
 */
export function Glass(__model__: GIModel, name: string, opacity: number): void {
    // --- Error Check ---
    const fn_name = 'material.Glass';
    if (__model__.debug) {
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'opacity', opacity, [ArgCh.isNum01]);
    }
    // --- Error Check ---
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    const settings_obj = {
        type: _EMeshMaterialType.PHONG,
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
 * Creates a Lambert material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @returns void
 */
export function Lambert(__model__: GIModel, name: string, emissive: Txyz): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Lambert';
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'emissive', emissive, [ArgCh.isXYZ]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    const settings_obj = {
        type: _EMeshMaterialType.LAMBERT,
        emissive: _getTjsColor(emissive)
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Phong material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param specular The specular color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param shininess The shininess, between 0 and 100.
 * @returns void
 */
export function Phong(__model__: GIModel, name: string,
            emissive: Txyz,
            specular: Txyz,
            shininess: number
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Phong';
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'emissive', emissive, [ArgCh.isXYZ]);
        checkArgs(fn_name, 'emissive', specular, [ArgCh.isXYZ]);
        checkArgs(fn_name, 'shininess', shininess, [ArgCh.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    _clampArr01(specular);
    shininess = Math.floor(_clamp0100(shininess));

    const settings_obj = {
        type: _EMeshMaterialType.PHONG,
        emissive: _getTjsColor(emissive),
        specular: _getTjsColor(specular),
        shininess: shininess
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Standard material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function Standard(__model__: GIModel, name: string,
            emissive: Txyz,
            roughness: number,
            metalness: number
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Standard';
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'emissive', emissive, [ArgCh.isXYZ]);
        checkArgs(fn_name, 'roughness', roughness, [ArgCh.isNum]);
        checkArgs(fn_name, 'metalness', metalness, [ArgCh.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);

    const settings_obj = {
        type: _EMeshMaterialType.STANDARD,
        emissive: _getTjsColor(emissive),
        roughness: roughness,
        metalness: metalness
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Physical material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * ~
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
 * ~
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function Physical(__model__: GIModel, name: string,
            emissive: Txyz,
            roughness: number,
            metalness: number,
            reflectivity: number
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Physical';
        checkArgs(fn_name, 'name', name, [ArgCh.isStr]);
        checkArgs(fn_name, 'emissive', emissive, [ArgCh.isXYZ]);
        checkArgs(fn_name, 'roughness', roughness, [ArgCh.isNum]);
        checkArgs(fn_name, 'metalness', metalness, [ArgCh.isNum]);
        checkArgs(fn_name, 'reflectivity', reflectivity, [ArgCh.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);
    reflectivity = _clamp01(reflectivity);

    const settings_obj = {
        type: _EMeshMaterialType.PHYSICAL,
        emissive: _getTjsColor(emissive),
        roughness: roughness,
        metalness: metalness,
        reflectivity: reflectivity
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
