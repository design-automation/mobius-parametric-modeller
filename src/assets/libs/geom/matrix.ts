import * as three from 'three';
import { vecNorm, vecCross } from './vectors';
type Txyz = [number, number, number]; // x, y, z
type TPlane = [Txyz, Txyz, Txyz]; // origin, xaxis, yaxis
type TRay = [Txyz, Txyz]; // origin, dir

export function multMatrix(xyz: Txyz, m: three.Matrix4): Txyz {
    const v2: three.Vector3 = new three.Vector3(...xyz as Txyz);
    v2.applyMatrix4(m);
    return v2.toArray() as Txyz;
}

export function mirrorMatrix(plane: TPlane): three.Matrix4 {
    const origin: Txyz = plane[0];
    const normal: Txyz = vecCross(plane[1], plane[2]);
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

export function rotateMatrix(ray: TRay, angle: number): three.Matrix4 {
    const origin: Txyz = ray[0];
    const axis: Txyz = vecNorm(ray[1]);
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

export function scaleMatrix(plane: TPlane, factor: Txyz): three.Matrix4 {
    // scale matrix
    const matrix_scale: three.Matrix4 = new three.Matrix4();
    matrix_scale.makeScale(factor[0], factor[1], factor[2]);
    // xform matrix
    const matrix_xform1: three.Matrix4 = xformMatrix(plane, true);
    const matrix_xform2: three.Matrix4 = xformMatrix(plane, false);
    // final matrix
    const xform_scale_xform: three.Matrix4 = matrix_xform2.multiply(matrix_scale.multiply(matrix_xform1));
    // do the xform
    return xform_scale_xform;
}

export function xfromSourceTargetMatrix(source_plane: TPlane, target_plane: TPlane): three.Matrix4 {
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_source_to_gcs: three.Matrix4 = xformMatrix(source_plane, true);
    const matrix_gcs_to_target: three.Matrix4 = xformMatrix(target_plane, false);
    // final matrix
    const xform: three.Matrix4 = matrix_gcs_to_target.multiply(matrix_source_to_gcs);
    // return the matrix
    return xform;
}

// ================================================================================================
// Helper functions
// ================================================================================================
export function xformMatrix(plane: TPlane, neg: boolean): three.Matrix4 {
    const o: three.Vector3 = new three.Vector3(...plane[0]);
    const x: three.Vector3 = new three.Vector3(...plane[1]);
    const y: three.Vector3 = new three.Vector3(...plane[2]);
    const z: three.Vector3 = new three.Vector3(...vecCross(plane[1], plane[2]));
    if (neg) {
        o.negate();
    }
    // origin translate matrix
    const m1: three.Matrix4 = new three.Matrix4();
    m1.setPosition(o);
    // xfrom matrix
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x, y, z);
    // combine two matrices
    const m3: three.Matrix4 = new three.Matrix4();
    if (neg) {
        const m2x = (new three.Matrix4()).getInverse(m2);
        // first translate to origin, then xform, so m2 x m1
        m3.multiplyMatrices(m2x, m1);
    } else {
        // first xform, then translate to origin, so m1 x m2
        m3.multiplyMatrices(m1, m2);
    }
    // return the combined matrix
    return m3;
}

// ---------------------------------------------------------------------------------

// function _matrixFromXYZ(pts: Txyz[],
//     from_origin: Txyz, from_vectors: Txyz[],
//     to_origin: Txyz, to_vectors: Txyz[]): number[][] {

//     const e1: three.Vector3 = new three.Vector3(from_vectors[0][0]).normalize();
//     const e2: three.Vector3 = new three.Vector3(from_vectors[0][1]).normalize();
//     const e3: three.Vector3 = new three.Vector3(from_vectors[0][2]).normalize();

//     const b1: three.Vector3 = new three.Vector3(to_vectors[0][0]).normalize();
//     const b2: three.Vector3 = new three.Vector3(to_vectors[0][1]).normalize();
//     const b3: three.Vector3 = new three.Vector3(to_vectors[0][2]).normalize();

//     if (e1.dot(e2) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (e1.dot(e3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (e2.dot(e3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (b1.dot(b2) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (b1.dot(b3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (b2.dot(b3) === 0) { throw new Error('Orthonormal initial basis required'); }

//     const matrix: three.Matrix3 = new three.Matrix3();
//     matrix.set(e1.dot(b1), e1.dot(b2), e1.dot(b3),
//     e2.dot(b1), e2.dot(b2), e2.dot(b3),
//     e3.dot(b1), e3.dot(b2), e3.dot(b3));

//     const t_x: number = to_origin[0] - from_origin[0];
//     const t_y: number = to_origin[1] - from_origin[1];
//     const t_z: number = to_origin[2] - from_origin[2];

//     return [[e1.dot(b1), e1.dot(b2), e1.dot(b3), t_x],
//     [e2.dot(b1), e2.dot(b2), e2.dot(b3), t_y],
//     [e3.dot(b1), e3.dot(b2), e3.dot(b3), t_z],
//     [0, 0, 0, 1]];
// }

// export function scaleMatrix(plane: TPlane, factor: Txyz): three.Matrix4 {
//     // scale matrix
//     const matrix_scale: three.Matrix4 = new three.Matrix4();
//     matrix_scale.makeScale(factor[0], factor[1], factor[2]);
//     // xform matrix
//     const matrix_xform1: three.Matrix4 = _xformMatrixFromXYZVectors(
//         plane[0], plane[1], plane[2], true);
//     const matrix_xform2: three.Matrix4 = _xformMatrixFromXYZVectors(
//         plane[0], plane[1], plane[2], false);
//     // final matrix
//     const xform_scale_xform: three.Matrix4 = matrix_xform2.multiply(matrix_scale.multiply(matrix_xform1));
//     // do the xform
//     return xform_scale_xform;
// }


// function _dotVectors(v1: three.Vector3, v2: three.Vector3): number {
//     return v1.dot(v2);
// }

// function _xformMatrixNeg(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
//     const m1: three.Matrix4 = new three.Matrix4();
//     const o_neg: three.Vector3 = o.clone().negate();
//     m1.setPosition(o_neg);
//     const m2: three.Matrix4 = new three.Matrix4();
//     m2.makeBasis(x.normalize(), y.normalize(), _crossVectors(x, y, true));
//     m2.getInverse(m2);
//     const m3: three.Matrix4 = new three.Matrix4();
//     // first translate to (0,0,0), then xform, so m1 x m2
//     m3.multiplyMatrices(m2, m1);
//     return m3;
// }

// function xformMatrixPos(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
//     const m1: three.Matrix4 = new three.Matrix4();
//     m1.setPosition(o);
//     const m2: three.Matrix4 = new three.Matrix4();
//     m2.makeBasis(x.normalize(), y.normalize(), _crossVectors(x, y, true));
//     const m3: three.Matrix4 = new three.Matrix4();
//     // first xform, then translate to origin, so m1 x m2
//     m3.multiplyMatrices(m1, m2);
//     return m3;
// }



// function _xformMatrixFromXYZVectors(o: Txyz, xaxis: Txyz, xyplane: Txyz, neg: boolean): three.Matrix4 {
//     const x_vec: three.Vector3 = new three.Vector3(...xaxis).normalize();
//     const xyplane_vec: three.Vector3 = new three.Vector3(...xyplane).normalize();
//     const z_vec: three.Vector3 = _crossVectors(x_vec, xyplane_vec);
//     const y_vec: three.Vector3 = _crossVectors(z_vec, x_vec);
//     if (neg) {
//         return _xformMatrixNeg(new three.Vector3(...o), x_vec, y_vec);
//     }
//     return xformMatrixPos(new three.Vector3(...o), x_vec, y_vec);
// }

// export function xfromSourceTargetMatrix(source_plane: TPlane, target_plane: TPlane): three.Matrix4 {
//     // matrix to xform from source to gcs, then from gcs to target
//     const matrix_source_to_gcs: three.Matrix4 = _xformMatrixFromXYZVectors(
//         source_plane[0], source_plane[1], source_plane[2], true);
//     const matrix_gcs_to_target: three.Matrix4 = _xformMatrixFromXYZVectors(
//         target_plane[0], target_plane[1], target_plane[2], false);
//     // final matrix
//     const xform: three.Matrix4 = matrix_gcs_to_target.multiply(matrix_source_to_gcs);
//     // return the matrix
//     return xform;
// }

// function _crossVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
//     const v3: three.Vector3 = new three.Vector3();
//     v3.crossVectors(v1, v2);
//     if (norm) { v3.normalize(); }
//     return v3;
// }
