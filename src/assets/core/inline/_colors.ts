import * as ch from 'chroma-js';
import { TColor } from '@libs/geo-info/common';

const false_col  = ch.scale(['blue', 'cyan', 'green', 'yellow', 'red']);

export function colFalse(val: number, min: number, max: number): TColor {
    const col_scale  = false_col.domain([min, max]);
    const col = col_scale(val).gl();
    return [col[0], col[1], col[2]];
}
