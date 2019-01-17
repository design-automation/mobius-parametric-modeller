export interface IThreeJS {
    positions: number[];
    normals: number[];
    colors: number[];
    point_indices: number[];
    point_select_map: Map<number, number>;
    edge_indices: number[];
    edge_select_map: Map<number, number>;
    triangle_indices: number[];
    triangle_select_map: Map<number, number>;
}
