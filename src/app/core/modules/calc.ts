/**
 * Function for doing various geometric calculations.
 */

/**
 *
 */

import * as gs from "gs-json";
import * as three from "three";
import * as threex from "./libs/threex/threex";
import * as error from "./_error_msgs_dev";

//  ===============================================================================================================
//  Pline Get and Copy ============================================================================================
//  ===============================================================================================================

/**
 * Calculate the distance between two points.
 *
 * @param point1 The first point.
 * @param point2 The second point.
 * @returns The distance.
 */
export function distBetweenPoints(point1: gs.IPoint, point2: gs.IPoint): number {
    error.checkPoint(point1);
    error.checkPoint(point2);
    error.checkPointsSameModel([point1, point2]);
    return threex.vectorFromPointsAtoB(point1, point2).length();
}

/**
 * Creates a vector (a list of 3 numbers) from point 1 to point 2.
 *
 * @param point1 The first point.
 * @param point2 The second point.
 * @returns A list of three numbers.
 */
export function vectorBetweenPoints(point1: gs.IPoint, point2: gs.IPoint): gs.XYZ {
    error.checkPoint(point1);
    error.checkPoint(point2);
    error.checkPointsSameModel([point1, point2]);
    return threex.vectorFromPointsAtoB(point1, point2).toArray() as gs.XYZ;
}

