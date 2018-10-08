/**
 * The <i>String</i> module provides a set of functions for working with strings.
 * Strings are a data type for representing text, consisting of a sequence of characters.<br/>
 *
 * When instantiating a string, use double quotes as follows: <code>"This is some text."</code>.<br/>
 *
 * Regular expressions can be used to search for character matches in strings.
 */

import * as gs from "gs-json";

//  ===============================================================================================================
//  String functions ==============================================================================================
//  ===============================================================================================================

/**
 * Checks if a string starts with the specified start string.
 *
 * @param str String to check.
 * @param start_str Start tring.
 * @returns True if str starts with search_str, false otherwise.
 *
 * <h3>Example:</h3>
 * <code>
 * string = "Orange"<br/>
 * result = String.startsWith(string,"Or")<br/>
 * </code>
 * <br/>Expected value of result is true.
 */
export function startsWith(str: string, start_str: string): boolean {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    if (start_str === undefined) {throw new Error("Invalid arg: start_str must be defined.");}
    return str.startsWith(start_str);
}

/**
 * Checks if a string ends with a specified end string.
 *
 * @param str String to check.
 * @param end_str End string.
 * @returns True if str ends with search_str, false otherwise.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * result = String.endsWith(string,"ge")<br/></code>
 * <br/>Expected value of result is true.
 */
export function endsWith(str: string, end_str: string): boolean {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    if (end_str === undefined) {throw new Error("Invalid arg: end_str must be defined.");}
    return str.endsWith(end_str);
}

/**
 * Checks if a string contains a specified search string.
 *
 * @param str String to search.
 * @param search_str Sub-string to search for.
 * @returns True if str contains search_str, false otherwise.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * incl = String.includes(string,"an")<br/></code>
 * <br/>Expected value of incl is true.
 */
export function includes(str: string, search_str: string): boolean {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    if (search_str === undefined) {throw new Error("Invalid arg: search_str must be defined.");}
    return str.includes(search_str);
}

/**
 * Returns the number of characters in a string.
 *
 * @param str String to find length of.
 * @returns Length of string.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * length = String.len(string)<br/></code>
 * <br/>Expected value of length is 6.
 */
export function len(str: string): number {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    return str.length;
}

/**
 * Searches for and replaces the specified search string in a string.
 * The search string can also be a regular expression.
 *
 * @param str String.
 * @param search_str Sub-string or regular expression to search for.
 * @param new_str Replacement string.
 * @returns New string with replaced characters.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * newString = String.Replace(string,"O","Ar")<br/></code>
 * <br/>Expected value of newString is "Arrange".
 */
export function replace(str: string, search_str: string, new_str: string): string {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    if (search_str === undefined) {throw new Error("Invalid arg: search_str must be defined.");}
    if (new_str === undefined) {throw new Error("Invalid arg: new_str must be defined.");}
    return str.replace(search_str, new_str);
}

/**
 * Returns the position index of the first occurance of the specified search string within a string.
 * If the specified sub-string cannot be found, then returns -1.
 *
 * @param str String to check.
 * @param search_str Sub-string or regular expression to search for.
 * @returns Number that represents position of search_str in str.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * search = String.search(string,"e")<br/></code>
 * <br/>Expected value of search is 5.
 */
export function search(str: string, search_str: string): number {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    if (search_str === undefined) {throw new Error("Invalid arg: search_str must be defined.");}
    return str.search(search_str);
}

/**
 * Splits a string into a list of substrings using a specified separator string.
 *
 * @param str String.
 * @param separator String of characters used to split string.
 * @returns List of substrings.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * split = String.split(string,"a")<br/></code>
 * <br/>Expected value of split is ["Or","nge"].
 */
export function split(str: string, separator: string): string[] {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    if (separator === undefined) {throw new Error("Invalid arg: separator must be defined.");}
    return str.split(separator);
}

/**
 * Extracts characters in a string between two specified indices and returns it as a new string.
 * Start index is inclusive and end index is exclusive.
 *
 * @param str String.
 * @param start Zero-based index to start extracting characters (inclusive).
 * @param end Zero-based index to stop extracting characters (exclusive).
 * @returns New string with extracted characters.
 *
 * <h3>Example:</h3>
 * <code>string = "Orange"<br/>
 * substring = String.substring(string,1,4)<br/></code>
 * <br/>Expected value of ends is "ran".
 */
export function substring(str: string, start: number, end: number): string {
    if (str === undefined) {throw new Error("Invalid arg: str must be defined.");}
    return str.substring(start,end);
}
