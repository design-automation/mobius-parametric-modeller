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
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribValue(name: string, value: TAttribDataTypes): void {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attrib: Map<string, any> = this._attribs_maps[attribs_maps_key];
        attrib.set(name, value);
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribIndexedValue(name: string, value_index: number, value: number|string): void {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attrib: Map<string, any> = this._attribs_maps[attribs_maps_key];
        const list_value: TAttribDataTypes = attrib.get(name);
        if (list_value === undefined) { throw new Error('Attribute with this name does not exist.'); }
        if (!Array.isArray(list_value)) { throw new Error('Attribute is not a list, so indexed values are not allowed.'); }
        if (value_index >= list_value.length) { throw new Error('Value index is out of range for attribute list size.'); }
        list_value[value_index] = value;
    }
    /**
     * Set an entity attrib value
     * If the attribute does not exist, then it is created.
     * @param id
     * @param name
     * @param value
     */
    public setAttribValue(ent_type: EEntType, ents_i: number|number[], name: string, value: TAttribDataTypes): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            const [data_type, data_size]: [EAttribDataTypeStrs, number] = this._checkDataTypeSize(value);
            this.addAttrib(ent_type, name, data_type, data_size);
        }
        attribs.get(name).setEntVal(ents_i, value);
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setAttribIndexedValue(ent_type: EEntType, ents_i: number|number[], name: string,
            value_index: number, value: number|string): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (attrib.getDataSize() === 1) { throw new Error('Attribute is not a list, so indexed values are not allowed.'); }
        if (value_index >= attrib.getDataSize()) { throw new Error('Value index is out of range for attribute list size.'); }
        attrib.setEntIdxVal(ents_i, value_index, value);
    }
    /**
     * Delete the entity from an attribute
     * If there is no value for the entity, then this does nothing
     * If there is a value, then both the entity index and the value are deleted
     * @param ent_type
     * @param name
     */
    public delEntFromAttribs(ent_type: EEntType, ents_i: number|number[]): void {
        // get the attrib names
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        attribs.forEach( attrib => attrib.delEnt(ents_i) );
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
            const attrib_value: TAttribDataTypes =  attrib.getEntVal(from_ent_i) as TAttribDataTypes;
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
