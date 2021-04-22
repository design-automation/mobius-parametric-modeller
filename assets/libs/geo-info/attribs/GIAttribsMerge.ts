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
    public merge(ssid: number, exist_ssid: number): void {
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.POSI);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.VERT);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.EDGE);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.WIRE);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.POINT);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.PLINE);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.PGON);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.COLL);
        this._mergeModelAttribs(ssid, exist_ssid);
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    public add(ssid: number, exist_ssid: number): void {
        this._addEntAttribs(ssid, exist_ssid, EEntType.POSI);
        this._addEntAttribs(ssid, exist_ssid, EEntType.VERT);
        this._addEntAttribs(ssid, exist_ssid, EEntType.EDGE);
        this._addEntAttribs(ssid, exist_ssid, EEntType.WIRE);
        this._addEntAttribs(ssid, exist_ssid, EEntType.POINT);
        this._addEntAttribs(ssid, exist_ssid, EEntType.PLINE);
        this._addEntAttribs(ssid, exist_ssid, EEntType.PGON);
        this._addEntAttribs(ssid, exist_ssid, EEntType.COLL);
        this._mergeModelAttribs(ssid, exist_ssid);
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
    private _mergeModelAttribs(ssid: number, exist_ssid: number): void {
        const other_attribs: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(exist_ssid)[EEntTypeStr[ EEntType.MOD ]];
        const this_attribs: Map<string, TAttribDataTypes> = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ EEntType.MOD ]];
        // TODO this is a hack to fix an error
        if (!(other_attribs instanceof Map)) { return; }
        // end of hack
        other_attribs.forEach( (val, key) => {
            this_attribs.set(key, lodash.cloneDeep(val));
        });
    }
    /**
     * Merge attributes from another attribute map into this attribute map.
     * Conflict detection is performed.
     */
    private _mergeEntAttribs(ssid: number, other_ssid: number, ent_type: EEntType) {
        const other_attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(other_ssid)[EEntTypeStr[ ent_type ]];
        const this_attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            const other_ents_i: number[] = this.modeldata.geom.snapshot.filterEnts(other_ssid, ent_type, other_attrib.getEnts());
            if (other_ents_i.length > 0) {
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
                this_attrib.mergeAttribMap(other_attrib, other_ents_i);
            }
        });
    }
    /**
     * Add attributes from another attribute map into this attribute map.
     * No conflict detection is performed.
     * This attribute map is assumed to be empty.
     * @param ssid
     * @param other_ssid
     * @param ent_type
     */
    private _addEntAttribs(ssid: number, other_ssid: number, ent_type: EEntType) {
        const other_attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(other_ssid)[EEntTypeStr[ent_type]];
        other_attribs.forEach(other_attrib => {
            const other_ents_i: number[] = this.modeldata.geom.snapshot.filterEnts(other_ssid, ent_type, other_attrib.getEnts());
            if (other_ents_i.length > 0) {
                // get the name
                const name: string = other_attrib.getName();
                // get or create the attrib
                const this_attrib: GIAttribMapBase = this.modeldata.attribs.add.addEntAttrib(ent_type, name, other_attrib.getDataType());
                // merge
                this_attrib.addAttribMap(other_attrib, other_ents_i);
            }
        });
    }
}
