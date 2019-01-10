import { GIModel } from './GIModel';
import { IAttribsData, IModelData, IAttribData, TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, IGeomData, IAttribsMaps, EAttribNames, Txyz, EEntTypeStr } from './common';
import { GIAttribMap } from './GIAttribMap';
import { vecAdd } from '@libs/geom/vectors';

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
        // helper function to ddd attributes to model
        function _addAttribData(
                exist_attribs_maps:  Map<string, GIAttribMap>,
                new_attribs_data: IAttribData[],
                num_existing_entities: number): void {
            // loop through all attributes, adding data
            new_attribs_data.forEach( new_attrib_data => {
                if (!exist_attribs_maps.has(new_attrib_data.name)) {
                    exist_attribs_maps.set(new_attrib_data.name, new GIAttribMap(
                        new_attrib_data.name,
                        new_attrib_data.data_type,
                        new_attrib_data.data_size
                    ));
                }
                exist_attribs_maps.get(new_attrib_data.name).addData(new_attrib_data, num_existing_entities);
            });
        }
        // data for all the new atttributes
        const attribs_data: IAttribsData = model_data.attributes;
        const geom_data: IGeomData = model_data.geometry;
        // add the attribute data
        // exist_attribs_maps, new_attribs_data, num_existing_entities, num_new_entities
        if (attribs_data.positions !== undefined) {
            _addAttribData(this._attribs_maps.ps, attribs_data.positions,
                this._model.geom.query.nextEntIndex(EEntType.POSI));
        }
        if (attribs_data.vertices !== undefined) {
            _addAttribData(this._attribs_maps._v, attribs_data.vertices,
                this._model.geom.query.nextEntIndex(EEntType.VERT));
        }
        if (attribs_data.edges !== undefined) {
            _addAttribData(this._attribs_maps._e, attribs_data.edges,
                this._model.geom.query.nextEntIndex(EEntType.EDGE));
        }
        if (attribs_data.wires !== undefined) {
            _addAttribData(this._attribs_maps._w, attribs_data.wires,
                this._model.geom.query.nextEntIndex(EEntType.WIRE));
        }
        if (attribs_data.faces !== undefined) {
            _addAttribData(this._attribs_maps._f, attribs_data.faces,
                this._model.geom.query.nextEntIndex(EEntType.FACE));
        }
        if (attribs_data.points !== undefined) {
            _addAttribData(this._attribs_maps.pt, attribs_data.points,
                this._model.geom.query.nextEntIndex(EEntType.POINT));
        }
        if (attribs_data.polylines !== undefined) {
            _addAttribData(this._attribs_maps.pl, attribs_data.polylines,
                this._model.geom.query.nextEntIndex(EEntType.PLINE));
        }
        if (attribs_data.polygons !== undefined) {
            _addAttribData(this._attribs_maps.pg, attribs_data.polygons,
                this._model.geom.query.nextEntIndex(EEntType.PGON));
        }
        if (attribs_data.collections !== undefined) {
            _addAttribData(this._attribs_maps.co, attribs_data.collections,
                this._model.geom.query.nextEntIndex(EEntType.COLL));
        }
    }
    /**
     * Creates a new attribte.
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     * @param data_size The data size of the attribute. For example, an XYZ vector has size=3.
     */
    public addAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs, data_size: number): GIAttribMap {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (!attribs.has(name)) {
            const attrib: GIAttribMap = new GIAttribMap(name, data_type, data_size);
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
    public setAttribValue(ent_type: EEntType, index: number, name: string, value: TAttribDataTypes): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            const [data_type, data_size]: [EAttribDataTypeStrs, number] = this._checkDataTypeSize(value);
            this.addAttrib(ent_type, name, data_type, data_size);
        }
        attribs.get(name).setEntVal(index, value);
    }
    /**
     * Set the xyz position by index
     * @param index
     * @param value
     */
    public setPosiCoords(index: number, xyz: Txyz): void {
        this._attribs_maps.ps.get(EAttribNames.COORDS).setEntVal(index, xyz);
    }
    /**
     * Move the xyz position by index
     * @param index
     * @param value
     */
    public movePosiCoords(index: number, xyz: Txyz): void {
        const old_xyz: Txyz = this._attribs_maps.ps.get(EAttribNames.COORDS).getEntVal(index) as Txyz;
        const new_xyz: Txyz = vecAdd(old_xyz, xyz);
        this._attribs_maps.ps.get(EAttribNames.COORDS).setEntVal(index, new_xyz);
    }
    /**
     * Copy attribs from one entity to another entity
     * @param ent_type
     * @param name
     */
    public copyAttribs(ent_type: EEntType, from_ent_i: number, to_ent_i: number): void {
        // get the attrib names
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib_names: string[] = Array.from(attribs.keys());
        // copy each attrib
        for (const attrib_name of attrib_names) {
            const attrib: GIAttribMap = attribs.get(name);
            const attrib_value: TAttribDataTypes =  attrib.getEntVal(from_ent_i);
            attrib.setEntVal(to_ent_i, attrib_value);
        }
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
        if (Array.isArray(value)) {
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
}
