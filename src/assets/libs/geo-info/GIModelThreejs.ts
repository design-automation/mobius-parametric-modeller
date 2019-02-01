import { EAttribNames, EEntType } from './common';
import { IThreeJS } from './ThreejsJSON';
import { GIModel } from './GIModel';
/**
 * Geo-info model class.
 */
export class GIModelThreejs {
    private _model: GIModel;

   /**
     * Creates an object to store the attribute data.
     * @param model The JSON data
     */
    constructor(model: GIModel) {
        this._model = model;
    }
    /**
     * Generate a default color if none exists.
     */
    private _generateColors(): number[] {
        const colors = [];
        const numEnts = this._model.geom.query.numEnts(EEntType.VERT, false);
        for (let index = 0; index < numEnts; index++) {
            colors.push(1, 1, 1);
        }
        return colors;
    }
    // /**
    //  * Generate default normals if non exist.
    //  */
    // private _generateNormals(): number[] {
    //     const normals = [];
    //     const numEnts = this.geom.query.numEnts(EEntType.VERT, false);
    //     for (let index = 0; index < numEnts; index++) {
    //         normals.push(0, 0, 0);
    //     }
    //     return normals;
    // }
    /**
     * Returns arrays for visualization in Threejs.
     */
    public get3jsData(): IThreeJS {
        // get the attribs at the vertex level
        const [posis_xyz, posis_map]: [number[], Map<number, number>]  =  this._model.attribs.threejs.get3jsSeqPosisCoords();
        const [vertex_xyz, vertex_map]: [number[], Map<number, number>]  =  this._model.attribs.threejs.get3jsSeqVertsCoords();
        const normals_values: number[] = this._model.attribs.threejs.get3jsSeqVertsAttrib(EAttribNames.NORMAL);
        let colors_values: number[] = this._model.attribs.threejs.get3jsSeqVertsAttrib(EAttribNames.COLOUR);
        // add normals and colours
        // if (!normals_values) {
        //     normals_values = this._generateNormals();
        // }
        if (!colors_values) {
            colors_values = this._generateColors();
        }
        // get posi indices
        const posis_indices: number[] = Array.from(posis_map.values());
        // get the indices of the vertices for edges, points and triangles
        const [tris_verts_i, triangle_select_map, materials, material_groups]:
            [number[], Map<number, number>, object[], [number, number, number][]] = this._model.geom.threejs.get3jsTris(vertex_map);
        const [edges_verts_i, edge_select_map]: [number[], Map<number, number>] = this._model.geom.threejs.get3jsEdges(vertex_map);
        const [points_verts_i, point_select_map]: [number[], Map<number, number>] = this._model.geom.threejs.get3jsPoints(vertex_map);
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
            triangle_indices: tris_verts_i,
            triangle_select_map: triangle_select_map,
            materials: materials,
            material_groups: material_groups
        };
        // console.log(data);
        return data;
    }
}
