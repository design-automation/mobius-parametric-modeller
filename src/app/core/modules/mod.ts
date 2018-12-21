import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EOpDivide} from '@libs/geo-info/GICommon';

/**
 * Set Position
 * @param __model__
 * @param position
 * @param xyz
 */
export function SetPosition(__model__: GIModel, position: TId, xyz: Txyz): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Move
 * @param __model__
 * @param positions
 */
export function Move(__model__: GIModel, positions: TId|TId[], vector: Txyz): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Rotate
 * @param __model__
 * @param positions
 * @param origin
 * @param angle
 */
export function Rotate(__model__: GIModel, positions: TId|TId[], origin: TPlane|TId, angle: number): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Rotate
 * @param __model__
 * @param positions
 * @param origin
 * @param scale
 */
export function Scale(__model__: GIModel, positions: TId|TId[], origin: TPlane, scale: number): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Mirror
 * @param __model__
 * @param positions
 * @param plane
 */
export function Mirror(__model__: GIModel, positions: TId|TId[], plane: TPlane): void {
    throw new Error("Not implemented."); return null;
}
/**
 * XForm
 * @param __model__
 * @param positions
 * @param from
 * @param to
 */
export function XForm(__model__: GIModel, positions: TId|TId[], from: TPlane, to: TPlane): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Loft
 * @param __model__
 * @param geometry
 */
export function Loft(__model__: GIModel, geometry: TId[]  ): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Extrude
 * @param __model__
 * @param geometry
 * @param distance number or vector
 */
export function Extrude(__model__: GIModel, geometry: TId[], distance: number|Txyz): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Reverse
 * @param __model__
 * @param objects
 */
export function Reverse(__model__: GIModel, objects: TId[]): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Join
 * @param __model__
 * @param objects
 */
export function Join(__model__: GIModel, objects: TId[]): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Weld
 * @param __model__
 * @param vertices
 */
export function Weld(__model__: GIModel, vertices: TId[]): number {
    throw new Error("Not implemented."); return null;
}
/**
 * Unweld
 * @param __model__
 * @param vertices
 */
export function Unweld(__model__: GIModel, vertices: TId[]): number {
    throw new Error("Not implemented."); return null;
}
/**
 * Divide edge by length
 * @param __model__
 * @param edges
 * @param divisor
 * @param method Enum
 */
export function Divide(__model__: GIModel, edges: TId[], divisor: number, method: EOpDivide): TId[] {
    throw new Error("Not implemented."); return null;
}
/**
 * Close polyline
 * @param __model__
 * @param polyline
 */
export function Close(__model__: GIModel, polyline: TId[], close: boolean): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Checks if a wire is closed.
 * @param __model__
 * @param lines
 */
export function IsClosed(__model__: GIModel, lines: TId|TId[]): boolean|boolean[] {
    throw new Error("Not impemented."); return null;
}
/**
 * Delete
 * @param __model__
 * @param geometry
 */
export function Delete(__model__: GIModel, geometry: TId|TId[]  ): void {
    throw new Error("Not implemented."); return null;
}
