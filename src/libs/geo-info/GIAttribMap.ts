import { BiMapManyToOne } from './BiMap';
import { EQueryOperatorTypes, EAttribDataTypeStrs, TAttribDataTypes, IAttribData } from './common';
//  ===============================================================================================================
//  Classes
//  ===============================================================================================================
/**
 * Geo-info attribute class for one attribute.
 * The attributs are stores as key-value pairs.
 * Multiple keys point to the same values.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequentia arrays.
 * The sequential values would be ["a", "b"]
 * The sequentail keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMap {
    private _name: string;
    private _data_type: EAttribDataTypeStrs;
    private _data_size: number;
    private _bi_map: BiMapManyToOne<TAttribDataTypes>;
    private _num_entities: number; // The maximum number of possible entities for this attribute.
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(name: string, data_type: EAttribDataTypeStrs, data_size: number, num_entities: number) {
        this._name = name;
        this._data_type = data_type;
        this._data_size = data_size;
        this._bi_map = new BiMapManyToOne<TAttribDataTypes>();
        this._num_entities = num_entities;
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getData(): IAttribData {
        return {
            name: this._name,
            data_type: this._data_type,
            data_size: this._data_size,
            data: this._bi_map.getData()
        };
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
    public getDataType(): string {
        return this._data_type;
    }

    /**
     * Returns the data size of this attribute.
     */
    public getDataSize(): number {
        return this._data_size;
    }

    /**
     * Returns the number of entities for this attribute.
     */
    public getNumEntities(): number {
        return this._num_entities;
    }
    /**
     * Adds entities to this attribute from JSON data.
     * The existing attribute data in the model is not deleted.
     * @param attrib_data The JSON data for the new entities.
     */
    public addEntities(attrib_data: IAttribData, num_entities: number): void {
        if (this._name !== attrib_data.name ||
            this._data_type !== attrib_data.data_type ||
            this._data_size !== attrib_data.data_size) {
            throw Error('Attributes do not match.');
        }
        // increment all the keys by the number of entities in the existing data
        attrib_data.data.forEach( keys_value => {
            keys_value[0] = keys_value[0].map(key => key + this._num_entities);
        });
        // add the data with the new keys to the map
        this._bi_map.addData(attrib_data.data);
        // update the total number of entities
        this._num_entities += num_entities;
    }
    /**
     * Sets a single attribute value.
     * @param key
     * @param value
     */
    public set(key: number, value: TAttribDataTypes): void {
        this._bi_map.set(key, value);
    }
    /**
     * Gets a single attribute value.
     * @param key
     */
    public get(key: number): TAttribDataTypes {
        const result: TAttribDataTypes = this._bi_map.getValue(key);
        if (Array.isArray(result)) {
            return result.slice(); // Make a clone of teh array
        }
        return result;
    }
    /**
     * 
     * @param operator
     * @param val1
     * @param val2
     */
    private _compare(operator: EQueryOperatorTypes, val1: any, val2: any): boolean {

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
    /**
     * Executes a query
     * @param value_str The string version of the value.
     * @param value_index The index of the value
     * @param operator The relational operator, ==, !=, <=, >=, etc
     */
    public queryValueStr(value_str: string, operator: EQueryOperatorTypes, value_index: number, search_keys: number[]): number[] {
        // check the index
        const indexed = (value_index !== null && value_index !== undefined);
        if (indexed) {
            if (!Number.isInteger(value_index)) { throw new Error('Query index cannot be converted to an integer: ' + value_index); }
            if (!(this._data_size > 0))  { throw new Error('Query attribute ' + this._name + ' is not a list.'); }
        }
        // get the search keys for the query
        if (search_keys === null || search_keys === undefined) {
            search_keys = this._bi_map.keys();
        } else {
            search_keys = search_keys;
        }
        // search
        const re: RegExp = /\s+/g;
        if (value_index === undefined) {
            // in these cases we just leave value_str as a string, but we clean it up
            value_str = value_str.replace(re, '');
            // in this case we can only use == or !=
            if (operator !== EQueryOperatorTypes.IS_EQUAL && operator !== EQueryOperatorTypes.IS_NOT_EQUAL) {
                { throw new Error('Query operator and query value are incompatible.'); }
            }
            if (value_str === 'null' && operator === EQueryOperatorTypes.IS_EQUAL ) {
                const found_keys: number[] = this._bi_map.getKeysWithoutValue();
                return search_keys.filter(search_key => found_keys.indexOf(search_key) !== -1);
            } else if (value_str === 'null' && operator === EQueryOperatorTypes.IS_NOT_EQUAL ) {
                const found_keys: number[] = this._bi_map.getKeysWithValue();
                return search_keys.filter(search_key => found_keys.indexOf(search_key) !== -1);
            } else if (operator === EQueryOperatorTypes.IS_EQUAL ) {
                const found_keys: number[] = this._bi_map.getKeys(value_str);
                return search_keys.filter(search_key => found_keys.indexOf(search_key) !== -1);
            } else if (operator === EQueryOperatorTypes.IS_NOT_EQUAL ) {
                const found_keys: number[] = this._bi_map.getKeys(value_str);
                return search_keys.filter(search_key => found_keys.indexOf(search_key) === -1);
            }
        } else {
            if (!(this._data_size > 0)) {
                { throw new Error('Query with [index] can only be used on attributes whose data type is a list.'); }
            }
            if (this._data_type === EAttribDataTypeStrs.FLOAT) {
                // a number from an array of numbers
                // value_str must be a number
                const value_num: number = Number.parseFloat(value_str);
                if (isNaN(value_num)) { throw new Error('Query value cannot be converted to a number: ' + value_str); }
                // do the search
                const found_keys: number[] = [];
                for (const search_key of search_keys) {
                    const search_value_arr: TAttribDataTypes = this._bi_map.getValue(search_key);
                    if ((search_value_arr !== undefined) &&
                       this._compare(operator, search_value_arr[value_index], value_num) ) {
                        found_keys.push(search_key);
                    }
                }
                return found_keys;
            } else if (this._data_type === EAttribDataTypeStrs.STRING) {
                // a string from a list of strings
                if (operator !== EQueryOperatorTypes.IS_EQUAL && operator !== EQueryOperatorTypes.IS_NOT_EQUAL) {
                    { throw new Error('Query operator and query value are incompatible.'); }
                }
                // clean up the string
                const value_str_clean: string = value_str.replace(re, '');
                // do the search
                const found_keys: number[] = [];
                for (const search_key of search_keys) {
                    const search_value_arr: TAttribDataTypes = this._bi_map.getValue(search_key);
                    if ( this._compare(operator, value_str_clean, search_value_arr[value_index]) ) {
                        found_keys.push(search_key);
                    }
                }
            }
        }
    }
    /**
     * Gets a list of all the attribute keys, in sequential order.
     * The key vaues are mapped.
     * The key value gets maped to the new list position.
     * The key index gets mapped to the new value.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail keys would be [1,0,,0,1].
     */
    public getSeqKeys(): number[] {
        const seqKeys: number[] = [];
        this._bi_map.getData().forEach( (keys_value, index) => keys_value[0].forEach( key => seqKeys[key] = index ) );
        return seqKeys;
    }
    /**
     * Gets a list of all the attribute values.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail values would be ['a', 'b']
     */
    public getValues(): TAttribDataTypes[] {
        const values: TAttribDataTypes[] = [];
        this._bi_map.getData().forEach( (keys_value, index) => values[index] = keys_value[1]);
        return values;
    }
    /**
     * Gets a list of all the attribute values, in sequential order.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail values would be ['b','a',,'a','b']
     */
    public getSeqValues(): TAttribDataTypes[] {
        const values: TAttribDataTypes[] = this.getValues();
        return this.getSeqKeys().map( key => values[key] );
    }
}
