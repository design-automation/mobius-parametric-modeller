import { GIModel } from './GIModel';
import { TNormal, TTexture, EAttribNames, Txyz, EEntType, EAttribDataTypeStrs, TAttribDataTypes } from './common';
import { GIAttribMap } from './GIAttribMap';


 /**
 * Import geojson
 */
export function importGeojson(geojson_str: string): any {
    const model: GIModel = new GIModel();
    const geojson_data: any = JSON.parse(geojson_str);
    console.log('GEOJSON', geojson_data);
    processGeojson(model, geojson_data, 0);
    return model;
}

enum EGeojsoFeatureType {
    POINT = 'Point',
    LINESTRING = 'LineString',
    POLYGON = 'Polygon',
    MULTIPOINT = 'MultiPoint',
    MULTILINESTRING = 'MultiLineString',
    MULTIPOLYGON = 'MultiPolygon'
}
/**
 * Converts geojson to a gs model.
 * @param obj_data The geojson data..
 * @returns Model
 */
export function processGeojson(model: GIModel, obj_data: any, elevation: number): void {
    console.log('Number of features = ', obj_data.features.length);
    // arrays for features
    const point_f: any[] = [];
    const linestring_f: any[] = [];
    const polygon_f: any[] = [];
    const polygons_hole_f: any[] = [];
    const multipoint_f: any[] = [];
    const multilinestring_f: any[] = [];
    const multipolygon_f: any[] = [];
    const multipolygons_hole_f: any[] = [];
    const other_f: any[] = [];
    // arrays for objects
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const colls_i: number[] = [];
    // loop
    for (const feature of obj_data.features) {
        // get the features
        switch (feature.geometry.type) {
            case EGeojsoFeatureType.POINT:
                point_f.push(feature);
                const point_i: number = _addPointToModel(model, feature, elevation);
                points_i.push(point_i);
                break;
            case EGeojsoFeatureType.LINESTRING:
                linestring_f.push(feature);
                const pline_i: number = _addPlineToModel(model, feature, elevation);
                plines_i.push(pline_i);
                break;
            case EGeojsoFeatureType.POLYGON:
                polygon_f.push(feature);
                const pgon_i: number = _addPgonToModel(model, feature, elevation);
                pgons_i.push(pgon_i);
                break;
            case EGeojsoFeatureType.MULTIPOINT:
                multipoint_f.push(feature);
                const points_coll_i: [number[], number] = _addPointCollToModel(model, feature, elevation);
                for (const point_coll_i of points_coll_i[0]) {
                    points_i.push(point_coll_i);
                }
                colls_i.push(points_coll_i[1]);
                break;
            case EGeojsoFeatureType.MULTILINESTRING:
                multilinestring_f.push(feature);
                const plines_coll_i: [number[], number] = _addPlineCollToModel(model, feature, elevation);
                for (const pline_coll_i of plines_coll_i[0]) {
                    plines_i.push(pline_coll_i);
                }
                colls_i.push(plines_coll_i[1]);
                break;
            case EGeojsoFeatureType.MULTIPOLYGON:
                multipolygon_f.push(feature);
                const pgons_coll_i: [number[], number] = _addPgonCollToModel(model, feature, elevation);
                for (const pgon_coll_i of pgons_coll_i[0]) {
                    pgons_i.push(pgon_coll_i);
                }
                colls_i.push(pgons_coll_i[1]);
                break;
            default:
                other_f.push(feature);
                break;
        }
    }
    // log message
    console.log(
        'Point: '           + point_f.length + '\n' +
        'LineString: '      + linestring_f.length + '\n' +
        'Polygon: '         + polygon_f.length + '\n' +
        'MultiPoint: '      + multipoint_f.length + '\n' +
        'MultiLineString: ' + multilinestring_f.length + '\n' +
        'MultiPolygon: '    + multipolygon_f.length + '\n' +
        'Other: '           + other_f + '\n\n');
}


/*
    "geometry": {
        "type": "Point",
        "coordinates": [40, 40]
    }
*/
/**
 * Add a point to the model
 * @param model The model.
 * @param point The features to add.
 */
function _addPointToModel(model: GIModel, point: any, elevation: number): number {
    // add feature
    const xyz: Txyz = [point.geometry.coordinates[0], point.geometry.coordinates[1], elevation];
    // create the posi
    const posi_i: number = model.geom.add.addPosi();
    model.attribs.add.setPosiCoords(posi_i, xyz);
    // create the point
    const point_i: number = model.geom.add.addPoint(posi_i);
    // add attribs
    _addAttribsToModel(model, EEntType.POINT, point_i, point);
    // return the index
    return point_i;
}

/*
    "geometry": {
        "type": "LineString",
        "coordinates": [
            [30, 10], [10, 30], [40, 40]
        ]
    }
*/
/**
 * Add a pline to the model
 * @param model The model
 * @param linestrings The features to add.
 */
function _addPlineToModel(model: GIModel, linestring: any, elevation: number): number {
    // add feature
    let xyzs: Txyz[] = linestring.geometry.coordinates.map((xy: number[]) => [xy[0], xy[1], elevation]);
    const first_xyz: Txyz = xyzs[0];
    const last_xyz: Txyz = xyzs[xyzs.length - 1];
    const close = xyzs.length > 2 && first_xyz[0] === last_xyz[0] && first_xyz[1] === last_xyz[1];
    if (close) { xyzs = xyzs.slice(0, xyzs.length - 1); }
    // create the posis
    const posis_i: number[] = [];
    for (const xyz of xyzs) {
        const posi_i: number = model.geom.add.addPosi();
        model.attribs.add.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // create the pline
    const pline_i: number = model.geom.add.addPline(posis_i, close);
    // add attribs
    _addAttribsToModel(model, EEntType.PLINE, pline_i, linestring);
    // return the index
    return pline_i;
}

/*
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]],
            [[20, 30], [35, 35], [30, 20], [20, 30]]
        ]
    }
*/
/**
 * Add a pgon to the model
 * @param model The model
 * @param polygons The features to add.
 */
function _addPgonToModel(model: GIModel, polygon: any, elevation: number): number {
    // add feature
    const rings: number[][] = [];
    for (const ring of polygon.geometry.coordinates) {
        const xyzs: Txyz[] = polygon.geometry.coordinates[0].map((xy: number[]) => [xy[0], xy[1], elevation]);
        // create the posis
        const posis_i: number[] = [];
        for (const xyz of xyzs) {
            const posi_i: number = model.geom.add.addPosi();
            model.attribs.add.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
        rings.push(posis_i);
    }
    // create the pgon
    const pgon_i: number = model.geom.add.addPgon(rings[0], rings.slice(1));
    // add attribs
    _addAttribsToModel(model, EEntType.PGON, pgon_i, polygon);
    // return the index
    return pgon_i;
}


/*
    "geometry": {
        "type": "MultiPoint",
        "coordinates": [
            [10, 10],
            [40, 40]
        ]
    }
*/
/**
 * Adds multipoint to the model
 * @param model The model
 * @param multipoint The features to add.
 */
function _addPointCollToModel(model: GIModel, multipoint: any, elevation: number): [number[], number] {
    // add features
    const points_i: number[] = [];
    for (const coordinates of multipoint.geometry.coordinates) {
        const point_i: number = _addPointToModel(model, {'coordinates': coordinates}, elevation);
        points_i.push(point_i);
    }
    // create the collection
    const coll_i: number = model.geom.add.addColl(null, [], points_i, []);
    // add attribs
    _addAttribsToModel(model, EEntType.COLL, coll_i, multipoint);
    // return the indices of the plines and the index of the collection
    return [points_i, coll_i];
}

/*
    "geometry": {
        "type": "MultiLineString",
        "coordinates": [
            [[10, 10], [20, 20], [10, 40]],
            [[40, 40], [30, 30], [40, 20], [30, 10]]
        ]
    }
*/
/**
 * Adds multilinestrings to the model
 * @param multilinestrings The features to add.
 * @param model The model
 */
function _addPlineCollToModel(model: GIModel, multilinestring: any, elevation: number): [number[], number] {
    // add features
    const plines_i: number[] = [];
    for (const coordinates of multilinestring.geometry.coordinates) {
        const pline_i: number = _addPlineToModel(model, {'coordinates': coordinates}, elevation);
        plines_i.push(pline_i);
    }
    // create the collection
    const coll_i: number = model.geom.add.addColl(null, [], plines_i, []);
    // add attribs
    _addAttribsToModel(model, EEntType.COLL, coll_i, multilinestring);
    // return the indices of the plines and the index of the collection
    return [plines_i, coll_i];
}

/*
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [[40, 40], [20, 45], [45, 30], [40, 40]]
            ],
            [
                [[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]],
                [[30, 20], [20, 15], [20, 25], [30, 20]]
            ]
        ]
    }
*/
/**
 * Adds multipolygons to the model
 * @param model The model
 * @param multipolygons The features to add.
 */
function _addPgonCollToModel(model: GIModel, multipolygon: any, elevation: number): [number[], number] {
    // add features
    const pgons_i: number[] = [];
    for (const coordinates of multipolygon.geometry.coordinates) {
        const pgon_i: number = _addPgonToModel(model, {'coordinates': coordinates}, elevation);
        pgons_i.push(pgon_i);
    }
    // create the collection
    const coll_i: number = model.geom.add.addColl(null, [], [], pgons_i);
    // add attribs
    _addAttribsToModel(model, EEntType.COLL, coll_i, multipolygon);
    // return the indices of the plines and the index of the collection
    return [pgons_i, coll_i];
}

/**
 * Adds multilinestrings to the model
 * @param multilinestrings The features to add.
 * @param model The model
 */
function _addAttribsToModel(model: GIModel, ent_type: EEntType, ent_i: number, feature: any): void {
    // add attribs
    for (const name of Object.keys(feature.properties)) {
        let value: any = feature.properties[name];
        const value_type: string = typeof feature.properties[name];
        if (value_type === 'object') {
            value = JSON.stringify(value);
        }
        model.attribs.add.setAttribValue(ent_type, ent_i, name, value);
    }
}

