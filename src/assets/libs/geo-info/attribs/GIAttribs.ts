import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsQuery } from './GIAttribsQuery';
import { EEntType, EAttribDataTypeStrs, IAttribsMaps, EEntTypeStr } from '../common';
import { GIAttribsMerge } from './GIAttribsMerge';
import { GIModelData } from '../GIModelData';
import { GIAttribsSnapshot } from './GIAttribsSnapshot';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsImpExp } from './GIAttribsImpExp';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIAttribsDel } from './GIAttribsDel';
import { GIAttribsGetVal } from './GIAttribsGetVal';
import { GIAttribsSetVal } from './GIAttribsSetVal';
import { GIAttribsPosis } from './GIAttribsPosis';
import { GIAttribsPush } from './GIAttribsPush';
import { GIAttribsCompare } from './GIAttribsCompare';

/**
 * Class for attributes.
 */
export class GIAttribs {
    private modeldata: GIModelData;
    // maps, the key is the ssid, the value is the attrib map data
    // so to get the specific attibutes for e.g. "xyz" for positions:
    // attrib_maps.get(ssid).ps.get("xyz")
    public attribs_maps: Map<number, IAttribsMaps> = new Map();
    // sub classes with methods
    public merge: GIAttribsMerge;
    public imp_exp: GIAttribsImpExp;
    public add: GIAttribsAdd;
    public del: GIAttribsDel;
    public get: GIAttribsGetVal;
    public set: GIAttribsSetVal;
    public push: GIAttribsPush;
    public posis: GIAttribsPosis;
    public query: GIAttribsQuery;
    public snapshot: GIAttribsSnapshot;
    public compare: GIAttribsCompare;
    public threejs: GIAttribsThreejs;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
        this.merge = new GIAttribsMerge(modeldata);
        this.imp_exp = new GIAttribsImpExp(modeldata);
        this.add = new GIAttribsAdd(modeldata);
        this.del = new GIAttribsDel(modeldata);
        this.get = new GIAttribsGetVal(modeldata);
        this.set = new GIAttribsSetVal(modeldata);
        this.push = new GIAttribsPush(modeldata);
        this.posis = new GIAttribsPosis(modeldata);
        this.query = new GIAttribsQuery(modeldata);
        this.snapshot = new GIAttribsSnapshot(modeldata);
        this.compare = new GIAttribsCompare(modeldata);
        this.threejs = new GIAttribsThreejs(modeldata);
    }
    /**
     * Get all the attribute names for an entity type
     * @param ent_type
     */
    public getAttribNames(ent_type: EEntType): string[] {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs_map: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return Array.from(attribs_map.keys());
    }
    /**
     * Get all the user defined attribute names for an entity type
     * This excludes the built in attribute names, xyz and anything starting with '_'
     * @param ent_type
     */
    public getAttribNamesUser(ent_type: EEntType): string[] {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs_map: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attribs: string[] = Array.from(attribs_map.keys());
        if (ent_type === EEntType.POSI) {
            attribs = attribs.filter(attrib => attrib !== 'xyz');
        }
        attribs = attribs.filter(attrib => attrib[0] !== '_');
        return attribs;
    }
    /**
     * Get attrib
     * @param ent_type
     * @param name
     */
    public getAttrib(ent_type: EEntType, name: string): GIAttribMapBase {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attribs.get(name);
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
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (!attribs.has(old_name)) { return false; }
        if (attribs.has(new_name)) { return false; }
        if (old_name === new_name) { return false; }
        // rename
        const attrib: GIAttribMapBase = attribs.get(old_name);
        attrib.setName(new_name);
        const result = attribs.set(new_name, attrib);
        return attribs.delete(old_name);
    }
    /**
     * Generate a string for debugging
     */
    public toStr(ssid: number): string {
        const ss_attrib_maps: IAttribsMaps = this.attribs_maps.get(ssid);
        const result: string[] = [];
        result.push('posis');
        ss_attrib_maps.ps.forEach( attrib => result.push(attrib.toStr()) );
        if (ss_attrib_maps._v.size) {
            result.push('verts');
            ss_attrib_maps._v.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps._e.size) {
            result.push('edges');
            ss_attrib_maps._e.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps._w.size) {
            result.push('wires');
            ss_attrib_maps._w.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.pt.size) {
            result.push('points');
            ss_attrib_maps.pt.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.pl.size) {
            result.push('plines');
            ss_attrib_maps.pl.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.pg.size) {
            result.push('pgons');
            ss_attrib_maps.pg.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.co.size) {
            result.push('colls');
            ss_attrib_maps.co.forEach( attrib => result.push(attrib.toStr()) );
        }
        return result.join('\n');
    }
}
