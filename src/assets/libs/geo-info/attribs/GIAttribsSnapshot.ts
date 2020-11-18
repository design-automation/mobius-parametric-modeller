import { EAttribDataTypeStrs, EAttribNames, EEntType, EEntTypeStr, IAttribsMaps, TAttribDataTypes, TEntTypeIdx, Txyz } from '../common';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIAttribMapList } from '../attrib_classes/GIAttribMapList';
import { GIAttribMapNum } from '../attrib_classes/GIAttribMapNum';
import { GIAttribMapStr } from '../attrib_classes/GIAttribMapStr';
import { GIModelData } from '../GIModelData';

/**
 * Class for attribute snapshot.
 */
export class GIAttribsSnapshot {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Start
    // ============================================================================
    /**
     *
     * @param ssid
     * @param include
     */
    public addSnapshot(ssid: number, include?: number[]): void {
        // create new attribs maps for snapshot
        const attribs: IAttribsMaps = {
                ps: new Map(),
                _v: new Map(),
                _e: new Map(),
                _w: new Map(),
                pt: new Map(),
                pl: new Map(),
                pg: new Map(),
                co: new Map(),
                mo: new Map()
        };
        this.modeldata.attribs.attribs_maps.set(ssid, attribs);
        // add attributes for built in types
        attribs.ps.set(EAttribNames.COORDS, new GIAttribMapList(this.modeldata, EAttribNames.COORDS, EEntType.POSI, EAttribDataTypeStrs.LIST));
        attribs._v.set(EAttribNames.COLOR, new GIAttribMapList(this.modeldata, EAttribNames.COLOR, EEntType.VERT, EAttribDataTypeStrs.LIST));
        attribs._v.set(EAttribNames.NORMAL, new GIAttribMapList(this.modeldata, EAttribNames.NORMAL, EEntType.VERT, EAttribDataTypeStrs.LIST));
        // add attributes for time stamps
        attribs.pt.set(EAttribNames.TIMESTAMP, new GIAttribMapNum(this.modeldata, EAttribNames.TIMESTAMP, EEntType.POINT, EAttribDataTypeStrs.NUMBER));
        attribs.pl.set(EAttribNames.TIMESTAMP, new GIAttribMapNum(this.modeldata, EAttribNames.TIMESTAMP, EEntType.PLINE, EAttribDataTypeStrs.NUMBER));
        attribs.pg.set(EAttribNames.TIMESTAMP, new GIAttribMapNum(this.modeldata, EAttribNames.TIMESTAMP, EEntType.PGON, EAttribDataTypeStrs.NUMBER));
        // add attributes for collections
        attribs.co.set(EAttribNames.COLL_NAME, new GIAttribMapStr(this.modeldata, EAttribNames.COLL_NAME, EEntType.COLL, EAttribDataTypeStrs.STRING));
        // merge data
        if (include !== undefined) {
            for (const exist_ssid of include) {
                const exist_attribs: IAttribsMaps = this.modeldata.attribs.attribs_maps.get(exist_ssid);
                this.modeldata.attribs.merge.merge(ssid, exist_attribs);
            }
        }
    }
    // ============================================================================
    // Add
    // ============================================================================
    /**
     * Add attributes of ents from the specified snapshot to the current snapshot.
     * @param ssid ID of snapshot to copy attributes from.
     * @param ents ID of ents in both ssid and in the active snapshot
     */
    public copyEntsToActiveSnapshot(from_ssid: number, ents: TEntTypeIdx[]): void {
        const from_attrib_maps: IAttribsMaps = this.modeldata.attribs.attribs_maps.get(from_ssid);
        for (const [ent_type, ent_i] of ents) {
            const attribs: Map<string, GIAttribMapBase> = from_attrib_maps[EEntTypeStr[ent_type]];
            attribs.forEach( (attrib: GIAttribMapBase, attrib_name: string) => {
                const attrib_val: TAttribDataTypes = attrib.getEntVal(ent_i); // shallow copy
                if (attrib_val !== undefined) {
                    this.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ent_i, attrib_name, attrib_val);
                }
            });
        }
        from_attrib_maps.mo.forEach( (val, name) => this.modeldata.attribs.set.setModelAttribVal(name, val) );
    }
    // ============================================================================
    // Del
    // ============================================================================
    /**
     *
     * @param ssid
     */
    public delSnapshot(ssid: number): void {
        this.modeldata.attribs.attribs_maps.delete(ssid);
    }
    // ============================================================================
    // Debug
    // ============================================================================
    public toStr(ssid: number): string {
        return this.modeldata.attribs.toStr(ssid);
    }
}
