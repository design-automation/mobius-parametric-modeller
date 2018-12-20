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
