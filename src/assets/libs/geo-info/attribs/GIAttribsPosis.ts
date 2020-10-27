import { vecAdd } from '../../geom/vectors';
import { Txyz, EAttribNames, EEntType } from '../common';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIModelData } from '../GIModelData';

/**
 * Class for attributes.
 */
export class GIAttribsPosis {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    /**
     * Shortcut for getting a coordinate from a posi_i
     * Shallow copy
     * @param posi_i
     */
    public getPosiCoords(posi_i: number): Txyz {
        const ssid: number = this.modeldata.active_ssid;
        const result = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(posi_i) as Txyz;
        return result;
    }
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * Shallow copy
     * @param vert_i
     */
    public getVertCoords(vert_i: number): Txyz {
        const ssid: number = this.modeldata.active_ssid;
        const posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
        return this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(posi_i) as Txyz;
    }
    /**
     * Shortcut for getting all the xyz coordinates from an ent_i
     * Shallow copy
     * @param posi_i
     */
    public getEntCoords(ent_type: EEntType, ent_i: number): Txyz[] {
        const ssid: number = this.modeldata.active_ssid;
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        const coords_map: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS);
        return posis_i.map(posi_i => coords_map.getEntVal(posi_i) as Txyz);
    }
    /**
     * Set the xyz position by index
     * @param index
     * @param value
     */
    public setPosiCoords(index: number, xyz: Txyz): void {
        const ssid: number = this.modeldata.active_ssid;
        this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).setEntVal(index, xyz);
    }
    /**
     * Move the xyz position by index
     * @param index
     * @param value
     */
    public movePosiCoords(index: number, xyz: Txyz): void {
        const ssid: number = this.modeldata.active_ssid;
        const old_xyz: Txyz = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(index) as Txyz;
        const new_xyz: Txyz = vecAdd(old_xyz, xyz); // create copy of xyz
        this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).setEntVal(index, new_xyz);
    }
}
