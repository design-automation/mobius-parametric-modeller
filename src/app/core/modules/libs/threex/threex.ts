import * as gs from "gs-json";
import * as three from "three";
import {Arr} from "../arr/arr";

/**
 * Utility functions for threejs.
 */

const EPS: number = 1e-6;

 // Matrices ======================================================================================================

export function multVectorMatrix(v: three.Vector3, m: three.Matrix4): three.Vector3 {
    const v2: three.Vector3 = v.clone();
    v2.applyMatrix4(m);
    return v2;
}

export function multXYZMatrix(xyz: gs.XYZ, m: three.Matrix4): three.Vector3 {
    const v2: three.Vector3 = new three.Vector3(...xyz);
    v2.applyMatrix4(m);
    return v2;
}

/*
 * Transforms from LCS to GCS. The LCS is defined by origin, x axis, y axis.
 */
export function xformMatrixNeg(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
    const m1: three.Matrix4 = new three.Matrix4();
    const o_neg: three.Vector3 = o.clone().negate();
    m1.setPosition(o_neg);
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x.normalize(), y.normalize(), crossVectors(x,y,true));
    m2.getInverse(m2);
    const m3: three.Matrix4 = new three.Matrix4();
    // first translate to (0,0,0), then xform, so m1 x m2
    m3.multiplyMatrices(m2, m1);
    return m3;
}

/*
 * Transforms from GCS to LCS.The LCS is defined by origin, x axis, y axis.
 */
export function xformMatrixPos(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
    const m1: three.Matrix4 = new three.Matrix4();
    m1.setPosition(o);
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x.normalize(), y.normalize(), crossVectors(x,y,true));
    const m3: three.Matrix4 = new three.Matrix4();
    // first xform, then translate to origin, so m1 x m2
    m3.multiplyMatrices(m1, m2);
    return m3;
}

// get the inverse of a matrix
export function matrixInverse(m: three.Matrix4): three.Matrix4 {
    const m_inv: three.Matrix4 = new three.Matrix4();
    return m_inv.getInverse(m);
}

export function xformMatrixFromXYZAxes(o: gs.XYZ, axes: [gs.XYZ, gs.XYZ, gs.XYZ], neg: boolean): three.Matrix4 {
    const x_vec: three.Vector3 = new three.Vector3(...axes[0]).normalize();
    const y_vec: three.Vector3 = new three.Vector3(...axes[1]).normalize();
    if (neg) {
        return xformMatrixNeg(new three.Vector3(...o), x_vec, y_vec);
    }
    return xformMatrixPos(new three.Vector3(...o), x_vec, y_vec);
}

export function xformMatrixFromXYZVectors(o: gs.XYZ, xaxis: gs.XYZ, xyplane: gs.XYZ, neg: boolean): three.Matrix4 {
    const x_vec: three.Vector3 = new three.Vector3(...xaxis).normalize();
    const xyplane_vec: three.Vector3 = new three.Vector3(...xyplane).normalize();
    const z_vec: three.Vector3 = crossVectors(x_vec, xyplane_vec);
    const y_vec: three.Vector3 = crossVectors(z_vec, x_vec);
    if (neg) {
        return xformMatrixNeg(new three.Vector3(...o), x_vec, y_vec);
    }
    return xformMatrixPos(new three.Vector3(...o), x_vec, y_vec);
}

//  Vectors =======================================================================================================

/*
 * returns the y vector
 */
export function orthoVectors(vec_x: three.Vector3, vec: three.Vector3): three.Vector3 {
    return crossVectors(vec_x, vec).cross(vec_x);
}

export function vectorNegate(vector: three.Vector3): three.Vector3 {
    return vector.clone().negate();
}

export function vectorFromVertex(vertex: gs.IVertex): three.Vector3 {
    return new three.Vector3(...vertex.getPoint().getPosition());
}

export function vectorFromPoint(point: gs.IPoint): three.Vector3 {
    return new three.Vector3(...point.getPosition());
}

export function vectorsFromVertices(vertices: gs.IVertex[]): three.Vector3[] {
    return vertices.map((v) => new three.Vector3(...v.getPoint().getPosition()));
}

export function vectorsFromPoints(points: gs.IPoint[]): three.Vector3[] {
    return points.map((p) => new three.Vector3(...p.getPosition()));
}

export function subVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.subVectors(v1, v2);
    if (norm) {v3.normalize();}
    return v3;
}

export function addVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.addVectors(v1, v2);
    if (norm) {v3.normalize();}
    return v3;
}

export function crossVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
    const v3: three.Vector3 = new three.Vector3();
    v3.crossVectors(v1, v2);
    if (norm) {v3.normalize();}
    return v3;
}

export function dotVectors(v1: three.Vector3, v2: three.Vector3): number {
    return v1.dot(v2);
}

export function vectorFromPointsAtoB(a: gs.IPoint, b: gs.IPoint, norm: boolean = false): three.Vector3 {
    const v: three.Vector3 = subVectors(new three.Vector3(...b.getPosition()),
        new three.Vector3(...a.getPosition()));
    if (norm) {v.normalize();}
    return v;
}

export function vectorFromVerticesAtoB(a: gs.IVertex, b: gs.IVertex, norm: boolean = false): three.Vector3 {
    const v: three.Vector3 = subVectors(new three.Vector3(...b.getPoint().getPosition()),
        new three.Vector3(...a.getPoint().getPosition()));
    if (norm) {v.normalize();}
    return v;
}

// /*
//  * Finds the two orthogonal vectors in a plane defined by a set of co-planar points.
//  */
// export function orthoVectorsFromXYZs(points: three.Vector3[]): [three.Vector3, three.Vector3] {
//     if (points.length < 3) {return null;}
//     if (points.length == 3) {
//         const vec_x: three.Vector3 = new three.Vector3().subVectors(points[1], points[0]).normalize();
//         const vec: three.Vector3 = new three.Vector3().subVectors(points[2], points[0]).normalize();
//         const vec_y: three.Vector3 = orthoVectors(vec_x, vec);
//         if (vec_y.length() < EPS) {return null;}
//         return [vec_x, vec_y];
//     }
//     const x_bbox: {min:three.Vector3, max:three.Vector3, dim:number} = {min:null, max:null, dim:null};
//     const y_bbox: {min:three.Vector3, max:three.Vector3, dim:number} = {min:null, max:null, dim:null};
//     const z_bbox: {min:three.Vector3, max:three.Vector3, dim:number} = {min:null, max:null, dim:null};
//     for (const point of points) {
//         // find min max of x
//         if ((x_bbox.min === null) || (point.x < x_bbox.min.x)) {
//             x_bbox.min = point;
//         }
//         if ((x_bbox.max === null) || (point.x > x_bbox.max.x)) {
//             x_bbox.max = point;
//         }
//         // find min max of y
//         if ((y_bbox.min === null) || (point.y < y_bbox.min.y)) {
//             y_bbox.min = point;
//         }
//         if ((y_bbox.max === null) || (point.y > y_bbox.max.y)) {
//             y_bbox.max = point;
//         }
//         // find min max of z
//         if ((z_bbox.min === null) || (point.z < z_bbox.min.z)) {
//             z_bbox.min = point;
//         }
//         if ((z_bbox.max === null) || (point.z > z_bbox.max.z)) {
//             z_bbox.max = point;
//         }
//     }
//     x_bbox.dim = Math.abs(x_bbox.max[0] - x_bbox.min[0]);
//     y_bbox.dim = Math.abs(y_bbox.max[1] - y_bbox.min[1]);
//     z_bbox.dim = Math.abs(z_bbox.max[2] - z_bbox.min[2]);
//     const sorted_bbox = [x_bbox, y_bbox, z_bbox].sort((n1,n2) => {
//         if (n1.dim > n2.dim) {return -1;}
//         return 1;
//     });
//     if (sorted_bbox[0].dim < EPS) {return null;}
//     if (sorted_bbox[1].dim < EPS) {return null;}
//     const p1: three.Vector3 = sorted_bbox[0].min;
//     const p2: three.Vector3 = sorted_bbox[0].max;
//     const p3: three.Vector3 = sorted_bbox[1].min;
//     const p4: three.Vector3 = sorted_bbox[1].max;
//     const vec_x: three.Vector3 = p2.sub(p1).normalize();
//     const vec: three.Vector3 = p4.sub(p3).normalize();
//     const vec_y: three.Vector3 = orthoVectors(vec_x, vec);
//     if (vec_y.length() < EPS) {return null;}
//     return [vec_x, vec_y];
// }

/*
 * Finds the normal using Newell's method
 */
export function normalVectorFromPlanarVPoints(points: three.Vector3[]): three.Vector3 {

    const normal: three.Vector3 = new three.Vector3();
    for (let i = 0;i < points.length - 1; i++) {
        const point0: three.Vector3 = points[i];
        const point1: three.Vector3 = points[i + 1];
        normal.x += (point0.y - point1.y) * (point0.z + point1.z);
        normal.y += (point0.z - point1.z) * (point0.x + point1.x);
        normal.z += (point0.x - point1.x) * (point0.y + point1.y);
    }
    return normal.normalize();
}

/*
 * Finds the ortho vectors using Newell's method
 */
export function orthoVectorsFromPlanarVPoints(points: three.Vector3[]): [three.Vector3, three.Vector3] {
    const normal: three.Vector3 = new three.Vector3();
    let max_vec_len: number = 0;
    let vec_x: three.Vector3 = null;
    for (let i = 0;i < points.length - 1; i++) {
        const point0: three.Vector3 = points[i];
        const point1: three.Vector3 = points[i + 1];
        const test_vec: three.Vector3 = new three.Vector3().subVectors(point1, point0);
        if (test_vec.lengthSq() > max_vec_len) {vec_x = test_vec;}
        normal.x += (point0.y - point1.y) * (point0.z + point1.z);
        normal.y += (point0.z - point1.z) * (point0.x + point1.x);
        normal.z += (point0.x - point1.x) * (point0.y + point1.y);
    }
    normal.normalize();
    vec_x.normalize();
    const vec_y: three.Vector3 = new three.Vector3().crossVectors(vec_x, normal);
    if (vec_y.length() < EPS) {return null;}
    return [vec_x, vec_y];
}

/**
 * Create new vpoints between two existing vpoints.
 */
export function interpVPoints(pt1: three.Vector3, pt2: three.Vector3, num_points: number): three.Vector3[] {
    if (num_points < 1) {return [];}
    const vec: three.Vector3 = new three.Vector3().subVectors(pt2, pt1);
    vec.divideScalar(num_points + 1);
    const points: three.Vector3[] = [];
    let next: three.Vector3 = pt1;
    for (let i = 0; i < num_points; i++) {
        next = new three.Vector3().addVectors(next, vec);
        points.push(next);
    }
    return points;
}



//  XYZ ===========================================================================================================

export function subXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ, norm: boolean = false): gs.XYZ {
    return subVectors(new three.Vector3(...xyz1), new three.Vector3(...xyz2), norm).toArray() as gs.XYZ;
}

export function addXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ, norm: boolean = false): gs.XYZ {
    return addVectors(new three.Vector3(...xyz1), new three.Vector3(...xyz2), norm).toArray() as gs.XYZ;
}

export function crossXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ, norm: boolean = false): gs.XYZ {
    return crossVectors(new three.Vector3(...xyz1), new three.Vector3(...xyz2), norm).toArray() as gs.XYZ;
}

export function dotXYZs(xyz1: gs.XYZ, xyz2: gs.XYZ): number {
    return new three.Vector3(...xyz1).dot(new three.Vector3(...xyz2));
}

export function normalizeXYZ(xyz: gs.XYZ): gs.XYZ {
    return new three.Vector3(...xyz).normalize().toArray() as gs.XYZ;
}

export function lengthXYZ(xyz: gs.XYZ): number {
    return new three.Vector3(...xyz).length();
}

//  Points ========================================================================================================

export function subPoints(p1: gs.IPoint, p2: gs.IPoint, norm: boolean = false): gs.XYZ  {
    return subVectors(new three.Vector3(...p1.getPosition()),
        new three.Vector3(...p2.getPosition()), norm).toArray() as gs.XYZ;
}

export function addPoints(p1: gs.IPoint, p2: gs.IPoint, norm: boolean = false): gs.XYZ  {
    return addVectors(new three.Vector3(...p1.getPosition()),
        new three.Vector3(...p2.getPosition()), norm).toArray() as gs.XYZ;
}

export function addPointXYZ(p1: gs.IPoint, xyz_vec: gs.XYZ): gs.XYZ {
    return (new three.Vector3(...p1.getPosition()).add(new three.Vector3(...xyz_vec))).toArray() as gs.XYZ;
}

export function subPointXYZ(p1: gs.IPoint, xyz_vec: gs.XYZ): gs.XYZ {
    return (new three.Vector3(...p1.getPosition()).sub(new three.Vector3(...xyz_vec))).toArray() as gs.XYZ;
}

export function movePointsAddXYZ(points: gs.IPoint[]|gs.IPoint[][], xyz_vec: gs.XYZ): void {
    const vec: three.Vector3 = new three.Vector3(...xyz_vec);
    const points_flat: gs.IPoint[] = Arr.flatten(points);
    const point_ids: number[] = [];
    const points_no_dups: gs.IPoint[] = [];
    for (const point of points_flat) {
        if (point_ids.indexOf(point.getID()) === -1) {
            points_no_dups.push(point);
            point_ids.push(point.getID());
        }
    }
    for (const point of points_no_dups) {
        const xyz_point: gs.XYZ = (new three.Vector3(...point.getPosition()).add(vec)).toArray() as gs.XYZ;
        point.setPosition(xyz_point);
    }
}

export function distPointToPoint(p1: gs.IPoint, p2: gs.IPoint): number {
    return (new three.Vector3(...p1.getPosition())).distanceTo(new three.Vector3(...p2.getPosition()));
}

export function distSquPointToPoint(p1: gs.IPoint, p2: gs.IPoint): number {
    return (new three.Vector3(...p1.getPosition())).distanceToSquared(new three.Vector3(...p2.getPosition()));
}

export function distManPointToPoint(p1: gs.IPoint, p2: gs.IPoint): number {
    return (new three.Vector3(...p1.getPosition())).manhattanDistanceTo(new three.Vector3(...p2.getPosition()));
}

//  Vertices ======================================================================================================

export function subVertices(v1: gs.IVertex, v2: gs.IVertex, norm: boolean = false): gs.XYZ  {
    return subVectors(new three.Vector3(...v1.getPoint().getPosition()),
        new three.Vector3(...v2.getPoint().getPosition()), norm).toArray() as gs.XYZ;
}

export function addVertices(v1: gs.IVertex, v2: gs.IVertex, norm: boolean = false): gs.XYZ  {
    return addVectors(new three.Vector3(...v1.getPoint().getPosition()),
        new three.Vector3(...v2.getPoint().getPosition()), norm).toArray() as gs.XYZ;
}

//  3D to 2D ======================================================================================================

/**
 * Transform a set of vertices in 3d space onto the xy plane. This function assumes that the vertices
 * are co-planar. Returns a set of three Vectors that represent points on the xy plane.
 */
export function makeVertices2D(vertices: gs.IVertex[]): three.Vector3[] {
    const points: three.Vector3[] = vectorsFromVertices(vertices);
    const o: three.Vector3 = new three.Vector3();
    for (const v of points) {
        o.add(v);
    }
    o.divideScalar(points.length);
    let vx: three.Vector3;
    let vz: three.Vector3;
    let got_vx = false;
    for (let i=0;i<vertices.length;i++) {
        if (!got_vx) {
            vx =  subVectors(points[i], o).normalize();
            if (vx.lengthSq() !== 0) {got_vx = true;}
        } else {
            vz = crossVectors(vx, subVectors(points[i],o).normalize()).normalize();
            if (vz.lengthSq() !== 0) {break;}
        }
        if (i === vertices.length - 1) {throw new Error("Trinagulation found bad face.");}
    }
    const vy: three.Vector3 =  crossVectors(vz, vx);
    const m: three.Matrix4 = xformMatrixNeg(o, vx, vy);
    // const m: three.Matrix4 = xformMatrix(o, vx, vy, vz);
    const points_2d: three.Vector3[] = points.map((v) => multVectorMatrix(v,m));
    // console.log(o, vx, vy, vz);
    // console.log(points_2d);
    return points_2d;
}

//  Query ======================================================================================================

/**
 * Check planes are parallel.
 * The plane is represented by an origin and a normal.
 */
export function planesAreParallel(normal1: three.Vector3|gs.XYZ,
                                  normal2: three.Vector3|gs.XYZ): boolean {
    // args
    let normal1_v: three.Vector3;
    if (Array.isArray(normal1)) {
        normal1_v = new three.Vector3(...normal1);
    } else {
        normal1_v = normal1;
    }
    normal1_v.normalize();
    let normal2_v: three.Vector3;
    if (Array.isArray(normal2)) {
        normal2_v = new three.Vector3(...normal2);
    } else {
        normal2_v = normal2;
    }
    normal2_v.normalize();
    // check is vectors are same
    if (Math.abs(1- normal1_v.dot(normal2_v)) > EPS) {return false; }
    return true;
}

/**
 * Check a point is on a plane.
 * The plane is represented by an origin and a normal.
 */
export function planesAreCoplanar(origin1: three.Vector3|gs.IPoint, normal1: three.Vector3|gs.XYZ,
                                  origin2: three.Vector3|gs.IPoint, normal2: three.Vector3|gs.XYZ): boolean {
    // args
    let origin1_v: three.Vector3;
    if (origin1 instanceof gs.Point) {
        origin1_v = new three.Vector3(...origin1.getPosition());
    } else {
        origin1_v = origin1 as three.Vector3;
    }
    let normal1_v: three.Vector3;
    if (Array.isArray(normal1)) {
        normal1_v = new three.Vector3(...normal1);
    } else {
        normal1_v = normal1;
    }
    normal1_v.normalize();
    let origin2_v: three.Vector3;
    if (origin2 instanceof gs.Point) {
        origin2_v = new three.Vector3(...origin2.getPosition());
    } else {
        origin2_v = origin2 as three.Vector3;
    }
    let normal2_v: three.Vector3;
    if (Array.isArray(normal2)) {
        normal2_v = new three.Vector3(...normal2);
    } else {
        normal2_v = normal2;
    }
    normal2_v.normalize();
    // Check if point is on plane
    if (Math.abs(dotVectors(subVectors(origin1_v, origin2_v), normal2_v)) > EPS) {return false;}
    // check is vectors are same
    if (Math.abs(1- normal1_v.dot(normal2_v)) > EPS) {return false; }
    return true;
}

/**
 * Check a point is on a plane.
 * The plane is represented by an origin and a normal.
 */
export function pointIsOnPlane(origin: gs.IPoint, normal: gs.XYZ, point: gs.IPoint): boolean {
    const origin_v  = new three.Vector3(...origin.getPosition());
    const normal_v  = new three.Vector3(...normal).normalize();
    const point_v  = new three.Vector3(...point.getPosition());
    if(dotVectors(subVectors(point_v, origin_v), normal_v) === 0) {return true;}
    return false;
}

/**
 * Check if vectors are same dir.
 */
export function vectorsAreCodir(xyz1: gs.XYZ, xyz2: gs.XYZ): boolean {
    // Check if point is on plane
    const v1  = new three.Vector3(...xyz1).normalize();
    const v2  = new three.Vector3(...xyz2).normalize();
    if (Math.abs(1- v1.dot(v2)) > EPS) {return false; }
    return true;
}
