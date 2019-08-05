import { GIModel } from './GIModel';
import { IAttribsData, IModelData, IAttribData, TAttribDataTypes, EEntType,
    EAttribDataTypeStrs, IGeomData, IAttribsMaps, EAttribNames, Txyz, EEntTypeStr, EAttribPush } from './common';
import { GIAttribMap } from './GIAttribMap';
import { vecAdd, vecDiv, vecSum } from '@libs/geom/vectors';

/**
 * Class for attributes.
 */
export class GIAttribsModify {
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
     * Deletes an existing attribute.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @return True if the attribute was created, false otherwise.
     */
    public delAttrib(ent_type: EEntType, name: string): boolean {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        return attribs.delete(name);
    }
    /**
     * Rename an existing attribute.
     *
     * @param ent_type The level at which to create the attribute.
     * @param old_name The name of the old attribute.
     * @param new_name The name of the new attribute.
     * @return True if the attribute was renamed, false otherwise.
     */
    public renameAttrib(ent_type: EEntType, old_name: string, new_name: string): boolean {
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];
        if (!attribs.has(old_name)) { return false; }
        if (attribs.has(new_name)) { return false; }
        if (old_name === new_name) { return false; }
        const attrib: GIAttribMap = attribs.get(old_name);
        attrib.setName(new_name);
        const result = attribs.set(new_name, attrib);
        return attribs.delete(old_name);
    }
    // ============================================================================
    // Private methods
    // ============================================================================
}
