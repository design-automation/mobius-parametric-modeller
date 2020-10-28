import { TAttribDataTypes, EEntType,
    IAttribsMaps, EEntTypeStr, TModelAttribValuesArr } from '../common';
import { GIModelData } from '../GIModelData';
import * as lodash from 'lodash';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';


/**
 * Class for mering attributes.
 */
export class GIAttribsMerge {
    private modeldata: GIModelData;
   /**
     * Creates an object...
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    public merge(ssid: number, attribs_maps: IAttribsMaps): void {
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.POSI);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.VERT);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.EDGE);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.WIRE);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.POINT);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.PLINE);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.PGON);
        this._mergeEntAttribs(ssid, attribs_maps, EEntType.COLL);
        this._mergeModelAttribs(ssid, attribs_maps);
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * From another model
     * The existing attributes are not deleted
     * Deep copy of attrib values
     * @param attribs_maps
     */
    private _mergeModelAttribs(ssid: number, attribs_maps: IAttribsMaps): void {
        const other_attribs: Map<string, TAttribDataTypes> = attribs_maps[EEntTypeStr[ EEntType.MOD ]];
        const this_attribs: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ EEntType.MOD ]];
        // TODO this is a hack to fix an error
        if (!(other_attribs instanceof Map)) { return; }
        other_attribs.forEach( (val, key) => {
            this_attribs.set(key, lodash.cloneDeep(val));
        });
    }
    /**
     * From JSON data
     * Existing attributes are deleted
     * @param new_attribs_data
     */
    private _setModelAttribs(ssid: number, new_attribs_data: TModelAttribValuesArr) {
        this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ EEntType.MOD ]] = new Map(new_attribs_data);
    }
    /**
     * merge attributes from another model into this model.
     * The existing attributes are not deleted
     * @param attribs_maps
     */
    private _mergeEntAttribs(ssid: number, attribs_maps: IAttribsMaps, ent_type: EEntType) {
        const other_attribs: Map<string, GIAttribMapBase> = attribs_maps[EEntTypeStr[ ent_type ]];
        const this_attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                // get the name
                const name: string = other_attrib.getName();
                // get or create the attrib
                let this_attrib: GIAttribMapBase;
                if (!this_attribs.has(name)) {
                    this_attrib = this.modeldata.attribs.add.addEntAttrib(ent_type, name, other_attrib.getDataType());
                } else {
                    this_attrib = this_attribs.get(name);
                    if (this_attrib.getDataType() !== other_attrib.getDataType()) {
                        throw new Error('Merge Error: Cannot merge attributes with different data types.');
                    }
                }
                // merge
                this_attrib.merge(other_attrib);
            }
        });
    }
}
