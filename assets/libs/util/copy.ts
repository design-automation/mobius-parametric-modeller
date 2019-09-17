export function deepCopy(obj: any) {
    // Handle the 3 simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') { return obj; }
    // Handle Date
    if (obj instanceof Date) {
        const copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        const copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        const copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) { copy[attr] = deepCopy(obj[attr]); }
        }
        return copy;
    }
    throw new Error('Unable to copy obj! Its type is not supported.');
}
