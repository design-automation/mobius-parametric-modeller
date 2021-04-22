import { TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, EAttribNames, EEntTypeStr, EAttribPush } from '../common';
import * as mathjs from 'mathjs';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import * as lodash from 'lodash';

/**
 * Class for attributes.
 */
export class GIAttribsSetVal {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Model attributes
    // ============================================================================
    /**
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribVal(name: string, value: TAttribDataTypes): void {
        const ssid: number = this.modeldata.active_ssid;
        this.modeldata.attribs.attribs_maps.get(ssid).mo.set(name, value);
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setModelAttribListIdxVal(name: string, idx: number, value: any): void {
        const ssid: number = this.modeldata.active_ssid;
        const list_value: TAttribDataTypes = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(name);
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
        const ssid: number = this.modeldata.active_ssid;
        const dict_value: TAttribDataTypes = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(name);
        if (dict_value === undefined) { throw new Error('Attribute with this name does not exist.'); }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        dict_value[key] = value;
    }
    // ============================================================================
    // Entity attributes
    // ============================================================================
    /**
     * Set an entity attrib value
     * If the attribute does not exist, then it is created.
     * @param id
     * @param name
     * @param value
     */
    public setCreateEntsAttribVal(ent_type: EEntType, ents_i: number|number[], name: string, value: TAttribDataTypes): void {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // get the attrib
        let attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) {
            const new_data_type: EAttribDataTypeStrs = this._checkDataType(value);
            attrib = this.modeldata.attribs.add.addAttrib(ent_type, name, new_data_type);
        }
        // set the data
        ents_i = Array.isArray( ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            attrib.setEntVal(ent_i, value);
        }
    }
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setEntAttribVal(ent_type: EEntType, ent_i: number, name: string, value: TAttribDataTypes): void {
        const ssid: number = this.modeldata.active_ssid;
        const attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ent_type]].get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist:' + name); }
        attrib.setEntVal(ent_i, value);
    }
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setEntsAttribVal(ent_type: EEntType, ents_i: number|number[], name: string, value: TAttribDataTypes): void {
        const ssid: number = this.modeldata.active_ssid;
        const attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ent_type]].get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist:' + name); }
        ents_i = Array.isArray( ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            attrib.setEntVal(ent_i, value);
        }
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setEntsAttribListIdxVal(ent_type: EEntType, ents_i: number|number[], name: string,
            idx: number, value: any): void {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (attrib.getDataType() !== EAttribDataTypeStrs.LIST) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        // replace the data
        ents_i = Array.isArray( ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            const data: any[] = lodash.cloneDeep( attrib.getEntVal(ent_i) as any[] ); // this will be a deep copy of the data
            data[idx] = value;
            attrib.setEntVal(ent_i, data);
        }
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    public setEntsAttribDictKeyVal(ent_type: EEntType, ents_i: number|number[], name: string,
            key: string, value: any): void {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (attrib.getDataType() !== EAttribDataTypeStrs.DICT) {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        // replace the data
        ents_i = Array.isArray( ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            const data: object = lodash.cloneDeep( attrib.getEntVal(ent_i) as object ); // this will be a deep copy of the data
            data[key] = value;
            attrib.setEntVal(ent_i, data);
        }
    }
    // ============================================================================
    // Copy entity attributes
    // ============================================================================
    /**
     * Copy all attribs from one entity to another entity
     * @param ent_type
     * @param name
     */
    public copyAttribs(ent_type: EEntType, from_ent_i: number, to_ent_i: number): void {
        const ssid: number = this.modeldata.active_ssid;
        // get the attrib names
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib_names: string[] = Array.from(attribs.keys());
        // copy each attrib
        for (const attrib_name of attrib_names) {
            if (attrib_name[0] === '_') { continue; } // skip attrib names that start with underscore
            const attrib: GIAttribMapBase = attribs.get(attrib_name);
            const attrib_value: TAttribDataTypes =  attrib.getEntVal(from_ent_i) as TAttribDataTypes; // deep copy
            attrib.setEntVal(to_ent_i, attrib_value);
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
