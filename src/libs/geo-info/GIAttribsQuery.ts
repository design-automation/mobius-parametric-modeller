import { GIModel } from "./GIModel";
import { TId, TAttribDataTypes, IAttribsMaps, EEntStrToAttribMap, IQueryComponent, Txyz } from "./common";
import { GIAttribMap } from "./GIAttribMap";
import { idBreak } from "./id";
import { parse_query } from './query';

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
    public getAttribValue(id: TId, name: string): TAttribDataTypes {
        const [type_str, index]: [string, number] = idBreak(id);
        const attribs_maps_key: string = EEntStrToAttribMap[type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        return attribs.get(name).get(index);
    }
    // ============================================================================
    // Get entity attrib from numeric index
    // ============================================================================
    /**
     * Get a position entity attrib value by index
     * @param name
     * @param index
     */
    public getPosiAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._attribs_maps.posis.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a vertex entity attrib value by index
     * @param name
     * @param index
     */
    public getVertAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._attribs_maps.verts.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get an edge entity attrib value by index
     * @param name
     * @param index
     */
    public getEdgeAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._attribs_maps.edges.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a wire entity attrib value by index
     * @param name
     * @param index
     */
    public getWireAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._attribs_maps.wires.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a face entity attrib value by index
     * @param name
     * @param index
     */
    public getFaceAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._attribs_maps.faces.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a collection entity attrib value by index
     * @param name
     * @param index
     */
    public getCollAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._attribs_maps.colls.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    // ============================================================================
    // Has entity attrib
    // ============================================================================
    public hasPosiAttrib(name: string): boolean {
        return this._attribs_maps.posis.has(name);
    }
    public hasVertAttrib(name: string): boolean {
        return this._attribs_maps.verts.has(name);
    }
    public hasEdgeAttrib(name: string): boolean {
        return this._attribs_maps.edges.has(name);
    }
    public hasWireAttrib(name: string): boolean {
        return this._attribs_maps.wires.has(name);
    }
    public hasFaceAttrib(name: string): boolean {
        return this._attribs_maps.faces.has(name);
    }
    public hasCollAttrib(name: string): boolean {
        return this._attribs_maps.colls.has(name);
    }
    // ============================================================================
    // Get entity attrib names
    // ============================================================================
    public getPosiAttribNames(): string[] {
        return Array.from(this._attribs_maps.posis.keys());
    }
    public getVertAttribNames(): string[] {
        return Array.from(this._attribs_maps.verts.keys());
    }
    public getEdgeAttribNames(): string[] {
        return Array.from(this._attribs_maps.edges.keys());
    }
    public getWireAttribNames(): string[] {
        return Array.from(this._attribs_maps.wires.keys());
    }
    public getFaceAttribNames(): string[] {
        return Array.from(this._attribs_maps.faces.keys());
    }
    public getCollAttribNames(): string[] {
        return Array.from(this._attribs_maps.colls.keys());
    }
    // ============================================================================
    // Query an entity attrib
    // ============================================================================
    /**
     * Query the model using a query strings.
     * Returns a list of string IDs of entities in the model.
     */
    public queryAttribs(query_str: string): string[] {
        const queries: IQueryComponent[][] = parse_query(query_str);
        if (!queries) { return []; }
        const query1: IQueryComponent = queries[0][0];
        return this.queryAttrib(query1);
    }
    /**
     * Query the model using a sequence of && and || queries.
     * Returns a list of string IDs of entities in the model.
     * @param query
     */
    public queryAttrib(query: IQueryComponent): string[] {
        // print the query
        // console.log("     attrib_type" ,     query.attrib_type);
        // console.log("     attrib_name" ,     query.attrib_name);
        // console.log("     attrib_index" ,    query.attrib_index);
        // console.log("     attrib_value_str", query.attrib_value_str);
        // console.log("     operator_type" ,   query.operator_type);
        // do the query
        const attribs_maps_key: string = EEntStrToAttribMap[query.attrib_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (!attribs.has(query.attrib_name)) { return []; }
        const entities_i: number[] = attribs.get(query.attrib_name).queryValueStr(
            query.attrib_value_str,
            query.operator_type,
            query.attrib_index
        );
        const entities_id: string[] = entities_i.map(entity_i => query.attrib_type + entity_i);
        return entities_id;
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
    // Shortcuts
    // ============================================================================
    /**
     * Shortcut for getting a coordinate from a numeric position index (i.e. this is not an ID)
     * @param posi_i
     */
    public getPosiCoordByIndex(posi_i: number): Txyz {
        return this._attribs_maps.posis.get('coordinates').get(posi_i) as Txyz;
    }
    /**
     * Shortcut for getting all coordinates
     * @param posi_i
     */
    public getPosiCoords(): Txyz[] {
        const coords: Txyz[] = [];
        const coords_map: GIAttribMap = this._attribs_maps.posis.get('coordinates');
        for (let posi_i = 0; posi_i < this._model.geom.query.numPosis(); posi_i++) {
            coords.push(coords_map.get(posi_i) as Txyz);
        }
        return coords;
    }
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * @param vert_i
     */
    public getVerTxyzByIndex(vert_i: number): Txyz {
        const posi_i: number = this._model.geom.query.navVertToPosi(vert_i);
        return this._attribs_maps.posis.get('coordinates').get(posi_i) as Txyz;
    }
    /**
     * Shortcut for getting coords for all verts
     * @param attrib_name
     */
    public getVertsCoords(attrib_name: string): Txyz[] {
        const coords: Txyz[] = [];
        const coords_map: GIAttribMap = this._attribs_maps.posis.get('coordinates');
        for (let vert_i = 0; vert_i < this._model.geom.query.numVerts(); vert_i++) {
            const posi_i: number = this._model.geom.query.navVertToPosi(vert_i);
            coords.push(coords_map.get(posi_i) as Txyz);
        }
        return coords;
    }

}
