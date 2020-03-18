/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType, TId, TEntTypeIdx, Txyz, Txy, TPlane, TBBox } from '@libs/geo-info/common';
import { arrMakeFlat } from '@assets/libs/util/arrs';
import { checkIDs, IDcheckObj, TypeCheckObj, checkArgTypes } from '../_check_args';
import Shape from '@doodle3d/clipper-js';
import { isEmptyArr, isPgon, idsMake } from '@assets/libs/geo-info/id';
import {Delaunay} from 'd3-delaunay';
import * as d3 from 'd3-polygon';
import { inflate } from 'zlib';
import { distance } from '@assets/libs/geom/distance';
import { vecFromTo, vecNorm, vecCross, vecMult, vecAdd, vecSub } from '@assets/libs/geom/vectors';
import { xfromSourceTargetMatrix, multMatrix } from '@assets/libs/geom/matrix';
import { Matrix4 } from 'three';
import { number } from '@assets/core/inline/_mathjs';

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
                const coll_pgons_i: number[] = __model__.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.geom.nav.navAnyToPgon(ent_type, ent_i);
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
                const coll_pgons_i: number[] = __model__.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                const coll_plines_i: number[] = __model__.geom.nav.navCollToPline(ent_i);
                for (const coll_pline_i of coll_plines_i) {
                    set_plines_i.add(coll_pline_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                const ent_plines_i: number[] = __model__.geom.nav.navAnyToPline(ent_type, ent_i);
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
                const ent_posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, ent_i);
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
        posi_i = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(posi_i, [x, y, 0]);
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
    const wires_i: number[] = __model__.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
    const shape_coords: TClipPaths = [];
    for (const wire_i of wires_i) {
        const len: number = shape_coords.push([]);
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
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
    const posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        const coord: IClipCoord = {X: xyz[0], Y: xyz[1]};
        shape_coords[0].push( coord );
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    const shape: Shape = new Shape(shape_coords, is_closed);
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
            const pgon_i: number =  __model__.geom.add.addPgon(outer_posis_i, holes_posis_i);
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
            const pgon_i: number =  __model__.geom.add.addPline(list_posis_i, is_closed);
            plines_i.push(pgon_i);
        }
    }
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
export enum _EVoronoiMethod {
    VORONOI = 'voronoi',
    DELAUNY = 'delauny'
}
/**
 * Create a voronoi subdivision of a polygon.
 * ~
 * Holes are currently not supported.
 *
 * @param __model__
 * @param pgons A list of polygons, or entities from which polygons can bet extracted.
 * @param posis A list of positione, or entities from which positions can be extracted.
 * @param method Enum, the output, either 'voronoi' or 'delauny'.
 * @returns A list of new polygons.
 */
export function Voronoi(__model__: GIModel, pgons: TId|TId[], posis: TId|TId[], method: _EVoronoiMethod): TId[] {
    pgons = arrMakeFlat(pgons) as TId[];
    posis = arrMakeFlat(posis) as TId[];
    if (isEmptyArr(pgons)) { return []; }
    if (isEmptyArr(posis)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Voronoi';
    const pgons_ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities1', pgons,
        [IDcheckObj.isIDList], null) as TEntTypeIdx[];
    const posis_ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities1', posis,
        [IDcheckObj.isIDList], null) as TEntTypeIdx[];
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    // pgons
    const pgons_i: number[] = _getPgons(__model__, pgons_ents_arr);
    if (pgons_i.length === 0) { return []; }
    // posis
    const posis_i: number[] = _getPosis(__model__, posis_ents_arr);
    if (posis_i.length === 0) { return []; }
    // posis
    const cell_points: [number, number][] = [];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        cell_points.push([xyz[0], xyz[1]]);
    }
    // loop and create cells
    const all_cells_i: number[] = [];
    for (const pgon_i of pgons_i) {
        // pgon and bounds
        const bounds: number[] = [Infinity, Infinity, -Infinity, -Infinity]; // xmin, ymin, xmax, ymax
        // const pgon_shape_coords: IClipCoord[] = [];
        for (const posi_i of __model__.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i)) {
            const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
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
        let cells_i: number[];
        switch (method) {
            case _EVoronoiMethod.DELAUNY:
                cells_i = _voronoiDelauny(__model__, cell_points, posis_map);
                break;
            case _EVoronoiMethod.VORONOI:
                cells_i = _voronoi(__model__, pgon_shape, cell_points, bounds, posis_map);
                break;
            default:
                break;
        }
        for (const cell_i of cells_i) {
            all_cells_i.push(cell_i);
        }
    }
    // return cell pgons
    return idsMake(all_cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
function _voronoiDelauny(__model__: GIModel, cell_points: [number, number][], posis_map: TPosisMap): number[] {
    const new_pgons_i: number[] = [];
    const delaunay = Delaunay.from(cell_points);
    const deauny_posis_i: number[] = [];
    for (const point of cell_points) {
        // TODO use the posis_map!!
        // const deauny_posi_i: number = __model__.geom.add.addPosi();
        // __model__.attribs.add.setPosiCoords(deauny_posi_i, [point[0], point[1], 0]);
        const delauny_posi_i: number = _getPosiFromMap(__model__, point[0], point[1], posis_map);
        deauny_posis_i.push(delauny_posi_i);
    }
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
        const a: number = deauny_posis_i[delaunay.triangles[i]];
        const b: number = deauny_posis_i[delaunay.triangles[i + 1]];
        const c: number = deauny_posis_i[delaunay.triangles[i + 2]];
        __model__.geom.add.addPgon([c, b, a]);
    }
    return new_pgons_i;
}
function _voronoi(__model__: GIModel, pgon_shape: Shape, cell_points: [number, number][],
        bounds: number[], posis_map: TPosisMap): number[] {
    const delaunay = Delaunay.from(cell_points);
    const v = delaunay.voronoi(bounds);
    // console.log(v.circumcenters);
    // console.log(v.vectors);
    // console.log(v.cellPolygons())
    // console.log(v.cellPolygon(0))
    const bound_shape_coords: IClipCoord[] = [];
    for (const coord of bound_shape_coords) {
        bound_shape_coords.push( {X: coord[0], Y: coord[1] } );
    }
    const shapes: Shape[] = [];
    for (const cell_coords of Array.from(v.cellPolygons())) {
        const clipped_shape: Shape = _voronoiClip(__model__, pgon_shape, cell_coords as [number, number][]);
        shapes.push(clipped_shape);
    }
    return _convertShapesToPgons(__model__, shapes, posis_map);
}
function _voronoiClip(__model__: GIModel, pgon_shape: Shape, cell_coords: [number, number][]): Shape {
    const cell_shape_coords: IClipCoord[] = [];
    for (const cell_coord of cell_coords) {
        cell_shape_coords.push( {X: cell_coord[0], Y: cell_coord[1]} );
    }
    const cell_shape: Shape = new Shape([cell_shape_coords], true);
    cell_shape.scaleUp(SCALE);
    const clipped_shape: Shape = pgon_shape.intersect(cell_shape);
    return clipped_shape;
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
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isIDList], null) as TEntTypeIdx[];
    // --- Error Check ---
    // posis
    const posis_i: number[] = _getPosis(__model__, ents_arr);
    if (posis_i.length === 0) { return null; }
    const hull_posis_i: number[] = _convexHull(__model__, posis_i);
    // return cell pgons
    const hull_pgon_i: number = __model__.geom.add.addPgon(hull_posis_i);
    return idsMake([EEntType.PGON, hull_pgon_i]) as TId;
}
function _convexHull(__model__: GIModel, posis_i: number[]): number[] {
    const points: [number, number][] = [];
    const posis_map: TPosisMap = new Map();
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
        points.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (points.length < 3) { return null; }
    // loop and create hull
    const hull_points: [number, number][] = d3.polygonHull(points);
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
 * ~
 * For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.
 * ~
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
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isIDList], null) as TEntTypeIdx[];
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
    return idsMake([EEntType.PGON, pgon_i]) as TId;
}
function _bboxAABB(__model__: GIModel, posis_i: number[]): number {
    const bbox: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
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
        const box_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(box_posi_i, xyz);
        box_posis_i.push(box_posi_i);
    }
    const box_pgon_i: number = __model__.geom.add.addPgon(box_posis_i);
    return box_pgon_i;
}
function _bboxOBB(__model__: GIModel, posis_i: number[]): number {
    // posis
    const hull_posis_i: number[] = _convexHull(__model__, posis_i);
    hull_posis_i.push(hull_posis_i[0]);
    const first: Txyz = __model__.attribs.query.getPosiCoords(hull_posis_i[0]);
    const hull_xyzs: Txyz[] = [[first[0], first[1], 0]];
    let longest_len = 0;
    let origin_index = -1;
    for (let i = 1; i < hull_posis_i.length; i++) {
        // add xy to list
        const next: Txyz = __model__.attribs.query.getPosiCoords(hull_posis_i[i]);
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
        const box_posi_i: number = __model__.geom.add.addPosi();
        __model__.attribs.add.setPosiCoords(box_posi_i, xyz);
        box_posis_i.push(box_posi_i);
    }
    const box_pgon_i: number = __model__.geom.add.addPgon(box_posis_i);
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
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const pgons_i: number[] = _getPgons(__model__, ents_arr);
    if (pgons_i.length === 0) { return []; }
    const result_shape: Shape = _convertPgonsToShapeUnion(__model__, pgons_i, posis_map);
    if (result_shape === null) { return []; }
    const all_new_pgons: number[] = _convertShapesToPgons(__model__, result_shape, posis_map);
    return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
}
// ================================================================================================
/**
 * Perform a boolean operation on a set of polygons.
 * ~
 * The polygons in A and B are first each unioned.
 * The boolean operation is then performed between the unioned A polygons and the unioned B polygons.
 * ~
 * @param __model__
 * @param a_entities A list of polygons, or entities from which polygons can bet extracted.
 * @param b_entities A list of polygons, or entities from which polygons can bet extracted.
 * @param method Enum, the boolean operator to apply.
 * @returns A list of new polygons.
 */
export function Boolean(__model__: GIModel, a_entities: TId|TId[], b_entities: TId|TId[], method: _EBooleanMethod): TId[] {
    a_entities = arrMakeFlat(a_entities) as TId[];
    if (isEmptyArr(a_entities)) { return []; }
    b_entities = arrMakeFlat(b_entities) as TId[];
    if (isEmptyArr(b_entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Boolean';
    const a_ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'a_entities', a_entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PGON]) as TEntTypeIdx[];
    const b_ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'b_entities', b_entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PGON]) as TEntTypeIdx[];
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const a_pgons_i: number[] = _getPgons(__model__, a_ents_arr);
    const b_pgons_i: number[] = _getPgons(__model__, b_ents_arr);
    if (a_pgons_i.length === 0) { return []; }
    if (b_pgons_i.length === 0) { return []; }
    const a_shape: Shape = _convertPgonsToShapeUnion(__model__, a_pgons_i, posis_map);
    const b_shape: Shape = _convertPgonsToShapeUnion(__model__, b_pgons_i, posis_map);
    // const b_shape: Shape = _convertPgonsToShapeJoin(__model__, a_pgons_i, posis_map);
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
    const all_new_pgons: number[] = _convertShapesToPgons(__model__, result_shape, posis_map);
    return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
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
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'miter_limit', limit, [TypeCheckObj.isNumber]);
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
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
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
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'tolerance', tolerance, [TypeCheckObj.isNumber]);
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
    const wire_i: number = __model__.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.geom.query.isWireClosed(wire_i);
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
 * Clean a polyline or polygon.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance ???
 * @returns A list of new polygons.
 */
export function Clean(__model__: GIModel, entities: TId|TId[], tolerance: number): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Clean';
    const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'tolerance', tolerance, [TypeCheckObj.isNumber]);
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_pgons: TEntTypeIdx[] = [];
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _cleanPgon(__model__, pgon_i, tolerance, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_plines_i: number[] = _cleanPline(__model__, pline_i, tolerance, posis_map);
        for (const new_pline_i of new_plines_i) {
            all_new_pgons.push([EEntType.PLINE, new_pline_i]);
        }
    }
    return idsMake(all_new_pgons) as TId[];
}
function _cleanPgon(__model__: GIModel, pgon_i: number, tolerance: number, posis_map: TPosisMap): number[] {
    const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
function _cleanPline(__model__: GIModel, pline_i: number, tolerance: number, posis_map: TPosisMap): number[] {
    const wire_i: number = __model__.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.geom.query.isWireClosed(wire_i);
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new Shape(result.paths, result.closed);
    return _convertShapeToPlines(__model__, result_shape, result.closed, posis_map);
}
