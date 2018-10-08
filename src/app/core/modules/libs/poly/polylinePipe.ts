import * as gs from "gs-json";
import * as three from "three";
import * as threex from "../threex/threex";

const EPS: number = 1e-6;

/**
 * Pipes a polylines.
 */
export function pipe(pline: gs.IPolyline, radius: number, segments: number): gs.IPolymesh {
    const model: gs.IModel = pline.getModel();
    // create the section
    const sec_vpts_xy: three.Vector3[] = [new three.Vector3(radius, 0, 0)];
    const rot_matrix: three.Matrix4 = new three.Matrix4().makeRotationZ((Math.PI * 2) / segments);
    for (let i = 1; i < segments; i++) {
        sec_vpts_xy.push(sec_vpts_xy[sec_vpts_xy.length - 1].clone().applyMatrix4(rot_matrix));
    }
    // Get the points
    const points_raw: gs.IPoint[] = pline.getPointsArr();
    const points: gs.IPoint[] = [];
    // check for zero dist points
    for (let i = 0; i < points_raw.length; i++) {
        const p1: gs.IPoint = points_raw[i];
        let inext: number = i+1;
        if (i === points_raw.length - 1) {inext = 0;}
        const p2: gs.IPoint = points_raw[inext];
        if (threex.distManPointToPoint(p1, p2) > EPS) {points.push(p1);} // TODO COuld be slow
    }

    // Add points for closed polylines
    if (pline.isClosed() && pline.numVertices() > 3) {points.push(points[0]);points.push(points[1]);}
    // Create vpoints
    const vpoints: three.Vector3[] = points.map((p) => new three.Vector3(...p.getPosition()));
    // Do all the other points first
    let start_x_vec: three.Vector3 = null;
    let end_x_vec: three.Vector3 = null;
    let prev_x_vec: three.Vector3 = null;
    const sec_pts_array: gs.IPoint[][] = [];
    if (points.length > 2) {
        // Loop through pline segments
        for (let i = 1; i < points.length - 1; i++) {
            // Get the points
            const prev: three.Vector3 = vpoints[i-1];
            const curr: three.Vector3 = vpoints[i];
            const next: three.Vector3 = vpoints[i+1];
            const vec_c_p: three.Vector3 = new three.Vector3().subVectors(prev, curr).normalize();
            const vec_c_n: three.Vector3 = new three.Vector3().subVectors(next, curr).normalize();
            let x_vec: three.Vector3 = new three.Vector3().crossVectors(vec_c_p, vec_c_n);
            let y_vec: three.Vector3;
            // get a valid x vector
            if (x_vec.length() > EPS) {
                prev_x_vec = x_vec;
                y_vec = new three.Vector3().addVectors(vec_c_p, vec_c_n).multiplyScalar(0.5);
            } else {
                if (prev_x_vec !== null) {
                    x_vec = prev_x_vec;
                } else {
                    if (vec_c_n.y > EPS || vec_c_n.z > EPS) {
                        x_vec.crossVectors(vec_c_n, new three.Vector3(1,0,0));
                    } else {
                        x_vec.crossVectors(vec_c_n, new three.Vector3(0,1,0));
                    }
                }
                y_vec = new three.Vector3().crossVectors(vec_c_n, x_vec).normalize();
            }
            // calc the transform

            const matrix: three.Matrix4 = threex.xformMatrixPos(curr, x_vec, y_vec);
            const angle: number = vec_c_p.angleTo(vec_c_n);
            const scale: number = Math.cos(angle / 2);
            const matrix_scale: three.Matrix4 = new three.Matrix4().makeScale(1,1 + scale,1)
            matrix.multiply(matrix_scale); // first scale, then transform
            const xformed: three.Vector3[] = sec_vpts_xy.map((p) => p.clone().applyMatrix4(matrix));
            const new_points: gs.IPoint[] = xformed.map((v) => model.getGeom().addPoint([v.x, v.y, v.z]));
            sec_pts_array.push(new_points);

            if (i === 1) {start_x_vec = x_vec;}
            if (i === points.length - 2) {end_x_vec = x_vec;}
        }
    }
    // For open plines, calc start and end sections
    if (!pline.isClosed()) {
        // Do the first and last points for open polylines
        const start_end: gs.IPoint[][] = [];
        const first: three.Vector3[] = [vpoints[0], vpoints[1], start_x_vec];
        const extend: three.Vector3 = new three.Vector3().subVectors(
            vpoints[vpoints.length - 1], vpoints[vpoints.length - 2]).add(vpoints[vpoints.length - 1]);
        const last: three.Vector3[] = [vpoints[vpoints.length - 1], extend, end_x_vec];
        for (const triple of [first, last]) {
            const z_vec: three.Vector3 = new three.Vector3().subVectors(triple[1], triple[0]).normalize();
            let x_vec: three.Vector3 = new three.Vector3();
            if (triple[2] !== null) {
                x_vec = triple[2];
            } else if (z_vec.y > EPS || z_vec.z > EPS) {
                x_vec.crossVectors(z_vec, new three.Vector3(1,0,0));
            } else {
                x_vec.crossVectors(z_vec, new three.Vector3(0,1,0));
            }
            const y_vec: three.Vector3 = new three.Vector3().crossVectors(z_vec, x_vec);
            const matrix: three.Matrix4 = threex.xformMatrixPos(triple[0], x_vec, y_vec);
            const xformed: three.Vector3[] = sec_vpts_xy.map((v) => v.clone().applyMatrix4(matrix));
            const new_points: gs.IPoint[] = xformed.map((v) => model.getGeom().addPoint([v.x, v.y, v.z]));
            start_end.push(new_points);
        }
        sec_pts_array.unshift(start_end[0]);
        sec_pts_array.push(start_end[1]);

    }
    // Create the mesh points
    const mesh_points: gs.IPoint[][] = [];
    for (let i = 0; i< sec_pts_array.length; i++) {
        let inext: number = i + 1;
        if (pline.isClosed() && inext === sec_pts_array.length) {
            inext = 0;
        }
        if (!pline.isClosed() && inext === sec_pts_array.length) {
            break;
        }
        for (let j = 0; j < segments; j++) {
            let jnext: number = j + 1;
            if (jnext === segments) {jnext = 0;}
            const v1: gs.IPoint = sec_pts_array[i][j];
            const v2: gs.IPoint = sec_pts_array[i][jnext];
            const v3: gs.IPoint = sec_pts_array[inext][jnext];
            const v4: gs.IPoint = sec_pts_array[inext][j];
            mesh_points.push([v1, v2, v3, v4]);
        }
    }
    // Create the mesh
    //console.log(mesh_points);
    return model.getGeom().addPolymesh(mesh_points);
}
