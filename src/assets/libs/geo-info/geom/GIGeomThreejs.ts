import { IGeomMaps, TTri, TEdge, TPoint, EEntType, TEntTypeIdx } from '../common';
import * as THREE from 'three';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIModelData } from '../GIModelData';

/**
 * Class for geometry.
 */
export class GIGeomThreejs {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Returns that data required for threejs triangles.
     * Arguments:
     * 1) ssid: the ssid to return data for
     * 2) vertex_map: a map that maps from gi vertex indicies to threejs vertex indicies
     * Returns:
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs tri indices to the gi model tri indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    public get3jsTris(ssid: number, vertex_map: Map<number, number>): [number[], Map<number, number>, object[], [number, number, number][]] {

        // TODO this should not be parsed each time
        let settings = JSON.parse(localStorage.getItem('mpm_settings'));
        if (!settings) {
            settings = {
                'wireframe': {
                    'show': false
                }
            };
        }

        // arrays to store threejs data
        const tri_data_arrs: [number[], TTri, number][] = []; // tri_mat_indices, new_tri_verts_i, tri_i
        // materials
        const mat_front: object = {
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 0,
            side: THREE.FrontSide,
            wireframe: settings.wireframe.show
        };
        const mat_back: object = {
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 0,
            side: THREE.BackSide,
            wireframe: settings.wireframe.show
        };
        const materials: object[] = [this._getPgonMaterial( mat_front ), this._getPgonMaterial( mat_back )];
        const material_names:  string[] = ['default_front', 'default_back'];
        // get the material attribute from polygons
        const pgon_material_attrib: GIAttribMapBase = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('material');
        // loop through all tris
        // get ents from snapshot
        const tris_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.TRI);
        for (const tri_i of tris_i) {
            const tri_verts_i: number[] = this._geom_maps.dn_tris_verts.get(tri_i);
            // get the verts, face and the polygon for this tri
            const new_tri_verts_i: TTri = tri_verts_i.map(v => vertex_map.get(v)) as TTri;
            // get the materials for this tri from the polygon
            const tri_pgon_i: number = this._geom_maps.up_tris_pgons.get(tri_i);
            const tri_mat_indices: number[] = [];
            if (pgon_material_attrib !== undefined) {
                const mat_attrib_val: string|string[] = pgon_material_attrib.getEntVal(tri_pgon_i) as string|string[];
                if (mat_attrib_val !== undefined) {
                    const pgon_mat_names: string[] = (Array.isArray(mat_attrib_val)) ? mat_attrib_val : [mat_attrib_val];
                    for (const pgon_mat_name of pgon_mat_names) {
                        let pgon_mat_index: number = material_names.indexOf(pgon_mat_name);
                        if (pgon_mat_index === -1) {
                            const mat_settings_obj: object = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(pgon_mat_name);
                            if (mat_settings_obj !== undefined) {
                                pgon_mat_index = materials.length;
                                material_names.push(pgon_mat_name);
                                materials.push(this._getPgonMaterial(mat_settings_obj));
                            } else {
                                throw new Error('Material not found: ' + pgon_mat_name);
                            }
                        }
                        if (pgon_mat_index !== -1) {
                            tri_mat_indices.push(pgon_mat_index);
                        }
                    }
                }
            }
            if (tri_mat_indices.length === 0) {
                tri_mat_indices.push(0); // default material front
                tri_mat_indices.push(1); // default material back
            }
            // add the data to the data_array
            tri_data_arrs.push( [ tri_mat_indices, new_tri_verts_i, tri_i ] );
        }
        // sort that data_array, so that we get triangls sorted according to their materials
        // for each entry in the data_array, the first item is the material indices, so that they are sorted correctly
        if (pgon_material_attrib !== undefined) {
            tri_data_arrs.sort();
        }
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
        const material_groups: [number, number, number][] = this._convertMatGroups(mat_groups_map, 3);
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
    }
    /**
     * Returns that data required for threejs edges.
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs edge indices to the gi model edge indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    public get3jsEdges(ssid: number, vertex_map: Map<number, number>): [number[], Map<number, number>, object[], [number, number, number][]] {
        // arrays to store threejs data
        const edge_data_arrs: [number, TEdge, number][] = []; // edge_mat_indices, new_edge_verts_i, edge_i
        // materials
        const line_mat_black: object = {
            color: 0x000000,
            linewidth: 1
        };
        const line_mat_white: object = {
            color: 0xffffff,
            linewidth: 1
        };
        const materials: object[] = [this._getPlineMaterial( line_mat_black ), this._getPlineMaterial( line_mat_white )];
        const material_names:  string[] = ['black', 'white'];
        // check the hidden edges
        const visibility_attrib = this.modeldata.attribs.attribs_maps.get(ssid)._e.get('visibility');
        let hidden_edges_set: Set<number>;
        if (visibility_attrib) {
            hidden_edges_set = new Set(visibility_attrib.getEntsFromVal('hidden'));
        }
        // get the edge material attrib
        const pline_material_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pl.get('material');
        // loop through all edges
        // get ents from snapshot
        const edges_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.EDGE);
        for (const edge_i of edges_i) {
            const edge_verts_i: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
            // check hidden
            const hidden: boolean = visibility_attrib && hidden_edges_set.has(edge_i);
            if (!hidden) {
                // get the verts, face and the polygon for this tri
                const new_edge_verts_i: TEdge = edge_verts_i.map(v => vertex_map.get(v)) as TEdge;
                // get the materials for this tri from the polygon
                const edge_wire_i: number = this._geom_maps.up_edges_wires.get(edge_i);
                const edge_pline_i: number = this._geom_maps.up_wires_plines.get(edge_wire_i);
                let pline_mat_index = 0; // default black line
                if (pline_material_attrib !== undefined) {
                    const pline_mat_name: string = pline_material_attrib.getEntVal(edge_pline_i) as string;
                    // check if the polyline has a material?
                    if (pline_mat_name !== undefined) {
                        pline_mat_index = material_names.indexOf(pline_mat_name);
                        // add material
                        if (pline_mat_index === -1) {
                            const mat_settings_obj: object = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(pline_mat_name);
                            if (mat_settings_obj !== undefined) {
                                pline_mat_index = material_names.push(pline_mat_name) - 1;
                                materials.push(this._getPlineMaterial(mat_settings_obj));
                            } else {
                                throw new Error('Material not found: ' + pline_mat_name);
                            }
                        }
                    }
                }
                // add the data to the data_array
                edge_data_arrs.push( [ pline_mat_index, new_edge_verts_i, edge_i ] );
            }
        }
        // sort that data_array, so that we get edges sorted according to their materials
        // for each entry in the data_array, the first item is the material indices, so that they are sorted correctly
        if (pline_material_attrib !== undefined) {
            edge_data_arrs.sort();
        }
        // loop through the sorted array and create the edge and groups data for threejs
        const edges_verts_i: TEdge[] = [];
        const edge_select_map: Map<number, number> = new Map();
        const mat_groups_map: Map<number, [number, number][]> = new Map(); // mat_index -> [start, end][]
        for (const edge_data_arr of edge_data_arrs) {
            // save the tri data
            const tjs_i = edges_verts_i.push(edge_data_arr[1]) - 1;
            edge_select_map.set(tjs_i, edge_data_arr[2]);
            // get the edge material and add save the mat groups data
            const mat_index = edge_data_arr[0];
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
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups: [number, number, number][] = this._convertMatGroups(mat_groups_map, 2);
        // convert the verts list to a flat array
        // tslint:disable-next-line:no-unused-expression
        // @ts-ignore
        const edges_verts_i_flat: number[] = edges_verts_i.flat(1);
        // return the data
        // there are four sets of data that are returns
        return [
            edges_verts_i_flat, // 0) the vertices, as a flat array
            edge_select_map,    // 1) the select map, that maps from the threejs tri indices to the gi model tri indices
            materials,          // 2) the materials array, which is an array of objects
            material_groups     // 3) the material groups array, which is an array of [ start, count, mat_index ]
        ];
    }
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    public get3jsPoints(ssid: number, vertex_map: Map<number, number>): [number[], Map<number, number>] {
        const points_verts_i_filt: TPoint[] = [];
        const point_select_map: Map<number, number> = new Map();
        // get ents from snapshot
        const points_i: number[] = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.POINT);
        for (const point_i of points_i) {
            const vert_i: number = this._geom_maps.dn_points_verts.get(point_i);
            const new_point_verts_i: TPoint = vertex_map.get(vert_i) as TPoint;
            const tjs_i = points_verts_i_filt.push(new_point_verts_i) - 1;
            point_select_map.set(tjs_i, point_i);
        }
        return [points_verts_i_filt, point_select_map];
    }
    /**
     * Create a threejs material
     * @param settings
     */
    private _convertMatGroups(mat_groups_map: Map<number, [number, number][]>, num_verts: number): [number, number, number][] {
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups: [number, number, number][] = []; // [start, count, mat_index][]
        mat_groups_map.forEach( (start_end_arrs, mat_index) => {
            for (const start_end of start_end_arrs) {
                const start: number = start_end[0];
                const count: number = start_end[1] - start_end[0] + 1;
                material_groups.push( [ start * num_verts, count * num_verts, mat_index ] );
            }
        });
        return material_groups;
    }
    /**
     * Create a threejs material
     * @param settings
     */
    private _getPgonMaterial(settings?: object): object {
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
        /**
     * Create a threejs material
     * @param settings
     */
    private _getPlineMaterial(settings?: object): object {
        const material =  {
            type: 'LineBasicMaterial'
        };
        if (settings) {
            for (const key of Object.keys(settings)) {
                material[key] = settings[key];
            }
        }
        return material;
    }
}
