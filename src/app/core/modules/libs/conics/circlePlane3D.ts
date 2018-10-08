import * as gs from "gs-json";
import * as mathjs from "mathjs";
import * as three from "three";
import * as threex from "../threex/threex";
import * as trigo from "./trigo";
import * as circleUtil from "./circleUtil";
const EPS = 1e-6;

/**
 * Circle-Plane intersection
 * @param circle
 * @param plane
 * @returns Adds intersecting points to the geometry if successfull, [] if empty or coplanar
 */
export function isectCirclePlane3D(circle: gs.ICircle, plane: gs.IPlane): gs.IPoint[] {
    // http://mathforum.org/library/drmath/view/69136.html
    const m: gs.IModel = circle.getModel();
    const eps: number = 1e-7;
    // get plane
    const PO: number[] = plane.getOrigin().getPosition();
    const n1: number[] = [plane.getCartesians()[0], plane.getCartesians()[1], plane.getCartesians()[2]];
    // get circle
    const C0: number[] = circle.getOrigin().getPosition();
    const CA: [gs.XYZ, gs.XYZ, gs.XYZ] = circle.getAxes();
    const U1: three.Vector3 = new three.Vector3(...CA[0]);
    const V1: three.Vector3 = new three.Vector3(...CA[1]).setLength(U1.length());
    const _n1: three.Vector3 = new three.Vector3(n1[0], n1[1], n1[2]);
    // calculate t
    const A: number = n1[0] * (C0[0] - PO[0]) + n1[1] * (C0[1] - PO[1]) + n1[2] * (C0[2] - PO[2]);
    const B: number = n1[0] * U1.x + n1[1] * U1.y + n1[2] * U1.z;
    const C: number = n1[0] * V1.x + n1[1] * V1.y + n1[2] * V1.z;
    const _t: number[] = trigo._solve_trigo(A, B, C);
    if (_t === null) { return []; }
    const result: gs.IPoint[] = [];

    if (Math.abs(Math.abs(_t[0] - _t[1]) - Math.PI) < EPS ) {delete _t[0];}

    for (const t of _t) {
        if ((t !== null) && (t != undefined)) {
            let ok1: boolean = false;
            let ok2: boolean = false;
            if (circle.isClosed()) {
                ok1 = true;
                ok2 = true;
            } else {
                let angle: number = t * (180 / Math.PI);
                if (circleUtil.angleInCircle(circle, angle)) { ok1 = true; }
                if (circleUtil.angleInCircle(circle, angle + 180)) { ok2 = true; }
                //console.log(circle.getAngles(), angle, ok1, angle + 180, ok2);
            }

            if (ok1) {
                const point1: three.Vector3 = new three.Vector3(
                    C0[0] + Math.cos(t) * U1.x + Math.sin(t) * V1.x - PO[0],
                    C0[1] + Math.cos(t) * U1.y + Math.sin(t) * V1.y - PO[1],
                    C0[2] + Math.cos(t) * U1.z + Math.sin(t) * V1.z - PO[2],
                );
                //console.log("point1", t, point1);
                if (Math.abs(_n1.dot(point1)) < eps) {
                    result.push(m.getGeom().addPoint([
                        C0[0] + Math.cos(t) * U1.x + Math.sin(t) * V1.x,
                        C0[1] + Math.cos(t) * U1.y + Math.sin(t) * V1.y,
                        C0[2] + Math.cos(t) * U1.z + Math.sin(t) * V1.z
                    ]));
                }
            }
            if (ok2) {
                const point2: three.Vector3 = new three.Vector3(
                    C0[0] + Math.cos(t + Math.PI) * U1.x + Math.sin(t + Math.PI) * V1.x - PO[0],
                    C0[1] + Math.cos(t + Math.PI) * U1.y + Math.sin(t + Math.PI) * V1.y - PO[1],
                    C0[2] + Math.cos(t + Math.PI) * U1.z + Math.sin(t + Math.PI) * V1.z - PO[2],
                );
                //console.log("point2", t, point2);
                if (Math.abs(_n1.dot(point2)) < eps) {
                    result.push(m.getGeom().addPoint([
                        C0[0] + Math.cos(t + Math.PI) * U1.x + Math.sin(t + Math.PI) * V1.x,
                        C0[1] + Math.cos(t + Math.PI) * U1.y + Math.sin(t + Math.PI) * V1.y,
                        C0[2] + Math.cos(t + Math.PI) * U1.z + Math.sin(t + Math.PI) * V1.z
                    ]));
                }
            }
        }
    }
    return result;
}
