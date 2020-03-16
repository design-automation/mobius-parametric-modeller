/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType, TId, TEntTypeIdx, Txyz } from '@libs/geo-info/common';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { checkIDs, IDcheckObj, TypeCheckObj, checkArgTypes } from '../_check_args';
import Shape from '@doodle3d/clipper-js';
import { isEmptyArr, isPgon, idsMake } from '@assets/libs/geo-info/id';

const SCALE = 1e9;
// Clipper types
export enum _EClipJointType {
    SQUARE = 'jtSquare',
    ROUND = 'jtRound',
    MITER = 'jtMiter'
}
export enum _EClipEndType {
    OPEN_SQUARE = 'etOpenSquare',
    OPEN_ROUND = 'etOpenRound',
    OPEN_BUTT = 'etOpenButt',
    CLOSED_PLINE = 'etClosedLine',
    CLOSED_PGON = 'etClosedPolygon'
}
interface IClipCoord {
    X: number;
    Y: number;
}
type TClipPath = IClipCoord[];
type TClipPaths = TClipPath[];
interface IClipResult {
    closed: boolean;
    paths: TClipPaths;
}
interface IClipOffsetOptions {
    jointType: string;
    endType: string;
    miterLimit?: number;
    roundPrecision?: number;
}
const MClipOffsetEndType: Map<string, string> = new Map([
    ['square_end', _EClipEndType.OPEN_SQUARE],
    ['round_end', _EClipEndType.OPEN_ROUND],
    ['butt_end', _EClipEndType.OPEN_BUTT]
]);
// Function enums
export enum _EOffset {
    SQUARE_END = 'square_end',
    BUTT_END = 'butt_end'
}
export enum _EOffsetRound {
    SQUARE_END = 'square_end',
    BUTT_END = 'butt_end',
    ROUND_END = 'round_end'
}
export enum _EBooleanMethod {
    INTERSECT = 'intersect',
    DIFFERENCE = 'difference',
    SYMMETRIC = 'symmetric'
}
// ================================================================================================
function _getPgons(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const pgons_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.PLINE:
            case EEntType.POINT:
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case EEntType.COLL:
                const coll_pgons_i: number[] = __model__.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    pgons_i.push(coll_pgon_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    pgons_i.push(ent_pgon_i);
                }
                break;
        }
    }
    return pgons_i;
}
function _getPgonsPlines(__model__: GIModel, ents_arr: TEntTypeIdx[]): [number[], number[]] {
    const pgons_i: number[] = [];
    const plines_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case EEntType.POINT:
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case EEntType.COLL:
                const coll_pgons_i: number[] = __model__.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    pgons_i.push(coll_pgon_i);
                }
                const coll_plines_i: number[] = __model__.geom.nav.navCollToPline(ent_i);
                for (const coll_pline_i of coll_plines_i) {
                    plines_i.push(coll_pline_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    pgons_i.push(ent_pgon_i);
                }
                const ent_plines_i: number[] = __model__.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const ent_pline_i of ent_plines_i) {
                    plines_i.push(ent_pline_i);
                }
                break;
        }
    }
    return [pgons_i, plines_i];
}
function _convertPgonToShape(__model__: GIModel, pgon_i: number): Shape {
    const wires_i: number[] = __model__.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
    const shape_coords: TClipPaths = [];
    for (const wire_i of wires_i) {
        const len: number = shape_coords.push([]);
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
            shape_coords[len - 1].push( {X: xyz[0], Y: xyz[1]} );
        }
    }
    const shape: Shape = new Shape(shape_coords, true);
    shape.scaleUp(SCALE);
    return shape;
}
function _convertWireToShape(__model__: GIModel, wire_i: number, is_closed: boolean): Shape {
    const shape_coords: TClipPaths = [];
    shape_coords.push([]);
    const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        shape_coords[0].push( {X: xyz[0], Y: xyz[1]} );
    }
    const shape: Shape = new Shape(shape_coords, is_closed);
    shape.scaleUp(SCALE);
    return shape;
}
function _convertShapeToPgons(__model__: GIModel, shape: Shape): number[] {
    shape.scaleDown(SCALE);
    const sep_shapes: Shape[] = shape.separateShapes();
    const pgons_i: number[] = [];
    for (const sep_shape of sep_shapes) {
        const posis_i: number[][] = [];
        const paths: TClipPaths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) { continue; }
            const len: number = posis_i.push([]);
            for (const coord of path) {
                const posi_i: number = __model__.geom.add.addPosi();
                __model__.attribs.add.setPosiCoords(posi_i, [coord.X, coord.Y, 0]);
                posis_i[len - 1].push(posi_i);
            }
        }
        if (posis_i.length === 0) { continue; }
        const outer_posis_i: number[] = posis_i[0];
        const holes_posis_i: number[][] = posis_i.slice(1);
        const pgon_i: number =  __model__.geom.add.addPgon(outer_posis_i, holes_posis_i);
        pgons_i.push(pgon_i);
    }
    return pgons_i;
}

function _convertShapeToPlines(__model__: GIModel, shape: Shape, is_closed: boolean): number[] {
    shape.scaleDown(SCALE);
    const sep_shapes: Shape[] = shape.separateShapes();
    const plines_i: number[] = [];
    for (const sep_shape of sep_shapes) {
        const paths: TClipPaths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) { continue; }
            const list_posis_i: number[] = [];
            for (const coord of path) {
                const posi_i: number = __model__.geom.add.addPosi();
                __model__.attribs.add.setPosiCoords(posi_i, [coord.X, coord.Y, 0]);
                list_posis_i.push(posi_i);
            }
            if (list_posis_i.length < 2) { continue; }
            const pgon_i: number =  __model__.geom.add.addPline(list_posis_i, is_closed);
            plines_i.push(pgon_i);
        }
    }
    return plines_i;
}
function _unionPgonsToShape(__model__: GIModel, pgons_i: number[]): Shape {
    let result_shape: Shape = null;
    for (const pgon_i of pgons_i) {
        const shape: Shape = _convertPgonToShape(__model__, pgon_i);
        if (result_shape == null) {
            result_shape = shape;
        } else {
            result_shape = result_shape.union(shape);
        }
    }
    return result_shape;
}
function _printPaths(paths: TClipPaths, mesage: string) {
    console.log(mesage);
    for (const path of paths) {
        console.log('    PATH');
        for (const coord of path) {
            console.log('        ', JSON.stringify(coord));
        }
    }
}
// ================================================================================================
/**
 * Create the union of a set of polygons.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can bet extracted.
 * @returns A list of new polygons.
 */
export function Union(__model__: GIModel, entities: TId|TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Union';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PGON]) as TEntTypeIdx[];
    // --- Error Check ---
    const pgons_i: number[] = _getPgons(__model__, ents_arr);
    if (pgons_i.length === 0) { return []; }
    const result_shape: Shape = _unionPgonsToShape(__model__, pgons_i);
    if (result_shape === null) { return []; }
    const all_new_pgons: number[] = _convertShapeToPgons(__model__, result_shape);
    return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
}
// ================================================================================================
/**
 * Perform a boolean operation on a set of polygons.
 * ~
 * The polygons in A and B are first each unioned.
 * The boolean operation is then performed between the unioned A polygons and the unioned B polygons.
 * ~
 * @param __model__
 * @param a_entities A list of polygons, or entities from which polygons can bet extracted.
 * @param b_entities A list of polygons, or entities from which polygons can bet extracted.
 * @param method Enum, the boolean operator to apply.
 * @returns A list of new polygons.
 */
export function Boolean(__model__: GIModel, a_entities: TId|TId[], b_entities: TId|TId[], method: _EBooleanMethod): TId[] {
    a_entities = arrMakeFlat(a_entities) as TId[];
    if (isEmptyArr(a_entities)) { return []; }
    b_entities = arrMakeFlat(b_entities) as TId[];
    if (isEmptyArr(b_entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Boolean';
    const a_ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'a_entities', a_entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PGON]) as TEntTypeIdx[];
    const b_ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'b_entities', b_entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PGON]) as TEntTypeIdx[];
    // --- Error Check ---
    const a_pgons_i: number[] = _getPgons(__model__, a_ents_arr);
    const b_pgons_i: number[] = _getPgons(__model__, b_ents_arr);
    if (a_pgons_i.length === 0) { return []; }
    if (b_pgons_i.length === 0) { return []; }
    const a_shape: Shape = _unionPgonsToShape(__model__, a_pgons_i);
    const b_shape: Shape = _unionPgonsToShape(__model__, b_pgons_i);
    let result_shape: Shape;
    switch (method) {
        case _EBooleanMethod.INTERSECT:
            result_shape = a_shape.intersect(b_shape);
            break;
        case _EBooleanMethod.DIFFERENCE:
            result_shape = a_shape.difference(b_shape);
            break;
        case _EBooleanMethod.SYMMETRIC:
            result_shape = a_shape.xor(b_shape);
            break;
        default:
            break;
    }
    const all_new_pgons: number[] = _convertShapeToPgons(__model__, result_shape);
    return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
}
// ================================================================================================
/**
 * Offset a polyline or polygon, with mitered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param limit Mitre limit
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export function OffsetMitre(__model__: GIModel, entities: TId|TId[], dist: number,
        limit: number, end_type: _EOffset): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetMitre';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'miter_limit', limit, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.MITER,
        endType: MClipOffsetEndType.get(end_type),
        miterLimit: limit / dist
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    // for (const [ent_type, ent_i] of ents_arr) {
    //     const new_pgons_i: number[] = _offset(__model__, ent_type, ent_i, dist, options);
    //     if (new_pgons_i !== null) {
    //         for (const new_pgon_i of new_pgons_i) {
    //             all_new_pgons.push([EEntType.PGON, new_pgon_i]);
    //         }
    //     }
    // }
    return idsMake(all_new_pgons) as TId[];
}
/**
 * Offset a polyline or polygon, with chamfered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export function OffsetChamfer(__model__: GIModel, entities: TId|TId[], dist: number,
        end_type: _EOffset): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetChamfer';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    // --- Error Check ---
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.SQUARE,
        endType: MClipOffsetEndType.get(end_type)
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    // for (const [ent_type, ent_i] of ents_arr) {
    //     const new_pgons_i: number[] = _offset(__model__, ent_type, ent_i, dist, options);
    //     if (new_pgons_i !== null) {
    //         for (const new_pgon_i of new_pgons_i) {
    //             all_new_pgons.push([EEntType.PGON, new_pgon_i]);
    //         }
    //     }
    // }
    return idsMake(all_new_pgons) as TId[];
}
/**
 * Offset a polyline or polygon, with round joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param tolerance The tolerance for the rounded corners.
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export function OffsetRound(__model__: GIModel, entities: TId|TId[], dist: number,
        tolerance: number, end_type: _EOffsetRound): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetRound';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'tolerance', tolerance, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.ROUND,
        endType: MClipOffsetEndType.get(end_type),
        roundPrecision: tolerance * SCALE
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    return idsMake(all_new_pgons) as TId[];
}
function _offsetPgon(__model__: GIModel, pgon_i: number, dist: number, options: IClipOffsetOptions): number[] {
    options.endType = _EClipEndType.CLOSED_PGON;
    const shape: Shape = _convertPgonToShape(__model__, pgon_i);
    const result: IClipResult = shape.offset(dist * SCALE, options);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapeToPgons(__model__, result_shape);
}
function _offsetPline(__model__: GIModel, pline_i: number, dist: number, options: IClipOffsetOptions): number[] {
    const wire_i: number = __model__.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.geom.query.isWireClosed(wire_i);
    if (is_closed) {
        options.endType = _EClipEndType.CLOSED_PLINE;
    }
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed);
    const result: IClipResult = shape.offset(dist * SCALE, options);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapeToPgons(__model__, result_shape);
}
// ================================================================================================
/**
 * Clean a polyline or polygon.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance ???
 * @returns A list of new polygons.
 */
export function Clean(__model__: GIModel, entities: TId|TId[], tolerance: number): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Clean';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'tolerance', tolerance, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    const all_new_pgons: TEntTypeIdx[] = [];
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _cleanPgon(__model__, pgon_i, tolerance);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_plines_i: number[] = _cleanPline(__model__, pline_i, tolerance);
        for (const new_pline_i of new_plines_i) {
            all_new_pgons.push([EEntType.PLINE, new_pline_i]);
        }
    }
    return idsMake(all_new_pgons) as TId[];
}
function _cleanPgon(__model__: GIModel, pgon_i: number, tolerance: number): number[] {
    const shape: Shape = _convertPgonToShape(__model__, pgon_i);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapeToPgons(__model__, result_shape);
}
function _cleanPline(__model__: GIModel, pline_i: number, tolerance: number): number[] {
    const wire_i: number = __model__.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.geom.query.isWireClosed(wire_i);
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapeToPlines(__model__, result_shape, result.closed);
}
