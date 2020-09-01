import { getArrDepth2 } from '@assets/libs/util/arrs';

export function radToDeg(rad: number|number[]): number|number[] {
    if (Array.isArray(rad)) { return rad.map(a_rad => radToDeg(a_rad)) as number[]; }
    return rad * (180 / Math.PI);
}
export function degToRad(deg: number|number[]): number|number[] {
    if (Array.isArray(deg)) { return deg.map(a_deg => degToRad(a_deg)) as number[]; }
    return deg * (Math.PI / 180);
}
export function numToStr(num: number|number[], frac_digits?: number, locale?: string): string|string[] {
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
export function numToCurr(num: number|number[], currency: string, locale?: string): string|string[] {
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
