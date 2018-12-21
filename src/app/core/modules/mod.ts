import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EOpDivide} from '@libs/geo-info/GICommon';

/**
 * Set new coordinates of existing position.
 * @param __model__
 * @param position Existing position.
 * @param xyz List of three coordinates.
 * @example mod.SetPosition(position1, [1,2,3])
 *
 * position1 will have new coordinates = [1,2,3].
 */
export function SetPosition(__model__: GIModel, position: TId, xyz: Txyz): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Moves geometry by vector.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param vector Vector or list of three coordinates.
 * @example mod.Move(geometry, vector)
 *
 * Moves geometry by vector.
 */
export function Move(__model__: GIModel, geometry: TId|TId[], vector: TId|Txyz): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Rotates geometry on plane by angle.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Plane to rotate on.
 * @param angle Angle (in radians).
 * @example mod.Rotate(geometry, plane1, pi)
 *
 * Rotates geometry on plane1 by pi (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, geometry: TId|TId[], origin: TPlane|TId, angle: number): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Scales geometry on plane by factor.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Plane to scale on.
 * @param scale Scale factor.
 * @example mod.Scale(geometry, plane1, 0.5)
 *
 * Scales geometry by 0.5 on plane1.
 */
export function Scale(__model__: GIModel, geometry: TId|TId[], origin: TPlane|TId, scale: number): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Mirrors geometry across plane.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param plane Plane to mirror across.
 * @example mod.Mirror(geometry, plane)
 *
 * Mirrors geometry across the plane.
 */
export function Mirror(__model__: GIModel, geometry: TId|TId[], plane: TPlane): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Transforms geometry from one construction plane to another.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from Plane defining target construction plane.
 * @param to Plane defining destination construction plane.
 * @example mod.XForm(geometry, plane1, plane2)
 *
 * Transforms geometry from plane1 to plane2.
 */
export function XForm(__model__: GIModel, geometry: TId|TId[], from: TPlane, to: TPlane): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Reverses direction of objects.
 * @param __model__
 * @param objects Vector, plane, polyline, polygon.
 * @returns ?
 * @example mod.Reverse(plane1)
 *
 * Flips plane1.
 *
 * @example mod.Reverse(polyline1)
 *
 * Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, objects: TId[]): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Welds geometry together.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @example mod.Weld([polyline1,polyline2])
 *
 * Welds both polyline1 and polyline2 together.
 */
export function Weld(__model__: GIModel, geometry: TId[]): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Unweld geometries.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @example mod.Unweld(polyline1,polyline2)
 *
 * Unwelds polyline1 from polyline2.
 */
export function Unweld(__model__: GIModel, geometry: TId|TId[]): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Closes polylines if open.
 * @param __model__
 * @param polyline Polyline(s).
 * @example mod.Close([polyline1,polyline2])
 *
 * If open, polylines are changed to closed; if closed, nothing happens.
 */
export function Close(__model__: GIModel, polyline: TId|TId[], close: boolean): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Checks if polyline(s) or wire(s) are closed.
 * @param __model__
 * @param lines Polyline(s) or wire(s).
 * @returns Boolean or list of boolean in input sequence of lines.
 * @example mod.IsClosed([polyline1,polyline2,polyline3])
 *
 * Returns list [true,true,false] if polyline1 and polyline2 are closed but polyline3 is open.
 */
export function IsClosed(__model__: GIModel, lines: TId|TId[]): boolean|boolean[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Deletes geometry.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @example mod.Delete(geometry)
 *
 * Deletes specified geometry from model.
 */
export function Delete(__model__: GIModel, geometry: TId|TId[]  ): void {
    throw new Error("Not implemented."); return null;
}
