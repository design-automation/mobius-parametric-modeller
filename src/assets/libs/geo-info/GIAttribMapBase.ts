import { EFilterOperatorTypes, EAttribDataTypeStrs, TAttribDataTypes, IAttribJSONData, EEntType, EAttribNames, EEntTypeStr } from './common';
import { GIModelData } from './GIModelData';

/**
 * Geo-info attribute class for one attribute.
 * This class is teh base from which other classes inherit:
 * - GIAttribMapBool
 * - GIAttribMapDict
 * - GIAttribMapList
 * - GIAttribMapNum
 * - GIAttribMapStr
 * The attributs stores key-value pairs.
 * Multiple keys point to the same value.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequential arrays.
 * The values would be ["a", "b"]
 * The keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
export class GIAttribMapBase {
    protected modeldata: GIModelData;
    protected _name: string;
    protected _ent_type: EEntType;
    protected _data_type: EAttribDataTypeStrs;
    protected _data_length: number;
    protected _is_coll_data: boolean;
    protected _is_length_variable: boolean;
    // the two data maps that store attrib data
    protected _map_val_i_to_ents_i: Map<number, number|Set<number>>;
    protected _map_ent_i_to_val_i: Map<number, number>;

    /**
     * Creates an attribute.
     * @param attrib_data
     */
    constructor(modeldata: GIModelData, name: string, ent_type: EEntType, data_type: EAttribDataTypeStrs) {
        this.modeldata = modeldata;
        this._name = name;
        this._ent_type = ent_type;
        this._data_type = data_type;
        if (data_type === EAttribDataTypeStrs.LIST || data_type === EAttribDataTypeStrs.DICT) {
            this._data_length = 0;
            this._is_length_variable = true;
        } else {
            this._data_length = 1;
            this._is_length_variable = false;
        }
        // the maps
        this._map_val_i_to_ents_i = new Map();
        this._map_ent_i_to_val_i = new Map();
        // flag for collections
        if (ent_type === EEntType.COLL && (
            name === EAttribNames.COLL_CHILDS ||
            name === EAttribNames.COLL_POINTS ||
            name === EAttribNames.COLL_PLINES ||
            name === EAttribNames.COLL_PGONS
        )) {
            this._is_coll_data = true;
        } else {
            this._is_coll_data = false;
        }
    }
    /**
     * Returns the JSON data for this attribute.
     */
    public getJSONData(): IAttribJSONData {
        const data: Array<[number, number[]]> = [];
        for (const val_i of this._map_val_i_to_ents_i.keys()) {
            data.push([val_i, this._mapValToEntsGetArr(val_i)]);
        }
        return {
            name: this._name,
            data_type: this._data_type,
            data_length: this._data_length,
            data: data
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
        this._map_val_i_to_ents_i = new Map();
        this._map_ent_i_to_val_i = new Map();
        for (const [val_i, ents_i] of attrib_data.data) {
            this._map_val_i_to_ents_i.set(val_i, new Set(ents_i));
            ents_i.forEach( ent_i => {
                this._map_ent_i_to_val_i.set(ent_i, val_i);
            });
        }
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
                this._mapValToEntsRem(val_i, ent_i);
            }
        });
        // TODO
        // this._data_length may need to be reduced
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
     * Merges another attrib map into this attrib map
     * @param attrib_map The attrib map to merge into this map
     */
    public merge(attrib_map: GIAttribMapBase, ent_set?: Set<number>): void {
        const filter: boolean = ent_set !== undefined;
        for (const val_i of attrib_map._map_val_i_to_ents_i.keys())  {
            const other_ents_i: number[] = attrib_map._mapValToEntsGetArr(val_i);
            // update the  maps
            for (const ent_i of other_ents_i) {
                if (filter && !ent_set.has(ent_i)) { continue; }
                if (this._map_ent_i_to_val_i.has(ent_i) && this._map_ent_i_to_val_i.get(ent_i) !== val_i) {
                    // handle merging collections - special case
                    // TODO to be reconsidered...
                    if (this._is_coll_data) {
                        const exist_val_i: number = this._map_ent_i_to_val_i.get(ent_i);
                        const exist_vals: number[] = this.modeldata.model.metadata.getValFromIdx(
                            exist_val_i, this._data_type) as number[];
                        const new_vals: number[] = this.modeldata.model.metadata.getValFromIdx(
                            val_i, this._data_type) as number[];
                        const merged_set: Set<number> = new Set(exist_vals);
                        new_vals.forEach( new_val => merged_set.add(new_val) );
                        this.setEntVal(ent_i, Array.from(merged_set), false);

                    } else {
                        throw new Error('Merge conflict... ' + this._name + ', ' +
                        EEntTypeStr[this._ent_type] + ', ' + this._map_ent_i_to_val_i.get(ent_i)  + ', ' + val_i);
                    }
                } else {
                    this._mapValToEntsAdd(val_i, ent_i);
                    this._map_ent_i_to_val_i.set(ent_i, val_i);
                }
            }
        }
        // update the data length
        if (this._is_length_variable) {
            if (attrib_map._data_length > this._data_length) {
                this._data_length = attrib_map._data_length;
            }
        }
    }
    /**
     * Renumber the entity IDs.
     * This gets called when this data is being meregd into another model.
     * In such a case, entity IDs need to be renumbered to avoid conflicts.
     * The new entity IDs are defined in the renum_map argument.
     * typically called before merge, to avoid conflicts.
     * @param renum_map
     */
    public renumEnts(renum_map: Map<number, number>): void {
        for (const val_i of this._map_val_i_to_ents_i.keys())  {
            const exist_ents_i: number|Set<number> = this._map_val_i_to_ents_i.get(val_i);
            if (typeof exist_ents_i === 'number') {
                const new_ent_i: number = renum_map.get(exist_ents_i as number); // shift
                this._map_val_i_to_ents_i.set(val_i, new_ent_i);
                this._map_ent_i_to_val_i.set(new_ent_i, val_i);
            } else {
                const new_set_ents_i: Set<number> = new Set();
                for (const ent_i of exist_ents_i) {
                    const new_ent_i: number = renum_map.get(ent_i); // shift
                    new_set_ents_i.add(new_ent_i);
                    this._map_ent_i_to_val_i.set(new_ent_i, val_i);
                }
                this._map_val_i_to_ents_i.set(val_i, new_set_ents_i);
            }
        }
    }
    /**
     * Dumps another attrib map into this attrib map
     * Assumes tha this map is empty
     * @param attrib_map The attrib map to merge into this map
     */
    public dump(attrib_map: GIAttribMapBase): void {
        const new_map_val_i_to_ents_i: Map<number, number|Set<number>> = new Map();
        this._map_val_i_to_ents_i.forEach( (ents_i, val_i) => {
            if (typeof ents_i === 'number') {
                new_map_val_i_to_ents_i.set(val_i, ents_i as number);
            } else {
                new_map_val_i_to_ents_i.set(val_i, new Set(ents_i));
            }
        });
        this._map_val_i_to_ents_i = new_map_val_i_to_ents_i;
        this._map_ent_i_to_val_i = new Map(attrib_map._map_ent_i_to_val_i);
    }
    /**
     * Dumps another attrib map into this attrib map
     * Assumes tha this map is empty ???
     * @param attrib_map The attrib map to merge into this map
     */
    public dumpEnts(attrib_map: GIAttribMapBase, selected: Set<number>): void {
        selected.forEach(selected_ent_i => {
            if (attrib_map._map_ent_i_to_val_i.has(selected_ent_i)) {
                const val_i: number = attrib_map._map_ent_i_to_val_i.get(selected_ent_i);
                this._mapValToEntsAdd(val_i, selected_ent_i);
                this._map_ent_i_to_val_i.set(selected_ent_i, val_i);
                // update the data length
                if (this._is_length_variable) {
                    const val = this.modeldata.model.metadata.getValFromIdx(val_i, this._data_type);
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
    //  ===============================================================================================================
    //  Private methods
    //  ===============================================================================================================
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
    /**
     *
     * @param val_i
     * @param ent_i
     */
    protected _mapValToEntsAdd(val_i: number, ent_i: number): void {
        const exist_ents_i: number|Set<number> = this._map_val_i_to_ents_i.get(val_i);
        if (exist_ents_i === undefined) {
            this._map_val_i_to_ents_i.set(val_i, ent_i as number);
        } else if (typeof exist_ents_i === 'number') {
            this._map_val_i_to_ents_i.set(val_i, new Set([exist_ents_i, ent_i]));
        } else {
            exist_ents_i.add(ent_i);
        }
    }
    /**
     *
     * @param val_i
     * @param ent_i
     */
    protected _mapValToEntsRem(val_i: number, ent_i: number): void {
        const exist_ents_i: number|Set<number> = this._map_val_i_to_ents_i.get(val_i);
        if (exist_ents_i === undefined) { return; }
        if (typeof exist_ents_i === 'number') {
            if (exist_ents_i === ent_i) {
                this._map_val_i_to_ents_i.delete(val_i);
            }
        } else {
            const ents_set: Set<number> = exist_ents_i as Set<number>;
            ents_set.delete(ent_i);
            if (ents_set.size === 1) {
                this._map_val_i_to_ents_i.set(val_i, ents_set.keys().next().value);
            }
        }
    }
    /**
     *
     * @param val_i
     */
    protected _mapValToEntsGetArr(val_i: number): number[] {
        const exist_ents_i: number|Set<number> = this._map_val_i_to_ents_i.get(val_i);
        if (exist_ents_i === undefined) { return []; }
        if (typeof exist_ents_i === 'number') { return [exist_ents_i as number]; }
        return Array.from(exist_ents_i as Set<number>);
    }
    // ============================================================================================
    // Methods to be overridden
    // ============================================================================================
    /**
     * Gets the value for a given entity, or an array of values given an array of entities.
     * ~
     * Returns undefined if the entity does not exist in this map.
     * ~
     * If value is a list or dict, it is passed by reference.
     * @param ent_i
     */
    public getEntVal(ents_i: number): TAttribDataTypes {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Returns a nested array of entities and values, like this:
     * [ [[2,4,6,8], 'hello'], [[9,10], 'world']]
     * This is the same format as used in gi-json
     * This matches the method setEntsVals()
     */
    public getData(): [number[], TAttribDataTypes][] {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    public getEntsFromVal(val: TAttribDataTypes): number[] {
        throw new Error('Method must be overridden in sub class');
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
    public setEntVal(ent_i: number, val: TAttribDataTypes, check_type = true): void {
        throw new Error('Method must be overridden in sub class');
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
        throw new Error('Method must be overridden in sub class');
    }
    // ============================================================================================
    /**
     * Executes a query for an indexed valued in a list
     * @param ents_i
     * @param val_arr_idx The index of the value in the array
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    public queryListIdxVal(ents_i: number[], val_arr_idx: number,
            operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[] {
        throw new Error('Tring to query an indexed attribute, but the attribute data type is not a list: "' + this._name + '".');
    }
    // ============================================================================================
    /**
     * Executes a query for an valued in an object, identified by a key
     * @param ents_i
     * @param key The key of the value in the object
     * @param operator The relational operator, ==, !=, <=, >=, etc
     * @param search_val The value to search, string or number, or any[].
     */
    public queryDictKeyVal(ents_i: number[], key: string,
            operator: EFilterOperatorTypes, search_val: TAttribDataTypes): number[] {
        throw new Error('Tring to query an keyed attribute, but the attribute data type is not a dictionary: "' + this._name + '".');
    }
    // ============================================================================================
}
