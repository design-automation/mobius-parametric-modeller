import { GIModel } from './GIModel';
import { IAttribsData, IAttribData, TAttribDataTypes, EEntType, IAttribsMaps, EEntTypeStr, TModelAttribValuesArr } from './common';
import { GIAttribMap } from './GIAttribMap';

/**
 * Class for attributes.
 */
export class GIAttribsIO {
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
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param model_data The JSON data for the model.
     */
    public merge(attribs_maps: IAttribsMaps): void {
        // add the attribute data
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
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param model_data The JSON data for the model.
     */
    public setData(attribs_data: IAttribsData): void {
        // add the attribute data
        if (attribs_data.positions !== undefined) {
            this._setAttribs(attribs_data.positions, EEntType.POSI);
        }
        if (attribs_data.vertices !== undefined) {
            this._setAttribs(attribs_data.vertices, EEntType.VERT);
        }
        if (attribs_data.edges !== undefined) {
            this._setAttribs(attribs_data.edges, EEntType.EDGE);
        }
        if (attribs_data.wires !== undefined) {
            this._setAttribs(attribs_data.wires, EEntType.WIRE);
        }
        if (attribs_data.faces !== undefined) {
            this._setAttribs(attribs_data.faces, EEntType.FACE);
        }
        if (attribs_data.points !== undefined) {
            this._setAttribs(attribs_data.points, EEntType.POINT);
        }
        if (attribs_data.polylines !== undefined) {
            this._setAttribs(attribs_data.polylines, EEntType.PLINE);
        }
        if (attribs_data.polygons !== undefined) {
            this._setAttribs(attribs_data.polygons, EEntType.PGON);
        }
        if (attribs_data.collections !== undefined) {
            this._setAttribs(attribs_data.collections, EEntType.COLL);
        }
        if (attribs_data.model !== undefined) {
            this._setModelAttribs(attribs_data.model);
        }
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IAttribsData {
        return {
            positions: Array.from(this._attribs_maps.ps.values()).map(attrib => attrib.getData()),
            vertices: Array.from(this._attribs_maps._v.values()).map(attrib => attrib.getData()),
            edges: Array.from(this._attribs_maps._e.values()).map(attrib => attrib.getData()),
            wires: Array.from(this._attribs_maps._w.values()).map(attrib => attrib.getData()),
            faces: Array.from(this._attribs_maps._f.values()).map(attrib => attrib.getData()),
            points: Array.from(this._attribs_maps.pt.values()).map(attrib => attrib.getData()),
            polylines: Array.from(this._attribs_maps.pl.values()).map(attrib => attrib.getData()),
            polygons: Array.from(this._attribs_maps.pg.values()).map(attrib => attrib.getData()),
            collections: Array.from(this._attribs_maps.co.values()).map(attrib => attrib.getData()),
            model: Array.from(this._attribs_maps.mo)
        };
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * From another model
     * The existing attributes are not deleted
     * @param attribs_maps
     */
    private _mergeModelAttribs(attribs_maps: IAttribsMaps) {
        const from_attrib: Map<string, TAttribDataTypes> = attribs_maps[EEntTypeStr[ EEntType.MOD ]];
        const to_attrib: Map<string, TAttribDataTypes> = this._attribs_maps[EEntTypeStr[ EEntType.MOD ]];
        from_attrib.forEach( (value, name) => {
            to_attrib.set(name, value);
        });
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
     * From another model
     * The existing attributes are not deleted
     * @param attribs_maps
     */
    private _mergeAttribs(attribs_maps: IAttribsMaps, ent_type: EEntType) {
        const from_attribs: Map<string, GIAttribMap> = attribs_maps[EEntTypeStr[ ent_type ]];
        const to_attribs: Map<string, GIAttribMap> = this._attribs_maps[EEntTypeStr[ ent_type ]];
        const num_ents: number = this._model.geom.query.numEnts(ent_type, true); // incude deleted ents
        from_attribs.forEach( from_attrib => {
            const name: string = from_attrib.getName();
            // get or create the existing attrib
            if (!to_attribs.has(name)) {
                to_attribs.set(name, new GIAttribMap( name, from_attrib.getDataType(), from_attrib.getDataSize()) );
            }
            const to_attrib: GIAttribMap = to_attribs.get(name);
            // get the data and shift the ents_i indices
            const ents_i_values: [number[], TAttribDataTypes][] = from_attrib.getEntsVals();
            for (const ents_i_value of ents_i_values) {
                ents_i_value[0] = ents_i_value[0].map( ent_i => ent_i + num_ents ); // shift
            }
            // set the data
            to_attrib.setEntsVals(ents_i_values);
        });
    }
    /**
     * From JSON data
     * Existing attributes are deleted
     * @param new_attribs_data
     */
    private _setAttribs(new_attribs_data: IAttribData[], ent_type: EEntType) {
        const to_attribs: Map<string, GIAttribMap> = new Map();
        new_attribs_data.forEach( new_attrib_data => {
            const name: string = new_attrib_data.name;
            // create a new attrib
            const to_attrib: GIAttribMap = new GIAttribMap( name, new_attrib_data.data_type, new_attrib_data.data_size );
            to_attribs.set(name, to_attrib);
            // set the data
            to_attrib.setEntsVals(new_attrib_data.data);
        });
        this._attribs_maps[EEntTypeStr[ ent_type ]] = to_attribs;
    }
}
