import { VERSION } from '@env/version';

export interface GeoSettings {
    imagery: {
        layer: string;
        terrain: string;
    };
    camera: {
        pos: {x: number, y: number, z: number};
        rot: {x: number, y: number, z: number};
    };
    time: {
        date: string;
    };
    model: {
        polygonEdge: boolean;
    };
    updated: boolean;
}

export const geo_default_settings: GeoSettings = {
    'imagery': {
        'layer': 'Open Street Map',
        'terrain': 'Ellipsoid'
    },
    'camera': {
        'pos': {'x': 0, 'y': 0, 'z': 0},
        'rot': {'x': 0, 'y': 0, 'z': 0}
    },
    'time': {
        'date': (new Date()).toISOString().split(':').slice(0, 2).join(':'),
    },
    'model': {
        'polygonEdge': false
    },
    'updated': false
};

export const Locale = [{
    name: 'Singapore',
    zone: 'Asia/Singapore',
    lat: '1.35',
    long: '103.8'
}];
