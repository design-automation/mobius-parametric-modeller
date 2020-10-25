import { EAttribDataTypeStrs, TAttribDataTypes, EEntType, EFilterOperatorTypes } from '../common';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from './GIAttribMapBase';
import * as lodash from 'lodash';

/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMapList  extends GIAttribMapBase {
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs) {
        super(modeldata, name, ent_type, data_type);
        this._data_length = 1;
    }
    /**
     * Gets the value for a given index.
     * @param ent_i
     */
    protected _getVal(val_i: number): TAttribDataTypes {
        if (val_i === undefined) { return undefined; }
        return this.modeldata.model.metadata.getValFromIdx(val_i, this._data_type);
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    protected _getValIdx(val: TAttribDataTypes): number {
        return this.modeldata.model.metadata.getIdxFromKey(this._valToValkey(val), this._data_type);
    }
    /**
     * Returns a nested array of entities and values, like this:
     * [ [[2,4,6,8], 'hello'], [[9,10], 'world']]
     * This is the same format as used in gi-json
     * This matches the method setEntsVals()
     */
    public getData(): [number[], TAttribDataTypes][] {
        const ents_i_values: [number[], TAttribDataTypes][] = [];
        for (const val_i of this._map_val_i_to_ents_i.keys()) {
            const value: TAttribDataTypes = this.modeldata.model.metadata.getValFromIdx(val_i, this._data_type);
            ents_i_values.push([this._mapValToEntsGetArr(val_i), value]);
        }
        return ents_i_values;
    }
    /**
     * Gets the value for a given entity, or an array of values given an array of entities.
     * ~
     * Returns undefined if the entity does not exist in this map.
     * ~
     * If value is a list or dict, it is passed by reference.
     * @param ent_i
     */
    public getEntVal(ent_i: number): TAttribDataTypes {
        const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
        if (val_i === undefined) { return undefined; }
        return this.modeldata.model.metadata.getValFromIdx(val_i, this._data_type);
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    public getEntsFromVal(val: TAttribDataTypes): number[] {
        // const val_i: number = this._map_val_k_to_val_i.get(this._valToValkey(val));
        const val_i: number =  this.modeldata.model.metadata.getIdxFromKey(this._valToValkey(val), this._data_type);
        return this._mapValToEntsGetArr(val_i);
    }
    /**
     * Sets the value for a given entity or entities.
     *
     * If the value is undefined, no action is taken.
     *
     * The value can be null, in which case it is equivalent to deleting the entities from this attrib map.
     *
     * If the ents come from a previous snapshot, then they will be copied.
     *
     * @param ent_i
     * @param val
     */
    public setEntVal(ents_i: number|number[], val: TAttribDataTypes, check_type = true): void {
        // if indefined, do nothing
        if (val === undefined) { return; }
        // if null, delete
        if (val === null) {
            this.delEnt(ents_i);
            return;
        }
        // check the type
        if (check_type) {
            if (this._data_type === EAttribDataTypeStrs.LIST && !Array.isArray(val)) {
                throw new Error('Error setting attribute value. Attribute is of type "list" but the value is not a list.');
            }
        }
        const val_k: string | number = this._valToValkey(val);
        // get the index to the value
        let val_i: number;
        if (this.modeldata.model.metadata.hasKey(val_k, this._data_type)) {
            val_i = this.modeldata.model.metadata.getIdxFromKey(val_k, this._data_type);
        } else {
            val_i = this.modeldata.model.metadata.addByKeyVal(val_k, val, this._data_type);
        }
        // an array of ents
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        // loop through all the unique ents, and set _map_ent_i_to_val_i
        ents_i.forEach( ent_i => {
            // keep the old value for later
            const old_val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            // for each ent_i, set the new val_i
            this._map_ent_i_to_val_i.set(ent_i, val_i);
            // for the value add each ent_i
            this._mapValToEntsAdd(val_i, ent_i);
            // clean up the old val_i
            if (old_val_i !== undefined && old_val_i !== val_i) {
                this._mapValToEntsRem(old_val_i, ent_i);
            }
        });
        // update the _data_length for lists and objects
        const arr_len: number = (val as any[]).length;
        if (arr_len > this._data_length) {
            this._data_length = arr_len;
        }
    }
    /**
     * Executes a query for an indexed valued in a list
     * @param ents_i
     * @param val_arr_idx The index of the value in the array
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    public queryListIdxVal(ents_i: number[], val_arr_idx: number,
            operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[] {
        // check the null search case
        if (search_val === null) {
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
                { throw new Error('Query operator "' + operator + '" and query "null" value are incompatible.'); }
            }
        }
        // check
        if (!Number.isInteger(val_arr_idx)) {
            throw new Error('Query index "' + val_arr_idx + '" must be of type "number", and must be an integer.');
        }
        // search
        return this._searchListIdxVal(ents_i, val_arr_idx, operator, search_val);
    }
    /**
     * Executes a query.
     * ~
     * The value can be NUMBER, STRING, BOOLEAN, LIST or DICT
     * ~
     * @param ents_i
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    public queryVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[] {
        // check the null search case
        if (search_val === null) {
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
                { throw new Error('Query operator "' + operator + '" and query "null" value are incompatible.'); }
            }
        }
        // search
        if (search_val !== null && !Array.isArray(search_val)) {
            throw new Error('Query search value "' + search_val + '" is not a list.');
        }
        return this._searchListVal(ents_i, operator, search_val as any[]);
    }
    /**
     * Searches for the list value using the operator
     */
    protected _searchListVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: any[]): number[] {
        // first deal with null cases
        if (search_val === null && operator === EFilterOperatorTypes.IS_EQUAL ) {
            return this.getEntsWithoutVal(ents_i);
        } else if (search_val === null && operator === EFilterOperatorTypes.IS_NOT_EQUAL ) {
            return this.getEntsWithVal(ents_i);
        }
        // search
        let found_keys: number[];
        switch (operator) {
            case EFilterOperatorTypes.IS_EQUAL:
                found_keys = this.getEntsFromVal(search_val);
                if (found_keys === undefined) { return []; }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) !== -1);
            case EFilterOperatorTypes.IS_NOT_EQUAL:
                found_keys = this.getEntsFromVal(search_val);
                if (found_keys === undefined) { return []; }
                return ents_i.filter(ent_i => found_keys.indexOf(ent_i) === -1);
            case EFilterOperatorTypes.IS_GREATER:
            case EFilterOperatorTypes.IS_GREATER_OR_EQUAL:
            case EFilterOperatorTypes.IS_LESS:
            case EFilterOperatorTypes.IS_LESS_OR_EQUAL:
                found_keys = [];
                for (const ent_i of ents_i) {
                    const val: TAttribDataTypes = this.getEntVal(ent_i) as TAttribDataTypes;
                    if ((val !== null && val !== undefined) && this._compare(operator, val, search_val) ) {
                        found_keys.push(ent_i);
                    }
                }
                return found_keys;
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
    /**
     * Searches for the value using the operator
     */
    protected _searchListIdxVal(ents_i: number[], arr_idx: number, operator: EFilterOperatorTypes, search_val: any): number[] {
        // do the search
        const found_ents_i: number[] = [];
        for (const ent_i of ents_i) {
            const search_value_arr: TAttribDataTypes = this.getEntVal(ent_i) as TAttribDataTypes;
            if (search_value_arr !== undefined) {
                const comp: boolean = this._compare(operator, search_value_arr[arr_idx], search_val);
                if ( comp ) {
                    found_ents_i.push(ent_i);
                }
            }
        }
        return found_ents_i;
    }
    /**
     * Convert a value into a map key
     */
    protected _valToValkey(val: TAttribDataTypes): string|number {
        // if (!Array.isArray(val)) {
        //     throw new Error('Value must be of type "list".');
        // }
        return JSON.stringify(val);
    }
}
