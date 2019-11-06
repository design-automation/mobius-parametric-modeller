/**
 * The `render` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes, materials as polygon attributes.
 * The material definitions are saved as attributes at the model level.
 * More advanced materials can be created.
 * For more informtion, see the threejs docs: https://threejs.org/
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { Txyz, TColor, EAttribNames, EAttribDataTypeStrs, TAttribDataTypes, EAttribPush } from '@libs/geo-info/common';
import * as THREE from 'three';
import { TId, EEntType, ESort, TEntTypeIdx } from '@libs/geo-info/common';
import { isEmptyArr } from '@libs/geo-info/id';
import { checkIDs, IDcheckObj, checkCommTypes, TypeCheckObj } from '../_check_args';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { min, max } from '@assets/core/inline/_math';
import { colFalse } from '@assets/core/inline/_colors';
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
function _setMaterialModelAttrib(__model__: GIModel, name: string, settings_obj: object) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.attribs.query.hasModelAttrib(name)) {
        const exist_settings_obj: object = __model__.attribs.query.getModelAttribVal(name) as object;
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
    } else {
        __model__.attribs.add.addAttrib(EEntType.MOD, name, EAttribDataTypeStrs.DICT);
    }
    // const settings_str: string = JSON.stringify(settings_obj);
    __model__.attribs.add.setModelAttribVal(name, settings_obj);
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
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * ~
 * @param entities The entities for which to set the color.
 * @param color The color, [0,0,0] is black, [1,1,1] is white.
 * @returns void
 */
export function Color(__model__: GIModel, entities: TId|TId[], color: TColor): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] =
            checkIDs('render.Color', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx[];
        checkCommTypes('render.Color', 'color', color, [TypeCheckObj.isColor]);
        // --- Error Check ---
        _color(__model__, ents_arr, color);
    }
}
function _color(__model__: GIModel, ents_arr: TEntTypeIdx[], color: TColor): void {
    if (!__model__.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // make a list of all the verts
    const all_verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        } else {
            const verts_i: number[] = __model__.geom.query.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // set all verts to have same color
    __model__.attribs.add.setAttribVal(EEntType.VERT, all_verts_i, EAttribNames.COLOR, color);
}
// ================================================================================================
/**
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * ~
 * @param entities The entities for which to set the color.
 * @param attrib
 * @param range
 * @param method Enum
 * @returns void
 */
export function Gradient(__model__: GIModel, entities: TId|TId[], attrib: string|[string, number]|[string, string],
        range: number|[number, number], method: _EColorRampMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'render.Gradient';
        const ents_arr: TEntTypeIdx[] =
            checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx[];
        checkCommTypes(fn_name, 'attrib', attrib, [TypeCheckObj.isStringStringList, TypeCheckObj.isStringNumberList]);
        checkCommTypes(fn_name, 'range', range, [TypeCheckObj.isNull, TypeCheckObj.isNumber, TypeCheckObj.isNumberList]);
        const attrib_name: string = Array.isArray(attrib) ? attrib[0] : attrib;
        const attrib_idx_or_key: number|string = Array.isArray(attrib) ? attrib[1] : null;
        if (!__model__.attribs.query.hasAttrib(ents_arr[0][0], attrib_name)) {
            throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
        } else {
            let data_type = null;
            if (attrib_idx_or_key === null) {
                data_type = __model__.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
            } else {
                const first_val = __model__.attribs.query.getAttribValAny(ents_arr[0][0], attrib_name, ents_arr[0][1], attrib_idx_or_key);
            }
            if (data_type !== EAttribDataTypeStrs.NUMBER) {
                throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                'For generating a gradient, the attribute must be a number.');
            }
        }
        // --- Error Check ---
        if (range === null) {
            range = [null, null];
        }
        range = Array.isArray(range) ? range : [0, range];
        _gradient(__model__, ents_arr, attrib_name, attrib_idx_or_key, range as [number, number], method);
    }
}
export enum _EColorRampMethod {
    FALSE_COLOR = 'false_color',
    INFRA_RED = 'infra_red',
    WHITE_TO_RED = 'white_to_red',
    GREY_SCALE = 'grey_scale',
    BLACK_BODY = 'black_body'
}
function _gradient(__model__: GIModel, ents_arr: TEntTypeIdx[], attrib_name: string, idx_or_key: number|string, range: [number, number],
        method: _EColorRampMethod): void {
    if (!__model__.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type: number = ents_arr[0][0];
    const ents_i: number[] = ents_arr.map( ent_arr => ent_arr[1] );
    // push the attrib down from the ent to its verts
    if (first_ent_type !== EEntType.VERT) {
        __model__.attribs.add.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i,
            EEntType.VERT, attrib_name, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        } else {
            const verts_i: number[] = __model__.geom.query.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values: number[] = __model__.attribs.query.getAttribVal(EEntType.VERT, attrib_name, all_verts_i) as number[];
    // if range[0] is null, get min value
    if (range[0] === null) {
        range[0] = min(vert_values);
    }
    // if range[1] is null. get max value
    if (range[1] === null) {
        range[1] = max(vert_values);
    }
    // make a values map, grouping together all the verts that have the same value
    const values_map: Map<number, [TColor, number[]]> = new Map();
    for (let i = 0; i < all_verts_i.length; i++) {
        if (!values_map.has(vert_values[i])) {
            const col: TColor = colFalse(vert_values[i], range[0], range[1]);
            values_map.set(vert_values[i], [col, [all_verts_i[i]]]);
        } else {
            values_map.get(vert_values[i])[1].push(all_verts_i[i]);
        }
    }
    // set color of each group of verts
    values_map.forEach((col_and_verts_i) => {
        const col: TColor = col_and_verts_i[0];
        const verts_i: number[] = col_and_verts_i[1];
        __model__.attribs.add.setAttribVal(EEntType.VERT, verts_i, EAttribNames.COLOR, col);
    });
}
// ================================================================================================
/**
 * Sets material by creating a polygon attribute called 'material' and setting the value.
 * The value is a sitring, which is the name of the material.
 * The properties of this material must be defined at the model level, using one of the material functions.
 * ~
 * @param entities The entities for which to set the material.
 * @param color The name of the material.
 * @returns void
 */
export function Material(__model__: GIModel, entities: TId|TId[], material: string): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const ents_arr: TEntTypeIdx[] =
            checkIDs('render.Color', 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx[];
        // --- Error Check ---
        _material(__model__, ents_arr, material);
    }
}
function _material(__model__: GIModel, ents_arr: TEntTypeIdx[], material: string): void {
    if (!__model__.attribs.query.hasAttrib(EEntType.PGON, EAttribNames.MATERIAL)) {
        __model__.attribs.add.addAttrib(EEntType.PGON, EAttribNames.MATERIAL, EAttribDataTypeStrs.STRING);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        const pgons_i: number[] = __model__.geom.query.navAnyToPgon(ent_type, ent_i);
        for (const pgon_i of pgons_i) {
            __model__.attribs.add.setAttribVal(EEntType.PGON, pgon_i, EAttribNames.MATERIAL, material);
        }
    }
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
export function GlassMaterial(__model__: GIModel, name: string, opacity: number): void {
    // --- Error Check ---
    checkCommTypes('make.GlassMaterial', 'name', name, [TypeCheckObj.isString]);
    checkCommTypes('make.GlassMaterial', 'opacity', opacity, [TypeCheckObj.isNumber01]);
    // --- Error Check ---
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
 * The color pf the material can either ignore or apply the vertex rgb colors.
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
export function BasicMaterial(__model__: GIModel, name: string,
            color: Txyz,
            opacity: number,
            select_side: _ESide,
            select_vert_colors: _Ecolors
        ): void {
    // --- Error Check ---
    checkCommTypes('make.BasicMaterial', 'name', name, [TypeCheckObj.isString]);
    checkCommTypes('make.BasicMaterial', 'color', color, [TypeCheckObj.isColor]);
    checkCommTypes('make.BasicMaterial', 'opacity', opacity, [TypeCheckObj.isNumber01]);
    // --- Error Check ---
    const side: number = _convertSelectESideToNum(select_side);
    const vert_colors: number = _convertSelectEcolorsToNum(select_vert_colors);
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(color);

    const settings_obj = {
        type: _EMaterialType.BASIC,
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
 * Creates a Lambert material and saves it in the model attributes.
 * If a Basic material with the same name already exits, these settings will be added to the basic material.
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
export function LambertMaterial(__model__: GIModel, name: string, emissive: Txyz): void {
    // --- Error Check ---
    checkCommTypes('make.LambertMaterial', 'name', name, [TypeCheckObj.isString]);
    checkCommTypes('make.LambertMaterial', 'emissive', emissive, [TypeCheckObj.isXYZlist]);
    // --- Error Check ---
    _clampArr01(emissive);
    const settings_obj = {
        type: _EMaterialType.LAMBERT,
        emissive: _getTjsColor(emissive)
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
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param specular The specular color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param shininess The shininess, between 0 and 100.
 * @returns void
 */
export function PhongMaterial(__model__: GIModel, name: string,
            emissive: Txyz,
            specular: Txyz,
            shininess: number
        ): void {
    // --- Error Check ---
    checkCommTypes('make.PhongMaterial', 'name', name, [TypeCheckObj.isString]);
    checkCommTypes('make.PhongMaterial', 'emissive', emissive, [TypeCheckObj.isXYZlist]);
    checkCommTypes('make.PhongMaterial', 'emissive', specular, [TypeCheckObj.isXYZlist]);
    checkCommTypes('make.PhongMaterial', 'shininess', shininess, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    _clampArr01(emissive);
    _clampArr01(specular);
    shininess = Math.floor(_clamp0100(shininess));

    const settings_obj = {
        type: _EMaterialType.PHONG,
        emissive: _getTjsColor(emissive),
        specular: _getTjsColor(specular),
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
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
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
    // --- Error Check ---
    checkCommTypes('make.PhongMaterial', 'name', name, [TypeCheckObj.isString]);
    checkCommTypes('make.PhongMaterial', 'emissive', emissive, [TypeCheckObj.isXYZlist]);
    checkCommTypes('make.PhongMaterial', 'roughness', roughness, [TypeCheckObj.isNumber]);
    checkCommTypes('make.PhongMaterial', 'metalness', metalness, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);

    const settings_obj = {
        type: _EMaterialType.STANDARD,
        emissive: _getTjsColor(emissive),
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
 * ~
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
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
    // --- Error Check ---
    checkCommTypes('make.PhysicalMaterial', 'name', name, [TypeCheckObj.isString]);
    checkCommTypes('make.PhysicalMaterial', 'emissive', emissive, [TypeCheckObj.isXYZlist]);
    checkCommTypes('make.PhysicalMaterial', 'roughness', roughness, [TypeCheckObj.isNumber]);
    checkCommTypes('make.PhysicalMaterial', 'metalness', metalness, [TypeCheckObj.isNumber]);
    checkCommTypes('make.PhysicalMaterial', 'reflectivity', reflectivity, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);
    reflectivity = _clamp01(reflectivity);

    const settings_obj = {
        type: _EMaterialType.PHYSICAL,
        emissive: _getTjsColor(emissive),
        roughness: roughness,
        metalness: metalness,
        reflectivity: reflectivity
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
