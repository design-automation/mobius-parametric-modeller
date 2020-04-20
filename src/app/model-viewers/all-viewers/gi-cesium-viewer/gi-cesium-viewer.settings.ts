import { VERSION } from '@env/version';

export interface CesiumSettings {
    imagery: {
        layer: string;
        terrain: string;
    };
    camera: {
        pos: {x: number, y: number, z: number};
        direction: {x: number, y: number, z: number};
        up: {x: number, y: number, z: number};
        right: {x: number, y: number, z: number};
    };
    cesium: {
        ion: string;
        assetid: string;
        save: boolean
    };
    updated: boolean;
}

export const cesium_default_settings: CesiumSettings = {
    'imagery': {
        'layer': 'Open Street Map',
        'terrain': 'Ellipsoid'
    },
    'camera': {
        'pos': {'x': 0, 'y': 0, 'z': 0},
        'direction': {'x': 0, 'y': 0, 'z': 0},
        'up': {'x': 0, 'y': 0, 'z': 0},
        'right': {'x': 0, 'y': 0, 'z': 0}
    },
    'cesium': {
        'ion': '',
        'assetid': '',
        'save': true
    },
    'updated': false
};

export const Locale = [{
    name: 'Singapore',
    zone: 'Asia/Singapore',
    lat: '1.35',
    long: '103.8'
}];
