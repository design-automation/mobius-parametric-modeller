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


export function strRepl(str: string, search_str: string, new_str: string): string {
    return str.replace(search_str, new_str);
}
export function strUpp(str: string): string {
    return str.toUpperCase();
}
export function strLow(str: string): string {
    return str.toLowerCase();
}
export function strTrim(str: string): string {
    return str.trim();
}
export function strTrimR(str: string): string {
    return str.trimRight();
}
export function strTrimL(str: string): string {
    return str.trimLeft();
}
export function strPadL(str: string, max: number, fill?: string): string {
    return str.padStart(max, fill);
}
export function strPadR(str: string, max: number, fill?: string): string {
    return str.padEnd(max, fill);
}
export function strSub(str: string, from: number, length?: number): string {
    return str.substr(from, length);
}
export function strStarts(str: string, starts: string): boolean {
    return str.startsWith(starts);
}
export function strEnds(str: string, ends: string): boolean {
    return str.endsWith(ends);
}

