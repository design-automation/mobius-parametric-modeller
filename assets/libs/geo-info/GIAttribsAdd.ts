import { GIModel } from './GIModel';
import { IAttribsData, IModelData, IAttribData, TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, IGeomData, IAttribsMaps, EAttribNames, Txyz, EEntTypeStr, EAttribPromote } from './common';
import { GIAttribMap } from './GIAttribMap';
import { vecAdd, vecDiv, vecSum } from '@libs/geom/vectors';
import * as mathjs from 'mathjs';

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
     * If the attribute already exists, then the existing attribute is returned.
     *
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
        } else {
            if (attribs.get(name).getDataType() !== data_type || attribs.get(name).getDataSize() !== data_size) {
                throw new Error('Attribute could not be created do to conflict with existing attribute with same name.');
            }
        }
        return attribs.get(name);
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
            const [new_data_type, new_data_size]: [EAttribDataTypeStrs, number] = this._checkDataTypeSize(value);
            this.addAttrib(ent_type, name, new_data_type, new_data_size);
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
     * Copy all attribs from one entity to another entity
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
            const attrib: GIAttribMap = attribs.get(attrib_name);
            const attrib_value: TAttribDataTypes =  attrib.getEntVal(from_ent_i) as TAttribDataTypes;
            attrib.setEntVal(to_ent_i, attrib_value);
        }
    }
    /**
     * Promotes attrib values up and down the hierarchy.
     */
    public promoteAttribValues(ent_type: EEntType, attrib_name: string, indices: number[], to_ent_type: EEntType,
            method: EAttribPromote): void {
        if (ent_type === to_ent_type) { return; }
        // check that the attribute exists
        if (! this._model.attribs.query.hasAttrib(ent_type, attrib_name)) {
            throw new Error('The attribute does not exist.');
        }
        // get the data type and data size of the existing attribute
        const data_type: EAttribDataTypeStrs = this._model.attribs.query.getAttribDataType(ent_type, attrib_name);
        const data_size: number = this._model.attribs.query.getAttribDataSize(ent_type, attrib_name);
        // move attributes from entities up to the model, or form model down to entities
        if (to_ent_type === EEntType.MOD) {
            this.addAttrib(to_ent_type, attrib_name, data_type, data_size);
            const attrib_values: TAttribDataTypes[] = [];
            for (const index of indices) {
                attrib_values.push(this._model.attribs.query.getAttribValue(ent_type, attrib_name, index) as TAttribDataTypes);
            }
            const value: TAttribDataTypes = this._aggregateValues(attrib_values, data_size, method);
            this.setModelAttribValue(attrib_name, value);
            return;
        } else if (ent_type === EEntType.MOD) {
            const value: TAttribDataTypes = this._model.attribs.query.getModelAttribValue(attrib_name);
            this.addAttrib(to_ent_type, attrib_name, data_type, data_size);
            const target_ents_i: number[] = this._model.geom.query.getEnts(to_ent_type, false);
            for (const target_ent_i of target_ents_i) {
                this.setAttribValue(to_ent_type, target_ent_i, attrib_name, value);
            }
            return;
        }
        // get all the values for each target
        const attrib_values_map: Map<number, TAttribDataTypes[]> = new Map();
        for (const index of indices) {
            const attrib_value: TAttribDataTypes =
                this._model.attribs.query.getAttribValue(ent_type, attrib_name, index) as TAttribDataTypes;
            const target_ents_i: number[] = this._model.geom.query.navAnyToAny(ent_type, to_ent_type, index);
            for (const target_ent_i of target_ents_i) {
                if (! attrib_values_map.has(target_ent_i)) {
                        attrib_values_map.set(target_ent_i, []);
                }
                attrib_values_map.get(target_ent_i).push(attrib_value);
            }
        }
        // create the new target attribute if it does not already exist
        this.addAttrib(to_ent_type, attrib_name, data_type, data_size);
        // calculate the new value and set the attribute
        attrib_values_map.forEach( (attrib_values, target_ent_i) => {
            let value: TAttribDataTypes = attrib_values[0];
            if (attrib_values.length > 1 && data_type === EAttribDataTypeStrs.FLOAT) {
                value = this._aggregateValues(attrib_values, data_size, method);
            }
            this.setAttribValue(to_ent_type, target_ent_i, attrib_name, value);
        });
    }
    /**
     * Transfer attrib values to neighbouring entities of the same type.
     * Neighbouring entities are those that share the same positions.
     */
    public transferAttribValues(ent_type: EEntType, attrib_name: string, indices: number[], method: number): void {
        throw new Error('Attribute transfer is not yet implemented.');
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    private _aggregateValues(values: TAttribDataTypes[], data_size: number, method: EAttribPromote): TAttribDataTypes {
        switch (method) {
            case EAttribPromote.AVERAGE:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.mean(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.mean(values);
                }
            case EAttribPromote.MEDIAN:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.median(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.median(values);
                }
            case EAttribPromote.SUM:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.sum(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.sum(values);
                }
            case EAttribPromote.MIN:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.min(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.min(values);
                }
            case EAttribPromote.MAX:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.max(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.max(values);
                }
            case EAttribPromote.LAST:
                return values[values.length - 1];
            default:
                return values[0]; // EAttribPromote.FIRST
        }
    }
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
