import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EAttribNames, EEntType, TEntTypeIdx} from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';
import { vecAdd } from '@libs/geom/vectors';
import { checkCommTypes, checkIDs} from './_check_args';
import { rotateMatrix, multMatrix, scaleMatrix, mirrorMatrix, xfromSourceTargetMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
import { xformMatrix } from '@libs/triangulate/threex';

// ================================================================================================
/**
 * Moves entities by vector.
 * @param __model__
 * @param entities Position, vertex, edge, wire, face, point, polyline, polygon, collection.
 * @param vector List of three numbers.
 * @returns Modifies the input entities.
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
 * @returns Modifies the input entities.
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 on plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, entities: TId|TId[], origin: Txyz|TId, axis: Txyz, angle: number): void {
    // --- Error Check ---
    const fn_name = 'modify.Rotate';
    let ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
                            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    const ori_ents_arr = checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
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
    // rotate all positions
    const posis_i: number[] = [];
    for (const ents of ents_arr) {
        posis_i.push(...__model__.geom.query.navAnyToPosi(ents[0], ents[1]));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = rotateMatrix(origin, axis, angle);
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
 * @returns Modifies the input entities.
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
 * @returns Modifies the input entities.
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
 * @returns Modifies the input entities.
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__: GIModel, entities: TId|TId[], from: TPlane, to: TPlane): void {
    // --- Error Check ---
    // const fn_name = 'modify.Mirror';
    // const ents_arr = checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'],
    //                          ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // checkCommTypes(fn_name, 'from', from, ['isPlane']);
    // checkCommTypes(fn_name, 'to', to, ['isPlane']);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(entities)) {
        entities = [entities] as TId[];
    }

    // xform all positions
    const posis_i: number[] = [];
    for (const geom_id of entities) {
        const [ent_type, index]: [EEntType, number] = idBreak(geom_id);
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
/**
 * Reverses direction of entities.
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @returns Modifies the input entities.
 * @example modify.Reverse(face1)
 * @example_info Flips face1 and reverses its normal.
 * @example modify.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, entities: TId|TId[]): void {
    // --- Error Check ---
    // const ents_arr = checkIDs('modify.Reverse', 'entities', entities, ['isID', 'isIDList'], ['PLINE', 'PGON', 'WIRE']);
    // --- Error Check ---
    throw new Error('Not implemented.');
}
// ================================================================================================
function _close(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): void {
    if (!Array.isArray(ents_arr[0])) {
        const [ent_type, index]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        let wire_i: number = index;
        if (ent_type === EEntType.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type !== EEntType.WIRE) {
            throw new Error('modify.Close: Entity is of wrong type. It must be either a polyline or a wire.');
        }
        __model__.geom.add.closeWire(wire_i);
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
 * @returns Modifies the input polyline(s).
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
 * @returns Promotes or demotes the attribute.
 * @example promote1 = modify.Promote (colour, positions, faces, sum)
 */
export function Promote(__model__: GIModel, attrib_name: string,
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
 * @returns Modifies the input entities.
 * @example modify.Weld([polyline1,polyline2])
 * @example_info Welds both polyline1 and polyline2 together. Entities must be of the same type.
 */
export function Weld(__model__: GIModel, entities: TId[]): void {
    // --- Error Check ---
    // const ents_arr = checkIDs('modify.Weld', 'entities', entities, ['isIDList'],
    //                          ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    throw new Error('Not implemented.');
}
// ================================================================================================
/**
 * Deletes entities.
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection. Can be a list.
 * @returns Modifies the input entities.
 * @example modify.Delete(polygon1)
 * @example_info Deletes polygon1 from the model.
 */
export function Delete(__model__: GIModel, entities: TId|TId[]  ): void {
    // --- Error Check ---
    // const ents_arr = checkIDs('modify.Close', 'geometry', entities, ['isID', 'isIDList'], ['POSI', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    throw new Error('Not implemented.');
}

// Collection Add Entities

// Collection Remove Remove Entities

// ExtendPline

// ProjectPosition

// Move position along vector (normals)
