import { VERSION } from '@env/version';
import { Vector3 } from 'three';
export const DefaultSettings = {
    normals: { show: false, size: 5 },
    axes: { show: true, size: 50 },
    grid: {
        show: true,
        size: 500,
        pos_x: 0,
        pos_y: 0,
        pos_z: 0,
        pos: new Vector3(0, 0, 0)
    },
    background: {
        show: false,
        background_set: 0
    },
    positions: { show: true, size: 0.5 },
    tjs_summary: { show: false },
    gi_summary: { show: false },
    wireframe: { show: false },
    camera: {
        pos: new Vector3(-80, -80, 80),
        target: new Vector3(0, 0, 0),
        ortho: false
    },
    colors: {
        viewer_bg: '#E6E6E6',
        position: '#000000',
        position_s: '#0033FF',
        vertex_s: '#FFCC00',
        face_f: '#FFFFFF',
        face_f_s: '#4949BD',
        face_b: '#DDDDDD',
        face_b_s: '#00006D'
    },
    ambient_light: {
        show: true,
        color: '#FFFFFF',
        intensity: 0.5
    },
    hemisphere_light: {
        show: true,
        helper: false,
        skyColor: '#FFFFFF',
        groundColor: '#FFFFFF',
        intensity: 0.5
    },
    directional_light: {
        show: false,
        helper: false,
        color: '#FFFFFF',
        intensity: 1,
        shadow: true,
        azimuth: 90,
        altitude: 45,
        distance: 10,
        type: 'directional',
        shadowSize: 2048
    },
    ground: {
        show: false,
        width: 1000,
        length: 1000,
        height: -0.5,
        color: '#FFFFFF',
        shininess: 0
    },
    select: {
        selector: {id: 5, name: 'Faces'},
        tab: 0,
        enabledselector: {
            ps: true,
            _v: true,
            _e: true,
            _w: true,
            _f: true,
            pt: true,
            pl: true,
            pg: true,
            co: true
        }
    },
    version: VERSION.version
};


export const SettingsColorMap = [{
    label: 'Viewer Background',
    setting: 'viewer_bg',
    default: '#E6E6E6'
}, {
    label: 'Position',
    setting: 'position'
}, {
    label: 'Position Selected',
    setting: 'position_s'
}, {
    label: 'Face Front',
    setting: 'face_f'
}, {
    label: 'Face Front Selected',
    setting: 'face_f_s'
}, {
    label: 'Face Back',
    setting: 'face_b'
}, {
    label: 'Face Back Selected',
    setting: 'face_b_s'
}, {
    label: 'Vertices Selected',
    setting: 'vertex_s'
}];

export const Locale = [{
    name: 'Singapore',
    zone: 'Asia/Singapore',
    lat: '1.35',
    long: '103.8'
}];
