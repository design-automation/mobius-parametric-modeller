import { VERSION } from '@env/version';

export interface CesiumSettings {
    cesium: {
        ion: string,
        assetid: string,
        save: boolean
    };
}

export const cesium_default_settings: CesiumSettings = {
    'cesium': {
        'ion': '',
        'assetid': '',
        'save': true
    }
};

export const Locale = [{
    name: 'Singapore',
    zone: 'Asia/Singapore',
    lat: '1.35',
    long: '103.8'
}];
