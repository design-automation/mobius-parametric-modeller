// min = __modules__._math.min;
// max = __modules__._math.max;
// pow = Math.pow;
// sqrt = Math.sqrt;
// exp = Math.exp;
// log = Math.log;
// round = __modules__._math.round;
// sigFig = __modules__._math.sigFig;
// ceil = Math.ceil;
// floor = Math.floor;
// abs = Math.abs;
// sin = Math.sin;
// asin = Math.asin;
// sinh = Math.sinh;
// asinh = Math.asinh;
// cos = Math.cos;
// acos = Math.acos;
// cosh = Math.cosh;
// acosh = Math.acosh;
// tan = Math.tan;
// atan = Math.atan;
// tanh = Math.tanh;
// atanh = Math.atanh;
// atan2 = Math.atan2;

import { checkNumArgs } from '../_check_inline_args';

/**
 * Returns the smallest of the given numbers.
 *
 * If any one or more of the parameters cannot be converted into a number, NaN is returned.
 *
 * If no parameters are provided, Infinity is returned.
 *
 * min([5,3,6,2,4])    // 2
 * min(5,3,6,2,4)    // 2
 *
 * @param list A list of numbers, or a sequence of numbers
 */
export function min(debug: boolean, list: any): any {
    if (debug) {
        checkNumArgs('min', arguments, 1);
    }
    const args = Array.prototype.slice.call (arguments, min.length);
    if (args.length === 0) {
        if (list.constructor === [].constructor) {
            return Math.min.apply(Math, list);
        }
        return list;
    }
    args.push(list);
    return Math.min.apply(Math, args);
}
/**
 * Returns the largest  of the given numbers.
 *
 * If any one or more of the parameters cannot be converted into a number, NaN is returned.
 *
 * max([5,3,6,2,4])    // 6
 * max(5,3,6,2,4)    // 6
 *
 * @param list A list of numbers, or a sequence of numbers.
 */
export function max(debug: boolean, list: any): any {
    if (debug) {
        checkNumArgs('max', arguments, 1);
    }
    const args = Array.prototype.slice.call (arguments, min.length);
    if (args.length === 0) {
        if (list.constructor === [].constructor) {
            return Math.max.apply(Math, list);
        }
        return list;
    }
    args.push(list);
    return Math.max.apply(Math, args);
}
/**
 * Returns a number representing the given base taken to the power of the given exponent.
 *
 * @param base  A number or list of numbers.
 * @param xp The exponent used to raise the base.
 */
export function pow(debug: boolean, base: number|number[], xp: number): number|number[] {
    if (debug) {
        checkNumArgs('pow', arguments, 2);
    }
    if (Array.isArray(base)) {
        return base.map( a_num => Math.pow(a_num, xp) ) as number[];
    }
    return Math.pow(base as number, xp);
}
/**
 * Returns the square root of the given number. If the number is negative, NaN is returned.
 *
 * @param num A number or list of numbers.
 */
export function sqrt(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('sqrt', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.sqrt(a_num) ) as number[];
    }
    return Math.sqrt(num as number);
}
/**
 * Returns a number representing e raised to the power of x, where e is Euler's number and x is the argument.
 *
 * @param num A number or list of numbers.
 */
export function exp(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('exp', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.exp(a_num) ) as number[];
    }
    return Math.exp(num as number);
}
/**
 * Returns the natural logarithm (base e) of the given number. If the number is negative, NaN is returned.
 *
 * @param base A number or list of numbers.
 */
export function log(debug: boolean, base: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('log', arguments, 1);
    }
    if (Array.isArray(base)) {
        return base.map( a_num => Math.log(a_num) ) as number[];
    }
    return Math.log(base as number);
}
/**
 * Returns the base 10 logarithm (base e) of the given number. If the number is negative, NaN is returned.
 *
 * @param base A number or list of numbers.
 */
export function log10(debug: boolean, base: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('log10', arguments, 1);
    }
    if (Array.isArray(base)) {
        return base.map( a_num => Math.log10(a_num) ) as number[];
    }
    return Math.log10(base as number);
}
/**
 * The value of the given number rounded to the nearest integer.
 *
 * @param num A number or list of numbers.
 * @param dec_pla The number of decimal places.
 */
export function round(debug: boolean, num: number|number[], dec_pla = 0): number|number[] {
    if (debug) {
        checkNumArgs('round', arguments, 2, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => round(debug, a_num, dec_pla) ) as number[];
    }
    num = num as number;
    if (dec_pla === 0) { return Math.round(num); }
    if (dec_pla > 0) {
        const dec: number = Math.pow(10, dec_pla);
        return Math.round(num * dec) / dec;
    } else {
        const dec: number = Math.pow(10, Math.abs(dec_pla));
        return Math.round(num / dec) * dec;
    }
}
/**
 * Returns the value of the given number converted to the specified number of significant figures.
 *
 * @param num A number or list of numbers.
 * @param sig_figs The number of significant figures.
 */
export function sigFig(debug: boolean, num: number|number[], sig_figs: number): number|number[] {
    if (debug) {
        checkNumArgs('sigFig', arguments, 2);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => sigFig(debug, a_num, sig_figs) ) as number[];
    }
    if (num === 0) { return 0; }
    num = num as number;
    const round_val: number = sig_figs - 1 - Math.floor(Math.log10(Math.abs(num)));
    return round(debug, num, round_val) as number;
    // return parseFloat(num.toPrecision(sig_figs));
}
/**
 * Returns the smallest integer greater than or equal to the given number.
 *
 * ceil(.95);    // 1
 * ceil(4);      // 4
 * ceil(7.004);  // 8
 * ceil(-0.95);  // -0
 * ceil(-4);     // -4
 * ceil(-7.004); // -7
 *
 * @param num A number or list of numbers.
 */
export function ceil(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('ceil', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.ceil(a_num) ) as number[];
    }
    return Math.ceil(num as number);
}
/**
 * Returns the largest integer less than or equal to the specified number.
 *
 * floor( 45.95); //  45
 * floor( 45.05); //  45
 * floor(  4   ); //   4
 * floor(-45.05); // -46
 * floor(-45.95); // -46
 *
 * @param num A number or list of numbers.
 */
export function floor(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('floor', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.floor(a_num) ) as number[];
    }
    return Math.floor(num as number);
}

/**
 * Returns the absolute value of the given number.
 *
 * abs('-1');     // 1
 * abs(-2);       // 2
 * abs(null);     // 0
 * abs('');       // 0
 * abs([]);       // 0
 * abs([2]);      // [2]
 * abs([1,2]);    // [1,2]]
 * abs({});       // NaN
 * abs('string'); // NaN
 * abs();         // NaN
 *
 * @param num A number or list of numbers.
 */
export function abs(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('abs', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.abs(a_num) ) as number[];
    }
    return Math.abs(num as number);
}

/**
 * Returns the sine of the given number.
 *
 * sin(0);           // 0
 * sin(1);           // 0.8414709848078965
 *
 * @param num A number or list of numbers (in radians).
 */
export function sin(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('sin', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.sin(a_num) ) as number[];
    }
    return Math.sin(num as number);
}
/**
 * Returns the arcsine (in radians) of the given number if it's between -1 and 1; otherwise, NaN.
 *
 * asin(-2);  // NaN
 * asin(-1);  // -1.5707963267948966 (-pi/2)
 * asin(0);   // 0
 * asin(0.5); // 0.5235987755982989
 * asin(1);   // 1.5707963267948966 (pi/2)
 * asin(2);   // NaN
 *
 * @param num A number or list of numbers between -1 and 1.
 */
export function asin(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('cos', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.asin(a_num) ) as number[];
    }
    return Math.asin(num as number);
}
/**
 * Returns the hyperbolic sine (in radians) of the given number.
 *
 * sinh(0); // 0
 * sinh(1); // 1.1752011936438014
 *
 * @param num A number or list of numbers (in radians).
 */
export function sinh(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('sinh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.sinh(a_num) ) as number[];
    }
    return Math.sinh(num as number);
}
/**
 * Returns the hyperbolic arcsine of the given number.
 *
 * asinh(1);  // 0.881373587019543
 * asinh(0);  // 0
 *
 * @param num A number or list of numbers.
 */
export function asinh(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('asinh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.asinh(a_num) ) as number[];
    }
    return Math.asinh(num as number);
}
/**
 * Returns the cosine of the given number.
 *
 * cos(0);           // 1
 * cos(1);           // 0.5403023058681398
 * cos(Math.PI);     // -1
 * cos(2 * PI); // 1
 *
 * @param num A number or list of numbers (in radians).
 */
export function cos(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('cos', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.cos(a_num) ) as number[];
    }
    return Math.cos(num as number);
}
/**
 * Returns the arc-cosine (in radians) of the given number between -1 and 1; otherwise, NaN.
 *
 * acos(-2);  // NaN
 * acos(-1);  // 3.141592653589793
 * acos(0);   // 1.5707963267948966
 * acos(0.5); // 1.0471975511965979
 * acos(1);   // 0
 * acos(2);   // NaN
 *
 * @param num A number or list of numbers between -1 and 1.
 */
export function acos(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('acos', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.acos(a_num) ) as number[];
    }
    return Math.acos(num as number);
}
/**
 * Returns the hyperbolic sine (in radians) of the given number.
 *
 * sinh(0); // 0
 * sinh(1); // 1.1752011936438014
 *
 * @param num A number or list of numbers (in radians).
 */
export function cosh(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('cosh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.cosh(a_num) ) as number[];
    }
    return Math.cosh(num as number);
}
/**
 * Returns the hyperbolic arc-cosine of the given number. If the number is less than 1, NaN.
 *
 * acosh(-1);  // NaN
 * acosh(0);   // NaN
 * acosh(0.5); // NaN
 * acosh(1);   // 0
 * acosh(2);   // 1.3169578969248166
 *
 * @param num A number or list of numbers.
 */
export function acosh(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('acosh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.acosh(a_num) ) as number[];
    }
    return Math.acosh(num as number);
}
/**
 * Returns the tangent of the given number.
 *
 * tan(1); // 1.5574077246549023
 *
 * @param num A number or list of numbers (in radians).
 */
export function tan(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('tan', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.tan(a_num) ) as number[];
    }
    return Math.tan(num as number);
}
/**
 * Returns the arc-tangent (in radians) of the given number.
 *
 * atan(1);   // 0.7853981633974483
 * atan(0);   // 0
 * atan(-0);  // -0
 * atan(Infinity);   //  1.5707963267948966
 * atan(-Infinity);  // -1.5707963267948966
 *
 * // The angle that the line [(0,0);(x,y)] forms with the x-axis in a Cartesian coordinate system
 * atan(y / x);
 *
 * @param num A number or list of numbers between -1 and 1.
 */
export function atan(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('atan', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.atan(a_num) ) as number[];
    }
    return Math.atan(num as number);
}
/**
 * Returns the angle in radians (in [-π,π]) between the positive x-axis and the ray from (0,0) to the point
 *
 * atan2([15, 90]]); // 1.4056476493802699
 * atan2([90, 15]]); // 0.16514867741462683
 *
 * @param xy A list of two numbers [x,y] or a list of lists [[x,y], [x,y], [x,y]...].
 */
export function atan2(debug: boolean, xy: [number, number]|[number, number][]): number|number[] {
    if (debug) {
        checkNumArgs('atan2', arguments, 1);
    }
    if (Array.isArray(xy[0])) {
        return (xy as [number, number][]).map( a_xy => Math.atan2(a_xy[1], a_xy[0]) ) as number[];
    }
    xy = xy as [number, number];
    return Math.atan2(xy[1], xy[0]);
}
/**
 * Returns the hyperbolic tangent of the given number.
 *
 * tanh(0);        // 0
 * tanh(Infinity); // 1
 * tanh(1);        // 0.7615941559557649
 *
 * @param num A number or list of numbers (in radians).
 */
export function tanh(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('tanh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.tanh(a_num) ) as number[];
    }
    return Math.tanh(num as number);
}
/**
 * Returns the hyperbolic arc-tangent of the given number.
 *
 * atanh(-2);  // NaN
 * atanh(-1);  // -Infinity
 * atanh(0);   // 0
 * atanh(0.5); // 0.5493061443340548
 * atanh(1);   // Infinity
 * atanh(2);   // NaN
 *
 * @param num A number or list of numbers.
 */
export function atanh(debug: boolean, num: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('atanh', arguments, 1);
    }
    if (Array.isArray(num)) {
        return num.map( a_num => Math.atanh(a_num) ) as number[];
    }
    return Math.atanh(num as number);
}

