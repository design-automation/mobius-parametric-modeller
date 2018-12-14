import { IAttribsData, EAttribDataTypeStrs, TAttribDataTypes, IAttribData, TCoord} from './GIJson';
import { GIAttribMap } from './GIAttribMap';
import { GIModel } from './GIModel';
import { EEntityTypeStr, IQueryComponent, idBreak,  } from './GICommon';
import { parse_query } from './GIAttribsQuery';

/**
 * Class for attributes.
 */
export class GIAttribs {
    private model: GIModel;
    // maps, the key is the name, the value is the map
    private posis: Map<string, GIAttribMap> = new Map();
    private verts: Map<string, GIAttribMap> = new Map();
    private edges: Map<string, GIAttribMap> = new Map();
    private wires: Map<string, GIAttribMap> = new Map();
    private faces: Map<string, GIAttribMap> = new Map();
    private colls: Map<string, GIAttribMap> = new Map();
    // all maps
    private attrib_maps = {
        po: this.posis,
        _v: this.verts,
        _e: this.edges,
        _w: this.wires,
        _f: this.faces,
        co: this.colls
    };
   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel) {
        this.model = model;
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IAttribsData {
        return {
            positions: Array.from(this.posis.values()).map(attrib => attrib.getData()),
            vertices: Array.from(this.verts.values()).map(attrib => attrib.getData()),
            edges: Array.from(this.edges.values()).map(attrib => attrib.getData()),
            wires: Array.from(this.wires.values()).map(attrib => attrib.getData()),
            faces: Array.from(this.faces.values()).map(attrib => attrib.getData()),
            collections: Array.from(this.colls.values()).map(attrib => attrib.getData())
        };
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param attribs_data The JSON data
     */
    public addData(attribs_data: IAttribsData): void {
        // Helper public to ddd attributes to model
        function _addAttribsData(exist_attribs_map:  Map<string, GIAttribMap>, new_attribs_data: IAttribData[], offset: number): void {
            new_attribs_data.forEach( new_attrib_data => {
                if (!exist_attribs_map.has(new_attrib_data.name)) {
                    exist_attribs_map.set(new_attrib_data.name, new GIAttribMap(new_attrib_data));
                } else {
                    exist_attribs_map.get(new_attrib_data.name).addData(new_attrib_data, offset);
                }
            });
        }
        _addAttribsData(this.posis, attribs_data.positions, this.model.geom().numPosis());
        _addAttribsData(this.verts, attribs_data.vertices, this.model.geom().numVerts());
        _addAttribsData(this.edges, attribs_data.edges, this.model.geom().numEdges());
        _addAttribsData(this.wires, attribs_data.wires, this.model.geom().numWires());
        _addAttribsData(this.faces, attribs_data.faces, this.model.geom().numFaces());
        _addAttribsData(this.colls, attribs_data.collections, this.model.geom().numColls());
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
    private _addAttrib(type_str: EEntityTypeStr, name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        const attribs: Map<string, GIAttribMap> = this.attrib_maps[type_str];
        if (!attribs.has(name)) {
            const attrib: GIAttribMap = new GIAttribMap({name: name, data_type: data_type, data_size: data_size, data: []});
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
        const attribs: Map<string, GIAttribMap> = this.attrib_maps[type_str];
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
        const attribs: Map<string, GIAttribMap> = this.attrib_maps[type_str];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        return attribs.get(name).get(index);
    }
    /**
     * Shortcut for getting coordinates from a numeric index (i.e. this is not an ID)
     * @param posi_i
     */
    public getPosiCoord(posi_i: number): TCoord {
        return this.posis.get('coordinates').get(posi_i) as TCoord;
    }
    // ============================================================================
    // Get entity attrib names
    // ============================================================================
    public getPosiAttribNames(): string[] {
        return Array.from(this.posis.keys());
    }
    public getVertAttribNames(): string[] {
        return Array.from(this.verts.keys());
    }
    public getEdgeAttribNames(): string[] {
        return Array.from(this.edges.keys());
    }
    public getWireAttribNames(): string[] {
        return Array.from(this.wires.keys());
    }
    public getFaceAttribNames(): string[] {
        return Array.from(this.faces.keys());
    }
    public getCollAttribNames(): string[] {
        return Array.from(this.colls.keys());
    }
    // ============================================================================
    // Query an entity attrib
    // ============================================================================

    /**
     * Query the model using a query strings.
     * Returns a list of IDs.
     */
    public queryAttribs(query_str: string): string[] {
        const queries: IQueryComponent[][] = parse_query(query_str);
        if (!queries) { return []; }
        const query1: IQueryComponent = queries[0][0];
        return this.queryAttrib(query1);
    }
    /**
     * Query the model using a sequence of && and || queries.
     * Returns a list of IDs.
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
        const attribs: Map<string, GIAttribMap> = this.attrib_maps[query.attrib_type];
        if (!attribs.has(query.attrib_name)) { return []; }
        const entities_i: number[] = attribs.get(query.attrib_name).getKeysFromValueStr(query.attrib_value_str, query.attrib_index);
        const entities_id: string[] = entities_i.map(entity_i => query.attrib_type + entity_i);
        return entities_id;
    }
    // ============================================================================
    // Add an entity attrib
    // ============================================================================
    public addPosiAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.POSI, name, data_type, data_size);
    }
    public addVertAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.VERT, name, data_type, data_size);
    }
    public addEdgeAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.EDGE, name, data_type, data_size);
    }
    public addWireAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.WIRE, name, data_type, data_size);
    }
    public addFaceAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.FACE, name, data_type, data_size);
    }
    public addCollAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.COLL, name, data_type, data_size);
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
        const coords_attrib: GIAttribMap = this.posis.get('coordinates');
        const coords_keys: number[] = coords_attrib.getSeqKeys();
        const coords_values: TAttribDataTypes[] = coords_attrib.getSeqValues();
        const verts_cords_values: number[] = [];
        verts.forEach( coords_i => verts_cords_values.push(...coords_values[coords_keys[coords_i]] as number[]));
        return verts_cords_values;
    }
    /**
     * Get a flat array of attribute values for all the vertices.
     * @param attrib_name The name of the vertex attribute. Either NORMAL or COLOR.
     */
    public get3jsSeqVertsAttrib(attrib_name: string): number[] {
        if (!this.verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this.verts.get(attrib_name);
        const attrib_keys: number[] = attrib_map.getSeqKeys();
        const attrib_values: TAttribDataTypes[] = attrib_map.getSeqValues();
        const result = [].concat(...attrib_keys.map(attrib_key => attrib_values[attrib_key]));
        return result;
    }

    public getVertsCoords(attrib_name: string): GIAttribMap {
        const coords_attrib: GIAttribMap = this.posis.get('coordinates');
        return coords_attrib;
    }

    public getVertsAttrib(attrib_name: string) {
        if (!this.verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this.verts.get(attrib_name);
        const attrib_keys: number[] = attrib_map.getSeqKeys();
        const attrib_values: TAttribDataTypes[] = attrib_map.getSeqValues();
        const result = Array.from(attrib_keys.map(attrib_key => attrib_values[attrib_key]));
        return result;
    }
}
