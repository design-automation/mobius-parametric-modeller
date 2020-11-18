import { EAttribDataTypeStrs, TAttribDataTypes, EEntType, EFilterOperatorTypes } from '../common';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from './GIAttribMapBase';

/**
 * Geo-info attribute class for one attribute.
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMapDict  extends GIAttribMapBase {
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs) {
        super(modeldata, name, ent_type, data_type);
    }
    //  ===============================================================================================================
    //  Protected methods
    //  ===============================================================================================================
    /**
     * Check that the value is of the correct type for this attribute.
     * @param ent_i
     */
    protected _checkValType(val: TAttribDataTypes): void {
        if (typeof val !== 'object') {
            throw new Error('Error setting attribute value. Attribute is of type "dict" but the value is not a dict.');
        }
    }
    /**
     * Gets the value for a given index.
     * @param ent_i
     */
    protected _getVal(val_i: number): TAttribDataTypes {
        if (val_i === undefined) { return undefined; }
        return this.modeldata.model.metadata.getValFromIdx(val_i, this._data_type); // deep copy
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    protected _getValIdx(val: TAttribDataTypes): number {
        return this.modeldata.model.metadata.getIdxFromKey(this._valToValkey(val), this._data_type);
    }
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    protected _getAddValIdx(val: TAttribDataTypes): number {
        const val_k: string | number = this._valToValkey(val);
        if (this.modeldata.model.metadata.hasKey(val_k, this._data_type)) {
            return this.modeldata.model.metadata.getIdxFromKey(val_k, this._data_type);
        }
        return this.modeldata.model.metadata.addByKeyVal(val_k, val, this._data_type);
    }
    /**
     * Convert a value into a map key
     */
    protected _valToValkey(val: TAttribDataTypes): string|number {
        // if (typeof val !== 'object') {
        //     throw new Error('Value must be of type "object".');
        // }
        return JSON.stringify(val);
    }
    // ============================================================================================
    // Public methods to be overridden
    // ============================================================================================
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
        if (search_val !== null && typeof search_val !== 'object') {
            throw new Error('Query search value "' + search_val + '" is not an dictionary.');
        }
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
                throw new Error('Query error: Operator not allowed with values of type "dict".');
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
    /**
     * Executes a query for an valued in an object, identified by a key
     * @param ents_i
     * @param key The key of the value in the object
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    public queryDictKeyVal(ents_i: number[], key: string,
        operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[] {
        // check the null search case
        if (search_val === null) {
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
                { throw new Error('Query operator "' + operator + '" and query "null" value are incompatible.'); }
            }
        }
        // check
        if (typeof key !== 'string') {
            throw new Error('Query index "' + key + '" must be of type "string".');
        }
        // search        // do the search
        const found_ents_i: number[] = [];
        for (const ent_i of ents_i) {
            const search_value_arr: TAttribDataTypes = this.getEntVal(ent_i) as TAttribDataTypes;
            if (search_value_arr !== undefined) {
                const comp: boolean = this._compare(operator, search_value_arr[key], search_val);
                if ( comp ) {
                    found_ents_i.push(ent_i);
                }
            }
        }
        return found_ents_i;
    }
}
