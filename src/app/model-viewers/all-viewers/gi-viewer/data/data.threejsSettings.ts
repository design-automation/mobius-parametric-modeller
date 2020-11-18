/**
 *
 */
export interface ISettings {
    normals: { show: boolean, size: number };
    axes: { show: boolean, size: number };
    grid: {
        show: boolean,
        size: number,
        pos: THREE.Vector3,
        pos_x: number,
        pos_y: number,
        pos_z: number,
    };
    background: {
        show: boolean,
        background_set: number
    };
    positions: { show: boolean, size: number };
    tjs_summary: { show: boolean };
    gi_summary: { show: boolean };
    wireframe: { show: boolean };
    camera: {
        pos: THREE.Vector3,
        target: THREE.Vector3,
        ortho: boolean
    };
    colors: {
        viewer_bg: string,
        position: string,
        position_s: string,
        vertex_s: string,
        face_f: string,
        face_f_s: string,
        face_b: string,
        face_b_s: string
    };
    ambient_light: {
        show: boolean,
        color: string,
        intensity: number
    };
    hemisphere_light: {
        show: boolean,
        helper: boolean,
        skyColor: string,
        groundColor: string,
        intensity: number
    };
    directional_light: {
        show: boolean,
        helper: boolean,
        color: string,
        intensity: number,
        shadow: boolean,
        azimuth: number,
        altitude: number,
        distance: number,
        type: string,
        shadowSize: number
    };
    ground: {
        show: boolean,
        width: number,
        length: number,
        height: number,
        color: string,
        shininess: number
    };
    select: {
        selector: object,
        tab: number,
        enabledselector: {
            ps: boolean,
            _v: boolean,
            _e: boolean,
            _w: boolean,
            _f: boolean,
            pt: boolean,
            pl: boolean,
            pg: boolean,
            co: boolean
        }
    };
    version: string;
}
