import { VERSION } from '@env/version';

export interface CesiumSettings {
    normals: { show: boolean, size: number };
    axes: { show: boolean, size: number };
    grid: { show: boolean, size: number };
    positions: { show: boolean, size: number };
    wireframe: { show: boolean };
    version: string;
}

export const Locale = [{
    name: 'Singapore',
    zone: 'Asia/Singapore',
    lat: '1.35',
    long: '103.8'
}];
