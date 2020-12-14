/**
 * Returns the number of items in the list, a string, or a dict
 * @param data
 */
export function len(debug: boolean, data: any): number {
    const length: number = data.length;
    if (length !== undefined) { return length; }
    if (data.constructor === Object) {
        return Object.keys(data).length;
    }
    throw new Error(
        'The "len()" function can only be used with lists, dictionaries, and strings.' +
        'The following data is invalid: ' + JSON.stringify(data) + '.'
    );
}
















