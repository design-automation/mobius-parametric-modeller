import { EAttribNames, EEntType } from './common';
import { IThreeJS } from './ThreejsJSON';
import { GIModel } from './GIModel';
import { GIModelData } from './GIModelData';
import { isArray } from 'util';
import { time } from 'console';

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
        // const geom_array = this._modeldata.modeldata.geom._geom_maps;
        // for (const e of geom_array.dn_edges_verts) {
        //     for (const v of e) {
        //         const vert_attrb0 = colors[v * 3];
        //         const vert_attrb1 = colors[v * 3 + 1];
        //         const vert_attrb2 = colors[v * 3 + 2];
        //         if (vert_attrb0 === 1 && vert_attrb1 === 1 && vert_attrb2 === 1) {
        //             colors[v * 3] = 0;
        //             colors[v * 3 + 1] = 0;
        //             colors[v * 3 + 2] = 0;
        //         }
        //     }
        // }
        // for (const w of geom_array.dn_plines_wires) {
        //     for (const e of geom_array.dn_wires_edges.get(w]) {
        //         for (const v of geom_array.dn_edges_verts.get(e]) {
        //             const vert_attrb0 = colors[v * 3];
        //             const vert_attrb1 = colors[v * 3 + 1];
        //             const vert_attrb2 = colors[v * 3 + 2];
        //             if (vert_attrb0 === 1 && vert_attrb1 === 1 && vert_attrb2 === 1) {
        //                 colors[v * 3] = 0;
        //                 colors[v * 3 + 1] = 0;
        //                 colors[v * 3 + 2] = 0;
        //             }
        //         }
        //     }
        // }
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
     * Generate a default color if none exists.
     */
    private _getTimelineAttr(vertex_map: Map<number, number>) {
        const time_points = this._modeldata.attribs._attribs_maps.mo.get('time_slider');
        if (!time_points || !isArray(time_points)) { return null; }

        const geom_array = this._modeldata.geom._geom_maps;
        const attr_array = this._modeldata.attribs._attribs_maps.co.get('visible');
        if (!attr_array) { return null; }

        const timeline_objs = {
            '__time_points__': time_points
        };
        for (const time_point of time_points) {
            const time_point_obj = {
                time_point: time_point,
                point_indices: [],
                // point_select_map: new Map<number, number>(),
                edge_indices: [],
                // edge_select_map: edge_select_map,
                white_edge_indices: [],
                // white_edge_select_map: white_edge_select_map,
                triangle_indices: [],
                // triangle_select_map: triangle_select_map,
                // materials: materials,
                // material_groups: material_groups,
            };
            timeline_objs[time_point] = time_point_obj;
        }
        for (const attr of attr_array.getEntsVals()) {
            if (!isArray(attr[0]) || !isArray(attr[1])) { continue; }
            for (const col_i of attr[0]) {
                const col_pts = this._modeldata.geom.nav.navCollToPoint(col_i);
                const col_edges = this._modeldata.geom.nav.navAnyToEdge(EEntType.COLL, col_i);
                const col_tris = this._modeldata.geom.nav.navAnyToTri(EEntType.COLL, col_i);

                const point_indices = this._modeldata.geom.threejs.get3jsPointIndices(col_pts, vertex_map);
                const edge_indices = this._modeldata.geom.threejs.get3jsEdgeIndices(col_edges, vertex_map);
                const triangle_indices = this._modeldata.geom.threejs.get3jsTriIndices(col_tris, vertex_map);
                // const points_verts_i: number[] = this._modeldata.geom.threejs.get3jsPointIndex(colObjs[1], vertex_map);
                // const [edges_verts_i, edge_select_map, white_edges_verts_i, white_edge_select_map]:
                //         [number[], Map<number, number>, number[], Map<number, number>] =
                //         this._modeldata.geom.threejs.get3jsEdges(vertex_map);
                // const [tris_verts_i, triangle_select_map, materials, material_groups]:
                //         [number[], Map<number, number>, object[], [number, number, number][]] =
                //         this._modeldata.geom.threejs.get3jsTris(vertex_map);
                for (const tp of <string[]>attr[1]) {
                    if (!timeline_objs[tp]) { continue; }

                    timeline_objs[tp].point_indices = timeline_objs[tp].point_indices.concat(point_indices);
                    timeline_objs[tp].edge_indices = timeline_objs[tp].edge_indices.concat(edge_indices[0]);
                    timeline_objs[tp].white_edge_indices = timeline_objs[tp].white_edge_indices.concat(edge_indices[1]);
                    timeline_objs[tp].triangle_indices = timeline_objs[tp].triangle_indices.concat(triangle_indices);
                }
            }
        }

        return timeline_objs;
        // for (const e of geom_array.dn_edges_verts) {
        //     for (const v of e) {
        //         const vert_attrb0 = colors[v * 3];
        //         const vert_attrb1 = colors[v * 3 + 1];
        //         const vert_attrb2 = colors[v * 3 + 2];
        //         if (vert_attrb0 === 1 && vert_attrb1 === 1 && vert_attrb2 === 1) {
        //             colors[v * 3] = 0;
        //             colors[v * 3 + 1] = 0;
        //             colors[v * 3 + 2] = 0;
        //         }
        //     }
        // }

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
        // get the indices of the vertices for edges, points and triangles
        const [tris_verts_i, triangle_select_map, materials, material_groups]:
            [number[], Map<number, number>, object[], [number, number, number][]] = this._modeldata.geom.threejs.get3jsTris(vertex_map);
        const [edges_verts_i, edge_select_map, white_edges_verts_i, white_edge_select_map]:
            [number[], Map<number, number>, number[], Map<number, number>] = this._modeldata.geom.threejs.get3jsEdges(vertex_map);
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
            white_edge_indices: white_edges_verts_i,
            white_edge_select_map: white_edge_select_map,
            triangle_indices: tris_verts_i,
            triangle_select_map: triangle_select_map,
            materials: materials,
            material_groups: material_groups,
        };
        // console.log(data);
        return data;
    }
}
