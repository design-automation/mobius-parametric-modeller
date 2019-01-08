import { EQueryOperatorTypes, EAttribDataTypeStrs, TAttribDataTypes, IAttribData } from './common';

/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMap {
    private _name: string;
    private _data_type: EAttribDataTypeStrs;
    private _data_size: number;
    // that data in this map
    private _num_vals: number; // count of the number of unique values (including any deleted values)
    private _map_val_k_to_val_i: Map<string|number, number>; // unique, no duplicates
    private _map_val_i_to_val: Map<number, TAttribDataTypes>; // unique, no duplicates
    private _map_val_i_to_ents_i: Map<number, number[]>;
    private _map_ent_i_to_val_i: Map<number, number>;
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(name: string, data_type: EAttribDataTypeStrs, data_size: number) {
        this._name = name;
        this._data_type = data_type;
        this._data_size = data_size;
        // the maps
        this._num_vals = -1;
        this._map_val_k_to_val_i = new Map();
        this._map_val_i_to_val = new Map();
        this._map_val_i_to_ents_i = new Map();
        this._map_ent_i_to_val_i = new Map();
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getData(): IAttribData {
        const _data: Array<[number[], TAttribDataTypes]> = [];
        this._map_val_i_to_ents_i.forEach((ents_i: number[], val_i: number) => {
            const val: TAttribDataTypes = this._map_val_i_to_val.get(val_i);
            _data.push([ents_i, val]);
        });
        return {
            name: this._name,
            data_type: this._data_type,
            data_size: this._data_size,
            data: _data
        };
    }
    /**
     * Adds ent_ities to this attribute from JSON data.
     * The existing attribute data in the model is not deleted.
     * @param attrib_data The JSON data for the new ent_ities.
     */
    public addData(attrib_data: IAttribData, ent_i_offset: number): void {
        if (this._name !== attrib_data.name ||
            this._data_type !== attrib_data.data_type ||
            this._data_size !== attrib_data.data_size) {
            throw Error('Attributes do not match.');
        }
        // increment all the keys by the number of ent_ities in the existing data
        attrib_data.data.forEach( keys_value => {
            const new_keys: number[] = keys_value[0].map(key => key + ent_i_offset);
            const value: TAttribDataTypes = keys_value[1];
            this.setEntVal(new_keys, value);
        });

    }
    /**
     * Returns the name of this attribute.
     */
    public getName(): string {
        return this._name;
    }
    /**
     * Returns the data type of this attribute.
     */
    public getDataType(): EAttribDataTypeStrs {
        return this._data_type;
    }
    /**
     * Returns the data size of this attribute.
     */
    public getDataSize(): number {
        return this._data_size;
    }
    /**
     * Returns true if this value exists in the attributes.
     */
    public hasVal(val: TAttribDataTypes): boolean {
        return this._map_val_k_to_val_i.has(this._valToValkey(val));
    }
    /**
     * Returns true if thereis an entity that has a value (i.e. the value is not undefined).
     */
    public hasEnt(ent_i: number): boolean {
        return this._map_ent_i_to_val_i.has(ent_i);
    }
    /**
     * Sets the value for a given entity or ent_ities.
     * @param ent_i
     * @param val
     */
    public setEntVal(ent_i: number|number[], val: TAttribDataTypes): void {
        const val_k: string | number = this._valToValkey(val);
        let val_i: number;
        if (this._map_val_k_to_val_i.has(val_k)) {
            val_i = this._map_val_k_to_val_i.get(val_k);
        } else {
            this._num_vals += 1;
            val_i = this._num_vals;
            this._map_val_i_to_val.set(val_i, val);
            this._map_val_k_to_val_i.set(val_k, val_i);
            this._map_val_i_to_ents_i.set(val_i, []);
        }
        const ents_i: number[] = (Array.isArray(ent_i)) ? ent_i : [ent_i] ;
        ents_i.forEach(e => this._map_ent_i_to_val_i.set(e, val_i));
        const ents_i_union: number[] = Array.from(new Set([...this._map_val_i_to_ents_i.get(val_i), ...ents_i]));
        this._map_val_i_to_ents_i.set(val_i, ents_i_union);
    }
    /**
     * Gets the value for a given entity.
     * Returns undefined if the entity does not exist
     * @param ent_i
     */
    public getEntVal(ent_i: number): TAttribDataTypes {
        const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
        if (val_i === undefined) { return undefined; }
        return this._map_val_i_to_val.get(val_i);
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * @param val
     */
    public getEntsFromVal(val: TAttribDataTypes): number[] {
        const val_i: number = this._map_val_k_to_val_i.get(this._valToValkey(val));
        if (val_i === undefined) { return undefined; }
        return this._map_val_i_to_ents_i.get(val_i);
    }
    /**
     * Returns an array of entity indicies which do not have a value (undefined)
     */
    public getEntsWithoutVal(ents_i: number[]): number[] {
        return ents_i.filter(ent_i => !this._map_ent_i_to_val_i.has(ent_i));
    }
    /**
     * Returns an array of entity indicies which have a value (not undefined)
     */
    public getEntsWithVal(ents_i: number[]): number[] {
        return ents_i.filter(ent_i => this._map_ent_i_to_val_i.has(ent_i));
    }
    /**
     * Gets an array of values, given an array of entity indicies
     */
    public getEntsVals(ents_i: number[]): TAttribDataTypes[] {
        const vals: TAttribDataTypes[] = [];
        ents_i.forEach( ent_i => {
            const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            if (val_i === undefined) {
                vals.push(null);
            } else {
                const val: TAttribDataTypes = this._map_val_i_to_val.get(val_i);
                vals.push(val);
            }
        });
        return vals;
    }
    /**
     * Executes a query
     * @param ents_i
     * @param val_arr_index The index of the value in the array
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param val_k The string version of the value.
     */
    public queryVal(ents_i: number[], val_arr_index: number, operator: EQueryOperatorTypes, val_k: string): number[] {
        // check the val_arr_index
        const indexed = (val_arr_index !== null && val_arr_index !== undefined);
        if (indexed) {
            if (!Number.isInteger(val_arr_index)) {
                throw new Error('Query index "' + val_arr_index + '" cannot be converted to an integer: ' + val_arr_index);
            }
            if (!(this._data_size > 0))  { throw new Error('Query attribute ' + this._name + ' is not a list.'); }
        }
        // search
        const re_spaces: RegExp = /\s+/g;
        if (val_arr_index === null || val_arr_index === undefined) {
            // in these cases we just leave value_str as a string, but we clean it up
            val_k = val_k.replace(re_spaces, '');
            // in this case we can only use == or !=
            if (operator !== EQueryOperatorTypes.IS_EQUAL && operator !== EQueryOperatorTypes.IS_NOT_EQUAL) {
                { throw new Error('Query operator "' + operator + '" and query "' + val_k + '" value are incompatible.'); }
            }
            if (val_k === 'null' && operator === EQueryOperatorTypes.IS_EQUAL ) {
                return this.getEntsWithoutVal(ents_i);
            } else if (val_k === 'null' && operator === EQueryOperatorTypes.IS_NOT_EQUAL ) {
                return this.getEntsWithVal(ents_i);
            } else if (operator === EQueryOperatorTypes.IS_EQUAL ) {
                const found_keys: number[] = this.getEntsFromVal(val_k);
                if (found_keys === undefined) { return []; }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) !== -1);
            } else if (operator === EQueryOperatorTypes.IS_NOT_EQUAL ) {
                const found_keys: number[] = this.getEntsFromVal(val_k);
                if (found_keys === undefined) { return []; }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) === -1);
            }
        } else { // value_index is defined, so this query is indexing a value in an array
            if (!(this._data_size > 0)) {
                { throw new Error('Query with [index] can only be used on attributes whose data type is a list.'); }
            }
            if (this._data_type === EAttribDataTypeStrs.FLOAT) {
                // a number from an array of numbers
                let val_num: number;
                // first deal with null case
                if (val_k === 'null') { // TODO change to constant
                    if (operator !== EQueryOperatorTypes.IS_EQUAL && operator !== EQueryOperatorTypes.IS_NOT_EQUAL) {
                        { throw new Error('Query operator ' + operator + ' and query "null" value are incompatible.'); }
                    }
                    val_num = null;
                } else { // value_str must be a number
                    val_num = Number.parseFloat(val_k);
                    if (isNaN(val_num)) {
                        throw new Error('Query value "' + val_k + '" cannot be converted to a number: ' + val_k);
                    }
                }
                // do the search
                const found_keys: number[] = [];
                for (const ent_i of ents_i) {
                    const search_value_arr: TAttribDataTypes = this.getEntVal(ent_i) as TAttribDataTypes;
                    if ((search_value_arr !== undefined) &&
                       this._compare(operator, search_value_arr[val_arr_index], val_num) ) {
                        found_keys.push(ent_i);
                    }
                }
                return found_keys;
            } else if (this._data_type === EAttribDataTypeStrs.STRING) {
                // a string from a list of strings
                if (operator !== EQueryOperatorTypes.IS_EQUAL && operator !== EQueryOperatorTypes.IS_NOT_EQUAL) {
                    { throw new Error('Query operator and query value are incompatible.'); }
                }
                // clean up the string
                const value_str_clean: string = val_k.replace(re_spaces, '');
                // do the search
                const found_keys: number[] = [];
                for (const ent_i of ents_i) {
                    const search_value_arr: TAttribDataTypes = this.getEntVal(ent_i) as TAttribDataTypes;
                    if ( this._compare(operator, value_str_clean, search_value_arr[val_arr_index]) ) {
                        found_keys.push(ent_i);
                    }
                }
            }
        }
    }
    //  ===============================================================================================================
    //  Private methods
    //  ===============================================================================================================
    /**
     * Convert a value into a map key
     */
    private _valToValkey(val: TAttribDataTypes): string|number {
        if (typeof val === 'string' || typeof val === 'number') {
            return val;
        }
        return JSON.stringify(val);
    }
    /**
     * Compare two values
     * @param operator
     * @param val1
     * @param val2
     */
    private _compare(operator: EQueryOperatorTypes, val1: any, val2: any): boolean {
        if (val1 === undefined) { val1 = null; }
        if (val2 === undefined) { val2 = null; }
        switch (operator) {
            // ==
            case EQueryOperatorTypes.IS_EQUAL:
                return val1 === val2;
            // !=
            case EQueryOperatorTypes.IS_NOT_EQUAL:
                return val1 !== val2;
            // >
            case EQueryOperatorTypes.IS_GREATER:
                return val1 > val2;
            // >=
            case EQueryOperatorTypes.IS_GREATER_OR_EQUAL:
                return val1 >= val2;
            // <
            case EQueryOperatorTypes.IS_LESS:
                return val1 < val2;
            // <=
            case EQueryOperatorTypes.IS_LESS_OR_EQUAL:
                return val1 <= val2;
            default:
                throw new Error('Query operator not found: ' + operator);
        }
    }
}
