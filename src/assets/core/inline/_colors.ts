import * as ch from 'chroma-js';
import { TColor } from '@libs/geo-info/common';

const false_col  = ch.scale(['blue', 'cyan', 'green', 'yellow', 'red']);

export function colFalse(vals: number|number[], min: number, max: number): TColor|TColor[] {
    const col_domain  = false_col.domain([min, max]);
    if (!Array.isArray(vals)) {
        const col = col_domain(vals).gl();
        return [col[0], col[1], col[2]];
    } else {
        const cols: TColor[] = [];
        for (const val of vals) {
            const col = col_domain(val).gl();
            cols.push( [col[0], col[1], col[2]] );
        }
        return cols;
    }
}

export function colScale(vals: number|number[], min: number, max: number, scale: any): TColor|TColor[] {
    const col_scale  = ch.scale(scale);
    const col_domain  = col_scale.domain([min, max]);
    if (!Array.isArray(vals)) {
        const col = col_domain(vals).gl();
        return [col[0], col[1], col[2]];
    } else {
        const cols: TColor[] = [];
        for (const val of vals) {
            const col = col_domain(val).gl();
            cols.push( [col[0], col[1], col[2]] );
        }
        return cols;
    }
}
