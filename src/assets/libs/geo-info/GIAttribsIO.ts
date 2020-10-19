import { IAttribsJSONData, IAttribJSONData, TAttribDataTypes, EEntType,
    IAttribsMaps, EEntTypeStr, TModelAttribValuesArr } from './common';
import { GIModelData } from './GIModelData';
import * as lodash from 'lodash';
import { GIAttribMapBase } from './GIAttribMapBase';


/**
 * Class for attributes. merge dump append
 */
export class GIAttribsIO {
    private modeldata: GIModelData;
   /**
     * Creates an object to store the attribute data.
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
        this._mergeAttribs(ssid, attribs_maps, EEntType.POSI);
        this._mergeAttribs(ssid, attribs_maps, EEntType.VERT);
        this._mergeAttribs(ssid, attribs_maps, EEntType.EDGE);
        this._mergeAttribs(ssid, attribs_maps, EEntType.WIRE);
        this._mergeAttribs(ssid, attribs_maps, EEntType.FACE);
        this._mergeAttribs(ssid, attribs_maps, EEntType.POINT);
        this._mergeAttribs(ssid, attribs_maps, EEntType.PLINE);
        this._mergeAttribs(ssid, attribs_maps, EEntType.PGON);
        this._mergeAttribs(ssid, attribs_maps, EEntType.COLL);
        this._mergeModelAttribs(ssid, attribs_maps);
        // if (attribs_maps.ps !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.POSI); }
        // if (attribs_maps._v !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.VERT); }
        // if (attribs_maps._e !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.EDGE); }
        // if (attribs_maps._w !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.WIRE); }
        // if (attribs_maps._f !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.FACE); }
        // if (attribs_maps.pt !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.POINT); }
        // if (attribs_maps.pl !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.PLINE); }
        // if (attribs_maps.pg !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.PGON); }
        // if (attribs_maps.co !== undefined) { this._mergeAttribs(ssid, attribs_maps, EEntType.COLL); }
        // if (attribs_maps.mo !== undefined) { this._mergeModelAttribs(ssid, attribs_maps); }
    }
    // /**
    //  * Adds data to this model from another model.
    //  * Assumes this model is empty - no conflict detection.
    //  * @param model_data Attribute data from the other model.
    //  */
    // public dump(ssid: number, attribs_maps: IAttribsMaps): void {
    //     if (attribs_maps.ps !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.POSI); }
    //     if (attribs_maps._v !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.VERT); }
    //     if (attribs_maps._e !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.EDGE); }
    //     if (attribs_maps._w !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.WIRE); }
    //     if (attribs_maps._f !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.FACE); }
    //     if (attribs_maps.pt !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.POINT); }
    //     if (attribs_maps.pl !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.PLINE); }
    //     if (attribs_maps.pg !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.PGON); }
    //     if (attribs_maps.co !== undefined) { this._dumpAttribs(ssid, attribs_maps, EEntType.COLL); }
    //     if (attribs_maps.mo !== undefined) { this._dumpModelAttribs(ssid, attribs_maps); }
    // }
    // /**
    //  * Adds selected data to this model from another model.
    //  * Assumes this model is empty - no conflict detection.
    //  * If ent_sets is null, then only copy model attribs.
    //  * @param model_data Attribute data from the other model.
    //  */
    // public dumpEnts(ssid: number, attribs_maps: IAttribsMaps, ent_sets: IEntSets): void {
    //     if (ent_sets === null) {
    //         if (attribs_maps.mo !== undefined) { this._dumpModelAttribs(ssid, attribs_maps); }
    //         return;
    //     }
    //     if (attribs_maps.ps !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.POSI, ent_sets.posis_i);
    //     }
    //     if (attribs_maps._v !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.VERT, ent_sets.verts_i);
    //     }
    //     if (attribs_maps._e !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.EDGE, ent_sets.edges_i);
    //     }
    //     if (attribs_maps._w !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.WIRE, ent_sets.wires_i);
    //     }
    //     if (attribs_maps._f !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.FACE, ent_sets.faces_i);
    //     }
    //     if (attribs_maps.pt !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.POINT, ent_sets.points_i);
    //     }
    //     if (attribs_maps.pl !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.PLINE, ent_sets.plines_i);
    //     }
    //     if (attribs_maps.pg !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.PGON, ent_sets.pgons_i);
    //     }
    //     if (attribs_maps.co !== undefined) {
    //         this._dumpAttribsSelect(ssid, attribs_maps, EEntType.COLL, ent_sets.colls_i);
    //     }
    //     if (attribs_maps.mo !== undefined) { this._dumpModelAttribs(ssid, attribs_maps); }
    // }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted.
     * @param model_data Attribute data from the other model.
     */
    public append(ssid: number, ssid2: number, other_modeldata: GIModelData, renum_maps: Map<string, Map<number, number>>): void {
        const attribs_maps: IAttribsMaps = other_modeldata.attribs.attribs_maps.get(ssid2);
        // add the attribute data
        if (attribs_maps.ps !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.POSI, renum_maps.get('posis')); }
        if (attribs_maps._v !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.VERT, renum_maps.get('verts')); }
        if (attribs_maps._e !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.EDGE, renum_maps.get('edges')); }
        if (attribs_maps._w !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.WIRE, renum_maps.get('wires')); }
        if (attribs_maps._f !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.FACE, renum_maps.get('faces')); }
        if (attribs_maps.pt !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.POINT, renum_maps.get('points')); }
        if (attribs_maps.pl !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.PLINE, renum_maps.get('plines')); }
        if (attribs_maps.pg !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.PGON, renum_maps.get('pgons')); }
        if (attribs_maps.co !== undefined) { this._appendAttribs(ssid, attribs_maps, EEntType.COLL, renum_maps.get('colls')); }
        if (attribs_maps.mo !== undefined) { this._mergeModelAttribs(ssid, attribs_maps); }
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is deleted.
     * @param model_data The JSON data for the model.
     */
    public setJSONData(ssid: number, attribs_data: IAttribsJSONData): void {
        // add the attribute data
        if (attribs_data.posis !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.posis, EEntType.POSI);
        }
        if (attribs_data.verts !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.verts, EEntType.VERT);
        }
        if (attribs_data.edges !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.edges, EEntType.EDGE);
        }
        if (attribs_data.wires !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.wires, EEntType.WIRE);
        }
        if (attribs_data.faces !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.faces, EEntType.FACE);
        }
        if (attribs_data.points !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.points, EEntType.POINT);
        }
        if (attribs_data.plines !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.plines, EEntType.PLINE);
        }
        if (attribs_data.pgons !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.pgons, EEntType.PGON);
        }
        if (attribs_data.colls !== undefined) {
            this._setAttribsJSONData(ssid, attribs_data.colls, EEntType.COLL);
        }
        if (attribs_data.model !== undefined) {
            this._setModelAttribs(ssid, attribs_data.model);
        }
    }
    /**
     * Returns the JSON data for this model.
     */
    public getJSONData(ssid: number): IAttribsJSONData {
        const data: IAttribsJSONData = {
            posis: Array.from(this.modeldata.attribs.attribs_maps.get(ssid).ps.values()).map(attrib => attrib.getJSONData()),
            verts: Array.from(this.modeldata.attribs.attribs_maps.get(ssid)._v.values()).map(attrib => attrib.getJSONData()),
            edges: Array.from(this.modeldata.attribs.attribs_maps.get(ssid)._e.values()).map(attrib => attrib.getJSONData()),
            wires: Array.from(this.modeldata.attribs.attribs_maps.get(ssid)._w.values()).map(attrib => attrib.getJSONData()),
            faces: Array.from(this.modeldata.attribs.attribs_maps.get(ssid)._f.values()).map(attrib => attrib.getJSONData()),
            points: Array.from(this.modeldata.attribs.attribs_maps.get(ssid).pt.values()).map(attrib => attrib.getJSONData()),
            plines: Array.from(this.modeldata.attribs.attribs_maps.get(ssid).pl.values()).map(attrib => attrib.getJSONData()),
            pgons: Array.from(this.modeldata.attribs.attribs_maps.get(ssid).pg.values()).map(attrib => attrib.getJSONData()),
            colls: Array.from(this.modeldata.attribs.attribs_maps.get(ssid).co.values()).map(attrib => attrib.getJSONData()),
            model: Array.from(this.modeldata.attribs.attribs_maps.get(ssid).mo)
        };
        return data;
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
    // /**
    //  * From another model
    //  * The existing attributes are not deleted
    //  * Deep copy of attrib values
    //  * @param attribs_maps
    //  */
    // private _dumpModelAttribs(ssid: number, attribs_maps: IAttribsMaps) {
    //     this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ EEntType.MOD ]] = lodash.cloneDeep(attribs_maps[EEntTypeStr[ EEntType.MOD ]]);
    // }
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
    private _mergeAttribs(ssid: number, attribs_maps: IAttribsMaps, ent_type: EEntType) {
        const other_attribs: Map<string, GIAttribMapBase> = attribs_maps[EEntTypeStr[ ent_type ]];
        const this_attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                // get the name
                const name: string = other_attrib.getName();
                // get or create the attrib
                let this_attrib: GIAttribMapBase;
                if (!this_attribs.has(name)) {
                    this_attrib = this.modeldata.attribs.add.addEntAttribActive(ent_type, name, other_attrib.getDataType());
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
    /**
     * merge attributes from another model into this model.
     * It is assumed that a purge has been performed, so the entity IDs will have changed.
     * The new entity IDs are defined in the renum_map argument.
     * The existing attributes are not deleted.
     * @param attribs_maps
     */
    private _appendAttribs(ssid: number, attribs_maps: IAttribsMaps, ent_type: EEntType, renum_map: Map<number, number>) {
        const other_attribs: Map<string, GIAttribMapBase> = attribs_maps[EEntTypeStr[ ent_type ]];
        const this_attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                // get the name
                const name: string = other_attrib.getName();
                // get or create the attrib
                let this_attrib: GIAttribMapBase;
                if (!this_attribs.has(name)) {
                    this_attrib = this.modeldata.attribs.add.addEntAttribActive(ent_type, name, other_attrib.getDataType());
                } else {
                    this_attrib = this_attribs.get(name);
                    if (this_attrib.getDataType() !== other_attrib.getDataType()) {
                        throw new Error('Merge Error: Cannot merge attributes with different data types.');
                    }
                }
                // shift
                other_attrib.renumEnts(renum_map);
                // merge
                this_attrib.merge(other_attrib);
            }
        });
    }
    // /**
    //  * merge attributes from another model into this model.
    //  * Assumes that the existing model is empty
    //  * @param attribs_maps
    //  */
    // private _dumpAttribs(ssid: number, attribs_maps: IAttribsMaps, ent_type: EEntType) {
    //     const other_attribs: Map<string, GIAttribMapBase> = attribs_maps[EEntTypeStr[ ent_type ]];
    //     other_attribs.forEach( other_attrib => {
    //         if (other_attrib.numEnts() > 0) {
    //             const this_attrib: GIAttribMapBase = this.modeldata.attribs.add.addEntAttrib(
    //                 ent_type,
    //                 other_attrib.getName(),
    //                 other_attrib.getDataType());
    //             this_attrib.dump(other_attrib);
    //         }
    //     });
    //     throw new Error('Needs fixing');
    // }
    // /**
    //  * Dumps selected attributes from another model into this model.
    //  * Assumes that the existing model is empty
    //  * @param attribs_maps
    //  */
    // private _dumpAttribsSelect(ssid: number, attribs_maps: IAttribsMaps, ent_type: EEntType, selected: Set<number>): void {
    //     const other_attribs: Map<string, GIAttribMapBase> = attribs_maps[EEntTypeStr[ ent_type ]];
    //     other_attribs.forEach( other_attrib => {
    //         if (other_attrib.numEnts() > 0) {
    //             const this_attrib = this.modeldata.attribs.add.addEntAttrib(
    //                 ent_type,
    //                 other_attrib.getName(),
    //                 other_attrib.getDataType());
    //             this_attrib.dumpEnts(other_attrib, selected);
    //         }
    //     });
    //     throw new Error('Needs fixing');
    // }
    /**
     * From JSON data
     * Existing attributes are deleted
     * @param attribs_data
     */
    private _setAttribsJSONData(ssid: number, attribs_data: IAttribJSONData[], ent_type: EEntType): void {
        this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ ent_type ]] = new Map();
        attribs_data.forEach( attrib_data => {
            const this_attrib: GIAttribMapBase = this.modeldata.attribs.add.addEntAttribActive(
                ent_type,
                attrib_data.name,
                attrib_data.data_type);
            this_attrib.setJSONData(attrib_data);
        });
    }
}
