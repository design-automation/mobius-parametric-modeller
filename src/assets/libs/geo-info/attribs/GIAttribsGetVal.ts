import { TAttribDataTypes, EEntType, EEntTypeStr } from '../common';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIModelData } from '../GIModelData';

/**
 * Class for attributes.
 */
export class GIAttribsGetVal {
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
     * Get an model attrib value, or an array of values.
     * ~
     * If idx_or_key is null, then this must be a simple attrib.
     * If idx_or_key is a number, then this must be indexing a list attrib.
     * if idx_or_key is a string, then this must be indexing a dict attrib.
     * ~
     * If the attribute does not exist, throw an error
     * ~
     * @param ent_type
     * @param name
     */
    public getModelAttribValOrItem(name: string, idx_or_key: number|string): any {
        const ssid: number = this.modeldata.active_ssid;
        if (idx_or_key === null) { return this.getModelAttribVal(name); }
        switch (typeof idx_or_key) {
            case 'number':
                return this.getModelAttribListIdxVal(name, idx_or_key as number);
            case 'string':
                return this.getModelAttribDictKeyVal(name, idx_or_key as string);
        }
    }
    /**
     * Get a model attrib value
     * @param name
     */
    public getModelAttribVal(name: string): TAttribDataTypes {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attribs: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const value: TAttribDataTypes = attribs.get(name);
        if (value === undefined) { return null; }
        return value;
    }
    /**
     * Get a model attrib list value given an index
     * ~
     * If this attribute is not a list, throw error
     * ~
     * If idx is creater than the length of the list, undefined is returned.
     * ~
     * @param ent_type
     * @param name
     */
    public getModelAttribListIdxVal(name: string, idx: number): number|string {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attribs: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const list_value: TAttribDataTypes = attribs.get(name);
        if (list_value === undefined) { throw new Error('Attribute does not exist.'); }
        if (!Array.isArray(list_value)) { throw new Error('Attribute is not a list.'); }
        return list_value[idx];
    }
    /**
     * Get a model attrib dict value given a key
     * ~
     * If this attribute is not a dict, throw error
     * ~
     * If key does not exist, throw error
     * ~
     * @param ent_type
     * @param name
     */
    public getModelAttribDictKeyVal(name: string, key: string): number|string {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[EEntType.MOD];
        const attribs: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const dict_value: TAttribDataTypes = attribs.get(name);
        if (dict_value === undefined) { throw new Error('Attribute does not exist.'); }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') { throw new Error('Attribute is not a dict.'); }
        return dict_value[key];
    }
    // ============================================================================
    // Entity attributes
    // ============================================================================
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * ~
     * If idx_or_key is null, then this must be a simple attrib.
     * If idx_or_key is a number, then this must be indexing a list attrib.
     * if idx_or_key is a string, then this must be indexing a dict attrib.
     * ~
     * If the attribute does not exist, throw an error
     * ~
     * @param ent_type
     * @param name
     */
    public getEntAttribValOrItem(ent_type: EEntType, ents_i: number|number[], name: string,
            idx_or_key: number|string): any {
        if (idx_or_key === null) { return this.getEntAttribVal(ent_type, ents_i, name); }
        switch (typeof idx_or_key) {
            case 'number':
                return this.getEntAttribListIdxVal(ent_type, ents_i, name, idx_or_key as number);
            case 'string':
                return this.getEntAttribDictKeyVal(ent_type, ents_i, name, idx_or_key as string);
        }
    }
    /**
     * Get an entity attrib value, or an array of values given an array of entities.
     * ~
     * If the attribute does not exist, throw an error
     * ~
     * @param ent_type
     * @param name
     */
    public getEntAttribVal(ent_type: EEntType, ents_i: number|number[], name: string): TAttribDataTypes|TAttribDataTypes[] {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (Array.isArray(ents_i)) {
            return ents_i.map( ent_i => attrib.getEntVal(ent_i) );
        }
        return attrib.getEntVal(ents_i as number);
    }
    /**
     * Get an entity attrib value in a list.
     * ~
     * If the attribute does not exist, throw error
     * ~
     * If the index is out of range, return undefined.
     * ~
     * @param ent_type
     * @param name
     */
    public getEntAttribListIdxVal(ent_type: EEntType, ents_i: number|number[], name: string, idx: number): any {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (Array.isArray(ents_i)) {
            return ents_i.map( ent_i => attrib.getEntVal(ent_i)[idx] );
        }
        return attrib.getEntVal(ents_i as number)[idx];
    }
    /**
     * Get an entity attrib value in a dictionary.
     * ~
     * If the attribute does not exist, throw error
     * ~
     * If the key does not exist, return undefined.
     * ~
     * @param ent_type
     * @param name
     */
    public getEntAttribDictKeyVal(ent_type: EEntType, ents_i: number|number[], name: string, key: string): any {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib: GIAttribMapBase = attribs.get(name);
        if (attrib === undefined) { throw new Error('Attribute does not exist.'); }
        if (Array.isArray(ents_i)) {
            return ents_i.map( ent_i => attrib.getEntVal(ent_i)[key] );
        }
        return attrib.getEntVal(ents_i as number)[key];
    }

}
