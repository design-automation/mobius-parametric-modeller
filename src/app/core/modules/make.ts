import { GIModel } from '@libs/geo-info/GIModel';
import { EAttribNames, TId, EEntType, Txyz } from '@libs/geo-info/common';
import { idBreak, isPoint, isPline, isPgon, isDim0, isDim2, isColl, isPosi, 
    isObj, isEdge, idMake, idIndicies, idsBreak } from '@libs/geo-info/id';
import { __merge__ } from './_model';
import { vecDiv, vecMult, interpByNum, interpByLen, vecAdd } from '@libs/geom/vectors';
import { _model } from '@modules';
import { checkCommTypes, checkIDs, checkIDs2 } from './_check_args';

// ================================================================================================
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
    if (Array.isArray(coords) && !Array.isArray(coords[0])) {
        const posi_i: number = __model__.geom.add.addPosition();
        __model__.attribs.add.setAttribValue(EEntType.POSI, posi_i, EAttribNames.COORDS, coords as Txyz);
        return idMake(EEntType.POSI, posi_i);
    } else {
        return (coords as Txyz[]).map(_coords => Position(__model__, _coords)) as TId[];
    }
}
// ================================================================================================
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
        const [ent_type, index]: [EEntType, number] = idBreak(positions as TId);
        const point_i: number = __model__.geom.add.addPoint(index);
        return idMake(EEntType.POINT, point_i);
    } else {
        return (positions as TId[]).map(position => Point(__model__, position)) as TId[];
    }
}
// ================================================================================================
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
    if (Array.isArray(positions) && !Array.isArray(positions[0])) {
        const bool_close: boolean = (close === _EClose.CLOSE);
        const posis_i: number[] = idIndicies(positions as TId[]);
        const pline_i: number = __model__.geom.add.addPline(posis_i, bool_close);
        return idMake(EEntType.PLINE, pline_i);
    } else {
        return (positions as TId[][]).map(_positions => Polyline(__model__, _positions, close)) as TId[];
    }
}
// ================================================================================================
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param positions List of positions.
 * @returns New polygon if successful, null if unsuccessful or on error.
 * @example polygon1 = make.Polygon([position1,position2,position3])
 * @example_info Creates a polygon with vertices position1, position2, position3 in sequence.
 */
export function Polygon(__model__: GIModel, positions: TId[]|TId[][]): TId|TId[] {
    const ents_arr: [EEntType, number][] = idsBreak(positions as TId[]);
    // --- Error Check ---
    // checkIDs2('make.Polygon', 'positions', ents_arr, ['isIDList', 'isIDList_list'], ['POSI']);
    // checkIDs('make.Polygon', 'positions', positions, ['isIDList', 'isIDList_list'], ['POSI']);
    // --- Error Check ---
    if (Array.isArray(positions) && !Array.isArray(positions[0])) {
        const posis_i: number[] = idIndicies(positions as TId[]);
        const pgon_i: number = __model__.geom.add.addPgon(posis_i);
        return idMake(EEntType.PGON, pgon_i);
    } else {
        return (positions as TId[][]).map(_positions => Polygon(__model__, _positions)) as TId[];
    }
}
// ================================================================================================
/**
 * Adds a new collection to the model.
 * @param __model__
 * @param parent_coll Collection
 * @param geometry List of points, polylines, polygons.
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
    checkIDs(fn_name, 'geometry', objects, ['isID', 'isIDList'], ['POINT', 'PLINE', 'PGON']);
    // --- Error Check ---
    if (!Array.isArray(objects)) {
        objects = [objects] as TId[];
    }
    const points: number[] = [];
    const plines: number[] = [];
    const pgons: number[] = [];
    for (const ent_id of objects) {
        const [ent_type, index]: [EEntType, number] = idBreak(ent_id);
        if (isPoint(ent_type)) { points.push(index); }
        if (isPline(ent_type)) { plines.push(index); }
        if (isPgon(ent_type)) { pgons.push(index); }
    }
    if (parent_coll === null || parent_coll === undefined) {
        return idMake(EEntType.COLL, __model__.geom.add.addColl(-1, points, plines, pgons));
    }
    const [_, parent_index]: [EEntType, number] = idBreak(parent_coll);
    return idMake(EEntType.COLL, __model__.geom.add.addColl(parent_index, points, plines, pgons));
}
// ================================================================================================
// Stuff for Copy()
function _copyGeom(__model__: GIModel, geometry: TId|TId[], copy_attributes: boolean): TId[] {
    if (!Array.isArray(geometry)) {
        const [ent_type, index]: [EEntType, number] = idBreak(geometry as TId);
        if (isColl(ent_type)) {
            const coll_i: number = __model__.geom.add.copyColls(index, copy_attributes) as number;
            return [ idMake(ent_type, coll_i)];
        } else if (isObj(ent_type)) {
            const obj_i: number = __model__.geom.add.copyObjs(ent_type, index, copy_attributes) as number;
            return [ idMake(ent_type, obj_i)];
        } else if (isPosi(ent_type)) {
            return [];
        }
    } else {
        return [].concat(...(geometry as TId[]).map(one_geom => _copyGeom(__model__, one_geom, copy_attributes)));
    }
}
function _copyPosis(__model__: GIModel, geometry: TId|TId[], copy_attributes: boolean): TId[] {
    // create the new positions
    const old_to_new_posis_i_map: Map<number, number> = new Map(); // count number of posis
    for (const geom_id of geometry) {
        const [ent_type, index]: [EEntType, number] = idBreak(geom_id);
        const old_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
        const geom_new_posis_i: number[] = [];
        for (const old_posi_i of old_posis_i) {
            let new_posi_i: number;
            if (old_to_new_posis_i_map.has(old_posi_i)) {
                new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
            } else {
                new_posi_i = __model__.geom.add.copyPosis(old_posi_i, copy_attributes) as number;
                old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
            }
            geom_new_posis_i.push(new_posi_i);
        }
        if (!isPosi(ent_type)) { // obj or coll
            __model__.geom.add.replacePosis(ent_type, index, geom_new_posis_i);
        }
    }
    // return all the new points
    return Array.from(old_to_new_posis_i_map.values()).map( posi_i => idMake(EEntType.POSI, posi_i ));
}
export enum _ECopyAttribues {
    COPY_ATTRIBUTES = 'copy_attributes',
    NO_ATTRIBUTES = 'no_attributes'
}
/**
 * Adds a new copy to the model.
 * @param __model__
 * @param entities Position, point, polyline, polygon, collection to be copied.
 * @param copy_positions Enum to create a copy of the existing positions or to reuse the existing positions.
 * @param copy_attributes Enum to copy attributes or to have no attributes copied.
 * @returns New copy if successful, null if unsuccessful or on error.
 * @example copy1 = make.Copy([position1,polyine1,polygon1], copy_positions, copy_attributes)
 * @example_info Creates a list containing a copy of the entities in sequence of input.
 */
export function Copy(__model__: GIModel, entities: TId|TId[], copy_attributes: _ECopyAttribues): TId|TId[] {
    // --- Error Check ---
    checkIDs('make.Copy', 'entities', entities, ['isID', 'isIDList'],
    ['POSI', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    if (!Array.isArray(entities)) {
        entities = [entities] as TId[];
    }
    const bool_copy_attribs: boolean = (copy_attributes === _ECopyAttribues.COPY_ATTRIBUTES);
    const copied_geom: TId[] = _copyGeom(__model__, entities, bool_copy_attribs);
    _copyPosis(__model__, entities, bool_copy_attribs);
    return copied_geom;
}
// ================================================================================================
// Loft modelling operation
export enum _ELoftMethod {
    OPEN =  'open',
    CLOSED  =  'closed'
}
/**
 * Lofts between edges.
 * @param __model__
 * @param entities Edges (or wires, polylines or polygons), with the same number of edges.
 * @param method Enum, if 'closed', then close the loft back to the first curve.
 * @returns Lofted polygons between edges if successful, null if unsuccessful or on error.
 * @example surface1 = make.Loft([polyline1,polyline2,polyline3])
 * @example_info Creates collection of polygons lofting between polyline1, polyline2 and polyline3.
 */
export function Loft(__model__: GIModel, entities: TId[], method: _ELoftMethod): TId[] {
    // --- Error Check ---
    checkIDs('make.Loft', 'entities', entities, ['isIDList'], ['EDGE', 'WIRE', 'PLINE', 'PGON']);
    // --- Error Check ---
    const edges_arrs_i: number[][] = [];
    let num_edges = 0;
    for (const geom_id of entities) {
        const [ent_type, index]: [EEntType, number] = idBreak(geom_id as TId);
        const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
        if (edges_arrs_i.length === 0) { num_edges = edges_i.length; }
        if (edges_i.length !== num_edges) {
            throw new Error('make.Loft: Number of edges is not consistent.');
        }
        edges_arrs_i.push(edges_i);
    }
    if (method === _ELoftMethod.CLOSED) {
        edges_arrs_i.push(edges_arrs_i[0]);
    }
    const pgons_id: TId[] = [];
    for (let i = 0; i < edges_arrs_i.length - 1; i++) {
        const edges_i_a: number[] = edges_arrs_i[i];
        const edges_i_b: number[] = edges_arrs_i[i + 1];
        for (let j = 0; j < num_edges; j++) {
            const verts_i_a: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edges_i_a[j]);
            const verts_i_b: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edges_i_b[j]);
            const pgon_i: number = __model__.geom.add.addPgon([verts_i_a[0], verts_i_a[1], verts_i_b[1], verts_i_b[0]]);
            pgons_id.push(idMake(EEntType.PGON, pgon_i));
        }
    }
    return pgons_id;
}
// ================================================================================================
/**
 * Extrudes geometry by distance (in default direction = z-axis) or by vector.
 * - Extrusion of location produces a line;
 * - Extrusion of line produces a polygon;
 * - Extrusion of surface produces a list of surfaces.
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param distance Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in z-direction).
 * @param divisions Number of divisions to divide extrusion by.
 * @returns Extrusion of entities if successful, null if unsuccessful or on error.
 * @example extrusion1 = make.Extrude(point1, 10, 2)
 * @example_info Creates a list of 2 lines of total length 10 (length 5 each) in the z-direction.
 * If point1 = [0,0,0], extrusion1[0] is a line between [0,0,0] and [0,0,5]; extrusion1[1] is a line between [0,0,5] and [0,0,10].
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1)
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of surfaces.
 */
export function Extrude(__model__: GIModel, entities: TId|TId[], distance: number|Txyz, divisions: number): TId|TId[] {
    // --- Error Check ---
    // const fn_name = 'make.Extrude';
    // checkIDs(fn_name, 'entities', entities, ['isID', 'isIDList'], ['VERT', 'EDGE', 'WIRE', 'FACE', 'POSI', 'POINT', 'PLINE', 'PGON',
    //         'COLL']);
    // checkCommTypes(fn_name, 'distance', distance, ['isNumber', 'isVector']);
    // checkCommTypes(fn_name, 'divisions', divisions, ['isInt']);
    // --- Error Check ---
    const extrude_vec: Txyz = (Array.isArray(distance) ? distance : [0, 0, distance]) as Txyz;
    const extrude_vec_div: Txyz = vecDiv(extrude_vec, divisions);
    if (!Array.isArray(entities)) {
        const [ent_type, index]: [EEntType, number] = idBreak(entities as TId);
        // check if this is a collection
        if (isColl(ent_type)) {
            const points_i: number[] = __model__.geom.query.navCollToPoint(index);
            const res1 = points_i.map( point_i => Extrude(__model__, idMake(EEntType.POINT, point_i), extrude_vec, divisions));
            const plines_i: number[] = __model__.geom.query.navCollToPline(index);
            const res2 = plines_i.map( pline_i => Extrude(__model__, idMake(EEntType.PLINE, pline_i), extrude_vec, divisions));
            const pgons_i: number[] = __model__.geom.query.navCollToPgon(index);
            const res3 = pgons_i.map( pgon_i => Extrude(__model__, idMake(EEntType.PGON, pgon_i), extrude_vec, divisions));
            return [].concat(...[res1, res2, res3]) as TId[];
        }
        // check if this is a position, a vertex, or a point -> pline
        if (isDim0(ent_type)) {
            const all_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
            const new_posis_i: number[] = [all_posis_i[0]];
            for (let i = 1; i < divisions + 1; i++) {
                const extrude_vec_mult: Txyz = vecMult(extrude_vec_div, i);
                const new_pline_posi_i: number = __model__.geom.add.copyPosis(all_posis_i[0], false) as number; // Do not copy attribs
                __model__.attribs.add.movePosiCoords(new_pline_posi_i, extrude_vec_mult);
                new_posis_i.push(new_pline_posi_i);
            }
            // loft between the positions and create a single polyline
            const pline_i: number = __model__.geom.add.addPline(new_posis_i);
            return idMake(EEntType.PLINE, pline_i);
        }
        // extrude edges
        const pgons_id: TId[] = [];
        const edges_i: number[] = __model__.geom.query.navAnyToEdge(ent_type, index);
        const strip_posis_map: Map<number, number[]> = new Map();
        for (const edge_i of edges_i) {
            // get exist posis_i
            const exist_posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
            // create the new posis strip if necessary
            for (const exist_posi_i of exist_posis_i) {
                if (strip_posis_map.get(exist_posi_i) === undefined) {
                    const xyz: Txyz = __model__.attribs.query.getPosiCoords(exist_posi_i);
                    const strip_posis_i: number[] = [exist_posi_i];
                    for (let i = 1; i < divisions + 1; i++) {
                        const strip_posi_i: number = __model__.geom.add.addPosition();
                        const move_xyz = vecMult(extrude_vec_div, i);
                        __model__.attribs.add.setPosiCoords(strip_posi_i, vecAdd(xyz, move_xyz));
                        strip_posis_i.push(strip_posi_i);
                    }
                    strip_posis_map.set(exist_posi_i, strip_posis_i);
                }
            }
            // get the two strips and make polygons
            const strip1_posis_i: number[] = strip_posis_map.get(exist_posis_i[0]);
            const strip2_posis_i: number[] = strip_posis_map.get(exist_posis_i[1]);
            for (let i = 0; i < strip1_posis_i.length - 1; i++) {
                const c1: number = strip1_posis_i[i];
                const c2: number = strip2_posis_i[i];
                const c3: number = strip2_posis_i[i + 1];
                const c4: number = strip1_posis_i[i + 1];
                const pgon_i: number = __model__.geom.add.addPgon([c1, c2, c3, c4]);
                pgons_id.push(idMake(EEntType.PGON, pgon_i));
            }
        }
        if (isDim2(ent_type)) {
            const old_posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type, index);
            const new_posis_i: number[] = old_posis_i.map(old_posi_i => strip_posis_map.get(old_posi_i)[divisions]);
            const pgon_i: number = __model__.geom.add.addPgon( new_posis_i );
            pgons_id.push(idMake(EEntType.PGON, pgon_i));
        }
        return pgons_id;
    } else {
        return [].concat(...(entities as TId[]).map(geom_i => Extrude(__model__, geom_i, extrude_vec, divisions))) as TId[];
    }
}
// ================================================================================================
/**
 * Joins polylines to polylines or polygons to polygons.
 * @param __model__
 * @param geometry Polylines or polygons.
 * @returns New joined polyline or polygon if successful, null if unsuccessful or on error.
 * @example joined1 = make.Join([polyline1,polyline2])
 * @example_info Creates a new polyline by joining polyline1 and polyline2.
 */
export function Join(__model__: GIModel, geometry: TId[]): TId {
    // --- Error Check ---
    checkIDs('make.Join', 'geometry', geometry, ['isIDList'], ['PLINE', 'PGON']);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
// ================================================================================================
// Divide edge modelling operation
export enum _EDivideMethod {
    BY_NUMBER =  'by_number',
    BY_LENGTH  =  'by_length'
}
function _divide(__model__: GIModel, edge_i: number, divisor: number, method: _EDivideMethod): number[] {
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(EEntType.EDGE, edge_i);
    const start = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end = __model__.attribs.query.getPosiCoords(posis_i[1]);
    let new_xyzs: Txyz[];
    if (method === _EDivideMethod.BY_NUMBER) {
        new_xyzs = interpByNum(start, end, divisor - 1);
    } else {
        new_xyzs = interpByLen(start, end, divisor);
    }
    const new_edges_i: number[] = [];
    let old_edge_i: number = edge_i;
    for (const new_xyz of new_xyzs) {
        const posi_i = __model__.geom.add.addPosition();
        __model__.attribs.add.setPosiCoords(posi_i, new_xyz);
        const new_edge_i: number = __model__.geom.add.insertVertIntoEdge(old_edge_i, posi_i);
        new_edges_i.push(old_edge_i);
        old_edge_i = new_edge_i;
    }
    new_edges_i.push(old_edge_i);
    return new_edges_i;
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
    // checkIDs('make.Copy', 'edge', edge, ['isID', 'isIDList'], ['EDGE', 'WIRE', 'PLINE']);
    // checkCommTypes(fn_name, 'divisor', divisor, ['isNumber']);
    // --- Error Check ---
    if (!Array.isArray(edge)) {
        const [ent_type, index]: [EEntType, number] = idBreak(edge as TId);
        let exist_edges_i: number[];
        if (!isEdge(ent_type)) {
            exist_edges_i = __model__.geom.query.navAnyToEdge(ent_type, index).slice();
        } else {
            exist_edges_i = [index];
        }
        const all_new_edges_i: number[] = [];
        for (const exist_edge_i of exist_edges_i) {
            const new_edges_i: number[] = _divide(__model__, exist_edge_i, divisor, method);
            all_new_edges_i.push(...new_edges_i);
        }
        return all_new_edges_i.map(one_edge_i => idMake(EEntType.EDGE, one_edge_i));
    } else {
        return [].concat(...(edge as TId[]).map(one_edge => Divide(__model__, one_edge, divisor, method)));
    }
}
// ================================================================================================
/**
 * Unweld vertices so that they do not share positions.
 * For the vertices of the specified entities, if they share positions with other entities in the model,
 * then those positions will be replaced with new positions.
 * This function performs a shallow unweld.
 * The vertices within the set of specified entities are not unwelded.
 * @param __model__
 * @param entities Vertex, edge, wire, face, point, polyline, polygon, collection.
 * @param method Enum, the method to use for unweld.
 * @returns The newly created positions resulting from the unweld.
 * @example mod.Unweld(polyline1)
 * @example_info Unwelds polyline1 from polyline2.
 */
export function Unweld(__model__: GIModel, entities: TId|TId[]): TId[] {
    // --- Error Check ---
    checkIDs('modify.Unweld', 'entities', entities, ['isID', 'isIDList'],
            ['VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL']);
    // --- Error Check ---
    if (!Array.isArray(entities)) {
        entities = [entities] as TId[];
    }
    // get verts_i
    const all_verts_i: number[] = []; // count number of posis
    for (const ent_id of entities) {
        const [ent_type, index]: [EEntType, number] = idBreak(ent_id);
        const verts_i: number[] = __model__.geom.query.navAnyToVert(ent_type, index);
        all_verts_i.push(...verts_i);
    }
    const new_posis_i: number [] = __model__.geom.add.unweldVerts(all_verts_i);
    return new_posis_i.map( posi_i => idMake(EEntType.POSI, posi_i) );
}
// ================================================================================================
// Explode

// Pipe

// Offset
