/**
 * The `pattern` module has functions for creating patters of positions in the model.
 * All these functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 */

/**
 *
 */

import * as chk from '../../_check_types';

import { Txyz, TPlane, XYPLANE, TId, EEntType } from '@libs/geo-info/common';
import { idsMakeFromIdxs } from '@assets/libs/geo-info/common_id_funcs';
import { getArrDepth } from '@assets/libs/util/arrs';
import { vecAdd } from '@libs/geom/vectors';
import { xfromSourceTargetMatrix, multMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
// import { __merge__ } from '../_model';
import { GIModel } from '@libs/geo-info/GIModel';
import * as THREE from 'three';
import * as VERB from '@assets/libs/verb/verb';
import { arrFill, arrMakeFlat } from '@assets/libs/util/arrs';
// import * as VERB from 'verb';
// ================================================================================================
/**
 * Creates a row of positions in a line pattern. Returns a list of new positions.
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param size Size of the line.
 * @returns Entities, a list of four positions.
 */
export function Line(__model__: GIModel, origin: Txyz|TPlane, size: number, num_positions: number): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Line';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    }
    // create the positions
    const posis_i: number[] = [];
    const coords: Txyz[] = [];
    const step: number = size / (num_positions - 1);
    for (let i = 0; i < num_positions; i++) {
        coords.push([-(size / 2) + i * step, 0, 0]);
    }
    for (const coord of coords) {
        let xyz: Txyz = coord;
        if (origin_is_plane) {
            xyz = multMatrix(xyz, matrix);
        } else { // we have a plane
            xyz = vecAdd(xyz, origin as Txyz);
        }
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
/**
 * Creates four positions in a rectangle pattern. Returns a list of new positions.
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param size Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.
 * @returns Entities, a list of four positions.
 * @example coordinates1 = pattern.Rectangle([0,0,0], 10)
 * @example_info Creates a list of 4 coords, being the vertices of a 10 by 10 square.
 * @example coordinates1 = pattern.Rectangle([0,0,0], [10,20])
 * @example_info Creates a list of 4 coords, being the vertices of a 10 by 20 rectangle.
 */
export function Rectangle(__model__: GIModel, origin: Txyz|TPlane, size: number|[number, number]): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Rectangle';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
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
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
export enum _EGridMethod {
    FLAT = 'flat',
    COLUMNS = 'columns',
    ROWS = 'rows',
    QUADS = 'quads'
}
/**
* Creates positions in a grid pattern. Returns a list (or list of lists) of new positions.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of grid. If number, assume equal lengths, i.e. a square grid.
* If list of two numbers, specifies x and y lengths respectively.
* @param num_positions Number of positions. If a number, assume equal number of positions.
* If a list of two numbers, specifies x and y number of positions respectivley.
* @param method Enum, define the way the coords will be return as lists.
* If integer, same number for x and y; if list of two numbers, number for x and y respectively.
* @returns Entities, a list of positions, or a list of lists of positions (depending on the 'method' setting).
* @example coordinates1 = pattern.Grid([0,0,0], 10, 3)
* @example_info Creates a list of 9 XYZ coordinates on a 3x3 square grid of length 10.
* @example coordinates1 = pattern.Grid([0,0,0], [10,20], [2,4])
* @example_info Creates a list of 8 XYZ coordinates on a 2x4 grid of length 10 by 20.
*/
export function Grid(__model__: GIModel, origin: Txyz|TPlane, size: number|[number, number],
        num_positions: number|[number, number], method: _EGridMethod): TId[]|TId[][] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Grid';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt, chk.isXYInt]);
    }
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
            const posi_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
    }
    // structure the grid of posis, and return
    const posis_i2: number[][] = [];
    if (method === _EGridMethod.FLAT) {
        return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
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
    } else if (method === _EGridMethod.QUADS) {
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
    return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
}
// ================================================================================================
export enum _EBoxMethod {
    FLAT = 'flat',
    ROWS = 'rows',
    COLUMNS = 'columns',
    LAYERS = 'layers',
    // SIDES = 'sides',
    QUADS = 'quads'
}
/**
 * Creates positions in a box pattern. Returns a list of new positions.
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param size Size of the box. If one number, assume equal lengths.
 * If list of two or three numbers, specifies x y z lengths respectively.
 * @param num_positions Number of positions. If number, assume equal number of positions.
 * If list of two or three numbers, specifies x y z numbers respectively.
 * @param method Enum
 * @returns Entities, a list of 6 positions.
 */
export function Box(__model__: GIModel, origin: Txyz | TPlane,
    size: number | [number, number] | [number, number, number],
    num_positions: number | [number, number] | [number, number, number],
    method: _EBoxMethod): TId[] | TId[][] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Box';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY, chk.isXYZ]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    }
    // create params
    const xyz_size: Txyz = arrFill(size, 3) as [number, number, number];
    const xyz_num_positions: [number, number, number] = arrFill(num_positions, 3) as [number, number, number];
    // create the positions
    const layer_top_posis_i: number[] = [];
    const layer_bot_posis_i: number[] = [];
    const posis_i: number[][][] = [];
    const x_offset: number = xyz_size[0] / (xyz_num_positions[0] - 1);
    const y_offset: number = xyz_size[1] / (xyz_num_positions[1] - 1);
    const z_offset: number = xyz_size[2] / (xyz_num_positions[2] - 1);
    for (let k = 0; k < xyz_num_positions[2]; k++) {
        const layer_perim_x0_posis_i: number[] = [];
        const layer_perim_y0_posis_i: number[] = [];
        const layer_perim_x1_posis_i: number[] = [];
        const layer_perim_y1_posis_i: number[] = [];
        const z: number = (k * z_offset) - (xyz_size[2] / 2);
        for (let i = 0; i < xyz_num_positions[1]; i++) {
            const y: number = (i * y_offset) - (xyz_size[1] / 2);
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const x: number = (j * x_offset) - (xyz_size[0] / 2);
                let create_perim_layer = false;
                // perimeter layers
                if (i === 0 || i === xyz_num_positions[1] - 1) { create_perim_layer = true; }
                if (j === 0 || j === xyz_num_positions[0] - 1) { create_perim_layer = true; }
                // top layer
                let create_top_layer = false;
                if (k === xyz_num_positions[2] - 1) { create_top_layer = true; }
                // bot layer
                let create_bot_layer = false;
                if (k === 0) { create_bot_layer = true; }
                // create posis
                if (create_perim_layer || create_top_layer || create_bot_layer) {
                    let xyz: Txyz = [x, y, z];
                    if (origin_is_plane) {
                        xyz = multMatrix(xyz, matrix);
                    } else { // we have a plane
                        xyz = vecAdd(xyz, origin as Txyz);
                    }
                    const posi_i: number = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
                    if (create_perim_layer) {
                        if (i === 0) {
                            layer_perim_x0_posis_i.push(posi_i);
                        } else if (i === xyz_num_positions[1] - 1) {
                            layer_perim_x1_posis_i.push(posi_i);
                        } else if (j === xyz_num_positions[0] - 1) {
                            layer_perim_y0_posis_i.push(posi_i);
                        } else if (j === 0) {
                            layer_perim_y1_posis_i.push(posi_i);
                        }
                    }
                    if (create_top_layer) {
                        layer_top_posis_i.push(posi_i);
                    }
                    if (create_bot_layer) {
                        layer_bot_posis_i.push(posi_i);
                    }
                }
            }
        }
        posis_i.push([layer_perim_x0_posis_i, layer_perim_y0_posis_i, layer_perim_x1_posis_i, layer_perim_y1_posis_i]);
    }
    // structure the grid of posis, and return
    if (method === _EBoxMethod.FLAT) {
        const layers_posis_i: number[][] = [];
        for (let k = 1; k < posis_i.length - 2; k++) {
            layers_posis_i.push(
                arrMakeFlat([
                    posis_i[k][0],
                    posis_i[k][1],
                    posis_i[k][2].reverse(),
                    posis_i[k][3].reverse(),
                ])
            );
        }
        const all_posis: number[] = arrMakeFlat([layer_bot_posis_i, layers_posis_i, layer_top_posis_i]);
        return idsMakeFromIdxs(EEntType.POSI, all_posis) as TId[];
    } else if (method === _EBoxMethod.ROWS) {
        // rows that are parallel to x axis
        const posis_i2: number[][] = [];
        for (let i = 0; i < xyz_num_positions[1]; i++) {
            const row: number[] = [];
            // bottom
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                row.push(layer_bot_posis_i[index]);
            }
            // mid
            if (posis_i.length > 2) {
                for (let k = 1; k < posis_i.length - 1; k++) {
                    if (i === 0) {
                        row.push(...posis_i[k][0]);
                    } else if (i === xyz_num_positions[1] - 1) {
                        row.push(...posis_i[k][2]);
                    } else {
                        row.push(posis_i[k][3][i - 1]);
                        row.push(posis_i[k][1][i - 1]);
                    }
                }
            }
            // top
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                row.push(layer_top_posis_i[index]);
            }
            posis_i2.push(row);
        }
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    } else if (method === _EBoxMethod.COLUMNS) {
        // columns that are parallel to the y axis
        // i is moving along x axis
        const posis_i2: number[][] = [];
        for (let i = 0; i < xyz_num_positions[0]; i++) {
            const col: number[] = [];
            // bot
            for (let j = 0; j < xyz_num_positions[1]; j++) {
                const index: number = (j * xyz_num_positions[0]) + i;
                col.push(layer_bot_posis_i[index]);
            }
            // mid
            if (posis_i.length > 2) {
                for (let k = 1; k < posis_i.length - 1; k++) {
                    if (i === 0) {
                        col.push(posis_i[k][0][0]);
                        col.push(...posis_i[k][3]);
                        col.push(posis_i[k][2][0]);
                    } else if (i === xyz_num_positions[1] - 1) {
                        col.push(posis_i[k][0][xyz_num_positions[0] - 1]);
                        col.push(...posis_i[k][1]);
                        col.push(posis_i[k][0][xyz_num_positions[0] - 1]);
                    } else {
                        col.push(posis_i[k][0][i]);
                        col.push(posis_i[k][2][i]);
                    }
                }
            }
            // top
            for (let j = 0; j < xyz_num_positions[1]; j++) {
                const index: number = (j * xyz_num_positions[0]) + i;
                col.push(layer_top_posis_i[index]);
            }
            posis_i2.push(col);
        }
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    } else if (method === _EBoxMethod.LAYERS) {
        // layers that are parallel to the xy plane
        // i is moving along z axis
        // bottom
        const posis_i2: number[][] = [layer_bot_posis_i];
        // mid
        for (let i = 1; i < xyz_num_positions[2] - 1; i++) {
            if (posis_i.length > 2) {
                const layer: number[] = posis_i[i][0].slice();
                for (let j = 0; j < xyz_num_positions[1] - 2; j++) {
                    layer.push(posis_i[i][3][j]);
                    layer.push(posis_i[i][1][j]);
                }
                layer.push(...posis_i[i][2]);
                posis_i2.push(layer);
            }
        }
        // top
        posis_i2.push(layer_top_posis_i);
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    } else if (method === _EBoxMethod.QUADS) {
        const posis_i2: number[][] = [];
        // bottom
        for (let i = 0; i < xyz_num_positions[1] - 1; i++) {
            for (let j = 0; j < xyz_num_positions[0] - 1; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                const quad: number[] = [
                    layer_bot_posis_i[index],
                    layer_bot_posis_i[index + xyz_num_positions[0]],
                    layer_bot_posis_i[index + xyz_num_positions[0] + 1],
                    layer_bot_posis_i[index + 1]
                ];
                posis_i2.push(quad);
            }
        }
        // mid
        const layers_posis_i: number[][] = [];
        for (let k = 0; k < posis_i.length; k++) {
            layers_posis_i.push(
                arrMakeFlat([
                    posis_i[k][0],
                    posis_i[k][1],
                    posis_i[k][2].reverse(),
                    posis_i[k][3].reverse(),
                ])
            );
        }
        for (let k = 0; k < layers_posis_i.length - 1; k++) {
            const layer_posis_i: number[] = layers_posis_i[k];
            const next_layer_posis_i: number[] = layers_posis_i[k + 1];
            for (let i = 0; i < layer_posis_i.length; i++) {
                const index: number = i;
                const next_index: number = i === layer_posis_i.length - 1 ? 0 : i + 1;
                const quad: number[] = [
                    layer_posis_i[index],
                    layer_posis_i[next_index],
                    next_layer_posis_i[next_index],
                    next_layer_posis_i[index]
                ];
                posis_i2.push(quad);
            }
        }
        // top
        for (let i = 0; i < xyz_num_positions[1] - 1; i++) {
            for (let j = 0; j < xyz_num_positions[0] - 1; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                const quad: number[] = [
                    layer_top_posis_i[index],
                    layer_top_posis_i[index + 1],
                    layer_top_posis_i[index + xyz_num_positions[0] + 1],
                    layer_top_posis_i[index + xyz_num_positions[0]]
                ];
                posis_i2.push(quad);
            }
        }
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    }
    return [];
}
// ================================================================================================
/**
 * Creates positions in a polyhedron pattern. Returns a list of new positions.
 * \n
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param radius xxx
 * @param detail xxx
 * @param method Enum
 * @returns Entities, a list of positions.
 */
export function Polyhedron(__model__: GIModel, origin: Txyz | TPlane, radius: number, detail: number,
        method: _EPolyhedronMethod): TId[]|TId[][] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Polyhedron';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
        chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
        if (detail > 6) {
            throw new Error('pattern.Polyhedron: The "detail" argument is too high, the maximum is 6.');
        }
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: Matrix4 = null;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    } else {
        matrix = new Matrix4();
        matrix.makeTranslation(...origin as Txyz);
    }
    // make polyhedron posis
    const posis_i: number[]|number[][] = _polyhedron(__model__, matrix, radius, detail, method);
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[][];
}
export enum _EPolyhedronMethod {
    FLAT_TETRA = 'flat_tetra',
    FLAT_OCTA = 'flat_octa',
    FLAT_ICOSA = 'flat_icosa',
    FLAT_DODECA = 'flat_dodeca',
    FACE_TETRA = 'face_tetra',
    FACE_OCTA = 'face_octa',
    FACE_ICOSA = 'face_icosa',
    FACE_DODECA = 'face_dodeca'
}
export function _polyhedron(__model__: GIModel, matrix: Matrix4, radius: number, detail: number,
    method: _EPolyhedronMethod): number[]|number[][] {
    // create the posis
    let hedron_tjs: THREE.TetrahedronGeometry|THREE.OctahedronGeometry|THREE.IcosahedronGeometry|THREE.DodecahedronGeometry = null;
    switch (method) {
        case _EPolyhedronMethod.FLAT_TETRA:
        case _EPolyhedronMethod.FACE_TETRA:
            hedron_tjs = new THREE.TetrahedronGeometry(radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_OCTA:
        case _EPolyhedronMethod.FACE_OCTA:
            hedron_tjs = new THREE.OctahedronGeometry(radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_ICOSA:
        case _EPolyhedronMethod.FACE_ICOSA:
            hedron_tjs = new THREE.IcosahedronGeometry(radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_DODECA:
        case _EPolyhedronMethod.FACE_DODECA:
            hedron_tjs = new THREE.DodecahedronGeometry(radius, detail);
            break;
        default:
            throw new Error('pattern.Polyhedron: method not recognised.');
    }
    // create the posis
    const posis_i: number[] = [];
    for (const vert_tjs of hedron_tjs.vertices) {
        const xyz: Txyz = multMatrix(vert_tjs.toArray() as Txyz, matrix);
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // if the method is flat, then we are done, return the posis
    switch (method) {
        case _EPolyhedronMethod.FLAT_TETRA:
        case _EPolyhedronMethod.FLAT_OCTA:
        case _EPolyhedronMethod.FLAT_ICOSA:
        case _EPolyhedronMethod.FLAT_DODECA:
            return posis_i;
    }
    // get the posis into the arrays
    const posis_arrs_i: number[][] = [];
    for (const face_tjs of hedron_tjs.faces) {
        posis_arrs_i.push([
            posis_i[face_tjs.a],
            posis_i[face_tjs.b],
            posis_i[face_tjs.c]
        ]);
    }
    // dispose the tjs polyhedron
    hedron_tjs.dispose();
    // return the result
    return posis_arrs_i;
}
// ================================================================================================
/**
 * Creates positions in an arc pattern. Returns a list of new positions.
 * If the angle of the arc is set to null, then circular patterns will be created.
 * For circular patterns, duplicates at start and end are automatically removed.
 *
 * @param __model__
 * @param origin XYZ coordinates as a list of three numbers.
 * @param radius Radius of circle as a number.
 * @param num_positions Number of positions to be distributed equally along the arc.
 * @param arc_angle Angle of arc (in radians).
 * @returns Entities, a list of positions.
 * @example coordinates1 = pattern.Arc([0,0,0], 10, 12, PI)
 * @example_info Creates a list of 12 positions distributed equally along a semicircle of radius 10.
 */
export function Arc(__model__: GIModel, origin: Txyz|TPlane, radius: number, num_positions: number, arc_angle: number): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Arc';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        chk.checkArgs(fn_name, 'arc_angle', arc_angle, [chk.isNum, chk.isNull]);
    }
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
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
/**
 * Creates positions in an Bezier curve pattern. Returns a list of new positions.
 * The Bezier is created as either a qadratic or cubic Bezier. It is always an open curve.
 * \n
 * The input is a list of XYZ coordinates (three coords for quadratics, four coords for cubics).
 * The first and last coordinates in the list are the start and end positions of the Bezier curve.
 * The middle coordinates act as the control points for controlling the shape of the Bezier curve.
 * \n
 * For the quadratic Bezier, three XYZ coordinates are required.
 * For the cubic Bezier, four XYZ coordinates are required.
 * \n
 * For more information, see the wikipedia article: <a href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve">B%C3%A9zier_curve</a>.
 * \n
 * @param __model__
 * @param coords A list of XYZ coordinates (three coords for quadratics, four coords for cubics).
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example coordinates1 = pattern.Bezier([[0,0,0], [10,0,50], [20,0,10]], 20)
 * @example_info Creates a list of 20 positions distributed along a Bezier curve pattern.
 */
export function Bezier(__model__: GIModel, coords: Txyz[], num_positions: number): TId[] {
    // --- Error Check ---
    const fn_name = 'pattern.Bezier';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    // create the curve
    const coords_tjs: THREE.Vector3[] = coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    let points_tjs: THREE.Vector3[] = [];
    let curve_tjs: THREE.CubicBezierCurve3|THREE.QuadraticBezierCurve3 = null;
    if (coords.length === 4) {
        curve_tjs = new THREE.CubicBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2], coords_tjs[3]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    } else if (coords.length === 3) {
        curve_tjs = new THREE.QuadraticBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    } else {
        throw new Error (fn_name + ': "coords" should be a list of either three or four XYZ coords.');
    }
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, points_tjs[i].toArray() as Txyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
export enum _EClose {
    OPEN = 'open',
    CLOSE = 'close'
}
/**
 * Creates positions in an NURBS curve pattern, by using the XYZ positions as control points.
 * Returns a list of new positions.
 * \n
 * The positions are created along the curve at equal parameter values.
 * This means that the euclidean distance between the positions will not necessarily be equal.
 * \n
 * The input is a list of XYZ coordinates that will act as control points for the curve.
 * If the curve is open, then the first and last coordinates in the list are the start and end positions of the curve.
 * \n
 * The number of positions should be at least one greater than the degree of the curve.
 * \n
 * The degree (between 2 and 5) of the urve defines how smooth the curve is.
 * Quadratic: degree = 2
 * Cubic: degree = 3
 * Quartic: degree = 4.
 * \n
 * @param __model__
 * @param coords A list of XYZ coordinates (must be at least three XYZ coords).
 * @param degree The degree of the curve, and integer between 2 and 5.
 * @param close Enum, 'close' or 'open'
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example coordinates1 = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,10]], 20)
 * @example_info Creates a list of 20 positions distributed along a Bezier curve pattern.
 */
export function Nurbs(__model__: GIModel, coords: Txyz[], degree: number, close: _EClose, num_positions: number): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Nurbs';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        if (coords.length < 3) {
            throw new Error (fn_name + ': "coords" should be a list of at least three XYZ coords.');
        }
        if (degree < 2  || degree > 5) {
            throw new Error (fn_name + ': "degree" should be between 2 and 5.');
        }
        if (degree > (coords.length - 1)) {
            throw new Error (fn_name + ': a curve of degree ' + degree + ' requires at least ' + (degree + 1) + ' coords.' );
        }
    }
    // --- Error Check ---
    const closed: boolean = close === _EClose.CLOSE;
    // create the curve using the VERBS library
    const offset = degree + 1;
    const coords2: Txyz[] = coords.slice();
    if (closed) {
        const start: Txyz[] = coords2.slice(0, offset);
        const end: Txyz[] = coords2.slice(coords2.length - offset, coords2.length);
        coords2.splice(0, 0, ...end);
        coords2.splice(coords2.length, 0, ...start);
    }
    const weights = coords2.forEach( _ => 1);
    const num_knots: number = coords2.length + degree + 1;
    const knots: number [] = [];
    const uniform_knots = num_knots - (2 * degree);
    for (let i = 0; i < degree; i++) {
        knots.push(0);
    }
    for (let i = 0; i < uniform_knots; i++) {
        knots.push(i / (uniform_knots - 1));
    }
    for (let i = 0; i < degree; i++) {
        knots.push(1);
    }
    const curve_verb = new VERB.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, coords2, weights);
    // Testing VERB closed curve
    // const k: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // const c: number[][] = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 0], [10, 0, 0]];
    // const w: number[] = [1, 1, 1, 1, 1, 1];
    // const curve_verb2 = new VERB.geom.NurbsCurve.byKnotsControlPointsWeights(2, k, c, w);
    // This gives an error: Error:
    // Invalid knot vector format! Should begin with degree + 1 repeats and end with degree + 1 repeats!
    const posis_i: number[] = nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, coords[0]);
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
/**
 * Creates positions in an NURBS curve pattern, by iterpolating between the XYZ positions.
 * Returns a list of new positions.
 * \n
 * THe positions are created along the curve at equal parameter values.
 * This means that the euclidean distance between the positions will not necessarily be equal.
 * \n
 * The input is a list of XYZ coordinates that will act as control points for the curve.
 * If the curve is open, then the first and last coordinates in the list are the start and end positions of the curve.
 * \n
 * The number of positions should be at least one greater than the degree of the curve.
 * \n
 * The degree (between 2 and 5) of the urve defines how smooth the curve is.
 * Quadratic: degree = 2
 * Cubic: degree = 3
 * Quartic: degree = 4.
 * \n
 * @param __model__
 * @param coords A list of XYZ coordinates (must be at least three XYZ coords).
 * @param degree The degree of the curve, and integer between 2 and 5.
 * @param close Enum, 'close' or 'open'
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example coordinates1 = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,10]], 20)
 * @example_info Creates a list of 20 positions distributed along a Bezier curve pattern.
 */
export function _Interpolate(__model__: GIModel, coords: Txyz[], degree: number, close: _EClose, num_positions: number): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern._Interpolate';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        // --- Error Check ---
        if (coords.length < 3) {
            throw new Error (fn_name + ': "coords" should be a list of at least three XYZ coords.');
        }
        if (degree < 2  || degree > 5) {
            throw new Error (fn_name + ': "degree" should be between 2 and 5.');
        }
        if (degree > (coords.length - 1)) {
            throw new Error (fn_name + ': a curve of degree ' + degree + ' requires at least ' + (degree + 1) + ' coords.' );
        }
    }
    const closed: boolean = close === _EClose.CLOSE;
    // create the curve using the VERBS library
    const offset = degree + 1;
    const coords2: Txyz[] = coords.slice();
    if (closed) {
        const start: Txyz[] = coords2.slice(0, offset);
        const end: Txyz[] = coords2.slice(coords2.length - offset, coords2.length);
        coords2.splice(0, 0, ...end);
        coords2.splice(coords2.length, 0, ...start);
    }
    const curve_verb = new VERB.geom.NurbsCurve.byPoints( coords2, degree );
    // return the list of posis
    const posis_i: number[] = nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, coords[0]);
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
function nurbsToPosis(__model__: GIModel, curve_verb: any, degree: number, closed: boolean,
        num_positions: number, start: Txyz, ): number[] {
    // create positions
    const posis_i: number[] = [];
    const [offset_start, offset_end] = {2: [5, 3], 3: [6, 5], 4: [8, 6], 5: [9, 8]}[degree];
    const knots: number[] = curve_verb.knots();
    const u_start = knots[offset_start];
    const u_end = knots[knots.length - offset_end - 1];
    const u_range = u_end - u_start;
    // trying split
    // const [c1, c2] = curve_verb.split(u_start);
    // const [c3, c4] = c2.split(u_end);
    // const curve_length_samples_verb: any[] = c3.divideByEqualArcLength(num_positions - 1);
    // const u_values_verb: number[] = curve_length_samples_verb.map( cls => cls.u as number );
    let min_dist_to_start = Infinity;
    let closest_to_start = -1;
    for (let i = 0; i < num_positions; i++) {
        let u: number;
        if (closed) {
            u = u_start + ((i / num_positions) * u_range);
        } else {
            u = i / (num_positions - 1);
        }
        const xyz: Txyz  = curve_verb.point(u) as Txyz;
        // xyz[2] = i / 10;
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
        const dist =    Math.abs(start[0] - xyz[0]) +
                        Math.abs(start[1] - xyz[1]) +
                        Math.abs(start[2] - xyz[2]);
        if (dist < min_dist_to_start) {
            min_dist_to_start = dist;
            closest_to_start = i;
        }
    }
    const posis_i_start: number[] = posis_i.slice(closest_to_start, posis_i.length);
    const posis_i_end: number[] = posis_i.slice(0, closest_to_start);
    const posis_i_sorted: number[] = posis_i_start.concat(posis_i_end);
    // return the list of posis
    return posis_i_sorted;
}
// ================================================================================================
/**
 * Creates positions in an spline pattern. Returns a list of new positions.
 * The spline is created using the Catmull-Rom algorithm.
 * It is a type of interpolating spline (a curve that goes through its control points).
 * \n
 * The input is a list of XYZ coordinates. These act as the control points for creating the Spline curve.
 * The positions that get generated will be divided equally between the control points.
 * For example, if you define 4 control points for a cosed spline, and set 'num_positions' to be 40,
 * then you will get 8 positions between each pair of control points,
 * irrespective of the distance between the control points.
 * \n
 * The spline curve can be created in three ways: 'centripetal', 'chordal', or 'catmullrom'.
 * \n
 * For more information, see the wikipedia article:
 * <a href="https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline">Catmull–Rom spline</a>.
 * \n
 * <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Catmull-Rom_examples_with_parameters..png"
 * alt="Curve types" width="100">
 * \n
 * @param __model__
 * @param coords A list of XYZ coordinates.
 * @param type Enum, the type of interpolation algorithm.
 * @param tension Curve tension, between 0 and 1. This only has an effect when the 'type' is set to 'catmullrom'.
 * @param close Enum, 'open' or 'close'.
 * @param num_positions Number of positions to be distributed distributed along the spline.
 * @returns Entities, a list of positions.
 * @example coordinates1 = pattern.Spline([[0,0,0], [10,0,50], [20,0,0], [30,0,20], [40,0,10]], 'chordal','close', 0.2, 50)
 * @example_info Creates a list of 50 positions distributed along a spline curve pattern.
 */
export function Interpolate(__model__: GIModel, coords: Txyz[], type: _ECurveCatRomType, tension: number, close: _EClose,
    num_positions: number): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Interpolate';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'tension', tension, [chk.isNum01]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        if (coords.length < 3) {
            throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
        }
    }
    // --- Error Check ---
    const closed_tjs: boolean = close === _EClose.CLOSE;
    const num_positions_tjs: number = closed_tjs ? num_positions : num_positions - 1;
    if (tension === 0) { tension = 1e-16; } // There seems to be a bug in threejs, so this is a fix
    // Check we have enough coords
    // create the curve
    const coords_tjs: THREE.Vector3[] = coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    const curve_tjs: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(coords_tjs, closed_tjs, type, tension);
    const points_tjs: THREE.Vector3[] = curve_tjs.getPoints(num_positions_tjs);
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, points_tjs[i].toArray() as Txyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
// Enums for CurveCatRom()
export enum _ECurveCatRomType {
    CENTRIPETAL = 'centripetal',
    CHORDAL = 'chordal',
    CATMULLROM = 'catmullrom'
}
// ================================================================================================
