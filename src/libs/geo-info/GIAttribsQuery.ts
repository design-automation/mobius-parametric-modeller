import { GIModel } from './GIModel';
import { TAttribDataTypes, IAttribsMaps, EEntStrToAttribMap, IQueryComponent,
    Txyz, EAttribNames, EEntityTypeStr, EQueryOperatorTypes } from './common';
import { GIAttribMap } from './GIAttribMap';

/**
 * Parse the attribute value. Handles sting with quotes, e.g. 'this' and "that".
 * Remove quotes from value string
 */
function _parse_value_str(value_str: string): string {
    const first_char: string = value_str.slice(0, 1);
    if (first_char ===  '\'' || first_char === '"') {return value_str.slice(1, -1); }
    return value_str;
}
/**
 * Parese the attribute name. Handles names with indexes, e.g. 'name[2]'
 * Split the name into the string name and the numeric index
 */
function _parse_name_str(value_str: string): [string, number?] {
    const last_char: string = value_str.slice(-1);
    if (last_char === ']') {
        const [name_str, index_str]: [string, string] = value_str.slice(0, -1).split('[') as [string, string];
        const index: number = Number(index_str);
        if (isNaN(index)) {throw new Error('Bad query'); }
        return [name_str, index];
    }
    return [value_str, null];
}
/**
 * Parse a query component string.
 */
function _parse_query_component(query_component: string): IQueryComponent {
    let attrib_name_str = '' ;
    let attrib_value_str = '' ;
    let operator_type: EQueryOperatorTypes = null;
    // let attrib_type: EEntityTypeStr = null;
    // split the query at the @ sign
    const [attrib_type_str, attrib_name_value_str]: string[] = query_component.split('@');
    if (!attrib_name_value_str) { throw new Error('Bad query.'); }
    // // get the attrib_type
    // for (const key of Object.keys(EEntityTypeStr)) {
    //     if (attrib_type_str === EEntityTypeStr[key]) {
    //         attrib_type = EEntityTypeStr[key];
    //         break;
    //     }
    // }
    // //  check
    // if (!attrib_type) { throw new Error('Bad query.'); }
    // split the attrib_name_value_str based on operator, ==, !=, etc...
    for (const key of Object.keys(EQueryOperatorTypes)) {
        const split_query = attrib_name_value_str.split(EQueryOperatorTypes[key]);
        if (split_query.length === 2) {
            attrib_name_str =  split_query[0];
            attrib_value_str = split_query[1];
            operator_type = EQueryOperatorTypes[key];
            break;
        }
    }
    // check
    if (!attrib_name_str) {throw new Error('Bad attribute name in query.'); }
    if (!attrib_value_str) {throw new Error('Bad attribute value in query.'); }
    if (!operator_type) {throw new Error('Bad operator in query.'); }
    // parse the name
    const attrib_name_index = _parse_name_str(attrib_name_str);
    const attrib_name  = attrib_name_index[0];
    const attrib_index  = attrib_name_index[1];
    // parse the value
    attrib_value_str = _parse_value_str(attrib_value_str);
    // return the data for the query component as an object
    return {
        attrib_name: attrib_name,
        attrib_index: attrib_index,
        attrib_value_str: attrib_value_str,
        operator_type: operator_type
    };
}
/**
 * Parse a query string.
 * && takes precedence over ||
 * [ [ query1 && query2 ] || [ query3 && query4 ] ]
 */
function parseQuery(query_str: string): IQueryComponent[][] {
    if (!query_str.startsWith('#')) {throw new Error('Bad query, must start with #.'); }
    const query_str_clean: string = query_str.replace(/\s/g, '').slice(1);
    const or_query_strs: string[] = query_str_clean.split('||');
    const query_list: IQueryComponent[][] = [];
    or_query_strs.forEach(or_query_str => {
        const and_query_strs: string[] = or_query_str.split('&&');
        query_list.push(and_query_strs.map( and_query_str => _parse_query_component(and_query_str) ) );
    });
    return query_list;
}

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
     * Get an entity attrib value
     * @param id
     * @param name
     */
    public getAttribValue(ent_type_str: EEntityTypeStr, name: string, index: number): TAttribDataTypes {
        const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        return attribs.get(name).get(index);
    }
    /**
     * Check if attribute exists
     * @param ent_type_str
     * @param name
     */
    public hasAttrib(ent_type_str: EEntityTypeStr, name: string): boolean {
        const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        return attribs.has(name);
    }
    /**
     * Get all the attribute names for an entity type
     * @param ent_type_str
     */
    public getAttribNames(ent_type_str: EEntityTypeStr): string[] {
        const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        return Array.from(attribs.keys());
    }
    /**
     * Query the model using a query strings.
     * Returns a list of string IDs of entities in the model.
     */
    public queryAttribs(ent_type_str: EEntityTypeStr, query_str: string): number[] {
        // get the map that contains all the ettributes for the ent_type_str
        const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        // parse the query
        const queries: IQueryComponent[][] = parseQuery(query_str);
        if (!queries) { return []; }
        console.log(queries);
        // do the query, one by one
        // [[query1 and query2] or [query3 and query4]]
        let union_query_results: number[] = [];
        for (const and_queries of queries)  {
            let intersect_query_result: number[] = null;
            for (const and_query of and_queries) {
                if (attribs || attribs.has(and_query.attrib_name)) {
                    intersect_query_result = attribs.get(and_query.attrib_name).queryValueStr(
                        and_query.attrib_value_str,
                        and_query.operator_type,
                        and_query.attrib_index,
                        intersect_query_result
                    );
                }
            }
            if (intersect_query_result !== null) {
                union_query_results = Array.from(new Set([...union_query_results, ...intersect_query_result]));
            }
        }
        // return the result
        return union_query_results;
    }
    // ============================================================================
    // Get all values
    // ============================================================================
    /**
     * Get an array of all attribute values for posis
     * @param attrib_name
     */
    public getPosisAttribValues(attrib_name: string): TAttribDataTypes[]  {
        if (!this._attribs_maps.posis.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._attribs_maps.posis.get(attrib_name);
        return attrib_map.getSeqValues();
    }
    /**
     * Get an array of all attribute values for verts
     * @param attrib_name
     */
    public getVertsAttribValues(attrib_name: string): TAttribDataTypes[]  {
        if (!this._attribs_maps.verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._attribs_maps.verts.get(attrib_name);
        return attrib_map.getSeqValues();
    }
    // ============================================================================
    // Shortcuts for getting xyz
    // ============================================================================
    /**
     * Shortcut for getting a coordinate from a numeric position index (i.e. this is not an ID)
     * @param posi_i
     */
    public getPosiCoords(posi_i: number): Txyz {
        const result = this._attribs_maps.posis.get(EAttribNames.COORDS).get(posi_i) as Txyz;
        return result;
    }
    /**
     * Shortcut for getting all coordinates
     * @param posi_i
     */
    public getPosisCoords(): Txyz[] {
        const coords: Txyz[] = [];
        const coords_map: GIAttribMap = this._attribs_maps.posis.get(EAttribNames.COORDS);
        for (let posi_i = 0; posi_i < this._model.geom.query.numPosis(); posi_i++) {
            coords.push(coords_map.get(posi_i) as Txyz);
        }
        return coords;
    }
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * @param vert_i
     */
    public getVertCoords(vert_i: number): Txyz {
        const posi_i: number = this._model.geom.query.navVertToPosi(vert_i);
        return this._attribs_maps.posis.get(EAttribNames.COORDS).get(posi_i) as Txyz;
    }
    /**
     * Shortcut for getting coords for all verts
     * @param attrib_name
     */
    public getVertsCoords(attrib_name: string): Txyz[] {
        const coords: Txyz[] = [];
        const coords_map: GIAttribMap = this._attribs_maps.posis.get(EAttribNames.COORDS);
        for (let vert_i = 0; vert_i < this._model.geom.query.numVerts(); vert_i++) {
            const posi_i: number = this._model.geom.query.navVertToPosi(vert_i);
            coords.push(coords_map.get(posi_i) as Txyz);
        }
        return coords;
    }

}
