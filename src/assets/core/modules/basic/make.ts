/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribNames, TId, EEntType, Txyz, TEntTypeIdx, TPlane } from '@libs/geo-info/common';
import { isDim0, isDim2, isColl,
    isEdge, isFace, idsMake, idIndicies, getArrDepth, isEmptyArr, isWire, idsBreak } from '@libs/geo-info/id';
// import { __merge__} from '../_model';
// import { _model } from '..';
import { vecDiv, vecMult, interpByNum, interpByLen, vecAdd, vecFromTo, vecCross } from '@libs/geom/vectors';
import { distance } from '@libs/geom/distance';
import { arrMakeFlat } from '@libs/util/arrs';
import { getPlanesSeq, _copyGeom, _copyGeomPosis } from './_common';
import { xfromSourceTargetMatrix, multMatrix } from '@assets/libs/geom/matrix';
import { Matrix4 } from 'three';
import { listZip } from '@assets/core/inline/_list';
import * as THREE from 'three';

// Divide edge modelling operation
export enum _EDivisorMethod {
    BY_NUMBER =  'by_number',
    BY_LENGTH  =  'by_length',
    BY_MAX_LENGTH  =  'by_max_length',
    BY_MIN_LENGTH  =  'by_min_length'
}
export enum _EExtrudeMethod {
    QUADS =  'quads',
    STRINGERS = 'stringers',
    RIBS = 'ribs',
    COPIES = 'copies'
}
// ================================================================================================
/**
 * Adds one or more new position to the model.
 *
 * @param __model__
 * @param coords A list of three numbers, or a list of lists of three numbers.
 * @returns A new position, or nested list of new positions.
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])
 * @example_info Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
 * @example_link make.Position.mob&node=1
 */
export function Position(__model__: GIModel, coords: Txyz|Txyz[]|Txyz[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(coords)) { return []; }
    // --- Error Check ---
    if (__model__.debug) {
        checkArgs('make.Position', 'coords', coords, [ArgCh.isXYZ, ArgCh.isXYZL, ArgCh.isXYZLL]);
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = _position(__model__, coords);
    return idsMake(new_ents_arr);
}
function _position(__model__: GIModel, coords: Txyz|Txyz[]|Txyz[][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    const depth: number = getArrDepth(coords);
    if (depth === 1) {
        const coord1: Txyz = coords as Txyz;
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.add.setEntAttribVal(EEntType.POSI, posi_i, EAttribNames.COORDS, coord1);
        return [EEntType.POSI, posi_i] as TEntTypeIdx;
    } else if (depth === 2) {
        const coords2: Txyz[] = coords as Txyz[];
        return coords2.map(coord => _position(__model__, coord)) as TEntTypeIdx[];
    } else {
        const coords3: Txyz[][] = coords as Txyz[][];
        return coords3.map(coord2 => _position(__model__, coord2)) as TEntTypeIdx[][];
    }
}
// ================================================================================================
/**
 * Adds one or more new points to the model.
 *
 * @param __model__
 * @param entities Position, or list of positions, or entities from which positions can be extracted.
 * @returns Entities, new point or a list of new points.
 * @example point1 = make.Point(position1)
 * @example_info Creates a point at position1.
 * @example_link make.Point.mob&node=1
 */
export function Point(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Point', 'entities', entities,
        [ID.isID, ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        // ents_arr = splitIDs('make.Point', 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list],
        // [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        // EEntType.FACE, EEntType.POINT, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] =  _point(__model__, ents_arr);
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
function _point(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx; // either a posi or something else
        if (ent_type === EEntType.POSI) {
            const point_i: number = __model__.modeldata.geom.add.addPoint(index);
            return [EEntType.POINT, point_i] as TEntTypeIdx;
        } else {
            const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            return posis_i.map(posi_i => _point(__model__, [EEntType.POSI, posi_i])) as TEntTypeIdx[];
        }
    } else if (depth === 2) {
        ents_arr = ents_arr as TEntTypeIdx[];
        return ents_arr.map(ents_arr_item => _point(__model__, ents_arr_item)) as TEntTypeIdx[];
    } else { // depth > 2
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _point(__model__, ents_arr_item)) as TEntTypeIdx[][];
    }
}
// ================================================================================================
/**
 * Adds one or more new polylines to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, 'open' or 'close'.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 * @example_link make.Polyline.mob&node=1
 */
export function Polyline(__model__: GIModel, entities: TId|TId[]|TId[][], close: _EClose): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Polyline', 'entities', entities,
        [ID.isID, ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        // ents_arr = splitIDs('make.Polyline', 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists],
        // [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        // EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const posis_arrs: TEntTypeIdx[][] = _getPlinePosisFromEnts(__model__, ents_arr);
    const new_ents_arr: TEntTypeIdx[] = _polyline(__model__, posis_arrs, close) as  TEntTypeIdx[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
        const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
        return idsMake(first_ent) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
// Enums for Polyline()
export enum _EClose {
    OPEN = 'open',
    CLOSE = 'close'
}
function _polyline(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][], close: _EClose): TEntTypeIdx|TEntTypeIdx[] {
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        if (ents_arr.length < 2) {
            throw new Error('Error in make.Polyline: Polylines must have at least two positions.');
        }
        const bool_close: boolean = (close === _EClose.CLOSE);
        const posis_i: number[] = idIndicies(ents_arr as TEntTypeIdx[]);
        const pline_i: number = __model__.modeldata.geom.add.addPline(posis_i, bool_close);
        return [EEntType.PLINE, pline_i] as TEntTypeIdx;
    } else {
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _polyline(__model__, ents_arr_item, close)) as TEntTypeIdx[];
    }
}
function _getPlinePosisFromEnts(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[][] {
    // check if this is a single object ID
    if (getArrDepth(ents_arr) === 1) {
        ents_arr =  [ents_arr] as TEntTypeIdx[];
    }
    // check if this is a list of posis, verts, or points
    if (getArrDepth(ents_arr) === 2 && isDim0(ents_arr[0][0])) {
        const ents_arr2: TEntTypeIdx[] = [];
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            if (ent_type === EEntType.POSI) {
                ents_arr2.push(ent_arr as TEntTypeIdx);
            } else {
                const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                for (const posi_i of posis_i) {
                    ents_arr2.push([EEntType.POSI, posi_i]);
                }
            }
        }
        ents_arr = [ents_arr2] as TEntTypeIdx[][];
    }
    // now process the ents
    const posis_arrs: TEntTypeIdx[][] = [];
    for (const ent_arr of ents_arr) {
        if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
            posis_arrs.push(ent_arr as TEntTypeIdx[]);
            continue;
        }
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        switch (ent_type) {
            case EEntType.EDGE:
            case EEntType.WIRE:
            case EEntType.PLINE:
                const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                const posis_arr: TEntTypeIdx[] = posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                posis_arrs.push( posis_arr );
                break;
            case EEntType.FACE:
            case EEntType.PGON:
                const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
                for (let j = 0; j < wires_i.length; j++) {
                    const wire_i: number = wires_i[j];
                    const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                    const wire_posis_arr: TEntTypeIdx[] = wire_posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                    posis_arrs.push( wire_posis_arr );
                }
                break;
            default:
                break;
        }
    }
    return posis_arrs;
}
// ================================================================================================
/**
 * Adds one or more new polygons to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, new polygon, or a list of new polygons.
 * @example polygon1 = make.Polygon([pos1,pos2,pos3])
 * @example_info Creates a polygon with vertices pos1, pos2, pos3 in sequence.
 * @example polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])
 * @example_info Creates two polygons, the first with vertices at [pos1,pos2,pos3], and the second with vertices at [pos3,pos4,pos5].
 * @example_link make.Polygon.mob&node=1
 */
export function Polygon(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Polygon', 'entities', entities,
        [ID.isID, ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        // ents_arr = splitIDs('make.Polygon', 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists],
        // [EEntType.POSI, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const posis_arrs: TEntTypeIdx[][] = _getPgonPosisFromEnts(__model__, ents_arr);
    const new_ents_arr: TEntTypeIdx[] = _polygon(__model__, posis_arrs) as TEntTypeIdx[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
        const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
        return idsMake(first_ent) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
function _polygon(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        if (ents_arr.length < 3) {
            throw new Error('Error in make.Polygon: Polygons must have at least three positions.');
        }
        const posis_i: number[] = idIndicies(ents_arr as TEntTypeIdx[]);
        const pgon_i: number = __model__.modeldata.geom.add.addPgon(posis_i);
        return [EEntType.PGON, pgon_i] as TEntTypeIdx;
    } else {
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _polygon(__model__, ents_arr_item)) as TEntTypeIdx[];
    }
}
function _getPgonPosisFromEnts(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[][] {
    // check if this is a single object ID
    if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // check if this is a list of posis
    if (getArrDepth(ents_arr) === 2 && ents_arr[0][0] === EEntType.POSI) {
        // ents_arr =  [ents_arr] as TEntTypeIdx[][];
        const ents_arr2: TEntTypeIdx[] = [];
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            if (ent_type === EEntType.POSI) {
                ents_arr2.push(ent_arr as TEntTypeIdx);
            } else {
                const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                for (const posi_i of posis_i) {
                    ents_arr2.push([EEntType.POSI, posi_i]);
                }
            }
        }
        ents_arr = [ents_arr2] as TEntTypeIdx[][];
    }
    // now process the ents
    const posis_arrs: TEntTypeIdx[][] = [];
    for (const ent_arr of ents_arr) {
        if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
            posis_arrs.push(ent_arr as TEntTypeIdx[]);
            continue;
        }
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        switch (ent_type) {
            case EEntType.WIRE:
            case EEntType.PLINE:
                const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                const posis_arr: TEntTypeIdx[] = posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                posis_arrs.push(posis_arr);
                break;
            case EEntType.FACE:
            case EEntType.PGON:
                const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
                for (let j = 0; j < wires_i.length; j++) {
                    const wire_i: number = wires_i[j];
                    const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                    const wire_posis_arr: TEntTypeIdx[] = wire_posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                    posis_arrs.push(wire_posis_arr);
                }
                break;
            default:
                break;
        }
    }
    return posis_arrs;
}
// ================================================================================================
/**
 * Adds a set of triangular polygons, forming a Triangulated Irregular Network (TIN).
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, a list of new polygons.
 */
export function _Tin(__model__: GIModel, entities: TId[]|TId[][]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Tin', 'entities', entities,
        [ID.isIDL, ID.isIDLL],
        [EEntType.POSI, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        // ents_arr = splitIDs('make.Tin', 'entities', entities,
        // [IDcheckObj.isIDList, IDcheckObj.isIDListOfLists],
        // [EEntType.POSI, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const posis_arrs: TEntTypeIdx[][] = _getPgonPosisFromEnts(__model__, ents_arr);
    return null;
}
function _tin(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx|TEntTypeIdx[] {
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        const posis_i: number[] = idIndicies(ents_arr as TEntTypeIdx[]);
        const vtxs_tf: Txyz[] = [];
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.modeldata.attribs.query.getPosiCoords(posi_i);
            vtxs_tf.push(xyz);
        }
        // const tin = turf.triangulate(vtxs_tf);
        // console.log(tin);
        return null;
    } else {
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _tin(__model__, ents_arr_item)) as TEntTypeIdx[];
    }
}
// ================================================================================================
/**
 * Adds a new copy of specified entities to the model.
 *
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.
 * @param vector A vector to move the entities by after copying, can be `null`.
 * @returns Entities, the copied entity or a list of copied entities.
 * @example copies = make.Copy([position1,polyine1,polygon1])
 * @example_info Creates a copy of position1, polyine1, and polygon1.
 */
export function Copy(__model__: GIModel, entities: TId|TId[]|TId[][], vector: Txyz|number): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Copy';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL, , ID.isIDLL],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
        checkArgs(fn_name, 'vector', vector, [ArgCh.isNum, ArgCh.isXYZ, ArgCh.isNull]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList, , IDcheckObj.isIDListOfLists],
        // [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const move_vec: Txyz = (Array.isArray(vector) ? vector : [0, 0, vector]) as Txyz;
    const bool_copy_attribs = true;
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = _copyGeom(__model__, ents_arr, bool_copy_attribs);
    // copy the positions that belong to the list of entities
    _copyGeomPosis(__model__, new_ents_arr, bool_copy_attribs, move_vec);
    // return only the new entities
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
// ================================================================================================
/**
 * Makes one or more holes in a polygon.
 * ~
 * The positions must be on the polygon, i.e. they must be co-planar with the polygon and
 * they must be within the boundary of the polygon.
 * ~
 * If the list of positions consists of a single list, then one hole will be generated.
 * If the list of positions consists of a list of lists, then multiple holes will be generated.
 * ~
 * @param __model__
 * @param pgon A face or polygon to make holes in.
 * @param entities List of positions, or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, a list of wires resulting from the hole(s).
 */
export function Hole(__model__: GIModel, pgon: TId, entities: TId|TId[]|TId[][]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    if (!Array.isArray(entities)) { entities = [entities]; }
    // --- Error Check ---
    const fn_name = 'make.Hole';
    let ent_arr: TEntTypeIdx;
    let holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][];
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'pgon', pgon, [ID.isID], [EEntType.FACE, EEntType.PGON]) as TEntTypeIdx;
        holes_ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL, ID.isIDLL],
            [EEntType.POSI, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        // ent_arr = splitIDs(fn_name, 'pgon', pgon, [IDcheckObj.isID], [EEntType.FACE, EEntType.PGON]) as TEntTypeIdx;
        // holes_ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists],
        // [EEntType.POSI, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
        ent_arr = idsBreak(pgon) as TEntTypeIdx;
        holes_ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    // get the posis for making holes
    _getHolePosisFromEnts(__model__, holes_ents_arr);
    // make sure we have a pgon
    const pgon_i: number = isFace(ent_arr[0]) ? __model__.modeldata.geom.nav.navFaceToPgon(ent_arr[1]) : ent_arr[1];
    // make the holes
    const new_ents_arr: TEntTypeIdx[] = _hole(__model__, pgon_i, holes_ents_arr);
    // make and return the IDs of the hole wires
    return idsMake(new_ents_arr) as TId[];
}
// Hole modelling operation
function _hole(__model__: GIModel, pgon_i: number, holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[] {
    if (getArrDepth(holes_ents_arr) === 2) {
        holes_ents_arr = [holes_ents_arr] as TEntTypeIdx[][];
    }
    // convert the holes to lists of posis_i
    const holes_posis_i: number[][] = [];
    for (const hole_ents_arr of holes_ents_arr as TEntTypeIdx[][]) {
        holes_posis_i.push( hole_ents_arr.map( ent_arr => ent_arr[1] ) );
    }
    // create the hole
    const wires_i: number[] = __model__.modeldata.geom.modify_pgon.cutPgonHoles(pgon_i, holes_posis_i);
    return wires_i.map(wire_i => [EEntType.WIRE, wire_i]) as TEntTypeIdx[];
}
function _getHolePosisFromEnts(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): void {
    for (let i = 0; i < ents_arr.length; i++) {
        const depth: number = getArrDepth(ents_arr[i]);
        if (depth === 1) {
            const [ent_type, index]: TEntTypeIdx = ents_arr[i] as TEntTypeIdx;
            switch (ent_type) {
                case EEntType.WIRE:
                case EEntType.PLINE:
                    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                    const posis_arr: TEntTypeIdx[] = posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                    Array.prototype.splice.apply(ents_arr, [i, 1, posis_arr]); // TODO
                    break;
                case EEntType.FACE:
                case EEntType.PGON:
                    // ignore holes, so only take the first wire
                    const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
                    const wire_i: number = wires_i[0];
                    const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
                    const wire_posis_arr: TEntTypeIdx[] = wire_posis_i.map( posi_i => [EEntType.POSI, posi_i]) as TEntTypeIdx[];
                    Array.prototype.splice.apply(ents_arr, [i, 1, wire_posis_arr]); // TODO
                    break;
                default:
                    break;
            }
        }
    }
}
// ================================================================================================
/**
 * Lofts between entities.
 * ~
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 *
 * @param __model__
 * @param entities List of entities, or list of lists of entities.
 * @param method Enum, if 'closed', then close the loft back to the first entity in the list.
 * @returns Entities, a list of new polygons or polylines resulting from the loft.
 * @example quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3.
 * @example quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.
 * @example quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')
 * @example_info Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
 */
export function Loft(__model__: GIModel, entities: TId[]|TId[][], divisions: number, method: _ELoftMethod): TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Loft', 'entities', entities,
        [ID.isIDL, ID.isIDLL],
        [EEntType.EDGE, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        // ents_arr = splitIDs('make.Loft', 'entities', entities,
        // [IDcheckObj.isIDList, IDcheckObj.isIDListOfLists],
        // [EEntType.EDGE, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = _loft(__model__, ents_arr, divisions, method);
    return idsMake(new_ents_arr) as TId[];
}
export enum _ELoftMethod {
    OPEN_QUADS =  'open_quads',
    CLOSED_QUADS  =  'closed_quads',
    OPEN_STRINGERS =  'open_stringers',
    CLOSED_STRINGERS  =  'closed_stringers',
    OPEN_RIBS = 'open_ribs',
    CLOSED_RIBS = 'closed_ribs',
    COPIES = 'copies'
}
function _loftQuads(__model__: GIModel, ents_arr: TEntTypeIdx[], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
    const edges_arrs_i: number[][] = [];
    let num_edges = 0;
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        if (edges_arrs_i.length === 0) { num_edges = edges_i.length; }
        if (edges_i.length !== num_edges) {
            throw new Error('make.Loft: Number of edges is not consistent.');
        }
        edges_arrs_i.push(edges_i);
    }
    if (method === _ELoftMethod.CLOSED_QUADS) {
        edges_arrs_i.push(edges_arrs_i[0]);
    }
    const new_pgons_i: number[] = [];
    for (let i = 0; i < edges_arrs_i.length - 1; i++) {
        const edges_i_a: number[] = edges_arrs_i[i];
        const edges_i_b: number[] = edges_arrs_i[i + 1];
        if (divisions > 0) {
            const strip_posis_map: Map<number, number[]> = new Map();
            for (let j = 0; j < num_edges; j++) {
                const edge_i_a: number = edges_i_a[j];
                const edge_i_b: number = edges_i_b[j];
                // get exist two posis_i
                const exist_posis_a_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i_a);
                const exist_posis_b_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i_b);
                // create the new posis strip if necessary
                for (const k of [0, 1]) {
                    if (strip_posis_map.get(exist_posis_a_i[k]) === undefined) {
                        const xyz_a: Txyz = __model__.modeldata.attribs.query.getPosiCoords(exist_posis_a_i[k]);
                        const xyz_b: Txyz = __model__.modeldata.attribs.query.getPosiCoords(exist_posis_b_i[k]);
                        const extrude_vec_div: Txyz = vecDiv(vecFromTo(xyz_a, xyz_b), divisions);
                        const strip_posis_i: number[] = [exist_posis_a_i[k]];
                        for (let d = 1; d < divisions; d++) {
                            const strip_posi_i: number = __model__.modeldata.geom.add.addPosi();
                            const move_xyz = vecMult(extrude_vec_div, d);
                            __model__.modeldata.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz_a, move_xyz));
                            strip_posis_i.push(strip_posi_i);
                        }
                        strip_posis_i.push(exist_posis_b_i[k]);
                        strip_posis_map.set(exist_posis_a_i[k], strip_posis_i);
                    }
                }
                // get the two strips and make polygons
                const strip1_posis_i: number[] = strip_posis_map.get(exist_posis_a_i[0]);
                const strip2_posis_i: number[] = strip_posis_map.get(exist_posis_a_i[1]);
                for (let k = 0; k < strip1_posis_i.length - 1; k++) {
                    const c1: number = strip1_posis_i[k];
                    const c2: number = strip2_posis_i[k];
                    const c3: number = strip2_posis_i[k + 1];
                    const c4: number = strip1_posis_i[k + 1];
                    const pgon_i: number = __model__.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
                    new_pgons_i.push(pgon_i);
                }
            }
        } else {
            for (let j = 0; j < num_edges; j++) {
                const posis_i_a: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i_a[j]);
                const posis_i_b: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i_b[j]);
                const pgon_i: number = __model__.modeldata.geom.add.addPgon([posis_i_a[0], posis_i_a[1], posis_i_b[1], posis_i_b[0]]);
                new_pgons_i.push(pgon_i);
            }
        }
    }
    return new_pgons_i.map( pgon_i => [EEntType.PGON, pgon_i]) as TEntTypeIdx[];
}
function _loftStringers(__model__: GIModel, ents_arr: TEntTypeIdx[], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
    const posis_arrs_i: number[][] = [];
    let num_posis = 0;
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        if (posis_arrs_i.length === 0) { num_posis = posis_i.length; }
        if (posis_i.length !== num_posis) {
            throw new Error('make.Loft: Number of positions is not consistent.');
        }
        posis_arrs_i.push(posis_i);
    }
    const is_closed: boolean = method === _ELoftMethod.CLOSED_STRINGERS;
    if (is_closed) {
        posis_arrs_i.push(posis_arrs_i[0]);
    }
    const stringer_plines_i: number[] = [];
    for (let i = 0; i < num_posis; i++) {
        const stringer_posis_i: number[] = [];
        for (let j = 0; j < posis_arrs_i.length - 1; j++) {
            stringer_posis_i.push(posis_arrs_i[j][i]);
            if (divisions > 0) {
                const xyz1: Txyz = __model__.modeldata.attribs.query.getPosiCoords(posis_arrs_i[j][i]);
                const xyz2: Txyz = __model__.modeldata.attribs.query.getPosiCoords(posis_arrs_i[j + 1][i]);
                const vec: Txyz = vecDiv(vecFromTo(xyz1, xyz2), divisions);
                for (let k = 1; k < divisions; k++) {
                    const new_xyz: Txyz = vecAdd(xyz1, vecMult(vec, k));
                    const new_posi_i: number = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.add.setPosiCoords(new_posi_i, new_xyz);
                    stringer_posis_i.push(new_posi_i);
                }
            }
        }
        if (!is_closed) {
            stringer_posis_i.push(posis_arrs_i[posis_arrs_i.length - 1][i]);
        }
        const pline_i: number = __model__.modeldata.geom.add.addPline(stringer_posis_i, is_closed);
        stringer_plines_i.push(pline_i);
    }
    return stringer_plines_i.map( pline_i => [EEntType.PLINE, pline_i]) as TEntTypeIdx[];
}
function _loftRibs(__model__: GIModel, ents_arr: TEntTypeIdx[], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
    const posis_arrs_i: number[][] = [];
    let num_posis = 0;
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        if (posis_arrs_i.length === 0) { num_posis = posis_i.length; }
        if (posis_i.length !== num_posis) {
            throw new Error('make.Loft: Number of positions is not consistent.');
        }
        posis_arrs_i.push(posis_i);
    }
    const is_closed: boolean = method === _ELoftMethod.CLOSED_RIBS;
    if (is_closed) {
        posis_arrs_i.push(posis_arrs_i[0]);
    }
    let ribs_is_closed = false;
    switch (ents_arr[0][0]) { // check if the first entity is closed
        case EEntType.PGON:
        case EEntType.FACE:
            ribs_is_closed = true;
            break;
        case EEntType.PLINE:
            const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(ents_arr[0][1]);
            ribs_is_closed = __model__.modeldata.geom.query.isWireClosed(wire_i);
            break;
        case EEntType.WIRE:
            ribs_is_closed = __model__.modeldata.geom.query.isWireClosed(ents_arr[0][1]);
            break;
        default:
            break;
    }
    const rib_plines_i: number[] = [];
    for (let i = 0; i < posis_arrs_i.length - 1; i++) {
        const pline_i: number = __model__.modeldata.geom.add.addPline(posis_arrs_i[i], ribs_is_closed);
        rib_plines_i.push(pline_i);
        if (divisions > 0) {
            const xyzs1: Txyz[] = posis_arrs_i[i].map(posi_i => __model__.modeldata.attribs.query.getPosiCoords(posi_i));
            const xyzs2: Txyz[] = posis_arrs_i[i + 1].map(posi_i => __model__.modeldata.attribs.query.getPosiCoords(posi_i));
            const vecs: Txyz[] = [];
            for (let k = 0; k < num_posis; k++) {
                const vec: Txyz = vecDiv(vecFromTo(xyzs1[k], xyzs2[k]), divisions);
                vecs.push(vec);
            }
            for (let j = 1; j < divisions; j++) {
                const rib_posis_i: number[] = [];
                for (let k = 0; k < num_posis; k++) {
                    const new_xyz: Txyz = vecAdd(xyzs1[k], vecMult(vecs[k], j));
                    const new_posi_i: number = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.add.setPosiCoords(new_posi_i, new_xyz);
                    rib_posis_i.push(new_posi_i);
                }
                const new_rib_pline_i: number = __model__.modeldata.geom.add.addPline(rib_posis_i, ribs_is_closed);
                rib_plines_i.push(new_rib_pline_i);
            }
        }
    }
    if (!is_closed) {
        const pline_i: number = __model__.modeldata.geom.add.addPline(posis_arrs_i[posis_arrs_i.length - 1], ribs_is_closed);
        rib_plines_i.push(pline_i);
    }
    return rib_plines_i.map( pline_i => [EEntType.PLINE, pline_i]) as TEntTypeIdx[];
}
function _loftCopies(__model__: GIModel, ents_arr: TEntTypeIdx[], divisions: number): TEntTypeIdx[] {
    const posis_arrs_i: number[][] = [];
    let num_posis = 0;
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        if (posis_arrs_i.length === 0) { num_posis = posis_i.length; }
        if (posis_i.length !== num_posis) {
            throw new Error('make.Loft: Number of positions is not consistent.');
        }
        posis_arrs_i.push(posis_i);
    }
    const copies: TEntTypeIdx[] = [];
    for (let i = 0; i < posis_arrs_i.length - 1; i++) {
        copies.push(ents_arr[i]);
        if (divisions > 0) {
            const xyzs1: Txyz[] = posis_arrs_i[i].map(posi_i => __model__.modeldata.attribs.query.getPosiCoords(posi_i));
            const xyzs2: Txyz[] = posis_arrs_i[i + 1].map(posi_i => __model__.modeldata.attribs.query.getPosiCoords(posi_i));
            const vecs: Txyz[] = [];
            for (let k = 0; k < num_posis; k++) {
                const vec: Txyz = vecDiv(vecFromTo(xyzs1[k], xyzs2[k]), divisions);
                vecs.push(vec);
            }
            for (let j = 1; j < divisions; j++) {
                const lofted_ent_arr: TEntTypeIdx = _copyGeom(__model__, ents_arr[i], true) as TEntTypeIdx;
                _copyGeomPosis(__model__, lofted_ent_arr, true, null);
                const [lofted_ent_type, lofted_ent_i]: [number, number] = lofted_ent_arr;
                const new_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(lofted_ent_type, lofted_ent_i);
                for (let k = 0; k < num_posis; k++) {
                    const new_xyz: Txyz = vecAdd(xyzs1[k], vecMult(vecs[k], j));
                    __model__.modeldata.attribs.add.setPosiCoords(new_posis_i[k], new_xyz);
                }
                copies.push(lofted_ent_arr);
            }
        }
    }
    copies.push(ents_arr[ents_arr.length - 1]);
    return copies;
}
function _loft(__model__: GIModel, ents_arrs: TEntTypeIdx[]|TEntTypeIdx[][], divisions: number, method: _ELoftMethod): TEntTypeIdx[] {
    const depth: number = getArrDepth(ents_arrs);
    if (depth === 2) {
        const ents_arr: TEntTypeIdx[] = ents_arrs as TEntTypeIdx[];
        switch (method) {
            case _ELoftMethod.OPEN_QUADS:
            case _ELoftMethod.CLOSED_QUADS:
                return _loftQuads(__model__, ents_arr, divisions, method);
            case _ELoftMethod.OPEN_STRINGERS:
            case _ELoftMethod.CLOSED_STRINGERS:
                return _loftStringers(__model__, ents_arr, divisions, method);
            case _ELoftMethod.OPEN_RIBS:
            case _ELoftMethod.CLOSED_RIBS:
                return _loftRibs(__model__, ents_arr, divisions, method);
            case _ELoftMethod.COPIES:
                return _loftCopies(__model__, ents_arr, divisions);
            default:
                break;
        }
    } else if (depth === 3) {
        const all_loft_ents: TEntTypeIdx[] = [];
        for (const ents_arr of ents_arrs  as TEntTypeIdx[][]) {
            const loft_ents: TEntTypeIdx[] = _loft(__model__, ents_arr, divisions, method);
            loft_ents.forEach( loft_ent => all_loft_ents.push(loft_ent) );
        }
        return all_loft_ents;
    }
}
// ================================================================================================
/**
 * Extrudes geometry by distance or by vector.
 * - Extrusion of a position, vertex, or point produces polylines;
 * - Extrusion of an edge, wire, or polyline produces polygons;
 * - Extrusion of a face or polygon produces polygons, capped at the top.
 * ~
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 * ~
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param dist Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).
 * @param divisions Number of divisions to divide extrusion by. Minimum is 1.
 * @param method Enum, when extruding edges, select quads, stringers, or ribs
 * @returns Entities, a list of new polygons or polylines resulting from the extrude.
 * @example extrusion1 = make.Extrude(point1, 10, 2, 'quads')
 * @example_info Creates a polyline of total length 10 (with two edges of length 5 each) in the z-direction.
 * In this case, the 'quads' setting is ignored.
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
 */
export function Extrude(__model__: GIModel, entities: TId|TId[],
        dist: number|Txyz, divisions: number, method: _EExtrudeMethod): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Extrude';
    let ents_arr;
    if (__model__.debug) {
        ents_arr =  checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL],
            [EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.FACE,
            EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        checkArgs(fn_name, 'dist', dist, [ArgCh.isNum, ArgCh.isXYZ]);
        checkArgs(fn_name, 'divisions', divisions, [ArgCh.isInt]);
    } else {
        // ents_arr =  splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList],
        //     [EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.FACE,
        //     EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    let new_ents_arr: TEntTypeIdx[] = null;
    // extrude
    if (method === _EExtrudeMethod.COPIES) {
        new_ents_arr = _extrudeCopies(__model__, ents_arr, dist, divisions);
    } else {
        new_ents_arr = _extrude(__model__, ents_arr, dist, divisions, method);
    }
    // create IDs
    if (!Array.isArray(entities) && new_ents_arr.length === 1) {
        return idsMake(new_ents_arr[0]) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
function _extrudeCopies(__model__: GIModel, ents: TEntTypeIdx|TEntTypeIdx[],
        dist: number|Txyz, divisions: number): TEntTypeIdx[] {
    const ents_arr: TEntTypeIdx[] = (getArrDepth(ents) === 1 ? [ents] : ents) as TEntTypeIdx[];
    const extrude_vec: Txyz = (Array.isArray(dist) ? dist : [0, 0, dist]) as Txyz;
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    const copies: TEntTypeIdx[] = [];
    // make the copies
    for (let i = 0; i < divisions + 1; i++) {
        // copy the list of entities
        const copied_ents_arr: TEntTypeIdx[] = _copyGeom(__model__, ents_arr, true) as TEntTypeIdx[];
        // copy the positions that belong to the list of entities
        _copyGeomPosis(__model__, copied_ents_arr, true, vecMult(extrude_vec_div, i));
        // add to the array
        for (const copied_ent_arr of copied_ents_arr) {
            copies.push(copied_ent_arr);
        }
    }
    // return the copies
    return copies;
}
function _extrudeColl(__model__: GIModel, index: number,
        extrude_vec: Txyz, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
    const points_i: number[] = __model__.modeldata.geom.nav.navCollToPoint(index);
    const res1 = points_i.map( point_i => _extrude(__model__, [EEntType.POINT, point_i], extrude_vec, divisions, method));
    const plines_i: number[] = __model__.modeldata.geom.nav.navCollToPline(index);
    const res2 = plines_i.map( pline_i => _extrude(__model__, [EEntType.PLINE, pline_i], extrude_vec, divisions, method));
    const pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(index);
    const res3 = pgons_i.map( pgon_i => _extrude(__model__, [EEntType.PGON, pgon_i], extrude_vec, divisions, method));
    return [].concat(res1, res2, res3);
}
function _extrudeDim0(__model__: GIModel, ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    const exist_posi_i: number = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index)[0];
    const xyz: Txyz = __model__.modeldata.attribs.query.getPosiCoords(exist_posi_i);
    const strip_posis_i: number[] = [exist_posi_i];
    for (let i = 1; i < divisions + 1; i++) {
        const strip_posi_i: number = __model__.modeldata.geom.add.addPosi();
        const move_xyz = vecMult(extrude_vec_div, i);
        __model__.modeldata.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
        strip_posis_i.push(strip_posi_i);
    }
    // loft between the positions and create a single polyline
    const pline_i: number = __model__.modeldata.geom.add.addPline(strip_posis_i);
    return [[EEntType.PLINE, pline_i]];
}
function _extrudeQuads(__model__: GIModel, ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
    const new_pgons_i: number[] = [];
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
    const strip_posis_map: Map<number, number[]> = new Map();
    for (const edge_i of edges_i) {
        // get exist posis_i
        const exist_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        // create the new posis strip if necessary
        for (const exist_posi_i of exist_posis_i) {
            if (strip_posis_map.get(exist_posi_i) === undefined) {
                const xyz: Txyz = __model__.modeldata.attribs.query.getPosiCoords(exist_posi_i);
                const strip_posis_i: number[] = [exist_posi_i];
                for (let i = 1; i < divisions + 1; i++) {
                    const strip_posi_i: number = __model__.modeldata.geom.add.addPosi();
                    const move_xyz = vecMult(extrude_vec_div, i);
                    __model__.modeldata.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                    strip_posis_i.push(strip_posi_i);
                }
                strip_posis_map.set(exist_posi_i, strip_posis_i);
            }
        }
        // get the two strips and make polygons
        const strip1_posis_i: number[] = strip_posis_map.get(exist_posis_i[0]);
        const strip2_posis_i: number[] = strip_posis_map.get(exist_posis_i[1]);
        for (let i = 0; i < strip1_posis_i.length - 1; i++) {
            const c1: number = strip1_posis_i[i];
            const c2: number = strip2_posis_i[i];
            const c3: number = strip2_posis_i[i + 1];
            const c4: number = strip1_posis_i[i + 1];
            const pgon_i: number = __model__.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
            new_pgons_i.push(pgon_i);
        }
    }
    // cap the top
    if (isDim2(ent_type)) { // create a top -> polygon
        const face_i: number = isFace(ent_type) ? index : __model__.modeldata.geom.nav.navPgonToFace(index);
        const cap_pgon_i: number = _extrudeCap(__model__, face_i, strip_posis_map, divisions);
        new_pgons_i.push(cap_pgon_i);
    }
    return new_pgons_i.map(pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx);
}
function _extrudeStringers(__model__: GIModel, ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
    const new_plines_i: number[] = [];
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
    const strip_posis_map: Map<number, number[]> = new Map();
    for (const edge_i of edges_i) {
        // get exist posis_i
        const exist_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        // create the new posis strip if necessary
        for (const exist_posi_i of exist_posis_i) {
            if (strip_posis_map.get(exist_posi_i) === undefined) {
                const xyz: Txyz = __model__.modeldata.attribs.query.getPosiCoords(exist_posi_i);
                const strip_posis_i: number[] = [exist_posi_i];
                for (let i = 1; i < divisions + 1; i++) {
                    const strip_posi_i: number = __model__.modeldata.geom.add.addPosi();
                    const move_xyz = vecMult(extrude_vec_div, i);
                    __model__.modeldata.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                    strip_posis_i.push(strip_posi_i);
                }
                strip_posis_map.set(exist_posi_i, strip_posis_i);
            }
        }
    }
    // make the stringers
    strip_posis_map.forEach(strip_posis_i => {
        const pline_i: number = __model__.modeldata.geom.add.addPline(strip_posis_i);
        new_plines_i.push(pline_i);
    });
    // return the stringers
    return new_plines_i.map(pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx);
}
function _extrudeRibs(__model__: GIModel, ent_type: number, index: number, extrude_vec: Txyz, divisions: number): TEntTypeIdx[] {
    const new_plines_i: number[] = [];
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
    const strip_posis_map: Map<number, number[]> = new Map();
    for (const edge_i of edges_i) {
        // get exist posis_i
        const exist_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        // create the new posis strip if necessary
        for (const exist_posi_i of exist_posis_i) {
            if (strip_posis_map.get(exist_posi_i) === undefined) {
                const xyz: Txyz = __model__.modeldata.attribs.query.getPosiCoords(exist_posi_i);
                const strip_posis_i: number[] = [exist_posi_i];
                for (let i = 1; i < divisions + 1; i++) {
                    const strip_posi_i: number = __model__.modeldata.geom.add.addPosi();
                    const move_xyz = vecMult(extrude_vec_div, i);
                    __model__.modeldata.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                    strip_posis_i.push(strip_posi_i);
                }
                strip_posis_map.set(exist_posi_i, strip_posis_i);
            }
        }
    }
    // make an array of ents to process as ribs
    let ribs_is_closed = false;
    const ribs_posis_i: number[][] = [];
    switch (ent_type) { // check if the entity is closed
        case EEntType.PGON:
        case EEntType.FACE:
            ribs_is_closed = true;
            const face_wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            for (const face_wire_i of face_wires_i) {
                const face_wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, face_wire_i);
                ribs_posis_i.push(face_wire_posis_i);
            }
            break;
        case EEntType.PLINE:
            const pline_wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(index);
            const pline_wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, pline_wire_i);
            ribs_posis_i.push(pline_wire_posis_i);
            ribs_is_closed = __model__.modeldata.geom.query.isWireClosed(pline_wire_i);
            break;
        case EEntType.WIRE:
            const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, index);
            ribs_posis_i.push(wire_posis_i);
            ribs_is_closed = __model__.modeldata.geom.query.isWireClosed(index);
            break;
        default:
            const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            ribs_posis_i.push(posis_i);
            break;
    }
    // make the ribs
    for (let i = 0; i < divisions + 1; i++) {
        for (const rib_posis_i of ribs_posis_i) {
            const mapped_rib_posis_i: number[] = rib_posis_i.map( rib_posi_i => strip_posis_map.get(rib_posi_i)[i] );
            const pline_i: number = __model__.modeldata.geom.add.addPline(mapped_rib_posis_i, ribs_is_closed);
            new_plines_i.push(pline_i);
        }
    }
    // return the ribs
    return new_plines_i.map(pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx);
}
function _extrudeCap(__model__: GIModel, index: number, strip_posis_map: Map<number, number[]>, divisions: number): number {
    const face_i: number = __model__.modeldata.geom.nav.navPgonToFace(index);
    // get positions on boundary
    const old_wire_i: number = __model__.modeldata.geom.query.getFaceBoundary(face_i);
    const old_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, old_wire_i);
    const new_posis_i: number[] = old_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
    // get positions for holes
    const old_holes_wires_i: number[] = __model__.modeldata.geom.query.getFaceHoles(face_i);
    const new_holes_posis_i: number[][] = [];
    for (const old_hole_wire_i of old_holes_wires_i) {
        const old_hole_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, old_hole_wire_i);
        const new_hole_posis_i: number[] = old_hole_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
        new_holes_posis_i.push(new_hole_posis_i);
    }
    // make new polygon
    const pgon_i: number = __model__.modeldata.geom.add.addPgon( new_posis_i, new_holes_posis_i );
    return pgon_i;
}
function _extrude(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
        dist: number|Txyz, divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
    const extrude_vec: Txyz = (Array.isArray(dist) ? dist : [0, 0, dist]) as Txyz;
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        // check if this is a collection, call this function again
        if (isColl(ent_type)) {
            return _extrudeColl(__model__, index, extrude_vec, divisions, method);
        }
        // check if this is a position, a vertex, or a point -> pline
        if (isDim0(ent_type)) {
            return _extrudeDim0(__model__, ent_type, index, extrude_vec, divisions);
        }
        // extrude edges -> polygons
        switch (method) {
            case _EExtrudeMethod.QUADS:
                return _extrudeQuads(__model__, ent_type, index, extrude_vec, divisions);
            case _EExtrudeMethod.STRINGERS:
                return _extrudeStringers(__model__, ent_type, index, extrude_vec, divisions);
            case _EExtrudeMethod.RIBS:
                return _extrudeRibs(__model__, ent_type, index, extrude_vec, divisions);
            default:
                throw new Error('Extrude method not recognised.');
        }
    } else {
        const new_ents_arr: TEntTypeIdx[] = [];
        (ents_arr as TEntTypeIdx[]).forEach(ent_arr => {
            const result = _extrude(__model__, ent_arr, extrude_vec, divisions, method);
            result.forEach( new_ent_arr => new_ents_arr.push(new_ent_arr));
        });
        return new_ents_arr;
    }
}
// ================================================================================================
/**
 * Sweeps a cross section wire along a backbone wire.
 * ~
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param xsection Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
export function Sweep(__model__: GIModel, entities: TId|TId[], x_section: TId, divisions: number, method: _EExtrudeMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Sweep';
    let backbone_ents: TEntTypeIdx[];
    let xsection_ent: TEntTypeIdx;
    if (__model__.debug) {
        backbone_ents = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        xsection_ent = checkIDs(__model__, fn_name, 'xsextion', x_section,
            [ID.isID], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx;
        checkArgs(fn_name, 'divisions', divisions, [ArgCh.isInt]);
        if (divisions === 0) {
            throw new Error(fn_name + ' : Divisor cannot be zero.');
        }
    } else {
        // backbone_ents = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        // xsection_ent = splitIDs(fn_name, 'xsextion', xsextion,
        //     [IDcheckObj.isID], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx;
        backbone_ents = idsBreak(entities) as TEntTypeIdx[];
        xsection_ent = idsBreak(x_section) as TEntTypeIdx;
    }
    // --- Error Check ---
    // the xsection
    const [xsection_ent_type, xsection_index]: TEntTypeIdx = xsection_ent;
    let xsection_wire_i: number = null;
    if (isWire(xsection_ent_type)) {
        xsection_wire_i = xsection_index;
    } else {
        const xsection_wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(xsection_ent_type, xsection_index);
        xsection_wire_i = xsection_wires_i[0]; // select the first wire that is found
    }
    // get all the wires and put them into an array
    const backbone_wires_i: number[] = [];
    for (const [ent_type, index] of backbone_ents) {
        if (isWire(ent_type)) {
            backbone_wires_i.push(index);
        } else {
            const ent_wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            backbone_wires_i.push(...ent_wires_i);
        }
    }
    // do the sweep
    const new_ents: TEntTypeIdx[] = _sweep(__model__, backbone_wires_i, xsection_wire_i, divisions, method);
    return idsMake(new_ents) as TId[];
}
function _sweep(__model__: GIModel, backbone_wires_i: number|number[], xsection_wire_i: number,
        divisions: number, method: _EExtrudeMethod): TEntTypeIdx[] {
    if (!Array.isArray(backbone_wires_i)) {
        // extrude edges -> polygons
        switch (method) {
            case _EExtrudeMethod.QUADS:
                return _sweepQuads(__model__, backbone_wires_i, xsection_wire_i, divisions);
            case _EExtrudeMethod.STRINGERS:
                return _sweepStringers(__model__, backbone_wires_i, xsection_wire_i, divisions);
            case _EExtrudeMethod.RIBS:
                return _sweepRibs(__model__, backbone_wires_i, xsection_wire_i, divisions);
            case _EExtrudeMethod.COPIES:
                return _sweepCopies(__model__, backbone_wires_i, xsection_wire_i, divisions);
            default:
                throw new Error('Extrude method not recognised.');
        }
    } else {
        const new_ents: TEntTypeIdx[] = [];
        for (const wire_i of backbone_wires_i) {
            const wire_new_ents: TEntTypeIdx[] = _sweep(__model__, wire_i, xsection_wire_i, divisions, method);
            for (const wire_new_ent of wire_new_ents) {
                new_ents.push(wire_new_ent);
            }
        }
        return new_ents;
    }
}
function _sweepQuads(__model__: GIModel, backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
    const strips_posis_i: number[][] = _sweepPosis(__model__, backbone_wire_i, xsection_wire_i, divisions);
    const backbone_is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(backbone_wire_i);
    const xsection_is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(xsection_wire_i);
    // add row if backbone_is_closed
    if (backbone_is_closed) {
        strips_posis_i.push(strips_posis_i[0].slice());
    }
    // add a posi_i to end of each strip if xsection_is_closed
    if (xsection_is_closed) {
        for (const strip_posis_i of strips_posis_i) {
            strip_posis_i.push(strip_posis_i[0]);
        }
    }
    // create quads
    const new_pgons: TEntTypeIdx[] = [];
    for (let i = 0; i < strips_posis_i.length - 1; i++) {
        const strip1_posis_i: number[] = strips_posis_i[i];
        const strip2_posis_i: number[] = strips_posis_i[i + 1];
        for (let j = 0; j < strip1_posis_i.length - 1; j++) {
            const c1: number = strip1_posis_i[j];
            const c2: number = strip2_posis_i[j];
            const c3: number = strip2_posis_i[j + 1];
            const c4: number = strip1_posis_i[j + 1];
            const pgon_i: number = __model__.modeldata.geom.add.addPgon([c1, c2, c3, c4]);
            new_pgons.push([EEntType.PGON, pgon_i]);
        }
    }
    return new_pgons;
}
function _sweepStringers(__model__: GIModel, backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
    const backbone_is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(backbone_wire_i);
    const ribs_posis_i: number[][] = _sweepPosis(__model__, backbone_wire_i, xsection_wire_i, divisions);
    const stringers_posis_i: number[][] = listZip(ribs_posis_i);
    const plines: TEntTypeIdx[] = [];
    for (const stringer_posis_i of stringers_posis_i) {
        const pline_i: number = __model__.modeldata.geom.add.addPline(stringer_posis_i, backbone_is_closed);
        plines.push([EEntType.PLINE, pline_i]);
    }
    return plines;
}
function _sweepRibs(__model__: GIModel, backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
    const xsection_is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(xsection_wire_i);
    const ribs_posis_i: number[][] = _sweepPosis(__model__, backbone_wire_i, xsection_wire_i, divisions);
    const plines: TEntTypeIdx[] = [];
    for (const rib_posis_i of ribs_posis_i) {
        const pline_i: number = __model__.modeldata.geom.add.addPline(rib_posis_i, xsection_is_closed);
        plines.push([EEntType.PLINE, pline_i]);
    }
    return plines;
}
function _sweepCopies(__model__: GIModel, backbone_wire_i: number, xsection_wire_i: number, divisions: number): TEntTypeIdx[] {
    const posis_i: number[][] = _sweepPosis(__model__, backbone_wire_i, xsection_wire_i, divisions);
    // TODO
    throw new Error('Not implemented');
    // TODO
}
function _sweepPosis(__model__: GIModel, backbone_wire_i: number, xsection_wire_i: number, divisions: number): number[][] {
    // get the xyzs of the cross section
    const xsextion_xyzs: Txyz[] = __model__.modeldata.attribs.query.getEntCoords(EEntType.WIRE, xsection_wire_i);
    // get the xyzs of the backbone
    const wire_normal: Txyz = __model__.modeldata.geom.query.getWireNormal(backbone_wire_i);
    const wire_is_closed: boolean =  __model__.modeldata.geom.query.isWireClosed(backbone_wire_i);
    const wire_xyzs: Txyz[] = __model__.modeldata.attribs.query.getEntCoords(EEntType.WIRE, backbone_wire_i);
    let plane_xyzs: Txyz[] = [];
    // if not divisions is not 1, then we need to add xyzs
    if (divisions === 1) {
        plane_xyzs = wire_xyzs;
    } else {
        if (wire_is_closed) {
            wire_xyzs.push(wire_xyzs[0]);
        }
        for (let i = 0; i < wire_xyzs.length - 1; i++) {
            const xyz0: Txyz = wire_xyzs[i];
            const xyz1: Txyz = wire_xyzs[i + 1];
            const vec: Txyz = vecFromTo(xyz0, xyz1);
            const vec_div: Txyz = vecDiv(vec, divisions);
            // create additional xyzs for planes
            plane_xyzs.push(xyz0);
            for (let j = 1; j < divisions; j++) {
                plane_xyzs.push(vecAdd(xyz0, vecMult(vec_div, j)));
            }
        }
        if (!wire_is_closed) {
            plane_xyzs.push(wire_xyzs[wire_xyzs.length - 1]);
        }
    }
    // create the planes
    const planes: TPlane[] = getPlanesSeq(plane_xyzs, wire_normal, wire_is_closed);
    // create the new  posis
    const XY: TPlane = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
    const all_new_posis_i: number[][] = [];
    for (const plane of planes) {
        const matrix: Matrix4 = xfromSourceTargetMatrix(XY, plane);
        const xsection_posis_i: number[] = [];
        for (const xsextion_xyz of xsextion_xyzs) {
            const new_xyz: Txyz = multMatrix(xsextion_xyz, matrix);
            const posi_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.add.setPosiCoords(posi_i, new_xyz);
            xsection_posis_i.push(posi_i);
        }
        all_new_posis_i.push(xsection_posis_i);
    }
    // return the new posis
    return all_new_posis_i;
}
// ================================================================================================
/**
 * Divides edges into a set of shorter edges.
 * ~
 * If the 'by_number' method is selected, then each edge is divided into a fixed number of equal length shorter edges.
 * If the 'by length' method is selected, then each edge is divided into shorter edges of the specified length.
 * The length of the last segment will be the remainder.
 * If the 'by_min_length' method is selected,
 * then the edge is divided into the maximum number of shorter edges
 * that have a new length that is equal to or greater than the minimum.
 * ~
 * @param __model__
 * @param entities Edges, or entities from which edges can be extracted.
 * @param divisor Segment length or number of segments.
 * @param method Enum, select the method for dividing edges.
 * @returns Entities, a list of new edges resulting from the divide.
 * @example segments1 = make.Divide(edge1, 5, by_number)
 * @example_info Creates a list of 5 equal segments from edge1.
 * @example segments2 = make.Divide(edge1, 5, by_length)
 * @example_info If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
 */
export function Divide(__model__: GIModel, entities: TId|TId[], divisor: number, method: _EDivisorMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Divide';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        checkArgs(fn_name, 'divisor', divisor, [ArgCh.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = _divide(__model__, ents_arr, divisor, method);
    // return the ids
    return idsMake(new_ents_arr) as TId[];
}
function _divide(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], divisor: number, method: _EDivisorMethod): TEntTypeIdx[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        let exist_edges_i: number[];
        if (!isEdge(ent_type)) {
            exist_edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index).slice();
        } else {
            exist_edges_i = [index];
        }
        const all_new_edges_i: number[] = [];
        for (const exist_edge_i of exist_edges_i) {
            const new_edges_i: number[] = _divideEdge(__model__, exist_edge_i, divisor, method);
            all_new_edges_i.push(...new_edges_i);
        }
        __model__.modeldata.geom.time_stamp.updateObjsTs(ent_type, index);
        return all_new_edges_i.map(one_edge_i => [EEntType.EDGE, one_edge_i] as TEntTypeIdx);
    } else {
        return [].concat(...(ents_arr as TEntTypeIdx[]).map(one_edge => _divide(__model__, one_edge, divisor, method)));
    }
}
function _divideEdge(__model__: GIModel, edge_i: number, divisor: number, method: _EDivisorMethod): number[] {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    const start = __model__.modeldata.attribs.query.getPosiCoords(posis_i[0]);
    const end = __model__.modeldata.attribs.query.getPosiCoords(posis_i[1]);
    let new_xyzs: Txyz[];
    if (method === _EDivisorMethod.BY_NUMBER) {
        new_xyzs = interpByNum(start, end, divisor - 1);
    } else if (method === _EDivisorMethod.BY_LENGTH) {
        new_xyzs = interpByLen(start, end, divisor);
    } else if (method === _EDivisorMethod.BY_MAX_LENGTH) {
        const len: number = distance(start, end);
        if (divisor === 0) {
            new_xyzs = [];
        } else {
            const num_div: number = Math.ceil(len / divisor);
            const num_div_max: number = num_div > 1 ? num_div - 1 : 0;
            new_xyzs = interpByNum(start, end, num_div_max);
        }
    } else { // BY_MIN_LENGTH
        if (divisor === 0) {
            new_xyzs = [];
        } else {
            const len: number = distance(start, end);
            const num_div: number = Math.floor(len / divisor);
            const num_div_min: number = num_div > 1 ? num_div - 1 : 0;
            new_xyzs = interpByNum(start, end, num_div_min);
        }
    }
    const new_edges_i: number[] = [];
    let old_edge_i: number = edge_i;
    for (const new_xyz of new_xyzs) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.add.setPosiCoords(posi_i, new_xyz);
        const new_edge_i: number = __model__.modeldata.geom.modify.insertVertIntoWire(old_edge_i, posi_i);
        new_edges_i.push(old_edge_i);
        old_edge_i = new_edge_i;
    }
    new_edges_i.push(old_edge_i);
    return new_edges_i;
}
// ================================================================================================
export enum _ECutMethod {
    KEEP_ABOVE =  'keep_above',
    KEEP_BELOW = 'keep_below',
    KEEP_BOTH = 'keep_both'
}
/**
 * Cuts polygons and polylines using a plane.
 * ~
 * If the 'keep_above' method is selected, then only the part of the cut entities above the plane are kept.
 * If the 'keep_below' method is selected, then only the part of the cut entities below the plane are kept.
 * If the 'keep_both' method is selected, then both the parts of the cut entities are kept.
 * ~
 * Currently does not support cutting polygons with holes. TODO
 * ~
 * If 'keep_both' is selected, returns a list of two lists.
 * [[entities above the plane], [entities below the plane]].
 * ~
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, select the method for cutting.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export function Cut(__model__: GIModel, entities: TId|TId[], plane: TPlane, method: _ECutMethod): TId[]|[TId[], TId[]] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        if (method === _ECutMethod.KEEP_BOTH) { return [[], []]; }
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Cut';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        checkArgs(fn_name, 'plane', plane, [ArgCh.isPln]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
        // checkArgTypes(fn_name, 'plane', plane, [TypeCheckObj.isPlane]);
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const plane_normal: Txyz = vecCross(plane[1], plane[2]);
    const plane_tjs: THREE.Plane = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]) );
    // get polylines and polygons
    const set_plines: Set<number> = new Set();
    const set_pgons: Set<number> = new Set();
    const edges_i: number[] = []; // all edges
    for (const [ent_type, ent_i] of ents_arr) {
        if (ent_type === EEntType.PLINE) {
            set_plines.add(ent_i);
        } else if (ent_type === EEntType.PGON) {
            set_pgons.add(ent_i);
        } else {
            const plines: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
            for (const pline of plines) { set_plines.add(pline); }
            const pgons: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
            for (const pgon of pgons) { set_pgons.add(pgon); }
        }
        const ent_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const ent_edge_i of ent_edges_i) { edges_i.push(ent_edge_i); }
    }
    const above: TEntTypeIdx[] = [];
    const below: TEntTypeIdx[] = [];
    // cut each edge and store the results
    const [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs]: [number[][], number[], THREE.Vector3[]] =
        _cutEdges(__model__, edges_i, plane_tjs, method);
    // create array to store new posis
    const posi_to_copies: number[] = [];
    // slice polylines
    for (const exist_pline_i of Array.from(set_plines)) {
        const sliced: [number[], number[]] =
            _cutCreateEnts(__model__, EEntType.PLINE, exist_pline_i, plane_tjs, edge_to_isect_posis,
                posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
        for (const new_pline_i of sliced[0]) { above.push([EEntType.PLINE, new_pline_i]); }
        for (const new_pline_i of sliced[1]) { below.push([EEntType.PLINE, new_pline_i]); }
    }
    // slice polygons
    for (const exist_pgon_i of Array.from(set_pgons)) {
        // TODO slice polygons with holes
        const sliced: [number[], number[]] =
            _cutCreateEnts(__model__, EEntType.PGON, exist_pgon_i, plane_tjs, edge_to_isect_posis,
                posi_to_copies, cut_posi_to_copies, posi_to_tjs, method);
        for (const new_pgon_i of sliced[0]) { above.push([EEntType.PGON, new_pgon_i]); }
        for (const new_pgon_i of sliced[1]) { below.push([EEntType.PGON, new_pgon_i]); }
    }
    // return the result
    switch (method) {
        case _ECutMethod.KEEP_ABOVE:
            return idsMake(above) as TId[];
        case _ECutMethod.KEEP_BELOW:
            return idsMake(below) as TId[];
        default:
            return [idsMake(above), idsMake(below)] as [TId[], TId[]];
    }
}
// cut each edge in the input geometry and store teh intersection posi in a sparse array
// the array is nested, the two indexes [i1][i2] is the two posi ends of the edge, the value is the isect posi
// also returns some other data
// if method is "both", then we need copies of the isect posis, so these are also generated
// finally, the tjs points that are created are also returned, they are used later for checking "starts_above"
function _cutEdges(__model__: GIModel, edges_i: number[], plane_tjs: THREE.Plane, method: _ECutMethod):
        [number[][], number[], THREE.Vector3[]] {
    // create sparse arrays for storing data
    const posi_to_tjs: THREE.Vector3[] = []; // sparse array
    const edge_to_isect_posis: number[][] = []; // sparse array, map_posis[2][3] is the edge from posi 2 to posi 3 (and 3 to 2)
    const cut_posi_to_copies: number[] = []; // sparse array
    // loop through each edge
    for (const edge_i of edges_i) {
        const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        edge_posis_i.sort();
        // get the edge isect point
        if (edge_to_isect_posis[edge_posis_i[0]] === undefined) { edge_to_isect_posis[edge_posis_i[0]] = []; }
        const posi_i: number = edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]];
        if (posi_i === undefined) {
            const posi0_tjs: THREE.Vector3 = _cutGetTjsPoint(__model__, edge_posis_i[0], posi_to_tjs);
            const posi1_tjs: THREE.Vector3 = _cutGetTjsPoint(__model__, edge_posis_i[1], posi_to_tjs);
            const line_tjs: THREE.Line3 = new THREE.Line3(posi0_tjs, posi1_tjs);
            const isect_tjs: THREE.Vector3 = new THREE.Vector3();
            const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
            if (result !== undefined && result !== null) {
                const new_posi_i: number = __model__.modeldata.geom.add.addPosi();
                __model__.modeldata.attribs.add.setPosiCoords(new_posi_i, [isect_tjs.x, isect_tjs.y, isect_tjs.z]);
                edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]] = new_posi_i;
                if (method === _ECutMethod.KEEP_BOTH) {
                    const copy_posi_i: number = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.add.setPosiCoords(copy_posi_i, [isect_tjs.x, isect_tjs.y, isect_tjs.z]);
                    cut_posi_to_copies[new_posi_i] = copy_posi_i;
                }
            } else {
                edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]] = null;
            }
        }
    }
    return [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs] ;
}
// given an exist posis, returns a tjs point
// if necessary, a new tjs point will be created
// creates a map from exist posi to tjs
function _cutGetTjsPoint(__model__: GIModel, posi_i: number, posi_to_tjs: THREE.Vector3[]): THREE.Vector3 {
    if (posi_to_tjs[posi_i] !== undefined) { return posi_to_tjs[posi_i]; }
    const xyz: Txyz = __model__.modeldata.attribs.query.getPosiCoords(posi_i);
    const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
    posi_to_tjs[posi_i] = posi_tjs;
    return posi_tjs;
}
// given an exist posis, returns a new posi
// if necessary, a new posi point be created
// creates a map from exist posi to new posi
function _cutGetPosi(__model__: GIModel, posi_i: number, posi_to_copies: number[]): number {
    if (posi_to_copies[posi_i] !== undefined) { return posi_to_copies[posi_i]; }
    const new_posi_i: number = __model__.modeldata.geom.add.copyPosis(posi_i, true) as number;
    posi_to_copies[posi_i] = new_posi_i;
    return new_posi_i;
}
// given a list of exist posis, returns a list of new posi
// if necessary, new posi will be creates
function _cutGetPosis(__model__: GIModel, posis_i: number[], posi_to_copies: number[]): number[] {
    return posis_i.map(posi_i => _cutGetPosi(__model__, posi_i, posi_to_copies) );
}
// makes a copy of an existing ent
// all posis in the exist ent will be replaced by new posis
function _cutCopyEnt(__model__: GIModel, ent_type: EEntType, ent_i: number, exist_posis_i: number[], posi_to_copies: number[]): number {
    const new_posis_i: number[] = _cutGetPosis(__model__, exist_posis_i, posi_to_copies);
    switch (ent_type) {
        case EEntType.PLINE:
            const new_pline_i: number = __model__.modeldata.geom.add.copyPlines(ent_i, true) as number;
            __model__.modeldata.geom.modify.replacePosis(ent_type, new_pline_i, new_posis_i);
            return new_pline_i;
        case EEntType.PGON:
            const new_pgon_i: number = __model__.modeldata.geom.add.copyPgons(ent_i, true) as number;
            __model__.modeldata.geom.modify.replacePosis(ent_type, new_pgon_i, new_posis_i);
            return new_pgon_i;
        default:
            break;
    }
}
// creates new ents
// if the ent is not cut by the plane, the ent will be copies (with new posis)
// if the ent is cut, a new ent will be created
function _cutCreateEnts(__model__: GIModel, ent_type: EEntType, ent_i: number, plane_tjs: THREE.Plane,
        edge_to_isect_posis: number[][], posi_to_copies: number[], cut_posi_to_copies: number[], posi_to_tjs: THREE.Vector3[],
        method: _ECutMethod): [number[], number[]] {
    // get wire and posis
    const wire_i: number = __model__.modeldata.geom.nav.navAnyToWire(ent_type, ent_i)[0];
    const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    const wire_posis_ex_i: number[] = wire_posis_i.slice();
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    if (is_closed) {
        wire_posis_ex_i.push(wire_posis_ex_i[0]);
    }
    const num_posis: number = wire_posis_ex_i.length;
    // create lists to store posis
    const slice_posis_i: number[][][] = [[], []];
    // analyze the first point
    const dist: number = plane_tjs.distanceToPoint(posi_to_tjs[wire_posis_ex_i[0]]);
    const start_above = dist > 0; // is the first point above the plane?
    const first = start_above ? 0 : 1; // the first list to start adding posis
    const second = 1 - first; // the second list to add posis, after you cross the plane
    let index = first;
    // for each pair of posis, get the posi_i intersection or null
    slice_posis_i[index].push([]);
    for (let i = 0; i < num_posis - 1; i++) {
        const edge_posis_i: [number, number] = [wire_posis_ex_i[i], wire_posis_ex_i[i + 1]];
        edge_posis_i.sort();
        const isect_posi_i: number = edge_to_isect_posis[edge_posis_i[0]][edge_posis_i[1]];
        slice_posis_i[index][slice_posis_i[index].length - 1].push(wire_posis_ex_i[i]);
        if (isect_posi_i !== null) {
            // add posi before cut
            if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                const isect_posi2_i: number = cut_posi_to_copies[isect_posi_i];
                slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi2_i);
                posi_to_copies[isect_posi2_i] = isect_posi2_i;
            } else {
                slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi_i);
                posi_to_copies[isect_posi_i] = isect_posi_i;
            }
            // switch
            index = 1 - index;
            slice_posis_i[index].push([]);
            // add posi after cut
            if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                const isect_posi2_i: number = cut_posi_to_copies[isect_posi_i];
                slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi2_i);
                posi_to_copies[isect_posi2_i] = isect_posi2_i;
            } else {
                slice_posis_i[index][slice_posis_i[index].length - 1].push(isect_posi_i);
                posi_to_copies[isect_posi_i] = isect_posi_i;
            }
        }
    }
    // deal with cases where the entity was not cut
    // make a copy of the ent, with new posis
    if (slice_posis_i[second].length === 0) {
        if ( start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_ABOVE)) {
            return [[_cutCopyEnt(__model__, ent_type, ent_i, wire_posis_i, posi_to_copies)], []];
        } else if ( !start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_BELOW)) {
            return [[], [_cutCopyEnt(__model__, ent_type, ent_i, wire_posis_i, posi_to_copies)]];
        }
        return [[], []];
    }
    // update the lists, to deal with the end cases
    if (is_closed) {
        // add the last list of posis to the the first list of posis
        for (const slice_posi_i of slice_posis_i[index][slice_posis_i[index].length - 1]) {
            slice_posis_i[index][0].push(slice_posi_i);
        }
        slice_posis_i[index] = slice_posis_i[index].slice(0, -1);
    } else {
        // add the last posi to the last list
        slice_posis_i[index][slice_posis_i[index].length - 1].push(wire_posis_ex_i[num_posis - 1]);
    }
    // make the cut entities
    const above: number[] = [];
    const below: number[] = [];
    switch (method) {
        case _ECutMethod.KEEP_BOTH:
        case _ECutMethod.KEEP_ABOVE:
            for (const posis_i of slice_posis_i[0]) {
                if (ent_type === EEntType.PLINE) {
                    const copy_posis_i: number[] = _cutGetPosis(__model__, posis_i, posi_to_copies);
                    above.push( __model__.modeldata.geom.add.addPline(copy_posis_i, false));
                } else {
                    const copy_posis_i: number[] = _cutGetPosis(__model__, posis_i, posi_to_copies);
                    above.push( __model__.modeldata.geom.add.addPgon(copy_posis_i));
                }
            }
            break;
        default:
            break;
    }
    switch (method) {
        case _ECutMethod.KEEP_BOTH:
        case _ECutMethod.KEEP_BELOW:
            for (const posis_i of slice_posis_i[1]) {
                if (ent_type === EEntType.PLINE) {
                    const copy_posis_i: number[] = _cutGetPosis(__model__, posis_i, posi_to_copies);
                    below.push( __model__.modeldata.geom.add.addPline(copy_posis_i, false));
                } else {
                    const copy_posis_i: number[] = _cutGetPosis(__model__, posis_i, posi_to_copies);
                    below.push( __model__.modeldata.geom.add.addPgon(copy_posis_i));
                }
            }
            break;
        default:
            break;
    }
    return [above, below];
}

// ================================================================================================















// // ================================================================================================
// function _polygonHoles(__model__: GIModel, ents_arr: TEntTypeIdx[],
//     holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx {
// if (getArrDepth(holes_ents_arr) === 2) {
//     holes_ents_arr = [holes_ents_arr] as TEntTypeIdx[][];
// }
// const posis_i: number[] = ents_arr.map(ent_arr => ent_arr[1]);
// const holes_posis_i: number[][] = [];
// for (const hole_ents_arr of holes_ents_arr as TEntTypeIdx[][]) {
//     holes_posis_i.push( hole_ents_arr.map(ent_arr => ent_arr[1]) );
// }
// const pgon_i: number = __model__.modeldata.geom.add.addPgon(posis_i, holes_posis_i);
// return [EEntType.PGON, pgon_i];
// }
// /**
// * Adds a single new polygon to the model with one or more holes.
// * @param __model__
// * @param positions List of positions.
// * @param hole_positions List of positions for the holes. For multiple holes, a list of list can provided.
// * @returns Entities, a list of new polygons.
// * @example polygon1 = make.Polygon([position1,position2,position3], [position4,position5,position6])
// * @example_info Creates a polygon with  a hole, with vertices in sequence from position1 to position6.
// */
// function _PolygonHoles(__model__: GIModel, positions: TId[], hole_positions: TId[]|TId[][]): TId {
// // --- Error Check ---
// const pgon_ents_arr = checkIDs(__model__, 'make.Polygon', 'positions', positions, [IDcheckObj.isIDList], [EEntType.POSI]) as TEntTypeIdx[];
// const holes_ents_arr = checkIDs(__model__, 'make.Polygon', 'positions', hole_positions,
//     [IDcheckObj.isIDList, IDcheckObj.isIDList_list], [EEntType.POSI]) as TEntTypeIdx[]|TEntTypeIdx[][];
// // --- Error Check ---
// const new_ent_arr: TEntTypeIdx = _polygonHoles(__model__, pgon_ents_arr, holes_ents_arr);
// console.log(__model__);
// return idsMake(new_ent_arr) as TId;
// }
// // ================================================================================================
// /**
//  * Joins polylines to polylines or polygons to polygons.
//  * ~
//  * New polylins or polygons are created. The original polyline or polygons are not affected.
//  *
//  * @param __model__
//  * @param geometry Polylines or polygons.
//  * @returns Entities, a list of new joined polylines or polygons.
//  * @example joined1 = make.Join([polyline1,polyline2])
//  * @example_info Creates a new polyline by joining polyline1 and polyline2. Geometries must be of the same type.
//  */
// export function _Join(__model__: GIModel, geometry: TId[]): TId {
//     // --- Error Check ---
//     // const ents_arr =  checkIDs(__model__, 'make.Join', 'geometry', geometry, [IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]);
//     // --- Error Check ---
//     throw new Error('Not implemented.'); return null;
// }
