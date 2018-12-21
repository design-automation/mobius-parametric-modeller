import * as mathjs from 'mathjs';
import { Txyz } from '@libs/geo-info/GICommon';

/**
 * Vector functions.
 */

/**
 * Returns the cross product of two vectors.
 *
 * @param vector1 A list of three numbers.
 * @param vector2 A list of three numbers.
 * @returns The cross product of two vectors.
 * @example
 *
 */
export function cross(vector1: Txyz, vector2: Txyz): Txyz {
    if (vector1 === undefined) { throw new Error('Invalid arg: vector1 must be defined.'); }
    if (vector2 === undefined) { throw new Error('Invalid arg: vector2 must be defined.'); }
    return mathjs.cross(vector1, vector2);
}

/**
 * Returns the dot product of two vectors.
 *
 * @param vector1 A list of three numbers.
 * @param vector2 A list of three numbers.
 * @returns The dot product of two vectors.
 * @example
 *
 */
export function dot(vector1: Txyz, vector2: Txyz): number {
    if (vector1 === undefined) { throw new Error('Invalid arg: vector1 must be defined.'); }
    if (vector2 === undefined) { throw new Error('Invalid arg: vector2 must be defined.'); }
    return mathjs.dot(vector1, vector2);
}

/**
 * Sets the length of a vector.
 *
 * @param vector A list of three numbers.
 * @example
 *
 */
export function setLength(vector: Txyz, length: number): Txyz {
    if (vector === undefined) { throw new Error('Invalid arg: vector must be defined.'); }
    if (length === undefined) { throw new Error('Invalid arg: length must be defined.'); }
    return mathjs.multiply(mathjs.norm(vector), length) as Txyz;
}


/**
 * Gets the length of a vector.
 *
 * @param vector A list of three numbers.
 * @returns The length of the vector.
 * @example
 *
 */
export function getLength(vector: Txyz): number {
    if (vector === undefined) { throw new Error('Invalid arg: vector must be defined.'); }
    return mathjs.hypot(vector);
}

/**
 * Calculates the angle between two vectors.
 * @param __model__
 * @param vector1
 * @param vector2
 */
export function angle(vector1: Txyz, vector2: Txyz): number {
    throw new Error("Not implemented");
}
