import { GIModel } from '@libs/geo-info/GIModel';
import { exportObj } from '@libs/geo-info/export';
import { importObj } from '@libs/geo-info/import';
import { download } from '@libs/filesys/download';
import { TId, EEntityTypeStr, Txyz, TPlane, TRay } from '@libs/geo-info/common';
import { __merge__ } from './_model';
import { vecMult, vecAdd, vecSub } from '@libs/geom/vectors';
import { _model } from '@modules';

// Import / Export data types
export enum _EIODataFormat {
    GI = 'gi',
    OBJ = 'obj'
}
/**
 * Import data into the model.
 *
 * @param model_data The model data in gs-json string format.
 * @param data_format Enum of GI or OBJ.
 * @returns void
 * @example util.ImportData (file1, OBJ)
 * @example_info Imports the data from file1 (defining the .obj file uploaded in 'Start' node).
 */
export function ImportData(__model__: GIModel, model_data: string, data_format: _EIODataFormat): void {
    switch (data_format) {
        case _EIODataFormat.GI:
            const gi_model: GIModel = new GIModel(JSON.parse(model_data));
            __merge__(__model__, gi_model);
            break;
        case _EIODataFormat.OBJ:
            const obj_model: GIModel = importObj(model_data);
            __merge__(__model__, obj_model);
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
}
/**
 * Export data from the model.
 * @param __model__
 * @param filename Name of the file as a string.
 * @param data_format Enum of GI or OBJ.
 * @returns Boolean.
 */
export function ExportData(__model__: GIModel, filename: string, data_format: _EIODataFormat): boolean {
    switch (data_format) {
        case _EIODataFormat.GI:
            return download( JSON.stringify(__model__.getData()), filename );
            break;
        case _EIODataFormat.OBJ:
            const data: string = exportObj(__model__);
            return download( data, filename );
            break;
        default:
            throw new Error('Data type not recognised');
            break;
    }
}
/**
 * Adds a ray to the model from an origin location and vector.
 * @param __model__
 * @param ray A list of two list of three coordinates
 * @returns A points and a line representing the ray. (The point is tha start point of the ray.)
 * @example ray1 = make.RayVisible([[1,2,3],[0,0,1]])
 */
export function RayGeom(__model__: GIModel, ray: TRay, scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'make.RayVisible';
    // checkIDnTypes(fn_name, 'origin', origin, ['isID', 'isCoord'], ['POSI', 'POINT', 'VERT']);
    // --- Error Check ---
    const origin: Txyz = ray[0];
    const vec: Txyz = vecMult(ray[1], scale);
    const end: Txyz = vecAdd(origin, vec);
    // create orign point
    const origin_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create pline
    const end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(end_posi_i, end);
    const pline_i = __model__.geom.add.addPline([origin_posi_i, end_posi_i]);
    // return the geometry IDs
    return [EEntityTypeStr.POINT + point_i, EEntityTypeStr.PLINE + pline_i];
}
/**
 * Adds a plane to the model from an origin location and two vectors.
 * @param __model__
 * @param plane A list of lists
 * @returns A points, a polygon and two polyline representing the plane. (The point is the origin of the plane.)
 * @example plane1 = make.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function PlaneGeom(__model__: GIModel, plane: TPlane, scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'make.PlanerVisible';
    // checkIDnTypes(fn_name, 'location', location, ['isID', 'isCoord'], ['POSI', 'POINT', 'VERT']);
    // checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
    // checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
    // --- Error Check ---
    const origin: Txyz = plane[0];
    const x_vec: Txyz = vecMult(plane[1], scale);
    const y_vec: Txyz = vecMult(plane[2], scale);
    let x_end: Txyz = vecAdd(origin, x_vec);
    let y_end: Txyz = vecAdd(origin, y_vec);
    const plane_corners: Txyz[] = [
        vecAdd(x_end, y_vec),
        vecSub(y_end, x_vec),
        vecSub(vecSub(origin, x_vec), y_vec),
        vecSub(x_end, y_vec),
    ];
    x_end = vecAdd(x_end, vecMult(x_vec, 0.1));
    y_end = vecSub(y_end, vecMult(y_vec, 0.1));
    // create the point
    const origin_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(origin_posi_i, origin);
    const point_i = __model__.geom.add.addPoint(origin_posi_i);
    // create the x axis
    const x_end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(x_end_posi_i, x_end);
    const x_pline_i = __model__.geom.add.addPline([origin_posi_i, x_end_posi_i]);
    // create the y axis
    const y_end_posi_i: number = __model__.geom.add.addPosition();
    __model__.attribs.add.setPosiCoords(y_end_posi_i, y_end);
    const y_pline_i = __model__.geom.add.addPline([origin_posi_i, y_end_posi_i]);
    // create pline for plane
    const corner_posis_i: number[] = [];
    for (const corner of plane_corners) {
        const posi_i: number = __model__.geom.add.addPosition();
        __model__.attribs.add.setPosiCoords(posi_i, corner);
        corner_posis_i.push(posi_i);
    }
    const plane_i = __model__.geom.add.addPline(corner_posis_i, true);
    // return the geometry IDs
    return [
        EEntityTypeStr.POINT + point_i,
        EEntityTypeStr.PLINE + x_pline_i, EEntityTypeStr.PLINE + y_pline_i,
        EEntityTypeStr.PLINE + plane_i
    ];
}
