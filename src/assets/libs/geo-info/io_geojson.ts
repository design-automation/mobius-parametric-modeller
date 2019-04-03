import { GIModel } from './GIModel';
import { TNormal, TTexture, EAttribNames, Txyz, EEntType, EAttribDataTypeStrs } from './common';
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
    const points: any[] = [];
    const linestrings: any[] = [];
    const polygons: any[] = [];
    const polygons_holes: any[] = [];
    const multipoints: any[] = [];
    const multilinestrings: any[] = [];
    const multipolygons: any[] = [];
    const multipolygons_holes: any[] = [];
    const others: any[] = [];
    // map for attributes
    const point_attrib_types: Map<string, EAttribDataTypeStrs> = new Map();
    const pline_attrib_types: Map<string, EAttribDataTypeStrs> = new Map();
    const pgon_attrib_types: Map<string, EAttribDataTypeStrs> = new Map();
    // loop through all features
    for (const feature of obj_data.features) {
        // get the features
        switch (feature.geometry.type) {
            case EGeojsoFeatureType.POINT:
                points.push(feature);
                _addAttribsToMap(feature, point_attrib_types);
                break;
            case EGeojsoFeatureType.LINESTRING:
                linestrings.push(feature);
                _addAttribsToMap(feature, pline_attrib_types);
                break;
            case EGeojsoFeatureType.POLYGON:
                polygons.push(feature);
                if (feature.geometry.coordinates > 1) {
                    polygons_holes.push(feature);
                }
                _addAttribsToMap(feature, pgon_attrib_types);
                break;
            case EGeojsoFeatureType.MULTIPOINT:
                multipoints.push(feature);
                _addAttribsToMap(feature, point_attrib_types);
                break;
            case EGeojsoFeatureType.MULTILINESTRING:
                multilinestrings.push(feature);
                _addAttribsToMap(feature, pline_attrib_types);
                break;
            case EGeojsoFeatureType.MULTIPOLYGON:
                multipolygons.push(feature);
                let has_holes = false;
                for (const face of feature.geometry.coordinates) {
                    if (face.length > 1) {has_holes = true; break; }
                }
                if (has_holes) {
                    multipolygons_holes.push(feature);
                }
                _addAttribsToMap(feature, pgon_attrib_types);
                break;
            default:
                others.push(feature);
                break;
        }
    }
    // log message
    console.log(
        'Point: '           + points.length + '\n' +
        'LineString: '      + linestrings.length + '\n' +
        'Polygon: '         + polygons.length + '\n' +
        '    Polygon + hole: ' + polygons_holes.length + '\n' +
        'MultiPoint: '      + multipoints.length + '\n' +
        'MultiLineString: ' + multilinestrings.length + '\n' +
        'MultiPolygon: '    + multipolygons.length + '\n' +
        '    MultiPolygon + hole: ' + multipolygons_holes.length + '\n' +
        'Other: '           + others + '\n\n');
    // make geometry in model
    const point_attribs: Map<string, GIAttribMap> = _addAttribsToModel(model, point_attrib_types, EEntType.POINT);
    const pline_attribs: Map<string, GIAttribMap> = _addAttribsToModel(model, pline_attrib_types, EEntType.PLINE);
    const pgon_attribs: Map<string, GIAttribMap> = _addAttribsToModel(model, pgon_attrib_types, EEntType.PGON);
    // add_linestrings(linestrings, attribs, model, elevation);
    _addPolygonsToModel(model, polygons, pgon_attribs, elevation);
    // add_multilinestrings(linestrings, attribs, model, elevation);
    // add_multipolygons(multipolygons, attribs, model, elevation);
    // log model results
    // console.log(model.toString());
}
/**
 * 
 * @param feature
 * @param attrib_map
 */
function _addAttribsToMap(feature: any, attrib_map: Map<string, EAttribDataTypeStrs>): void {
    // get the attributes
    const props: any = feature.properties;
    for (const key of Object.keys(props)) {
        let attrib_name: string = key;
        const attrib_type: EAttribDataTypeStrs =
            (typeof props[attrib_name] === 'number') ? EAttribDataTypeStrs.FLOAT : EAttribDataTypeStrs.STRING;
        //
        // TODO other data types, especially arrays
        //
        // check for attribs with same name but different data types
        if (attrib_map.has(attrib_name)) {
            if (attrib_map.get(attrib_name) !==  attrib_type) {
                let count = 0;
                while (attrib_map.has(attrib_name)) {
                    attrib_name = key + '_' + count;
                    count ++;
                }
            }
        }
        // add the attribute to the map
        if (!attrib_map.has(attrib_name)) {
            attrib_map.set(attrib_name, attrib_type);
        }
    }
}

/**
 * Adds attributs to the model.
 * @param attrib_data Attrinute data (name, and data type)
 * @param model The model
 * @returns A Map containing the attrib name and the attrib object.
 */
function _addAttribsToModel(model: GIModel, attrib_data: Map<string, EAttribDataTypeStrs>, ent_type: EEntType): Map<string, GIAttribMap> {
    // create the attributes in the model
    const attribs_map: Map<string, GIAttribMap> = new Map();
    attrib_data.forEach((data_type: EAttribDataTypeStrs, attrib_name: string) => {
        const attrib: GIAttribMap = model.attribs.add.addAttrib(ent_type, attrib_name, data_type, 1); // TODO arrays
        attribs_map.set(attrib_name, attrib);
    });
    return attribs_map;
}

// /*
//     "geometry": {
//         "type": "LineString",
//         "coordinates": [
//             [30, 10], [10, 30], [40, 40]
//         ]
//     }
// */
// /**
//  * Adds linestrings to the model
//  * @param linestrings The features to add.
//  * @param model The model
//  */
// function add_linestrings(linestrings: any[], attribs: Map<string, gs.IEntAttrib>,
//         model: gs.IModel, elevation: number): void {
//     const geom: gs.IGeom = model.getGeom();
//     // create polygons
//     for (const linestring of linestrings) {
//         // add geometry,  single polyline per feature
//         const points: gs.IPoint[] =
//             geom.addPoints(linestring.geometry.coordinates.map((xy) => [xy[0], xy[1], elevation]));
//         const polyline: gs.IPolymesh = geom.addPolyline(points, false);
//         // add attribs
//         const props = linestring.properties;
//         for (const name of Object.keys(props)) {
//             polyline.setAttribValue(attribs.get(name), props[name]);
//         }
//     }
// }

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
 * Adds polygons to the model
 * @param polygons The features to add.
 * @param model The model
 */
function _addPolygonsToModel(model: GIModel, polygons: any[], attribs: Map<string, GIAttribMap>, elevation: number): void {
    // create polygons
    for (const polygon of polygons) {
        console.log("ADDING POLYGON")
        // add geometry, single polygon per feature
        const xyzs: Txyz[] = polygon.geometry.coordinates[0].map((xy: number[]) => [xy[0], xy[1], elevation]);
        const posis_i: number[] = [];
        for (const xyz of xyzs) {
            const posi_i: number = model.geom.add.addPosi();
            model.attribs.add.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
        const pgon_i: number = model.geom.add.addPgon(posis_i);
        // add attribs
        // const props = polygon.properties;
        // for (const name of Object.keys(props)) {
        //     polymesh.setAttribValue(attribs.get(name), props[name]);
        // }
    }
}

// /*
//     "geometry": {
//         "type": "MultiLineString",
//         "coordinates": [
//             [[10, 10], [20, 20], [10, 40]],
//             [[40, 40], [30, 30], [40, 20], [30, 10]]
//         ]
//     }
// */
// /**
//  * Adds multilinestrings to the model
//  * @param multilinestrings The features to add.
//  * @param model The model
//  */
// function add_multilinestrings(multilinestrings: any[], attribs: Map<string, gs.IEntAttrib>,
//         model: gs.IModel, elevation: number): void {
//     const geom: gs.IGeom = model.getGeom();
//     // create polygons
//     for (const multilinestring of multilinestrings) {
//         // add geometry, multiple polyline per feature
//         for (const coordinates of multilinestring.geometry.coordinates) {
//             const points: gs.IPoint[] =
//                 geom.addPoints(coordinates.map((xy) => [xy[0], xy[1], elevation]));
//             const polyline: gs.IPolymesh = geom.addPolyline(points, false);
//             // add attribs
//             const props = multilinestring.properties;
//             for (const name of Object.keys(props)) {
//                 polyline.setAttribValue(attribs.get(name), props[name]);
//             }
//         }
//     }
// }

// /*
//     "geometry": {
//         "type": "MultiPolygon",
//         "coordinates": [
//             [
//                 [[40, 40], [20, 45], [45, 30], [40, 40]]
//             ],
//             [
//                 [[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]],
//                 [[30, 20], [20, 15], [20, 25], [30, 20]]
//             ]
//         ]
//     }
// */
// /**
//  * Adds multipolygons to the model
//  * @param multipolygons The features to add.
//  * @param model The model
//  */
// function add_multipolygons(multipolygons: any[], attribs: Map<string, gs.IEntAttrib>,
//         model: gs.IModel, elevation: number): void {
//     const geom: gs.IGeom = model.getGeom();
//     // create multi polygons
//     for (const multipolygon of multipolygons) {
//         // add geometry, a single mesh per feature
//         const points: gs.IPoint[][] = [];
//         for (const coordinates of multipolygon.geometry.coordinates) {
//             points.push(geom.addPoints(coordinates[0].map((xy) => [xy[0], xy[1], elevation])));
//         }
//         const polymesh: gs.IPolymesh = geom.addPolymesh(points);
//         // add attribs
//         const props = multipolygon.properties;
//         for (const name of Object.keys(props)) {
//             polymesh.setAttribValue(attribs.get(name), props[name]);
//         }
//     }
// }
