import { IAttribsData, EAttribDataTypeStrs, TAttribDataTypes, IAttribData, TCoords} from './json_data';
import { GIAttribMap } from './GIAttribMap';
import { GIModel } from './GIModel';
/**
 * Enum of the 6 levels at which attribtes can be added.
 */
enum ELevels {
    POSIS,
    VERTS,
    EDGES,
    WIRES,
    FACES,
    COLLS
}
/**
 * Class for attributes.
 */
export class GIAttribs {
    private model: GIModel;
    private posis: Map<string, GIAttribMap> = new Map();
    private verts: Map<string, GIAttribMap> = new Map();
    private edges: Map<string, GIAttribMap> = new Map();
    private wires: Map<string, GIAttribMap> = new Map();
    private faces: Map<string, GIAttribMap> = new Map();
    private colls: Map<string, GIAttribMap> = new Map();
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
        // Helper function to ddd attributes to model
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
     * Returns one of the attribute maps.
     * @param level
     */
    private _getLevel(level: ELevels): Map<string, GIAttribMap> {
        return [this.posis, this.verts, this.edges, this.wires, this.faces, this.colls][level];
    }
    /**
     * Creates a new attribte.
     * @param level The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     * @param data_size The data size of the attribute. For example, an XYZ vector has size=3.
     */
    private _addAttrib(level: ELevels, name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        const attribs: Map<string, GIAttribMap> = this._getLevel(level);
        if (!attribs.has(name)) {
            const attrib: GIAttribMap = new GIAttribMap({name: name, data_type: data_type, data_size: data_size, data: []});
            attribs.set(name, attrib);
        }
        return attribs[name];
    }
    /**
     * Sets a single attribute value.
     * @param level
     * @param name
     * @param key
     * @param value
     */
    private _setAttribValue(level: ELevels, index: number, name: string, value: TAttribDataTypes): void {
        const attribs: Map<string, GIAttribMap> = this._getLevel(level);
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        attribs.get(name).set(index, value);
    }
    /**
     * Gets a single attribute value.
     * @param level
     * @param name
     * @param key
     * @param value
     */
    private _getAttribValue(level: ELevels, index: number, name: string): TAttribDataTypes {
        const attribs: Map<string, GIAttribMap> = this._getLevel(level);
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        return attribs.get(name).get(index);
    }
    // ============================================================================
    // Threejs
    // ============================================================================
    /**
     * Get a list of all the coordinates.
     * This returns two arrays, one with indexes, and another with values.
     * For example, suppose the bimap contained  [  [[1,3], [2.3,4.5,6.7]],  [[0,2], [9.8,7.6,5.4]]  ].
     * The sequentail coordinate arrays would be [  [1,0,1,0],  [[2.3,4.5,6.7],[9.8,7.6,5.4]]  ].
     * These array can be use for building the threejs scene using typed arrays.
     */
    public getSeqCoords(): [number[], TCoords[]] {
        const coords_attrib: GIAttribMap = this.posis.get('coordinates');
        const seq_keys: number[] = coords_attrib.getSeqKeys();
        const seq_values: TCoords[] = coords_attrib.getSeqValues() as TCoords[];
        return [seq_keys, seq_values];
    }
    // ============================================================================
    // Set an entity attrib value
    // ============================================================================
    public setPosiAttribValue(index: number, name: string, value: TAttribDataTypes): void {
        this._setAttribValue(ELevels.POSIS, index, name, value);
    }
    public setVertAttribValue(index: number, name: string, value: TAttribDataTypes): void {
        this._setAttribValue(ELevels.VERTS, index, name, value);
    }
    public setEdgeAttribValue(index: number, name: string, value: TAttribDataTypes): void {
        this._setAttribValue(ELevels.EDGES, index, name, value);
    }
    public setWireAttribValue(index: number, name: string, value: TAttribDataTypes): void {
        this._setAttribValue(ELevels.WIRES, index, name, value);
    }
    public setFaceAttribValue(index: number, name: string, value: TAttribDataTypes): void {
        this._setAttribValue(ELevels.FACES, index, name, value);
    }
    public setCollAttribValue(index: number, name: string, value: TAttribDataTypes): void {
        this._setAttribValue(ELevels.COLLS, index, name, value);
    }
    // ============================================================================
    // Get an entity attrib value
    // ============================================================================
    public getPosiAttribValue(index: number, name: string): TAttribDataTypes {
        return this._getAttribValue(ELevels.POSIS, index, name);
    }
    public getVertAttribValue(index: number, name: string): TAttribDataTypes {
        return this._getAttribValue(ELevels.VERTS, index, name);
    }
    public getEdgeAttribValue(index: number, name: string): TAttribDataTypes {
        return this._getAttribValue(ELevels.EDGES, index, name);
    }
    public getWireAttribValue(index: number, name: string): TAttribDataTypes {
        return this._getAttribValue(ELevels.WIRES, index, name);
    }
    public getFaceAttribValue(index: number, name: string): TAttribDataTypes {
        return this._getAttribValue(ELevels.FACES, index, name);
    }
    public getCollAttribValue(index: number, name: string): TAttribDataTypes {
        return this._getAttribValue(ELevels.COLLS, index, name);
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
    // Add an entity attrib
    // ============================================================================
    public addPosiAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(ELevels.POSIS, name, data_type, data_size);
    }
    public addVertAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(ELevels.VERTS, name, data_type, data_size);
    }
    public addEdgeAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(ELevels.EDGES, name, data_type, data_size);
    }
    public addWireAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(ELevels.WIRES, name, data_type, data_size);
    }
    public addFaceAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(ELevels.FACES, name, data_type, data_size);
    }
    public addCollAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(ELevels.COLLS, name, data_type, data_size);
    }
}
