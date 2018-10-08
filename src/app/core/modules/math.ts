/**
 * The <i>Math</i> module provides commonly used mathematical functions.
 * It also provides functions that return a number of constants such as PI and positive and negative infinity.
 */

import * as gs from "gs-json";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
/**
 * Returns the value of PI.
 * @returns Value of pi
 */
export function PI(): number {
    return Math.PI;
}

/**
 * Returns the value of positive infinity
 * @returns Value of positive infinity
 */
export function POS_INF(): number {
    return Number.POSITIVE_INFINITY;
}

/**
 * Returns the value of negative infinity
 * @returns Value of negative infinity
 */
export function NEG_INF(): number {
    return Number.NEGATIVE_INFINITY;
}

//  ===============================================================================================================
//  Math Methods ==================================================================================================
//  ===============================================================================================================

/**
 * Returns the cosine of a specified angle in degrees.
 *
 * @param angle Angle in degrees.
 * @returns Cosine of angle.
 */
export function cos(angle: number): number {
    if (angle === undefined) {throw new Error("Invalid arg: angle must be defined.");}
    return Math.cos(angle*(Math.PI/180));
}

/**
 * Returns the arc cosine (or inverse cosine) of a specified number, converted to degrees.
 *
 * @param num Number.
 * @returns Angle, the arc cosine of num converted to degrees.
 */
export function acos(num: number): number {
    if (num === undefined) {throw new Error("Invalid arg: num must be defined.");}
    return Math.acos(num)*(180/Math.PI);
}

/**
 * Returns the sine of a specified angle in degrees.
 *
 * @param angle Angle in degrees.
 * @returns Sine of angle.
 */
export function sin(angle: number): number {
    if (angle === undefined) {throw new Error("Invalid arg: angle must be defined.");}
    return Math.sin(angle*(Math.PI/180));
}

/**
 * Returns the arc sine (or inverse sine) of a specified number, converted to degrees.
 *
 * @param num Number.
 * @returns Angle, the arc cosine of num converted to degrees.
 */
export function asin(num: number): number {
    if (num === undefined) {throw new Error("Invalid arg: num must be defined.");}
    return Math.asin(num)*(180/Math.PI);
}

/**
 * Returns the tangent of a specified angle in degrees.
 *
 * @param angle Angle in degrees.
 * @returns Tangent of angle.
 */
export function tan(angle: number): number {
    if (angle === undefined) {throw new Error("Invalid arg: angle must be defined.");}
    return Math.tan(angle*(Math.PI/180));
}

/**
 * Returns the arc tangent (or inverse tangent) of a specified number, converted to degrees.
 *
 * @param num Number.
 * @returns Angle, the arc tangent of num converted to degrees.
 */
export function atan(num: number): number {
    if (num === undefined) {throw new Error("Invalid arg: num must be defined.");}
    return Math.atan(num)*(180/Math.PI);
}

/**
 * Returns a number representing the given base taken to the power of the given exponent.
 *
 * @param base Base number.
 * @param exponent Power of exponent.
 * @returns Number representing the given base taken to the power of the given exponent.
 *
 * <h3>Example:</h3>
 * <code>
 * num = Math.pow(2,3)</code><br/><br/>
 * Expected value of num is 8.
 */
export function pow(base: number, exponent: number): number {
    if (base === undefined) {throw new Error("Invalid arg: base must be defined.");}
    if (exponent === undefined) {throw new Error("Invalid arg: exponent must be defined.");}
    return Math.pow(base, exponent);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
/**
 * Rounds a number up to the nearest integer.
 *
 * @param num Number.
 * @returns A number representing the smallest integer more than or equal to the specified number.
 *
 * <h3>Example:</h3>
 * <code>
 * num = Math.ceiling(4.3)</code><br/><br/>
 * Expected value of num is 5.
 */
export function ceiling(num: number): number {
    if (num === undefined) {throw new Error("Invalid arg: num must be defined.");}
    return Math.ceil(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
/**
 * Rounds a number down to the nearest integer.
 *
 * @param num Number.
 * @returns A number representing the largest integer less than or equal to the specified number.
 *
 * <h3>Example:</h3>
 * <code>
 * num = Math.floor(4.3)</code><br/><br/>
 * Expected value of num is 4.
 */
export function floor(num: number): number {
    if (num === undefined) {throw new Error("Invalid arg: num must be defined.");}
    return Math.floor(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
/**
 * Returns the absolute value of a number.
 *
 * Returns num if num is positive, -num if num is negative and 0 if num=0<br/>
 *
 * @param num Number.
 * @returns A number representing the absolute value of the specified number.
 *
 * <h3>Example:</h3>
 * <code>
 * num1 = Math.abs(-1.234)
 * num2 = Math.abs(2.345)<br/>
 * </code><br/><br/>
 * Expected value of num1 is 1.234, and of num2 is 2.345.
 */
export function abs(num: number): number {
    if (num === undefined) {throw new Error("Invalid arg: num must be defined.");}
    return Math.abs(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
/**
 * Returns the largest number in a list of numbers.
 *
 * @param nums List of numbers.
 * @returns A number representing the largest number in specified list of numbers.
 *
 * <h3>Example:</h3>
 * <code>
 * list = [8,9,6,1,3]<br/>
 * num = Math.max(list)</code><br/><br/>
 * Expected value of num is 9.
 */
export function max(nums: number[]): number {
    if (nums === undefined) {throw new Error("Invalid arg: nums must be defined.");}
    let maximum = Number.NEGATIVE_INFINITY;
    for (const num of nums) {
        if(num > maximum) {
            maximum = num;
        }
    }
    return maximum;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
/**
 * Returns the smallest number in a list of numbers.
 *
 * @param num List of numbers.
 * @returns A number representing the smallest number in specified list of numbers.
 *
 * <h3>Example:</h3>
 * <code>
 * list = [8,9,6,1,3]<br/>
 * num = Math.max(list)</code><br/><br/>
 * Expected value of num is 1.
 */
export function min(nums: number[]): number {
    if (nums === undefined) {throw new Error("Invalid arg: nums must be defined.");}
    let minimum = Number.POSITIVE_INFINITY;
    for (const num of nums) {
        if(num < minimum) {
            minimum = num;
        }
    }
    return minimum;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
/**
 * Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive).
 *
 * @returns A pseudo-random number.
 */
export function rand(): number {
    return Math.random();
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
/**
 * Returns a pseudo-random integer number between two numbers.
 *
 * Lower bound number is inclusive and upper bound number is exclusive.
 * @param min Lower bound of range.
 * @param max Upper bound of range.
 * @returns A pseudo-random integer number.
 */
export function randInt(min: number, max: number): number {
    if (min === undefined) {throw new Error("Invalid arg: min must be defined.");}
    if (max === undefined) {throw new Error("Invalid arg: max must be defined.");}
    const lower = Math.ceil(min);
    const upper = Math.floor(max);
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

/**
 * Returns a pseudo-random floating point number between two numbers.
 *
 * @param min Lower bound of range.
 * @param max Upper bound of range.
 * @returns A pseudo-random floating point number.
 */
export function randFloat(min: number, max: number): number {
    if (min === undefined) {throw new Error("Invalid arg: min must be defined.");}
    if (max === undefined) {throw new Error("Invalid arg: max must be defined.");}
    return (Math.random() * (max - min)) + min;
}
