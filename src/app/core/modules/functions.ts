import * as gi from '../../../libs/geo-info/geo-info';
import * as bm from '../../../libs/geo-info/bi-map';

//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================

/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
export function __new__(): gi.IModel {
    return {
        topology: {
            triangles: [],
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        },
        attributes: {
            positions: [{
                name: 'coordinates',
                data_type: gi.EAttribDataTypeStrs.Float,
                data_length: 3,
                data: []
            }],
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        }
    };
}

/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
export function __preprocess__(__model__: gi.IModel): void {
    // TODO
}

/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
export function __postprocess__(__model__: gi.IModel): void {
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
export function __merge__(model1: gi.IModel, model2: gi.IModel): void {

    // Get the lengths of data arrays in model1, required later
    const poistions_data: bm.BiMapManyToOne<gi.TAttribDataTypes> = new bm.BiMapManyToOne(model1.attributes.positions[0].data);
    const num_positions: number = poistions_data.numKeys();
    const num_triangles: number = model1.topology.triangles.length;
    const num_vertices: number = model1.topology.vertices.length;
    const num_edges: number = model1.topology.edges.length;
    const num_wires: number = model1.topology.wires.length;
    const num_faces: number = model1.topology.faces.length;
    const num_collections: number = model1.topology.collections.length;

    // Add triangles from model2 to model1
    const new_triangles: gi.TTriangle[] = model2.topology.triangles.map(t => t.map( p => p + num_positions) as gi.TTriangle);
    model1.topology.triangles = model1.topology.triangles.concat( new_triangles );

    // Add vertices from model2 to model1
    const new_vertices: gi.TVertex[] = model2.topology.vertices.map(p => p + num_positions as gi.TVertex);
    model1.topology.vertices = model1.topology.vertices.concat( new_vertices );

    // Add edges from model2 to model1
    const new_edges: gi.TEdge[] = model2.topology.edges.map(e => e.map( v => v + num_vertices) as gi.TEdge);
    model1.topology.edges = model1.topology.edges.concat( new_edges );

    // Add wires from model2 to model1
    const new_wires: gi.TWire[] = model2.topology.wires.map(w => w.map( e => e + num_edges) as gi.TWire);
    model1.topology.wires = model1.topology.wires.concat( new_wires );

    // Add faces from model2 to model1
    const new_faces: gi.TFace[] = model2.topology.faces.map(f => [
        f[0].map( w => w + num_wires),
        f[1].map( t => t + num_triangles)
    ] as gi.TFace);
    model1.topology.faces = model1.topology.faces.concat( new_faces );
    // Add collections from model2 to model1
    const new_collections: gi.TCollection[] = model2.topology.collections.map(c => [
        c[0] === -1 ? -1 : c[0] + num_collections,
        c[1].map( v => v + num_vertices),
        c[2].map( w => w + num_wires),
        c[3].map( f => f + num_faces)
    ] as gi.TCollection);
    model1.topology.collections = model1.topology.collections.concat( new_collections );

    // Add  attributes from model2 to model1
    _addAttribs(model1.attributes.positions, model2.attributes.positions, num_positions);
    _addAttribs(model1.attributes.vertices, model2.attributes.vertices, num_vertices);
    _addAttribs(model1.attributes.edges, model2.attributes.edges, num_edges);
    _addAttribs(model1.attributes.wires, model2.attributes.wires, num_wires);
    _addAttribs(model1.attributes.faces, model2.attributes.faces, num_faces);
    _addAttribs(model1.attributes.collections, model2.attributes.collections, num_collections);

    // No return
}

/*
 * Helper function that adds attributes from model2 to model1.
 * TODO: move this function into a seperate module
 */
function _addAttribs(attribs1: gi.IAttrib[], attribs2: gi.IAttrib[], offset: number): void {
    // create a map of all teh existing attributes
    const attribs_map: Map<string, number> = new Map();
    attribs1.forEach((attrib, idx) => {
        attribs_map[attrib.name + attrib.data_type + attrib.data_length] = attrib;
    });
    // for each new attribute
    attribs2.forEach(attrib2 => {
        attrib2.data.map( item => [item[0].map(i => i + offset), item[1]]);
        const attrib1 = attribs_map[attrib2.name + attrib2.data_type + attrib2.data_length];
        if (attrib1 === undefined) {
            attribs1.push( attrib2 );
        } else {
            const attrib1_data: bm.BiMapManyToOne<gi.TAttribDataTypes> = new bm.BiMapManyToOne(attrib1.data);
            attrib1_data.addData(attrib2.data);
            attrib1.data = attrib1_data.getData();
        }
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
