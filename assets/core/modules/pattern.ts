/**
 * The `pattern` module has functions for creating patters of positions in the model.
 * All these functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 */

/**
 *
 */

 import { checkCommTypes } from './_check_args';
import { Txyz, TPlane, XYPLANE, TId, EEntType } from '@libs/geo-info/common';
import { getArrDepth, idsMakeFromIndicies } from '@libs/geo-info/id';
import { vecAdd } from '@libs/geom/vectors';
import { xfromSourceTargetMatrix, multMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
import { __merge__ } from './_model';
import { GIModel } from '@libs/geo-info/GIModel';
// ================================================================================================
/**
 * Creates positions in an arc pattern, and returns the list of new positions.
 * If the angle of the arc is set to null, then circular patterns will be created.
 * For circular patterns, duplicates at start and end are automatically removed.
 *
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param radius Radius of circle as a number.
 * @param num_positions Number of positions distributed equally along the arc.
 * @param arc_angle Angle of arc (in radians).
 * @returns A list of positions.
 * @example coordinates1 = pattern.Arc([0,0,0], 10, 12, PI)
 * @example_info Creates a list of 12 XYZ coordinates distributed equally along a semicircle of radius 10.
 */
export function Arc(__model__: GIModel, origin: Txyz|TPlane, radius: number, num_positions: number, arc_angle: number): TId[] {
    // --- Error Check ---
    const fn_name = 'pattern.Arc';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'radius', radius, ['isNumber']);
    checkCommTypes(fn_name, 'num_positions', num_positions, ['isInt']);
    checkCommTypes(fn_name, 'arc_angle', arc_angle, ['isNumber', 'isNull']);
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as  TPlane);
    }
    // calc the rot angle per position
    const rot: number = (arc_angle === null) ? (2 * Math.PI) / num_positions : arc_angle / (num_positions - 1);
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const angle: number = rot * i; // CCW
        const x: number = (Math.cos(angle) * radius);
        const y: number = (Math.sin(angle) * radius);
        let xyz: Txyz = [x, y, 0];
        if (origin_is_plane) {
            xyz = multMatrix(xyz, matrix);
        } else { // we have a plane
            xyz = vecAdd(xyz, origin as Txyz);
        }
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
export enum _EGridMethod {
    FLAT = 'flat',
    COLUMNS = 'columns',
    ROWS = 'rows',
    SQUARES = 'squares'
}
/**
* Creates positions in a grid pattern, and returns the list (or list of lists) of new positions.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.
* @param num_positions Number of positions.
* @param method Enum, define the way the coords will be return as lists.
* If integer, same number for x and y; if list of two numbers, number for x and y respectively.
* @returns A list of positions, or a list of lists of positions (depending on the 'method' setting).
* @example coordinates1 = pattern.Grid([0,0,0], 10, 3)
* @example_info Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.
* @example coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])
* @example_info Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
*/
export function Grid(__model__: GIModel, origin: Txyz|TPlane, size: number|[number, number],
        num_positions: number|[number, number], method: _EGridMethod): TId[]|TId[][] {
    // --- Error Check ---
    const fn_name = 'pattern.Grid';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    checkCommTypes(fn_name, 'num_positions', num_positions, ['isInt', 'isXYlistInt']);
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as  TPlane);
    }
    // create the positions
    const posis_i: number[] = [];
    const xy_size: [number, number] = (Array.isArray(size) ? size : [size, size]) as [number, number];
    const xy_num_positions: [number, number] =
        (Array.isArray(num_positions) ? num_positions : [num_positions, num_positions]) as [number, number];
    const x_offset: number = xy_size[0] / (xy_num_positions[0] - 1);
    const y_offset: number = xy_size[1] / (xy_num_positions[1] - 1);
    for (let i = 0; i < xy_num_positions[1]; i++) {
        const y: number = (i * y_offset) - (xy_size[1] / 2);
        for (let j = 0; j < xy_num_positions[0]; j++) {
            const x: number = (j * x_offset) - (xy_size[0] / 2);
            let xyz: Txyz = [x, y, 0];
            if (origin_is_plane) {
                xyz = multMatrix(xyz, matrix);
            } else { // we have a plane
                xyz = vecAdd(xyz, origin as Txyz);
            }
            const posi_i: number = __model__.geom.add.addPosi();
            __model__.attribs.add.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
    }
    // structure the grid of posis, and return
    const posis_i2: number[][] = [];
    if (method === _EGridMethod.FLAT) {
        return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
    } else if (method === _EGridMethod.ROWS) {
        for (let i = 0; i < xy_num_positions[1]; i++) {
            const row: number[] = [];
            for (let j = 0; j < xy_num_positions[0]; j++) {
                const index: number = (i * xy_num_positions[0]) + j;
                row.push( posis_i[index] );
            }
            posis_i2.push(row);
        }
    } else if (method === _EGridMethod.COLUMNS) {
        for (let i = 0; i < xy_num_positions[0]; i++) {
            const col: number[] = [];
            for (let j = 0; j < xy_num_positions[1]; j++) {
                const index: number = (j * xy_num_positions[0]) + i;
                col.push( posis_i[index] );
            }
            posis_i2.push(col);
        }
    } else if (method === _EGridMethod.SQUARES) {
        for (let i = 0; i < xy_num_positions[1] - 1; i++) {
            for (let j = 0; j < xy_num_positions[0] - 1; j++) {
                const index: number = (i * xy_num_positions[0]) + j;
                const square: number[] = [
                    posis_i[index],
                    posis_i[index + 1],
                    posis_i[index + xy_num_positions[0] + 1],
                    posis_i[index + xy_num_positions[0]]
                ];
                posis_i2.push( square );
            }
        }
    }
    return idsMakeFromIndicies(EEntType.POSI, posis_i2) as TId[][];
}
// ================================================================================================
/**
 * Creates four positions in a rectangle pattern, and returns the list of new positions.
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param size Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.
 * @returns A list of four positions.
 * @example coordinates1 = pattern.Rectangle([0,0,0], 10)
 * @example_info Creates a list of 4 coords, being the vertices of a 10 by 10 square.
 * @example coordinates1 = pattern.Rectangle([0,0,0], [10,20])
 * @example_info Creates a list of 4 coords, being the vertices of a 10 by 20 rectangle.
 */
export function Rectangle(__model__: GIModel, origin: Txyz|TPlane, size: number|[number, number]): TId[] {
    // --- Error Check ---
    const fn_name = 'pattern.Rectangle';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as  TPlane);
    }
    // create the positions
    const posis_i: number[] = [];
    const xy_size: [number, number] = (Array.isArray(size) ? size : [size, size]) as [number, number];
    const coords: Txyz[] = [
        [-(xy_size[0] / 2), -(xy_size[1] / 2), 0],
        [ (xy_size[0] / 2), -(xy_size[1] / 2), 0],
        [ (xy_size[0] / 2),  (xy_size[1] / 2), 0],
        [-(xy_size[0] / 2),  (xy_size[1] / 2), 0]
    ];
    for (const coord of coords) {
        let xyz: Txyz = coord;
        if (origin_is_plane) {
            xyz = multMatrix(xyz, matrix);
        } else { // we have a plane
            xyz = vecAdd(xyz, origin as Txyz);
        }
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
