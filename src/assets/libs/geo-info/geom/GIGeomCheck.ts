import { IGeomMaps, TVert, TWire, TPline, TEdge, TPgon, TPoint } from '../common';
import { GIModelData } from '../GIModelData';


/**
 * Class for geometry.
 */
export class GIGeomCheck {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Checks geometry for internal consistency
     */
    public check(): string[] {
        const errors: string[] = [];
        this._checkPosis().forEach( error => errors.push(error) );
        this._checkVerts().forEach( error => errors.push(error) );
        this._checkEdges().forEach( error => errors.push(error) );
        this._checkWires().forEach( error => errors.push(error) );
        // this._checkPgons2().forEach( error => errors.push(error) ); this used to be faces
        this._checkPoints().forEach( error => errors.push(error) );
        this._checkPlines().forEach( error => errors.push(error) );
        this._checkPgons().forEach( error => errors.push(error) );
        this._checkEdgeOrder().forEach( error => errors.push(error) );
        return errors;
    }
    /**
     * Checks geometry for internal consistency
     */
    private _checkPosis(): string[] {
        const errors: string[] = [];
        this._geom_maps.up_posis_verts.forEach( (verts_i, posi_i) => {
            // up
            if (verts_i === null) { errors.push('Posi ' + posi_i + ': null.'); return; }
            // down
            for (const vert_i of verts_i) {
                const vert: TVert = this._geom_maps.dn_verts_posis.get(vert_i);
                if (vert === undefined ) { errors.push('Posi ' + posi_i + ': Vert->Posi undefined.'); }
                if (vert === null ) { errors.push('Posi ' + posi_i + ': Vert->Posi null.'); }
            }
        });
        return errors;
    }
    private _checkVerts(): string[] {
        const errors: string[] = [];
        this._geom_maps.dn_verts_posis.forEach( (vert, vert_i) => {
            // check the vert itself
            if (vert === null) { errors.push('Vert ' + vert_i + ': null.'); return; } // deleted
            // check the position
            const posi_i: number = vert;
            // check that the position points up to this vertex
            const verts_i: number[] = this._geom_maps.up_posis_verts.get(posi_i);
            if (verts_i.indexOf(vert_i) === -1) {
                errors.push('Vert ' + vert_i + ': Posi->Vert index is missing.');
            }
            // check if the parent is a popint or edge
            const point_i: number = this._geom_maps.up_verts_points.get(vert_i);
            const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
            if (point_i !== undefined && edges_i !== undefined) {
                errors.push('Vert ' + vert_i + ': Both Vert->Edge and Vert->Point.');
            }
            if (point_i !== undefined) {
                // up for points
                if (point_i === undefined) {
                    errors.push('Vert ' + vert_i + ': Vert->Point undefined.');
                    return;
                }
                if (point_i === null) {
                    errors.push('Vert ' + vert_i + ': Vert->Point null.');
                    return;
                }
                // down for points
                const point: TPoint = this._geom_maps.dn_points_verts.get(point_i);
                if (point === undefined) {
                    errors.push('Vert ' + vert_i + ': Point->Vert undefined.');
                }
                if (point === null) {
                    errors.push('Vert ' + vert_i + ': Point->Vert null.');
                }
                // check this point points to this vertex
                if (point !== vert_i) {
                    errors.push('Vert ' + vert_i + ': Point->Vert index is incorrect.');
                }
            } else if (edges_i !== undefined) {
                // up for edges
                if (edges_i === undefined) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge undefined.');
                    return;
                }
                if (edges_i === null) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge null.');
                    return;
                }
                if (edges_i.length > 2) { errors.push('Vert ' + vert_i + ': Vert->Edge has more than two edges.'); }
                for (const edge_i of edges_i) {
                    if (edge_i === undefined) {
                        errors.push('Vert ' + vert_i + ': Vert->Edge undefined.');
                    }
                    if (edge_i === null) {
                        errors.push('Vert ' + vert_i + ': Vert->Edge null.');
                    }
                    // down for edges
                    const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
                    if (edge === undefined) {
                        errors.push('Vert ' + vert_i + ': Edge->Vert undefined.');
                    } else if (edge === null) {
                        errors.push('Vert ' + vert_i + ': Edge->Vert null.');
                    } else {
                        // check the egde points down to this vertex
                        if (edge.indexOf(vert_i) === -1) {
                            errors.push('Vert ' + vert_i + ': Edge->Vert index is missing.');
                        }
                    }
                }
            } else {
                errors.push('Vert ' + vert_i + ': Both Vert->Edge and Vert->Point undefined.');
            }
        });
        return errors;
    }
    private _checkEdges(): string[] {
        const errors: string[] = [];
        this._geom_maps.dn_edges_verts.forEach( (edge, edge_i) => {
            // check the edge itself
            if (edge === null) { errors.push('Edge ' + edge_i + ': null.'); return; }
            if (edge.length > 2) { errors.push('Edge ' + edge_i + ': Edge has more than two vertices.'); }
            // down from edge to vertices
            const verts_i: number[] = edge;
            for (const vert_i of verts_i)   {
                // check the vertex
                if (vert_i === undefined) {
                    errors.push('Edge ' + edge_i + ': Edge->Vert undefined.');
                } else if (vert_i === null) {
                    errors.push('Edge ' + edge_i + ': Edge->Vert null.');
                } else {
                    // check the vert points up to this edge
                    const vert_edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
                    if (vert_edges_i.indexOf(edge_i) === -1) {
                        errors.push('Edge ' + edge_i + ': Vert->Edge index is missing.');
                    }
                }
            }
            // up from edge to wire
            const wire_i: number = this._geom_maps.up_edges_wires.get(edge_i);
            if (wire_i === undefined) { return; } // no wire, must be a point
            if (wire_i === null) { errors.push('Edge ' + edge_i + ': Edge->Wire null.'); }
            // check the wire
            const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
            if (wire === undefined) {
                errors.push('Edge ' + edge_i + ': Wire->Edge undefined.');
            } else if (wire === null) {
                errors.push('Edge ' + edge_i + ': Wire->Edge null.');
            } else {
                // check the wire points down to this edge
                if (wire.indexOf(edge_i) === -1) {
                    errors.push('Edge ' + edge_i + ': Wire->Edge index is missing.');
                }
            }
        });
        return errors;
    }
    private _checkWires(): string[] {
        const errors: string[] = [];
        this._geom_maps.dn_wires_edges.forEach( (wire, wire_i) => {
            // check the wire itself
            if (wire === null) { errors.push('Wire ' + wire_i + ': null.'); return; } // deleted
            // down from wire to edges
            const edges_i: number[] = wire;
            for (const edge_i of edges_i) {
                // check the edge
                if (edge_i === undefined) {
                    errors.push('Wire ' + wire_i + ': Wire->Edge undefined.');
                } else if (edge_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Edge null.');
                } else {
                    // check the edge points up to this wire
                    const edge_wire_i: number = this._geom_maps.up_edges_wires.get(edge_i);
                    if (edge_wire_i !== wire_i) {
                        errors.push('Wire ' + wire_i + ': Edge->Wire index is incorrect.');
                    }
                }
            }
            // up from wire to face or pline
            const pgon_i: number = this._geom_maps.up_wires_pgons.get(wire_i);
            const pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
            if (pgon_i !== undefined && pline_i !== undefined) {
                // errors.push('Wire ' + wire_i + ': Both Wire->Pgon and Wire->Pline.');
            }
            if (pgon_i !== undefined) {
                if (pgon_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Pgon null.');
                }
                // down from Pgon to wires (and tris)
                const pgon: TPgon = this._geom_maps.dn_pgons_wires.get(pgon_i);
                if (pgon === undefined) {
                    errors.push('Wire ' + wire_i + ': Pgon->Wire undefined.');
                } else if (pgon === null) {
                    errors.push('Wire ' + wire_i + ': Pgon->Wire null.');
                } else {
                    // check that this face points down to the wire
                    if (pgon.indexOf(wire_i) === -1) {
                        errors.push('Wire ' + wire_i + ': Pgon->Wire index is missing.');
                    }
                }
            } else if (pline_i !== undefined) {
                if (pline_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Pline null.');
                }
                // down from pline to wire
                const pline: TPline = this._geom_maps.dn_plines_wires.get(pline_i);
                if (pline === undefined) {
                    errors.push('Wire ' + wire_i + ': Pline->Wire undefined.');
                } else if (pline === null) {
                    errors.push('Wire ' + wire_i + ': Pline->Wire null.');
                } else {
                    // check that this pline points down to the wire
                    if (pline !== wire_i) {
                        errors.push('Wire ' + wire_i + ': Pline->Wire index is incorrect.');
                    }
                }
            } else {
                errors.push('Wire ' + wire_i + ': Both Wire->Face and Wire->Pline undefined.');
            }
        });
        return errors;
    }
    // private _checkPgons2(): string[] {
    //     const errors: string[] = [];
    //     this._geom_maps.dn_pgons_wires.forEach( (face, face_i) => {
    //         // check this face itself
    //         if (face === null) { errors.push('Face ' + face_i + ': null.'); return; } // deleted
    //         // down from face to wires
    //         const wires_i: number[] = face;
    //         for (const wire_i of wires_i) {
    //             // check the wire
    //             if (wire_i === undefined) {
    //                 errors.push('Face ' + face_i + ': Face->Wire undefined.');
    //             } else if (wire_i === null) {
    //                 errors.push('Face ' + face_i + ': Face->Wire null.');
    //             } else {
    //                 // check the wire points up to this face
    //                 const wire_face_i: number = this._geom_maps.up_wires_faces.get(wire_i);
    //                 if (wire_face_i !== face_i) {
    //                     errors.push('Face ' + face_i + ': Wire->Face index is incorrect.');
    //                 }
    //             }
    //         }
    //         // up from face to pgon
    //         const pgon_i: number = this._geom_maps.up_faces_pgons.get(face_i);
    //         if (pgon_i === undefined) {
    //             errors.push('Face ' + face_i + ': Face->Pgon undefined.');
    //         } else if (pgon_i === null) {
    //             errors.push('Face ' + face_i + ': Face->Pgon null.');
    //         }
    //         // down from pgon to face
    //         const pgon: TPgon = this._geom_maps.dn_pgons_faces.get(pgon_i);
    //         if (pgon === undefined) {
    //             errors.push('Face ' + face_i + ': Pgon->Face undefined.');
    //         } else if (pgon === null) {
    //             errors.push('Face ' + face_i + ': Pgon->Face null.');
    //         } else {
    //             // check that this pgon points down to this face
    //             if (pgon !== face_i) {
    //                 errors.push('Face ' + face_i + ': Pgon->Face index is incorrect.');
    //             }
    //         }
    //     });
    //     this._geom_maps.dn_faces_tris.forEach( (facetris, face_i) => {
    //         // check this face itself
    //         if (facetris === null) { errors.push('Face ' + face_i + ': null.'); return; } // deleted
    //         // down from face to triangles
    //         const tris_i: number[] = facetris;
    //         for (const tri_i of tris_i) {
    //             // check the wire
    //             if (tri_i === undefined) {
    //                 errors.push('Face ' + face_i + ': Face->Tri undefined.');
    //             } else if (tri_i === null) {
    //                 errors.push('Face ' + face_i + ': Face->Tri null.');
    //             } else {
    //                 // check the tri points up to this face
    //                 const tri_face_i: number = this._geom_maps.up_tris_faces.get(tri_i);
    //                 if (tri_face_i !== face_i) {
    //                     errors.push('Face ' + face_i + ': Tri->Face index is incorrect.');
    //                 }
    //             }
    //         }
    //     });
    //     return errors;
    // }
    private _checkPoints(): string[] {
        const errors: string[] = [];
        this._geom_maps.dn_points_verts.forEach( (point, point_i) => {
            // check the point itself
            if (point === null) { errors.push('Point ' + point_i + ': null.'); return; } // deleted
            // down from point to vertex
            const vert_i: number = point;
            // check that the vertex points up to this point
            const vertex_point_i: number = this._geom_maps.up_verts_points.get(vert_i);
            if (vertex_point_i !== point_i) {
                errors.push('Point ' + point_i + ': Vertex->Point index is incorrect.');
            }
            // up from point to coll
            // TODO check collections
            // const colls_i: number[] = this._geom_maps.up_points_colls.get(point_i);
            // if (colls_i === undefined) { return; } // not in coll
            // for (const coll_i of colls_i) {
            //     if (coll_i === undefined) {
            //         errors.push('Point ' + point_i + ': Point->Coll undefined.');
            //     }
            //     if (coll_i === null) {
            //         errors.push('Point ' + point_i + ': Point->Coll null.');
            //     }
            //     // down from coll to points
            //     const coll_points: number[] = this._geom_maps.dn_colls_points.get(coll_i);
            //     if (coll_points === undefined) { errors.push('Point ' + point_i + ': Coll->Objs undefined.'); }
            //     if (coll_points === null) { errors.push('Point ' + point_i + ': Coll->Objs null.'); }
            //     if (coll_points.indexOf(point_i) === -1) {
            //         errors.push('Point ' + point_i + ': Coll->Point missing.');
            //     }
            // }
        });
        return errors;
    }
    private _checkPlines(): string[] {
        const errors: string[] = [];
        this._geom_maps.dn_plines_wires.forEach( (pline, pline_i) => {
            // check the pline itself
            if (pline === null) { errors.push('Pline ' + pline_i + ': null.'); return; } // deleted
            // down from pline to wire
            const wire_i: number = pline;
            // check that the wire points up to this pline
            const wire_pline_i: number = this._geom_maps.up_wires_plines.get(wire_i);
            if (wire_pline_i !== pline_i) {
                errors.push('Pline ' + pline_i + ': Wire->Pline index is incorrect.');
            }
            // up from pline to coll
            // TODO check collections
            // const colls_i: number[] = this._geom_maps.up_plines_colls.get(pline_i);
            // if (colls_i === undefined) { return; } // not in coll
            // for (const coll_i of colls_i) {
            //     if (coll_i === undefined) {
            //         errors.push('Pline ' + pline_i + ': Pline->Coll undefined.');
            //     }
            //     if (coll_i === null) {
            //         errors.push('Pline ' + pline_i + ': Pline->Coll null.');
            //     }
            //     // down from coll to plines
            //     const coll_plines: number[] = this._geom_maps.dn_colls_plines.get(coll_i);
            //     if (coll_plines === undefined) { errors.push('Pline ' + pline_i + ': Coll->Objs undefined.'); }
            //     if (coll_plines === null) { errors.push('Pline ' + pline_i + ': Coll->Objs null.'); }
            //     if (coll_plines.indexOf(pline_i) === -1) {
            //         errors.push('Pline ' + pline_i + ': Coll->Pline missing.');
            //     }
            // }
        });
        return errors;
    }
    private _checkPgons(): string[] {
        // TODO update this, see _checkPgons2()
        const errors: string[] = [];
        this._geom_maps.dn_pgons_wires.forEach( (pgon, pgon_i) => {
            // check the pgon itself
            if (pgon === undefined) { return; }
            if (pgon === null) { errors.push('Pgon ' + pgon_i + ': null.'); return; } // deleted
            // down from pgon to face
            // const face_i: number = pgon;
            // // check that the face points up to this pgon
            // const face_pgon_i: number = this._geom_maps.up_faces_pgons.get(face_i);
            // if (face_pgon_i !== pgon_i) {
            //     errors.push('Pgon ' + pgon_i + ': Face->Pgon index is incorrect.');
            // }
            // up from pgon to coll
            // TODO check collections
            // const colls_i: number[] = this._geom_maps.up_pgons_colls.get(pgon_i);
            // if (colls_i === undefined) { return; } // not in coll
            // for (const coll_i of colls_i) {
            //     if (coll_i === undefined) {
            //         errors.push('Pgon ' + pgon_i + ': Pgon->Coll undefined.');
            //     }
            //     if (coll_i === null) {
            //         errors.push('Pgon ' + pgon_i + ': Pgon->Coll null.');
            //     }
            //     // down from coll to pgons
            //     const coll_pgons: number[] = this._geom_maps.dn_colls_pgons.get(coll_i);
            //     if (coll_pgons === undefined) { errors.push('Pgon ' + pgon_i + ': Coll->Objs undefined.'); }
            //     if (coll_pgons === null) { errors.push('Pgon ' + pgon_i + ': Coll->Objs null.'); }
            //     if (coll_pgons.indexOf(pgon_i) === -1) {
            //         errors.push('Pgon ' + pgon_i + ': Coll->Pgon missing.');
            //     }
            // }
        });
        return errors;
    }
    private _checkEdgeOrder(): string[] {
        const errors: string[] = [];
        this._geom_maps.dn_wires_edges.forEach( (wire, wire_i) => {
            // down
            if (wire === null) { errors.push('Wire ' + wire_i + ': null.'); return; }
            // check if this is closed or open
            const first_edge: TEdge = this._geom_maps.dn_edges_verts.get(wire[0]);
            const first_vert_i: number = first_edge[0];
            const last_edge: TEdge = this._geom_maps.dn_edges_verts.get(wire[wire.length - 1]);
            const last_vert_i: number = last_edge[1];
            const is_closed: boolean = (first_vert_i === last_vert_i);
            if (!is_closed) {
                if (this._geom_maps.up_verts_edges.get(first_edge[0]).length !== 1) {
                    errors.push('Open wire ' + wire_i + ': First vertex does not have one edge.');
                }
                if (this._geom_maps.up_verts_edges.get(last_edge[1]).length !== 1) {
                    errors.push('Open wire ' + wire_i + ': Last vertex does not have one edge.');
                }
            }
            // console.log("==== ==== ====")
            // console.log("WIRE i", wire_i, "WIRE", wire)
            // check the edges of each vertex
            for (const edge_i of wire) {
                const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
                const start_vert_i = edge[0];
                const end_vert_i = edge[1];
                // console.log("====")
                // console.log("EDGE i", edge_i, "EDGE", edge)
                // console.log("VERT START", start_vert_i)
                // console.log("VERT END", end_vert_i)
                let exp_num_edges_vert0 = 2;
                let exp_num_edges_vert1 = 2;
                let start_idx = 1;
                let end_idx = 0;
                if (!is_closed) {
                    if (edge_i === wire[0]) { // first edge
                        exp_num_edges_vert0 = 1;
                        start_idx = 0;
                    }
                    if (edge_i === wire[wire.length - 1]) { // last edge
                        exp_num_edges_vert1 = 1;
                        end_idx = 0;
                    }
                }
                // check the start vertex
                const start_vert_edges_i: number[] = this._geom_maps.up_verts_edges.get(start_vert_i);
                // console.log("START VERT EDGES", start_vert_edges_i)
                if (start_vert_edges_i.length !== exp_num_edges_vert0 ) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + start_vert_i +
                        ': Start vertex does not have correct number of edges.');
                }
                if (start_vert_edges_i[start_idx] !== edge_i) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + start_vert_i +
                        ': Vertex edges are in the wrong order.');
                }
                // check the end vertex
                const end_vert_edges_i: number[] = this._geom_maps.up_verts_edges.get(end_vert_i);
                // console.log("END VERT EDGES", end_vert_edges_i)
                if (end_vert_edges_i.length !== exp_num_edges_vert1 ) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + start_vert_i +
                        ': End vertex does not have correct number of edges.');
                }
                if (end_vert_edges_i[end_idx] !== edge_i) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + end_vert_i +
                        ': Vertex edges are in the wrong order.');
                }
            }
        });
        return errors;
    }
}
