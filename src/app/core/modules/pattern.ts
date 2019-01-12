import { checkCommTypes, checkIDs, checkIDnTypes } from './_check_args';
import { Txyz, TPlane, TRay, XYPLANE } from '@libs/geo-info/common';
import { getArrDepth } from '@libs/geo-info/id';
import { vecAdd } from '@libs/geom/vectors';
import { xfromSourceTargetMatrix, multMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
// ================================================================================================
/**
* Creates a list of XYZ coordinates in an arc arrangement.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param radius Radius of circle as a number.
* @param num_coords Number of XYZ coordinates distributed equally along the arc.
* @param arc_angle Angle of arc (in radians).
* @returns XYZ coordinates if successful, null if unsuccessful or on error.
* @example coordinates1 = pattern.Arc([0,0,0], 10, 12, PI)
* @example_info Creates a list of 12 XYZ coordinates distributed equally along a semicircle of radius 10.
 */
export function Arc(origin: Txyz, radius: number, num_coords: number, arc_angle: number): Txyz[] {
    // --- Error Check ---
    const fn_name = 'pattern.Arc';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord']);
    checkCommTypes(fn_name, 'radius', radius, ['isNumber']);
    checkCommTypes(fn_name, 'num_coords', num_coords, ['isInt']);
    checkCommTypes(fn_name, 'arc_angle', arc_angle, ['isNumber']);
    // --- Error Check ---
    const coords_id: Txyz[] = [];
    for (let i = 0; i < num_coords + 1; i++) {
        const vec: Txyz = origin as Txyz;
        const angle: number = (arc_angle / num_coords) * i;
        const x: number = (Math.cos(angle) * radius) + vec[0];
        const y: number = (Math.sin(angle) * radius) + vec[1];
        coords_id.push( [x, y, vec[2]] );
    }
    // TODO Implement the TPlane version
    return coords_id;
}
// ================================================================================================
export enum _EGridMethod {
    FLAT = 'flat',
    COLUMNS = 'columns',
    ROWS = 'rows'
}
/**
* Creates a list of XYZ coordinates in a grid arrangement.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.
* @param num_coords Number of XYZ coordinates.
* @param method Enum, define the way the coords will be return as lists.
* If integer, same number for x and y; if list of two numbers, number for x and y respectively.
* @returns XYZ coordinates if successful, null if unsuccessful or on error.
* @example coordinates1 = pattern.Grid([0,0,0], 10, 3)
* @example_info Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.
* @example coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])
* @example_info Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
*/
export function Grid(origin: Txyz|TPlane, size: number|[number, number],
        num_coords: number|[number, number], method: _EGridMethod): Txyz[]|Txyz[][] {
    // --- Error Check ---
    const fn_name = 'pattern.Grid';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    checkCommTypes(fn_name, 'num_coords', num_coords, ['isInt', 'isXYlistInt']);
    // --- Error Check ---
    // create the grid as a flat list
    const xy_size: [number, number] = (Array.isArray(size) ? size : [size, size]) as [number, number];
    const xy_num_coords: [number, number] =
        (Array.isArray(num_coords) ? num_coords : [num_coords, num_coords]) as [number, number];
    const x_offset: number = xy_size[0] / (xy_num_coords[0] - 1);
    const y_offset: number = xy_size[1] / (xy_num_coords[1] - 1);
    let grid: Txyz[] = [];
    for (let i = 0; i < xy_num_coords[1]; i++) {
        const y: number = (i * y_offset) - (xy_size[1] / 2);
        for (let j = 0; j < xy_num_coords[0]; j++) {
            const x: number = (j * x_offset) - (xy_size[0] / 2);
            grid.push( [x, y, 0 ]);
        }
    }
    // transform the points using origin
    if (getArrDepth(origin) === 1) {
        grid = grid.map(c => vecAdd(c, origin as Txyz));
    } else { // we have a plane
        const matrix: Matrix4 = xfromSourceTargetMatrix(XYPLANE, origin as  TPlane);
        grid = grid.map(c => multMatrix(c, matrix));
    }
    // structure the grid coords, and return
    if (method === _EGridMethod.ROWS) {
        const grid2: Txyz[][] = [];
        for (let i = 0; i < xy_num_coords[1]; i++) {
            const row: Txyz[] = [];
            for (let j = 0; j < xy_num_coords[0]; j++) {
                const index: number = (i * xy_num_coords[0]) + j;
                row.push( grid[index] );
            }
            grid2.push(row);
        }
        return grid2;
    } else if (method === _EGridMethod.COLUMNS) {
        const grid2: Txyz[][] = [];
        for (let i = 0; i < xy_num_coords[0]; i++) {
            const col: Txyz[] = [];
            for (let j = 0; j < xy_num_coords[1]; j++) {
                const index: number = (j * xy_num_coords[0]) + i;
                col.push( grid[index] );
            }
            grid2.push(col);
        }
        return grid2;
    }
    // return the flat grid
    return grid;
}
// ================================================================================================
/**
* Creates a list of XYZ coordinates in a rectangular arrangement.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.
* @returns XYZ coordinates if successful, null if unsuccessful or on error.
* @example coordinates1 = pattern.Rectangle([0,0,0], 10)
* @example_info Creates a list of 4 coords, being the vertices of a 10 by 10 square.
* @example coordinates1 = pattern.Rectangle([0,0,0], [10,20])
* @example_info Creates a list of 4 coords, being the vertices of a 10 by 20 rectangle.
 */
export function Rectangle(origin: Txyz|TPlane, size: number|[number, number]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'pattern.Rectangle';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    // --- Error Check ---
    // create the rectangle
    const xy_size: [number, number] = (Array.isArray(size) ? size : [size, size]) as [number, number];
    const c1: Txyz = [-(xy_size[0] / 2), -(xy_size[1] / 2), 0];
    const c2: Txyz = [ (xy_size[0] / 2), -(xy_size[1] / 2), 0];
    const c3: Txyz = [ (xy_size[0] / 2),  (xy_size[1] / 2), 0];
    const c4: Txyz = [-(xy_size[0] / 2),  (xy_size[1] / 2), 0];
    const corners: Txyz[] = [c1, c2, c3, c4];
    // transform the points using origin and return
    if (getArrDepth(origin) === 1) {
        return corners.map(c => vecAdd(c, origin as Txyz));
    } else { // we have a plane
        const matrix: Matrix4 = xfromSourceTargetMatrix(XYPLANE, origin as  TPlane);
        return corners.map(c => multMatrix(c, matrix));
    }
}
// ================================================================================================
