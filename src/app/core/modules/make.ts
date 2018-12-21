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
 * @example point1 = make.Point(position1)
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
export function Plane(__model__: GIModel, location: TId|Txyz, vector1: TId|Txyz, vector2: TId|Txyz): TId {
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
