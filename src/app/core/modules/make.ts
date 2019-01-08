import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribNames, TId, EEntityTypeStr, Txyz, TPlane, TRay } from '@libs/geo-info/common';
import { idBreak, isPoint, isPline, isPgon, idIndicies, isDim0, isDim2, isColl, isPosi, isObj, isEdge } from '@libs/geo-info/id';
import { __merge__ } from './_model';
import { isArray } from 'util';
import { vecDiv, vecMult, interpByNum, interpByLen, vecsAdd, vecsSub } from '@libs/geom/vectors';
import { _model } from '@modules';
import { checkCommTypes, checkIDs, checkIDnTypes } from './_check_args';

/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords XYZ coordinates as a list of three numbers.
 * @returns New position if successful, null if unsuccessful or on error.
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 */
export function Position(__model__: GIModel, coords: Txyz|Txyz[]): TId|TId[] {
    // --- Error Check ---
    checkCommTypes('make.Position', 'coords', coords, ['isCoord', 'isCoordList']);
    // --- Error Check ---
    if (isArray(coords) && !Array.isArray(coords[0])) {
        const posi_i: number = __model__.geom.add.addPosition();
        __model__.attribs.add.setAttribValue(EEntityTypeStr.POSI, posi_i, EAttribNames.COORDS, coords as Txyz);
        return EEntityTypeStr.POSI + posi_i;
    } else {
        return (coords as Txyz[]).map(_coords => Position(__model__, _coords)) as TId[];
    }
}
/**
 * Adds positions in a circle.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param radius Radius of circle as a number.
* @param num_positions Number of positions distributed equally along the arc.
* @param arc_angle Angle of arc (in radians).
* @returns New positions if successful, null if unsuccessful or on error.
* @example positions1 = make.PositionsArc([0,0,0], 10, 12, PI)
* @example_info Creates a list of 12 positions distributed equally along a semicircle of radius 10.
 */
export function PositionsArc(__model__: GIModel, origin: Txyz|TPlane,
    radius: number, num_positions: number, arc_angle: number): TId[] {
    // --- Error Check ---
    const fn_name = 'make.PositionsArc';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'radius', radius, ['isNumber']);
    checkCommTypes(fn_name, 'num_positions', num_positions, ['isInt']);
    checkCommTypes(fn_name, 'arc_angle', arc_angle, ['isNumber']);
    // --- Error Check ---
    const posis_id: TId[] = [];
    for (let i = 0; i < num_positions + 1; i++) {
        const vec: Txyz = origin as Txyz;
        const angle: number = (arc_angle / num_positions) * i;
        const x: number = (Math.cos(angle) * radius) + vec[0];
        const y: number = (Math.sin(angle) * radius) + vec[1];
        const posi_i: number = __model__.geom.add.addPosition();
        __model__.attribs.add.setAttribValue(EEntityTypeStr.POSI, posi_i, EAttribNames.COORDS, [x, y, vec[2]]);
        posis_id.push( EEntityTypeStr.POSI + posi_i );
    }
    // TODO Implement the TPlane version
    return posis_id;
}
/**
 * Adds positions in a grid.
 * @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.
* @param num_positions Number of positions. If integer, same number for x and y; if list of two numbers, number for x and y respectively.
* @returns New positions if successful, null if unsuccessful or on error.
* @example positions1 = make.PositionsGrid([0,0,0], 10, 3)
* @example_info Creates a list of 9 positions on a 3x3 square grid of length 10.
* @example positions1 = make.PositionsGrid([0,0,0], [10,20], [2,4])
* @example_info Creates a list of 8 positions on a 2x4 grid of length 10 by 20.
 */
export function PositionsGrid(__model__: GIModel, origin: Txyz|TPlane,
    size: number|[number, number], num_positions: number|[number, number]): TId[] {
    // --- Error Check ---
    const fn_name = 'make.PositionsGrid';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    checkCommTypes(fn_name, 'num_positions', num_positions, ['isInt', 'isXYlistInt']);
    // --- Error Check ---
    const xy_size: [number, number] = (isArray(size) ? size : [size, size]) as [number, number];
    const xy_num_posis: [number, number] = (isArray(num_positions) ? num_positions : [num_positions, num_positions]) as [number, number];
    const x_offset: number = xy_size[0] / (xy_num_posis[0] - 1);
    const y_offset: number = xy_size[1] / (xy_num_posis[1] - 1);
    const posis_id: TId[] = [];
    for (let i = 0; i < xy_num_posis[0]; i++) {
        const vec: Txyz = origin as Txyz;
        const x: number = (i * x_offset) + vec[0] - (xy_size[0] / 2);
        for (let j = 0; j < xy_num_posis[1]; j++) {
            const y: number = (j * y_offset) + vec[1] - (xy_size[1] / 2);
            const posi_i: number = __model__.geom.add.addPosition();
            __model__.attribs.add.setAttribValue(EEntityTypeStr.POSI, posi_i, EAttribNames.COORDS, [x, y, vec[2]]);
            posis_id.push( EEntityTypeStr.POSI + posi_i );
        }
    }
    // TODO Implement the TPlane version
    return posis_id;
}
/**
 * Adds positions in a rectangle.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.
* @returns New positions if successful, null if unsuccessful or on error.
* @example positions1 = make.PositionsRect([0,0,0], 10)
* @example_info Creates a list of 4 positions, being the vertices of a 10 by 10 square.
* @example positions1 = make.PositionsGrid([0,0,0], [10,20])
* @example_info Creates a list of 4 positions, being the vertices of a 10 by 20 rectangle.
 */
export function PositionsRect(__model__: GIModel, origin: Txyz|TPlane, size: number|[number, number]): TId[] {
    // --- Error Check ---
    const fn_name = 'make.PositionsRect';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    // --- Error Check ---
    const xy_size: [number, number] = (isArray(size) ? size : [size, size]) as [number, number];
    const posis_id: TId[] = [];
    const vec: Txyz = origin as Txyz;
    const c1: Txyz = [vec[0] - (xy_size[0] / 2), vec[1] - (xy_size[1] / 2), vec[2]];
    const c2: Txyz = [vec[0] + (xy_size[0] / 2), vec[1] - (xy_size[1] / 2), vec[2]];
    const c3: Txyz = [vec[0] + (xy_size[0] / 2), vec[1] + (xy_size[1] / 2), vec[2]];
    const c4: Txyz = [vec[0] - (xy_size[0] / 2), vec[1] + (xy_size[1] / 2), vec[2]];
    for (const xyz of [c1, c2, c3, c4]) {
        const posi_i: number = __model__.geom.add.addPosition();
        __model__.attribs.add.setAttribValue(EEntityTypeStr.POSI, posi_i, EAttribNames.COORDS, xyz);
        posis_id.push( EEntityTypeStr.POSI + posi_i );
    }
    // TODO Implement the TPlane version
    return posis_id;
}
/**
 * Adds a new point to the model. If a list of positions is provided as the input, then a list of points is generated.
 * @param __model__
 * @param positions Position of point.
 * @returns New point if successful, null if unsuccessful or on error.
 * @example_info Creates a point at position1.
 * @example point1 = make.Point(position)
 * @example_info Creates a point at position1.
 */
export function Point(__model__: GIModel, positions: TId|TId[]): TId|TId[] {
    // --- Error Check ---
    checkIDs('make.Point', 'positions', positions, ['isID', 'isIDList'], ['POSI']);
    // --- Error Check ---
    if (!Array.isArray(positions)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(positions as TId);
        const point_i: number = __model__.geom.add.addPoint(index);
        return EEntityTypeStr.POINT + point_i;
    } else {
        return (positions as TId[]).map(position => Point(__model__, position)) as TId[];
    }
}
// Enums for Polyline()
export enum _EClose {
    CLOSE = 'close',
    OPEN = 'open'
}
/**
 * Adds a new polyline to the model.
 * @param __model__
 * @param positions List of positions.
 * @param close Enum of 'close' or 'open'.
 * @returns New polyline if successful, null if unsuccessful or on error.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 */
export function Polyline(__model__: GIModel, positions: TId[]|TId[][], close: _EClose): TId|TId[] {
    // --- Error Check ---
    checkIDs('make.Polyline', 'positions', positions, ['isIDList', 'isIDList_list'], ['POSI']);
    // --- Error Check ---
    if (isArray(positions) && !Array.isArray(positions[0])) {
        const bool_close: boolean = (close === _EClose.CLOSE);
        const posis_i: number[] = idIndicies(positions as TId[]);
        const pline_i: number = __model__.geom.add.addPline(posis_i, bool_close);
        return EEntityTypeStr.PLINE + pline_i;
    } else {
        return (positions as TId[][]).map(_positions => Polyline(__model__, _positions, close)) as TId[];
    }
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param positions List of positions.
 * @returns New polygon if successful, null if unsuccessful or on error.
 * @example polygon1 = make.Polygon([position1,position2,position3])
 * @example_info Creates a polygon with vertices position1, position2, position3 in sequence.
 */
export function Polygon(__model__: GIModel, positions: TId[]|TId[][]): TId|TId[] {
    // --- Error Check ---
    checkIDs('make.Polygon', 'positions', positions, ['isIDList', 'isIDList_list'], ['POSI']);
    // --- Error Check ---
    if (isArray(positions) && !Array.isArray(positions[0])) {
        const posis_i: number[] = idIndicies(positions as TId[]);
        const pgon_i: number = __model__.geom.add.addPgon(posis_i);
        return EEntityTypeStr.PGON + pgon_i;
    } else {
        return (positions as TId[][]).map(_positions => Polygon(__model__, _positions)) as TId[];
    }
}
/**
 * Adds a new collection to the model.
 * @param __model__
 * @param parent_coll Collection
 * @param objects List of points, polylines, polygons.
 * @returns New collection if successful, null if unsuccessful or on error.
 * @example collection1 = make.Collection([point1,polyine1,polygon1])
 * @example_info Creates a collection containing point1, polyline1, polygon1.
 */
export function Collection(__model__: GIModel, parent_coll: TId, objects: TId|TId[]): TId {
    // --- Error Check ---
    const fn_name = 'make.Collection';
    if (parent_coll !== null && parent_coll !== undefined) {
        checkIDs(fn_name, 'parent_coll', parent_coll, ['isID'], ['COLL']);
    }
    checkIDs(fn_name, 'objects', objects, ['isID', 'isIDList'], ['POINT', 'PLINE', 'PGON']);
    // --- Error Check ---
    if (!Array.isArray(objects)) {
        objects = [objects] as TId[];
    }
    const points: number[] = [];
    const plines: number[] = [];
    const pgons: number[] = [];
    for (const ent_i of objects) {
        if (isPoint(ent_i)) { points.push(idBreak(ent_i)[1]); }
        if (isPline(ent_i)) { plines.push(idBreak(ent_i)[1]); }
        if (isPgon(ent_i)) { pgons.push(idBreak(ent_i)[1]); }
    }
    if (parent_coll === null || parent_coll === undefined) {
        return EEntityTypeStr.COLL + __model__.geom.add.addColl(-1, points, plines, pgons);
    }
    const [_, parent_index]: [EEntityTypeStr, number] = idBreak(parent_coll);
    return EEntityTypeStr.COLL + __model__.geom.add.addColl(parent_index, points, plines, pgons);
}
/**
 * Lofts between edges.
 * @param __model__
 * @param geometry Edges (or wires, polylines or polygons), with the same number of edges.
 * @returns Lofted polygons between edges if successful, null if unsuccessful or on error.
 * @example surface1 = make.Loft([polyline1,polyline2,polyline3])
 * @example_info Creates collection of polygons lofting between polyline1, polyline2 and polyline3.
 */
export function Loft(__model__: GIModel, geometry: TId[]): TId[] {
    // --- Error Check ---
    checkIDs('make.Loft', 'geometry', geometry, ['isIDList'], ['EDGE', 'WIRE', 'PLINE', 'PGON']);
    // --- Error Check ---
    const edges_arrs_i: number[][] = [];
    let num_edges = 0;
    for (const geom_id of geometry) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geom_id as TId);
        const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type_str, index);
        if (edges_arrs_i.length === 0) { num_edges = edges_i.length; }
        if (edges_i.length !== num_edges) {
            throw new Error('make.Loft: Number of edges is not consistent.');
        }
        edges_arrs_i.push(edges_i);
    }
    const pgons_id: TId[] = [];
    for (let i = 0; i < edges_arrs_i.length - 1; i++) {
        const edges_i_a: number[] = edges_arrs_i[i];
        const edges_i_b: number[] = edges_arrs_i[i + 1];
        for (let j = 0; j < num_edges; j++) {
            const verts_i_a: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.EDGE, edges_i_a[j]);
            const verts_i_b: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.EDGE, edges_i_b[j]);
            const pgon_i: number = __model__.geom.add.addPgon([verts_i_a[0], verts_i_a[1], verts_i_b[1], verts_i_b[0]]);
            pgons_id.push(EEntityTypeStr.PGON + pgon_i);
        }
    }
    return pgons_id;
}
/**
 * Extrudes geometry by distance (in default direction = z-axis) or by vector.
 * - Extrusion of location produces a line;
 * - Extrusion of line produces a polygon;
 * - Extrusion of surface produces a list of surfaces.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param distance Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).
 * @param divisions Number of divisions to divide extrusion by.
 * @returns Extrusion of geometry if successful, null if unsuccessful or on error.
 * @example extrusion1 = make.Extrude(point1, 10, 2)
 * @example_info Creates a list of 2 lines of total length 10 (length 5 each) in the z-direction.
 * If point1 = [0,0,0], extrusion1[0] is a line between [0,0,0] and [0,0,5]; extrusion1[1] is a line between [0,0,5] and [0,0,10].
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1)
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of surfaces.
 */
export function Extrude(__model__: GIModel, geometry: TId|TId[], distance: number|Txyz, divisions: number): TId|TId[] {
    // --- Error Check ---
    const fn_name = 'make.Extrude';
    checkIDs(fn_name, 'geometry', geometry, ['isID', 'isIDList'], ['VERT', 'EDGE', 'WIRE', 'FACE', 'POSI', 'POINT', 'PLINE', 'PGON',
            'COLL']);
    checkCommTypes(fn_name, 'distance', distance, ['isNumber', 'isVector']);
    checkCommTypes(fn_name, 'divisions', divisions, ['isInt']);
    // --- Error Check ---
    const extrude_vec: Txyz = (isArray(distance) ? distance : [0, 0, distance]) as Txyz;
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    if (!Array.isArray(geometry)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geometry as TId);
        // check if this is a collection
        if (isColl(ent_type_str)) {
            const points_i: number[] = __model__.geom.query.navCollToPoint(index);
            const res1 = points_i.map( point_i => Extrude(__model__, EEntityTypeStr.POINT + point_i, extrude_vec, divisions));
            const plines_i: number[] = __model__.geom.query.navCollToPline(index);
            const res2 = plines_i.map( pline_i => Extrude(__model__, EEntityTypeStr.PLINE + pline_i, extrude_vec, divisions));
            const pgons_i: number[] = __model__.geom.query.navCollToPgon(index);
            const res3 = pgons_i.map( pgon_i => Extrude(__model__, EEntityTypeStr.PGON + pgon_i, extrude_vec, divisions));
            return [].concat(...[res1, res2, res3]) as TId[];
        }
        const all_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type_str, index);
        // check if this is a position, a vertex, or a point
        if (isDim0(ent_type_str)) {
            const new_posis_i: number[] = [all_posis_i[0]];
            for (let i = 1; i < divisions + 1; i++) {
                const extrude_vec_mult: Txyz = vecMult(extrude_vec_div, i);
                const new_pline_posi_i: number = __model__.geom.add.copyPosis(all_posis_i[0], false) as number; // Do not copy attribs
                __model__.attribs.add.movePosiCoords(new_pline_posi_i, extrude_vec_mult);
                new_posis_i.push(new_pline_posi_i);
            }
            // loft between the positions and create a single polyline
            const pline_i: number = __model__.geom.add.addPline(new_posis_i);
            return EEntityTypeStr.PLINE + pline_i;
        }
        // get all unique posis
        const unique_posis_i: number[] = Array.from(new Set(all_posis_i));
        // create copies of the positions and move them
        const new_posis_arrs_i: number[][] = [unique_posis_i];
        for (let i = 1; i < divisions + 1; i++) {
            const extrude_vec_mult: Txyz = vecMult(extrude_vec_div, i);
            const new_posis_i: number[] = __model__.geom.add.copyPosis(unique_posis_i, false) as number[]; // Do not copy attribs
            new_posis_i.forEach(posi_i => __model__.attribs.add.movePosiCoords(posi_i, extrude_vec_mult));
            new_posis_arrs_i.push(new_posis_i);
        }
        // loft between all the edges using the map and create pgons
        const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type_str, index);
        const pairs_posis_i: number[][] = edges_i.map( edge_i =>
            __model__.geom.query.navAnyToPosi(EEntityTypeStr.EDGE, edge_i) );
        const edges_map: [number, number][] = pairs_posis_i.map(pair_posi_i =>
            pair_posi_i.map(posi_i => unique_posis_i.indexOf(posi_i))) as [number, number][];
        const pgons_id: TId[] = [];
        for (let i = 0; i < new_posis_arrs_i.length - 1; i++) {
            const new_posis_i_a: number[] = new_posis_arrs_i[i];
            const new_posis_i_b: number[] = new_posis_arrs_i[i + 1];
            for (let j = 0; j < edges_map.length; j++) {
                const [start, end]: [number, number] = edges_map[j];
                const c1: number = new_posis_i_a[start];
                const c2: number = new_posis_i_a[end];
                const c3: number = new_posis_i_b[end];
                const c4: number = new_posis_i_b[start];
                const pgon_i: number = __model__.geom.add.addPgon([c1, c2, c3, c4]);
                pgons_id.push(EEntityTypeStr.PGON + pgon_i);
            }
        }
        if (isDim2(ent_type_str)) {
            const pgon_i: number = __model__.geom.add.addPgon( new_posis_arrs_i[new_posis_arrs_i.length - 1] );
            pgons_id.push(EEntityTypeStr.PGON + pgon_i);
        }
        return pgons_id;
    } else {
        return [].concat(...(geometry as TId[]).map(geom_i => Extrude(__model__, geom_i, extrude_vec, divisions))) as TId[];
    }
}
/**
 * Joins polylines to polylines or polygons to polygons.
 * @param __model__
 * @param objects Polylines or polygons.
 * @returns New joined polyline or polygon if successful, null if unsuccessful or on error.
 * @example joined1 = make.Join([polyline1,polyline2])
 * @example_info Creates a new polyline by joining polyline1 and polyline2.
 */
export function Join(__model__: GIModel, objects: TId[]): TId {
    // --- Error Check ---
    checkIDs('make.Join', 'objects', objects, ['isIDList'], ['PLINE', 'PGON']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
// Enums for Copy()
export enum _ECopyPositions {
    COPY_POSITIONS = 'copy_positions',
    REUSE_POSITIONS = 'reuse_positions'
}
export enum _ECopyAttribues {
    COPY_ATTRIBUTES = 'copy_attributes',
    NO_ATTRIBUTES = 'no_attributes'
}
/**
 * Adds a new copy to the model.
 * @param __model__
 * @param geometry Position, vertex, edge, wire, face, point, polyline, polygon, collection to be copied.
 * @param copy_positions Enum to create a copy of the existing positions or to reuse the existing positions.
 * @param copy_attributes Enum to copy attributes or to have no attributes copied.
 * @returns New copy if successful, null if unsuccessful or on error.
 * @example copy1 = make.Copy([position1,polyine1,polygon1], copy_positions, copy_attributes)
 * @example_info Creates a list containing a copy of the objects in sequence of input.
 */
export function Copy(__model__: GIModel, geometry: TId|TId[],
        copy_positions: _ECopyPositions, copy_attributes: _ECopyAttribues): TId|TId[] {
    if (copy_positions === _ECopyPositions.COPY_POSITIONS) {
        throw new Error('Copy with copy_positions option is not yet implemented... coming soon.');
    }
    // --- Error Check ---
    checkIDs('make.Copy', 'geometry', geometry, ['isID', 'isIDList'],
    ['POSI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    if (!Array.isArray(geometry)) {
        const bool_copy_attribs: boolean = (copy_attributes === _ECopyAttribues.COPY_ATTRIBUTES);
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geometry as TId);
        if (isColl(ent_type_str)) {
            return ent_type_str + __model__.geom.add.copyColls(index, bool_copy_attribs);
        } else if (isObj(ent_type_str)) {
            return ent_type_str + __model__.geom.add.copyObjs(ent_type_str, index, bool_copy_attribs);
        } else if (isPosi(ent_type_str)) {
            return ent_type_str + __model__.geom.add.copyPosis(index, bool_copy_attribs);
        }
    } else {
        return (geometry as TId[]).map(geom_i => Copy(__model__, geom_i, copy_positions, copy_attributes)) as TId[];
    }
}
// Divide edge modelling operation
export enum _EDivideMethod {
    BY_NUMBER =  'by_number',
    BY_LENGTH  =  'by_length'
}
function _divide(__model__: GIModel, edge_i: number, divisor: number, method: _EDivideMethod): number[] {
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntityTypeStr.EDGE, edge_i);
    const start = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end = __model__.attribs.query.getPosiCoords(posis_i[1]);
    let new_xyzs: Txyz[];
    if (method === _EDivideMethod.BY_NUMBER) {
        new_xyzs = interpByNum(start, end, divisor - 1);
    } else {
        new_xyzs = interpByLen(start, end, divisor);
    }
    const new_edges_i: number[] = [];
    for (const new_xyz of new_xyzs) {
        const posi_i = __model__.geom.add.addPosition();
        __model__.attribs.add.setPosiCoords(posi_i, new_xyz);
        const new_edge_i: number = __model__.geom.add.insertVertWire(edge_i, posi_i);
        new_edges_i.push(new_edge_i);
    }
    return [edge_i, ...new_edges_i];
}
/**
 * Divides edge/wire/polyline by length or by number of segments.
 * If object is not exact multiple of length, length of last segment will be the remainder.
 * @param __model__
 * @param edge Edge/wire/polyline(s) to be divided.
 * @param divisor Segment length or number of segments.
 * @param method Enum to choose which method.
 * @returns List of new edges (segments of original edges), null if unsuccessful or on error.
 * @example segments1 = make.Divide(edge1, 5, by_number)
 * @example_info Creates a list of 5 equal segments from edge1.
 * @example segments2 = make.Divide(edge1, 5, by_length)
 * @example_info If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
 */
export function Divide(__model__: GIModel, edge: TId|TId[], divisor: number, method: _EDivideMethod): TId[] {
    // --- Error Check ---
    const fn_name = 'make.Divide';
    checkIDs('make.Copy', 'edges', edge, ['isID', 'isIDList'], ['EDGE', 'WIRE', 'PLINE']);
    checkCommTypes(fn_name, 'divisor', divisor, ['isNumber']);
    // --- Error Check ---
    if (!Array.isArray(edge)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(edge as TId);
        let exist_edges_i: number[];
        if (!isEdge(ent_type_str)) {
            exist_edges_i = __model__.geom.query.navAnyToEdge(ent_type_str, index).slice();
        } else {
            exist_edges_i = [index];
        }
        const all_new_edges_i: number[] = [];
        for (const exist_edge_i of exist_edges_i) {
            const new_edges_i: number[] = _divide(__model__, exist_edge_i, divisor, method);
            all_new_edges_i.push(...new_edges_i);
        }
        return all_new_edges_i.map(one_edge_i => EEntityTypeStr.EDGE + one_edge_i);
    } else {
        return [].concat(...(edge as TId[]).map(one_edge => Divide(__model__, one_edge, divisor, method)));
    }
}
/**
 * Adds a ray to the model from an origin location and vector.
 * @param __model__
 * @param ray A list of two list of three coordinates
 * @returns A points and a line representing the ray. (The point is tha start point of the ray.)
 * @example ray1 = make.RayVisible([[1,2,3],[0,0,1]])
 */
export function RayGeom(__model__: GIModel, ray: TRay, scale: number): TId[] {
    // --- Error Check ---
    checkCommTypes('make.RayGeom', 'ray', ray, ['isRay']);
    // --- Error Check ---
    const origin: Txyz = ray[0];
    const vec: Txyz = vecMult(ray[1], scale);
    const end: Txyz = vecsAdd(origin, vec);
    // create orign point
    const origin_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create pline
    const end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(end_posi_i, end);
    const pline_i = __model__.geom.add.addPline([origin_posi_i, end_posi_i]);
    // return the geometry IDs
    return [EEntityTypeStr.POINT + point_i, EEntityTypeStr.PLINE + pline_i];
}
/**
 * Adds a plane to the model from an origin location and two vectors.
 * @param __model__
 * @param plane A list: [origin (POSI|VERT|POINT|xyz), vector(xyz), vector(xyz)]
 * @returns A point, a polygon and two polyline representing the plane. (The point is the origin of the plane.)
 * @example plane1 = make.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function PlaneGeom(__model__: GIModel, plane: TPlane, scale: number): TId[] {
    // --- Error Check ---
    checkCommTypes('make.PlaneGeom', 'plane', plane, ['isPlane']);
    // --- Error Check ---
    const origin: Txyz = plane[0];
    const x_vec: Txyz = vecMult(plane[1], scale);
    const y_vec: Txyz = vecMult(plane[2], scale);
    let x_end: Txyz = vecsAdd(origin, x_vec);
    let y_end: Txyz = vecsAdd(origin, y_vec);
    const plane_corners: Txyz[] = [
        vecsAdd(x_end, y_vec),
        vecsSub(y_end, x_vec),
        vecsSub(vecsSub(origin, x_vec), y_vec),
        vecsSub(x_end, y_vec),
    ];
    x_end = vecsAdd(x_end, vecMult(x_vec, 0.1));
    y_end = vecsSub(y_end, vecMult(y_vec, 0.1));
    // create the point
    const origin_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create the x axis
    const x_end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(x_end_posi_i, x_end);
    const x_pline_i = __model__.geom.add.addPline([origin_posi_i, x_end_posi_i]);
    // create the y axis
    const y_end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(y_end_posi_i, y_end);
    const y_pline_i = __model__.geom.add.addPline([origin_posi_i, y_end_posi_i]);
    // create pline for plane
    const corner_posis_i: number[] = [];
    for (const corner of plane_corners) {
        const posi_i: number =__model__.geom.add.addPosition();
        __model__.attribs.add.setPosiCoords(posi_i, corner);
        corner_posis_i.push(posi_i);
    }
    const plane_i = __model__.geom.add.addPline(corner_posis_i, true);
    // return the geometry IDs
    return [
        EEntityTypeStr.POINT + point_i,
        EEntityTypeStr.PLINE + x_pline_i, EEntityTypeStr.PLINE + y_pline_i,
        EEntityTypeStr.PLINE + plane_i
    ];
}

// Pipe

// Offset

