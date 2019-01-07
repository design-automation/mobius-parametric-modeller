import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EAttribNames, EEntityTypeStr} from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';
import { vecsAdd } from '@libs/geom/vectors';
import { checkCommTypes, checkIDs} from './_check_args';
import { rotateMatrix, multMatrix, scaleMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
import { FromEdge } from './vec';

/**
 * Moves geometry by vector.
 * @param __model__
 * @param geometry Position, vertex, edge, wire, face, point, polyline, polygon, collection.
 * @param vector List of three numbers.
 * @returns void
 * @example mod.Move(geometry, vector)
 * @example_info Moves geometry by vector.
 */
export function Move(__model__: GIModel, geometry: TId|TId[], vector: Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Move';
    checkIDs(fn_name, 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'POLYLINE', 'POLYGON', 'COLL']);
    checkCommTypes(fn_name, 'vector', vector, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(geometry)) {
        geometry = [geometry] as TId[];
    }
    const posis_i: number[] = [];
    for (const geom_id of geometry) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geom_id);
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type_str, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = vecsAdd(old_xyz, vector);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
/**
 * Rotates geometry on plane by angle.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin A list of three numbers (or a position, point, or vertex).
 * @param axis A list of three numbers.
 * @param angle Angle (in radians).
 * @returns void
 * @example mod.Rotate(geometry, plane1, PI)
 * @example_info Rotates geometry on plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, geometry: TId|TId[], origin: Txyz|TId, axis: Txyz, angle: number): void {
    // --- Error Check ---
    const fn_name = 'modify.Rotate';
    checkIDs(fn_name, 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // checkCommTypes(fn_name, 'origin', origin, ['isPlane']);
    checkCommTypes(fn_name, 'axis', axis, ['isCoord']);
    checkCommTypes(fn_name, 'angle', angle, ['isNumber']);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(geometry)) {
        geometry = [geometry] as TId[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const [origin_ent_type_str, origin_index]: [EEntityTypeStr, number] = idBreak(origin as TId);
        const origin_posi = __model__.geom.query.navAnyToPosi(origin_ent_type_str, origin_index);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    // rotate all positions
    const posis_i: number[] = [];
    for (const geom_id of geometry) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geom_id);
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type_str, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = rotateMatrix(origin, axis, angle);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
/**
 * Scales geometry on plane by factor.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Plane to scale on.
 * @param scale Scale factor.
 * @returns void
 * @example mod.Scale(geometry, plane1, 0.5)
 * @example_info Scales geometry by 0.5 on plane1.
 */
export function Scale(__model__: GIModel, geometry: TId|TId[], origin: TId|Txyz|TPlane, scale: number|Txyz): void {
    // --- Error Check ---
    const fn_name = 'modify.Scale';
    checkIDs(fn_name, 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // checkCommTypes(fn_name, 'origin', origin, ['isPlane']);
    // checkCommTypes(fn_name, 'scale', scale, ['isNumber']);
    // --- Error Check ---
    // handle geometry type
    if (!Array.isArray(geometry)) {
        geometry = [geometry] as TId[];
    }
    // handle origin type
    if (!Array.isArray(origin)) {
        const [origin_ent_type_str, origin_index]: [EEntityTypeStr, number] = idBreak(origin as TId);
        const origin_posi = __model__.geom.query.navAnyToPosi(origin_ent_type_str, origin_index);
        origin = __model__.attribs.query.getPosiCoords(origin_posi[0]);
    }
    // handle scale type
    if (!Array.isArray(scale)) {
        scale = [scale, scale, scale];
    }
    // scale all positions
    const posis_i: number[] = [];
    for (const geom_id of geometry) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geom_id);
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type_str, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    const matrix: Matrix4 = scaleMatrix(origin, scale);
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = multMatrix(old_xyz, matrix);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
/**
 * Mirrors geometry across plane.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param plane Plane to mirror across.
 * @returns void
 * @example mod.Mirror(geometry, plane)
 * @example_info Mirrors geometry across the plane.
 */
export function Mirror(__model__: GIModel, geometry: TId|TId[], plane: TPlane): void {
    // --- Error Check ---
    const fn_name = 'modify.Mirror';
    checkIDs(fn_name, 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'POLYLINE', 'POLYGON', 'COLL']);
    checkCommTypes(fn_name, 'plane', plane, ['isPlane']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
/**
 * Transforms geometry from one construction plane to another.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from Plane defining target construction plane.
 * @param to Plane defining destination construction plane.
 * @returns void
 * @example mod.XForm(geometry, plane1, plane2)
 * @example_info Transforms geometry from plane1 to plane2.
 */
export function XForm(__model__: GIModel, geometry: TId|TId[], from: TPlane, to: TPlane): void {
    // --- Error Check ---
    const fn_name = 'modify.Mirror';
    checkIDs(fn_name, 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'POLYLINE', 'POLYGON', 'COLL']);
    checkCommTypes(fn_name, 'from', from, ['isPlane']);
    checkCommTypes(fn_name, 'to', to, ['isPlane']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
/**
 * Reverses direction of objects.
 * @param __model__
 * @param objects polyline, polygon, wire
 * @returns void
 * @example mod.Reverse(plane1)
 * @example_info Flips plane1.
 * @example mod.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, objects: TId|TId[]): void {
    // --- Error Check ---
    checkIDs('modify.Reverse', 'objects', objects, ['isID', 'isIDList'], ['PLINE', 'PGON', 'WIRE']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
/**
 * Welds geometry together.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @returns void
 * @example mod.Weld([polyline1,polyline2])
 * @example_info Welds both polyline1 and polyline2 together.
 */
export function Weld(__model__: GIModel, geometry: TId[]): void {
    // --- Error Check ---
    checkIDs('modify.Weld', 'geometry', geometry, ['isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'POLYLINE', 'POLYGON', 'COLL']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
/**
 * Unweld geometries.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @returns void
 * @example mod.Unweld(polyline1,polyline2)
 * @example_info Unwelds polyline1 from polyline2.
 */
export function Unweld(__model__: GIModel, geometry: TId|TId[]): void {
    // --- Error Check ---
    checkIDs('modify.Unweld', 'geometry', geometry, ['isID', 'isIDList'],
            ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'POLYLINE', 'POLYGON', 'COLL']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
/**
 * Closes polylines if open.
 * @param __model__
 * @param lines Polyline(s).
 * @returns void
 * @example mod.Close([polyline1,polyline2])
 * @example_info If open, polylines are changed to closed; if closed, nothing happens.
 */
export function Close(__model__: GIModel, lines: TId|TId[]): void {
    // --- Error Check ---
    checkIDs('modify.Close', 'lines', lines, ['isID', 'isIDList'], ['PLINE']);
    // --- Error Check ---
    if (!Array.isArray(lines)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(lines as TId);
        let wire_i: number = index;
        if (ent_type_str === EEntityTypeStr.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type_str !== EEntityTypeStr.WIRE) {
            throw new Error('Entity is of wrong type. It must be either a polyline or a wire.');
        }
        __model__.geom.add.closeWire(wire_i);
    } else {
        (lines as TId[]).map(line => Close(__model__, line));
    }
}
/**
 * Checks if polyline(s) or wire(s) are closed.
 * @param __model__
 * @param lines Polyline(s) or wire(s).
 * @returns Boolean or list of boolean in input sequence of lines.
 * @example mod.IsClosed([polyline1,polyline2,polyline3])
 * @example_info Returns list [true,true,false] if polyline1 and polyline2 are closed but polyline3 is open.
 */
export function IsClosed(__model__: GIModel, lines: TId|TId[]): boolean|boolean[] {
    // --- Error Check ---
    checkIDs('modify.isClosed', 'lines', lines, ['isID', 'isIDList'], ['PLINE', 'WIRE']);
    // --- Error Check ---
    if (!Array.isArray(lines)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(lines as TId);
        let wire_i: number = index;
        if (ent_type_str === EEntityTypeStr.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type_str !== EEntityTypeStr.WIRE) {
            throw new Error('Entity is of wrong type. It must be either a polyline or a wire.');
        }
        return __model__.geom.query.istWireClosed(wire_i);
    } else {
        return (lines as TId[]).map(line => IsClosed(__model__, line)) as boolean[];
    }
}
/**
 * Deletes geometry.
 * @param __model__
 * @param geometry Position, point, polyline, polygon, collection. Can be a list.
 * @returns void
 * @example mod.Delete(geometry)
 * @example_info Deletes specified geometry from model.
 */
export function Delete(__model__: GIModel, geometry: TId|TId[]  ): void {
    // --- Error Check ---
    checkIDs('modify.Close', 'geometry', geometry, ['isID', 'isIDList'], ['POSI', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
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
 * @param attrib_names Attribute name to be promoted or demoted.
 * @param from Enum, Positions, vertices, edges, wires, faces or collections.
 * @param to Enum, Positions, vertices, edges, wires, faces or collections.
 * @param method Enum, Maximum, minimum, average, mode, median, sum, sum of squares, root mean square, first match or last match.
 * @returns List of attributes.
 * @example attribpro1 = attrib.Promote (colour, positions, faces, sum)
 */
export function AttribPromote(__model__: GIModel, attrib_name: string,
    from: _EPromoteAttribTypes, to: _EPromoteAttribTypes, method: _EPromoteMethod): TId[] {
    // --- Error Check ---
    checkCommTypes('attrib.Promote', 'attrib_name', attrib_name, ['isString']);
    // --- Error Check ---
    throw new Error('Not implemented.');
}

// Collection Add

// Collection Remove

