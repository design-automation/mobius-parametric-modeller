import { checkNumArgs } from '../_check_inline_args';

/**
 * Converts radians to degrees.
 *
 * @param rad
 */
export function radToDeg(debug: boolean, rad: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('radToDeg', arguments, 1);
    }
    if (Array.isArray(rad)) { return rad.map(a_rad => radToDeg(debug, a_rad)) as number[]; }
    return rad * (180 / Math.PI);
}
/**
 * Converts degrees to radians.
 *
 * @param deg
 */
export function degToRad(debug: boolean, deg: number|number[]): number|number[] {
    if (debug) {
        checkNumArgs('degToRad', arguments, 1);
    }
    if (Array.isArray(deg)) { return deg.map(a_deg => degToRad(debug, a_deg)) as number[]; }
    return deg * (Math.PI / 180);
}
/**
 * Converts the number to a string, with commas, e.g. 1,234,567
 * Converts the number to a string, with commas, where "d" specifies the number of fraction digits, e.g. 1,234.00.
 * Converts the number to a string, where "d" specifies the number of fraction digits, and "l" specifies the locale, e.g. "en-GB", "fi-FI", "in-IN", "pt-BR", etc'
 *
 * @param num
 * @param frac_digits
 * @param locale
 */
export function numToStr(debug: boolean, num: number|number[], frac_digits?: number, locale?: string): string|string[] {
    if (debug) {
        checkNumArgs('numToStr', arguments, 3, 1);
    }
    if (Array.isArray(num)) {
        for (let i = 0; i < num.length; i++) {
            num[i] = typeof num === 'number' ? num : Number(num);
        }
    } else {
        num = typeof num === 'number' ? num : Number(num);
    }
    const options = {};
    if (frac_digits !== undefined) { options['maximumFractionDigits'] = frac_digits; options['minimumFractionDigits'] = frac_digits; }
    locale = locale === undefined ? 'en-GB' : locale;
    if (Array.isArray(num)) { return num.map(a_num => a_num.toLocaleString(locale, options)) as string[]; }
    return num.toLocaleString(locale, options) as string;
}
/**
 * Converts the number to a string representing currency.
 *
 * @param num
 * @param currency
 * @param locale
 */
export function numToCurr(debug: boolean, num: number|number[], currency: string, locale?: string): string|string[] {
    if (debug) {
        checkNumArgs('numToCurr', arguments, 3, 2);
    }
    if (Array.isArray(num)) {
        for (let i = 0; i < num.length; i++) {
            num[i] = typeof num === 'number' ? num : Number(num);
        }
    } else {
        num = typeof num === 'number' ? num : Number(num);
    }
    const options = {};
    options['style'] = 'currency';
    options['currency'] = currency;
    locale = locale === undefined ? 'en-GB' : locale;
    if (Array.isArray(num)) { return num.map(a_num => a_num.toLocaleString(locale, options)) as string[]; }
    return num.toLocaleString(locale, options) as string;
}
