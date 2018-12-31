import { GIModel } from "./GIModel";
import { IAttribsData, IModelData, IAttribData, TId, TAttribDataTypes, EEntityTypeStr,
    EAttribDataTypeStrs, IGeomData, IAttribsMaps, EEntStrToAttribMap, EAttribNames, Txyz } from "./common";
import { GIAttribMap } from "./GIAttribMap";
import { isArray } from "util";
import { vecsAdd } from "@libs/geom/vectors";

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
     * Utility method to check the data type and size of a value
     * @param value
     */
    private _checkDataTypeSize(value: TAttribDataTypes): [EAttribDataTypeStrs, number] {
        let data_size: number;
        let first_value = null;
        if (isArray(value)) {
            const values = value as number[] | string[];
            if (values.length === 1) {
                throw new Error('An array data type must have more than one value.');
            }
            first_value = values[0];
            data_size = values.length;
        } else {
            first_value = value;
            data_size = 1;
        }
        let data_type: EAttribDataTypeStrs = null;
        if (typeof first_value === 'number') {
            data_type = EAttribDataTypeStrs.FLOAT;
        } else if (typeof first_value === 'string') {
            data_type = EAttribDataTypeStrs.STRING;
        } else {
            throw new Error('Data type for new attribute not recognised.');
        }
        return [data_type, data_size];
    }
    /**
     * Utility method to get num entities based on Entity Type
     * @param ent_type_str
     */
    private _checkNumEntities(ent_type_str: EEntityTypeStr): number {
        switch (ent_type_str) {
            case EEntityTypeStr.POSI:
                return this._model.geom.query.numPosis();
            case EEntityTypeStr.VERT:
                return this._model.geom.query.numVerts();
            case EEntityTypeStr.EDGE:
                return this._model.geom.query.numEdges();
            case EEntityTypeStr.WIRE:
                return this._model.geom.query.numWires();
            case EEntityTypeStr.FACE:
                return this._model.geom.query.numFaces();
            case EEntityTypeStr.COLL:
                return this._model.geom.query.numColls();
            default:
                throw new Error('Entity type string not recognised');
                break;
        }
    }
    // ============================================================================
    // Public methods
    // ============================================================================
    /**
     * Creates a new attribte.
     * @param ent_type_str The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     * @param data_size The data size of the attribute. For example, an XYZ vector has size=3.
     */
    public addAttrib(ent_type_str: EEntityTypeStr, name: string, data_type: EAttribDataTypeStrs,
        data_size: number): GIAttribMap {
    const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
    const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
    const num_entities: number = this._checkNumEntities(ent_type_str);
    if (!attribs.has(name)) {
        const attrib: GIAttribMap = new GIAttribMap(name, data_type, data_size, num_entities);
        attribs.set(name, attrib);
    }
    return attribs[name];
}
    /**
     * Set an entity attrib value
     * @param id
     * @param name
     * @param value
     */
    public setAttribValue(ent_type_str: EEntityTypeStr, index: number, name: string, value: TAttribDataTypes): void {
        const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            const [data_type, data_size]: [EAttribDataTypeStrs, number] = this._checkDataTypeSize(value);
            this.addAttrib(ent_type_str, name, data_type, data_size);
        }
        attribs.get(name).set(index, value);
    }
    /**
     * Set the xyz position by index
     * @param index
     * @param value
     */
    public setPosiCoords(index: number, xyz: Txyz): void {
        this._attribs_maps.posis.get(EAttribNames.COORDS).set(index, xyz);
    }
    /**
     * Move the xyz position by index
     * @param index
     * @param value
     */
    public movePosiCoords(index: number, xyz: Txyz): void {
        const old_xyz: Txyz = this._attribs_maps.posis.get(EAttribNames.COORDS).get(index) as Txyz;
        const new_xyz: Txyz = vecsAdd(old_xyz, xyz);
        this._attribs_maps.posis.get(EAttribNames.COORDS).set(index, new_xyz);
    }
}

