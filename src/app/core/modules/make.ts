import { GIModel } from '@libs/geo-info/GIModel';
import { TCoord } from '@libs/geo-info/GIJson';
import { EAttribNames, TId, Txyz, TPlane} from '@libs/geo-info/GICommon';
import { __merge__ } from './_model';

/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords
 */
export function Position(__model__: GIModel, coords: TCoord): TId {
    const posi_id: TId = __model__.geom().addPosition();
    __model__.attribs().setAttribValue(posi_id, EAttribNames.COORDS, coords);
    return posi_id;
}
/**
 * Adds a new point to the model.
 * @param __model__
 * @param coords
 */
export function Point(__model__: GIModel, position: TId): TId {
    return __model__.geom().addPoint(position);
}
/**
 * Adds a new polyline to the model.
 * @param __model__
 * @param positions
 */
export function Polyline(__model__: GIModel, positions: TId|TId[]): TId {
    throw new Error("Not impemented."); return null;
    // return __model__.geom().addPline(positions);
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param positions
 */
export function Polygon(__model__: GIModel, positions: TId|TId[]): TId {
    throw new Error("Not impemented."); return null;
    // return __model__.geom().addPgon(positions);
}
/**
 * Adds a new collectiob to the model.
 * @param __model__
 * @param positions
 */
export function Collection(__model__: GIModel, objects: TId|TId[]): TId {
    throw new Error("Not impemented."); return null;
    // return __model__.geom().addColl(objects);
}
/**
 * Adds a new plane to the model.
 * @param __model__
 * @param plane
 */
export function Plane(__model__: GIModel, plane: TPlane): TId {
    throw new Error("Not impemented."); return null;
}
/**
 * Adds a new collectiob to the model.
 * @param __model__
 * @param objects
 */
export function Copy(__model__: GIModel, objects: TId|TId[]): TId|TId[] {
    throw new Error("Not impemented."); return null;
}
