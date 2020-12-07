/**
 * Functions to work with strings.
 */


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

/**
 * Replace all instances of specified search string with a new string. The search string can be a regular expression.
 * @param str 
 * @param search_str 
 * @param new_str 
 */
export function strRepl(debug: boolean, str: string|string[], search_str: string, new_str: string): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.replace(search_str, new_str)); }
    return str.replace(search_str, new_str);
}
/**
 * Converts all the alphabetic characters in a string to uppercase.
 * @param str 
 */
export function strUpp(debug: boolean, str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.toUpperCase()); }
    return str.toUpperCase();
}
/**
 * Converts all the alphabetic characters in a string to lowercase.
 * @param str 
 */
export function strLow(debug: boolean, str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.toLowerCase()); }
    return str.toLowerCase();
}
/**
 * Removes the leading and trailing white space and line terminator characters from a string.
 * @param str 
 */
export function strTrim(debug: boolean, str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.trim()); }
    return str.trim();
}
/**
 * Removes whitespace from the right end of a string.
 * @param str 
 */
export function strTrimR(debug: boolean, str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.trimRight()); }
    return str.trimRight();
}
/**
 * Removes whitespace from the left end of a string.
 * @param str 
 */
export function strTrimL(debug: boolean, str: string|string[]): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.trimLeft()); }
    return str.trimLeft();
}
/**
 * Pads the start of the s1 string with white spaces so that the resulting string reaches a given length.
 * Pads the start of the s1 string with the s2 string so that the resulting string reaches a given length.
 * @param str 
 * @param max 
 * @param fill 
 */
export function strPadL(debug: boolean, str: string|string[], max: number, fill?: string): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.padStart(max, fill)); }
    return str.padStart(max, fill);
}
/**
 * Pads the end of the s1 string with white spaces so that the resulting string reaches a given length.
 * Pads the end of the s1 string with the s2 string so that the resulting string reaches a given length.
 * @param str 
 * @param max 
 * @param fill 
 */
export function strPadR(debug: boolean, str: string|string[], max: number, fill?: string): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.padEnd(max, fill)); }
    return str.padEnd(max, fill);
}
/**
 * Gets a substring beginning at the specified location.
 * Gets a substring beginning at the specified location and having the specified length.
 * @param str 
 * @param from 
 * @param length 
 */
export function strSub(debug: boolean, str: string|string[], from: number, length?: number): string|string[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.substr(from, length)); }
    return str.substr(from, length);
}
/**
 * Returns true if the string s1 starts with s2, false otherwise.
 * @param str 
 * @param starts 
 */
export function strStarts(debug: boolean, str: string|string[], starts: string): boolean|boolean[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.startsWith(starts)); }
    return str.startsWith(starts);
}
/**
 * Returns true if the string s1 ends with s2, false otherwise.
 * @param str 
 * @param ends 
 */
export function strEnds(debug: boolean, str: string|string[], ends: string): boolean|boolean[] {
    if (Array.isArray(str)) { return str.map(a_str => a_str.endsWith(ends)); }
    return str.endsWith(ends);
}
