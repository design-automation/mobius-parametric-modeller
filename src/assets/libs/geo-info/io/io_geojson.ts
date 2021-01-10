import { GIModel } from '../GIModel';
import { Txyz, EEntType, TAttribDataTypes, LONGLAT, Txy, TEntTypeIdx, IEntSets } from '../common';
import { getArrDepth } from '@assets/libs/util/arrs';
import proj4 from 'proj4';
import { vecAng2, vecDot } from '../../geom/vectors';
import { rotateMatrix, multMatrix } from '../../geom/matrix';
import { Matrix4 } from 'three';
import { getObjSets } from './common';


enum EGeojsoFeatureType {
    POINT = 'Point',
    LINESTRING = 'LineString',
    POLYGON = 'Polygon',
    MULTIPOINT = 'MultiPoint',
    MULTILINESTRING = 'MultiLineString',
    MULTIPOLYGON = 'MultiPolygon'
}
export function exportGeojson(model: GIModel, entities: TEntTypeIdx[], flatten: boolean, ssid: number): string {
    // create the projection object
    const proj_obj: proj4.Converter = _createProjection(model);
    // calculate angle of rotation
    let rot_matrix: Matrix4 = null;
    if (model.modeldata.attribs.query.hasModelAttrib('north')) {
        const north: Txy = model.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        if (Array.isArray(north)) {
            const rot_ang: number = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], -rot_ang);
        }
    }
    // create features from pgons, plines, points
    const features: object[] = [];
    const obj_sets: IEntSets = getObjSets(model, entities, ssid);
    for (const pgon_i of obj_sets.pg) {
        features.push(_createGeojsonPolygon(model, pgon_i, proj_obj, rot_matrix, flatten));
    }
    for (const pline_i of obj_sets.pl) {
        features.push(_createGeojsonLineString(model, pline_i, proj_obj, rot_matrix, flatten));
    }
    for (const pline_i of obj_sets.pt) {
        //
        //
        // TODO implement points
        //
        //
    }
    const export_json = {
        'type': 'FeatureCollection',
        'features': features
    };
    return JSON.stringify(export_json, null, 2); // pretty
}
function _createGeojsonPolygon(model: GIModel, pgon_i: number, proj_obj: any, rot_matrix: Matrix4, flatten: boolean): object {
    // {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "Polygon",
    //       "coordinates": [
    //         [
    //           [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
    //           [100.0, 1.0], [100.0, 0.0]
    //         ]
    //       ]
    //     },
    //     "properties": {
    //       "prop0": "value0",
    //       "prop1": { "this": "that" }
    //     }
    // }
    const all_coords: Txy[][] = [];
    const wires_i: number[] = model.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
    for (let i = 0; i < wires_i.length; i++) {
        const coords: Txy[] = [];
        const posis_i: number[] = model.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[i]);
        for (const posi_i of posis_i) {
            const xyz: Txyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
            const lat_long: [number, number] = _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten) as [number, number];
            coords.push(lat_long);
        }
        all_coords.push(coords);
    }
    const all_props = {};
    for (const name of model.modeldata.attribs.getAttribNames(EEntType.PGON)) {
        if (!name.startsWith('_')) {
            all_props[name] = model.modeldata.attribs.get.getEntAttribVal(EEntType.PGON, pgon_i, name);
        }
    }
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': all_coords
        },
        'properties': all_props
    };
}
function _createGeojsonLineString(model: GIModel, pline_i: number, proj_obj: any, rot_matrix: Matrix4, flatten: boolean): object {
    // {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "LineString",
    //       "coordinates": [
    //         [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
    //       ]
    //     },
    //     "properties": {
    //       "prop0": "value0",
    //       "prop1": 0.0
    //     }
    // },
    const coords: Txy[] = [];
    const wire_i: number = model.modeldata.geom.nav.navPlineToWire(pline_i);
    const posis_i: number[] = model.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        const lat_long: [number, number] = _xformFromXYZToLongLat(xyz, proj_obj, rot_matrix, flatten) as [number, number];
        coords.push(lat_long);
    }
    if (model.modeldata.geom.query.isWireClosed(wire_i)) {
        coords.push(coords[0]);
    }
    const all_props = {};
    for (const name of model.modeldata.attribs.getAttribNames(EEntType.PLINE)) {
        if (!name.startsWith('_')) {
            all_props[name] = model.modeldata.attribs.get.getEntAttribVal(EEntType.PLINE, pline_i, name);
        }
    }
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': coords
        },
        'properties': all_props
    };
}
 /**
 * Import geojson
 */
export function importGeojson(model: GIModel, geojson_str: string, elevation: number): IEntSets {
    // parse the json data str
    const geojson_obj: any = JSON.parse(geojson_str);
    const proj_obj: proj4.Converter = _createProjection(model);
    // calculate angle of rotation
    let rot_matrix: Matrix4 = null;
    if (model.modeldata.attribs.query.hasModelAttrib('north')) {
        const north: Txy = model.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        if (Array.isArray(north)) {
            const rot_ang: number = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // arrays for features
    const point_f: any[] = [];
    const linestring_f: any[] = [];
    const polygon_f: any[] = [];
    const multipoint_f: any[] = [];
    const multilinestring_f: any[] = [];
    const multipolygon_f: any[] = [];
    const other_f: any[] = [];
    // arrays for objects
    const points_i: Set<number> = new Set();
    const plines_i: Set<number> = new Set();
    const pgons_i: Set<number> = new Set();
    const colls_i: Set<number> = new Set();
    // loop
    for (const feature of geojson_obj.features) {
        // get the features
        switch (feature.geometry.type) {
            case EGeojsoFeatureType.POINT:
                point_f.push(feature);
                const point_i: number = _addPointToModel(model, feature, proj_obj, rot_matrix, elevation);
                if (point_i !== null) {
                    points_i.add(point_i);
                }
                break;
            case EGeojsoFeatureType.LINESTRING:
                linestring_f.push(feature);
                const pline_i: number = _addPlineToModel(model, feature, proj_obj, rot_matrix, elevation);
                if (pline_i !== null) {
                    plines_i.add(pline_i);
                }
                break;
            case EGeojsoFeatureType.POLYGON:
                polygon_f.push(feature);
                const pgon_i: number = _addPgonToModel(model, feature, proj_obj, rot_matrix, elevation);
                if (pgon_i !== null) {
                    pgons_i.add(pgon_i);
                }
                break;
            case EGeojsoFeatureType.MULTIPOINT:
                multipoint_f.push(feature);
                const points_coll_i: [number[], number] = _addPointCollToModel(model, feature, proj_obj, rot_matrix, elevation);
                for (const point_coll_i of points_coll_i[0]) {
                    points_i.add(point_coll_i);
                }
                colls_i.add(points_coll_i[1]);
                break;
            case EGeojsoFeatureType.MULTILINESTRING:
                multilinestring_f.push(feature);
                const plines_coll_i: [number[], number] = _addPlineCollToModel(model, feature, proj_obj, rot_matrix, elevation);
                for (const pline_coll_i of plines_coll_i[0]) {
                    plines_i.add(pline_coll_i);
                }
                colls_i.add(plines_coll_i[1]);
                break;
            case EGeojsoFeatureType.MULTIPOLYGON:
                multipolygon_f.push(feature);
                const pgons_coll_i: [number[], number] = _addPgonCollToModel(model, feature, proj_obj, rot_matrix, elevation);
                for (const pgon_coll_i of pgons_coll_i[0]) {
                    pgons_i.add(pgon_coll_i);
                }
                colls_i.add(pgons_coll_i[1]);
                break;
            default:
                other_f.push(feature);
                break;
        }
    }
    // return sets
    return {
        pt: points_i,
        pl: plines_i,
        pg: pgons_i,
        co: colls_i
    };
}


/**
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
function _createProjection(model: GIModel): proj4.Converter {
        // create the function for transformation
        const proj_str_a = '+proj=tmerc +lat_0=';
        const proj_str_b = ' +lon_0=';
        const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
        let longitude = LONGLAT[0];
        let latitude = LONGLAT[1];
        if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
            const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
            const long_value: TAttribDataTypes = geolocation['longitude'];
            if (typeof long_value !== 'number') {
                throw new Error('Longitude attribute must be a number.');
            }
            longitude = long_value as number;
            if (longitude < -180 || longitude > 180) {
                throw new Error('Longitude attribute must be between -180 and 180.');
            }
            const lat_value: TAttribDataTypes = geolocation['latitude'];
            if (typeof lat_value !== 'number') {
                throw new Error('Latitude attribute must be a number');
            }
            latitude = lat_value as number;
            if (latitude < 0 || latitude > 90) {
                throw new Error('Latitude attribute must be between 0 and 90.');
            }
        }
        // try to figure out what the projection is of the source file
        // let proj_from_str = 'WGS84';
        // if (geojson_obj.hasOwnProperty('crs')) {
        //     if (geojson_obj.crs.hasOwnProperty('properties')) {
        //         if (geojson_obj.crs.properties.hasOwnProperty('name')) {
        //             const name: string = geojson_obj.crs.properties.name;
        //             const epsg_index = name.indexOf('EPSG');
        //             if (epsg_index !== -1) {
        //                 let epsg = name.slice(epsg_index);
        //                 epsg = epsg.replace(/\s/g, '+');
        //                 if (epsg === 'EPSG:4326') {
        //                     // do nothing, 'WGS84' is fine
        //                 } else if (['EPSG:4269', 'EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113'].indexOf(epsg) !== -1) {
        //                     // these are the epsg codes that proj4 knows
        //                     proj_from_str = epsg;
        //                 } else if (epsg === 'EPSG:3414') {
        //                     // singapore
        //                     proj_from_str =
        //                         '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 ' +
        //                         '+ellps=WGS84 +units=m +no_defs';
        //                 }
        //             }
        //         }
        //     }
        // }
        // console.log('CRS of geojson data', proj_from_str);

        const proj_from_str = 'WGS84';
        const proj_to_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
        const proj_obj: proj4.Converter = proj4(proj_from_str, proj_to_str);
        return proj_obj;
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
function _addPointToModel(model: GIModel, point: any,
        proj_obj: proj4.Converter, rot_matrix: Matrix4, elevation: number): number {
    if (point.geometry.coordinates.length === 0) { return null; }
    // add feature
    let xyz: Txyz = _xformFromLongLatToXYZ(point.geometry.coordinates, proj_obj, elevation) as Txyz;
    // rotate to north
    if (rot_matrix !== null) {
        xyz = multMatrix(xyz, rot_matrix);
    }
    // create the posi
    const posi_i: number = model.modeldata.geom.add.addPosi();
    model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
    // create the point
    const point_i: number = model.modeldata.geom.add.addPoint(posi_i);
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
function _addPlineToModel(model: GIModel, linestring: any,
        proj_obj: proj4.Converter, rot_matrix: Matrix4, elevation: number): number {
    // check that the polyline has 2 or more positions
    if (linestring.geometry.coordinates.length < 2) { return null; }
    // add feature
    let xyzs: Txyz[] = _xformFromLongLatToXYZ(linestring.geometry.coordinates, proj_obj, elevation) as Txyz[];
    const first_xyz: Txyz = xyzs[0];
    const last_xyz: Txyz = xyzs[xyzs.length - 1];
    const close = xyzs.length > 2 && first_xyz[0] === last_xyz[0] && first_xyz[1] === last_xyz[1];
    if (close) { xyzs = xyzs.slice(0, xyzs.length - 1); }
    // rotate to north
    if (rot_matrix !== null) {
        for (let i = 0; i < xyzs.length; i++) {
            xyzs[i] = multMatrix(xyzs[i], rot_matrix);
        }
    }
    // create the posis
    const posis_i: number[] = [];
    for (const xyz of xyzs) {
        const posi_i: number = model.modeldata.geom.add.addPosi();
        model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // create the pline
    const pline_i: number = model.modeldata.geom.add.addPline(posis_i, close);
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
function _addPgonToModel(model: GIModel, polygon: any,
        proj_obj: proj4.Converter, rot_matrix: Matrix4, elevation: number): number {
    // check that the first ring has 2 or more positions
    if (polygon.geometry.coordinates.length && polygon.geometry.coordinates[0].length < 2) { return null; }
    // add feature
    const rings: number[][] = [];
    for (const ring of polygon.geometry.coordinates) {
        const xyzs: Txyz[] = _xformFromLongLatToXYZ(ring, proj_obj, elevation) as Txyz[];
        // rotate to north
        if (rot_matrix !== null) {
            for (let i = 0; i < xyzs.length; i++) {
                xyzs[i] = multMatrix(xyzs[i], rot_matrix);
            }
        }
        // create the posis
        const posis_i: number[] = [];
        for (const xyz of xyzs) {
            const posi_i: number = model.modeldata.geom.add.addPosi();
            model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
        rings.push(posis_i);
    }
    // create the pgon
    const pgon_i: number = model.modeldata.geom.add.addPgon(rings[0], rings.slice(1));
    // check if it needs flipping
    // TODO there may be a faster way to do this
    const normal: Txyz = model.modeldata.geom.query.getPgonNormal(pgon_i);
    if (vecDot(normal, [0, 0, 1]) < 0) {
        model.modeldata.geom.edit_topo.reverse(model.modeldata.geom.nav.navPgonToWire(pgon_i)[0]);
    }
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
function _addPointCollToModel(model: GIModel, multipoint: any,
        proj_obj: proj4.Converter, rot_matrix: Matrix4, elevation: number): [number[], number] {
    const ssid: number = model.modeldata.active_ssid;
    // add features
    const points_i: number[] = [];
    for (const coordinates of multipoint.geometry.coordinates) {
        const point_i: number = _addPointToModel(model, {'geometry': {'coordinates': coordinates}}, proj_obj, rot_matrix, elevation);
        points_i.push(point_i);
    }
    // create the collection
    const coll_i: number = model.modeldata.geom.add.addColl();
    model.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
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
function _addPlineCollToModel(model: GIModel, multilinestring: any,
        proj_obj: proj4.Converter, rot_matrix: Matrix4, elevation: number): [number[], number] {
    const ssid: number = model.modeldata.active_ssid;
    // add features
    const plines_i: number[] = [];
    for (const coordinates of multilinestring.geometry.coordinates) {
        const pline_i: number = _addPlineToModel(model, {'geometry': {'coordinates': coordinates}}, proj_obj, rot_matrix, elevation);
        plines_i.push(pline_i);
    }
    // create the collection
    const coll_i: number = model.modeldata.geom.add.addColl();
    model.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
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
function _addPgonCollToModel(model: GIModel, multipolygon: any,
        proj_obj: proj4.Converter, rot_matrix: Matrix4, elevation: number): [number[], number] {
    const ssid: number = model.modeldata.active_ssid;
    // add features
    const pgons_i: number[] = [];
    for (const coordinates of multipolygon.geometry.coordinates) {
        const pgon_i: number = _addPgonToModel(model, {'geometry': {'coordinates': coordinates}}, proj_obj, rot_matrix, elevation);
        pgons_i.push(pgon_i);
    }
    // create the collection
    const coll_i: number = model.modeldata.geom.add.addColl();
    model.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    // add attribs
    _addAttribsToModel(model, EEntType.COLL, coll_i, multipolygon);
    // return the indices of the plines and the index of the collection
    return [pgons_i, coll_i];
}

/**
 * Adds attributes to the model
 * @param model The model
 */
function _addAttribsToModel(model: GIModel, ent_type: EEntType, ent_i: number, feature: any): void {
    // add attribs
    if (! feature.hasOwnProperty('properties')) { return; }
    for (const name of Object.keys(feature.properties)) {
        let value: any = feature.properties[name];
        const value_type: string = typeof feature.properties[name];
        if (value_type === 'object') {
            value = JSON.stringify(value);
        }
        model.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ent_i, name, value);
    }
}

/**
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
function _xformFromLongLatToXYZ(
        long_lat_arr: [number, number]|[number, number][], proj_obj: proj4.Converter, elevation: number): Txyz|Txyz[] {
    if (getArrDepth(long_lat_arr) === 1) {
        const long_lat: [number, number] = long_lat_arr as [number, number];
        const xy: [number, number] = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    } else {
        long_lat_arr = long_lat_arr as [number, number][];
        const xyzs_xformed: Txyz[] = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz: Txyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation) as Txyz;
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed as Txyz[];
    }
}


/**
 * Converts cartesian coords to geojson long lat
 * @param xyz
 * @param flatten
 */
function _xformFromXYZToLongLat(
    xyz: Txyz|Txyz[], proj_obj: proj4.Converter, rot_matrix: Matrix4, flatten: boolean): [number, number]|[number, number][] {
    if (getArrDepth(xyz) === 1) {
        xyz = xyz as Txyz;
        // rotate to north
        if (rot_matrix !== null) {
            xyz = multMatrix(xyz, rot_matrix);
        }
        return proj_obj.inverse([xyz[0], xyz[1]]) as [number, number];
    } else {
        xyz = xyz as Txyz[];
        const long_lat_arr: [number, number][] = [];
        for (const a_xyz of xyz) {
            const lat_long: [number, number] = _xformFromXYZToLongLat(a_xyz, proj_obj, rot_matrix, flatten) as [number, number];
            long_lat_arr.push(lat_long);
        }
        return long_lat_arr as [number, number][];
    }
}
