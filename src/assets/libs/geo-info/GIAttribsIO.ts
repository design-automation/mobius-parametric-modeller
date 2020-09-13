import { IAttribsJSONData, IAttribJSONData, TAttribDataTypes, EEntType,
    IAttribsMaps, EEntTypeStr, TModelAttribValuesArr, IEntSets, TAttribMap } from './common';
import { GIModelData } from './GIModelData';
import * as lodash from 'lodash';


/**
 * Class for attributes.
 */
export class GIAttribsIO {
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
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    public merge(attribs_maps: IAttribsMaps): void {
        if (attribs_maps.ps !== undefined) { this._mergeAttribs(attribs_maps, EEntType.POSI); }
        if (attribs_maps._v !== undefined) { this._mergeAttribs(attribs_maps, EEntType.VERT); }
        if (attribs_maps._e !== undefined) { this._mergeAttribs(attribs_maps, EEntType.EDGE); }
        if (attribs_maps._w !== undefined) { this._mergeAttribs(attribs_maps, EEntType.WIRE); }
        if (attribs_maps._f !== undefined) { this._mergeAttribs(attribs_maps, EEntType.FACE); }
        if (attribs_maps.pt !== undefined) { this._mergeAttribs(attribs_maps, EEntType.POINT); }
        if (attribs_maps.pl !== undefined) { this._mergeAttribs(attribs_maps, EEntType.PLINE); }
        if (attribs_maps.pg !== undefined) { this._mergeAttribs(attribs_maps, EEntType.PGON); }
        if (attribs_maps.co !== undefined) { this._mergeAttribs(attribs_maps, EEntType.COLL); }
        if (attribs_maps.mo !== undefined) { this._mergeModelAttribs(attribs_maps); }
    }
    /**
     * Adds data to this model from another model.
     * Assumes this model is empty - no conflict detection.
     * @param model_data Attribute data from the other model.
     */
    public dump(attribs_maps: IAttribsMaps): void {
        if (attribs_maps.ps !== undefined) { this._dumpAttribs(attribs_maps, EEntType.POSI); }
        if (attribs_maps._v !== undefined) { this._dumpAttribs(attribs_maps, EEntType.VERT); }
        if (attribs_maps._e !== undefined) { this._dumpAttribs(attribs_maps, EEntType.EDGE); }
        if (attribs_maps._w !== undefined) { this._dumpAttribs(attribs_maps, EEntType.WIRE); }
        if (attribs_maps._f !== undefined) { this._dumpAttribs(attribs_maps, EEntType.FACE); }
        if (attribs_maps.pt !== undefined) { this._dumpAttribs(attribs_maps, EEntType.POINT); }
        if (attribs_maps.pl !== undefined) { this._dumpAttribs(attribs_maps, EEntType.PLINE); }
        if (attribs_maps.pg !== undefined) { this._dumpAttribs(attribs_maps, EEntType.PGON); }
        if (attribs_maps.co !== undefined) { this._dumpAttribs(attribs_maps, EEntType.COLL); }
        if (attribs_maps.mo !== undefined) { this._dumpModelAttribs(attribs_maps); }
    }
    /**
     * Adds selected data to this model from another model.
     * Assumes this model is empty - no conflict detection.
     * If ent_sets is null, then only copy model attribs.
     * @param model_data Attribute data from the other model.
     */
    public dumpEnts(attribs_maps: IAttribsMaps, ent_sets: IEntSets): void {
        if (ent_sets === null) {
            if (attribs_maps.mo !== undefined) { this._dumpModelAttribs(attribs_maps); }
            return;
        }
        if (attribs_maps.ps !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.POSI, ent_sets.posis_i);
        }
        if (attribs_maps._v !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.VERT, ent_sets.verts_i);
        }
        if (attribs_maps._e !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.EDGE, ent_sets.edges_i);
        }
        if (attribs_maps._w !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.WIRE, ent_sets.wires_i);
        }
        if (attribs_maps._f !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.FACE, ent_sets.faces_i);
        }
        if (attribs_maps.pt !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.POINT, ent_sets.points_i);
        }
        if (attribs_maps.pl !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.PLINE, ent_sets.plines_i);
        }
        if (attribs_maps.pg !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.PGON, ent_sets.pgons_i);
        }
        if (attribs_maps.co !== undefined) {
            this._dumpAttribsSelect(attribs_maps, EEntType.COLL, ent_sets.colls_i);
        }
        if (attribs_maps.mo !== undefined) { this._dumpModelAttribs(attribs_maps); }
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted.
     * @param model_data Attribute data from the other model.
     */
    public append(attribs_maps: IAttribsMaps, renum_maps: Map<string, Map<number, number>>): void {
        // add the attribute data
        if (attribs_maps.ps !== undefined) { this._appendAttribs(attribs_maps, EEntType.POSI, renum_maps.get('posis')); }
        if (attribs_maps._v !== undefined) { this._appendAttribs(attribs_maps, EEntType.VERT, renum_maps.get('verts')); }
        if (attribs_maps._e !== undefined) { this._appendAttribs(attribs_maps, EEntType.EDGE, renum_maps.get('edges')); }
        if (attribs_maps._w !== undefined) { this._appendAttribs(attribs_maps, EEntType.WIRE, renum_maps.get('wires')); }
        if (attribs_maps._f !== undefined) { this._appendAttribs(attribs_maps, EEntType.FACE, renum_maps.get('faces')); }
        if (attribs_maps.pt !== undefined) { this._appendAttribs(attribs_maps, EEntType.POINT, renum_maps.get('points')); }
        if (attribs_maps.pl !== undefined) { this._appendAttribs(attribs_maps, EEntType.PLINE, renum_maps.get('plines')); }
        if (attribs_maps.pg !== undefined) { this._appendAttribs(attribs_maps, EEntType.PGON, renum_maps.get('pgons')); }
        if (attribs_maps.co !== undefined) { this._appendAttribs(attribs_maps, EEntType.COLL, renum_maps.get('colls')); }
        if (attribs_maps.mo !== undefined) { this._mergeModelAttribs(attribs_maps); }
    }
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is deleted.
     * @param model_data The JSON data for the model.
     */
    public setJSONData(attribs_data: IAttribsJSONData): void {
        // add the attribute data
        if (attribs_data.posis !== undefined) {
            this._setAttribsJSONData(attribs_data.posis, EEntType.POSI);
        }
        if (attribs_data.verts !== undefined) {
            this._setAttribsJSONData(attribs_data.verts, EEntType.VERT);
        }
        if (attribs_data.edges !== undefined) {
            this._setAttribsJSONData(attribs_data.edges, EEntType.EDGE);
        }
        if (attribs_data.wires !== undefined) {
            this._setAttribsJSONData(attribs_data.wires, EEntType.WIRE);
        }
        if (attribs_data.faces !== undefined) {
            this._setAttribsJSONData(attribs_data.faces, EEntType.FACE);
        }
        if (attribs_data.points !== undefined) {
            this._setAttribsJSONData(attribs_data.points, EEntType.POINT);
        }
        if (attribs_data.plines !== undefined) {
            this._setAttribsJSONData(attribs_data.plines, EEntType.PLINE);
        }
        if (attribs_data.pgons !== undefined) {
            this._setAttribsJSONData(attribs_data.pgons, EEntType.PGON);
        }
        if (attribs_data.colls !== undefined) {
            this._setAttribsJSONData(attribs_data.colls, EEntType.COLL);
        }
        if (attribs_data.model !== undefined) {
            this._setModelAttribs(attribs_data.model);
        }
    }
    /**
     * Returns the JSON data for this model.
     */
    public getJSONData(): IAttribsJSONData {
        const data: IAttribsJSONData = {
            posis: Array.from(this._attribs_maps.ps.values()).map(attrib => attrib.getJSONData()),
            verts: Array.from(this._attribs_maps._v.values()).map(attrib => attrib.getJSONData()),
            edges: Array.from(this._attribs_maps._e.values()).map(attrib => attrib.getJSONData()),
            wires: Array.from(this._attribs_maps._w.values()).map(attrib => attrib.getJSONData()),
            faces: Array.from(this._attribs_maps._f.values()).map(attrib => attrib.getJSONData()),
            points: Array.from(this._attribs_maps.pt.values()).map(attrib => attrib.getJSONData()),
            plines: Array.from(this._attribs_maps.pl.values()).map(attrib => attrib.getJSONData()),
            pgons: Array.from(this._attribs_maps.pg.values()).map(attrib => attrib.getJSONData()),
            colls: Array.from(this._attribs_maps.co.values()).map(attrib => attrib.getJSONData()),
            model: Array.from(this._attribs_maps.mo)
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
    private _mergeModelAttribs(attribs_maps: IAttribsMaps): void {
        const other_attribs: Map<string, TAttribDataTypes> = attribs_maps[EEntTypeStr[ EEntType.MOD ]];
        const this_attribs: Map<string, TAttribDataTypes> = this._attribs_maps[EEntTypeStr[ EEntType.MOD ]];
        // TODO this is a hack to fix an error
        if (!(other_attribs instanceof Map)) { return; }
        other_attribs.forEach( (val, key) => {
            this_attribs.set(key, lodash.cloneDeep(val));
        });
    }
    /**
     * From another model
     * The existing attributes are not deleted
     * Deep copy of attrib values
     * @param attribs_maps
     */
    private _dumpModelAttribs(attribs_maps: IAttribsMaps) {
        this._attribs_maps[EEntTypeStr[ EEntType.MOD ]] = lodash.cloneDeep(attribs_maps[EEntTypeStr[ EEntType.MOD ]]);
    }
    /**
     * From JSON data
     * Existing attributes are deleted
     * @param new_attribs_data
     */
    private _setModelAttribs(new_attribs_data: TModelAttribValuesArr) {
        this._attribs_maps[EEntTypeStr[ EEntType.MOD ]] = new Map(new_attribs_data);
    }
    /**
     * merge attributes from another model into this model.
     * The existing attributes are not deleted
     * @param attribs_maps
     */
    private _mergeAttribs(attribs_maps: IAttribsMaps, ent_type: EEntType) {
        const other_attribs: Map<string, TAttribMap> = attribs_maps[EEntTypeStr[ ent_type ]];
        const this_attribs: Map<string, TAttribMap> = this._attribs_maps[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                // get the name
                const name: string = other_attrib.getName();
                // get or create the attrib
                let this_attrib: TAttribMap;
                if (!this_attribs.has(name)) {
                    this_attrib = this._modeldata.attribs.add.addEntAttrib(ent_type, name, other_attrib.getDataType());
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
    private _appendAttribs(attribs_maps: IAttribsMaps, ent_type: EEntType, renum_map: Map<number, number>) {
        const other_attribs: Map<string, TAttribMap> = attribs_maps[EEntTypeStr[ ent_type ]];
        const this_attribs: Map<string, TAttribMap> = this._attribs_maps[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                // get the name
                const name: string = other_attrib.getName();
                // get or create the attrib
                let this_attrib: TAttribMap;
                if (!this_attribs.has(name)) {
                    this_attrib = this._modeldata.attribs.add.addEntAttrib(ent_type, name, other_attrib.getDataType());
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
    /**
     * merge attributes from another model into this model.
     * Assumes that the existing model is empty
     * @param attribs_maps
     */
    private _dumpAttribs(attribs_maps: IAttribsMaps, ent_type: EEntType) {
        const other_attribs: Map<string, TAttribMap> = attribs_maps[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                const this_attrib: TAttribMap = this._modeldata.attribs.add.addEntAttrib(
                    ent_type,
                    other_attrib.getName(),
                    other_attrib.getDataType());
                this_attrib.dump(other_attrib);
            }
        });
    }
    /**
     * Dumps selected attributes from another model into this model.
     * Assumes that the existing model is empty
     * @param attribs_maps
     */
    private _dumpAttribsSelect(attribs_maps: IAttribsMaps, ent_type: EEntType, selected: Set<number>): void {
        const other_attribs: Map<string, TAttribMap> = attribs_maps[EEntTypeStr[ ent_type ]];
        other_attribs.forEach( other_attrib => {
            if (other_attrib.numEnts() > 0) {
                const this_attrib = this._modeldata.attribs.add.addEntAttrib(
                    ent_type,
                    other_attrib.getName(),
                    other_attrib.getDataType());
                this_attrib.dumpEnts(other_attrib, selected);
            }
        });
    }
    /**
     * From JSON data
     * Existing attributes are deleted
     * @param attribs_data
     */
    private _setAttribsJSONData(attribs_data: IAttribJSONData[], ent_type: EEntType): void {
        this._attribs_maps[EEntTypeStr[ ent_type ]] = new Map();
        attribs_data.forEach( attrib_data => {
            const this_attrib: TAttribMap = this._modeldata.attribs.add.addEntAttrib(
                ent_type,
                attrib_data.name,
                attrib_data.data_type);
            this_attrib.setJSONData(attrib_data);
        });
    }
}
