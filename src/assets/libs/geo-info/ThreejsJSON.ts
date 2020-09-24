export interface IThreeJS {
    posis_xyz: number[];
    posis_indices: number[];
    posis_map: Map<number, number>;
    verts_xyz: number[];
    verts_map: Map<number, number>;
    normals: number[];
    colors: number[];
    point_indices: number[];
    point_select_map: Map<number, number>;
    edge_indices: number[];
    edge_select_map: Map<number, number>;
    white_edge_indices: number[]; // TODO remove
    white_edge_select_map: Map<number, number>; // TODO remove
    tri_indices: number[];
    tri_select_map: Map<number, number>;
    pline_materials: object[];
    pline_material_groups: [number, number, number][];
    pgon_materials: object[];
    pgon_material_groups: [number, number, number][];
}

