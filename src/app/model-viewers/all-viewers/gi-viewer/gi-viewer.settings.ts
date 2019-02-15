import { VERSION } from '@env/version';
export const DefaultSettings = {
    normals: { show: false, size: 5 },
    axes: { show: true, size: 50 },
    grid: { show: true, size: 500 },
    positions: { show: true, size: 0.5 },
    tjs_summary: { show: false },
    wireframe: { show: false },
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
        shadowSize: 4,
        azimuth: 90,
        altitude: 45,
        distance: 10000
    },
    ground: {
        show: false,
        width: 1000,
        length: 1000,
        height: -0.5,
        color: '#FFFFFF',
        shininess: 0
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
