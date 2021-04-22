import { TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, EAttribNames, EEntTypeStr, EAttribPush } from '../common';
import * as mathjs from 'mathjs';
import { GIModelData } from '../GIModelData';

/**
 * Class for attributes.
 */
export class GIAttribsPush {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Push entity attributes
    // ============================================================================
    /**
     * Promotes attrib values up and down the hierarchy.
     */
    public pushAttribVals(
            source_ent_type: EEntType, source_attrib_name: string, source_attrib_idx_key: number|string, source_indices: number[],
            target: EEntType|string,   target_attrib_name: string, target_attrib_idx_key: number|string, method: EAttribPush): void {
        //
        // TODO make sure only to push onto active ents TOFIX
        //
        const ssid: number = this.modeldata.active_ssid;
        // if source and target are same, then return
        if (source_ent_type === target) { return; }
        // check that the attribute exists
        if (! this.modeldata.attribs.query.hasEntAttrib(source_ent_type, source_attrib_name)) {
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
        const source_data_type: EAttribDataTypeStrs = this.modeldata.attribs.query.getAttribDataType(source_ent_type, source_attrib_name);
        const source_data_size: number = this.modeldata.attribs.query.getAttribDataLength(source_ent_type, source_attrib_name);
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
            const first_val: TAttribDataTypes = this.modeldata.attribs.get.getEntAttribValOrItem(
                source_ent_type, source_indices[0], source_attrib_name,
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
            this.modeldata.attribs.add.addAttrib(target_ent_type, target_attrib_name, target_data_type);
            const attrib_values: TAttribDataTypes[] = [];
            for (const index of source_indices) {
                const value: TAttribDataTypes =
                    this.modeldata.attribs.get.getEntAttribValOrItem(
                        source_ent_type, index, source_attrib_name,
                        source_attrib_idx_key) as TAttribDataTypes;
                attrib_values.push(value);
            }
            const agg_value: TAttribDataTypes = this._aggregateVals(attrib_values, target_data_size, method);
            if (typeof target_attrib_idx_key === 'number') {
                this.modeldata.attribs.set.setModelAttribListIdxVal(target_attrib_name, target_attrib_idx_key, agg_value);
            } else if (typeof target_attrib_idx_key === 'string') {
                this.modeldata.attribs.set.setModelAttribDictKeyVal(target_attrib_name, target_attrib_idx_key, agg_value);
            } else {
                this.modeldata.attribs.set.setModelAttribVal(target_attrib_name, agg_value);
            }
            return;
        } else if (source_ent_type === EEntType.MOD) {
            const value: TAttribDataTypes = this.modeldata.attribs.get.getModelAttribValOrItem(source_attrib_name, source_attrib_idx_key);
            this.modeldata.attribs.add.addAttrib(target_ent_type, target_attrib_name, target_data_type);
            const target_ents_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, target_ent_type);
            for (const target_ent_i of target_ents_i) {
                if (typeof target_attrib_idx_key === 'number') {
                    this.modeldata.attribs.set.setEntsAttribListIdxVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
                } else if (typeof target_attrib_idx_key === 'string') {
                    this.modeldata.attribs.set.setEntsAttribDictKeyVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
                } else {
                    this.modeldata.attribs.set.setCreateEntsAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
                }
            }
            return;
        }
        // get all the values for each target
        const attrib_values_map: Map<number, TAttribDataTypes[]> = new Map();
        for (const index of source_indices) {
            const attrib_value: TAttribDataTypes =
                this.modeldata.attribs.get.getEntAttribValOrItem(
                    source_ent_type, index, source_attrib_name,
                    source_attrib_idx_key) as TAttribDataTypes;
            let target_ents_i: number[] = null;
            if (target_coll === 'coll_parent') {
                const parent = this.modeldata.geom.nav.navCollToCollParent(index);
                target_ents_i = (parent === undefined) ? [] : [parent];
            } else if (target_coll === 'coll_children') {
                target_ents_i = this.modeldata.geom.nav.navCollToCollChildren(index);
            } else {
                target_ent_type =  target_ent_type as EEntType;
                target_ents_i = this.modeldata.geom.nav.navAnyToAny(source_ent_type, target_ent_type, index);
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
            this.modeldata.attribs.add.addAttrib(target_ent_type, target_attrib_name, target_data_type);
        }
        // calculate the new value and set the attribute
        attrib_values_map.forEach( (attrib_values, target_ent_i) => {
            let value: TAttribDataTypes = attrib_values[0];
            if (attrib_values.length > 1) {
                value = this._aggregateVals(attrib_values, target_data_size, method);
            }
            if (typeof target_attrib_idx_key === 'number') {
                this.modeldata.attribs.set.setEntsAttribListIdxVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
            } else if (typeof target_attrib_idx_key === 'string') {
                this.modeldata.attribs.set.setEntsAttribDictKeyVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
            } else {
                this.modeldata.attribs.set.setCreateEntsAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
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
            return EAttribDataTypeStrs.DICT;
        }
        throw new Error('Data type for new attribute not recognised.');
    }
}
