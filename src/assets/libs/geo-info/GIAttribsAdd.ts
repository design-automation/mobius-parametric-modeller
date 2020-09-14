import { GIModel } from './GIModel';
import { TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, IAttribsMaps, EAttribNames, Txyz, EEntTypeStr, EAttribPush, TAttribMap } from './common';
import { vecAdd } from '@libs/geom/vectors';
import * as mathjs from 'mathjs';
import { GIModelData } from './GIModelData';
import { GIAttribMapBool } from './GIAttribMapBool';
import { GIAttribMap } from './GIAttribMap';

/**
 * Class for attributes.
 */
export class GIAttribsAdd {
    private _modeldata: GIModelData;
    private _attribs_maps: IAttribsMaps;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData, attribs_maps: IAttribsMaps) {
        this._modeldata = modeldata;
        this._attribs_maps = attribs_maps;
    }
    /**
     * Creates a new attribte, at either the model level or the entity level.
     * This function is call by var@att_name and by @att_name
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    public addAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): void {
        if (ent_type === EEntType.MOD) {
            this.addModelAttrib(name);
        } else {
            this.addEntAttrib(ent_type, name, data_type);
        }
    }
    /**
     * Creates a new attribte at the model level
     *
     * @param name The name of the attribute.
     */
    public addModelAttrib(name: string): void {
        if (!this._attribs_maps.mo.has(name)) {
            this._attribs_maps.mo.set(name, null);
        }
    }
    /**
     * Creates a new attribte at an  entity level.
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    public addEntAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): TAttribMap {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, any> = this._attribs_maps[attribs_maps_key];
        let attrib: TAttribMap;
        if (!attribs.has(name)) {
            if (data_type === EAttribDataTypeStrs.BOOLEAN) {
                attrib = new GIAttribMapBool(this._modeldata, name, ent_type, data_type);
            } else {
                attrib = new GIAttribMap(this._modeldata, name, ent_type, data_type);
            }
            attribs.set(name, attrib);
        } else {
            attrib = attribs.get(name);
            if (attrib.getDataType() !== data_type) {
                throw new Error('Attribute could not be created due to conflict with existing attribute with same name.');
            }
        }
        return attrib;
    }
    /**
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribVal(name: string, value: TAttribDataTypes): void {
        this._attribs_maps.mo.set(name, value);
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribListIdxVal(name: string, idx: number, value: any): void {
        const list_value: TAttribDataTypes = this._attribs_maps.mo.get(name);
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
        const dict_value: TAttribDataTypes = this._attribs_maps.mo.get(name);
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
    public setEntAttribVal(ent_type: EEntType, ents_i: number|number[], name: string, value: TAttribDataTypes): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
        if (attribs.get(name) === undefined) {
            const new_data_type: EAttribDataTypeStrs = this._checkDataType(value);
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
    public setEntAttribListIdxVal(ent_type: EEntType, ents_i: number|number[], name: string,
            idx: number, value: any): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: TAttribMap = attribs.get(name);
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
    public setEntAttribDictKeyVal(ent_type: EEntType, ents_i: number|number[], name: string,
        key: string, value: any): void {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib: TAttribMap = attribs.get(name);
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
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
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
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
        const attrib_names: string[] = Array.from(attribs.keys());
        // copy each attrib
        for (const attrib_name of attrib_names) {
            const attrib: TAttribMap = attribs.get(attrib_name);
            const attrib_value: TAttribDataTypes =  attrib.getEntVal(from_ent_i) as TAttribDataTypes;
            attrib.setEntVal(to_ent_i, attrib_value);
        }
    }
    /**
     * Promotes attrib values up and down the hierarchy.
     */
    public pushAttribVals(
            source_ent_type: EEntType, source_attrib_name: string, source_attrib_idx_key: number|string, source_indices: number[],
            target: EEntType|string,   target_attrib_name: string, target_attrib_idx_key: number|string, method: EAttribPush): void {
        // if source and target are same, then return
        if (source_ent_type === target) { return; }
        // check that the attribute exists
        if (! this._modeldata.attribs.query.hasAttrib(source_ent_type, source_attrib_name)) {
            throw new Error('Error pushing attributes: The attribute does not exist.');
        }
        let target_ent_type: EEntType = null;
        let target_coll: string = null;
        // check if this is coll -> coll
        if (target === 'coll_parent' || target === 'coll_children') {
            if (source_ent_type !== EEntType.COLL) {
                throw new Error('Error pushing attributes between collections: The source and target must both be collections.');
            }
            target_coll = target as string;
            target_ent_type = EEntType.COLL;
        } else {
            target_ent_type = target as EEntType;
        }
        // get the data type and data size of the existing attribute
        const source_data_type: EAttribDataTypeStrs = this._modeldata.attribs.query.getAttribDataType(source_ent_type, source_attrib_name);
        const source_data_size: number = this._modeldata.attribs.query.getAttribDataLength(source_ent_type, source_attrib_name);
        // get the target data type and size
        let target_data_type: EAttribDataTypeStrs = source_data_type;
        let target_data_size: number = source_data_size;
        if (target_attrib_idx_key !== null) {
            // so the target data type must be a list or a dict
            if (typeof target_attrib_idx_key === 'number') {
                target_data_type = EAttribDataTypeStrs.LIST;
            } else if (typeof target_attrib_idx_key === 'string') {
                target_data_type = EAttribDataTypeStrs.DICT;
            } else {
                throw new Error('The target attribute index or key is not valid: "' + target_attrib_idx_key + '".');
            }
        } else if (source_attrib_idx_key !== null) {
            // get the first data item as a template to check data type and data size
            const first_val: TAttribDataTypes = this._modeldata.attribs.query.getAttribValAny(
                source_ent_type, source_attrib_name, source_indices[0],
                source_attrib_idx_key) as TAttribDataTypes;
            target_data_type = this._checkDataType(first_val);
            if (target_data_type === EAttribDataTypeStrs.LIST) {
                const first_val_arr = first_val as any[];
                target_data_size = first_val_arr.length;
                for (const val of first_val_arr) {
                    if (typeof val !== 'number') {
                        throw new Error('The attribute value being pushed is a list but the values in the list are not numbers.');
                    }
                }
            } else if (target_data_type === EAttribDataTypeStrs.NUMBER) {
                target_data_size = 0;
            } else {
                throw new Error('The attribute value being pushed is neither a number nor a list of numbers.');
            }
        }
        // move attributes from entities up to the model, or form model down to entities
        if (target_ent_type === EEntType.MOD) {
            this.addAttrib(target_ent_type, target_attrib_name, target_data_type);
            const attrib_values: TAttribDataTypes[] = [];
            for (const index of source_indices) {
                const value: TAttribDataTypes =
                    this._modeldata.attribs.query.getAttribValAny(source_ent_type, source_attrib_name, index,
                        source_attrib_idx_key) as TAttribDataTypes;
                attrib_values.push(value);
            }
            const agg_value: TAttribDataTypes = this._aggregateVals(attrib_values, target_data_size, method);
            if (typeof target_attrib_idx_key === 'number') {
                this.setModelAttribListIdxVal(target_attrib_name, target_attrib_idx_key, agg_value);
            } else if (typeof target_attrib_idx_key === 'string') {
                this.setModelAttribDictKeyVal(target_attrib_name, target_attrib_idx_key, agg_value);
            } else {
                this.setModelAttribVal(target_attrib_name, agg_value);
            }
            return;
        } else if (source_ent_type === EEntType.MOD) {
            const value: TAttribDataTypes = this._modeldata.attribs.query.getModelAttribValAny(source_attrib_name, source_attrib_idx_key);
            this.addAttrib(target_ent_type, target_attrib_name, target_data_type);
            const target_ents_i: number[] = this._modeldata.geom.query.getEnts(target_ent_type);
            for (const target_ent_i of target_ents_i) {
                if (typeof target_attrib_idx_key === 'number') {
                    this.setEntAttribListIdxVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
                } else if (typeof target_attrib_idx_key === 'string') {
                    this.setEntAttribDictKeyVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
                } else {
                    this.setEntAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
                }
            }
            return;
        }
        // get all the values for each target
        const attrib_values_map: Map<number, TAttribDataTypes[]> = new Map();
        for (const index of source_indices) {
            const attrib_value: TAttribDataTypes =
                this._modeldata.attribs.query.getAttribValAny(source_ent_type, source_attrib_name, index,
                    source_attrib_idx_key) as TAttribDataTypes;
            let target_ents_i: number[] = null;
            if (target_coll === 'coll_parent') {
                const parent = this._modeldata.geom.nav.navCollToCollParent(index);
                target_ents_i = (parent === -1) ? [] : [parent];
            } else if (target_coll === 'coll_children') {
                target_ents_i = this._modeldata.geom.nav.navCollToCollChildren(index);
            } else {
                target_ent_type =  target_ent_type as EEntType;
                target_ents_i = this._modeldata.geom.nav.navAnyToAny(source_ent_type, target_ent_type, index);
            }
            for (const target_ent_i of target_ents_i) {
                if (! attrib_values_map.has(target_ent_i)) {
                        attrib_values_map.set(target_ent_i, []);
                }
                attrib_values_map.get(target_ent_i).push(attrib_value);
            }
        }
        // create the new target attribute if it does not already exist
        if (target_coll !== null) {
            target_ent_type =  target_ent_type as EEntType;
            this.addAttrib(target_ent_type, target_attrib_name, target_data_type);
        }
        // calculate the new value and set the attribute
        attrib_values_map.forEach( (attrib_values, target_ent_i) => {
            let value: TAttribDataTypes = attrib_values[0];
            if (attrib_values.length > 1) {
                value = this._aggregateVals(attrib_values, target_data_size, method);
            }
            if (typeof target_attrib_idx_key === 'number') {
                this.setEntAttribListIdxVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
            } else if (typeof target_attrib_idx_key === 'string') {
                this.setEntAttribDictKeyVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
            } else {
                this.setEntAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
            }
        });
    }

    // ============================================================================
    // Private methods
    // ============================================================================
    // TODO for mathjs operations, check the values are numbers...
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
    /**
     * Utility method to check the data type of an attribute.
     * @param value
     */
    private _checkDataType(value: TAttribDataTypes): EAttribDataTypeStrs {
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
