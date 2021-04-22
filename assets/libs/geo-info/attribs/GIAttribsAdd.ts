import { EEntType, EAttribDataTypeStrs, EEntTypeStr } from '../common';
import { GIModelData } from '../GIModelData';
import { GIAttribMapBool } from '../attrib_classes/GIAttribMapBool';
import { GIAttribMapStr } from '../attrib_classes/GIAttribMapStr';
import { GIAttribMapNum } from '../attrib_classes/GIAttribMapNum';
import { GIAttribMapList } from '../attrib_classes/GIAttribMapList';
import { GIAttribMapDict } from '../attrib_classes/GIAttribMapDict';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';

/**
 * Class for attributes.
 */
export class GIAttribsAdd {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
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
    public addAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): GIAttribMapBase {
        if (ent_type === EEntType.MOD) {
            this.addModelAttrib(name);
            return null;
        } else {
            return this.addEntAttrib(ent_type, name, data_type);
        }
    }
    /**
     * Creates a new attribte at the model level
     *
     * @param name The name of the attribute.
     */
    public addModelAttrib(name: string): void {
        const ssid: number = this.modeldata.active_ssid;
        if (!this.modeldata.attribs.attribs_maps.get(ssid).mo.has(name)) {
            this.modeldata.attribs.attribs_maps.get(ssid).mo.set(name, null);
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
    public addEntAttrib(ent_type: EEntType, name: string, data_type: EAttribDataTypeStrs): GIAttribMapBase {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, any> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attrib: GIAttribMapBase;
        if (!attribs.has(name)) {
            if (data_type === EAttribDataTypeStrs.NUMBER) {
                attrib = new GIAttribMapNum(this.modeldata, name, ent_type, data_type);
            } else if (data_type === EAttribDataTypeStrs.STRING) {
                attrib = new GIAttribMapStr(this.modeldata, name, ent_type, data_type);
            } else if (data_type === EAttribDataTypeStrs.BOOLEAN) {
                attrib = new GIAttribMapBool(this.modeldata, name, ent_type, data_type);
            } else if (data_type === EAttribDataTypeStrs.LIST) {
                attrib = new GIAttribMapList(this.modeldata, name, ent_type, data_type);
            } else if (data_type === EAttribDataTypeStrs.DICT) {
                attrib = new GIAttribMapDict(this.modeldata, name, ent_type, data_type);
            } else {
                throw new Error('Attribute datatype not recognised.');
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
}
