/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, and they do not change the topology of objects.
 * These functions only change attribute values.
 * All these functions have no return value.
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EEntType, TEntTypeIdx, TRay, IEntSets} from '@libs/geo-info/common';
import { isEmptyArr, idsBreak } from '@assets/libs/geo-info/common_id_funcs';
import { arrMakeFlat, isEmptyArr2 } from '@assets/libs/util/arrs';
import { getRay, getPlane } from './_common';


// ================================================================================================
/**
 * Moves entities. The directio and distance if movement is specified as a vector.
 * ~
 * If only one vector is given, then all entities are moved by the same vector.
 * If a list of vectors is given, the each entity will be moved by a different vector.
 * In this case, the number of vectors should be equal to the number of entities.
 * ~
 * If a position is shared between entites that are being moved by different vectors,
 * then the position will be moved by the average of the vectors.
 * ~
 * @param __model__
 * @param entities An entity or list of entities to move.
 * @param vector A vector or a list of vectors.
 * @returns void
 * @example modify.Move(pline1, [1,2,3])
 * @example_info Moves pline1 by [1,2,3].
 * @example modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )
 * @example_info Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].
 * @example modify.Move([pgon1, pgon2], [1,2,3] )
 * @example_info Moves both pgon1 and pgon2 by [1,2,3].
 */
export function Move(__model__: GIModel, entities: TId|TId[], vectors: Txyz|Txyz[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Move';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
            checkArgs(fn_name, 'vectors', vectors, [ArgCh.isXYZ, ArgCh.isXYZL]);
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.move(ents_arr, vectors);
    }
}
// ================================================================================================
/**
 * Rotates entities on plane by angle.
 * ~
 * @param __model__
 * @param entities  An entity or list of entities to rotate.
 * @param ray A ray to rotate around. \
 * Given a plane, a ray will be created from the plane z axis. \
 * Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \
 * Given any entities, the centroid will be extracted, \
 * and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, entities: TId|TId[], ray: Txyz|TRay|TPlane|TId|TId[], angle: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL],
                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            checkArgs(fn_name, 'angle', angle, [ArgCh.isNum]);
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        ray = getRay(__model__, ray, fn_name) as TRay;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.rotate(ents_arr, ray, angle);
    }
}
// ================================================================================================
/**
 * Scales entities relative to a plane.
 * ~
 * @param __model__
 * @param entities  An entity or list of entities to scale.
 * @param plane A plane to scale around. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param scale Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.
 * @returns void
 * @example modify.Scale(entities, plane1, 0.5)
 * @example_info Scales entities by 0.5 on plane1.
 * @example modify.Scale(entities, plane1, [0.5, 1, 1])
 * @example_info Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
 */
export function Scale(__model__: GIModel, entities: TId|TId[], plane: Txyz|TRay|TPlane|TId|TId[], scale: number|Txyz): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Scale';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL],
                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            checkArgs(fn_name, 'scale', scale, [ArgCh.isNum, ArgCh.isXYZ]);
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.scale(ents_arr, plane, scale);
    }
}
// ================================================================================================
/**
 * Mirrors entities across a plane.
 * ~
 * @param __model__
 * @param entities An entity or list of entities to mirros.
 * @param plane A plane to scale around. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__: GIModel, entities: TId|TId[], plane: Txyz|TRay|TPlane|TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL],
                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.mirror(ents_arr, plane);
    }
}
// ================================================================================================
/**
 * Transforms entities from a source plane to a target plane.
 * ~
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from_plane Plane defining source plane for the transformation. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param to_plane Plane defining target plane for the transformation. \
 * Given a ray, a plane will be generated that is perpendicular to the ray. \
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \
 * Given any entities, the centroid will be extracted, \
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__: GIModel, entities: TId|TId[],
        from_plane: Txyz|TRay|TPlane|TId|TId[], to_plane: Txyz|TRay|TPlane|TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL],
                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        from_plane = getPlane(__model__, from_plane, fn_name) as TPlane;
        to_plane = getPlane(__model__, to_plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.xform(ents_arr, from_plane, to_plane);
    }
}
// ================================================================================================
/**
 * Offsets wires.
 * ~
 * @param __model__
 * @param entities Edges, wires, faces, polylines, polygons, collections.
 * @param dist The distance to offset by, can be either positive or negative
 * @returns void
 * @example modify.Offset(polygon1, 10)
 * @example_info Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
 */
export function Offset(__model__: GIModel, entities: TId|TId[], dist: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Offset';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL],
                [EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            checkArgs(fn_name, 'dist', dist, [ArgCh.isNum]);
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.offset(ents_arr, dist);
    }
}
// ================================================================================================
/**
 * Remesh a face or polygon.
 * ~
 * When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.
 * Remeshing will regenerate the triangulated mesh for the face.
 * Remeshing is not performed automatically as it would degrade performance.
 * Instead, it is left up to the user to remesh only when it is actually required.
 * ~
 * @param __model__
 * @param entities Single or list of faces, polygons, collections.
 * @returns void
 * @example modify.Remesh(polygon1)
 * @example_info Remeshs the face of the polygon.
 */
export function Remesh(__model__: GIModel, entities: TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, 'modify.Remesh', 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.remesh(ents_arr);
    }
}
// ================================================================================================

