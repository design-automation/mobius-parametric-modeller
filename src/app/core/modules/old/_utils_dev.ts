import * as gs from "gs-json";
import * as three from "three";

export function copyObjPoints(obj: gs.IObj, reverse_faces: boolean): gs.IPoint[][][] {
    const new_points_map: Map<number, gs.IPoint> = new Map();
    const new_faces_points: gs.IPoint[][] = [];
    const new_wires_points: gs.IPoint[][] = [];
    const faces: gs.IFace[] = obj.getFaces();
    for (const face of faces) {
        const face_points: gs.IPoint[] = face.getVertices().map((v) => v.getPoint());
        const new_face_points: gs.IPoint[] = [];
        for (const point of face_points) {
            if (new_points_map.has(point.getID())) {
                new_face_points.push(new_points_map.get(point.getID()));
            } else {
                const new_point: gs.IPoint = point.copy() as gs.IPoint;
                new_face_points.push(new_point);
                new_points_map.set(point.getID(), new_point);
            }
        }
        if (reverse_faces) {new_face_points.reverse()}
        new_faces_points.push(new_face_points);
    }
    const wires: gs.IWire[] = obj.getWires();
    for (const wire of wires) {
        const wire_points: gs.IPoint[] = wire.getVertices().map((v) => v.getPoint());
        const new_wire_points: gs.IPoint[] = [];
        for (const point of wire_points) {
            if (new_points_map.has(point.getID())) {
                new_wire_points.push(new_points_map.get(point.getID()));
            } else {
                const new_point: gs.IPoint = point.copy() as gs.IPoint;
                new_wire_points.push(new_point);
                new_points_map.set(point.getID(), new_point);
            }
        }
        new_wires_points.push(new_wire_points); // do not reverse
    }
    return [new_wires_points, new_faces_points];
}
