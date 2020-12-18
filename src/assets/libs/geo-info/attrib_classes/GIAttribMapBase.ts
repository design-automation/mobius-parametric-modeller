import { EFilterOperatorTypes, EAttribDataTypeStrs, TAttribDataTypes, IAttribJSONData, EEntType, EAttribNames, EEntTypeStr, TEntAttribValuesArr, TEntTypeIdx } from '../common';
import { getEntTypeStr } from '../common_func';
import { idMake } from '../common_id_funcs';
import { GIModelData } from '../GIModelData';

/**
 * Geo-info attribute class for one attribute.
 * This class is the base from which other classes inherit:
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
        // the maps
        this._map_val_i_to_ents_i = new Map();
        this._map_ent_i_to_val_i = new Map();
    }
    /**
     * Returns the JSON data for this attribute.
     * Returns null if there is no data.
     * If entset is null, then all ents are included.
     */
    public getJSONData(ent_set?: Set<number>): IAttribJSONData {
        const data: TEntAttribValuesArr = [];
        for (const val_i of this._map_val_i_to_ents_i.keys()) {
            let ents_i: number[];
            if (ent_set === undefined) {
                // all ents
                ents_i = this._mapValToEntsGetArr(val_i);
            } else {
                // filter ents
                ents_i = this._mapValToEntsGetArr(val_i).filter( ent_i => ent_set.has(ent_i) );
            }
            if (ents_i.length > 0) {
                data.push([this._getVal(val_i), ents_i]);
            }
        }
        if (data.length === 0) { return null; }
        return {
            name: this._name,
            data_type: this._data_type,
            data: data
        };
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
        switch (this._data_type) {
            case EAttribDataTypeStrs.NUMBER:
            case EAttribDataTypeStrs.STRING:
            case EAttribDataTypeStrs.BOOLEAN:
                return 1;
            case EAttribDataTypeStrs.LIST:
                let max_len = 0;
                for (const val_i of this._map_val_i_to_ents_i.keys()) {
                    const val_len = (this._getVal(val_i) as any[]).length;
                    if (val_len > max_len) { max_len = val_len; }
                }
                return max_len;
            case EAttribDataTypeStrs.DICT:
                let max_size = 0;
                for (const val_i of this._map_val_i_to_ents_i.keys()) {
                    const val_size =  Object.keys(this._getVal(val_i) as object).length;
                    if (val_size > max_size) { max_size = val_size; }
                }
                return max_size;
            default:
                throw new Error('Attribute datatype not recognised.');
        }
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
     * Gets the value for a given entity, or an array of values given an array of entities.
     * ~
     * Returns undefined if the entity does not exist in this map.
     * ~
     * If value is a list or dict, it is passed by reference.
     * ~
     * WARNING: The returned dict or list should not be modified, it should be treated as immutable.
     * ~
     * @param ent_i
     */
    public getEntVal(ent_i: number): TAttribDataTypes {
        const val_i: number = this._map_ent_i_to_val_i.get(ent_i);
        return this._getVal(val_i);
    }
    /**
     * Gets all the keys that have a given value
     * If the value does not exist an empty array is returned
     * The value can be a list or object
     * @param val
     */
    public getEntsFromVal(val: TAttribDataTypes): number[] {
        const val_i: number = this._getValIdx(val);
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
        if (val === null) { this.delEnt(ents_i); return; }
        // check the type
        if (check_type) { this._checkValType(val); }
        // get the val idx
        const val_i: number = this._getAddValIdx(val);
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
                    const ent_type_str: string = getEntTypeStr(this._ent_type);
                    let err_msg: string  =
                        'A attribute merge conflict has been detected. ' +
                        'This node has two or more incoming links, and as a result the incoming entities will be merged, ' +
                        'meaning that entities with the same ID will be merged into a single entity. ' +
                        'If two entities have the same ID, but have different attributes, then it will result in a merge conflict. ';
                    if (this._ent_type === EEntType.POSI && this._name === 'xyz') {
                        const verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(ent_i);
                        const parent_obj_strs: string[] = [];
                        for (const vert_i of verts_i) {
                            const parent_obj: TEntTypeIdx = this.modeldata.geom.query.getTopoObj(EEntType.VERT, vert_i);
                            const parent_obj_str: string = idMake(parent_obj[0], parent_obj[1]);
                            parent_obj_strs.push(parent_obj_str);
                        }
                        err_msg = err_msg + '<br><br>' +
                        'In this case, the conflict is caused by two positions with same ID but different XYZ coordinates.' +
                        '<ul>' +
                        '<li>The position causing the merge conflict is: "' + idMake(this._ent_type, ent_i) + '". </li>' +
                        '<li>The conflicting attribute is: "' + this._name + '". </li>' +
                        '<li>The conflicting values are : ' +
                            JSON.stringify(this._getVal(this._map_ent_i_to_val_i.get(ent_i))) + 'and ' +
                            JSON.stringify(this._getVal(val_i)) + '. </li>';
                        if (parent_obj_strs.length === 1) {
                            err_msg = err_msg +
                            '<li>This position is used in the following object: "' + parent_obj_strs[0] + '". </li>' +
                            '</ul>';
                            err_msg = err_msg +
                            'This conflict is most likley due to the fact that the "' + parent_obj_strs[0] + '" entity has been modified in one of the upstream nodes, ' +
                            'using one of the modify.XXX() functions. ' +
                            'Possible fixes in one of the upstream nodes: ' +
                            '<ul>' +
                            '<li>One of the two conflicting positions could be deleted before reaching this node. </li>' +
                            '<li>The ' + parent_obj_strs[0] + ' object could be cloned before being modified, using the make.Clone() function. </li>' +
                            '</ul>';
                        } else if (parent_obj_strs.length > 1) {
                            const all_parent_objs_str: string = JSON.stringify(parent_obj_strs);
                            err_msg = err_msg +
                            '<li>This position is used in the following objects: ' + all_parent_objs_str + '. </li>' +
                            '</ul>' +
                            'Possible fixes in one of the upstream nodes: ' +
                            '<ul>' +
                            '<li>One of the two conflicting positions could be deleted before reaching this node. </li>' +
                            '<li>One of the objects ' + all_parent_objs_str + ' could be cloned before being modified, using the make.Clone() function. </li>' +
                            '</ul>';
                        } else {
                            err_msg = err_msg +
                            '<li>The position is not being used in any objects. </li>' +
                            '</ul>' +
                            'Possible fixes in one of the upstream nodes: ' +
                            '<ul>' +
                            '<li>One of the two conflicting positions could be deleted before reaching this node. </li>' +
                            '</ul>';
                        }
                    } else if (this._ent_type > EEntType.POSI && this._ent_type < EEntType.POINT) {
                        const parent_obj: TEntTypeIdx = this.modeldata.geom.query.getTopoObj(this._ent_type, ent_i);
                        const parent_obj_str: string = idMake(parent_obj[0], parent_obj[1]);
                        const parent_ent_type_str: string = getEntTypeStr(parent_obj[0]);
                        err_msg = err_msg + '<br><br>' +
                        'In this case, the conflict is caused by two ' + ent_type_str + ' with same ID but with different attributes.' +
                        '<ul>' +
                        '<li>The entity causing the merge conflict is: "' + idMake(this._ent_type, ent_i) + '". </li>' +
                        '<li>The entity is part of the following object: "' + parent_obj_str + '". </li>' +
                        '<li>The conflicting attribute is: "' + this._name + '". </li>' +
                        '<li>The conflicting values are : ' +
                            JSON.stringify(this._getVal(this._map_ent_i_to_val_i.get(ent_i))) + ' and ' +
                            JSON.stringify(this._getVal(val_i)) + '. </li>' +
                        '</ul>' +
                        'Possible fixes in one of the upstream nodes: ' +
                        '<ul>' +
                        '<li>One of the ' + parent_ent_type_str + ' entities causing the conflict could be deleted before reaching this node. </li>' +
                        '</ul>';
                    } else {
                        err_msg = err_msg + '<br><br>' +
                        'In this case, the conflict is caused by two ' + ent_type_str + ' with same ID but with different attributes.' +
                        '<ul>' +
                        '<li>The entity causing the merge conflict is: "' + idMake(this._ent_type, ent_i) + '". </li>' +
                        '<li>The conflicting attribute is: "' + this._name + '". </li>' +
                        '<li>The conflicting values are : ' +
                            JSON.stringify(this._getVal(this._map_ent_i_to_val_i.get(ent_i))) + ' and ' +
                            JSON.stringify(this._getVal(val_i)) + '. </li>' +
                        '</ul>' +
                        'Possible fixes in one of the upstream nodes: ' +
                        '<ul>' +
                        '<li>One of the two conflicting ' + ent_type_str + ' could be deleted deleted before reaching this node. </li>' +
                        '</ul>';
                    }
                    throw new Error(err_msg);
                } else {
                    this._mapValToEntsAdd(val_i, ent_i);
                    this._map_ent_i_to_val_i.set(ent_i, val_i);
                }
            }
        }
    }
    // ============================================================================
    // Debug
    // ============================================================================
    public toStr(): string {
        const data = this.getJSONData();
        if (data === null) { return this._name + ' has no data.'; }
        return JSON.stringify(data);
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
        // just one ent
        if (typeof exist_ents_i === 'number') { return [exist_ents_i as number]; }
        // an array of ents
        return Array.from(exist_ents_i as Set<number>);
    }
    // ============================================================================================
    // Private methods to be overridden
    // ============================================================================================
    /**
     * Check that the value is of the correct type for this attribute.
     * @param ent_i
     */
    protected _checkValType(val: TAttribDataTypes): void {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Gets the value for a given index.
     * ~
     * If the value does not exist, it throws an error.
     * ~
     * If value is a list or dict, it is passed by reference.
     * @param ent_i
     */
    protected _getVal(val_i: number): TAttribDataTypes {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Gets the index for a given value.
     * @param ent_i
     */
    protected _getValIdx(val: TAttribDataTypes): number {
        throw new Error('Method must be overridden in sub class');
    }
    /**
     * Get the index for a given value, if it does not exist add it.
     * @param ent_i
     */
    protected _getAddValIdx(val: TAttribDataTypes): number {
        throw new Error('Method must be overridden in sub class');
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
