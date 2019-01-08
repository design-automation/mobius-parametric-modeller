import * as mathjs from 'mathjs';
import { TId, Txyz, TEdge, EEntStrToAttribMap, EEntityTypeStr, TPlane, TRay } from '@libs/geo-info/common';
import { checkCommTypes, checkIDnTypes, checkIDs } from './_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { idBreak } from '@libs/geo-info/id';
import { vecsSub, vecMakeOrtho, vecNorm, vecsCross } from '@libs/geom/vectors';

/**
 * Vector functions.
 */

/**
 * Sets the length of a vector.
 * @param __model__
 * @param vector Vector or a list of three numbers.
 * @param length Length of the vector to be set.
 * @returns Vector.
 * @example vector1 = vec.SetLength ([2,4,4], 3)
 * @example_info vector1 = [1,2,2]
 */
export function SetLength(vector: Txyz, length: number): Txyz {
    // --- Error Check ---
    const fn_name = 'vector.SetLength';
    checkCommTypes(fn_name, 'vector', vector, ['isVector']);
    checkCommTypes(fn_name, 'length', length, ['isNumber']);
    // --- Error Check ---
    return mathjs.multiply(mathjs.norm(vector), length) as Txyz;
}
/**
 * Gets the length of a vector.
 * @param __model__
 * @param vector Vector or a list of three numbers.
 * @returns Length of the vector.
 * @example length1 = vec.GetLength ([1,2,2])
 * @example_info length1 = 3
 */
export function GetLength(vector: Txyz): number {
    // --- Error Check ---
    checkCommTypes('vector.GetLength', 'vector', vector, ['isVector']);
    // --- Error Check ---
    if (vector === undefined) { throw new Error('Invalid arg: vector must be defined.'); }
    return mathjs.hypot(vector);
}
/**
 * Gets the angle (in radian) between two edges, two vectors, or an edge and a vector.
 * @param __model__
 * @param edgeOrVector1 First edge or vector.
 * @param edgeOrVector2 Second edge or vector.
 * @returns Angle (in radian).
 * @example angle1 = vec.Angle (edgeorvector1, edgeorvector2)
 */
export function Angle(edgeOrVector1: Txyz, edgeOrVector2: Txyz): number {
    // --- Error Check ---
    const fn_name = 'vector.Angle';
    checkIDnTypes(fn_name, 'edgeOrVector1', edgeOrVector1, ['isID', 'isVector'], ['EDGE']);
    checkIDnTypes(fn_name, 'edgeOrVector2', edgeOrVector2, ['isID', 'isVector'], ['EDGE']);
    // --- Error Check ---
    throw new Error('Not impemented.'); return null;
}
/**
 * Gets the cross product of two vectors.
 * @param __model__
 * @param vector1 Vector or a list of three numbers.
 * @param vector2 Vector or a list of three numbers.
 * @returns The vector cross product of two vectors.
 * @example vector3 = vec.Cross(vector1, vector2)
 */
export function Cross(vector1: Txyz, vector2: Txyz): Txyz {
    // --- Error Check ---
    const fn_name = 'vector.Cross';
    checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
    checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
    // --- Error Check ---
    return mathjs.cross(vector1, vector2);
}
/**
 * Returns the dot product of two vectors.
 * @param __model__
 * @param vector1 Vector or a list of three numbers.
 * @param vector2 Vector or a list of three numbers.
 * @returns The scalar dot product of two vectors.
 * @example vector3 = vec.Dot(vector1, vector2)
 */
export function Dot(vector1: Txyz, vector2: Txyz): number {
    // --- Error Check ---
    const fn_name = 'vector.Dot';
    checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
    checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
    // --- Error Check ---
    return mathjs.dot(vector1, vector2);
}
/**
 * Returns a vector along an edge.
 * @param __model__
 * @param edge The id of an edge
 * @returns The vector from the start point of an edge to the end point of an edge
 */
export function EdgeVector(__model__: GIModel, edge_id: TId): Txyz {
    // --- Error Check ---
    checkIDs('vector.EdgeVector', 'edge_id', edge_id, ['isID'], ['EDGE']);
    // --- Error Check ---
    const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(edge_id);
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type_str, index);
    const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return vecsSub(end, start);
}
/**
 * Returns a vector normal to a face.
 * @param __model__
 * @param face_id The id of an face
 * @returns The normal vecotr.
 */
export function FaceNormal(__model__: GIModel, face_id: TId): Txyz {
    // --- Error Check ---
    checkIDs('vector.FaceNormal', 'face_id', face_id, ['isID'], ['FACE']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
/**
 * Returns a vector normal to a vertex of face.
 * @param __model__
 * @param vertex_id The id of an vertex
 * @returns The normal vecotr.
 */
export function VertexNormal(__model__: GIModel, vertex_id: TId): Txyz {
    // --- Error Check ---
    checkIDs('vector.VertexNormal', 'vertex_id', vertex_id, ['isID'], ['VERT']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
/**
 * Returns a plane of a face.
 * @param __model__
 * @param face_id The id of an face
 * @returns The face plane.
 */
export function FacePlane(__model__: GIModel, face_id: TId): TPlane {
    // --- Error Check ---
    checkIDs('vector.FacePlane', 'face_id', face_id, ['isID'], ['FACE']);
    // --- Error Check ---
    throw new Error('Not implemented');
}
/**
 * Create a plane, centered at the origin.
 * @param __model__
 * @param origin position/vertex/point/coordinates
 * @param x_vec vector
 * @param xy_vec vector
 * @returns Plane centered at the origin.
 */
export function Plane(__model__: GIModel, origin: TId|Txyz, x_vec: Txyz, xy_vec: Txyz): TPlane {
    // --- Error Check ---
    const fn_name = 'vector.Plane';
    checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'x_vec', x_vec, ['isVector']);
    checkCommTypes(fn_name, 'xy_vec', xy_vec, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(origin)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(origin as TId);
        const posi_i: number = __model__.geom.query.navAnyToPosi(ent_type_str, index)[0];
        origin = __model__.attribs.query.getPosiCoords(posi_i);
    }
    return [
        origin,
        vecNorm(x_vec),
        vecNorm(vecMakeOrtho(xy_vec, x_vec))
    ];
}
/**
 * Create a ray, centered at the origin.
 * @param __model__
 * @param origin position/vertex/point/coordinates
 * @param dir_vec vector
 * @returns Ray centered at the origin.
 */
export function Ray(__model__: GIModel, origin: TId|Txyz, dir_vec: Txyz): TRay {
    // --- Error Check ---
    const fn_name = 'vector.Ray';
    checkCommTypes(fn_name, 'origin', origin, ['isOrigin']);
    checkCommTypes(fn_name, 'dir_vec', dir_vec, ['isVector']);
    // --- Error Check ---
    if (!Array.isArray(origin)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(origin as TId);
        const posi_i: number = __model__.geom.query.navAnyToPosi(ent_type_str, index)[0];
        origin = __model__.attribs.query.getPosiCoords(posi_i);
    }
    return [
        origin,
        vecNorm(dir_vec)
    ];
}

/**
 * Create a ray, from a plane.
 * The direction will be along the z axis
 * @param __model__
 * @param plane
 * @returns The face plane.
 */
export function PlaneRay(plane: TPlane): TRay {
    // --- Error Check ---
    checkCommTypes('vector.PlaneRay', 'plane', plane, ['isPlane']);
    // --- Error Check ---
    return [plane[0], vecsCross(plane[1], plane[2])];
}
// Add, Sub, Div, Mult Vectors, these should be inline functions


