
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
