import * as three from 'three';
import { Vector3, Triangle } from 'three';
type Txyz = [number, number, number];
const EPS = 1e-6;

export function normal(v1: Txyz, v2: Txyz, v3: Txyz, norm: boolean = false): Txyz {
    const _v1: three.Vector3 = new Vector3(...v1);
    const _v2: three.Vector3 = new Vector3(...v2);
    const _v3: three.Vector3 = new Vector3(...v3);
    const t: three.Triangle = new Triangle(_v1, _v2, _v3);
    const _normal: three.Vector3 = new Vector3();
    t.getNormal(_normal);
    if (norm) {
        _normal.normalize();
    }
    return _normal.toArray() as Txyz;
}

export function area(v1: Txyz, v2: Txyz, v3: Txyz): number {
    const _v1: three.Vector3 = new Vector3(...v1);
    const _v2: three.Vector3 = new Vector3(...v2);
    const _v3: three.Vector3 = new Vector3(...v3);
    const t: three.Triangle = new Triangle(_v1, _v2, _v3);
    return t.getArea();
}
