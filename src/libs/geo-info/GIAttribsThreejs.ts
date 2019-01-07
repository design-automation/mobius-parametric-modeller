import { GIModel } from './GIModel';
import { TAttribDataTypes, EEntityTypeStr, IAttribsMaps, EEntStrToAttribMap, EAttribNames } from './common';
import { GIAttribMap } from './GIAttribMap';

/**
 * Class for attributes.
 */
export class GIAttribsThreejs {
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
    // ============================================================================
    // Threejs
    // For methods to get the array of edges and triangles, see the geom class
    // get3jsTris() and get3jsEdges()
    // ============================================================================
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indicies pointing to the positio.
     */
    public get3jsSeqVertsCoords(): number[] {
        const verts_i: number[] = this._model.geom.query.getEnts(EEntityTypeStr.VERT);
        const posis_i: number[] = verts_i.map(vert_i => this._model.geom.query.navVertToPosi(vert_i));
        const coords_attrib: GIAttribMap = this._attribs_maps.posis.get(EAttribNames.COORDS);
        return [].concat(...coords_attrib.getEntsVals(posis_i));
    }
    /**
     * Get a flat array of attribute values for all the vertices.
     * Verts that have been deleted will not be included
     * @param attrib_name The name of the vertex attribute. Either NORMAL or COLOR.
     */
    public get3jsSeqVertsAttrib(attrib_name: string): number[] {
        if (!this._attribs_maps.verts.has(attrib_name)) { return null; }
        const verts_i: number[] = this._model.geom.query.getEnts(EEntityTypeStr.VERT);
        const verts_attrib: GIAttribMap = this._attribs_maps.verts.get(attrib_name);
        return [].concat(...verts_attrib.getEntsVals(verts_i));
    }
    /**
     *
     * @param ent_type_str
     */
    public getAttribsForTable(ent_type_str: EEntityTypeStr): any[] {
        // create a map of objects to store the data
        const data_obj_map: Map< number, { id: string} > = new Map();
        // create the ID for each table row
        const ents_i: number[] = this._model.geom.query.getEnts(ent_type_str);
        for (const ent_i of ents_i) {
            data_obj_map.set(ent_i, { id: `${ent_type_str}${ent_i}` } );
        }
        // get the attribs map for this ent type
        const attribs_maps_key: string = EEntStrToAttribMap[ent_type_str];
        const attribs: Map<string, GIAttribMap> = this._attribs_maps[attribs_maps_key];

        // loop through all the attributes
        attribs.forEach( (attrib, attrib_name) => {
            const data_size: number = attrib.getDataSize();
            for (const ent_i of ents_i) {
                const attrib_value = attrib.getEntVal(ent_i);
                if ( data_size > 1 ) {
                    (attrib_value as any[]).forEach( (v, i) => {
                        data_obj_map.get(ent_i)[`${attrib_name}[${i}]`] = v;
                    });
                } else {
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                }
            }
        });
        return Array.from(data_obj_map.values());
    }
}
