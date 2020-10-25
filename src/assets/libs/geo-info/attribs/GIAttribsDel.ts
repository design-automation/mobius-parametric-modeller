import { EEntType, EEntTypeStr } from '../common';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';

/**
 * Class for attributes.
 */
export class GIAttribsDel {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    /**
     * Deletes an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @return True if the attribute was created, false otherwise.
     */
    public delEntAttrib(ent_type: EEntType, name: string): boolean {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // delete
        return attribs.delete(name);
    }
    /**
     * Delete the entity from an attribute
     * If there is no value for the entity, then this does nothing
     * If there is a value, then both the entity index and the value are deleted
     * @param ent_type
     * @param name
     */
    public delEnt(ent_type: EEntType, ents_i: number|number[]): void {
        const ssid: number = this.modeldata.active_ssid;
        // get the attrib names
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        attribs.forEach( attrib => attrib.delEnt(ents_i) );
    }
}
