import { ProcedureTypes } from '@models/procedure';

export function ProcedureTypesAware(constructor: Function) {
    constructor.prototype.ProcedureTypes = ProcedureTypes;

    // array form
    const keys = Object.keys(ProcedureTypes);
    constructor.prototype.ProcedureTypesArr = keys.slice(keys.length / 2);
}
