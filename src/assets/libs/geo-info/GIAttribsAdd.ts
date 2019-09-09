import { GIModel } from './GIModel';
import { IAttribsData, IModelData, IAttribData, TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, IGeomData, IAttribsMaps, EAttribNames, Txyz, EEntTypeStr, EAttribPush } from './common';
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
     * Creates a new attribte, at either the model level or the entity level.
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    public addAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, any> = this._attribs_maps[attribs_maps_key];
        if (ent_type === EEntType.MOD) {
            if (!attribs.has(name)) {
                attribs.set(name, null);
            }
        } else {
            if (!attribs.has(name)) {
                const attrib: GIAttribMap = new GIAttribMap(name, data_type);
                attribs.set(name, attrib);
            } else {
                if (attribs.get(name).getDataType() !== data_type) {
                    throw new Error('Attribute could not be created due to conflict with existing attribute with same name.');
                }
            }
        }
    }
    /**
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribVal(name: string, value: TAttribDataTypes): void {
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
    public setModelAttribListIdxVal(name: string, idx: number, value: any): void {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attrib: Map<string, any> = this._attribs_maps[attribs_maps_key];
        const list_value: TAttribDataTypes = attrib.get(name);
        if (list_value === undefined) { throw new Error('Attribute with this name does not exist.'); }
        if (!Array.isArray(list_value)) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        list_value[idx] = value;
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribDictKeyVal(name: string, key: string, value: any): void {
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attrib: Map<string, any> = this._attribs_maps[attribs_maps_key];
        const dict_value: TAttribDataTypes = attrib.get(name);
        if (dict_value === undefined) { throw new Error('Attribute with this name does not exist.'); }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        dict_value[key] = value;
    }
    /**
     * Set an entity attrib value
     * If the attribute does not exist, then it is created.
     * @param id
     * @param name
     * @param value
     */
    public setAttribVal(ent_type: EEntType, ents_i: number|number[], name: string, value: TAttribDataTypes): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            const new_data_type: EAttribDataTypeStrs = this._checkDataTypeSize(value);
            this.addAttrib(ent_type, name, new_data_type);
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
    public setAttribListIdxVal(ent_type: EEntType, ents_i: number|number[], name: string,
            idx: number, value: any): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (attrib.getDataType() !== EAttribDataTypeStrs.LIST) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        attrib.setEntListIdxVal(ents_i, idx, value);
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setAttribDictKeyVal(ent_type: EEntType, ents_i: number|number[], name: string,
        key: string, value: any): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: GIAttribMap = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (attrib.getDataType() !== EAttribDataTypeStrs.DICT) {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        attrib.setEntDictKeyVal(ents_i, key, value);
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
    public pushAttribVals(source_ent_type: EEntType, source_attrib_name: string, source_indices: number[],
            target_ent_type: EEntType, target_attrib_name: string, method: EAttribPush): void {
        if (source_ent_type === target_ent_type) { return; }
        // check that the attribute exists
        if (! this._model.attribs.query.hasAttrib(source_ent_type, source_attrib_name)) {
            throw new Error('The attribute does not exist.');
        }
        // get the data type and data size of the existing attribute
        const data_type: EAttribDataTypeStrs = this._model.attribs.query.getAttribDataType(source_ent_type, source_attrib_name);
        const data_size: number = this._model.attribs.query.getAttribDataLength(source_ent_type, source_attrib_name);
        // move attributes from entities up to the model, or form model down to entities
        if (target_ent_type === EEntType.MOD) {
            this.addAttrib(target_ent_type, target_attrib_name, data_type);
            const attrib_values: TAttribDataTypes[] = [];
            for (const index of source_indices) {
                attrib_values.push(
                    this._model.attribs.query.getAttribVal(source_ent_type, source_attrib_name, index) as TAttribDataTypes);
            }
            const value: TAttribDataTypes = this._aggregateVals(attrib_values, data_size, method);
            this.setModelAttribVal(target_attrib_name, value);
            return;
        } else if (source_ent_type === EEntType.MOD) {
            const value: TAttribDataTypes = this._model.attribs.query.getModelAttribVal(source_attrib_name);
            this.addAttrib(target_ent_type, target_attrib_name, data_type);
            const target_ents_i: number[] = this._model.geom.query.getEnts(target_ent_type, false);
            for (const target_ent_i of target_ents_i) {
                this.setAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
            }
            return;
        }
        // get all the values for each target
        const attrib_values_map: Map<number, TAttribDataTypes[]> = new Map();
        for (const index of source_indices) {
            const attrib_value: TAttribDataTypes =
                this._model.attribs.query.getAttribVal(source_ent_type, source_attrib_name, index) as TAttribDataTypes;
            const target_ents_i: number[] = this._model.geom.query.navAnyToAny(source_ent_type, target_ent_type, index);
            for (const target_ent_i of target_ents_i) {
                if (! attrib_values_map.has(target_ent_i)) {
                        attrib_values_map.set(target_ent_i, []);
                }
                attrib_values_map.get(target_ent_i).push(attrib_value);
            }
        }
        // create the new target attribute if it does not already exist
        this.addAttrib(target_ent_type, target_attrib_name, data_type);
        // calculate the new value and set the attribute
        attrib_values_map.forEach( (attrib_values, target_ent_i) => {
            let value: TAttribDataTypes = attrib_values[0];
            if (attrib_values.length > 1 && data_type === EAttribDataTypeStrs.NUMBER) {
                value = this._aggregateVals(attrib_values, data_size, method);
            }
            this.setAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
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
    private _aggregateVals(values: TAttribDataTypes[], data_size: number, method: EAttribPush): TAttribDataTypes {
        switch (method) {
            case EAttribPush.AVERAGE:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.mean(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.mean(values);
                }
            case EAttribPush.MEDIAN:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.median(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.median(values);
                }
            case EAttribPush.SUM:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.sum(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.sum(values);
                }
            case EAttribPush.MIN:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.min(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.min(values);
                }
            case EAttribPush.MAX:
                if (data_size > 1) {
                    const result: number[] = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.max(values.map(vec => vec[i]));
                    }
                    return result;
                } else {
                    return mathjs.max(values);
                }
            case EAttribPush.LAST:
                return values[values.length - 1];
            default:
                return values[0]; // EAttribPush.FIRST
        }
    }
    // /**
    //  * Utility method to check the data type and size of a value
    //  * @param value
    //  */
    // private _checkDataTypeSize(value: TAttribDataTypes): [EAttribDataTypeStrs, number] {
    //     let data_size: number;
    //     let first_value = null;
    //     if (Array.isArray(value)) {
    //         const values = value as number[] | string[];
    //         if (values.length === 1) {
    //             throw new Error('An array data type must have more than one value.');
    //         }
    //         first_value = values[0];
    //         data_size = values.length;
    //     } else {
    //         first_value = value;
    //         data_size = 1;
    //     }
    //     let data_type: EAttribDataTypeStrs = null;
    //     if (typeof first_value === 'number') {
    //         data_type = EAttribDataTypeStrs.NUMBER;
    //     } else if (typeof first_value === 'string') {
    //         data_type = EAttribDataTypeStrs.STRING;
    //     } else {
    //         throw new Error('Data type for new attribute not recognised.');
    //     }
    //     return [data_type, data_size];
    // }
    /**
     * Utility method to check the data type of an attribute.
     * @param value
     */
    private _checkDataTypeSize(value: TAttribDataTypes): EAttribDataTypeStrs {
        if (typeof value === 'string') {
            return EAttribDataTypeStrs.STRING;
        } else if (typeof value === 'number') {
            return EAttribDataTypeStrs.NUMBER;
        } else if (typeof value === 'boolean') {
            return EAttribDataTypeStrs.BOOLEAN;
        } else if (Array.isArray(value)) {
            return EAttribDataTypeStrs.LIST;
        } else if (typeof value === 'object') {
            return EAttribDataTypeStrs.LIST;
        }
        throw new Error('Data type for new attribute not recognised.');
    }
}
