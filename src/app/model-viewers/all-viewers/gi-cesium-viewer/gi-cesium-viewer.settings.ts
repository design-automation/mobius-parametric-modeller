import { VERSION } from '@env/version';

export interface CesiumSettings {
    imagery: {
        layer: string;
        terrain: string;
        apiKey: any;
    };
    camera: {
        pos: {x: number, y: number, z: number};
        direction: {x: number, y: number, z: number};
        up: {x: number, y: number, z: number};
        right: {x: number, y: number, z: number};
    };
    time: {
        date: string;
    };
    model: {
        polygonEdge: boolean;
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
        'terrain': 'Ellipsoid',
        'apiKey': {
            'here': '7vMRjLNCpcOAUQXU61eUp6EFbWCy7WLNmy9qLHO-1Bw'
        }
    },
    'camera': {
        'pos': {'x': 0, 'y': 0, 'z': 0},
        'direction': {'x': 0, 'y': 0, 'z': 0},
        'up': {'x': 0, 'y': 0, 'z': 0},
        'right': {'x': 0, 'y': 0, 'z': 0}
    },
    'time': {
        'date': (new Date()).toISOString().split(':').slice(0, 2).join(':'),
    },
    'model': {
        'polygonEdge': false
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
