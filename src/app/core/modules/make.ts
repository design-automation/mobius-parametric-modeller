import { GIModel } from '@libs/geo-info/GIModel';
import { TCoord } from '@libs/geo-info/GIJson';
import { EAttribNames, TId, Txyz, TPlane} from '@libs/geo-info/GICommon';
import { __merge__ } from './_model';

/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords XYZ coordinates as a list of three numbers.
 * @returns New position if successful, null if unsuccessful or on error.
 * @example position1 = make.Position([1,2,3])
 *
 * Creates a position with coordinates x=1, y=2, z=3.
 */
export function Position(__model__: GIModel, coords: Txyz): TId {
    const posi_id: TId = __model__.geom().addPosition();
    __model__.attribs().setAttribValue(posi_id, EAttribNames.COORDS, coords);
    return posi_id;
}
/**
 * Adds a new point to the model.
 * @param __model__
 * @param position Position of point.
 * @returns New point if successful, null if unsuccessful or on error.
 * @example point1 = make.Point(position)
 *
 * Creates a point at position1.
 */
export function Point(__model__: GIModel, position: TId): TId {
    return __model__.geom().addPoint(position);
}
/**
 * Adds a new polyline to the model.
 * @param __model__
 * @param positions List of positions.
 * @returns New polyline if successful, null if unsuccessful or on error.
 * @example polyline1 = make.Polyline([position1,position2,position3])
 *
 * Creates an open polyline with vertices position1, position2, position3 in sequence.
 */
export function Polyline(__model__: GIModel, positions: TId|TId[]): TId {
    throw new Error("Not implemented."); return null;
    // return __model__.geom().addPline(positions);
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param positions List of positions.
 * @returns New polygon if successful, null if unsuccessful or on error.
 * @example polygon1 = make.Polygon([position1,position2,position3])
 *
 * Creates a polygon with vertices position1, position2, position3 in sequence.
 */
export function Polygon(__model__: GIModel, positions: TId|TId[]): TId {
    throw new Error("Not implemented."); return null;
    // return __model__.geom().addPgon(positions);
}
/**
 * Adds a new collection to the model.
 * @param __model__
 * @param objects List of points, polylines, polygons.
 * @returns New collection if successful, null if unsuccessful or on error.
 * @example collection1 = make.Collection([point1,polyine1,polygon1])
 *
 * Creates a collection containing point1, polyline1, polygon1.
 */
export function Collection(__model__: GIModel, objects: TId|TId[]): TId {
    throw new Error("Not implemented."); return null;
    // return __model__.geom().addColl(objects);
}
/**
 * Adds a new plane to the model from a location and two vectors.
 * @param __model__
 * @param location Position, point, vertex on plane
 * @param vector1 Vector on plane or list of three coordinates defining it.
 * @param vector2 Vector on plane or list of three coordinates defining it.
 * @returns New plane if successful, null if unsuccessful or on error.
 * @example plane1 = make.Plane(position1, vector1, [0,1,0])
 *
 * Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function PlaneVisible(__model__: GIModel, location: TId|Txyz, vector1: TId|Txyz, vector2: TId|Txyz): TId {
    throw new Error("Not implemented."); return null;
}
/**
 * Lofts between polylines or polygons.
 * @param __model__
 * @param objects Polylines or polygons.
 * @returns Lofted surface between objects.
 * @example surface1 = make.Loft([polyline1,polyline2,polyline3])
 *
 * Creates collection of surfaces lofting between polyline1, polyline2 and polyline3.
 */
export function Loft(__model__: GIModel, objects: TId[]  ): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Extrudes geometry by distance (in default direction = z-axis) or by vector.
 * - Extrusion of location produces a line;
 * - Extrusion of line produces a polygon;
 * - Extrusion of surface produces a list of surfaces.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param distance Number or vector.
 * @returns Extrusion of geometry.
 * @example extrusion1 = make.Extrude(point1, 10)
 *
 * Creates a line of length 10 in the z-direction.
 *
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0])
 *
 * Extrudes polygon1 by 5 in the y-direction, creating a list of surfaces.
 */
export function Extrude(__model__: GIModel, geometry: TId[], distance: number|Txyz): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Joins polylines to polylines or polygons to polygons.
 * @param __model__
 * @param objects Polylines or polygons.
 * @returns New joined polyline or polygon.
 * @example joined1 = make.Join([polyline1,polyline2])
 *
 * Creates a new polyline by joining polyline1 and polyline2.
 */
export function Join(__model__: GIModel, objects: TId[]): TId {
    throw new Error("Not implemented."); return null;
}
/**
 * Divides edge by length or by number of segments.
 * If edge is not exact multiple of length, length of last segment will be the remainder.
 * @param __model__
 * @param edges Edge(s) to be divided.
 * @param divisor Length or number of segments.
 * @param method Enum to choose which method.
 * @example segments1 = make.Divide(edge1, 5, number)
 *
 * Creates a list of 5 equal segments from edge1.
 *
 * @example segments2 = make.Divide(edge1, 5, length)
 *
 * If edge1 has length 13, creates from edge a list of two segments of length 5 and one segment of length 3.
 */
export function Divide(__model__: GIModel, edges: TId[], divisor: number, method: EOpDivide): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Adds a new copy to the model.
 * @param __model__
 * @param geometry Position, vertex, edge, wire, face, point, polyline, polygon, collection to be copied.
 * @returns New copy if successful, null if unsuccessful or on error.
 * @example copy1 = make.Copy([position1,polyine1,polygon1])
 *
 * Creates a list containing a copy of the objects in sequence of input.
 */
export function Copy(__model__: GIModel, geometry: TId|TId[]): TId|TId[] {
    throw new Error("Not implemented."); return null;
}
