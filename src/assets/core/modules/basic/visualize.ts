/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { Txyz, TColor, EAttribNames, EAttribDataTypeStrs, EAttribPush, TRay, TPlane, TBBox } from '@libs/geo-info/common';
import { TId, EEntType, ESort, TEntTypeIdx } from '@libs/geo-info/common';
import { isEmptyArr, getArrDepth, idsMake } from '@libs/geo-info/id';
import { checkIDs, IDcheckObj, checkArgTypes, TypeCheckObj } from '../_check_args';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { min, max } from '@assets/core/inline/_math';
import { colFalse } from '@assets/core/inline/_colors';
import { vecMult, vecAdd, vecEqual, vecSetLen, vecCross, vecNorm, vecSub } from '@assets/libs/geom/vectors';
// ================================================================================================
export enum _ESide {
    FRONT =   'front',
    BACK =   'back',
    BOTH =   'both'
}
export enum _Ecolors {
    NO_VERT_COLORS =   'none',
    VERT_COLORS =   'apply_rgb'
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
        const fn_name = 'visualize.Color';
        const ents_arr: TEntTypeIdx[] =
            checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx[];
        checkArgTypes(fn_name, 'color', color, [TypeCheckObj.isColor]);
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
            const verts_i: number[] = __model__.geom.nav.navAnyToVert(ent_type, ent_i);
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
        const fn_name = 'visualize.Gradient';
        const ents_arr: TEntTypeIdx[] =
            checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list], null) as TEntTypeIdx[];
        checkArgTypes(fn_name, 'attrib', attrib,
            [TypeCheckObj.isString, TypeCheckObj.isStringStringList, TypeCheckObj.isStringNumberList]);
        checkArgTypes(fn_name, 'range', range, [TypeCheckObj.isNull, TypeCheckObj.isNumber, TypeCheckObj.isNumberList]);
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
            EEntType.VERT, attrib_name, null, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        } else {
            const verts_i: number[] = __model__.geom.nav.navAnyToVert(ent_type, ent_i);
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
 * Visualises a ray by creating a line.
 *
 * @param __model__
 * @param rays A list of two list of three coordinates [origin, vector]: [[x,y,z],[x',y',z']]
 * @returns entities, a line representing the ray.
 * @example ray1 = virtual.visRay([[1,2,3],[0,0,1]])
 */
export function Ray(__model__: GIModel, rays: TRay|TRay[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.Ray';
    checkArgTypes(fn_name, 'ray', rays, [TypeCheckObj.isRay, TypeCheckObj.isRayList]);
    checkArgTypes(fn_name, 'scale', scale, [TypeCheckObj.isNumber]);
    // --- Error Check ---
   return idsMake(_visRay(__model__, rays, scale)) as TId[];
}
function _visRay(__model__: GIModel, rays: TRay|TRay[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(rays) === 2) {
        const ray: TRay = rays as TRay;
        const origin: Txyz = ray[0];
        const vec: Txyz = vecMult(ray[1], scale);
        const end: Txyz = vecAdd(origin, vec);
        // create orign point
        const origin_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
        // create pline
        const end_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(end_posi_i, end);
        const pline_i = __model__.geom.add.addPline([origin_posi_i, end_posi_i]);
        // create the arrow heads
        const vec_unit: Txyz = vecNorm(ray[1]);
        let vec_norm: Txyz = null;
        if (!vecEqual(vec, [0, 0, 1], 0)) {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 0, 1]), scale);
        } else {
            vec_norm = vecSetLen(vecCross(vec_unit, [1, 0, 0]), scale);
        }
        const vec_rev: Txyz = vecSetLen(vecMult(vec, -1), scale);
        const arrow_a: Txyz = vecAdd(vecAdd(end, vec_rev), vec_norm);
        const arrow_a_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(arrow_a_posi_i, arrow_a);
        const arrow_a_pline_i: number = __model__.geom.add.addPline([end_posi_i, arrow_a_posi_i]);
        const arrow_b: Txyz = vecSub(vecAdd(end, vec_rev), vec_norm);
        const arrow_b_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(arrow_b_posi_i, arrow_b);
        const arrow_b_pline_i = __model__.geom.add.addPline([end_posi_i, arrow_b_posi_i]);
        // return the geometry IDs
        return [
            [EEntType.PLINE, pline_i],
            [EEntType.PLINE, arrow_a_pline_i],
            [EEntType.PLINE, arrow_b_pline_i]
        ];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const ray of rays) {
            const ray_ents: TEntTypeIdx[] = _visRay(__model__, ray as TRay, scale);
            for (const ray_ent of ray_ents) {
                ents_arr.push(ray_ent);
            }
        }
        return ents_arr;
    }
}
// ================================================================================================
/**
 * Visualises a plane by creating a polyline and axis lines.
 *
 * @param __model__
 * @param plane A list of lists
 * @returns Entities, a polygon and two polyline representing the plane.
 * @example plane1 = virtual.visPlane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function Plane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.Plane';
    checkArgTypes(fn_name, 'planes', planes, [TypeCheckObj.isPlane]); // TODO planes can be a list // add isPlaneList to enable check
    checkArgTypes(fn_name, 'scale', scale, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    return idsMake(_visPlane(__model__, planes, scale)) as TId[];
}
function _visPlane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(planes) === 2) {
        const plane: TPlane = planes as TPlane;
        const origin: Txyz = plane[0];
        const x_vec: Txyz = vecMult(plane[1], scale);
        const y_vec: Txyz = vecMult(plane[2], scale);
        let x_end: Txyz = vecAdd(origin, x_vec);
        let y_end: Txyz = vecAdd(origin, y_vec);
        const z_end: Txyz = vecAdd(origin, vecCross(x_vec, y_vec));
        const plane_corners: Txyz[] = [
            vecAdd(x_end, y_vec),
            vecSub(y_end, x_vec),
            vecSub(vecSub(origin, x_vec), y_vec),
            vecSub(x_end, y_vec),
        ];
        x_end = vecAdd(x_end, vecMult(x_vec, 0.1));
        y_end = vecSub(y_end, vecMult(y_vec, 0.1));
        // create the point
        const origin_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
        // create the x axis
        const x_end_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(x_end_posi_i, x_end);
        const x_pline_i = __model__.geom.add.addPline([origin_posi_i, x_end_posi_i]);
        // create the y axis
        const y_end_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(y_end_posi_i, y_end);
        const y_pline_i = __model__.geom.add.addPline([origin_posi_i, y_end_posi_i]);
        // create the z axis
        const z_end_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.geom.add.addPline([origin_posi_i, z_end_posi_i]);
        // create pline for plane
        const corner_posis_i: number[] = [];
        for (const corner of plane_corners) {
            const posi_i: number = __model__.geom.add.addPosi();
            __model__.attribs.add.setPosiCoords(posi_i, corner);
            corner_posis_i.push(posi_i);
        }
        const plane_i = __model__.geom.add.addPline(corner_posis_i, true);
        // return the geometry IDs
        return [
            [EEntType.PLINE, x_pline_i],
            [EEntType.PLINE, y_pline_i],
            [EEntType.PLINE, z_pline_i],
            [EEntType.PLINE, plane_i]
        ];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const plane of planes) {
            const plane_ents: TEntTypeIdx[] = _visPlane(__model__, plane as TPlane, scale);
            for (const plane_ent of plane_ents) {
                ents_arr.push(plane_ent);
            }
        }
        return ents_arr;
    }
}
// ================================================================================================
/**
 * Visualises a bounding box by adding geometry to the model.
 *
 * @param __model__
 * @param bboxes A list of lists.
 * @returns Entities, twelve polylines representing the box.
 * @example bbox1 = virtual.viBBox(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function BBox(__model__: GIModel, bboxes: TBBox|TBBox): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.BBox';
    checkArgTypes(fn_name, 'bbox', bboxes, [TypeCheckObj.isBBox]); // TODO bboxs can be a list // add isBBoxList to enable check
    // --- Error Check ---
    return  idsMake(_visBBox(__model__, bboxes)) as TId[];
}
function _visBBox(__model__: GIModel, bboxs: TBBox|TBBox[]): TEntTypeIdx[] {
    if (getArrDepth(bboxs) === 2) {
        const bbox: TBBox = bboxs as TBBox;
        const _min: Txyz = bbox[1];
        const _max: Txyz = bbox[2];
        // bottom
        const ps0: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps0, _min);
        const ps1: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps1, [_max[0], _min[1], _min[2]]);
        const ps2: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps2, [_max[0], _max[1], _min[2]]);
        const ps3: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps3, [_min[0], _max[1], _min[2]]);
        // top
        const ps4: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps4, [_min[0], _min[1], _max[2]]);
        const ps5: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps5, [_max[0], _min[1], _max[2]]);
        const ps6: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps6, _max);
        const ps7: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(ps7, [_min[0], _max[1], _max[2]]);
        // plines bottom
        const pl0 = __model__.geom.add.addPline([ps0, ps1]);
        const pl1 = __model__.geom.add.addPline([ps1, ps2]);
        const pl2 = __model__.geom.add.addPline([ps2, ps3]);
        const pl3 = __model__.geom.add.addPline([ps3, ps0]);
        // plines top
        const pl4 = __model__.geom.add.addPline([ps4, ps5]);
        const pl5 = __model__.geom.add.addPline([ps5, ps6]);
        const pl6 = __model__.geom.add.addPline([ps6, ps7]);
        const pl7 = __model__.geom.add.addPline([ps7, ps4]);
        // plines vertical
        const pl8 = __model__.geom.add.addPline([ps0, ps4]);
        const pl9 = __model__.geom.add.addPline([ps1, ps5]);
        const pl10 = __model__.geom.add.addPline([ps2, ps6]);
        const pl11 = __model__.geom.add.addPline([ps3, ps7]);
        // return
        return [pl0, pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11].map(pl => [EEntType.PLINE, pl]) as TEntTypeIdx[];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const bbox of bboxs) {
            const bbox_ents: TEntTypeIdx[] = _visBBox(__model__, bbox as TBBox);
            for (const bbox_ent of bbox_ents) {
                ents_arr.push(bbox_ent);
            }
        }
        return ents_arr;
    }
}
