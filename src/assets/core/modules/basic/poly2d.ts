/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';

import * as chk from '../../_check_types';

import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType, TId, TEntTypeIdx, Txyz, Txy, TPlane } from '@libs/geo-info/common';
import Shape from '@doodle3d/clipper-js';
import { idsMake, idsBreak, idsMakeFromIdxs, idMake } from '@assets/libs/geo-info/common_id_funcs';
import { isEmptyArr, arrMakeFlat } from '@assets/libs/util/arrs';
import * as d3del from 'd3-delaunay';
import * as d3poly from 'd3-polygon';
import * as d3vor from 'd3-voronoi';
import { distance } from '@assets/libs/geom/distance';
import { vecFromTo, vecNorm, vecMult, vecAdd } from '@assets/libs/geom/vectors';
import { xfromSourceTargetMatrix, multMatrix } from '@assets/libs/geom/matrix';
import { Matrix4 } from 'three';
import { distanceManhattan } from '@assets/libs/geom/distance';

const SCALE = 1e9;
type TPosisMap = Map<number, Map<number, number>>;
// Clipper types
export enum _EClipJointType {
    SQUARE = 'jtSquare',
    ROUND = 'jtRound',
    MITER = 'jtMiter'
}
export enum _EClipEndType {
    OPEN_SQUARE = 'etOpenSquare',
    OPEN_ROUND = 'etOpenRound',
    OPEN_BUTT = 'etOpenButt',
    CLOSED_PLINE = 'etClosedLine',
    CLOSED_PGON = 'etClosedPolygon'
}
interface IClipCoord {
    X: number;
    Y: number;
}
type TClipPath = IClipCoord[];
type TClipPaths = TClipPath[];
interface IClipResult {
    closed: boolean;
    paths: TClipPaths;
}
interface IClipOffsetOptions {
    jointType: string;
    endType: string;
    miterLimit?: number;
    roundPrecision?: number;
}
const MClipOffsetEndType: Map<string, string> = new Map([
    ['square_end', _EClipEndType.OPEN_SQUARE],
    ['round_end', _EClipEndType.OPEN_ROUND],
    ['butt_end', _EClipEndType.OPEN_BUTT]
]);
// Function enums
export enum _EOffset {
    SQUARE_END = 'square_end',
    BUTT_END = 'butt_end'
}
export enum _EOffsetRound {
    SQUARE_END = 'square_end',
    BUTT_END = 'butt_end',
    ROUND_END = 'round_end'
}
export enum _EBooleanMethod {
    INTERSECT = 'intersect',
    DIFFERENCE = 'difference',
    SYMMETRIC = 'symmetric'
}
// ================================================================================================
// get polygons from the model
function _getPgons(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const set_pgons_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.PLINE:
            case EEntType.POINT:
                break;
            case EEntType.PGON:
                set_pgons_i.add(ent_i);
                break;
            case EEntType.COLL:
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                break;
        }
    }
    return Array.from(set_pgons_i);
}
// get polygons and polylines from the model
function _getPgonsPlines(__model__: GIModel, ents_arr: TEntTypeIdx[]): [number[], number[]] {
    const set_pgons_i: Set<number> = new Set();
    const set_plines_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.PLINE:
                set_plines_i.add(ent_i);
                break;
            case EEntType.POINT:
                break;
            case EEntType.PGON:
                set_pgons_i.add(ent_i);
                break;
            case EEntType.COLL:
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                const coll_plines_i: number[] = __model__.modeldata.geom.nav.navCollToPline(ent_i);
                for (const coll_pline_i of coll_plines_i) {
                    set_plines_i.add(coll_pline_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                const ent_plines_i: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const ent_pline_i of ent_plines_i) {
                    set_plines_i.add(ent_pline_i);
                }
                break;
        }
    }
    return [Array.from(set_pgons_i), Array.from(set_plines_i)];
}
// get posis from the model
function _getPosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const set_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POSI:
                set_posis_i.add(ent_i);
                break;
            default:
                const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    set_posis_i.add(ent_posi_i);
                }
                break;
        }
    }
    return Array.from(set_posis_i);
}
// ================================================================================================
// clipperjs -> Mobius Posi
function _getPosiFromMap(__model__: GIModel, x: number, y: number, posis_map: TPosisMap): number {
    // TODO consider using a hash function insetad of a double map
    // try to find this coord in the map
    // if not found, create a new posi and add it to the map
    let posi_i: number;
    let map1 = posis_map.get(x);
    if (map1 !== undefined) {
        posi_i = map1.get(y);
    } else {
        map1 = new Map();
        posis_map.set( x, map1 );
    }
    if (posi_i === undefined) {
        posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, [x, y, 0]);
        map1.set(y, posi_i);
    }
    return posi_i;
}
function _putPosiInMap(x: number, y: number, posi_i: number, posis_map: TPosisMap): void {
    let map1 = posis_map.get(x);
    if (map1 === undefined) {
        map1 = new Map();
    }
    map1.set(y, posi_i);
}
// mobius -> clipperjs
function _convertPgonToShape(__model__: GIModel, pgon_i: number, posis_map: TPosisMap): Shape {
    const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
    const shape_coords: TClipPaths = [];
    for (const wire_i of wires_i) {
        const len: number = shape_coords.push([]);
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            const coord: IClipCoord = {X: xyz[0], Y: xyz[1]};
            shape_coords[len - 1].push( coord );
            _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
        }
    }
    const shape: Shape = new Shape(shape_coords, true);
    shape.scaleUp(SCALE);
    return shape;
}
// clipperjs
function _convertPgonsToShapeUnion(__model__: GIModel, pgons_i: number[], posis_map: TPosisMap): Shape {
    let result_shape: Shape = null;
    for (const pgon_i of pgons_i) {
        const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        if (result_shape == null) {
            result_shape = shape;
        } else {
            result_shape = result_shape.union(shape);
        }
    }
    return result_shape;
}
// clipperjs
function _convertPgonsToShapeJoin(__model__: GIModel, pgons_i: number[], posis_map: TPosisMap): Shape {
    let result_shape: Shape = null;
    for (const pgon_i of pgons_i) {
        const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        if (result_shape == null) {
            result_shape = shape;
        } else {
            result_shape = result_shape.join(shape);
        }
    }
    return result_shape;
}
// mobius -> clipperjs
function _convertWireToShape(__model__: GIModel, wire_i: number, is_closed: boolean, posis_map: TPosisMap): Shape {
    const shape_coords: TClipPaths = [];
    shape_coords.push([]);
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const coord: IClipCoord = {X: xyz[0], Y: xyz[1]};
        shape_coords[0].push( coord );
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    const shape: Shape = new Shape(shape_coords, is_closed);
    shape.scaleUp(SCALE);
    return shape;
}
// mobius -> clipperjs
function _convertPlineToShape(__model__: GIModel, pline_i: number,  posis_map: TPosisMap): Shape {
    const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    const shape_coords: TClipPaths = [];
    shape_coords.push([]);
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const coord: IClipCoord = {X: xyz[0], Y: xyz[1]};
        shape_coords[0].push( coord );
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (is_closed) {
        // close the pline by adding an extra point
        const first: IClipCoord = shape_coords[0][0];
        const last: IClipCoord = {X: first.X, Y: first.Y};
        shape_coords[0].push(last);
    }
    const shape: Shape = new Shape(shape_coords, false); // this is always false, even if pline is closed
    shape.scaleUp(SCALE);
    return shape;
}
// clipperjs -> mobius
function _convertShapesToPgons(__model__: GIModel, shapes: Shape|Shape[], posis_map: TPosisMap): number[] {
    shapes = Array.isArray(shapes) ? shapes : [shapes];
    const pgons_i: number[] = [];
    for (const shape of shapes) {
        shape.scaleDown(SCALE);
        const sep_shapes: Shape[] = shape.separateShapes();
        for (const sep_shape of sep_shapes) {
            const posis_i: number[][] = [];
            const paths: TClipPaths = sep_shape.paths;
            for (const path of paths) {
                if (path.length === 0) { continue; }
                const len: number = posis_i.push([]);
                for (const coord of path) {
                    const posi_i: number = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                    posis_i[len - 1].push(posi_i);
                }
            }
            if (posis_i.length === 0) { continue; }
            const outer_posis_i: number[] = posis_i[0];
            const holes_posis_i: number[][] = posis_i.slice(1);
            const pgon_i: number =  __model__.modeldata.geom.add.addPgon(outer_posis_i, holes_posis_i);
            pgons_i.push(pgon_i);
        }
    }
    return pgons_i;
}
// clipperjs
function _convertShapeToPlines(__model__: GIModel, shape: Shape, is_closed: boolean, posis_map: TPosisMap): number[] {
    shape.scaleDown(SCALE);
    const sep_shapes: Shape[] = shape.separateShapes();
    const plines_i: number[] = [];
    for (const sep_shape of sep_shapes) {
        const paths: TClipPaths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) { continue; }
            const list_posis_i: number[] = [];
            for (const coord of path) {
                const posi_i: number = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                list_posis_i.push(posi_i);
            }
            if (list_posis_i.length < 2) { continue; }
            const pgon_i: number =  __model__.modeldata.geom.add.addPline(list_posis_i, is_closed);
            plines_i.push(pgon_i);
        }
    }
    return plines_i;
}
// clipperjs
function _convertShapeToCutPlines(__model__: GIModel, shape: Shape, posis_map: TPosisMap): number[] {
    shape.scaleDown(SCALE);
    const sep_shapes: Shape[] = shape.separateShapes();
    const lists_posis_i: number[][] = [];
    for (const sep_shape of sep_shapes) {
        const paths: TClipPaths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) { continue; }
            const posis_i: number[] = [];
            // make a list of posis
            for (const coord of path) {
                const posi_i: number = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                posis_i.push(posi_i);
            }
            // must have at least 2 posis
            if (posis_i.length < 2) { continue; }
            // add the list
            lists_posis_i.push(posis_i);
        }
    }
    // see if there is a join between two lists
    // this can occur when boolean with closed polylines
    // for each closed polyline in the input, there can only be one merge
    // this is the point where the end meets the start
    const to_merge: number[][] = [];
    for (let p = 0; p < lists_posis_i.length; p++) {
        const posis0: number[] = lists_posis_i[p];
        for (let q = 0; q < lists_posis_i.length; q++) {
            const posis1: number[] = lists_posis_i[q];
            if (p !== q && posis0[posis0.length - 1] === posis1[0]) {
                to_merge.push([p, q]);
            }
        }
    }
    for (const [p, q] of to_merge) {
        // copy posis from sub list q to sub list p
        // skip the first posi
        for (let idx = 1; idx < lists_posis_i[q].length; idx++) {
            const posi_i: number = lists_posis_i[q][idx];
            lists_posis_i[p].push(posi_i);
        }
        // set sub list q to null
        lists_posis_i[q] = null;
    }
    // create plines and check closed
    const plines_i: number[] = [];
    for (const posis_i of lists_posis_i) {
        if (posis_i === null) { continue; }
        const is_closed = posis_i[0] === posis_i[posis_i.length - 1];
        if (is_closed) { posis_i.splice(posis_i.length - 1, 1); }
        const pline_i: number = __model__.modeldata.geom.add.addPline(posis_i, is_closed);
        plines_i.push( pline_i );
    }
    // return the list of new plines
    return plines_i;
}
// clipperjs
function _printPaths(paths: TClipPaths, mesage: string) {
    console.log(mesage);
    for (const path of paths) {
        console.log('    PATH');
        for (const coord of path) {
            console.log('        ', JSON.stringify(coord));
        }
    }
}
// ================================================================================================
// d3
// ================================================================================================
/**
 * Create a voronoi subdivision of one or more polygons.
 * \n
 * @param __model__
 * @param pgons A list of polygons, or entities from which polygons can be extracted.
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export function Voronoi(__model__: GIModel, pgons: TId|TId[], entities: TId|TId[]): TId[] {
    pgons = arrMakeFlat(pgons) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(pgons)) { return []; }
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Voronoi';
    let pgons_ents_arr: TEntTypeIdx[];
    let posis_ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        pgons_ents_arr = checkIDs(__model__, fn_name, 'pgons', pgons,
            [ID.isIDL], null) as TEntTypeIdx[];
        posis_ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // pgons_ents_arr = splitIDs(fn_name, 'pgons', pgons,
        //     [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // posis_ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        pgons_ents_arr = idsBreak(pgons) as TEntTypeIdx[];
        posis_ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    // pgons
    const pgons_i: number[] = _getPgons(__model__, pgons_ents_arr);
    if (pgons_i.length === 0) { return []; }
    // posis
    const posis_i: number[] = _getPosis(__model__, posis_ents_arr);
    if (posis_i.length === 0) { return []; }
    // posis
    const d3_cell_points: [number, number][] = [];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        d3_cell_points.push([xyz[0], xyz[1]]);
    }
    // loop and create cells
    const all_cells_i: number[] = [];
    for (const pgon_i of pgons_i) {
        // pgon and bounds
        const bounds: number[] = [Infinity, Infinity, -Infinity, -Infinity]; // xmin, ymin, xmax, ymax
        // const pgon_shape_coords: IClipCoord[] = [];
        for (const posi_i of __model__.modeldata.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i)) {
            const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            // pgon_shape_coords.push( { X: xyz[0], Y: xyz[1]} );
            if (xyz[0] < bounds[0]) { bounds[0] = xyz[0]; }
            if (xyz[1] < bounds[1]) { bounds[1] = xyz[1]; }
            if (xyz[0] > bounds[2]) { bounds[2] = xyz[0]; }
            if (xyz[1] > bounds[3]) { bounds[3] = xyz[1]; }
        }
        // const pgon_shape: Shape = new Shape([pgon_shape_coords], true); // TODO holes
        const pgon_shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        // pgon_shape.scaleUp(SCALE);
        // create voronoi
        const cells_i: number[] = _voronoiOld(__model__, pgon_shape, d3_cell_points, bounds, posis_map);
        for (const cell_i of cells_i) {
            all_cells_i.push(cell_i);
        }
    }
    // return cell pgons
    return idsMakeFromIdxs(EEntType.PGON, all_cells_i) as TId[];
    // return idsMake(all_cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
// There is a bug in d3 new voronoi, it produces wrong results...
// function _voronoi(__model__: GIModel, pgon_shape: Shape, d3_cell_points: [number, number][],
//         bounds: number[], posis_map: TPosisMap): number[] {
//     const d3_delaunay = Delaunay.from(d3_cell_points);
//     const d3_voronoi = d3_delaunay.voronoi(bounds);
//     const shapes: Shape[] = [];
//     for (const d3_cell_coords of Array.from(d3_voronoi.cellPolygons())) {
//         const clipped_shape: Shape = _voronoiClip(__model__, pgon_shape, d3_cell_coords as [number, number][]);
//         shapes.push(clipped_shape);
//     }
//     return _convertShapesToPgons(__model__, shapes, posis_map);
// }
// function _voronoiClip(__model__: GIModel, pgon_shape: Shape, d3_cell_coords: [number, number][]): Shape {
//     const cell_shape_coords: IClipCoord[] = [];
//     // for (const d3_cell_coord of d3_cell_coords) {
//     for (let i = 0; i < d3_cell_coords.length - 1; i++) {
//         cell_shape_coords.push( {X: d3_cell_coords[i][0], Y: d3_cell_coords[i][1]} );
//     }
//     const cell_shape: Shape = new Shape([cell_shape_coords], true);
//     cell_shape.scaleUp(SCALE);
//     const clipped_shape: Shape = pgon_shape.intersect(cell_shape);
//     return clipped_shape;
// }
function _voronoiOld(__model__: GIModel, pgon_shape: Shape, d3_cell_points: [number, number][],
        bounds: number[], posis_map: TPosisMap): number[] {
    const d3_voronoi = d3vor.voronoi().extent([   [bounds[0], bounds[1]],    [bounds[2], bounds[3]]   ]);
    const d3_voronoi_diag = d3_voronoi(d3_cell_points);
    const shapes: Shape[] = [];
    for (const d3_cell_coords of d3_voronoi_diag.polygons()) {
        if (d3_cell_coords !== undefined) {
            const clipped_shape: Shape = _voronoiClipOld(__model__, pgon_shape, d3_cell_coords as [number, number][]);
            shapes.push(clipped_shape);
        }
    }
    return _convertShapesToPgons(__model__, shapes, posis_map);
}
function _voronoiClipOld(__model__: GIModel, pgon_shape: Shape, d3_cell_coords: [number, number][]): Shape {
    const cell_shape_coords: IClipCoord[] = [];
    // for (const d3_cell_coord of d3_cell_coords) {
    for (let i = 0; i < d3_cell_coords.length; i++) {
        cell_shape_coords.push( {X: d3_cell_coords[i][0], Y: d3_cell_coords[i][1]} );
    }
    const cell_shape: Shape = new Shape([cell_shape_coords], true);
    cell_shape.scaleUp(SCALE);
    const clipped_shape: Shape = pgon_shape.intersect(cell_shape);
    return clipped_shape;
}
// ================================================================================================
/**
 * Create a delaunay triangulation of set of positions.
 * \n
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export function Delaunay(__model__: GIModel, entities: TId|TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Delaunay';
    let posis_ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        posis_ents_arr = checkIDs(__model__, fn_name, 'entities1', entities,
            [ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // posis_ents_arr = splitIDs(fn_name, 'entities1', entities,
        // [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        posis_ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    // posis
    const posis_i: number[] = _getPosis(__model__, posis_ents_arr);
    if (posis_i.length === 0) { return []; }
    // posis
    const d3_tri_coords: [number, number][] = [];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        d3_tri_coords.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    // create delaunay triangulation
    const cells_i: number[] = _delaunay(__model__, d3_tri_coords, posis_map);
    // return cell pgons
    return idsMakeFromIdxs(EEntType.PGON, cells_i) as TId[];
    // return idsMake(cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
function _delaunay(__model__: GIModel, d3_tri_coords: [number, number][], posis_map: TPosisMap): number[] {
    const new_pgons_i: number[] = [];
    const delaunay = d3del.Delaunay.from(d3_tri_coords);
    const delaunay_posis_i: number[] = [];
    for (const d3_tri_coord of d3_tri_coords) {
        // TODO use the posis_map!!
        // const deauny_posi_i: number = __model__.modeldata.geom.add.addPosi();
        // __model__.modeldata.attribs.add.setPosiCoords(deauny_posi_i, [point[0], point[1], 0]);
        const delaunay_posi_i: number = _getPosiFromMap(__model__, d3_tri_coord[0], d3_tri_coord[1], posis_map);
        delaunay_posis_i.push(delaunay_posi_i);
    }
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
        const a: number = delaunay_posis_i[delaunay.triangles[i]];
        const b: number = delaunay_posis_i[delaunay.triangles[i + 1]];
        const c: number = delaunay_posis_i[delaunay.triangles[i + 2]];
        new_pgons_i.push(__model__.modeldata.geom.add.addPgon([c, b, a]));
    }
    return new_pgons_i;
}
// ================================================================================================
/**
 * Create a voronoi subdivision of a polygon.
 *
 * @param __model__
 * @param entities A list of positions, or entities from which positions can bet extracted.
 * @returns A new polygons, the convex hull of the positions.
 */
export function ConvexHull(__model__: GIModel, entities: TId|TId[]): TId {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return null; }
    // --- Error Check ---
    const fn_name = 'poly2d.ConvexHull';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // posis
    const posis_i: number[] = _getPosis(__model__, ents_arr);
    if (posis_i.length === 0) { return null; }
    const hull_posis_i: number[] = _convexHull(__model__, posis_i);
    // return cell pgons
    const hull_pgon_i: number = __model__.modeldata.geom.add.addPgon(hull_posis_i);
    return idMake(EEntType.PGON, hull_pgon_i) as TId;
}
function _convexHull(__model__: GIModel, posis_i: number[]): number[] {
    const points: [number, number][] = [];
    const posis_map: TPosisMap = new Map();
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        points.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (points.length < 3) { return null; }
    // loop and create hull
    const hull_points: [number, number][] = d3poly.polygonHull(points);
    const hull_posis_i: number[] = [];
    for (const hull_point of hull_points) {
        const hull_posi_i: number = _getPosiFromMap(__model__, hull_point[0], hull_point[1], posis_map);
        hull_posis_i.push(hull_posi_i);
    }
    hull_posis_i.reverse();
    return hull_posis_i;
}
// ================================================================================================
export enum _EBBoxMethod {
    AABB = 'aabb',
    OBB = 'obb'
}
/**
 * Create a polygon that is a 2D bounding box of the entities.
 * \n
 * For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.
 * \n
 *
 * @param __model__
 * @param entities A list of positions, or entities from which positions can bet extracted.
 * @param method Enum, the method for generating the bounding box.
 * @returns A new polygon, the bounding box of the positions.
 */
export function BBoxPolygon(__model__: GIModel, entities: TId|TId[], method: _EBBoxMethod): TId {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return null; }
    // --- Error Check ---
    const fn_name = 'poly2d.BBoxPolygon';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // posis
    const posis_i: number[] = _getPosis(__model__, ents_arr);
    if (posis_i.length === 0) { return null; }
    let pgon_i: number;
    switch (method) {
        case _EBBoxMethod.AABB:
            pgon_i = _bboxAABB(__model__, posis_i);
            break;
        case _EBBoxMethod.OBB:
            pgon_i = _bboxOBB(__model__, posis_i);
            break;
        default:
            break;
    }
    return idMake(EEntType.PGON, pgon_i) as TId;
}
function _bboxAABB(__model__: GIModel, posis_i: number[]): number {
    const bbox: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        if (xyz[0] < bbox[0]) { bbox[0] = xyz[0]; }
        if (xyz[1] < bbox[1]) { bbox[1] = xyz[1]; }
        if (xyz[0] > bbox[2]) { bbox[2] = xyz[0]; }
        if (xyz[1] > bbox[3]) { bbox[3] = xyz[1]; }
    }
    const a: Txyz = [bbox[0], bbox[1], 0];
    const b: Txyz = [bbox[2], bbox[1], 0];
    const c: Txyz = [bbox[2], bbox[3], 0];
    const d: Txyz = [bbox[0], bbox[3], 0];
    const box_posis_i: number[] = [];
    for (const xyz of [a, b, c, d]) {
        const box_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(box_posi_i, xyz);
        box_posis_i.push(box_posi_i);
    }
    const box_pgon_i: number = __model__.modeldata.geom.add.addPgon(box_posis_i);
    return box_pgon_i;
}
function _bboxOBB(__model__: GIModel, posis_i: number[]): number {
    // posis
    const hull_posis_i: number[] = _convexHull(__model__, posis_i);
    hull_posis_i.push(hull_posis_i[0]);
    const first: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(hull_posis_i[0]);
    const hull_xyzs: Txyz[] = [[first[0], first[1], 0]];
    let longest_len = 0;
    let origin_index = -1;
    for (let i = 1; i < hull_posis_i.length; i++) {
        // add xy to list
        const next: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(hull_posis_i[i]);
        hull_xyzs.push([next[0], next[1], 0]);
        // get dist
        const curr_len = distance(hull_xyzs[i - 1], hull_xyzs[i]);
        if (curr_len > longest_len) {
            longest_len = curr_len;
            origin_index = i - 1;
        }
    }
    // get the plane
    const origin: Txyz = hull_xyzs[origin_index];
    const x_vec: Txyz = vecNorm(vecFromTo( origin, hull_xyzs[origin_index + 1] ));
    const y_vec: Txyz = [-x_vec[1], x_vec[0], 0]; // vecCross([0, 0, 1], x_vec);
    const source_pln: TPlane = [origin, x_vec, y_vec];
    // xform posis and get min max
    const bbox: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    const target_pln: TPlane = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
    const matrix: Matrix4 = xfromSourceTargetMatrix(source_pln, target_pln);
    for (const xyz of hull_xyzs) {
        const new_xyz: Txyz = multMatrix(xyz, matrix);
        if (new_xyz[0] < bbox[0]) { bbox[0] = new_xyz[0]; }
        if (new_xyz[1] < bbox[1]) { bbox[1] = new_xyz[1]; }
        if (new_xyz[0] > bbox[2]) { bbox[2] = new_xyz[0]; }
        if (new_xyz[1] > bbox[3]) { bbox[3] = new_xyz[1]; }
    }
    // calc the bbx
    const a: Txyz = vecAdd(origin, vecMult(x_vec, bbox[0]));
    const b: Txyz = vecAdd(origin, vecMult(x_vec, bbox[2]));
    const height_vec: Txyz = vecMult(y_vec, bbox[3] - bbox[1]);
    const c: Txyz = vecAdd(b, height_vec);
    const d: Txyz = vecAdd(a, height_vec);
    const box_posis_i: number[] = [];
    for (const xyz of [a, b, c, d]) {
        const box_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(box_posi_i, xyz);
        box_posis_i.push(box_posi_i);
    }
    const box_pgon_i: number = __model__.modeldata.geom.add.addPgon(box_posis_i);
    return box_pgon_i;
}
function _distance2d(xy1: Txy, xy2: Txy): number {
    const x = xy1[0] - xy2[0];
    const y = xy1[1] - xy2[1];
    return Math.sqrt(x * x + y * y);
}
// ================================================================================================
/**
 * Create the union of a set of polygons.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can bet extracted.
 * @returns A list of new polygons.
 */
export function Union(__model__: GIModel, entities: TId|TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Union';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const pgons_i: number[] = _getPgons(__model__, ents_arr);
    if (pgons_i.length === 0) { return []; }
    const result_shape: Shape = _convertPgonsToShapeUnion(__model__, pgons_i, posis_map);
    if (result_shape === null) { return []; }
    const all_new_pgons: number[] = _convertShapesToPgons(__model__, result_shape, posis_map);
    return idsMakeFromIdxs(EEntType.PGON, all_new_pgons) as TId[];
    // return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
}
// ================================================================================================
/**
 * Perform a boolean operation on polylines or polygons.
 * \n
 * The entities in A can be either polyline or polygons.
 * The entities in B must be polygons.
 * The polygons in B are first unioned before the operation is performed.
 * The boolean operation is then performed between each polyline or polygon in A, and the unioned B polygons.
 * \n
 * If A is an empty list, then an empty list is returned.
 * If B is an empty list, then the A list is returned.
 * \n
 * @param __model__
 * @param a_entities A list of polyline or polygons, or entities from which polyline or polygons can be extracted.
 * @param b_entities A list of polygons, or entities from which polygons can be extracted.
 * @param method Enum, the boolean operator to apply.
 * @returns A list of new polylines and polygons.
 */
export function Boolean(__model__: GIModel, a_entities: TId|TId[], b_entities: TId|TId[], method: _EBooleanMethod): TId[] {
    a_entities = arrMakeFlat(a_entities) as TId[];
    if (isEmptyArr(a_entities)) { return []; }
    b_entities = arrMakeFlat(b_entities) as TId[];
    if (isEmptyArr(b_entities)) { return a_entities; }
    // --- Error Check ---
    const fn_name = 'poly2d.Boolean';
    let a_ents_arr: TEntTypeIdx[];
    let b_ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        a_ents_arr = checkIDs(__model__, fn_name, 'a_entities', a_entities,
        [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
        b_ents_arr = checkIDs(__model__, fn_name, 'b_entities', b_entities,
        [ID.isID, ID.isIDL], null) as TEntTypeIdx[];
    } else {
        // a_ents_arr = splitIDs(fn_name, 'a_entities', a_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // b_ents_arr = splitIDs(fn_name, 'b_entities', b_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        a_ents_arr = idsBreak(a_entities) as TEntTypeIdx[];
        b_ents_arr = idsBreak(b_entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const [a_pgons_i, a_plines_i]: [number[], number[]] = _getPgonsPlines(__model__, a_ents_arr);
    const b_pgons_i: number[] = _getPgons(__model__, b_ents_arr);
    if (a_pgons_i.length === 0 && a_plines_i.length === 0) { return []; }
    if (b_pgons_i.length === 0) { return []; }
    // const a_shape: Shape = _convertPgonsToShapeUnion(__model__, a_pgons_i, posis_map);
    const b_shape: Shape = _convertPgonsToShapeUnion(__model__, b_pgons_i, posis_map);
    // call the boolean function
    const new_pgons_i: number[] = _booleanPgons(__model__, a_pgons_i, b_shape, method, posis_map);
    const new_plines_i: number[] = _booleanPlines(__model__, a_plines_i, b_shape, method, posis_map);
    // make the list of polylines and polygons
    const result_ents: TId[] = [];
    const new_pgons: TId[] = idsMakeFromIdxs(EEntType.PGON, new_pgons_i) as TId[];
    // const new_pgons: TId[] = idsMake(new_pgons_i.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
    for (const new_pgon of new_pgons) {
        result_ents.push(new_pgon);
    }
    const new_plines: TId[] = idsMakeFromIdxs(EEntType.PLINE, new_plines_i) as TId[];
    // const new_plines: TId[] = idsMake(new_plines_i.map( pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx )) as TId[];
    for (const new_pline of new_plines) {
        result_ents.push(new_pline);
    }
    // always return a list
    return result_ents;
}
function _booleanPgons(__model__: GIModel, pgons_i: number|number[], b_shape: Shape,
        method: _EBooleanMethod, posis_map: TPosisMap): number[] {
    if (!Array.isArray(pgons_i)) {
        pgons_i = pgons_i as number;
        const a_shape: Shape = _convertPgonToShape(__model__, pgons_i, posis_map);
        let result_shape: Shape;
        switch (method) {
            case _EBooleanMethod.INTERSECT:
                result_shape = a_shape.intersect(b_shape);
                break;
            case _EBooleanMethod.DIFFERENCE:
                result_shape = a_shape.difference(b_shape);
                break;
            case _EBooleanMethod.SYMMETRIC:
                result_shape = a_shape.xor(b_shape);
                break;
            default:
                break;
        }
        return _convertShapesToPgons(__model__, result_shape, posis_map);
    } else {
        pgons_i = pgons_i as number[];
        const all_new_pgons: number[] = [];
        for (const pgon_i of pgons_i) {
            const result_pgons_i: number[] = _booleanPgons(__model__, pgon_i, b_shape, method, posis_map);
            for (const result_pgon_i of result_pgons_i) {
                all_new_pgons.push(result_pgon_i);
            }
        }
        return all_new_pgons;
    }
}
function _booleanPlines(__model__: GIModel, plines_i: number|number[], b_shape: Shape,
        method: _EBooleanMethod, posis_map: TPosisMap): number[] {
    if (!Array.isArray(plines_i)) {
        plines_i = plines_i as number;
        // const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(plines_i);
        // const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
        // const a_shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
        const a_shape: Shape = _convertPlineToShape(__model__, plines_i, posis_map);
        let result_shape: Shape;
        switch (method) {
            case _EBooleanMethod.INTERSECT:
                result_shape = a_shape.intersect(b_shape);
                break;
            case _EBooleanMethod.DIFFERENCE:
                result_shape = a_shape.difference(b_shape);
                break;
            case _EBooleanMethod.SYMMETRIC:
                // the perimeter of the B polygon is included in the output
                // but the perimeter is not closed, which seems strange
                result_shape = a_shape.xor(b_shape);
                break;
            default:
                break;
        }
        return _convertShapeToCutPlines(__model__, result_shape, posis_map);
    } else {
        plines_i = plines_i as number[];
        const all_new_plines: number[] = [];
        for (const pline_i of plines_i) {
            const result_plines_i: number[] = _booleanPlines(__model__, pline_i, b_shape, method, posis_map);
            for (const result_pline_i of result_plines_i) {
                all_new_plines.push(result_pline_i);
            }
        }
        return all_new_plines;
    }
}
// ================================================================================================
/**
 * Offset a polyline or polygon, with mitered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param limit Mitre limit
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export function OffsetMitre(__model__: GIModel, entities: TId|TId[], dist: number,
        limit: number, end_type: _EOffset): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetMitre';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'miter_limit', limit, [chk.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.MITER,
        endType: MClipOffsetEndType.get(end_type),
        miterLimit: limit / dist
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    // for (const [ent_type, ent_i] of ents_arr) {
    //     const new_pgons_i: number[] = _offset(__model__, ent_type, ent_i, dist, options);
    //     if (new_pgons_i !== null) {
    //         for (const new_pgon_i of new_pgons_i) {
    //             all_new_pgons.push([EEntType.PGON, new_pgon_i]);
    //         }
    //     }
    // }
    return idsMake(all_new_pgons) as TId[];
}
/**
 * Offset a polyline or polygon, with chamfered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export function OffsetChamfer(__model__: GIModel, entities: TId|TId[], dist: number,
        end_type: _EOffset): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetChamfer';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.SQUARE,
        endType: MClipOffsetEndType.get(end_type)
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    // for (const [ent_type, ent_i] of ents_arr) {
    //     const new_pgons_i: number[] = _offset(__model__, ent_type, ent_i, dist, options);
    //     if (new_pgons_i !== null) {
    //         for (const new_pgon_i of new_pgons_i) {
    //             all_new_pgons.push([EEntType.PGON, new_pgon_i]);
    //         }
    //     }
    // }
    return idsMake(all_new_pgons) as TId[];
}
/**
 * Offset a polyline or polygon, with round joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param tolerance The tolerance for the rounded corners.
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export function OffsetRound(__model__: GIModel, entities: TId|TId[], dist: number,
        tolerance: number, end_type: _EOffsetRound): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetRound';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.ROUND,
        endType: MClipOffsetEndType.get(end_type),
        roundPrecision: tolerance * SCALE
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    return idsMake(all_new_pgons) as TId[];
}
function _offsetPgon(__model__: GIModel, pgon_i: number, dist: number,
        options: IClipOffsetOptions, posis_map: TPosisMap): number[] {
    options.endType = _EClipEndType.CLOSED_PGON;
    const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
    const result: IClipResult = shape.offset(dist * SCALE, options);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
function _offsetPline(__model__: GIModel, pline_i: number, dist: number,
        options: IClipOffsetOptions, posis_map: TPosisMap): number[] {
    const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    if (is_closed) {
        options.endType = _EClipEndType.CLOSED_PLINE;
    }
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
    const result: IClipResult = shape.offset(dist * SCALE, options);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
// ================================================================================================
/**
 * Adds vertices to polyline and polygons at all locations where egdes intersect one another.
 * The vertices are welded.
 * This can be useful for creating networks that can be used for shortest path calculations.
 * \n
 * The input polyline and polygons are copied.
 * \n
 * @param __model__
 * @param entities A list polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @returns Copies of the input polyline and polygons, stiched.
 */
export function Stitch(__model__: GIModel, entities: TId|TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Stitch';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isIDL], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_common.copyGeom(ents_arr, true) as TEntTypeIdx[];
    __model__.modeldata.funcs_common.clonePosisInEntsAndMove(new_ents_arr, true, [0, 0, 0]);
    // create maps for data
    const map_edge_i_to_posi_i: Map<number, [number, number]> = new Map();
    const map_edge_i_to_bbox: Map<number, [Txy, Txy]> = new Map();
    const map_posi_i_to_xyz: Map<number, Txyz> = new Map();
    // get the edges
    // const ents_arr2: TEntTypeIdx[] = [];
    // const edges_i: number[] = [];
    // for (const pline_i of __model__.modeldata.geom.add.copyPlines(Array.from(set_plines_i), true) as number[]) {
    //     ents_arr2.push([EEntType.PLINE, pline_i]);
    //     const ent_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
    //     for (const edge_i of ent_edges_i) {
    //         edges_i.push(edge_i);
    //         _knifeGetEdgeData(__model__, edge_i, map_edge_i_to_posi_i, map_edge_i_to_bbox, map_posi_i_to_xyz);
    //     }
    // }
    const edges_i: number[] = [];
    for (const [ent_type, ent_i] of new_ents_arr) {
        const ent_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const ent_edge_i of ent_edges_i) {
            edges_i.push(ent_edge_i);
            _knifeGetEdgeData(__model__, ent_edge_i, map_edge_i_to_posi_i, map_edge_i_to_bbox, map_posi_i_to_xyz);
        }
    }
    // get the edges and the data for each edge
    const map_edge_i_to_isects: Map<number, [number, number][]> = new Map();
    const map_edge_i_to_edge_i: Map<number, Set<number>> = new Map();
    for (const a_edge_i of edges_i) {
        const a_posis_i: [number, number] = map_edge_i_to_posi_i.get(a_edge_i);
        const a_xyz0: Txyz = map_posi_i_to_xyz.get(a_posis_i[0]);
        const a_xyz1: Txyz = map_posi_i_to_xyz.get(a_posis_i[1]);
        const a_xys: [Txy, Txy] = [[a_xyz0[0], a_xyz0[1]], [a_xyz1[0], a_xyz1[1]]];
        const a_bbox: [Txy, Txy] = map_edge_i_to_bbox.get(a_edge_i);
        for (const b_edge_i of edges_i) {
            // if this is same edge, continue
            if (a_edge_i === b_edge_i) { continue; }
            // if we have already done this pair of edges, continue
            if (map_edge_i_to_edge_i.has(a_edge_i)) {
                if (map_edge_i_to_edge_i.get(a_edge_i).has(b_edge_i)) { continue; }
            }
            const b_posis_i: [number, number] = map_edge_i_to_posi_i.get(b_edge_i);
            const b_xyz0: Txyz = map_posi_i_to_xyz.get(b_posis_i[0]);
            const b_xyz1: Txyz = map_posi_i_to_xyz.get(b_posis_i[1]);
            const b_xys: [Txy, Txy] = [[b_xyz0[0], b_xyz0[1]], [b_xyz1[0], b_xyz1[1]]];
            const b_bbox: [Txy, Txy] = map_edge_i_to_bbox.get(b_edge_i);
            if (_knifeOverlap(a_bbox, b_bbox)) {
                const isect: [number, number, Txy] = _knifeIntersect(a_xys, b_xys);
                if (isect !== null) {
                    let a_isect = true;
                    let b_isect = true;
                    const s = isect[0];
                    const t = isect[1];
                    const new_xy = isect[2];
                    // get or create the new posi
                    let new_posi_i: number = null;
                    // check if we are at the start or end of 'a' edge
                    if (s === 0) {
                        a_isect = false;
                        new_posi_i = a_posis_i[0];
                    } else if (s === 1) {
                        a_isect = false;
                        new_posi_i = a_posis_i[1];
                    }
                    // check if we are at the start or end of 'b' edge
                    if (t === 0) {
                        b_isect = false;
                        new_posi_i = b_posis_i[0];
                    } else if (t === 1) {
                        b_isect = false;
                        new_posi_i = b_posis_i[1];
                    }
                    // make a new position if we have an isect,
                    if (new_posi_i === null && (a_isect || b_isect)) {
                        new_posi_i = __model__.modeldata.geom.add.addPosi();
                        __model__.modeldata.attribs.posis.setPosiCoords(new_posi_i, [new_xy[0], new_xy[1], 0]);
                    }
                    // store the isects if there are any
                    if (a_isect) {
                        if (!map_edge_i_to_isects.has(a_edge_i)) {
                            map_edge_i_to_isects.set(a_edge_i, []);
                        }
                        map_edge_i_to_isects.get(a_edge_i).push( [s, new_posi_i] );
                    }
                    if (b_isect) {
                        if (!map_edge_i_to_isects.has(b_edge_i)) {
                            map_edge_i_to_isects.set(b_edge_i, []);
                        }
                        map_edge_i_to_isects.get(b_edge_i).push( [t, new_posi_i] );
                    }
                    // now remember that we did this pair already, so we don't do it again
                    if (!map_edge_i_to_edge_i.has(b_edge_i)) {
                        map_edge_i_to_edge_i.set(b_edge_i, new Set());
                    }
                    map_edge_i_to_edge_i.get(b_edge_i).add(a_edge_i);
                }
            }
        }
    }
    // const all_new_edges_i: number[] = [];
    const all_new_edges_i: number[] = [];
    for (const edge_i of map_edge_i_to_isects.keys()) {
        // isect [t, posi_i]
        const isects: [number, number][] = map_edge_i_to_isects.get(edge_i);
        isects.sort( (a, b) => a[0] - b[0] );
        const posis_i: number[] = isects.map(isect => isect[1]);
        const new_edges_i: number[] = __model__.modeldata.geom.edit_topo.insertVertsIntoWire(edge_i, posis_i);
        for (const new_edge_i of new_edges_i) {
            all_new_edges_i.push(new_edge_i);
        }
    }
    // check if any new edges are zero length
    const del_posis_i: number[] = [];
    for (const edge_i of all_new_edges_i) {
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyzs: Txyz[] = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
        const dist: number = distanceManhattan(xyzs[0], xyzs[1]);
        if (dist === 0) {
            // we are going to del this posi
            const del_posi_i: number = posis_i[0];
            // get the vert of this edge
            const verts_i: number[] = __model__.modeldata.geom.nav.navEdgeToVert(edge_i);
            const del_vert_i: number = verts_i[0];
            // we need to make sure we dont disconnect any edges in the process
            // so we get all the verts connected to this edge
            // for each other edge, we will replace the posi for the vert that would have been deleted
            // the posi will be posis_i[1]
            const replc_verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(del_posi_i);
            for (const replc_vert_i of replc_verts_i) {
                if (replc_vert_i === del_vert_i) { continue; }
                __model__.modeldata.geom.edit_topo.replaceVertPosi(replc_vert_i, posis_i[1], false); // false = do nothing if edge becomes invalid
            }
            del_posis_i.push(posis_i[0]);
        }
    }
    const ssid: number = __model__.modeldata.active_ssid;
    __model__.modeldata.geom.snapshot.delPosis(ssid, del_posis_i);
    // return
    return idsMake(new_ents_arr) as TId[];
}
function _knifeGetEdgeData(__model__: GIModel, edge_i: number,
        map_edge_i_to_posi_i: Map<number, [number, number]>,
        map_edge_i_to_bbox: Map<number, [Txy, Txy]>,
        map_posi_i_to_xyz: Map<number, Txyz>): void {
    // get the two posis
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    // save the two posis_i
    map_edge_i_to_posi_i.set(edge_i, [posis_i[0], posis_i[1]]);
    // save the xy value of the two posis
    if (!map_posi_i_to_xyz.has(posis_i[0])) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        __model__.modeldata.attribs.posis.setPosiCoords(posis_i[0], [xyz[0], xyz[1], 0]);
        // Why is this not working? It also moves the original geom...
        // if (xyz[2] !== 0) { xyz[2] = 0; } // TODO <<<<<<<<<<<<<<<<<<<<<<
        map_posi_i_to_xyz.set(posis_i[0], xyz);
    }
    if (!map_posi_i_to_xyz.has(posis_i[1])) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        __model__.modeldata.attribs.posis.setPosiCoords(posis_i[1], [xyz[0], xyz[1], 0]);
        // Why is this not working? It also moves the original geom...
        // if (xyz[2] !== 0) { xyz[2] = 0; } // TODO <<<<<<<<<<<<<<<<<<<<<<
        map_posi_i_to_xyz.set(posis_i[1], xyz);
    }
    // save the bbox
    const xyz0: Txyz = map_posi_i_to_xyz.get(posis_i[0]);
    const xyz1: Txyz = map_posi_i_to_xyz.get(posis_i[1]);
    const xys: [Txy, Txy] = [[xyz0[0], xyz0[1]], [xyz1[0], xyz1[1]]];
    const x_min: number = xys[0][0] < xys[1][0] ? xys[0][0] : xys[1][0];
    const x_max: number = xys[0][0] > xys[1][0] ? xys[0][0] : xys[1][0];
    const y_min: number = xys[0][1] < xys[1][1] ? xys[0][1] : xys[1][1];
    const y_max: number = xys[0][1] > xys[1][1] ? xys[0][1] : xys[1][1];
    map_edge_i_to_bbox.set( edge_i, [[x_min, y_min], [x_max, y_max]] );
}
function _knifeOverlap(bbox1: [Txy, Txy], bbox2: [Txy, Txy]): boolean {
    if (bbox2[1][0] < bbox1[0][0]) { return false; }
    if (bbox2[0][0] > bbox1[1][0]) { return false; }
    if (bbox2[1][1] < bbox1[0][1]) { return false; }
    if (bbox2[0][1] > bbox1[1][1]) { return false; }
    return true;
}
function _knifeIntersect(l1: [Txy, Txy], l2: [Txy, Txy]): [number, number, Txy] {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const x1 = l1[0][0];
    const y1 = l1[0][1];
    const x2 = l1[1][0];
    const y2 = l1[1][1];
    const x3 = l2[0][0];
    const y3 = l2[0][1];
    const x4 = l2[1][0];
    const y4 = l2[1][1];
    const denominator  = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    if (denominator === 0) { return null; }
    const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
    if ((t >= 0 && t <= 1) && (u >= 0 && u <= 1)) {
        const new_xy: Txy = [x1 + (t * x2) - (t * x1), y1 + (t * y2) - (t * y1)];
        return [t, u, new_xy];
    }
    return null;
}

// ================================================================================================
/**
 * Clean a polyline or polygon.
 * \n
 * Vertices that are closer together than the specified tolerance will be merged.
 * Vertices that are colinear within the tolerance distance will be deleted.
 * \n
 * @param __model__
 * @param entities A list of polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for deleting vertices from the polyline.
 * @returns A list of new polygons.
 */
export function Clean(__model__: GIModel, entities: TId|TId[], tolerance: number): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Clean';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_ents: TEntTypeIdx[] = [];
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _cleanPgon(__model__, pgon_i, tolerance, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_ents.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_plines_i: number[] = _cleanPline(__model__, pline_i, tolerance, posis_map);
        for (const new_pline_i of new_plines_i) {
            all_new_ents.push([EEntType.PLINE, new_pline_i]);
        }
    }
    return idsMake(all_new_ents) as TId[];
}
function _cleanPgon(__model__: GIModel, pgon_i: number, tolerance: number, posis_map: TPosisMap): number[] {
    const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
function _cleanPline(__model__: GIModel, pline_i: number, tolerance: number, posis_map: TPosisMap): number[] {
    const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.WIRE,  wire_i);
    if (verts_i.length === 2) { return [pline_i]; }
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    const shape_num_verts: number = result_shape.paths[0].length;
    if (shape_num_verts === 0 || shape_num_verts === verts_i.length) { return [pline_i]; }
    return _convertShapeToPlines(__model__, result_shape, result.closed, posis_map);
}
