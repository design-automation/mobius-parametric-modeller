import { GIModel } from "./GIModel";
import { IAttribsData, IModelData, IAttribData, TId, TAttribDataTypes, EEntityTypeStr,
    EAttribDataTypeStrs, IGeomData, IAttribsMaps, EEntStrToAttribMap } from "./common";
import { GIAttribMap } from "./GIAttribMap";
import { idBreak } from "./id";

/**
 * Class for attributes.
 */
export class GIAttribsAdd {
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
        _addAttribData(this._attribs_maps.posis, attribs_data.positions, this._model.geom.query.numPosis(), geom_data.num_positions);
        _addAttribData(this._attribs_maps.verts, attribs_data.vertices, this._model.geom.query.numVerts(), geom_data.vertices.length);
        _addAttribData(this._attribs_maps.edges, attribs_data.edges, this._model.geom.query.numEdges(), geom_data.edges.length);
        _addAttribData(this._attribs_maps.wires, attribs_data.wires, this._model.geom.query.numWires(), geom_data.wires.length);
        _addAttribData(this._attribs_maps.faces, attribs_data.faces, this._model.geom.query.numFaces(), geom_data.faces.length);
        _addAttribData(this._attribs_maps.colls, attribs_data.collections, this._model.geom.query.numColls(), geom_data.collections.length);
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
        const attribs_maps_key: string = EEntStrToAttribMap[type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
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
    public setAttribValue(id: TId, name: string, value: TAttribDataTypes): void {
        const [type_str, index]: [string, number] = idBreak(id);
        const attribs_maps_key: string = EEntStrToAttribMap[type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) { throw new Error('Attribute does not exist.'); }
        attribs.get(name).set(index, value);
    }
    // ============================================================================
    // Add an entity attrib
    // ============================================================================
    public addPosiAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.POSI, name, data_type, data_size, this._model.geom.query.numPosis());
    }
    public addVertAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.VERT, name, data_type, data_size, this._model.geom.query.numVerts());
    }
    public addEdgeAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.EDGE, name, data_type, data_size, this._model.geom.query.numEdges());
    }
    public addWireAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.WIRE, name, data_type, data_size, this._model.geom.query.numWires());
    }
    public addFaceAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.FACE, name, data_type, data_size, this._model.geom.query.numFaces());
    }
    public addCollAttrib(name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        return this._addAttrib(EEntityTypeStr.COLL, name, data_type, data_size, this._model.geom.query.numColls());
    }
}

