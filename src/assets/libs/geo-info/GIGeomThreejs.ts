import { GIGeom } from './GIGeom';
import { IGeomMaps, TTri, TEdge, TPoint, TPline, TWire } from './common';
import { GIAttribMap } from './GIAttribMap';
import * as THREE from 'three';

/**
 * Class for geometry.
 */
export class GIGeomThreejs {
    private _geom: GIGeom;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomMaps) {
        this._geom = geom;
        this._geom_maps = geom_arrays;
    }
    // ============================================================================
    // ThreeJS
    // Get arrays for threejs, these retrun arrays of indexes to positions
    // For a method to get the array of positions, see the attrib class
    // getSeqCoords()
    // ============================================================================
    // /**
    //  * Returns a flat list of all vertices.
    //  * The indices in the list point to the sequential coordinates.
    //  */
    // public get3jsVerts(): number[] {
    //     return this._geom_maps.dn_verts_posis;
    // }
    /**
     * Returns that data required for threejs triangles.
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs tri indices to the gi model tri indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    public get3jsTris(vertex_map: Map<number, number>): [number[], Map<number, number>, object[], [number, number, number][]] {

        // TODO this should not be parsed each time
        const settings = JSON.parse(localStorage.getItem('mpm_settings'));

        // arrays to store threejs data
        const tri_data_arrs: [number[], TTri, number][] = []; // tri_mat_indices, new_tri_verts_i, tri_i
        const mat_f: object = {
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 0,
            side: THREE.FrontSide,
            wireframe: settings.wireframe.show
        };
        const mat_b: object = {
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 0,
            side: THREE.BackSide,
            wireframe: settings.wireframe.show
        };
        const materials: object[] = [this._getMaterial( mat_f ), this._getMaterial( mat_b )];
        const material_names:  string[] = ['default_front', 'default_back'];
        // get the material attribute from polygons
        const material_attrib: GIAttribMap = this._geom.modeldata.attribs._attribs_maps.pg.get('material');
        // loop through all tris
        this._geom_maps.dn_tris_verts.forEach( (tri_verts_i, tri_i) => {
            // get the verts, face and the polygon for this tri
            const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
            // get the materials for this tri from the polygon
            const tri_face_i: number = this._geom_maps.up_tris_faces.get(tri_i);
            const tri_pgon_i: number = this._geom_maps.up_faces_pgons.get(tri_face_i);
            const tri_mat_indices: number[] = [];
            if (material_attrib !== undefined) {
                const mat_attrib_val: string|string[] = material_attrib.getEntVal(tri_pgon_i) as string|string[];
                const pgon_mat_names: string[] = (Array.isArray(mat_attrib_val)) ? mat_attrib_val : [mat_attrib_val];
                for (const pgon_mat_name of pgon_mat_names) {
                    let pgon_mat_index: number = material_names.indexOf(pgon_mat_name);
                    if (pgon_mat_index === -1) {
                        const mat_settings_obj: object = this._geom.modeldata.attribs._attribs_maps.mo.get(pgon_mat_name);
                        if (mat_settings_obj !== undefined) {
                            pgon_mat_index = materials.length;
                            material_names.push(pgon_mat_name);
                            materials.push(this._getMaterial(mat_settings_obj));
                        }
                    }
                    if (pgon_mat_index !== -1) {
                        tri_mat_indices.push(pgon_mat_index);
                    }
                }
            }
            if (tri_mat_indices.length === 0) {
                tri_mat_indices.push(0); // default material front
                tri_mat_indices.push(1); // default material back
            }
            // add the data to the data_array
            tri_data_arrs.push( [ tri_mat_indices, new_tri_verts_i, tri_i ] );
        });
        // sort that data_array, so that we get triangls sorted according to their materials
        // for each entry in the data_array, the first item is the material indices, so that they are sorted correctly
        tri_data_arrs.sort();
        // loop through the sorted array and create the tris and groups data for threejs
        const tris_verts_i: TTri[] = [];
        const tri_select_map: Map<number, number> = new Map();
        const mat_groups_map: Map<number, [number, number][]> = new Map(); // mat_index -> [start, end][]
        for (const tri_data_arr of tri_data_arrs) {
            // save the tri data
            const tjs_i = tris_verts_i.push(tri_data_arr[1]) - 1;
            tri_select_map.set(tjs_i, tri_data_arr[2]);
            // go through all materials for this tri and add save the mat groups data
            for (const mat_index of tri_data_arr[0]) {
                let start_end_arrs: [number, number][] = mat_groups_map.get(mat_index);
                if (start_end_arrs === undefined) {
                    start_end_arrs = [[tjs_i, tjs_i]];
                    mat_groups_map.set(mat_index, start_end_arrs);
                } else {
                    const start_end: [number, number] = start_end_arrs[start_end_arrs.length - 1];
                    if (tjs_i === start_end[1] + 1) {
                        start_end[1] = tjs_i;
                    } else {
                        start_end_arrs.push([tjs_i, tjs_i]);
                    }
                }
            }
        }
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups: [number, number, number][] = []; // [start, count, mat_index][]
        mat_groups_map.forEach( (start_end_arrs, mat_index) => {
            for (const start_end of start_end_arrs) {
                const start: number = start_end[0];
                const count: number = start_end[1] - start_end[0] + 1;
                material_groups.push( [ start * 3, count * 3, mat_index ] );
            }
        });
        // convert the verts list to a flat array
        // tslint:disable-next-line:no-unused-expression
        // @ts-ignore
        const tris_verts_i_flat: number[] = tris_verts_i.flat(1);
        // return the data
        // there are four sets of data that are returns
        return [
            tris_verts_i_flat, // 0) the vertices, as a flat array
            tri_select_map,    // 1) the select map, that maps from the threejs tri indices to the gi model tri indices
            materials,         // 2) the materials array, which is an array of objects
            material_groups    // 3) the material groups array, which is an array of [ start, count, mat_index ]
        ];

        // let gi_i = 0;
        // const l = this._geom_maps.dn_tris_verts.length;
        // for (; gi_i < l; gi_i++) {
        //     const tri_verts_i: TTri = this._geom_maps.dn_tris_verts.get(gi_i];
        //     if (tri_verts_i !== null) {
        //         const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
        //         const tjs_i = tris_verts_i_filt.push(new_tri_verts_i) - 1;
        //         tri_select_map.set(tjs_i, gi_i);
        //     }
        // }
        // @ts-ignore
        // return [tris_verts_i.flat(1), tri_select_map];
        // return this._geom_maps.dn_tris_verts.flat(1);
        // return [].concat(...this._geom_maps.dn_tris_verts);

    }
    // public get3jsTris(vertex_map: Map<number, number>): [number[], Map<number, number>, object[], [number, number, number][]] {
    //     const settings = JSON.parse(localStorage.getItem('mpm_settings'));
    //     // arrays to store threejs data
    //     const tri_data_arrs: [number[], TTri, number][] = []; // tri_mat_indices, new_tri_verts_i, tri_i
    //     const mat_f: object = {
    //         specular: 0x000000,
    //         emissive: 0x000000,
    //         shininess: 0,
    //         side: THREE.FrontSide,
    //         wireframe: settings.wireframe.show
    //     };
    //     const mat_b: object = {
    //         specular: 0x000000,
    //         emissive: 0x000000,
    //         shininess: 0,
    //         side: THREE.BackSide,
    //         wireframe: settings.wireframe.show
    //     };
    //     const materials: object[] = [this._getMaterial( mat_f ), this._getMaterial( mat_b )];
    //     const material_names:  string[] = ['default_front', 'default_back'];
    //     // get the material attribute from polygons
    //     const material_attrib: GIAttribMap = this._geom.modeldata.attribs._attribs_maps.pg.get('material');
    //     // loop through all tris
    //     let tri_i = 0; const tri_i_max = this._geom_maps.dn_tris_verts.length;
    //     for (; tri_i < tri_i_max; tri_i++) {
    //         const tri_verts_i: number[] = this._geom_maps.dn_tris_verts[tri_i];
    //         if (tri_verts_i !== null) {
    //             // get the verts, face and the polygon for this tri
    //             const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
    //             // get the materials for this tri from the polygon
    //             const tri_face_i: number = this._geom_maps.up_tris_faces[tri_i];
    //             const tri_pgon_i: number = this._geom_maps.up_faces_pgons[tri_face_i];
    //             const tri_mat_indices: number[] = [];
    //             if (material_attrib !== undefined) {
    //                 const mat_attrib_val: string|string[] = material_attrib.getEntVal(tri_pgon_i) as string|string[];
    //                 const pgon_mat_names: string[] = (Array.isArray(mat_attrib_val)) ? mat_attrib_val : [mat_attrib_val];
    //                 for (const pgon_mat_name of pgon_mat_names) {
    //                     let pgon_mat_index: number = material_names.indexOf(pgon_mat_name);
    //                     if (pgon_mat_index === -1) {
    //                         const mat_settings_obj: object = this._geom.modeldata.attribs._attribs_maps.mo.get(pgon_mat_name);
    //                         if (mat_settings_obj !== undefined) {
    //                             pgon_mat_index = materials.length;
    //                             material_names.push(pgon_mat_name);
    //                             materials.push(this._getMaterial(mat_settings_obj));
    //                         }
    //                     }
    //                     if (pgon_mat_index !== -1) {
    //                         tri_mat_indices.push(pgon_mat_index);
    //                     }
    //                 }
    //             }
    //             if (tri_mat_indices.length === 0) {
    //                 tri_mat_indices.push(0); // default material front
    //                 tri_mat_indices.push(1); // default material back
    //             }
    //             // add the data to the data_array
    //             tri_data_arrs.push( [ tri_mat_indices, new_tri_verts_i, tri_i ] );
    //         }
    //     }
    //     // sort that data_array, so that we get triangls sorted according to their materials
    //     // for each entry in the data_array, the first item is the material indices, so that they are sorted correctly
    //     tri_data_arrs.sort();
    //     // loop through the sorted array and create the tris and groups data for threejs
    //     const tris_verts_i: TTri[] = [];
    //     const tri_select_map: Map<number, number> = new Map();
    //     const mat_groups_map: Map<number, [number, number][]> = new Map(); // mat_index -> [start, end][]
    //     for (const tri_data_arr of tri_data_arrs) {
    //         // save the tri data
    //         const tjs_i = tris_verts_i.push(tri_data_arr[1]) - 1;
    //         tri_select_map.set(tjs_i, tri_data_arr[2]);
    //         // go through all materials for this tri and add save the mat groups data
    //         for (const mat_index of tri_data_arr[0]) {
    //             let start_end_arrs: [number, number][] = mat_groups_map.get(mat_index);
    //             if (start_end_arrs === undefined) {
    //                 start_end_arrs = [[tjs_i, tjs_i]];
    //                 mat_groups_map.set(mat_index, start_end_arrs);
    //             } else {
    //                 const start_end: [number, number] = start_end_arrs[start_end_arrs.length - 1];
    //                 if (tjs_i === start_end[1] + 1) {
    //                     start_end[1] = tjs_i;
    //                 } else {
    //                     start_end_arrs.push([tjs_i, tjs_i]);
    //                 }
    //             }
    //         }
    //     }
    //     // convert the mat_groups_map into the format required for threejs
    //     // for each material group, we need an array [start, count, mat_index]
    //     const material_groups: [number, number, number][] = []; // [start, count, mat_index][]
    //     mat_groups_map.forEach( (start_end_arrs, mat_index) => {
    //         for (const start_end of start_end_arrs) {
    //             const start: number = start_end[0];
    //             const count: number = start_end[1] - start_end[0] + 1;
    //             material_groups.push( [ start * 3, count * 3, mat_index ] );
    //         }
    //     });
    //     // convert the verts list to a flat array
    //     // tslint:disable-next-line:no-unused-expression
    //     // @ts-ignore
    //     const tris_verts_i_flat: number[] = tris_verts_i.flat(1);
    //     // return the data
    //     // there are four sets of data that are returns
    //     return [
    //         tris_verts_i_flat, // 0) the vertices, as a flat array
    //         tri_select_map,    // 1) the select map, that maps from the threejs tri indices to the gi model tri indices
    //         materials,         // 2) the materials array, which is an array of objects
    //         material_groups    // 3) the material groups array, which is an array of [ start, count, mat_index ]
    //     ];

    //     // let gi_i = 0;
    //     // const l = this._geom_maps.dn_tris_verts.length;
    //     // for (; gi_i < l; gi_i++) {
    //     //     const tri_verts_i: TTri = this._geom_maps.dn_tris_verts[gi_i];
    //     //     if (tri_verts_i !== null) {
    //     //         const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
    //     //         const tjs_i = tris_verts_i_filt.push(new_tri_verts_i) - 1;
    //     //         tri_select_map.set(tjs_i, gi_i);
    //     //     }
    //     // }
    //     // @ts-ignore
    //     // return [tris_verts_i.flat(1), tri_select_map];
    //     // return this._geom_maps.dn_tris_verts.flat(1);
    //     // return [].concat(...this._geom_maps.dn_tris_verts);
    // }
    public get3jsTriIndices(tri_list: number[], vertex_map: Map<number, number>): number[] {
        // loop through all tris
        const tris_verts_i: TTri[] = [];
        for (const tri_i of tri_list) {
            const tri_verts_i: number[] = this._geom_maps.dn_tris_verts[tri_i];
            if (tri_verts_i !== null) {
                const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
                tris_verts_i.push(new_tri_verts_i);
            }
        }
        // @ts-ignore
        const tris_verts_i_flat: number[] = tris_verts_i.flat(1);
        return tris_verts_i_flat;
    }
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsEdges(vertex_map: Map<number, number>): [number[], Map<number, number>, number[], Map<number, number>] {
        const edges_verts_i_filt: TEdge[] = [];
        const edge_select_map: Map<number, number> = new Map();
        const white_edges_verts_i_filt: TEdge[] = [];
        const white_edge_select_map: Map<number, number> = new Map();
        const visibility_attrib = this._geom.modeldata.attribs._attribs_maps._e.get('visibility');
        let hidden_attrib;
        if (visibility_attrib) {
            hidden_attrib = visibility_attrib.getEntsFromVal('hidden');
        }
        const edge_attrib = this._geom.modeldata.attribs._attribs_maps._e.get('material');
        let edge_material_attrib;
        if (edge_attrib) {
            edge_material_attrib = edge_attrib.getEntsFromVal('white');
        }
        this._geom_maps.dn_edges_verts.forEach( (edge_verts_i, edge_i) => {
            const hidden = hidden_attrib && hidden_attrib.indexOf(edge_i) !== -1;
            if (!hidden) {
                let color_check;
                if (edge_material_attrib) {
                    color_check = edge_material_attrib.indexOf(edge_i) !== -1;
                }
                const new_edge_verts_i: TEdge = edge_verts_i.map(e => vertex_map.get(e)) as TEdge;
                if (color_check) {
                    const tjs_i = white_edges_verts_i_filt.push(new_edge_verts_i) - 1;
                    white_edge_select_map.set(tjs_i, edge_i);
                } else {
                    const tjs_i = edges_verts_i_filt.push(new_edge_verts_i) - 1;
                    edge_select_map.set(tjs_i, edge_i);
                }
            }
        });
        // @ts-ignore
        return [edges_verts_i_filt.flat(1), edge_select_map, white_edges_verts_i_filt.flat(1), white_edge_select_map];

        // @ts-ignore
        // return this._geom_maps.dn_edges_verts.flat(1);
        // return [].concat(...this._geom_maps.dn_edges_verts);
    }
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    public get3jsPlines(vertex_map: Map<number, number>): [number[], Map<number, number>] {
        const edges_verts_i_filt: TEdge[] = [];
        const edge_select_map: Map<number, number> = new Map();
        this._geom_maps.dn_plines_wires.forEach( (wire_i, pline_i) => {
            const edges_i: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
            for (const edge_i of edges_i) {
                const edge_verts_i: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
                const new_edge_verts_i: TEdge = edge_verts_i.map(e => vertex_map.get(e)) as TEdge;
                const tjs_i = edges_verts_i_filt.push(new_edge_verts_i) - 1;
                edge_select_map.set(tjs_i, pline_i);
            }
        });
        // @ts-ignore
        return [edges_verts_i_filt.flat(1), edge_select_map];
    }


    public get3jsEdgeIndices(edge_list: number[], vertex_map: Map<number, number>): [number[], number[]] {
        const edges_verts_i_filt: TEdge[] = [];
        const white_edges_verts_i_filt: TEdge[] = [];
        const visibility_attrib = this._geom.modeldata.attribs._attribs_maps._e.get('visibility');
        let hidden_attrib;
        if (visibility_attrib) {
            hidden_attrib = visibility_attrib.getEntsFromVal('hidden');
        }
        const edge_attrib = this._geom.modeldata.attribs._attribs_maps._e.get('material');
        let edge_material_attrib;
        if (edge_attrib) {
            edge_material_attrib = edge_attrib.getEntsFromVal('white');
        }
        for (const gi_i of edge_list) {
            if (hidden_attrib && hidden_attrib.indexOf(gi_i) !== -1) { continue; }
            const edge_verts_i: TEdge = this._geom_maps.dn_edges_verts[gi_i];
            let color_check;
            if (edge_material_attrib) {
                color_check = edge_material_attrib.indexOf(gi_i) !== -1;
            }
            if (edge_verts_i !== null) {
                const new_edge_verts_i: TEdge = edge_verts_i.map(e => vertex_map.get(e)) as TEdge;
                if (color_check) {
                    white_edges_verts_i_filt.push(new_edge_verts_i);
                } else {
                    edges_verts_i_filt.push(new_edge_verts_i);
                }
            }
        }
        // @ts-ignore
        return [edges_verts_i_filt.flat(1), white_edges_verts_i_filt.flat(1)];

        // @ts-ignore
        // return this._geom_maps.dn_edges_verts.flat(1);
        // return [].concat(...this._geom_maps.dn_edges_verts);
    }

    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    public get3jsPoints(vertex_map: Map<number, number>): [number[], Map<number, number>] {
        const points_verts_i_filt: TPoint[] = [];
        const point_select_map: Map<number, number> = new Map();
        this._geom_maps.dn_points_verts.forEach( (vert_i, point_i) => {
            const new_point_verts_i: TPoint = vertex_map.get(vert_i) as TPoint;
            const tjs_i = points_verts_i_filt.push(new_point_verts_i) - 1;
            point_select_map.set(tjs_i, point_i);
        });
        return [points_verts_i_filt, point_select_map];
    }

    public get3jsPointIndices(pt_list: number[], vertex_map: Map<number, number>): number[] {
        const points_verts_i_filt: TPoint[] = [];
        for (const gi_i of pt_list) {
            const point_verts_i: TPoint = this._geom_maps.dn_points_verts[gi_i];
            // const point_verts_i: TPoint = this._geom_maps.dn_points_verts[gi_i];
            if (point_verts_i !== null) {
                const new_point_verts_i: TPoint = vertex_map.get(point_verts_i) as TPoint;
                points_verts_i_filt.push(new_point_verts_i);
            }
        }
        return points_verts_i_filt;
    }

    /**
     * Create a threejs material
     * @param settings
     */
    private _getMaterial(settings?: object) {
        const material =  {
            type: 'MeshPhongMaterial',
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors
        };
        if (settings) {
            for (const key of Object.keys(settings)) {
                material[key] = settings[key];
            }
        }
        return material;
    }
}
