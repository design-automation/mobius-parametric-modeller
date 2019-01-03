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
     * @param verts An array of vertex indicies pointing to the coordinates.
     */
    public get3jsSeqVertsCoords(verts: number[]): number[] {
        const coords_attrib: GIAttribMap = this._attribs_maps.posis.get(EAttribNames.COORDS);
        const coords_keys: number[] = coords_attrib.getSeqKeys();
        const coords_values: TAttribDataTypes[] = coords_attrib.getValues();
        const verts_cords_values: number[] = [];
        verts.forEach( coords_i => verts_cords_values.push(...coords_values[coords_keys[coords_i]] as number[]));
        return verts_cords_values;
    }
    /**
     * Get a flat array of attribute values for all the vertices.
     * @param attrib_name The name of the vertex attribute. Either NORMAL or COLOR.
     */
    public get3jsSeqVertsAttrib(attrib_name: string): number[] {
        if (!this._attribs_maps.verts.has(attrib_name)) { return null; }
        const attrib_map: GIAttribMap = this._attribs_maps.verts.get(attrib_name);
        const attrib_keys: number[] = attrib_map.getSeqKeys();
        const attrib_values: TAttribDataTypes[] = attrib_map.getValues();
        const result = [].concat(...attrib_keys.map(attrib_key => attrib_values[attrib_key]));
        return result;
    }

    // public getVertsCoords(): GIAttribMap {
    //     const coords_attrib: GIAttribMap = this._posis.get(EAttribNames.COORDS);
    //     return coords_attrib;
    // }

    public getAttribsForTable(tab: string) {
        const e = EEntityTypeStr;
        const EntityType = [e.POSI, e.VERT, e.EDGE, e.WIRE, e.FACE, e.POINT, e.PLINE, e.PGON, e.COLL];
        const _attrib_inner_maps = {};
        _attrib_inner_maps[EntityType[0]] = this._model.geom.query.numPosis();
        _attrib_inner_maps[EntityType[1]] = this._model.geom.query.numVerts();
        _attrib_inner_maps[EntityType[2]] = this._model.geom.query.numEdges();
        _attrib_inner_maps[EntityType[3]] = this._model.geom.query.numWires();
        _attrib_inner_maps[EntityType[4]] = this._model.geom.query.numFaces();
        _attrib_inner_maps[EntityType[5]] = this._model.geom.query.numPoints();
        _attrib_inner_maps[EntityType[6]] = this._model.geom.query.numPlines();
        _attrib_inner_maps[EntityType[7]] = this._model.geom.query.numPgons();
        _attrib_inner_maps[EntityType[8]] = this._model.geom.query.numColls();

        const data_obj_map: Map<number, { id: string}> = new Map();
        for (let index = 0; index < _attrib_inner_maps[tab]; index++) {
            data_obj_map.set(index, { id: `${tab}${index}` } );
        }

        const attribs_maps_key: string = EEntStrToAttribMap[tab];
        this._attribs_maps[attribs_maps_key].forEach(attr => {
            const attrib_map: GIAttribMap = attr;
            const result = attrib_map.getSeqValues();
            result.forEach((value: TAttribDataTypes, index) => {
                const n = attr.getName().toLowerCase();
                if ( attr.getDataSize() > 1 ) {
                    const value2 = value as any[];
                    // console.log(data_obj_map);
                    value2.forEach( (v, i) => {
                        data_obj_map.get(index)[`${n}${i}`] = v;
                    });
                } else {
                    data_obj_map.get(index)[`${n}`] = value;
                }
            });
        });
        return Array.from(data_obj_map.values());
    }
}
