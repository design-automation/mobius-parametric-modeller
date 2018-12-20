/**
 * General math functions.
 */

/**
 *
 */

/**
 * Returns a number representing the given base taken to the power of the given exponent.
 *
 * @param base Base number.
 * @param exponent Power of exponent.
 * @returns Number representing the given base taken to the power of the given exponent.
 * @example num = Math.pow(2,3)
 *
 * Expected value of num is 8.
 */
export function pow(base: number, exponent: number): number {
    if (base === undefined) { throw new Error('Invalid arg: base must be defined.'); }
    if (exponent === undefined) { throw new Error('Invalid arg: exponent must be defined.'); }
    return Math.pow(base, exponent);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
/**
 * Returns the square root of a number.
 *
 * @param num Number.
 * @returns The square root.
 */
export function sqrt(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: nums must be defined.'); }
    return Math.sqrt(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log
/**
 * Returns  the natural logarithm (base e) of a number.
 *
 * @param num Number.
 * @returns The natural logarithm (base e).
 */
export function log(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: nums must be defined.'); }
    return Math.log(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10
/**
 * Returns the logarithm (base 10) of a number.
 *
 * @param num Number.
 * @returns The logarithm (base 10).
 */
export function log10(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: nums must be defined.'); }
    return Math.log10(num);
}

/*

rand********************************************************************************************************************

*/

/**
 * Functions for generating pseudo-random numbers.
 */

/**
 *
 */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
/**
 * Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive).
 *
 * @returns A pseudo-random number.
 */
export function randNum(): number {
    return Math.random();
}

/**
 * Returns a pseudo-random integer number between two numbers.
 *
 * Lower bound number is inclusive and upper bound number is exclusive.
 * @param lower Lower inclusive bound of range.
 * @param upper Upper inclusive bound of range.
 * @returns A pseudo-random integer number.
 */
export function randIntMinMax(lower: number, upper: number): number {
    if (lower === undefined) { throw new Error('Invalid arg: lower must be defined.'); }
    if (upper === undefined) { throw new Error('Invalid arg: upper must be defined.'); }
    lower = Math.ceil(lower);
    upper = Math.floor(upper);
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

/**
 * Returns a pseudo-random floating point number between two numbers.
 *
 * @param lower Lower bound of range.
 * @param upper Upper bound of range.
 * @returns A pseudo-random floating point number.
 */
export function randNumMinMax(lower: number, upper: number): number {
    if (lower === undefined) { throw new Error('Invalid arg: lower must be defined.'); }
    if (upper === undefined) { throw new Error('Invalid arg: upper must be defined.'); }
    return (Math.random() * (upper - lower)) + lower;
}

/*

Round*******************************************************************************************************************

*/

/**
 * Rounding functions.
 */

/**
 *
 */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
/**
 * Returns the value of a number rounded to the nearest integer.
 *
 * @param num Number.
 * @returns The nearest integer.
 * @example num = Math.round(4.5)
 *
 * Expected value of num is 5.
 */
export function nearest(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.round(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
/**
 * Rounds a number up to the nearest integer.
 *
 * @param num Number.
 * @returns The smallest integer more than or equal to the specified number.
 * @example num = Math.ceiling(4.3)
 *
 * Expected value of num is 5.
 */
export function ceil(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.ceil(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
/**
 * Rounds a number down to the nearest integer.
 *
 * @param num Number.
 * @returns The largest integer less than or equal to the specified number.
 * @example num = Math.floor(4.3)
 *
 * Expected value of num is 4.
 */
export function floor(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.floor(num);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
/**
 * Returns the absolute value of a number.
 *
 * Returns num if num is positive, -num if num is negative and 0 if num=0<br/>
 *
 * @param num Number.
 * @returns The absolute value of the specified number.
 * @example num1 = Math.abs(-1.234)
 * num2 = Math.abs(2.345)
 *
 * Expected value of num1 is 1.234, and of num2 is 2.345.
 */
export function abs(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.abs(num);
}

/*

stats*******************************************************************************************************************

*/

/**
 * Statistics functions.
 *
 */

/**
 * http://mathjs.org/docs/reference/functions.html#statistics-functions
 */

import * as mathjs from 'mathjs';

/**
 * Compute the median absolute deviation of an list of numbers.
 * @param nums List of numbers.
 * @returns Median.
 */
export function mad(nums: number[]): number {
    return mathjs.mad(nums);
}

/**
 * Compute the mean value of an list of numbers.
 * @param nums List of numbers.
 * @returns Mean.
 */
export function mean(nums: number[]): number {
    return mathjs.mean(nums);
}

/**
 * Compute the median value of an list of numbers.
 * @param nums List of numbers.
 * @returns Median.
 */
export function median(nums: number[]): number {
    return mathjs.median(nums);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
/**
 * Returns the largest number in a list of numbers.
 *
 * @param nums List of numbers.
 * @returns The largest number in specified list of numbers.
 * @example list = [8,9,6,1,3]
 * num = Math.max(list)
 *
 * Expected value of num is 9.
 */
export function max(nums: number[]): number {
    if (nums === undefined) { throw new Error('Invalid arg: nums must be defined.'); }
    return Math.max(...nums);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
/**
 * Returns the smallest number in a list of numbers.
 *
 * @param nums List of numbers.
 * @returns The smallest number in specified list of numbers.
 * @example nums = [8,9,6,1,3]
 * num = Math.min(nums)
 *
 * Expected value of num is 1.
 */
export function min(nums: number[]): number {
    if (nums === undefined) { throw new Error('Invalid arg: nums must be defined.'); }
    return Math.min(...nums);
}

/**
 * Compute the mode of an list of numbers.
 * @param nums List of numbers.
 * @returns Mode.
 */
export function mode(nums: number[]): number {
    return mathjs.mode(nums);
}

/**
 * Compute the product of an list of numbers.
 * @param nums List of numbers.
 * @returns Product.
 */
export function product(nums: number[]): number {
    return mathjs.prod(nums);
}

/**
 * Compute the standard deviation of an list of numbers.
 * @param nums List of numbers.
 * @returns Standard deviation.
 */
export function std(nums: number[]): number {
    return mathjs.std(nums);
}

/**
 * Compute the sum of an list of numbers.
 * @param nums List of numbers.
 * @returns Sum.
 */
export function sum(nums: number[]): number {
    return mathjs.sum(nums);
}

/**
 * Compute the variance of an list of numbers.
 * @param nums List of numbers.
 * @returns Variance.
 */
export function variance(nums: number[]): number {
    return mathjs.var(nums);
}

/*

Trig********************************************************************************************************************

*/

/**
 * Trigonometric functions
 */

/**
 *
 */

/**
 * Returns the sine of an angle (in degrees).
 *
 * @param angle Angle in degrees.
 * @returns Sine of angle.
 */
export function sin(angle: number): number {
    if (angle === undefined) { throw new Error('Invalid arg: angle must be defined.'); }
    return Math.sin( angle * (Math.PI / 180) );
}

/**
 * Returns the arc-sine (or inverse sine) (in degrees) of a number.
 *
 * @param num Number.
 * @returns Angle, the arc-cosine (in degrees) of num.
 */
export function asin(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.asin(num) * (180 / Math.PI);
}

/**
 * Returns the hyperbolic sine (in degrees) of a number.
 *
 * @param num Number.
 * @returns Hyperbolic sine of a number.
 */
export function sinh(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.sinh(num) * (180 / Math.PI);
}

/**
 * Returns the hyperbolic arcsine (in degrees) of a number.
 *
 * @param num Number.
 * @returns Hyperbolic arcsine of number.
 */
export function asinh(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.sinh(num) * (180 / Math.PI);
}

/**
 * Returns the cosine of an angle (in degrees).
 *
 * @param angle Angle in degrees.
 * @returns Cosine of angle.
 */
export function cos(angle: number): number {
    if (angle === undefined) { throw new Error('Invalid arg: angle must be defined.'); }
    return Math.cos(angle * (Math.PI / 180));
}

/**
 * Returns the arc cosine (or inverse cosine) (in degrees) of a number.
 *
 * @param num Number.
 * @returns Angle, the arc cosine of num converted to degrees.
 */
export function acos(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.acos(num) * (180 / Math.PI);
}

/**
 * Returns the hyperbolic cosine (in degrees) of a number.
 *
 * @param num Number.
 * @returns Hyperbolic cosine of a number.
 */
export function cosh(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.cosh(num) * (180 / Math.PI);
}

/**
 * Returns the hyperbolic arc-cosine (in degrees) of a number.
 *
 * @param num Number.
 * @returns Hyperbolic arc-cosine of number.
 */
export function acosh(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.acosh(num) * (180 / Math.PI);
}

/**
 * Returns the tangent of an angle (in degrees).
 *
 * @param angle Angle in degrees.
 * @returns Tangent of angle.
 */
export function tan(angle: number): number {
    if (angle === undefined) { throw new Error('Invalid arg: angle must be defined.'); }
    return Math.tan(angle * (Math.PI / 180));
}

/**
 * Returns the arc tangent (or inverse tangent) (in degrees) of a number.
 *
 * @param num Number.
 * @returns Angle, the arc tangent of num converted to degrees.
 */
export function atan(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.atan(num) * (180 / Math.PI);
}

/**
 * Returns the arctangent (in degrees) of the quotient of its arguments.
 *
 * @param num1 Number.
 * @param num2 Number.
 * @returns Angle, the arc tangent of num converted to degrees.
 */
export function atan2(num1: number, num2: number): number {
    if (num1 === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    if (num2 === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.atan2(num1, num2) * (180 / Math.PI);
}

/**
 * Returns the hyperbolic tangent (in degrees) of a number.
 *
 * @param num Number.
 * @returns Hyperbolic tangent of a number.
 */
export function tanh(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.tanh(num) * (180 / Math.PI);
}

/**
 * Returns the hyperbolic arctangent (in degrees) of a number.
 *
 * @param num Number.
 * @returns Hyperbolic arctangent of number.
 */
export function atanh(num: number): number {
    if (num === undefined) { throw new Error('Invalid arg: num must be defined.'); }
    return Math.atanh(num) * (180 / Math.PI);
}
