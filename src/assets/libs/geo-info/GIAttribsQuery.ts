import { GIModel } from './GIModel';
import { TAttribDataTypes, IAttribsMaps,
    Txyz, EAttribNames, EEntType,  ESort,
    EAttribDataTypeStrs, EEntTypeStr, EFilterOperatorTypes } from './common';
import { GIAttribMap } from './GIAttribMap';

/**
 * Class for attributes.
 */
export class GIAttribsQuery {
    private _model: GIModel;
    private _attribs_maps: IAttribsMaps;
   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel, attribs_maps: IAttribsMaps) {
        this._model = model;
        this._attribs_maps = attribs_maps;
    }
    /**
     * Checks if an attribute with this name exists.
     * @param name
     */
    public hasModelAttrib(name: string): boolean {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attrib: Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        return attrib.has(name);
    }
    /**
     * Get attrib data type. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    public getAttribDataType(ent_type: EEntType, name: string): EAttribDataTypeStrs {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap>|Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        if (ent_type === EEntType.MOD) {
            const mod_attribs: Map<string, TAttribDataTypes> = attribs as Map<string, TAttribDataTypes>;
            const value: TAttribDataTypes = mod_attribs.get(name);
            if (typeof value === 'number') {
                return EAttribDataTypeStrs.NUMBER;
            } else if (typeof value === 'string') {
                return EAttribDataTypeStrs.STRING;
            } else if (typeof value === 'boolean') {
                return EAttribDataTypeStrs.BOOLEAN;
            } else if (Array.isArray(value)) {
                return EAttribDataTypeStrs.LIST;
            } else if (typeof value === 'object') {
                return EAttribDataTypeStrs.DICT;
            }
            throw new Error('Datatype of model attribute not recognised.');
        } else {
            const ent_attribs: Map<string, GIAttribMap> = attribs as Map<string, GIAttribMap>;
            return ent_attribs.get(name).getDataType();
        }
    }
    /**
     * Get attrib data type. Also works for MOD attribs.
     *
     * @param ent_type
     * @param name
     */
    public getAttribDataLength(ent_type: EEntType, name: string): number {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap>|Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        if (ent_type === EEntType.MOD) {
            const mod_attribs: Map<string, TAttribDataTypes> = attribs as Map<string, TAttribDataTypes>;
            const value: TAttribDataTypes = mod_attribs.get(name);
            if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                return 1;
            } else if (Array.isArray(value)) {
                return value.length;
            } else if (typeof value === 'object') {
                return Object.keys(value).length;
            }
            throw new Error('Datatype of model attribute not recognised.');
        } else {
            const ent_attribs: Map<string, GIAttribMap> = attribs as Map<string, GIAttribMap>;
            return ent_attribs.get(name).getDataLength();
        }
    }
    /**
     * Get a model attrib value
     * @param name
     */
    public getModelAttribVal(name: string): TAttribDataTypes {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attribs: Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        const value: TAttribDataTypes = attribs.get(name);
        if (value === undefined) { return null; }
        return value;
    }
    /**
     * Get a model attrib list value given an index
     * ~
     * If this attribute is not a list, throw error
     * ~
     * If idx is creater than the length of the list, undefined is returned.
     * ~
     * @param ent_type
     * @param name
     */
    public getModelAttribListIdxVal(name: string, idx: number): number|string {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attribs: Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        const list_value: TAttribDataTypes = attribs.get(name);
        if (list_value === undefined) { throw new Error('Attribute does not exist.'); }
        if (!Array.isArray(list_value)) { throw new Error('Attribute is not a list.'); }
        return list_value[idx];
    }
    /**
     * Get a model attrib dict value given a key
     * ~
     * If this attribute is not a dict, throw error
     * ~
     * If key does not exist, throw error
     * ~
     * @param ent_type
     * @param name
     */
    public getModelAttribDictKeyVal(name: string, key: string): number|string {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attribs: Map<string, TAttribDataTypes> = this._attribs_maps[attribs_maps_key];
        const dict_value: TAttribDataTypes = attribs.get(name);
        if (dict_value === undefined) { throw new Error('Attribute does not exist.'); }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') { throw new Error('Attribute is not a dict.'); }
        return dict_value[key];
    }
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * ~
     * If the attribute does not exist, throw an error
     * ~
     * @param ent_type
     * @param name
     */
    public getAttribVal(ent_type: EEntType, name: string, ents_i: number|number[]): TAttribDataTypes|TAttribDataTypes[] {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.getEntVal(ents_i);
    }
    /**
     * Get an entity attrib value in a list.
     * ~
     * If the attribute does not exist, throw error
     * ~
     * If the index is out of range, return undefined.
     * ~
     * @param ent_type
     * @param name
     */
    public getAttribListIdxVal(ent_type: EEntType, name: string, ents_i: number, idx: number): any {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.getEntListIdxVal(ents_i, idx);
    }
        /**
     * Get an entity attrib value in a dictionary.
     * ~
     * If the attribute does not exist, throw error
     * ~
     * If the key does not exist, return undefined.
     * ~
     * @param ent_type
     * @param name
     */
    public getAttribDictKeyVal(ent_type: EEntType, name: string, ents_i: number, key: string): any {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.getEntDictKeyVal(ents_i, key);
    }
    /**
     * Check if attribute exists
     * @param ent_type
     * @param name
     */
    public hasAttrib(ent_type: EEntType, name: string): boolean {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        return attribs.has(name);
    }
    /**
     * Get all the attribute names for an entity type
     * @param ent_type
     */
    public getAttribNames(ent_type: EEntType): string[] {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs_map: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        return Array.from(attribs_map.keys());
    }
    /**
     * Get all the user defined attribute names for an entity type
     * This excludes the built in attribute names, xyz and anything starting with '_'
     * @param ent_type
     */
    public getAttribNamesUser(ent_type: EEntType): string[] {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs_map: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        let attribs: string[] = Array.from(attribs_map.keys());
        if (ent_type === EEntType.POSI) {
            attribs = attribs.filter(attrib => attrib !== 'xyz');
        }
        attribs = attribs.filter(attrib => attrib[0] !== '_');
        return attribs;
    }
    /**
     * Get attrib
     * @param ent_type
     * @param name
     */
    public getAttrib(ent_type: EEntType, name: string): GIAttribMap {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        return attribs.get(name);
    }
    // /**
    //  * Query the model using a query strings.
    //  * Returns a list of entities in the model.
    //  * @param ent_type The type of the entities being search for
    //  * @param query_str The query string, e.g. '#@name == value'
    //  * @param indices The indices of entites in the model. These are assumed to be of type ent_type.
    //  */
    // public queryAttribs(ent_type: EEntType, query_str: string, indices: number[]): number[] {
    //     // get the map that contains all the ettributes for the ent_type
    //     const attribs_maps_key: string = EEntTypeStr[ent_type];
    //     const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
    //     // parse the query
    //     const queries: IQueryComponent[][] = parseQuery(query_str);
    //     if (!queries) { return []; }
    //     // do the query, one by one
    //     // [[query1 && query2] || [query3 && query4]]
    //     let union_query_results: number[] = [];
    //     for (const and_queries of queries)  {
    //         // get the ents_i to start the '&&' query
    //         let query_ents_i: number[] = null;
    //         if (indices !== null && indices !== undefined) {
    //             query_ents_i = indices;
    //         } else {
    //             query_ents_i = this._model.geom.query.getEnts(ent_type, false);
    //         }
    //         // do the '&&' queries
    //         for (const and_query of and_queries) {
    //             if (attribs && attribs.has(and_query.attrib_name)) {
    //                 const attrib: GIAttribMap = attribs.get(and_query.attrib_name);
    //                 query_ents_i = attrib.queryVal(
    //                     query_ents_i,
    //                     and_query.attrib_index,
    //                     and_query.operator_type,
    //                     and_query.attrib_value_str
    //                 );
    //             } else {
    //                 throw new Error('Attribute "' + and_query.attrib_name + '" does not exist.');
    //                 // query_ents_i = [];
    //             }
    //         }
    //         // combine the results of the '&&' queries
    //         if (query_ents_i !== null && query_ents_i.length > 0) {
    //             union_query_results = Array.from(new Set([...union_query_results, ...query_ents_i]));
    //         }
    //     }
    //     // return the result
    //     return union_query_results;
    // }
    /**
     * Query the model using a query strings.
     * Returns a list of entities in the model.
     * @param ent_type The type of the entities being quieried.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    public filterByAttribs(ent_type: EEntType, ents_i: number[],
            name: string, idx_or_key: number|string, op_type: EFilterOperatorTypes, value: TAttribDataTypes): number[] {
        // get the map that contains all the attributes for the ent_type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        // do the query
        if (attribs && attribs.has(name)) {
            const attrib: GIAttribMap = attribs.get(name);
            let query_ents_i: number[];
            if (typeof idx_or_key === 'number') {
                query_ents_i = attrib.queryListIdxVal(ents_i, idx_or_key, op_type, value);
            } else if (typeof idx_or_key === 'string') {
                query_ents_i = attrib.queryDictKeyVal(ents_i, idx_or_key, op_type, value);
            } else {
                query_ents_i = attrib.queryVal(ents_i, op_type, value);
            }
            // return the result
            return query_ents_i;
        } else {
            throw new Error('Attribute "' + name + '" does not exist.');
            // query_ents_i = [];
        }
    }
    /**
     * Sort entities in the model based on attribute values.
     * @param ent_type The type of the entities being sorted.
     * @param ents_i Entites in the model, assumed to be of type ent_type.
     * @param name
     * @param idx_or_key
     * @param value
     */
    public sortByAttribs(ent_type: EEntType, ents_i: number[],
            name: string, idx_or_key: number|string, method: ESort): number[] {
        // get the map that contains all the ettributes for the ent_type
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (!attribs)  { throw new Error('Bad sort: Entity type does not exist.'); }
        // get the attribute from the map
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) {
            // if the attribute does not exist then no sort is performed
            return ents_i;
        }
        // create the sort copmapre function
        function _sortCompareVals(ent1_i: number, ent2_i: number): number {
            const val1: number|string|boolean = attrib.getEntVal(ent1_i) as number|string|boolean;
            const val2: number|string|boolean = attrib.getEntVal(ent2_i) as number|string|boolean;
            if (method === ESort.DESCENDING) {
                if (val1 < val2) { return 1; }
                if (val1 > val2) { return -1; }
            } else {
                if (val1 < val2) { return -1; }
                if (val1 > val2) { return 1; }
            }
            return 0;
        }
        function _sortCompareListIdxVals(ent1_i: number, ent2_i: number): number {
            const l1: any[] = attrib.getEntVal(ent1_i) as any[];
            const l2: any[] = attrib.getEntVal(ent2_i) as any[];
            const val1: any = (l1 !== undefined && l1 !== null) ? l1[idx_or_key] : null;
            const val2: any = (l2 !== undefined && l2 !== null) ? l2[idx_or_key] : null;
            if (method === ESort.DESCENDING) {
                if (val1 < val2) { return 1; }
                if (val1 > val2) { return -1; }
            } else {
                if (val1 < val2) { return -1; }
                if (val1 > val2) { return 1; }
            }
            return 0;
        }
        function _sortCompareDictKeyVals(ent1_i: number, ent2_i: number): number {
            const o1: object = attrib.getEntVal(ent1_i) as object;
            const o2: object = attrib.getEntVal(ent2_i) as object;
            const val1: any = (o1 !== undefined && o1 !== null) ? o1[idx_or_key] : null;
            const val2: any = (o2 !== undefined && o2 !== null) ? o2[idx_or_key] : null;
            if (method === ESort.DESCENDING) {
                if (val1 < val2) { return 1; }
                if (val1 > val2) { return -1; }
            } else {
                if (val1 < val2) { return -1; }
                if (val1 > val2) { return 1; }
            }
            return 0;
        }
        function _sortCompareLists(ent1_i: number, ent2_i: number): number {
            const l1: any[] = attrib.getEntVal(ent1_i) as any[];
            const l2: any[] = attrib.getEntVal(ent2_i) as any[];
            const len: number = l1.length > l2.length ? l1.length : l2.length;
            if (method === ESort.DESCENDING) {
                for (let i = 0; i < len; i++) {
                    if (l1[i] < l2[i]) { return 1; }
                    if (l1[i] > l2[i]) { return -1; }
                }
            } else {
                for (let i = 0; i < len; i++) {
                    if (l1[i] < l2[i]) { return -1; }
                    if (l1[i] > l2[i]) { return 1; }
                }
            }
            return 0;
        }
        function _sortCompareDicts(ent1_i: number, ent2_i: number): number {
            const o1: object = attrib.getEntVal(ent1_i) as object;
            const o2: object = attrib.getEntVal(ent2_i) as object;
            if (method === ESort.DESCENDING) {
                if (o1 < o2) { return 1; }
                if (o1 > o2) { return -1; }
            } else {
                if (o1 < o2) { return -1; }
                if (o1 > o2) { return 1; }
            }
            return 0;
        }
        // do the sort
        if (attrib.getDataType() === EAttribDataTypeStrs.LIST) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareLists);
            } else {
                ents_i.sort(_sortCompareListIdxVals);
            }
        } else if (attrib.getDataType() === EAttribDataTypeStrs.DICT) {
            if (idx_or_key === null || idx_or_key === undefined) {
                ents_i.sort(_sortCompareDicts);
            } else {
                ents_i.sort(_sortCompareDictKeyVals);
            }
        } else {
            ents_i.sort(_sortCompareVals);
        }
        return ents_i;
    }
    // ============================================================================
    // Shortcuts for getting xyz
    // ============================================================================
    /**
     * Shortcut for getting a coordinate from a numeric position index (i.e. this is not an ID)
     * @param posi_i
     */
    public getPosiCoords(posi_i: number): Txyz {
        const result = this._attribs_maps.ps.get(EAttribNames.COORDS).getEntVal(posi_i) as Txyz;
        return result;
    }
    // /**
    //  * Shortcut for getting all coordinates
    //  * @param posi_i
    //  */
    // public getAllPosisCoords(): Txyz[] {
    //     const posis_i: number[] = this._model.geom.query.getEnts(EEntType.POSI);
    //     const coords_map: GIAttribMap = this._attribs_maps.ps.get(EAttribNames.COORDS);
    //     return coords_map.getEntVal(posis_i) as Txyz[];
    // }
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * @param vert_i
     */
    public getVertCoords(vert_i: number): Txyz {
        const posi_i: number = this._model.geom.query.navVertToPosi(vert_i);
        return this._attribs_maps.ps.get(EAttribNames.COORDS).getEntVal(posi_i) as Txyz;
    }
    // /**
    //  * Shortcut for getting coords for all verts
    //  * @param attrib_name
    //  */
    // public getAllVertsCoords(attrib_name: string): Txyz[] {
    //     const verts_i: number[] = this._model.geom.query.getEnts(EEntType.VERT);
    //     const posis_i: number[] = verts_i.map( vert_i => this._model.geom.query.navVertToPosi(vert_i));
    //     const coords_map: GIAttribMap = this._attribs_maps.ps.get(EAttribNames.COORDS);
    //     return coords_map.getEntVal(posis_i) as Txyz[];
    // }
}
// ================================================================================================
// Functions for parsing queries
// ================================================================================================
// /**
//  * Parse a query string.
//  * && takes precedence over ||
//  * [ [ query1 && query2 ] || [ query3 && query4 ] ]
//  */
// function parseQuery(query_str: string): IQueryComponent[][] {
//     if (!query_str.startsWith('#')) {throw new Error('Bad query, query string must start with #.'); }
//     const or_query_strs: string[] = query_str.split('||');
//     const query_list: IQueryComponent[][] = [];
//     or_query_strs.forEach(or_query_str => {
//         const and_query_strs: string[] = or_query_str.split('&&');
//         query_list.push(and_query_strs.map( and_query_str => _parse_query_component(and_query_str) ) );
//     });
//     return query_list;
// }

// /**
//  * Parse a query component string.
//  */
// function _parse_query_component(query_component: string): IQueryComponent {
//     let attrib_name_str = '' ;
//     let attrib_value_str = '' ;
//     let operator_type: EFilterOperatorTypes = null;
//     // split the query at the @ sign
//     const [_, attrib_name_value_str]: string[] = query_component.split('@');
//     if (!attrib_name_value_str) { throw new Error('Bad query.'); }
//     // split the attrib_name_value_str based on operator, ==, !=, etc...
//     for (const key of Object.keys(EFilterOperatorTypes)) {
//         const split_query = attrib_name_value_str.split(EFilterOperatorTypes[key]);
//         if (split_query.length === 2) {
//             attrib_name_str =  split_query[0].trim();
//             attrib_value_str = split_query[1].trim();
//             operator_type = EFilterOperatorTypes[key];
//             break;
//         }
//     }
//     // check
//     if (!operator_type) {throw new Error('Bad operator in query.'); }
//     if (!attrib_name_str) {throw new Error('Bad attribute name in query.'); }
//     if (!attrib_value_str) {throw new Error('Bad attribute value in query.'); }
//     // parse the name
//     const attrib_name_index = _parse_name_str(attrib_name_str);
//     const attrib_name  = attrib_name_index[0];
//     const attrib_index  = attrib_name_index[1];
//     // parse the value
//     attrib_value_str = _parse_value_str(attrib_value_str);
//     // return the data for the query component as an object
//     return {
//         attrib_name: attrib_name,
//         attrib_index: attrib_index,
//         attrib_value_str: attrib_value_str,
//         operator_type: operator_type
//     };
// }
// /**
//  * Parse a sort string. #@name1 && #@name2
//  * Rerurns an array,[ query1, query2 ]
//  */
// function parseSort(sort_str: string): ISortComponent[] {
//     if (!sort_str.startsWith('#')) { throw new Error('Bad sort, sort string must start with #.'); }
//     if (sort_str.indexOf('||') !== -1) { throw new Error('Bad sort, sort string cannot contain || conditions.'); }
//     const sort_str_clean: string = sort_str.replace(/\s/g, '');
//     const component_strs: string[] = sort_str_clean.split('&&');
//     const sort_list: ISortComponent[] = [];
//     component_strs.forEach(component_str => {
//         sort_list.push(_parse_sort_component(component_str));
//     });
//     return sort_list;
// }

// /**
//  * Parse a query component string.
//  */
// function _parse_sort_component(sort_component: string): ISortComponent {
//     // split the query at the @ sign
//     const [_, attrib_name_str]: string[] = sort_component.split('@');
//     // check
//     if (!attrib_name_str) {throw new Error('Bad attribute name in query.'); }
//     // parse the name
//     const attrib_name_index = _parse_name_str(attrib_name_str);
//     const attrib_name  = attrib_name_index[0];
//     const attrib_index  = attrib_name_index[1];
//     // return the data for the query component as an object
//     return {
//         attrib_name: attrib_name,
//         attrib_index: attrib_index
//     };
// }

// /**
//  * Parse the attribute value. Handles sting with quotes, e.g. 'this' and "that".
//  * Remove quotes from value string
//  */
// function _parse_value_str(value_str: string): string {
//     const first_char: string = value_str.slice(0, 1);
//     if (first_char ===  '\'' || first_char === '"') {return value_str.slice(1, -1); }
//     return value_str;
// }
// /**
//  * Parese the attribute name. Handles names with indexes, e.g. 'name[2]'
//  * Split the name into the string name and the numeric index
//  */
// function _parse_name_str(value_str: string): [string, number?] {
//     const last_char: string = value_str.slice(-1);
//     if (last_char === ']') {
//         const [name_str, index_str]: [string, string] = value_str.slice(0, -1).split('[') as [string, string];
//         const index: number = Number(index_str);
//         if (isNaN(index)) {throw new Error('Bad query'); }
//         return [name_str, index];
//     }
//     return [value_str, null];
// }
