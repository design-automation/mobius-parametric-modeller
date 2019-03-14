import * as mathjs from 'mathjs';
import { vecAdd, vecCross, vecLen } from './vectors';

type Txyz = [number, number, number];
type TRay = [Txyz, Txyz];
type TPlane = [Txyz, Txyz, Txyz];

export function intersect(r1: TRay, r2: TRay|TPlane): number {
    if (r2.length === 2) {
        return mathjs.intersect(r1[0], vecAdd(r1[0], r1[1]), r2[0], vecAdd(r2[0], r2[1]) );
    } else if (r2.length === 3) {
        const [a, b, c]: Txyz = vecCross(r2[1], r2[2]);
        const [x1, y1, z1]: Txyz = r2[0];
        const d: number = a * x1 + b * y1 + c * z1;
        return mathjs.intersect(r1[0], vecAdd(r1[0], r1[1]), [a, b, c, d] );
    } else {
        throw new Error('Error calculating intersection. Elements must be either rays or planes.');
    }
}
