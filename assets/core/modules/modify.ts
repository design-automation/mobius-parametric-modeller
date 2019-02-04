/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, but they may change attribute values.
 * All these functions all return void.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TEntTypeIdx} from '@libs/geo-info/common';
import { getArrDepth, isColl, isPgon, isPline, isPoint, isPosi } from '@libs/geo-info/id';
import { vecAdd } from '@libs/geom/vectors';
import { checkCommTypes, checkIDs} from './_check_args';
import { rotateMatrix, multMatrix, scaleMatrix, mirrorMatrix, xfromSourceTargetMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';

// ================================================================================================
/**
 * Moves entities by vector.
 * @param __model__
 * @param entities Position, vertex, edge, wire, face, point, polyline, polygon, collection.
 * @param vector List of three numbers.
 * @returns void
 * @example modify.Move(position1, [1,1,1])
 * @example_info Moves position1 by [1,1,1].
 */
export function Move(__model__: GIModel, entities: TId|TId[], vector: Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Move';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
                             ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    checkCommTypes(fn_name, 'vector', vector, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = vecAdd(old_xyz, vector);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return;
}
// ================================================================================================
/**
 * Rotates entities on plane by angle.
 * @param __model__
 * @param entities Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin A list of three numbers (or a position, point, or vertex).
 * @param axis A list of three numbers.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 on plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, entities: TId|TId[], origin: Txyz|TId|TPlane, axis: Txyz, angle: number): void {
    // --- Error Check ---
    const fn_name = 'modify.Rotate';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
                            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, ['isOrigin', 'isPlane']);
    checkCommTypes(fn_name, 'axis', axis, ['isXYZlist']);
    checkCommTypes(fn_name, 'angle', angle, ['isNumber']);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const origin_posi = __model__.geom.query.navAnyToPosi(ori_ents_arr[0], ori_ents_arr[1]);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    if (Array.isArray(origin) && Array.isArray(origin[0])) { // handles plane type
        origin = origin[0];
    }
    // rotate all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = rotateMatrix(origin as [number, number, number], axis, angle);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return;
}
// ================================================================================================
/**
 * Scales entities on plane by factor.
 * @param __model__
 * @param entities Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Position, point, vertex, list of three numbers, plane.
 * @param scale Scale factor.
 * @returns void
 * @example modify.Scale(entities, plane1, 0.5)
 * @example_info Scales entities by 0.5 on plane1.
 */
export function Scale(__model__: GIModel, entities: TId|TId[], origin: TId|Txyz|TPlane, scale: number|Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Scale';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
                             ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, ['isOrigin', 'isPlane']);
    checkCommTypes(fn_name, 'scale', scale, ['isNumber', 'isXYZlist']);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const origin_posi = __model__.geom.query.navAnyToPosi(ori_ents_arr[0], ori_ents_arr[1]);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    // handle scale type
    if (!Array.isArray(scale)) {
        scale = [scale, scale, scale];
    }
    // scale all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = scaleMatrix(origin, scale);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
    return;
}
// ================================================================================================
/**
 * Mirrors entities across plane.
 * @param __model__
 * @param entities Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Position, vertex, point, list of three numbers.
 * @param direction Vector or a list of three numbers.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__: GIModel, entities: TId|TId[], origin: Txyz|TId, direction: Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Mirror';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
                     ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'direction', direction, ['isVector']);
    // --- Error Check ---

    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const [origin_ent_type, origin_index]: TEntTypeIdx = ori_ents_arr as TEntTypeIdx;
        const origin_posi = __model__.geom.query.navAnyToPosi(origin_ent_type, origin_index);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    // mirror all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ents as TEntTypeIdx;
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = mirrorMatrix(origin, direction);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
// ================================================================================================
/**
 * Transforms entities from one construction plane to another.
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from Plane defining target construction plane.
 * @param to Plane defining destination construction plane.
 * @returns void
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__: GIModel, entities: TId|TId[], from: TPlane, to: TPlane): void {
    // --- Error Check ---
    const fn_name = 'modify.XForm';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
                             ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    checkCommTypes(fn_name, 'from', from, ['isPlane']);
    checkCommTypes(fn_name, 'to', to, ['isPlane']);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(ents_arr[0])) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }

    // xform all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        const [ent_type, index]: [EEntType, number] = ents as TEntTypeIdx;
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = xfromSourceTargetMatrix(from, to);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
// ================================================================================================
function _reverse(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        wires_i.forEach( wire_i => __model__.geom.modify.reverse(wire_i) );
    } else {
        (ents_arr as TEntTypeIdx[]).forEach( ent_arr => _reverse(__model__, ent_arr) );
    }
}
/**
 * Reverses direction of entities.
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @returns void
 * @example modify.Reverse(face1)
 * @example_info Flips face1 and reverses its normal.
 * @example modify.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, entities: TId|TId[]): void {
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Reverse', 'entities', entities,
        ['isID', 'isIDList'], ['WIRE', 'PLINE', 'FACE', 'PGON'])  as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _reverse(__model__, ents_arr);
}
// ================================================================================================
function _shift(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], offset: number): void {
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const wires_i: number[] = __model__.geom.query.navAnyToWire(ent_type, index);
        wires_i.forEach( wire_i => __model__.geom.modify.shift(wire_i, offset) );
    } else {
        (ents_arr as TEntTypeIdx[]).forEach( ent_arr => _shift(__model__, ent_arr, offset) );
    }
}
/**
 * Reverses direction of entities.
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @returns void
 * @example modify.Reverse(face1)
 * @example_info Flips face1 and reverses its normal.
 * @example modify.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Shift(__model__: GIModel, entities: TId|TId[], offset: number): void {
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Reverse', 'entities', entities,
        ['isID', 'isIDList'], ['WIRE', 'PLINE', 'FACE', 'PGON'])  as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _shift(__model__, ents_arr, offset);
}
// ================================================================================================
function _close(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    if (getArrDepth(ents_arr) === 1 && ents_arr.length) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        let wire_i: number = index;
        if (ent_type === EEntType.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type !== EEntType.WIRE) {
            throw new Error('modify.Close: Entity is of wrong type. It must be either a polyline or a wire.');
        }
        __model__.geom.modify.closeWire(wire_i);
    } else {
        for (const ents of ents_arr) {
            _close(__model__, ents as TEntTypeIdx);
        }
    }
}
/**
 * Closes polyline(s) if open.
 * @param __model__
 * @param lines Polyline(s).
 * @returns void
 * @example modify.Close([polyline1,polyline2,...])
 * @example_info If open, polylines are changed to closed; if already closed, nothing happens.
 */
export function Close(__model__: GIModel, lines: TId|TId[]): void {
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Close', 'lines', lines, ['isID', 'isIDList'], ['PLINE']);
    // --- Error Check ---
    _close(__model__, ents_arr as TEntTypeIdx|TEntTypeIdx[]);
}
// ================================================================================================
// Promote modelling operation
export enum _EPromoteMethod {
    MEAN =  'mean',
    MIN  =  'min',
    MAX = 'max',
    NONE = 'none'
}
// Promote modelling operation
export enum _EPromoteAttribTypes {
    POSIS =  'positions',
    VERTS  =  'vertices',
    EDGES = 'edges',
    WIRES = 'wires',
    FACES = 'faces',
    POINTS = 'points',
    PLINES = 'plines',
    PGONS = 'pgons',
    COLLS = 'collections'
}
/**
 * Promotes or demotes an attribute from one geometry level to another.
 * @param __model__
 * @param attrib_name Attribute name to be promoted or demoted.
 * @param from Enum; Positions, vertices, edges, wires, faces or collections.
 * @param to Enum; Positions, vertices, edges, wires, faces or collections.
 * @param method Enum; Maximum, minimum, average, mode, median, sum, sum of squares, root mean square, first match or last match.
 * @returns void
 * @example promote1 = modify.Promote (colour, positions, faces, sum)
 */
export function _Promote(__model__: GIModel, attrib_name: string,
    from: _EPromoteAttribTypes, to: _EPromoteAttribTypes, method: _EPromoteMethod): void {
    // --- Error Check ---
    // checkCommTypes('attrib.Promote', 'attrib_name', attrib_name, ['isString']);
    // --- Error Check ---
    throw new Error('Not implemented.');
}
// ================================================================================================
/**
 * Welds entities together.
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @returns void
 * @example modify.Weld([polyline1,polyline2])
 * @example_info Welds both polyline1 and polyline2 together. Entities must be of the same type.
 */
export function _Weld(__model__: GIModel, entities: TId[]): void {
    // --- Error Check ---
    // const ents_arr = checkIDs('modify.Weld', 'entities', entities, ['isIDList'],
    //                          ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    throw new Error('Not implemented.');
}
// ================================================================================================
// Stuff for Delete()
export enum _EDeleteMethod {
    DEL_UNUSED_POINTS =  'del_unused_posis',
    KEEP_UNUSED_POINTS  =  'keep_unused_posis'
}
function _delete(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], del_unused_posis: boolean): void {
    ents_arr = ((getArrDepth(ents_arr) === 1) ? [ents_arr] : ents_arr) as TEntTypeIdx[];
    const colls_i: number[] = [];
    const pgons_i: number[] = [];
    const plines_i: number[] = [];
    const points_i: number[] = [];
    const posis_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (isColl(ent_type)) {
            colls_i.push(index);
        } else if (isPgon(ent_type)) {
            pgons_i.push(index);
        } else if (isPline(ent_type)) {
            plines_i.push(index);
        } else if (isPoint(ent_type)) {
            points_i.push(index);
        } else if (isPosi(ent_type)) {
            posis_i.push(index);
        }
    }
    __model__.geom.modify.delColls(colls_i, del_unused_posis);
    __model__.geom.modify.delPgons(pgons_i, del_unused_posis);
    __model__.geom.modify.delPlines(plines_i, del_unused_posis);
    __model__.geom.modify.delPoints(points_i, del_unused_posis);
    __model__.geom.modify.delPosis(posis_i);
}
/**
 * Deletes geometric entities: positions, points, polylines, polygons, and collections.
 * When deleting positions, any topology that requires those positions will also be deleted.
 * (For example, any vertices linked to the deleted position will also be deleted,
 * which may in turn result in some edges being deleted, and so forth.)
 * For positions, the selection to delete or keep unused positions is ignored.
 * When deleting objects (point, polyline, and polygons), topology is also deleted.
 * When deleting collections, none of the objects in the collection are deleted.
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection.
 * @param del_unused_posis Enum, delete or keep unused positions.
 * @returns void
 * @example modify.Delete(polygon1)
 * @example_info Deletes polygon1 from the model.
 */
export function Delete(__model__: GIModel, entities: TId|TId[], del_unused_posis: _EDeleteMethod  ): void {
    // @ts-ignore
    if (Array.isArray(entities)) { entities = entities.flat(); }
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Delete', 'entities', entities,
        ['isID', 'isIDList'], ['POSI', 'POINT', 'PLINE', 'PGON', 'COLL']) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    const bool_del_unused_posis: boolean = (del_unused_posis === _EDeleteMethod.DEL_UNUSED_POINTS);
    _delete(__model__, ents_arr, bool_del_unused_posis);
}
// ================================================================================================
function _keep(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    ents_arr = ((getArrDepth(ents_arr) === 1) ? [ents_arr] : ents_arr) as TEntTypeIdx[];
    const colls_i: Set<number> = new Set();
    const pgons_i: Set<number> = new Set();
    const plines_i: Set<number> = new Set();
    const points_i: Set<number> = new Set();
    const posis_i: Set<number> = new Set();
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: TEntTypeIdx = ent_arr as TEntTypeIdx;
        if (isColl(ent_type)) {
            colls_i.add(index);
            for (const pgon_i of __model__.geom.query.navCollToPgon(index)) {
                pgons_i.add(pgon_i);
            }
            for (const pline_i of __model__.geom.query.navCollToPline(index)) {
                plines_i.add(pline_i);
            }
            for (const point_i of __model__.geom.query.navCollToPoint(index)) {
                points_i.add(point_i);
            }
        } else if (isPgon(ent_type)) {
            pgons_i.add(index);
        } else if (isPline(ent_type)) {
            plines_i.add(index);
        } else if (isPoint(ent_type)) {
            points_i.add(index);
        } else if (isPosi(ent_type)) {
            posis_i.add(index);
        }
    }
    const all_colls_i: number[] = __model__.geom.query.getEnts(EEntType.COLL, false);
    const del_colls_i: number[] = all_colls_i.filter( coll_i => !colls_i.has(coll_i) );
    __model__.geom.modify.delColls(del_colls_i, false);
    const all_pgons_i: number[] = __model__.geom.query.getEnts(EEntType.PGON, false);
    const del_pgons_i: number[] = all_pgons_i.filter( pgon_i => !pgons_i.has(pgon_i) );
    __model__.geom.modify.delPgons(del_pgons_i, false);
    const all_plines_i: number[] = __model__.geom.query.getEnts(EEntType.PLINE, false);
    const del_plines_i: number[] = all_plines_i.filter( pline_i => !plines_i.has(pline_i) );
    __model__.geom.modify.delPlines(del_plines_i, false);
    const all_points_i: number[] = __model__.geom.query.getEnts(EEntType.POINT, false);
    const del_points_i: number[] = all_points_i.filter( point_i => !points_i.has(point_i) );
    __model__.geom.modify.delPoints(del_points_i, false);
    // finally, only del posis that are unused and that are not in the keep list
    const all_unused_posis_i: number[] = __model__.geom.query.getUnusedPosis(false);
    const del_posis_i: number[] = all_unused_posis_i.filter( posi_i => !posis_i.has(posi_i) );
    __model__.geom.modify.delPosis(del_posis_i);
}
/**
 * Keeps the specified geometric entities: positions, points, polylines, polygons, and collections.
 * Everything else in the model is deleted.
 * When a collection is kept, all objects inside the collection are also kept.
 * When an object is kept, all positions used by the object are also kept.
 *
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection.
 * @returns void
 * @example modify.Delete(polygon1)
 * @example_info Deletes polygon1 from the model.
 */
export function Keep(__model__: GIModel, entities: TId|TId[] ): void {
    // @ts-ignore
    if (Array.isArray(entities)) { entities = entities.flat(); }
    // --- Error Check ---
    const ents_arr = checkIDs('modify.Delete', 'entities', entities,
        ['isID', 'isIDList'], ['POSI', 'POINT', 'PLINE', 'PGON', 'COLL']) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    _keep(__model__, ents_arr);
}



// Collection Add Entities

// Collection Remove Remove Entities

// ExtendPline

// ProjectPosition

// Move position along vector (normals)
