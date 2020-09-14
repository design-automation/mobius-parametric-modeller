import { EFilterOperatorTypes, EAttribDataTypeStrs, TAttribDataTypes, IAttribJSONData, EEntType } from './common';
import { arrRem } from '../util/arrs';
import { GIModelData } from './GIModelData';
import * as lodash from 'lodash';
import { cloneDeepMapArr } from './common_func';

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
    protected _modeldata: GIModelData;
    protected _name: string;
    protected _ent_type: EEntType;
    protected _data_type: EAttribDataTypeStrs;
    protected _data_length: number;
    // the two data maps that store attrib pointers
    // private _map_val_k_to_val_i: Map<string|number, number>; // unique, no duplicates
    // private _map_val_i_to_val: Map<number, TAttribDataTypes>; // unique, no duplicates
    protected _map_val_i_to_ents_i: Map<number, number[]>;
    protected _map_ent_i_to_val_i: Map<number, number>;
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs) {
        this._modeldata = modeldata;
        this._name = name;
        this._ent_type = ent_type;
        this._data_type = data_type;
        if (data_type === EAttribDataTypeStrs.LIST || data_type === EAttribDataTypeStrs.DICT) {
            this._data_length = 0;
        } else {
            this._data_length = 1;
        }
        // the maps
        this._map_val_i_to_ents_i = new Map();
        this._map_ent_i_to_val_i = new Map();
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getJSONData(): IAttribJSONData {
        return {
            name: this._name,
            data_type: this._data_type,
            data_length: this._data_length,
            data: Array.from(this._map_val_i_to_ents_i)
        };
    }
    /**
     * Sets the JSON data for this attribute.
     * Any existing data is deleted.
     */
    public setJSONData(attrib_data: IAttribJSONData): void {
        this._name = attrib_data.name;
        this._data_type = attrib_data.data_type;
        this._data_length = attrib_data.data_length;
        this._map_val_i_to_ents_i = new Map(attrib_data.data);
        this._map_ent_i_to_val_i = new Map();
        this._map_val_i_to_ents_i.forEach( (ents_i, val_i) => {
            ents_i.forEach( ent_i => {
                this._map_ent_i_to_val_i.set(ent_i, val_i);
            });
        });
    }
    /**
     * Gets the name of this attribute.
     */
    public getName(): string {
        return this._name;
    }
    /**
     * Sets the name of this attribute.
     */
    public setName(name: string): void {
        this._name = name;
    }
    /**
     * Returns the data type of this attribute.
     */
    public getDataType(): EAttribDataTypeStrs {
        return this._data_type;
    }
    /**
     * Returns the length of the data.
     * ~
     * If _data_type is NUMBER, STRING, BOOLEAN, then length = 1
     * ~
     * If _data_type is LIST, length is the list of the longest length, can be 0
     * ~
     * If _data_type is OBJECT, length is the obect with the longest Object.keys, can be 0
     */
    public getDataLength(): number {
        return this._data_length;
    }
    // /**
    //  * Returns true if the data has non null/undefined value.
    //  */
    // public hasNonNullVal(): boolean {
    //     return this._num_vals > 0;
    // }
    // /**
    //  * Returns true if this value exists in the attributes.
    //  */
    // public hasVal(val: TAttribDataTypes): boolean {
    //     return this._map_val_k_to_val_i.has(this._valToValkey(val));
    // }
    /**
     * Returns true if there is an entity that has a value (i.e. the value is not undefined).
     */
    public hasEnt(ent_i: number): boolean {
        return this._map_ent_i_to_val_i.has(ent_i);
    }
    /**
     * Returns the number of entities that have a value (i.e. is not undefined).
     */
    public numEnts(): number {
        return this._map_ent_i_to_val_i.size;
    }
    /**
     * Returns the number of values.
     */
    public numVals(): number {
        return this._map_val_i_to_ents_i.size;
    }
    /**
     * Returns the IDs of all ents that have a value.
     */
    public getEnts(): number[] {
        return Array.from(this._map_ent_i_to_val_i.keys());
    }
    /**
     * Delete the entities from this attribute map.
     */
    public delEnt(ents_i: number|number[]): void {
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        ents_i.forEach(ent_i => {
            // _map_ent_i_to_val_i: Map<number, number>
            const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            if (val_i !== undefined) {
                // del the entity from _map_ent_i_to_val_i
                this._map_ent_i_to_val_i.delete(ent_i);
                // del the entity from _map_val_i_to_ents_i
                const other_ents_i: number[] = this._map_val_i_to_ents_i.get(val_i);
                other_ents_i.splice(other_ents_i.indexOf(ent_i), 1);
                // clean up just in case that was the last entity with this value
                this._cleanUp(val_i);
                // time stamp has already been deleted
            }
        });
        // TODO
        // this._data_length may need to be reduced
    }
    /**
     * Returns a nested array of entities and values, like this:
     * [ [[2,4,6,8], 'hello'], [[9,10], 'world']]
     * This is the same format as used in gi-json
     * This matches the method setEntsVals()
     */
    public getEntsVals(): [number[], TAttribDataTypes][] {
        const ents_i_values: [number[], TAttribDataTypes][] = [];
        this._map_val_i_to_ents_i.forEach( (ents_i, val_i) => {
            // const value: TAttribDataTypes = this._map_val_i_to_val.get(val_i);
            const value: TAttribDataTypes = this._modeldata.model.metadata.getAttribValFromIdx(val_i, this._data_type);
            ents_i_values.push([ents_i, value]);
        });
        return ents_i_values;
    }
    /**
     * Sets the value for a given entity or entities.
     *
     * If the value is undefined, no action is taken.
     *
     * The value can be null, in which case it is equivalent to deleting the entities from this attrib map.
     *
     * @param ent_i
     * @param val
     */
    public setEntVal(ents_i: number|number[], val: TAttribDataTypes, check_type = true): void {
        // console.log("xxxx", val)

        // if indefined, do nothing
        if (val === undefined) { return; }
        // if null, delete
        if (val === null) {
            this.delEnt(ents_i);
            return;
        }
        // check the type
        if (check_type) {
            if (this._data_type === EAttribDataTypeStrs.NUMBER && typeof val !== 'number') {
                throw new Error('Error setting attribute value. Attribute is of type "number" but the value is not a number.');
            } else if (this._data_type === EAttribDataTypeStrs.STRING && typeof val !== 'string') {
                throw new Error('Error setting attribute value. Attribute is of type "string" but the value is not a string.');
            } else if (this._data_type === EAttribDataTypeStrs.BOOLEAN && typeof val !== 'boolean') {
                throw new Error('Error setting attribute value. Attribute is of type "boolean" but the value is not a boolean.');
            } else if (this._data_type === EAttribDataTypeStrs.LIST && !Array.isArray(val)) {
                throw new Error('Error setting attribute value. Attribute is of type "list" but the value is not a list.');
            } else if (this._data_type === EAttribDataTypeStrs.DICT && typeof val !== 'object') {
                throw new Error('Error setting attribute value. Attribute is of type "list" but the value is not a list.');
            }
        }
        const val_k: string | number = this._valToValkey(val);
        // get the index to the value
        let val_i: number;
        if (this._modeldata.model.metadata.hasAttribKey(val_k, this._data_type)) {
            val_i = this._modeldata.model.metadata.getAttribIdxFromKey(val_k, this._data_type);
            if (!this._map_val_i_to_ents_i.has(val_i)) {
                this._map_val_i_to_ents_i.set(val_i, []);
            }
        } else {
            val_i = this._modeldata.model.metadata.addAttribByKeyVal(val_k, val, this._data_type);
            this._map_val_i_to_ents_i.set(val_i, []);
        }
        // an array of ents
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        // loop through all the unique ents, and set _map_ent_i_to_val_i
        let unique_ents_i: number[] = ents_i;
        if (ents_i.length > 1) {
            unique_ents_i = Array.from(new Set(ents_i));
        }
        unique_ents_i.forEach( ent_i => {
            // keep the old value for later
            const old_val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            // for each ent_i, set the new val_i
            this._map_ent_i_to_val_i.set(ent_i, val_i);
            // clean up the old val_i
            if (old_val_i !== undefined && old_val_i !== val_i) {
                arrRem(this._map_val_i_to_ents_i.get(old_val_i), ent_i);
                // clean up just in case that was the last entity with this value
                this._cleanUp(old_val_i);
            }
            // update the time stamp for this entity
            this._modeldata.geom.time_stamp.updateEntTs(this._ent_type, ent_i);
        });
        // for the val_i, set it to point to all the ents that have this value
        const exist_ents_i: number[] = this._map_val_i_to_ents_i.get(val_i);
        const exist_new_ents_i: number[] = exist_ents_i === undefined ?
            ents_i :
            Array.from(new Set(exist_ents_i.concat(ents_i)));
        this._map_val_i_to_ents_i.set(val_i, exist_new_ents_i);

        // update the _data_length for lists and objects
        if (this._data_type === EAttribDataTypeStrs.LIST) {
            const arr_len: number = (val as any[]).length;
            if (arr_len > this._data_length) {
                this._data_length = arr_len;
            }
        } else if (this._data_type === EAttribDataTypeStrs.DICT) {
            const arr_len: number = Object.keys((val as object)).length;
            if (arr_len > this._data_length) {
                this._data_length = arr_len;
            }
        }
    }
    /**
     * Renumber the entity IDs.
     * This gets called when this data is being meregd into another model.
     * In such a case, entity IDs need to be renumbered to avoid conflicts.
     * The new entity IDs are defined in the renum_map argument.
     * @param renum_map
     */
    public renumEnts(renum_map: Map<number, number>): void {
        // private _map_val_i_to_ents_i: Map<number, number[]>;
        this._map_val_i_to_ents_i.forEach( (ents_i, val_i) => {
            for (let i = 0; i < ents_i.length; i++) {
                const new_ent_i: number = renum_map.get(ents_i[i]); // shift
                ents_i[i] = new_ent_i;
                this._map_ent_i_to_val_i.set(new_ent_i, val_i);
            }
        });
    }
    /**
     * Merges another attrib map into this attrib map
     * @param attrib_map The attrib map to merge into this map
     */
    public merge(attrib_map: GIAttribMap): void {
        attrib_map._map_val_i_to_ents_i.forEach( (other_ents_i, val_i) => {
            // get the ents
            const exist_ents_i: number[] = this._map_val_i_to_ents_i.get(val_i);
            const exist_other_ents_i: number[] = exist_ents_i === undefined ?
                Array.from(other_ents_i) :
                Array.from(new Set(exist_ents_i.concat(other_ents_i)));
            // update the ent maps
            this._map_val_i_to_ents_i.set(val_i, exist_other_ents_i);
            other_ents_i.forEach( ent_i => this._map_ent_i_to_val_i.set(ent_i, val_i));
        });
        // update the data length
        if (this._data_type === EAttribDataTypeStrs.LIST || this._data_type === EAttribDataTypeStrs.DICT) {
            if (attrib_map._data_length > this._data_length) {
                this._data_length = attrib_map._data_length;
            }
        }
    }
    /**
     * Dumps another attrib map into this attrib map
     * Assumes tha this map is empty
     * @param attrib_map The attrib map to merge into this map
     */
    public dump(attrib_map: GIAttribMap): void {
        this._map_val_i_to_ents_i = cloneDeepMapArr(attrib_map._map_val_i_to_ents_i);
        this._map_ent_i_to_val_i = new Map(attrib_map._map_ent_i_to_val_i);
    }
    /**
     * Dumps another attrib map into this attrib map
     * Assumes tha this map is empty
     * @param attrib_map The attrib map to merge into this map
     */
    public dumpEnts(attrib_map: GIAttribMap, selected: Set<number>): void {
        selected.forEach(selected_ent_i => {
            if (attrib_map._map_ent_i_to_val_i.has(selected_ent_i)) {
                const val_i: number = attrib_map._map_ent_i_to_val_i.get(selected_ent_i);
                const ents_i: number[] = attrib_map._map_val_i_to_ents_i.get(val_i);
                const ents2_i: number[] = ents_i.filter( ent_i => selected.has(ent_i) );
                this._map_val_i_to_ents_i.set(val_i, ents2_i);
                ents2_i.forEach( ent_i => this._map_ent_i_to_val_i.set(ent_i, val_i));
                // update the data length
                if (this._data_type === EAttribDataTypeStrs.LIST || this._data_type === EAttribDataTypeStrs.DICT) {
                    const val = this._modeldata.model.metadata.getAttribValFromIdx(val_i, this._data_type);
                    if (this._data_type === EAttribDataTypeStrs.LIST) {
                        const arr_len: number = (val as any[]).length;
                        if (arr_len > this._data_length) {
                            this._data_length = arr_len;
                        }
                    } else if (this._data_type === EAttribDataTypeStrs.DICT) {
                        const arr_len: number = Object.keys((val as object)).length;
                        if (arr_len > this._data_length) {
                            this._data_length = arr_len;
                        }
                    }
                }
            }
        });
    }
    /**
     * Sets the indexed value for a given entity or entities.
     * This assumes that this attribute is a list.
     * @param ent_i
     * @param idx
     * @param val
     */
    public setEntListIdxVal(ents_i: number|number[], idx: number, val: any): void {
        // check this is a list
        if (this._data_type !== EAttribDataTypeStrs.LIST) {
            throw new Error('Setting indexed attribute, but the attribute is not a list: "' + this._name + '".');
        }
        // make sure we have an array of ents_i
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        // loop through all the unique ents, and setEntVal
        let unique_ents_i: number[] = ents_i;
        if (ents_i.length > 1) {
            unique_ents_i = Array.from(new Set(ents_i));
        }
        unique_ents_i.forEach( ent_i => {
            const exist_list: any[] = this.getEntVal(ent_i) as any[];
            let new_list: any[] = [];
            if (exist_list !== undefined) {
                new_list = lodash.cloneDeep(exist_list); // IMPORTANT clone the array
            }
            if (idx < 0) {
                idx += new_list.length;
            }
            new_list[idx] = val;
            this.setEntVal(ent_i, new_list);
        });
    }
    /**
     * Sets the keyed value for a given entity or entities.
     * This assumes that this attribute is a dict.
     * @param ents_i
     * @param key
     * @param val
     */
    public setEntDictKeyVal(ents_i: number|number[], key: string, val: any): void {
        // check this is a dict
        if (this._data_type !== EAttribDataTypeStrs.DICT) {
            throw new Error('Setting keyed attribute, but the attribute is not a dict: "' + this._name + '".');
        }
        // make sure we have an array of ents_i
        ents_i = (Array.isArray(ents_i)) ? ents_i : [ents_i];
        // loop through all the unique ents, and setEntVal
        let unique_ents_i: number[] = ents_i;
        if (ents_i.length > 1) {
            unique_ents_i = Array.from(new Set(ents_i));
        }
        unique_ents_i.forEach( ent_i => {
            const exist_dict: object = this.getEntVal(ent_i) as object;
            let new_dict: object = {};
            if (exist_dict !== undefined) {
                new_dict = lodash.cloneDeep(exist_dict); // IMPORTANT clone the dict
            }
            new_dict[key] = val;
            this.setEntVal(ent_i, new_dict);
        });
    }
    /**
     * Gets the value for a given entity, or an array of values given an array of entities.
     * ~
     * Returns undefined if the entity does not exist in this map.
     * ~
     * @param ent_i
     */
    public getEntVal(ents_i: number|number[]): TAttribDataTypes {
        if (!Array.isArray(ents_i)) {
            const ent_i: number = ents_i as number;
            const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
            if (val_i === undefined) { return undefined; }
            // return this._map_val_i_to_val.get(val_i) as TAttribDataTypes;
            return this._modeldata.model.metadata.getAttribValFromIdx(val_i, this._data_type);
        } else {
            return ents_i.map(ent_i => this.getEntVal(ent_i)) as TAttribDataTypes;
        }
    }
    /**
     * Gets the indexed value in a list  for a given entity.
     * Returns undefined if the entity does not exist
     * This assumes that this attribute is a list.
     * @param ent_i
     */
    public getEntListIdxVal(ents_i: number|number[], idx: number): any {
        if (this._data_type !== EAttribDataTypeStrs.LIST) {
            throw new Error('Trying to get indexed value, but the attribute data type is not a list.');
        }
        if (!Array.isArray(ents_i)) {
            const ent_i: number = ents_i as number;
            const exist_value_arr: any[] = this.getEntVal(ent_i) as any[];
            return exist_value_arr[idx] as any;
        } else {
            return ents_i.map(ent_i => this.getEntVal(ent_i)[idx]) as any[];
        }
    }
    /**
     * Gets the value in an dict for a given entity.
     * Returns undefined if the entity does not exist
     * This assumes that this attribute is a dict.
     * @param ent_i
     */
    public getEntDictKeyVal(ents_i: number|number[], key: string): any {
        if (this._data_type !== EAttribDataTypeStrs.DICT) {
            throw new Error('Trying to get key value, but the attribute data type is not a dict.');
        }
        if (!Array.isArray(ents_i)) {
            const ent_i: number = ents_i as number;
            const exist_value_arr: any[] = this.getEntVal(ent_i) as any[];
            return exist_value_arr[key] as any;
        } else {
            return ents_i.map(ent_i => this.getEntVal(ent_i)[key]) as any[];
        }
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    public getEntsFromVal(val: TAttribDataTypes): number[] {
        // const val_i: number = this._map_val_k_to_val_i.get(this._valToValkey(val));
        const val_i: number =  this._modeldata.model.metadata.getAttribIdxFromKey(this._valToValkey(val), this._data_type);
        if (val_i === undefined) { return []; }
        return this._map_val_i_to_ents_i.get(val_i);
    }
    /**
     * Returns an array of entity indices which do not have a value (undefined)
     */
    public getEntsWithoutVal(ents_i: number[]): number[] {
        return ents_i.filter(ent_i => !this._map_ent_i_to_val_i.has(ent_i));
    }
    /**
     * Returns an array of entity indices which have a value (not undefined)
     */
    public getEntsWithVal(ents_i: number[]): number[] {
        return ents_i.filter(ent_i => this._map_ent_i_to_val_i.has(ent_i));
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
        if (this._data_type === EAttribDataTypeStrs.NUMBER) {
            if (search_val !== null && typeof search_val !== 'number') {
                throw new Error('Query search value "' + search_val + '" is not a number.');
            }
            return this._searchNumVal(ents_i, operator, search_val as number);
        } else if (this._data_type === EAttribDataTypeStrs.STRING) {
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
                throw new Error('Query operator "' + operator + '" and query "' + search_val + '" value are incompatible.');
            }
            if (search_val !== null && typeof search_val !== 'string') {
                throw new Error('Query search value "' + search_val + '" is not a string.');
            }
            return this._searchStrVal(ents_i, operator, search_val as string);
        } else if (this._data_type === EAttribDataTypeStrs.BOOLEAN) {
            if (search_val !== null && typeof search_val !== 'boolean') {
                throw new Error('Query search value "' + search_val + '" is not a boolean.');
            }
            return this._searchBoolVal(ents_i, operator, search_val as boolean);
        } else if (this._data_type === EAttribDataTypeStrs.LIST) {
            if (search_val !== null && !Array.isArray(search_val)) {
                throw new Error('Query search value "' + search_val + '" is not a list.');
            }
            return this._searchListVal(ents_i, operator, search_val as any[]);
        } else if (this._data_type === EAttribDataTypeStrs.DICT) {
            if (search_val !== null && typeof search_val !== 'object') {
                throw new Error('Query search value "' + search_val + '" is not an dictionary.');
            }
            return this._searchObjVal(ents_i, operator, search_val as object);
        } else {
            throw new Error('Bad query.');
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
        if (this._data_type !== EAttribDataTypeStrs.LIST)  {
            throw new Error('Query attribute "' + this._name + '" is not a list.');
        }
        // search
        return this._searchListIdxVal(ents_i, val_arr_idx, operator, search_val);
    }
    /**
     * Executes a query for an valued in an object, identified by a key
     * @param ents_i
     * @param val_obj_key The key of the value in the object
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    public queryDictKeyVal(ents_i: number[], val_obj_key: string,
        operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[] {
        // check the null search case
        if (search_val === null) {
            if (operator !== EFilterOperatorTypes.IS_EQUAL && operator !== EFilterOperatorTypes.IS_NOT_EQUAL) {
                { throw new Error('Query operator "' + operator + '" and query "null" value are incompatible.'); }
            }
        }
        // check
        if (typeof val_obj_key !== 'string') {
            throw new Error('Query index "' + val_obj_key + '" must be of type "string".');
        }
        if (this._data_type !== EAttribDataTypeStrs.DICT)  {
            throw new Error('Query attribute "' + this._name + '" is not a dictionary.');
        }
        // search
        return this._searchDictKeyVal(ents_i, val_obj_key, operator, search_val);
    }
    //  ===============================================================================================================
    //  Private methods
    //  ===============================================================================================================
    /**
     * Convert a value into a map key
     *
     * The key can be either a string or a number.
     * string -> string
     * number -> number
     * boolean -> number (1 or 0)
     * list -> string
     */
    protected _valToValkey(val: TAttribDataTypes): string|number {
        if (this._data_type === EAttribDataTypeStrs.STRING) {
            if (typeof val !== 'string') {
                throw new Error('Value must be of type "string".');
            }
            return val as string;
        } else if (this._data_type === EAttribDataTypeStrs.NUMBER) {
            if (typeof val !== 'number') {
                throw new Error('Value must be of type "number".');
            }
            return val as number;
        } else if (this._data_type === EAttribDataTypeStrs.BOOLEAN) {
            if (typeof val !== 'boolean') {
                throw new Error('Value must be of type "boolean".');
            } else {
                if (val) {
                    return 1;
                } else {
                    return 0;
                }
            }
        } else if (this._data_type === EAttribDataTypeStrs.LIST) {
            if (!Array.isArray(val)) {
                throw new Error('Value must be of type "list".');
            }
            return JSON.stringify(val);
        } else if (this._data_type === EAttribDataTypeStrs.DICT) {
            if (typeof val !== 'object') {
                throw new Error('Value must be of type "object".');
            }
            return JSON.stringify(val);
        }
        // datatype is none of the above
        throw new Error('Datatype not recognised.');
    }
    /**
     * Checks if anything still points to this value
     * If not, cleans up the arrays
     * _map_val_i_to_ents_i
     * _map_val_i_to_val
     * _map_val_k_to_val_i
     */
    protected _cleanUp(val_i: number): void {
        if (val_i !== undefined) {
            // _map_val_i_to_ents_i: Map<number, number[]>
            const ents_i: number[] = this._map_val_i_to_ents_i.get(val_i);
            if (ents_i.length === 0) {
                this._map_val_i_to_ents_i.delete(val_i);
            }
        }
    }
    /**
     * Compare two values with a comparison operator, ==, !=, >, >=, <, <=
     * ~
     * If the values are of different types, then false is returned.
     * ~
     * For arrays, true is returned only if a pairwise comparison between the items in the two arrays all return true.
     * The two arrays must also be of equal length.
     * ~
     * Values may be null.
     * Values that are undefined will be treated as null.
     * ~
     * @param operator
     * @param val1
     * @param val2
     */
    protected _compare(operator: EFilterOperatorTypes, val1: any, val2: any): boolean {
        if (Array.isArray(val1)) {
            if (!Array.isArray(val2)) { return false; }
            if (val1.length !== val2.length) { return false; }
            for (let i = 0; i < val1.length; i++) {
                if (!this._compare(operator, val1[i], val2[i])) { return false; }
            }
            return true;
        }
        if (val1 === undefined) { val1 = null; }
        if (val2 === undefined) { val2 = null; }
        if (typeof val1 !== typeof val2) { return false; }
        switch (operator) {
            // ==
            case EFilterOperatorTypes.IS_EQUAL:
                return val1 === val2;
            // !=
            case EFilterOperatorTypes.IS_NOT_EQUAL:
                return val1 !== val2;
            // >
            case EFilterOperatorTypes.IS_GREATER:
                return val1 > val2;
            // >=
            case EFilterOperatorTypes.IS_GREATER_OR_EQUAL:
                return val1 >= val2;
            // <
            case EFilterOperatorTypes.IS_LESS:
                return val1 < val2;
            // <=
            case EFilterOperatorTypes.IS_LESS_OR_EQUAL:
                return val1 <= val2;
            default:
                throw new Error('Query operator not found: ' + operator);
        }
    }
    // ======================================================
    /**
     * Searches for the number value using the operator
     */
    protected _searchNumVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: number): number[] {
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
     * Searches for the string value using the operator
     */
    protected _searchStrVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: string): number[] {
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
                throw new Error('Query error: Operator not allowed with string values.');
            default:
                throw new Error('Query error: Operator not found.');
        }
    }
    /**
     * Searches for the boolean value using the operator
     */
    protected _searchBoolVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: boolean): number[] {
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
                throw new Error('Query error: Operator not allowed with boolean values.');
            default:
                throw new Error('Query error: Operator not found.');
        }
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
     * Searches for the object value using the operator
     */
    protected _searchObjVal(ents_i: number[], operator: EFilterOperatorTypes, search_val: object): number[] {
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
     * Searches for the value using the operator
     */
    protected _searchDictKeyVal(ents_i: number[], obj_key: string, operator: EFilterOperatorTypes, search_val: any): number[] {
        // do the search
        const found_ents_i: number[] = [];
        for (const ent_i of ents_i) {
            const search_value_arr: TAttribDataTypes = this.getEntVal(ent_i) as TAttribDataTypes;
            if (search_value_arr !== undefined) {
                const comp: boolean = this._compare(operator, search_value_arr[obj_key], search_val);
                if ( comp ) {
                    found_ents_i.push(ent_i);
                }
            }
        }
        return found_ents_i;
    }
}
