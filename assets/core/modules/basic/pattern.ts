/**
 * The `pattern` module has functions for creating patters of positions in the model.
 * All these functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 */

/**
 *
 */

import { checkCommTypes, TypeCheckObj } from '../_check_args';
import { Txyz, TPlane, XYPLANE, TId, EEntType } from '@libs/geo-info/common';
import { getArrDepth, idsMakeFromIndicies } from '@libs/geo-info/id';
import { vecAdd } from '@libs/geom/vectors';
import { xfromSourceTargetMatrix, multMatrix } from '@libs/geom/matrix';
import { Matrix4 } from 'three';
import { __merge__ } from '../_model';
import { GIModel } from '@libs/geo-info/GIModel';
import * as THREE from 'three';
import * as VERB from '@assets/libs/verb/verb';
// import * as VERB from 'verb';
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
    const fn_name = 'pattern.Rectangle';
    checkCommTypes(fn_name, 'origin', origin, [TypeCheckObj.isCoord, TypeCheckObj.isPlane]);
    checkCommTypes(fn_name, 'size', size, [TypeCheckObj.isNumber, TypeCheckObj.isXYlist]);
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
/**
* Creates positions in a grid pattern. Returns a list (or list of lists) of new positions.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.
* @param num_positions Number of positions.
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
    const fn_name = 'pattern.Grid';
    checkCommTypes(fn_name, 'origin', origin, [TypeCheckObj.isCoord, TypeCheckObj.isPlane]);
    checkCommTypes(fn_name, 'size', size, [TypeCheckObj.isNumber, TypeCheckObj.isXYlist]);
    checkCommTypes(fn_name, 'num_positions', num_positions, [TypeCheckObj.isInt, TypeCheckObj.isXYlistInt]);
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
export enum _EGridMethod {
    FLAT = 'flat',
    COLUMNS = 'columns',
    ROWS = 'rows',
    SQUARES = 'squares'
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
    const fn_name = 'pattern.Arc';
    checkCommTypes(fn_name, 'origin', origin, [TypeCheckObj.isCoord, TypeCheckObj.isPlane]);
    checkCommTypes(fn_name, 'radius', radius, [TypeCheckObj.isNumber]);
    checkCommTypes(fn_name, 'num_positions', num_positions, [TypeCheckObj.isInt]);
    checkCommTypes(fn_name, 'arc_angle', arc_angle, [TypeCheckObj.isNumber, TypeCheckObj.isNull]);
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
/**
 * Creates positions in an Bezier curve pattern. Returns a list of new positions.
 * The Bezier is created as either a qadratic or cubic Bezier. It is always an open curve.
 * ~
 * The input is a list of XYZ coordinates (three coords for quadratics, four coords for cubics).
 * The first and last coordinates in the list are the start and end positions of the Bezier curve. 
 * The middle coordinates act as the control points for controlling the shape of the Bezier curve.
 * ~
 * For the quadratic Bezier, three XYZ coordinates are required.
 * For the cubic Bezier, four XYZ coordinates are required.
 * ~
 * For more information, see the wikipedia article: <a href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve">B%C3%A9zier_curve</a>.
 * ~
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
    checkCommTypes(fn_name, 'coords', coords, [TypeCheckObj.isCoordList]);
    checkCommTypes(fn_name, 'num_positions', num_positions, [TypeCheckObj.isInt]);
    // --- Error Check ---
    // create the curve
    const coords_tjs: THREE.Vector3[] = coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    let points_tjs: THREE.Vector3[] = [];
    if (coords.length === 4) {
        const curve_tjs = new THREE.CubicBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2], coords_tjs[3]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    } else if (coords.length === 3) {
        const curve_tjs = new THREE.QuadraticBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    } else {
        throw new Error (fn_name + ': "coords" should be a list of either three or four XYZ coords.');
    }
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, points_tjs[i].toArray() as Txyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
/**
 * Creates positions in an NURBS curve pattern, by using the XYZ positions as control points.
 * Returns a list of new positions.
 * ~
 * The positions are created along the curve at equal parameter values.
 * This means that the euclidean distance between the positions will not necessarily be equal.
 * ~
 * The input is a list of XYZ coordinates that will act as control points for the curve.
 * If the curve is open, then the first and last coordinates in the list are the start and end positions of the curve.
 * ~
 * The number of positions should be at least one greater than the degree of the curve.
 * ~
 * The degree (between 2 and 5) of the urve defines how smooth the curve is.
 * Quadratic: degree = 2
 * Cubic: degree = 3
 * Quartic: degree = 4.
 * ~
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
    const fn_name = 'pattern.Nurbs';
    checkCommTypes(fn_name, 'coords', coords, [TypeCheckObj.isCoordList]);
    checkCommTypes(fn_name, 'num_positions', num_positions, [TypeCheckObj.isInt]);
    // --- Error Check ---
    const closed: boolean = close === _EClose.CLOSE;
    if (coords.length < 3) {
        throw new Error (fn_name + ': "coords" should be a list of at least three XYZ coords.');
    }
    if (degree < 2  || degree > 5) {
        throw new Error (fn_name + ': "degree" should be between 2 and 5.');
    }
    if (degree > (coords.length - 1)) {
        throw new Error (fn_name + ': a curve of degree ' + degree + ' requires at least ' + (degree + 1) + ' coords.' );
    }
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
    const posis_i: number[] = nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, coords[0]);
    // return the list of posis
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
/**
 * Creates positions in an NURBS curve pattern, by iterpolating between the XYZ positions.
 * Returns a list of new positions.
 * ~
 * THe positions are created along the curve at equal parameter values.
 * This means that the euclidean distance between the positions will not necessarily be equal.
 * ~
 * The input is a list of XYZ coordinates that will act as control points for the curve.
 * If the curve is open, then the first and last coordinates in the list are the start and end positions of the curve.
 * ~
 * The number of positions should be at least one greater than the degree of the curve.
 * ~
 * The degree (between 2 and 5) of the urve defines how smooth the curve is.
 * Quadratic: degree = 2
 * Cubic: degree = 3
 * Quartic: degree = 4.
 * ~
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
    const fn_name = 'pattern._Interpolate';
    checkCommTypes(fn_name, 'coords', coords, [TypeCheckObj.isCoordList]);
    checkCommTypes(fn_name, 'num_positions', num_positions, [TypeCheckObj.isInt]);
    // --- Error Check ---
    const closed: boolean = close === _EClose.CLOSE;
    if (coords.length < 3) {
        throw new Error (fn_name + ': "coords" should be a list of at least three XYZ coords.');
    }
    if (degree < 2  || degree > 5) {
        throw new Error (fn_name + ': "degree" should be between 2 and 5.');
    }
    if (degree > (coords.length - 1)) {
        throw new Error (fn_name + ': a curve of degree ' + degree + ' requires at least ' + (degree + 1) + ' coords.' );
    }
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
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// ================================================================================================
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
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, xyz);
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
export enum _EClose {
    OPEN = 'open',
    CLOSE = 'close'
}
// ================================================================================================
/**
 * Creates positions in an spline pattern. Returns a list of new positions.
 * The spline is created using the Catmull-Rom algorithm. 
 * It is a type of interpolating spline (a curve that goes through its control points).
 * ~
 * The input is a list of XYZ coordinates. These act as the control points for creating the Spline curve.
 * The positions that get generated will be divided equally between the control points.
 * For example, if you define 4 control points for a cosed spline, and set 'num_positions' to be 40,
 * then you will get 8 positions between each pair of control points,
 * irrespective of the distance between the control points.
 * ~
 * The spline curve can be created in three ways: 'centripetal', 'chordal', or 'catmullrom'.
 * ~
 * For more information, see the wikipedia article: <a href="https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline">Catmull–Rom spline</a>.
 * ~
 * <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Catmull-Rom_examples_with_parameters..png" 
 * alt="Curve types" width="100">
 * ~
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
    const fn_name = 'pattern.Interpolate';
    checkCommTypes(fn_name, 'coords', coords, [TypeCheckObj.isCoordList]);
    checkCommTypes(fn_name, 'tension', tension, [TypeCheckObj.isNumber01]);
    checkCommTypes(fn_name, 'num_positions', num_positions, [TypeCheckObj.isInt]);
    // --- Error Check ---
    const closed_tjs: boolean = close === _EClose.CLOSE;
    const num_positions_tjs: number = closed_tjs ? num_positions : num_positions - 1;
    if (tension === 0) { tension = 1e-16; } // There seems to be a bug in threejs, so this is a fix
    // Check we have enough coords
    if (coords.length < 3) {
        throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
    }
    // create the curve
    const coords_tjs: THREE.Vector3[] = coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    const curve_tjs: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3(coords_tjs, closed_tjs, type, tension);
    const points_tjs: THREE.Vector3[] = curve_tjs.getPoints(num_positions_tjs);
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, points_tjs[i].toArray() as Txyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIndicies(EEntType.POSI, posis_i) as TId[];
}
// Enums for CurveCatRom()
export enum _ECurveCatRomType {
    CENTRIPETAL = 'centripetal',
    CHORDAL = 'chordal',
    CATMULLROM = 'catmullrom'
}
// ================================================================================================
