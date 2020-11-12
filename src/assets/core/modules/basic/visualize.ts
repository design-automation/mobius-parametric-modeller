/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 */

/**
 *
 */

import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { Txyz, TColor, EAttribNames, EAttribDataTypeStrs, EAttribPush, TRay, TPlane, TBBox } from '@libs/geo-info/common';
import { TId, EEntType, TEntTypeIdx } from '@libs/geo-info/common';
import { isEmptyArr, getArrDepth, idsMake, idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { min, max } from '@assets/core/inline/_math';
import { vecMult, vecAdd, vecSetLen, vecCross, vecNorm, vecSub, vecDot } from '@assets/libs/geom/vectors';
import * as ch from 'chroma-js';
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
    if (isEmptyArr(entities)) { return; }
    // --- Error Check ---
    const fn_name = 'visualize.Color';
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL, ID.isIDLL], null) as TEntTypeIdx[];
        }
        checkArgs(fn_name, 'color', color, [ArgCh.isColor]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    _color(__model__, ents_arr, color);
}
function _color(__model__: GIModel, ents_arr: TEntTypeIdx[], color: TColor): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // make a list of all the verts
    let all_verts_i: number[] = [];
    if (ents_arr === null) {
        all_verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.VERT);
    } else {
        for (const ent_arr of ents_arr) {
            const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
            if (ent_type === EEntType.VERT) {
                all_verts_i.push(ent_i);
            } else {
                const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const vert_i of verts_i) {
                    all_verts_i.push(vert_i);
                }
            }
        }
    }
    // set all verts to have same color
    __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, all_verts_i, EAttribNames.COLOR, color);
}
// ================================================================================================
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * ~
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
export function Gradient(__model__: GIModel, entities: TId|TId[], attrib: string|[string, number]|[string, string],
        range: number|[number, number], method: _EColorRampMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr: TEntTypeIdx[] = null;
        let attrib_name: string;
        let attrib_idx_or_key: number|string;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL, ID.isIDLL], null) as TEntTypeIdx[];
            checkArgs(fn_name, 'attrib', attrib,
                [ArgCh.isStr, ArgCh.isStrStr, ArgCh.isStrNum]);
            checkArgs(fn_name, 'range', range, [ArgCh.isNull, ArgCh.isNum, ArgCh.isNumL]);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
            if (!__model__.modeldata.attribs.query.hasEntAttrib(ents_arr[0][0], attrib_name)) {
                throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
            } else {
                let data_type = null;
                if (attrib_idx_or_key === null) {
                    data_type = __model__.modeldata.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
                } else {
                    const first_val = __model__.modeldata.attribs.get.getEntAttribValOrItem(
                        ents_arr[0][0], ents_arr[0][1], attrib_name, attrib_idx_or_key);
                }
                if (data_type !== EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                    'For generating a gradient, the attribute must be a number.');
                }
            }
        } else {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
        }
        // --- Error Check ---
        if (range === null) {
            range = [null, null];
        }
        range = Array.isArray(range) ? range : [0, range];
        _gradient(__model__, ents_arr, attrib_name, attrib_idx_or_key, range as [number, number], method);
    }
}
// https://codesandbox.io/s/5w573r54w4
export enum _EColorRampMethod {
    FALSE_COLOR = 'false_color',
    BLACK_BODY = 'black_body',
    WHITE_RED = 'white_red',
    WHITE_GREEN = 'white_green',
    WHITE_BLUE = 'white_blue',
    BLUE_RED = 'blue_red',
    GREEN_RED = 'green_red',
    BLUE_GREEN = 'blue_green',
    GREY_SCALE = 'grey_scale',
    ORRD= 'OrRd',
    PUBU= 'PuBu',
    BUPU= 'BuPu',
    ORANGES= 'Oranges',
    BUGN= 'BuGn',
    YLORBR= 'YlOrBr',
    YLGN= 'YlGn',
    REDS= 'Reds',
    RDPU= 'RdPu',
    GREENS= 'Greens',
    YLGNBU= 'YlGnBu',
    PURPLES= 'Purples',
    GNBU= 'GnBu',
    GREYS= 'Greys',
    YLORRD= 'YlOrRd',
    PURD= 'PuRd',
    BLUES= 'Blues',
    PUBUGN= 'PuBuGn',
    VIRIDIS= 'Viridis',
    SPECTRAL= 'Spectral',
    RDYLGN= 'RdYlGn',
    RDBU= 'RdBu',
    PIYG= 'PiYG',
    PRGN= 'PRGn',
    RDYLBU= 'RdYlBu',
    BRBG= 'BrBG',
    RDGY= 'RdGy',
    PUOR= 'PuOr',
    SET2= 'Set2',
    ACCENT= 'Accent',
    SET1= 'Set1',
    SET3= 'Set3',
    DARK2= 'Dark2',
    PAIRED= 'Paired',
    PASTEL2= 'Pastel2',
    PASTEL1= 'Pastel1',
}
function _gradient(__model__: GIModel, ents_arr: TEntTypeIdx[], attrib_name: string, idx_or_key: number|string, range: [number, number],
        method: _EColorRampMethod): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type: number = ents_arr[0][0];
    const ents_i: number[] = ents_arr.map( ent_arr => ent_arr[1] );
    // push the attrib down from the ent to its verts
    if (first_ent_type !== EEntType.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i,
            EEntType.VERT, attrib_name, null, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        } else {
            const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values: number[] = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.VERT, all_verts_i, attrib_name) as number[];
    // if range[0] is null, get min value
    if (range[0] === null) {
        range[0] = min(vert_values);
    }
    // if range[1] is null. get max value
    if (range[1] === null) {
        range[1] = max(vert_values);
    }
    // create color scale
    const scales = {
        'false_color': ['blue', 'cyan', 'green', 'yellow', 'red'],
        'black_body': ['black', 'red', 'yellow', 'white'],
        'white_red': ['white', 'red'],
        'white_blue': ['white', 'blue'],
        'white_green': ['white', 'green'],
        'blue_red': ['blue', 'red'],
        'green_red': ['green', 'red'],
        'blue_green': ['blue', 'green'],
        'grey_scale': ['white', 'black']
    };
    let scale: any = null;
    if (method in scales) {
        scale = scales[method];
    } else {
        scale = method;
    }
    const col_scale = ch.scale(scale);
    const col_domain  = col_scale.domain(range);

    // make a values map, grouping together all the verts that have the same value
    const values_map: Map<number, [TColor, number[]]> = new Map();
    for (let i = 0; i < all_verts_i.length; i++) {
        if (!values_map.has(vert_values[i])) {
            // const col: TColor = colFalse(vert_values[i], range[0], range[1]);
            const ch_col = col_domain(vert_values[i]).gl();
            const col: TColor = [ch_col[0], ch_col[1], ch_col[2]];
            values_map.set(vert_values[i], [col, [all_verts_i[i]]]);
        } else {
            values_map.get(vert_values[i])[1].push(all_verts_i[i]);
        }
    }
    // set color of each group of verts
    values_map.forEach((col_and_verts_i) => {
        const col: TColor = col_and_verts_i[0];
        const verts_i: number[] = col_and_verts_i[1];
        __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, verts_i, EAttribNames.COLOR, col);
    });
}
// ================================================================================================
export enum _EEdgeMethod {
    VISIBLE = 'visible',
    HIDDEN = 'hidden'
}

/**
 * Controls how edges are visualized by setting the visibility of the edge.
 * ~
 * The method can either be 'visible' or 'hidden'.
 * 'visible' means that an edge line will be visible.
 * 'hidden' means that no edge lines will be visible.
 * ~
 * @param entities A list of edges, or other entities from which edges can be extracted.
 * @param method Enum, visible or hidden.
 * @returns void
 */
export function Edge(__model__: GIModel, entities: TId|TId[], method: _EEdgeMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return; }
    // --- Error Check ---
    const fn_name = 'visualize.Edge';
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL], null) as TEntTypeIdx[];
        }
    } else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, EAttribNames.VISIBILITY)) {
        if (method === _EEdgeMethod.VISIBLE) {
            return;
        } else {
            __model__.modeldata.attribs.add.addAttrib(EEntType.EDGE, EAttribNames.VISIBILITY, EAttribDataTypeStrs.STRING);
        }
    }
    // Get the unique edges
    let edges_i: number[] = [];
    if (ents_arr !== null) {
        const set_edges_i: Set<number> = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.EDGE) {
                set_edges_i.add(ent_i);
            } else {
                const ent_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
                for (const ent_edge_i of ent_edges_i) {
                    set_edges_i.add(ent_edge_i);
                }
            }
        }
        edges_i = Array.from(set_edges_i);
    } else {
        edges_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.EDGE);
    }
    // Set edge visibility
    const setting: string = method === _EEdgeMethod.VISIBLE ? null : 'hidden';
    __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.EDGE, edges_i, EAttribNames.VISIBILITY, setting);
}
// ================================================================================================
export enum _EMeshMethod {
    FACETED = 'faceted',
    SMOOTH = 'smooth'
}
/**
 * Controls how polygon meshes are visualized by creating normals on vertices.
 * ~
 * The method can either be 'faceted' or 'smooth'.
 * 'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
 * 'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.
 * ~
 * @param entities Vertices belonging to polygons, or entities from which polygon vertices can be extracted.
 * @param method Enum, the types of normals to create, faceted or smooth.
 * @returns void
 */
export function Mesh(__model__: GIModel, entities: TId|TId[], method: _EMeshMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return; }
    // --- Error Check ---
    const fn_name = 'visualize.Mesh';
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL], null) as TEntTypeIdx[];
        }
    } else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // Get the unique verts that belong to pgons
    let verts_i: number[] = [];
    if (ents_arr !== null) {
        const set_verts_i: Set<number> = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.VERT) {
                if (__model__.modeldata.geom.query.getTopoObjType(EEntType.VERT, ent_i) === EEntType.PGON) {
                    set_verts_i.add(ent_i);
                }
            } else if (ent_type === EEntType.POINT) {
                 // skip
            } else if (ent_type === EEntType.PLINE) {
                // skip
            } else if (ent_type === EEntType.PGON) {
                const ent_verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    set_verts_i.add(ent_vert_i);
                }
            } else if (ent_type === EEntType.COLL) {
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    const ent_verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, coll_pgon_i);
                    for (const ent_vert_i of ent_verts_i) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }  else {
                const ent_verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    if (__model__.modeldata.geom.query.getTopoObjType(EEntType.VERT, ent_vert_i) === EEntType.PGON) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
        }
        verts_i = Array.from(set_verts_i);
    } else {
        verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.VERT);
    }
    // calc vertex normals and set edge visibility
    switch (method) {
        case _EMeshMethod.FACETED:
            _meshFaceted(__model__, verts_i);
            break;
        case _EMeshMethod.SMOOTH:
            _meshSmooth(__model__, verts_i);
            break;
        default:
            break;
    }
}
function _meshFaceted(__model__: GIModel, verts_i: number[]): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.NORMAL, EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_vert_pgons: Map<number, number> = new Map();
    const set_pgons_i: Set<number> = new Set();
    for (const vert_i of verts_i) {
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i); // TODO optimize
        if (pgons_i.length === 1) { // one polygon
            map_vert_pgons.set(vert_i, pgons_i[0]);
            set_pgons_i.add(pgons_i[0]);
        }
    }
    // calc the normals one time
    const normals: Txyz[] = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal: Txyz = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set the normal
    map_vert_pgons.forEach( (pgon_i, vert_i) => {
        const normal: Txyz = normals[pgon_i];
        __model__.modeldata.attribs.set.setEntAttribVal(EEntType.VERT, vert_i, EAttribNames.NORMAL, normal);
    });
}
function _meshSmooth(__model__: GIModel, verts_i: number[]): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.NORMAL, EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_posi_pgons: Map<number, number[]> = new Map();
    const set_pgons_i: Set<number> = new Set();
    const vert_to_posi: number[] = [];
    for (const vert_i of verts_i) {
        const posi_i: number = __model__.modeldata.geom.nav.navVertToPosi(vert_i);
        vert_to_posi[vert_i] = posi_i;
        if (!map_posi_pgons.has(posi_i)) {
            const posi_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i);
            map_posi_pgons.set(posi_i, posi_pgons_i);
            for (const posi_pgon_i of posi_pgons_i) {
                set_pgons_i.add(posi_pgon_i);
            }
        }
    }
    // calc all normals one time
    const normals: Txyz[] = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal: Txyz = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set normals on all verts
    for (const vert_i of verts_i) {
        const posi_i: number = vert_to_posi[vert_i];
        let normal: Txyz = [0, 0, 0];
        const posi_pgons_i: number[] = map_posi_pgons.get(posi_i);
        for (const posi_pgon_i of posi_pgons_i) {
            normal = [
                normal[0] + normals[posi_pgon_i][0],
                normal[1] + normals[posi_pgon_i][1],
                normal[2] + normals[posi_pgon_i][2]
            ];
        }
        const div: number = posi_pgons_i.length;
        normal = [normal[0] / div, normal[1] / div, normal[2] / div];
        normal = vecNorm(normal);
        __model__.modeldata.attribs.set.setEntAttribVal(EEntType.VERT, vert_i, EAttribNames.NORMAL, normal);
    }
}
// ================================================================================================
/**
 * Visualises a ray or a list of rays by creating a polyline with an arrow head.
 *
 * @param __model__
 * @param rays Polylines representing the ray or rays.
 * @param scale Scales the arrow head of the vector.
 * @returns entities, a line with an arrow head representing the ray.
 * @example ray1 = visualize.Ray([[1,2,3],[0,0,1]])
 */
export function Ray(__model__: GIModel, rays: TRay|TRay[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.Ray';
    if (__model__.debug) {
        checkArgs(fn_name, 'ray', rays, [ArgCh.isRay, ArgCh.isRayL]);
        checkArgs(fn_name, 'scale', scale, [ArgCh.isNum]);
    }
    // --- Error Check ---
   return idsMake(_visRay(__model__, rays, scale)) as TId[];
}
function _visRay(__model__: GIModel, rays: TRay|TRay[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(rays) === 2) {
        const ray: TRay = rays as TRay;
        const origin: Txyz = ray[0];
        const vec: Txyz = ray[1]; // vecMult(ray[1], scale);
        const end: Txyz = vecAdd(origin, vec);
        // create orign point
        const origin_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create pline
        const end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(end_posi_i, end);
        const pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, end_posi_i]);
        // create the arrow heads
        const vec_unit: Txyz = vecNorm(ray[1]);
        const head_scale = scale;
        let vec_norm: Txyz = null;
        if (vecDot([0, 0, 1], vec)) {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 1, 0]), head_scale);
        } else {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 0, 1]), head_scale);
        }
        const vec_rev: Txyz = vecSetLen(vecMult(vec, -1), head_scale);
        const arrow_a: Txyz = vecAdd(vecAdd(end, vec_rev), vec_norm);
        const arrow_a_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_a_posi_i, arrow_a);
        const arrow_a_pline_i: number = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_a_posi_i]);
        const arrow_b: Txyz = vecSub(vecAdd(end, vec_rev), vec_norm);
        const arrow_b_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_b_posi_i, arrow_b);
        const arrow_b_pline_i = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_b_posi_i]);
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
 * Visualises a plane or a list of planes by creating polylines.
 *
 * @param __model__
 * @param plane A plane or a list of planes.
 * @returns Entities, a square plane polyline and three axis polyline.
 * @example plane1 = visualize.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function Plane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.Plane';
    if (__model__.debug) {
        checkArgs(fn_name, 'planes', planes,
            [ArgCh.isPln, ArgCh.isPlnL]);
        checkArgs(fn_name, 'scale', scale, [ArgCh.isNum]);
    }
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
        const z_end: Txyz = vecAdd(origin, vecSetLen(vecCross(x_vec, y_vec), scale) );
        const plane_corners: Txyz[] = [
            vecAdd(x_end, y_vec),
            vecSub(y_end, x_vec),
            vecSub(vecSub(origin, x_vec), y_vec),
            vecSub(x_end, y_vec),
        ];
        x_end = vecAdd(x_end, vecMult(x_vec, 0.1));
        y_end = vecSub(y_end, vecMult(y_vec, 0.1));
        // create the point
        const origin_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create the x axis
        const x_end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(x_end_posi_i, x_end);
        const x_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, x_end_posi_i]);
        // create the y axis
        const y_end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(y_end_posi_i, y_end);
        const y_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, y_end_posi_i]);
        // create the z axis
        const z_end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, z_end_posi_i]);
        // create pline for plane
        const corner_posis_i: number[] = [];
        for (const corner of plane_corners) {
            const posi_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, corner);
            corner_posis_i.push(posi_i);
        }
        const plane_i = __model__.modeldata.geom.add.addPline(corner_posis_i, true);
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
    if (__model__.debug) {
        checkArgs(fn_name, 'bbox', bboxes, [ArgCh.isBBox]); // TODO bboxs can be a list // add isBBoxList to enable check
    }
    // --- Error Check ---
    return  idsMake(_visBBox(__model__, bboxes)) as TId[];
}
function _visBBox(__model__: GIModel, bboxs: TBBox|TBBox[]): TEntTypeIdx[] {
    if (getArrDepth(bboxs) === 2) {
        const bbox: TBBox = bboxs as TBBox;
        const _min: Txyz = bbox[1];
        const _max: Txyz = bbox[2];
        // bottom
        const ps0: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps0, _min);
        const ps1: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps1, [_max[0], _min[1], _min[2]]);
        const ps2: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps2, [_max[0], _max[1], _min[2]]);
        const ps3: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps3, [_min[0], _max[1], _min[2]]);
        // top
        const ps4: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps4, [_min[0], _min[1], _max[2]]);
        const ps5: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps5, [_max[0], _min[1], _max[2]]);
        const ps6: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps6, _max);
        const ps7: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps7, [_min[0], _max[1], _max[2]]);
        // plines bottom
        const pl0 = __model__.modeldata.geom.add.addPline([ps0, ps1]);
        const pl1 = __model__.modeldata.geom.add.addPline([ps1, ps2]);
        const pl2 = __model__.modeldata.geom.add.addPline([ps2, ps3]);
        const pl3 = __model__.modeldata.geom.add.addPline([ps3, ps0]);
        // plines top
        const pl4 = __model__.modeldata.geom.add.addPline([ps4, ps5]);
        const pl5 = __model__.modeldata.geom.add.addPline([ps5, ps6]);
        const pl6 = __model__.modeldata.geom.add.addPline([ps6, ps7]);
        const pl7 = __model__.modeldata.geom.add.addPline([ps7, ps4]);
        // plines vertical
        const pl8 = __model__.modeldata.geom.add.addPline([ps0, ps4]);
        const pl9 = __model__.modeldata.geom.add.addPline([ps1, ps5]);
        const pl10 = __model__.modeldata.geom.add.addPline([ps2, ps6]);
        const pl11 = __model__.modeldata.geom.add.addPline([ps3, ps7]);
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
