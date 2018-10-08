/**
 * Import geojson files.
 */

import { writeGsToJSONFile } from "../../libs/filesys/filesys";
import * as gs from "gs-json";
import * as filesys from "../../libs/filesys/filesys";

const path: string = "../gs-modelling/src/assets/geojson/";

/**
 * Converts multiple geojson files to one gs model.
 * @param filenames The paths to the file that contains the geojson data.
 * @returns Model
 */
export function geojsons(filenames: string[]): gs.IModel {
    let elevation: number = 0;
    const model: gs.IModel = new gs.Model();
    for (const filename of filenames) {
        const str_data: string = filesys.readToJSONFile(filename);
        const obj_data = JSON.parse(str_data);
        process(model, obj_data, elevation * 20);
        elevation++;
    }
    return model;
}

/**
 * Converts geojson to a gs model.
 * @param filename The path to the file that cntains the geojson data.
 * @returns Model
 */
export function geojson(filename: string): gs.IModel {
    const str_data: string = filesys.readToJSONFile(filename);
    const obj_data = JSON.parse(str_data);
    const model: gs.IModel = new gs.Model();
    process(model, obj_data, 0);
    return model;
}

/**
 * Converts geojson to a gs model.
 * @param obj_data The geojson data..
 * @returns Model
 */
export function process(model: gs.IModel, obj_data: any, elevation: number): void {
    console.log("Number of features = ", obj_data.features.length);
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
    const attrib_data: Map<string, gs.EDataType> = new Map();
    // loop through all features
    for (const feature of obj_data.features) {
        // get the attributes
        const propos: any = feature.properties;
        for (const key of Object.keys(propos)) {
            if (!attrib_data.has(key)) {
                if (isNaN(propos[key])) {
                    attrib_data.set(key, gs.EDataType.type_str);
                } else {
                    attrib_data.set(key, gs.EDataType.type_num);
                }
            }
        }
        // get the features
        switch (feature.geometry.type) {
            case "Point":
                points.push(feature);
                break;
            case "LineString":
                linestrings.push(feature);
                break;
            case "Polygon":
                polygons.push(feature);
                if (feature.geometry.coordinates > 1) {
                    polygons_holes.push(feature);
                }
                break;
            case "MultiPoint":
                multipoints.push(feature);
                break;
            case "MultiLineString":
                multilinestrings.push(feature);
                break;
            case "MultiPolygon":
                multipolygons.push(feature);
                let has_holes: boolean = false;
                for (const face of feature.geometry.coordinates) {
                    if (face.length > 1) {has_holes = true; break;}
                }
                if (has_holes) {
                    multipolygons_holes.push(feature);
                }
                break;
            default:
                others.push(feature);
                break;
        }
    }
    // log message
    console.log(
        "Point: "           + points.length + "\n" +
        "LineString: "      + linestrings.length + "\n" +
        "Polygon: "         + polygons.length + "\n" +
        "    Polygon + hole: " + polygons_holes.length + "\n" +
        "MultiPoint: "      + multipoints.length + "\n" +
        "MultiLineString: " + multilinestrings.length + "\n" +
        "MultiPolygon: "    + multipolygons.length + "\n" +
        "    MultiPolygon + hole: " + multipolygons_holes.length + "\n" +
        "Other: "           + others + "\n\n");
    // make geometry in model
    const attribs: Map<string, gs.IEntAttrib> = add_attribs(attrib_data, model);
    add_linestrings(linestrings, attribs, model, elevation);
    add_polygons(polygons, attribs, model, elevation);
    add_multilinestrings(linestrings, attribs, model, elevation);
    add_multipolygons(multipolygons, attribs, model, elevation);
    // log model results
    console.log(model.toString());
}

/**
 * Adds attributs to the geojson model.
 * @param attrib_data Attrinute data (name, and data type)
 * @param model The model
 * @returns A Map containing the attrib name and the attrib object.
 */
function add_attribs(attrib_data: Map<string, gs.EDataType>, model: gs.IModel): Map<string, gs.IEntAttrib> {
    // create polygons
    // create the attributes
    const attribs: Map<string, gs.IEntAttrib> = new Map();
    for (const [name, data_type] of attrib_data.entries()) {
        attribs.set(name, model.addEntAttrib(name, gs.EGeomType.objs, data_type));
    }
    return attribs;
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
 * Adds linestrings to the model
 * @param linestrings The features to add.
 * @param model The model
 */
function add_linestrings(linestrings: any[], attribs: Map<string, gs.IEntAttrib>,
        model: gs.IModel, elevation: number): void {
    const geom: gs.IGeom = model.getGeom();
    // create polygons
    for (const linestring of linestrings) {
        // add geometry,  single polyline per feature
        const points: gs.IPoint[] =
            geom.addPoints(linestring.geometry.coordinates.map((xy) => [xy[0], xy[1], elevation]));
        const polyline: gs.IPolymesh = geom.addPolyline(points, false);
        // add attribs
        const props = linestring.properties;
        for (const name of Object.keys(props)) {
            polyline.setAttribValue(attribs.get(name), props[name]);
        }
    }
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
 * Adds polygons to the model
 * @param polygons The features to add.
 * @param model The model
 */
function add_polygons(polygons: any[], attribs: Map<string, gs.IEntAttrib>,
        model: gs.IModel, elevation: number): void {
    const geom: gs.IGeom = model.getGeom();
    // create polygons
    for (const polygon of polygons) {
        // add geometry, single polygon per feature
        const points: gs.IPoint[] =
            geom.addPoints(polygon.geometry.coordinates[0].map((xy) => [xy[0], xy[1], elevation]));
        const polymesh: gs.IPolymesh = geom.addPolymesh([points]);
        // add attribs
        const props = polygon.properties;
        for (const name of Object.keys(props)) {
            polymesh.setAttribValue(attribs.get(name), props[name]);
        }
    }
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
function add_multilinestrings(multilinestrings: any[], attribs: Map<string, gs.IEntAttrib>,
        model: gs.IModel, elevation: number): void {
    const geom: gs.IGeom = model.getGeom();
    // create polygons
    for (const multilinestring of multilinestrings) {
        // add geometry, multiple polyline per feature
        for (const coordinates of multilinestring.geometry.coordinates) {
            const points: gs.IPoint[] =
                geom.addPoints(coordinates.map((xy) => [xy[0], xy[1], elevation]));
            const polyline: gs.IPolymesh = geom.addPolyline(points, false);
            // add attribs
            const props = multilinestring.properties;
            for (const name of Object.keys(props)) {
                polyline.setAttribValue(attribs.get(name), props[name]);
            }
        }
    }
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
 * @param multipolygons The features to add.
 * @param model The model
 */
function add_multipolygons(multipolygons: any[], attribs: Map<string, gs.IEntAttrib>,
        model: gs.IModel, elevation: number): void {
    const geom: gs.IGeom = model.getGeom();
    // create multi polygons
    for (const multipolygon of multipolygons) {
        // add geometry, a single mesh per feature
        const points: gs.IPoint[][] = [];
        for (const coordinates of multipolygon.geometry.coordinates) {
            points.push(geom.addPoints(coordinates[0].map((xy) => [xy[0], xy[1], elevation])));
        }
        const polymesh: gs.IPolymesh = geom.addPolymesh(points);
        // add attribs
        const props = multipolygon.properties;
        for (const name of Object.keys(props)) {
            polymesh.setAttribValue(attribs.get(name), props[name]);
        }
    }
}

//  ===============================================================================================================

/**
 * Execute using NPM, models get saved in the /src/assets/ folder.
 * "npm run geojson"
 */
if (require.main === module) {
    console.log("Convert files: geojson...");
    // writeGsToJSONFile(geojson(path + "example.geojson"), path + "example.gs");
    // writeGsToJSONFile(geojson(path + "example2.geojson"), path + "example2.gs");
    // writeGsToJSONFile(geojson(path + "model2_plots.geojson"), path + "model2_plots.gs");
    // writeGsToJSONFile(geojson(path + "model2_flat.geojson"), path + "model2_flat.gs");
    // writeGsToJSONFile(geojson(path + "All Plots_3414.geojson"), path + "All Plots_3414.gs");
    // console.log("Masterplan");
    // writeGsToJSONFile(geojson(path + "Masterplan.geojson"), path + "Masterplan.gs");
    // console.log("FINAL_RESULT");
    // writeGsToJSONFile(geojson(path + "FINAL_RESULT.geojson"), path + "FINAL_RESULT.gs");

    console.log("UC1_RESULT");
    writeGsToJSONFile(geojson(path + "UC1_RESULT.geojson"), path + "UC1_RESULT.gs");

    console.log("Masterplan_FINAL");
    writeGsToJSONFile(geojson(path + "Masterplan_FINAL.geojson"), path + "Masterplan_FINAL.gs");

    const filenames: string[] = [path + "Masterplan_FINAL.geojson", path + "UC1_RESULT.geojson"];
    writeGsToJSONFile(geojsons(filenames), path + "combined.gs");

}
