/**
 * Functions to work with strings.
 */

import { getArrDepth2 } from "@assets/libs/util/arrs";

// ['strRepl(s,search,new)', 'Replace all instances of specified search string with a new string.'],
// ['strUpp(s), 'Converts all the alphabetic characters in a string to uppercase.']
// ['strLow(s), 'Converts all the alphabetic characters in a string to lowercase.']
// ['strTrim(s), 'Removes the leading and trailing white space and line terminator characters from a string.
// ['strTrimL(s), 'Removes whitespace from the left end of a string.
// ['strTrimR(s), 'Removes whitespace from the right end of a string.
// ['strPadL(s1, m), 'Pads the start of the s1 string with white spaces so that the resulting string reaches a given length.
// ['strPadL(s1, m, s2), 'Pads the start of the s1 string with the s2 string so that the resulting string reaches a given length.
// ['strPadR(s1, m), 'Pads the end of the s1 string with white spaces so that the resulting string reaches a given length.
// ['strPadR(s1, m, s2), 'Pads the end of the s1 string with the s2 string so that the resulting string reaches a given length.
// ['strSub(s, from), 'Gets a substring beginning at the specified location.
// ['strSub(s, from, length), 'Gets a substring beginning at the specified location and having the specified length.
// ['strStarts(s1, s2), 'Returns true if the string s1 starts with s3, false otherwise.
// ['strEnds(s1, s2), 'Returns true if the string s1 ends with s3, false otherwise.


export function strRepl(str: string|string[], search_str: string, new_str: string): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.replace(search_str, new_str)); }
    return str.replace(search_str, new_str);
}
export function strUpp(str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.toUpperCase()); }
    return str.toUpperCase();
}
export function strLow(str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.toLowerCase()); }
    return str.toLowerCase();
}
export function strTrim(str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.trim()); }
    return str.trim();
}
export function strTrimR(str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.trimRight()); }
    return str.trimRight();
}
export function strTrimL(str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.trimLeft()); }
    return str.trimLeft();
}
export function strPadL(str: string|string[], max: number, fill?: string): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.padStart(max, fill)); }
    return str.padStart(max, fill);
}
export function strPadR(str: string|string[], max: number, fill?: string): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.padEnd(max, fill)); }
    return str.padEnd(max, fill);
}
export function strSub(str: string|string[], from: number, length?: number): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.substr(from, length)); }
    return str.substr(from, length);
}
export function strStarts(str: string|string[], starts: string): boolean|boolean[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.startsWith(starts)); }
    return str.startsWith(starts);
}
export function strEnds(str: string|string[], ends: string): boolean|boolean[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.endsWith(ends)); }
    return str.endsWith(ends);
}
