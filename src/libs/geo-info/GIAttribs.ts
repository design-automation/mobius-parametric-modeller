import { IAttribsData, EAttribDataTypeStrs, TAttribDataTypes, IAttribData} from './json_data';
import { GIAttribMap } from './GIAttribMap';
import { GIModel } from './GIModel';

/**
 * Enum of the 6 levels at which attribtes can be added.
 */
export enum ELevels {
    POSIS,
    VERTS,
    EDGES,
    WIRES,
    FACES,
    COLLS
}
/**
 * Class for all attribute methods.
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
     * Sets the data in this model from JSON data.
     * The existing data in the model is deleted.
     * @param attribs_data The JSON data
     */
    public setData (attribs_data: IAttribsData): void {
        attribs_data.positions.forEach( attrib => this.posis[attrib.name] = new GIAttribMap(attrib));
        attribs_data.vertices.forEach( attrib => this.verts[attrib.name] = new GIAttribMap(attrib));
        attribs_data.edges.forEach( attrib => this.edges[attrib.name] = new GIAttribMap(attrib));
        attribs_data.wires.forEach( attrib => this.wires[attrib.name] = new GIAttribMap(attrib));
        attribs_data.faces.forEach( attrib => this.faces[attrib.name] = new GIAttribMap(attrib));
        attribs_data.collections.forEach( attrib => this.colls[attrib.name] = new GIAttribMap(attrib));
    }
    /**
     * Returns one of the attribute maps.
     * @param level
     */
    private _getLevel(level: ELevels): Map<string, GIAttribMap> {
        return [this.posis, this.verts, this.edges, this.wires, this.faces, this.colls][level];
    }

    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param model_data The JSON data
     */
    public addData(attribs_data: IAttribsData): void {
        // Helper function to ddd attributes to model
        function _addAttribsData(exist_attribs_map:  Map<string, GIAttribMap>, new_attribs_data: IAttribData[], offset: number): void {
            new_attribs_data.forEach( new_attrib_data => {
                if (!exist_attribs_map.has(new_attrib_data.name)) {
                    exist_attribs_map[new_attrib_data.name] = new GIAttribMap();
                }
                exist_attribs_map[new_attrib_data.name].addData(new_attrib_data, offset);
            });
        }
        _addAttribsData(this.posis, attribs_data.positions, this.model.geom().numPosis());
        _addAttribsData(this.verts, attribs_data.vertices, this.model.geom().numVerts());
        _addAttribsData(this.edges, attribs_data.edges, this.model.geom().numEdges());
        _addAttribsData(this.wires, attribs_data.wires, this.model.geom().numWires());
        _addAttribsData(this.faces, attribs_data.faces, this.model.geom().numFaces());
        _addAttribsData(this.colls, attribs_data.collections, this.model.geom().numColls());
    }
    /**
     * Creates a new attribte.
     * @param level The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     * @param data_size The data size of the attribute. For example, an XYZ vector has size=3.
     */
    public addAttrib(level: ELevels, name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        const attribs: Map<string, GIAttribMap> = this._getLevel(level);
        if (!attribs.has(name)) {
            attribs[name] = new GIAttribMap({name: name, data_type: data_type, data_size: data_size, data: []});
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
    public setAttribValue(level: ELevels, name: string, key: number, value: TAttribDataTypes): void {
        const attribs: Map<string, GIAttribMap> = this._getLevel(level);
        if (attribs[name] === undefined) { throw new Error('Attribute does not exist.'); }
        attribs[name].set(key, value);
    }
    /**
     * Gets a single attribute value.
     * @param level
     * @param name
     * @param key
     * @param value
     */
    public getAttribValue(level: ELevels, name: string, key: number): TAttribDataTypes {
        const attribs: Map<string, GIAttribMap> = this._getLevel(level);
        if (attribs[name] === undefined) { throw new Error('Attribute does not exist.'); }
        return attribs[name].get(key);
    }
}
