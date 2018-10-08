import * as gs from "gs-json";

/**
 * Calculates distance between two points or two clusters of points
 * @param points_1 Point 1 or first cluster of points
 * @param points_2 Point 2 or second cluster of points
 * @param min Returns minimum distance between two clusters of points if true, maximum distance if false
 * @returns Dist0ance between points if successful, none if unsuccessful or on error
 */
export function distBetweenPoints(point_1: gs.IPoint[], point_2: gs.IPoint[], minimum: boolean = true) {
    let min: number = 0;
    let max: number = 0;
    let distance: number = 0;
    for (const p1 of point_1) {
        for (const p2 of point_2) {
            distance = Math.sqrt(
                (p1.getPosition()[0] - p2.getPosition()[0]) * (p1.getPosition()[0] - p2.getPosition()[0]) +
                (p1.getPosition()[1] - p2.getPosition()[1]) * (p1.getPosition()[1] - p2.getPosition()[1]) +
                (p1.getPosition()[2] - p2.getPosition()[2]) * (p1.getPosition()[2] - p2.getPosition()[2]));
            if (distance > max) { max = distance; }
            if (distance < min) { min = distance; }
        }
    }
    if (minimum === true) { return min; }
    return max;
}
