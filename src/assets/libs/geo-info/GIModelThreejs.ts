import { EEntType } from './common';
import { IThreeJS } from './ThreejsJSON';
import { GIModelData } from './GIModelData';

/**
 * Geo-info model class.
 */
export class GIModelThreejs {
    private _modeldata: GIModelData;

   /**
     * Constructor
     */
    constructor(modeldata: GIModelData) {
        this._modeldata = modeldata;
    }
    /**
     * Generate a default color if none exists.
     */
    private _generateColors(): number[] {
        const colors = [];
        const num_ents = this._modeldata.geom.query.numEnts(EEntType.VERT);
        for (let index = 0; index < num_ents; index++) {
            colors.push(1, 1, 1);
        }
        return colors;
    }
    /**
     * Returns arrays for visualization in Threejs.
     */
    public get3jsData(): IThreeJS {
        // get the attribs at the vertex level
        const [posis_xyz, posis_map]: [number[], Map<number, number>]  =  this._modeldata.attribs.threejs.get3jsSeqPosisCoords();
        const [vertex_xyz, vertex_map]: [number[], Map<number, number>]  =  this._modeldata.attribs.threejs.get3jsSeqVertsCoords();
        const normals_values: number[] = this._modeldata.attribs.threejs.get3jsSeqVertsNormals();
        let colors_values: number[] = this._modeldata.attribs.threejs.get3jsSeqVertsColors();
        if (!colors_values) {
            colors_values = this._generateColors();
        }
        // get posi indices
        const posis_indices: number[] = Array.from(posis_map.values());
        // get the data for triangles
        const [tris_verts_i, triangle_select_map, pgon_materials, pgon_material_groups]:
            [number[], Map<number, number>, object[], [number, number, number][]] = this._modeldata.geom.threejs.get3jsTris(vertex_map);
        // get the data for edges
        const [edges_verts_i, edge_select_map, pline_materials, pline_material_groups]:
            [number[], Map<number, number>, object[], [number, number, number][]] = this._modeldata.geom.threejs.get3jsEdges(vertex_map);
        // get the datas for points
        const [points_verts_i, point_select_map]: [number[], Map<number, number>] = this._modeldata.geom.threejs.get3jsPoints(vertex_map);
        // return an object containing all the data
        const data: IThreeJS = {
            posis_xyz: posis_xyz,
            posis_indices: posis_indices,
            posis_map: posis_map,
            vertex_xyz: vertex_xyz,
            vertex_map: vertex_map,
            normals: normals_values,
            colors: colors_values,
            point_indices: points_verts_i,
            point_select_map: point_select_map,
            edge_indices: edges_verts_i,
            edge_select_map: edge_select_map,
            white_edge_indices: [], // TODO remove
            white_edge_select_map: new Map(), // TODO remove
            triangle_indices: tris_verts_i,
            triangle_select_map: triangle_select_map,
            pline_materials: pline_materials,
            pline_material_groups: pline_material_groups,
            pgon_materials: pgon_materials,
            pgon_material_groups: pgon_material_groups
        };
        // console.log(data);
        return data;
    }
}
