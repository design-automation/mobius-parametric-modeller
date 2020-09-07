import { EEntType, IAttribsMaps, EEntTypeStr, TAttribMap } from './common';
import { GIModelData } from './GIModelData';

/**
 * Class for attributes.
 */
export class GIAttribsModify {
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
     * Deletes an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @return True if the attribute was created, false otherwise.
     */
    public delAttrib(ent_type: EEntType, name: string): boolean {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
        // delete
        return attribs.delete(name);
    }
    /**
     * Rename an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param old_name The name of the old attribute.
     * @param new_name The name of the new attribute.
     * @return True if the attribute was renamed, false otherwise.
     */
    public renameAttrib(ent_type: EEntType, old_name: string, new_name: string): boolean {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, TAttribMap> = this._attribs_maps[attribs_maps_key];
        if (!attribs.has(old_name)) { return false; }
        if (attribs.has(new_name)) { return false; }
        if (old_name === new_name) { return false; }
        // rename
        const attrib: TAttribMap = attribs.get(old_name);
        attrib.setName(new_name);
        const result = attribs.set(new_name, attrib);
        return attribs.delete(old_name);
    }
    // ============================================================================
    // Private methods
    // ============================================================================
}
