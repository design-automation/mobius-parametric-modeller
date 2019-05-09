import { InputType } from '@models/port';

export function PortTypesAware(constructor: Function) {
    constructor.prototype.PortTypes = InputType;

    // array form
    const keys = Object.keys(InputType);
    constructor.prototype.PortTypesArr = keys.slice(keys.length / 2);
}
