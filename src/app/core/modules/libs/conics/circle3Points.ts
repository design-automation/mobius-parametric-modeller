import * as gs from "gs-json";
import * as mathjs from "mathjs";
import * as three from "three";
import * as threex from "../threex/threex";
const EPS = 1e-6;

// import * as roots from "poly-roots";
// import * as quadratic from "solve-quadratic-equation";
// import * as trigo from "./trigo";
// import * as pl from "../../plane_dev"; // TODO - can be reomved?

/**
 * Find the center of a circle that passes through three XYZ positions in 3D space.
 * @returns An array of intersection points
 */
function _circleCenterFrom3Points(a: gs.XYZ, b: gs.XYZ, c: gs.XYZ): gs.XYZ {
    //https://math.stackexchange.com/questions/1076177/3d-coordinates-of-circle-center-given-three-point-on-the-circle
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const cx = c[0];
    const cy = c[1];
    const cz = c[2];
    const Cx = bx - ax;
    const Cy = by - ay;
    const Cz = bz - az;
    const Bx = cx - ax;
    const By = cy - ay;
    const Bz = cz - az;
    const B2 = ax ** 2 - cx ** 2 + ay ** 2 - cy ** 2 + az ** 2 - cz ** 2;
    const C2 = ax ** 2 - bx ** 2 + ay ** 2 - by ** 2 + az ** 2 - bz ** 2;
    const CByz = Cy * Bz - Cz * By;
    const CBxz = Cx * Bz - Cz * Bx;
    const CBxy = Cx * By - Cy * Bx;
    const ZZ1 = -(Bz - Cz * Bx / Cx) / (By - Cy * Bx / Cx);
    const Z01 = -(B2 - Bx / Cx * C2) / (2 * (By - Cy * Bx / Cx));
    const ZZ2 = -(ZZ1 * Cy + Cz) / Cx;
    const Z02 = -(2 * Z01 * Cy + C2) / (2 * Cx);
    // and finally the coordinates of the center:
    const dz = -((Z02 - ax) * CByz - (Z01 - ay) * CBxz - az * CBxy) / (ZZ2 * CByz - ZZ1 * CBxz + CBxy);
    const dx = ZZ2 * dz + Z02;
    const dy = ZZ1 * dz + Z01;
    return [dx, dy, dz] as gs.XYZ;
}

export function circleFrom3Points(xyz1: gs.XYZ, xyz2: gs.XYZ, xyz3: gs.XYZ, is_closed: boolean):
        { origin: gs.XYZ, vec_x: gs.XYZ, vec_y: gs.XYZ, angle: number } {
    // create vectors
    const p1: three.Vector3 = new three.Vector3(...xyz1);
    const p2: three.Vector3 = new three.Vector3(...xyz2);
    const p3: three.Vector3 = new three.Vector3(...xyz3);
    const world_x: three.Vector3 = new three.Vector3(1, 0, 0);
    const world_y: three.Vector3 = new three.Vector3(0, 1, 0);
    const world_z: three.Vector3 = new three.Vector3(0, 0, 1);
    // calc vectors for xform matrix
    const x_axis: three.Vector3 = threex.subVectors(p2, p1); // .normalize();
    const tmp_vec: three.Vector3 = threex.subVectors(p3, p2);
    const z_axis: three.Vector3 = threex.crossVectors(x_axis, tmp_vec); // .normalize();
    const y_axis: three.Vector3 = threex.crossVectors(z_axis, x_axis); // .normalize();
    // create the xform matrices to map 3d -> 2d
    const m: three.Matrix4 = threex.xformMatrixNeg(p1, x_axis, y_axis);
    const m_inv: three.Matrix4 = threex.matrixInverse(m);
    // calc the circle origin
    const p2_2d: three.Vector3 = threex.multVectorMatrix(p2, m);
    const p3_2d: three.Vector3 = threex.multVectorMatrix(p3, m);
    const origin_2d_xyz: gs.XYZ = _circleCenterFrom3Points(
        [0, 0, 0], p2_2d.toArray() as gs.XYZ, p3_2d.toArray() as gs.XYZ);
    const origin_2d: three.Vector3 = new three.Vector3(...origin_2d_xyz);
    const circle_origin: three.Vector3 = threex.multVectorMatrix(origin_2d, m_inv);
    // calc the circle radius
    // const radius: number = origin_2d.length();
    // is not arc? then return data for circle
    m_inv.setPosition(new three.Vector3());
    if (is_closed) {
        const circle_x_axis_2d: three.Vector3 = new three.Vector3(origin_2d.length(), 0, 0);
        const circle_x_axis: three.Vector3 = threex.multVectorMatrix(circle_x_axis_2d, m_inv);
        const circle_y_axis_2d: three.Vector3 = new three.Vector3(0, 1, 0);
        const circle_y_axis: three.Vector3 = threex.multVectorMatrix(circle_y_axis_2d, m_inv);
        return {
            origin: circle_origin.toArray() as gs.XYZ,
            vec_x: circle_x_axis.toArray() as gs.XYZ,
            vec_y: circle_y_axis.toArray() as gs.XYZ,
            angle: null
        };
    }
    // calc the circle vectors
    const circle_x_axis_2d: three.Vector3 = threex.vectorNegate(origin_2d);
    const circle_x_axis: three.Vector3 = threex.multVectorMatrix(circle_x_axis_2d, m_inv);
    const circle_y_axis_2d: three.Vector3 = threex.crossVectors(world_z, circle_x_axis_2d);
    const circle_y_axis: three.Vector3 = threex.multVectorMatrix(circle_y_axis_2d, m_inv);
    // calc the circle angles
    const angle_vec_2d: three.Vector3 = threex.subVectors(p3_2d, origin_2d);
    let angle: number = circle_x_axis_2d.angleTo(angle_vec_2d);
    angle = angle * 180 / Math.PI;
    const angle_gt_180: boolean = (threex.crossVectors(circle_x_axis_2d, angle_vec_2d).z < 0);
    const y_gt_0: boolean = (circle_origin.y > 0);
    if (angle_gt_180) {
        angle = 360 - angle;
    }
    // return the data for arc
    return {
        origin: circle_origin.toArray() as gs.XYZ,
        vec_x: circle_x_axis.toArray() as gs.XYZ,
        vec_y: circle_y_axis.toArray() as gs.XYZ,
        angle: angle
    };
}

