import { OutputType } from '@models/port';

export function ViewerTypesAware(constructor: Function) {
    constructor.prototype.ViewerTypes = OutputType;

    // array form
    const keys = Object.keys(OutputType);
    constructor.prototype.ViewerTypesArr = keys.slice(keys.length / 2);
}
