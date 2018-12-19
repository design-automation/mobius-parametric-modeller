import { IAttribsData, EAttribDataTypeStrs, TAttribDataTypes, IAttribData, TCoord, IGeomData, IModelData} from './GIJson';
import { GIAttribMap } from './GIAttribMap';
import { GIModel } from './GIModel';
import { EEntityTypeStr, IQueryComponent, idBreak, EAttribNames,  } from './GICommon';
import { parse_query } from './GIAttribsQuery';

/**
 * Class for attributes.
 */
export class GIAttribs {
    private _model: GIModel;
    // maps, the key is the name, the value is the attrib map clas
    private _posis: Map<string, GIAttribMap> = new Map();
    private _verts: Map<string, GIAttribMap> = new Map();
    private _edges: Map<string, GIAttribMap> = new Map();
    private _wires: Map<string, GIAttribMap> = new Map();
    private _faces: Map<string, GIAttribMap> = new Map();
    private _colls: Map<string, GIAttribMap> = new Map();
    // all attrib maps
    private _attrib_maps = {
        ps: this._posis,
        _v: this._verts,
        _e: this._edges,
        _w: this._wires,
        _f: this._faces,
        co: this._colls
    };
   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel) {
        this._model = model;
        this.addPosiAttrib(EAttribNames.COORDS, EAttribDataTypeStrs.FLOAT, 3);
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IAttribsData {
        return {
            positions: Array.from(this._posis.values()).map(attrib => attrib.getData()),
            vertices: Array.from(this._verts.values()).map(attrib => attrib.getData()),
            edges: Array.from(this._edges.values()).map(attrib => attrib.getData()),
            wires: Array.from(this._wires.values()).map(attrib => attrib.getData()),
            faces: Array.from(this._faces.values()).map(attrib => attrib.getData()),
            collections: Array.from(this._colls.values()).map(attrib => attrib.getData())
        };
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param model_data The JSON data for the model.
     */
    public addData(model_data: IModelData): void {
        // helper public to ddd attributes to model
        function _addAttribData(
                exist_attribs_maps:  Map<string, GIAttribMap>,
                new_attribs_data: IAttribData[],
                num_existing_entities: number,
                num_new_entities: number): void {
            // loop through all attributes, adding data
            new_attribs_data.forEach( new_attrib_data => {
                if (!exist_attribs_maps.has(new_attrib_data.name)) {
                    exist_attribs_maps.set(new_attrib_data.name, new GIAttribMap(
                        new_attrib_data.name,
                        new_attrib_data.data_type,
                        new_attrib_data.data_size,
                        num_existing_entities
                    ));
                }
                exist_attribs_maps.get(new_attrib_data.name).addEntities(new_attrib_data, num_new_entities);
            });
        }
        // data for all the new atttributes
        const attribs_data: IAttribsData = model_data.attributes;
        const geom_data: IGeomData = model_data.geometry;
        // add the attribute data
        _addAttribData(this._posis, attribs_data.positions, this._model.geom().numPosis(), geom_data.num_positions);
        _addAttribData(this._verts, attribs_data.vertices, this._model.geom().numVerts(), geom_data.vertices.length);
        _addAttribData(this._edges, attribs_data.edges, this._model.geom().numEdges(), geom_data.edges.length);
        _addAttribData(this._wires, attribs_data.wires, this._model.geom().numWires(), geom_data.wires.length);
        _addAttribData(this._faces, attribs_data.faces, this._model.geom().numFaces(), geom_data.faces.length);
        _addAttribData(this._colls, attribs_data.collections, this._model.geom().numColls(), geom_data.collections.length);
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Creates a new attribte.
     * @param type_str The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     * @param data_size The data size of the attribute. For example, an XYZ vector has size=3.
     */
    private _addAttrib(type_str: EEntityTypeStr, name: string, data_type: EAttribDataTypeStrs,
            data_size: number, num_entities: number): GIAttribMap {
        const attribs: Map<string, GIAttribMap> = this._attrib_maps[type_str];
        if (!attribs.has(name)) {
            const attrib: GIAttribMap = new GIAttribMap(name, data_type, data_size, num_entities);
            attribs.set(name, attrib);
        }
        return attribs[name];
    }
    // ============================================================================
    // Public methods
    // ============================================================================
    /**
     * Set an entity attrib value
     * @param id
     * @param name
     * @param value
     */
    public setAttribValue(id: string, name: string, value: TAttribDataTypes): void {
        const [type_str, index]: [string, number] = idBreak(id);
        const attribs: Map<string, GIAttribMap> = this._attrib_maps[type_str];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        attribs.get(name).set(index, value);
    }
    /**
     * Get an entity attrib value
     * @param id
     * @param name
     */
    public getAttribValue(id: string, name: string): TAttribDataTypes {
        const [type_str, index]: [string, number] = idBreak(id);
        const attribs: Map<string, GIAttribMap> = this._attrib_maps[type_str];
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
        const attrib: GIAttribMap = this._posis.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a vertex entity attrib value by index
     * @param name
     * @param index
     */
    public getVertAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._verts.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get an edge entity attrib value by index
     * @param name
     * @param index
     */
    public getEdgeAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._edges.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a wire entity attrib value by index
     * @param name
     * @param index
     */
    public getWireAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._wires.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a face entity attrib value by index
     * @param name
     * @param index
     */
    public getFaceAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._faces.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    /**
     * Get a collection entity attrib value by index
     * @param name
     * @param index
     */
    public getCollAttribValueByIndex(name: string, index: number): TAttribDataTypes {
        const attrib: GIAttribMap = this._colls.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        return attrib.get(index);
    }
    // ============================================================================
    // Has entity attrib
    // ============================================================================
    public hasPosiAttrib(name: string): boolean {
        return this._posis.has(name);
    }
    public hasVertAttrib(name: string): boolean {
        return this._verts.has(name);
    }
    public hasEdgeAttrib(name: string): boolean {
        return this._edges.has(name);
    }
    public hasWireAttrib(name: string): boolean {
        return this._wires.has(name);
    }
    public hasFaceAttrib(name: string): boolean {
        return this._faces.has(name);
    }
    public hasCollAttrib(name: string): boolean {
        return this._colls.has(name);
    }
    // ============================================================================
    // Get entity attrib names
    // ============================================================================
    public getPosiAttribNames(): string[] {
        return Array.from(this._posis.keys());
    }
    public getVertAttribNames(): string[] {
        return Array.from(this._verts.keys());
    }
    public getEdgeAttribNames(): string[] {
        return Array.from(this._edges.keys());
    }
    public getWireAttribNames(): string[] {
        return Array.from(this._wires.keys());
    }
    public getFaceAttribNames(): string[] {
        return Array.from(this._faces.keys());
    }
    public getCollAttribNames(): string[] {
        return Array.from(this._colls.keys());
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
        const attribs: Map<string, GIAttribMap> = this._attrib_maps[query.attrib_type];
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
    // Add an entity attrib
    // ============================================================================
    public addPosiAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.POSI, name, data_type, data_size, this._model.geom().numPosis());
    }
    public addVertAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.VERT, name, data_type, data_size, this._model.geom().numVerts());
    }
    public addEdgeAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.EDGE, name, data_type, data_size, this._model.geom().numEdges());
    }
    public addWireAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.WIRE, name, data_type, data_size, this._model.geom().numWires());
    }
    public addFaceAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.FACE, name, data_type, data_size, this._model.geom().numFaces());
    }
    public addCollAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.COLL, name, data_type, data_size, this._model.geom().numColls());
    }
    // ============================================================================
    // Get all values
    // ============================================================================
    /**
     * Get an array of all attribute values for posis
     * @param attrib_name
     */
    public getPosisAttribValues(attrib_name: string): TAttribDataTypes[]  {
        if (!this._posis.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._posis.get(attrib_name);
        return attrib_map.getSeqValues();
    }
    /**
     * Get an array of all attribute values for verts
     * @param attrib_name
     */
    public getVertsAttribValues(attrib_name: string): TAttribDataTypes[]  {
        if (!this._verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._verts.get(attrib_name);
        return attrib_map.getSeqValues();
    }
    // ============================================================================
    // Shortcuts
    // ============================================================================
    /**
     * Shortcut for getting a coordinate from a numeric position index (i.e. this is not an ID)
     * @param posi_i
     */
    public getPosiCoordByIndex(posi_i: number): TCoord {
        return this._posis.get('coordinates').get(posi_i) as TCoord;
    }
    /**
     * Shortcut for getting all coordinates
     * @param posi_i
     */
    public getPosiCoords(): TCoord[] {
        const coords: TCoord[] = [];
        const coords_map: GIAttribMap = this._posis.get('coordinates');
        for (let posi_i = 0; posi_i < this._model.geom().numPosis(); posi_i++) {
            coords.push(coords_map.get(posi_i) as TCoord);
        }
        return coords;
    }
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * @param vert_i
     */
    public getVertCoordByIndex(vert_i: number): TCoord {
        const posi_i: number = this._model.geom().navVertToPosi(vert_i);
        return this._posis.get('coordinates').get(posi_i) as TCoord;
    }
    /**
     * Shortcut for getting coords for all verts
     * @param attrib_name
     */
    public getVertsCoords(attrib_name: string): TCoord[] {
        const coords: TCoord[] = [];
        const coords_map: GIAttribMap = this._posis.get('coordinates');
        for (let vert_i = 0; vert_i < this._model.geom().numVerts(); vert_i++) {
            const posi_i: number = this._model.geom().navVertToPosi(vert_i);
            coords.push(coords_map.get(posi_i) as TCoord);
        }
        return coords;
    }
    // ============================================================================
    // Threejs
    // For methods to get the array of edges and triangles, see the geom class
    // get3jsTris() and get3jsEdges()
    // ============================================================================
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * @param verts An array of vertex indicies pointing to the coordinates.
     */
    public get3jsSeqVertsCoords(verts: number[]): number[] {
        const coords_attrib: GIAttribMap = this._posis.get('coordinates');
        const coords_keys: number[] = coords_attrib.getSeqKeys();
        const coords_values: TAttribDataTypes[] = coords_attrib.getValues();
        const verts_cords_values: number[] = [];
        verts.forEach( coords_i => verts_cords_values.push(...coords_values[coords_keys[coords_i]] as number[]));
        return verts_cords_values;
    }
    /**
     * Get a flat array of attribute values for all the vertices.
     * @param attrib_name The name of the vertex attribute. Either NORMAL or COLOR.
     */
    public get3jsSeqVertsAttrib(attrib_name: string): number[] {
        if (!this._verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._verts.get(attrib_name);
        const attrib_keys: number[] = attrib_map.getSeqKeys();
        const attrib_values: TAttribDataTypes[] = attrib_map.getValues();
        const result = [].concat(...attrib_keys.map(attrib_key => attrib_values[attrib_key]));
        return result;
    }

    // TODO: remove this method
    // It has been replaced by getVertsAttribValues()
    public getVertsAttrib(attrib_name: string) {
        if (!this._verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._verts.get(attrib_name);
        const attrib_keys: number[] = attrib_map.getSeqKeys();
        const attrib_values: TAttribDataTypes[] = attrib_map.getSeqValues();
        const result = Array.from(attrib_keys.map(attrib_key => attrib_values[attrib_key]));
        return result;
    }
}
