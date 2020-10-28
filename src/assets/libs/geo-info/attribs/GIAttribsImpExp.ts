import { IAttribsJSONData, IAttribJSONData, EEntType, IEntSets } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for attributes. merge dump append
 */
export class GIAttribsImpExp {
    private modeldata: GIModelData;
   /**
     * Creates the object.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    /**
     * Imports JSON data from another model.
     * @param model_data Attribute data from the other model.
     */
    public importGI(gi_attribs_data: IAttribsJSONData, renum_maps: Map<EEntType, Map<number, number>>): void {
        // positions
        for (const gi_attrib_data of gi_attribs_data.posis) {
            this._importEntAttribData(gi_attrib_data, EEntType.POSI, renum_maps);
        }
        // vertices
        for (const gi_attrib_data of gi_attribs_data.verts) {
            this._importEntAttribData(gi_attrib_data, EEntType.VERT, renum_maps);
        }
        // edges
        for (const gi_attrib_data of gi_attribs_data.edges) {
            this._importEntAttribData(gi_attrib_data, EEntType.EDGE, renum_maps);
        }
        // wires
        for (const gi_attrib_data of gi_attribs_data.wires) {
            this._importEntAttribData(gi_attrib_data, EEntType.WIRE, renum_maps);
        }
        // points
        for (const gi_attrib_data of gi_attribs_data.points) {
            this._importEntAttribData(gi_attrib_data, EEntType.POINT, renum_maps);
        }
        // plines
        for (const gi_attrib_data of gi_attribs_data.plines) {
            this._importEntAttribData(gi_attrib_data, EEntType.PLINE, renum_maps);
        }
        // pgons
        for (const gi_attrib_data of gi_attribs_data.pgons) {
            this._importEntAttribData(gi_attrib_data, EEntType.PGON, renum_maps);
        }
        // colls
        for (const gi_attrib_data of gi_attribs_data.colls) {
            // TODO
            // What happens when collections exist already and need to be merged
            //
            this._importEntAttribData(gi_attrib_data, EEntType.COLL, renum_maps);
        }
        // model
        for (const [name, val] of gi_attribs_data.model) {
            this.modeldata.attribs.set.setModelAttribVal(name, val);
        }
    }
    /**
     * Returns the JSON data for this model.
     */
    public exportGI(ent_sets: IEntSets): IAttribsJSONData {
        const ssid: number = this.modeldata.active_ssid;
        const data: IAttribsJSONData = {
            posis: [],
            verts: [],
            edges: [],
            wires: [],
            points: [],
            plines: [],
            pgons: [],
            colls: [],
            model: []
        };
        this.modeldata.attribs.attribs_maps.get(ssid).ps.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets.ps);
            if (attrib_data !== null) {
                data.posis.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._v.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets._v);
            if (attrib_data !== null) {
                data.verts.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._e.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets._e);
            if (attrib_data !== null) {
                data.edges.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._w.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets._w);
            if (attrib_data !== null) {
                data.wires.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pt.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets.pt);
            if (attrib_data !== null) {
                data.points.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pl.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets.pl);
            if (attrib_data !== null) {
                data.plines.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pg.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets.pg);
            if (attrib_data !== null) {
                data.pgons.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).co.forEach( attrib => {
            const attrib_data: IAttribJSONData = attrib.getJSONData(ent_sets.co);
            if (attrib_data !== null) {
                data.colls.push(attrib_data);
            }
        });
        data.model = Array.from(this.modeldata.attribs.attribs_maps.get(ssid).mo);
        return data;
    }
    /**
     * Returns the JSON data for this model.
     */
    public exportGIAll(): IAttribsJSONData {
        // TODO
        throw new Error("Not implemented");
        // TODO
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     *
     * @param gi_attrib_data
     * @param ent_type
     * @param renum_map
     */
    private _importEntAttribData(gi_attrib_data: IAttribJSONData, ent_type: EEntType, renum_maps: Map<EEntType, Map<number, number>>): void {
        // get or create the attrib
        this.modeldata.attribs.add.addEntAttrib(ent_type, gi_attrib_data.name, gi_attrib_data.data_type);
        // set all values for this attrib
        for (const [val, ents_i] of gi_attrib_data.data) {
            const ents2_i: number[] = ents_i.map( ent_i => renum_maps.get(ent_type).get(ent_i) );
            this.modeldata.attribs.set.setEntsAttribVal(ent_type, ents2_i, gi_attrib_data.name, val);
        }
    }
}
