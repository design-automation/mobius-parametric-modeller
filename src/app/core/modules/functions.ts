/**
 * Functions for working with gs-json models.
 * Models are datastructures that contain geometric entities with attributes.
 */

//  ===============================================================================================================
//  Enums, Types, and Interfaces
//  ===============================================================================================================

//enums

enum data_types {
    Int = "Int",
    Float = "Float",
    String = "String"
}

// types

type triangle = [number, number, number]; //[position, position, position]
type vertex = number; // positions
type edge = [number, number]; // [vertex, vertex]
type wire = number[]; //[edge, edge,....]
type face = [number[], number[]]; // [[wire, ....], [triangle, ...]]
type collection = [number, number[], number[], number[]]; // [parent, [vertex, ...], [wire, ...], [face, ....]]

// interfaces

interface attrib {
    name: string;
    data_type: data_types;
    data_length: number;
    keys: number[];
    values: any[];
}

interface positions_attrib extends attrib {
    name: "coordinates";
    data_type: data_types.Float;
    data_length: 3;
}

interface model {
    topology: {
        triangles: triangle[];
        vertices: vertex[];
        edges: edge[];
        wires: wire[];
        faces: face[];
        collections: collection[];
    };
    attributes: {
        positions: positions_attrib;
        vertices: attrib[];
        edges: attrib[];
        wires: attrib[];
        faces: attrib[];
        collections: attrib[];
    }
}

//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================

/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function __new__(): model {
    return {
        topology:{
            triangles: [],
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        },
        attributes:{
            positions: {
                name: "coordinates",
                data_type: data_types.Float,
                data_length: 3,
                keys: [],
                values: []
            },
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        }
    }
}

/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
export function __preprocess__(model: model): void {
    // TODO
}

/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
export function __postprocess__(model: model): void {
    // TODO
    // Remove all the undefined values for the arrays
}

/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
export function __merge__(model1: model, model2: model): void {

    // Get the lengths of data arrays in model1, required later
    let num_positions: number = model2.attributes.positions.keys.length;
    let num_triangles: number = model2.topology.triangles.length;
    let num_vertices: number = model2.topology.vertices.length;
    let num_edges: number = model2.topology.edges.length;
    let num_wires: number = model2.topology.wires.length;
    let num_faces: number = model2.topology.faces.length;
    let num_collections: number = model2.topology.collections.length;

    // Add triangles from model2 to model1
    const new_triangles: triangle[] = model2.topology.triangles.map(t => t.map( p => p + num_positions) as triangle);
    model2.topology.triangles.concat( new_triangles );

    // Add vertices from model2 to model1
    const new_vertices: vertex[] = model2.topology.vertices.map(p => p + num_positions as vertex);
    model2.topology.vertices.concat( new_vertices );

    // Add edges from model2 to model1
    const new_edges: edge[] = model2.topology.edges.map(e => e.map( v => v + num_vertices) as edge);
    model2.topology.edges.concat( new_edges );

    // Add wires from model2 to model1
    const new_wires: wire[] = model2.topology.wires.map(w => w.map( e => e + num_edges) as wire);
    model2.topology.wires.concat( new_wires );

    // Add faces from model2 to model1
    const new_faces: face[] = model2.topology.faces.map(f => [
        f[0].map( w => w + num_wires),
        f[1].map( t => t + num_triangles)
    ] as face);
    model2.topology.faces.concat( new_faces );

    // Add collections from model2 to model1
    const new_collections: collection[] = model2.topology.collections.map(c => [
        c[0] + num_collections,
        c[1].map( v => v + num_vertices),
        c[2].map( w => w + num_wires),
        c[3].map( f => f + num_faces)
    ] as collection);
    model2.topology.collections.concat( new_collections );

    // Add  attributes from model2 to model1
    _addKeysValues(model1.attributes.positions, model2.attributes.positions);
    _addAttribs(model1.attributes.vertices, model2.attributes.vertices, num_vertices);
    _addAttribs(model1.attributes.edges, model2.attributes.edges, num_edges);
    _addAttribs(model1.attributes.wires, model2.attributes.wires, num_wires);
    _addAttribs(model1.attributes.faces, model2.attributes.faces, num_faces);
    _addAttribs(model1.attributes.collections, model2.attributes.collections, num_collections);

    // No return
}

/*
 * Helper function that adds attributes
 */
function _addAttribs(attribs1: attrib[], attribs2:attrib[], size1: number): void {
    const attribs_map: Map<string, number> = new Map();
    attribs1.forEach((attrib, idx) => {
        attribs_map[attrib.name + attrib.data_type + attrib.data_length] = attrib;
    });
    attribs2.forEach(attrib2 => {
        const attrib1 = attribs_map[attrib2.name + attrib2.data_type + attrib2.data_length];
        if (attrib1 === undefined) {
            attrib2.values = Array(size1).fill(undefined).concat(attrib2.values);
            attribs1.push( attrib2 );
        } else{
            _addKeysValues(attrib1, attrib2);
        }
    });
}

/*
 * Helper function that adds values, updates keys.
 * The values are all assumed to be unique.
 * Values are added from the values to array to the values1 array is the are unique.
 * New keys are added to the keys1 array.
 */
function _addKeysValues(kv1: {keys:number[], values:any[]}, kv2:{keys:number[], values:any[]}): void {
    const values_map: Map<number, number> = new Map();
    kv2.values.forEach( (val, idx) => {
        let idx_new: number = kv1.values.indexOf(val);
        if (idx_new === -1){
            idx_new = kv1.values.push(val) - 1;
        }
        values_map[idx] = idx_new;
    });
    kv2.keys.forEach( idx => {
        kv1.keys.push(values_map[idx]);
    });
}

//  ===============================================================================================================
//  End user functions
//  ===============================================================================================================

/**
 * Creates a new model and populates the model with data.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function addData(__model__: any, model: any): any {
    __model__ = __merge__(__model__, model);
}
