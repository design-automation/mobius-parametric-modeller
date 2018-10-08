import * as gs from "gs-json";

/**
 * Finds closest point on an object to a test point.
 * @param point Test point to consider
 * @param obj Object to test for closest point
 * @returns Closest point on object if successful, null if unsuccessful or on error
 */
export function closestPoint(point: gs.IPoint, obj: gs.IObj): gs.IPoint {
    throw new Error("Method not implemented");
}

/**
 * Fuses two points into a single point.
 * @param points Points to fuse
 * @param tolerance Max distance between the two points allowed
 * @param copy Performs transformation on duplicate copy of input points
 * @returns New point if successful, null if unsuccessful or on error
 */
export function fuse(points: gs.IPoint[], tolerance: number, copy: boolean): gs.IPoint {
    throw new Error("Method not implemented");
}


//  ===============================================================================================================
//  Old Functions No Longer in API ================================================================================
//  ===============================================================================================================
