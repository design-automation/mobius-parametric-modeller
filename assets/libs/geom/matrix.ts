import * as three from 'three';
import { vecNorm, vecCross } from './vectors';
import { Vector3 } from 'three';
type Txyz = [number, number, number]; // x, y, z
type TPlane = [Txyz, Txyz, Txyz]; // origin, xaxis, yaxis
const EPS = 1e-6;

export function multMatrix(xyz: Txyz, m: three.Matrix4): Txyz {
    const v2: three.Vector3 = new three.Vector3(...xyz as Txyz);
    v2.applyMatrix4(m);
    return v2.toArray() as Txyz;
}

export function mirrorMatrix(origin: Txyz, normal: Txyz): three.Matrix4 {
    // plane normal
    const [a, b, c]: number[] = vecNorm(normal);
    // rotation matrix
    const matrix_mirror: three.Matrix4 = new three.Matrix4();
    matrix_mirror.set(
        1 - (2 * a * a), -2 * a * b, -2 * a * c, 0,
        -2 * a * b, 1 - (2 * b * b), -2 * b * c, 0,
        -2 * a * c, -2 * b * c, 1 - (2 * c * c), 0,
        0, 0, 0, 1
    );
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // final matrix
    const move_mirror_move: three.Matrix4 = matrix_trn2.multiply(matrix_mirror.multiply(matrix_trn1));
    // do the xform
    return move_mirror_move;
}

export function rotateMatrix(origin: Txyz, axis: Txyz, angle: number): three.Matrix4 {
    // norm the axis
    axis = vecNorm(axis);
    // rotation matrix
    const matrix_rot: three.Matrix4 = new three.Matrix4();
    matrix_rot.makeRotationAxis(new three.Vector3(...axis), angle);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // final matrix
    const move_rot_move: three.Matrix4 = matrix_trn2.multiply(matrix_rot.multiply(matrix_trn1));
    // do the xform
    return move_rot_move;
}

export function scaleMatrix(origin: Txyz|TPlane, factor: Txyz): three.Matrix4 {
    const origin_point: Txyz = (Array.isArray(origin[0])) ? origin[0] : origin as Txyz;
    // TODO deal with the case where origin is a plane
    // scale matrix
    const matrix_scale: three.Matrix4 = new three.Matrix4();
    matrix_scale.makeScale(factor[0], factor[1], factor[2]);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin_point[0], -origin_point[1], -origin_point[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin_point[0], origin_point[1], origin_point[2]);
    // final matrix
    const move_scale_move: three.Matrix4 = matrix_trn2.multiply(matrix_scale.multiply(matrix_trn1));
    // do the xform
    return move_scale_move;
}

export function xfromSourceTargetMatrix(source_plane: TPlane, target_plane: TPlane): three.Matrix4 {
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_source_to_gcs: three.Matrix4 = _xformMatrixFromXYZVectors(
        source_plane[0], source_plane[1], source_plane[2], true);
    const matrix_gcs_to_target: three.Matrix4 = _xformMatrixFromXYZVectors(
        target_plane[0], target_plane[1], target_plane[2], false);
    // final matrix
    const xform: three.Matrix4 = matrix_gcs_to_target.multiply(matrix_source_to_gcs);
    // return the matrix
    return xform;
}

// ================================================================================================
// Helper functions
// ================================================================================================

function _crossVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.crossVectors(v1, v2);
    if (norm) { v3.normalize(); }
    return v3;
}

function _dotVectors(v1: three.Vector3, v2: three.Vector3): number {
    return v1.dot(v2);
}

function _xformMatrixFromXYZVectors(o: Txyz, xaxis: Txyz, xyplane: Txyz, neg: boolean): three.Matrix4 {
    const x_vec: three.Vector3 = new three.Vector3(...xaxis).normalize();
    const xyplane_vec: three.Vector3 = new three.Vector3(...xyplane).normalize();
    const z_vec: three.Vector3 = _crossVectors(x_vec, xyplane_vec);
    const y_vec: three.Vector3 = _crossVectors(z_vec, x_vec);
    if (neg) {
        return _xformMatrixNeg(new three.Vector3(...o), x_vec, y_vec);
    }
    return xformMatrixPos(new three.Vector3(...o), x_vec, y_vec);
}

function _xformMatrixNeg(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
    const m1: three.Matrix4 = new three.Matrix4();
    const o_neg: three.Vector3 = o.clone().negate();
    m1.setPosition(o_neg);
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x.normalize(), y.normalize(), _crossVectors(x, y, true));
    m2.getInverse(m2);
    const m3: three.Matrix4 = new three.Matrix4();
    // first translate to (0,0,0), then xform, so m1 x m2
    m3.multiplyMatrices(m2, m1);
    return m3;
}

function xformMatrixPos(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
    const m1: three.Matrix4 = new three.Matrix4();
    m1.setPosition(o);
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x.normalize(), y.normalize(), _crossVectors(x, y, true));
    const m3: three.Matrix4 = new three.Matrix4();
    // first xform, then translate to origin, so m1 x m2
    m3.multiplyMatrices(m1, m2);
    return m3;
}

// ---------------------------------------------------------------------------------

function _matrixFromXYZ(pts: Txyz[],
    from_origin: Txyz, from_vectors: Txyz[],
    to_origin: Txyz, to_vectors: Txyz[]): number[][] {

    const e1: three.Vector3 = new three.Vector3(from_vectors[0][0]).normalize();
    const e2: three.Vector3 = new three.Vector3(from_vectors[0][1]).normalize();
    const e3: three.Vector3 = new three.Vector3(from_vectors[0][2]).normalize();

    const b1: three.Vector3 = new three.Vector3(to_vectors[0][0]).normalize();
    const b2: three.Vector3 = new three.Vector3(to_vectors[0][1]).normalize();
    const b3: three.Vector3 = new three.Vector3(to_vectors[0][2]).normalize();

    if (e1.dot(e2) === 0) { throw new Error('Orthonormal initial basis required'); }
    if (e1.dot(e3) === 0) { throw new Error('Orthonormal initial basis required'); }
    if (e2.dot(e3) === 0) { throw new Error('Orthonormal initial basis required'); }
    if (b1.dot(b2) === 0) { throw new Error('Orthonormal initial basis required'); }
    if (b1.dot(b3) === 0) { throw new Error('Orthonormal initial basis required'); }
    if (b2.dot(b3) === 0) { throw new Error('Orthonormal initial basis required'); }

    const matrix: three.Matrix3 = new three.Matrix3();
    matrix.set(e1.dot(b1), e1.dot(b2), e1.dot(b3),
    e2.dot(b1), e2.dot(b2), e2.dot(b3),
    e3.dot(b1), e3.dot(b2), e3.dot(b3));

    const t_x: number = to_origin[0] - from_origin[0];
    const t_y: number = to_origin[1] - from_origin[1];
    const t_z: number = to_origin[2] - from_origin[2];

    return [[e1.dot(b1), e1.dot(b2), e1.dot(b3), t_x],
    [e2.dot(b1), e2.dot(b2), e2.dot(b3), t_y],
    [e3.dot(b1), e3.dot(b2), e3.dot(b3), t_z],
    [0, 0, 0, 1]];
}
