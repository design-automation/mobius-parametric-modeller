import * as mathjs from 'mathjs';
import { TId, Txyz } from '@libs/geo-info/GICommon';

/**
 * Vector functions.
 */

/**
 * Sets the length of a vector.
 * @param __model__
 * @param vector Vector or a list of three numbers.
 * @param length Length of the vector to be set.
 * @returns Vector.
 * @example vector1 = vec.SetLength (vector, length)
 * vector1 = vec.SetLength ([2,4,4], 3)
 *
 * vector1 = [1,2,2]
 */
export function SetLength(vector: TId|Txyz, length: number): Txyz {
    if (vector === undefined) { throw new Error('Invalid arg: vector must be defined.'); }
    if (length === undefined) { throw new Error('Invalid arg: length must be defined.'); }
    return mathjs.multiply(mathjs.norm(vector), length) as Txyz;
}

/**
 * Gets the length of a vector.
 * @param __model__
 * @param vector Vector or a list of three numbers.
 * @returns Length of the vector.
 * @example length1 = vec.GetLength (vector)
 * length1 = vec.GetLength ([1,2,2])
 *
 * length1 = 3
 */
export function GetLength(vector: TId|Txyz): number {
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
export function Angle(edgeOrVector1: TId|Txyz, edgeOrVector2: Txyz): number {
    throw new Error("Not impemented."); return null;
}

/**
 * Gets the cross product of two vectors.
 * @param __model__
 * @param vector1 Vector or a list of three numbers.
 * @param vector2 Vector or a list of three numbers.
 * @returns The vector cross product of two vectors.
 * @example vector3 = vec.Cross(vector1, vector2)
 *
 */
export function Cross(vector1: TId|Txyz, vector2: TId|Txyz): Txyz {
    if (vector1 === undefined) { throw new Error('Invalid arg: vector1 must be defined.'); }
    if (vector2 === undefined) { throw new Error('Invalid arg: vector2 must be defined.'); }
    return mathjs.cross(vector1, vector2);
}

/**
 * Returns the dot product of two vectors.
 * @param __model__
 * @param vector1 Vector or a list of three numbers.
 * @param vector2 Vector or a list of three numbers.
 * @returns The scalar dot product of two vectors.
 * @example vector3 = vec.Dot(vector1, vector2)
 *
 */
export function dot(vector1: TId|Txyz, vector2: TId|Txyz): number {
    if (vector1 === undefined) { throw new Error('Invalid arg: vector1 must be defined.'); }
    if (vector2 === undefined) { throw new Error('Invalid arg: vector2 must be defined.'); }
    return mathjs.dot(vector1, vector2);
}
