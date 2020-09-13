import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IModelJSONData, IEntSets } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModelThreejs } from './GIModelThreejs';
import { GIModel } from './GIModel';

/**
 * Geo-info model class.
 */
export class GIModelData {
    public model: GIModel;
    public geom: GIGeom;
    public attribs: GIAttribs;
    public comparator: GIModelComparator;
    public threejs: GIModelThreejs;
    public debug = true;
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(model: GIModel) {
        this.model = model;
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        this.comparator = new GIModelComparator(this);
        this.threejs = new GIModelThreejs(this);
        // if (model_data) {
        //     this.setData(model_data);
        // }
    }
    /**
     * Sets the data in this model from JSON data.
     * Any existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public setJSONData (model_data: IModelJSONData): void {
        // console.log("SET DATA");
        this.attribs.io.setJSONData(model_data.attributes);
        this.geom.io.setJSONData(model_data.geometry);
    }
    /**
     * Returns the JSON data for this model.
     * This will include any deleted entities, which will be undefined.
     */
    public getJSONData(): IModelJSONData {
        // console.log("GET DATA");
        return {
            geometry: this.geom.io.getJSONData(),
            attributes: this.attribs.io.getJSONData()
        };
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are also merged.
     * @param model_data The GI model.
     */
    public merge(modeldata: GIModelData): void {
        // const geom_maps: Map<number, number>[] = this.geom.io.merge(model.modeldata.geom._geom_maps);
        // this.attribs.io.merge(model.modeldata.attribs._attribs_maps, geom_maps);
        this.geom.merge.merge(modeldata.geom);
        this.attribs.io.merge(modeldata.attribs._attribs_maps);
        this.model.metadata = modeldata.model.metadata;
    }
    /**
     * Copys the data from a second model into this model without conflict detection.
     * Usually, this model is assumed to be empty.
     * If ent_sets is null, then only model attribs are copied.
     * @param model_data The GI model.
     */
    public dumpEnts(modeldata: GIModelData, ent_sets: IEntSets): void {
        if (ent_sets === null) {
            this.attribs.io.dumpEnts(modeldata.attribs._attribs_maps, ent_sets);
            return;
        }
        // add topo geom sets
        ent_sets.verts_i = new Set();
        ent_sets.tris_i = new Set();
        ent_sets.edges_i = new Set();
        ent_sets.wires_i = new Set();
        ent_sets.faces_i = new Set();
        // add the ent posis to the main posis list to keep
        ent_sets.obj_posis_i.forEach( posi_i => ent_sets.posis_i.add(posi_i) );
        // points
        ent_sets.points_i.forEach( point_i => {
            ent_sets.verts_i.add(modeldata.geom.nav.navPointToVert(point_i));
        });
        // plines
        ent_sets.plines_i.forEach( pline_i => {
            const wire_i: number = modeldata.geom.nav.navPlineToWire(pline_i);
            ent_sets.wires_i.add(wire_i);
            const edges_i: number[] = modeldata.geom.nav.navWireToEdge(wire_i);
            edges_i.forEach(edge_i => ent_sets.edges_i.add(edge_i));
            const verts_i: number[] = modeldata.geom.query.getWireVerts(wire_i);
            verts_i.forEach(vert_i => ent_sets.verts_i.add(vert_i));
        });
        // pgons
        ent_sets.pgons_i.forEach( pgon_i => {
            const face_i: number = modeldata.geom.nav.navPgonToFace(pgon_i);
            ent_sets.faces_i.add(face_i);
            const tris_i: number[] = modeldata.geom.nav.navFaceToTri(face_i);
            tris_i.forEach(tri_i => ent_sets.tris_i.add(tri_i));
            const wires_i: number[] = modeldata.geom.nav.navFaceToWire(face_i);
            wires_i.forEach(wire_i => ent_sets.wires_i.add(wire_i));
            wires_i.forEach( wire_i => {
                const edges_i: number[] = modeldata.geom.nav.navWireToEdge(wire_i);
                edges_i.forEach(edge_i => ent_sets.edges_i.add(edge_i));
                const verts_i: number[] = modeldata.geom.query.getWireVerts(wire_i);
            verts_i.forEach(vert_i => ent_sets.verts_i.add(vert_i));
            });
        });
        // dump the selected data into this model
        // this model is assumed to be emprt
        this.geom.dump.dumpEnts(modeldata.geom, ent_sets);
        this.attribs.io.dumpEnts(modeldata.attribs._attribs_maps, ent_sets);
    }
    /**
     * Returns a clone of this model.
     * Entity IDs will not change.
     */
    public clone(): GIModelData {
        const clone: GIModelData = new GIModelData(this.model);
        clone.geom.dump.dump(this.geom._geom_maps);
        clone.attribs.io.dump(this.attribs._attribs_maps);
        // this.model.metadata = this.model.metadata;
        // clone.dump(this);
        return clone;
    }
    /**
     * Renumber entities.
     */
    public purge(): GIModelData {
        const clone: GIModelData = new GIModelData(this.model);
        clone.append(this);
        return clone;
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * For the imported data, deleted entities are filtered out (i.e. not merged).
     * @param model_data The GI model.
     */
    public append(modeldata: GIModelData): void {
        const geom_maps: Map<string, Map<number, number>> = this.geom.append.append(modeldata.geom._geom_maps);
        this.attribs.io.append(modeldata.attribs._attribs_maps, geom_maps);
    }
    /**
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.geom.check.check();
    }
        /**
     * Compares this model and another model.
     * ~
     * This is the answer model.
     * The other model is the submitted model.
     * ~
     * Both models will be modified in the process.
     * ~
     * @param model The model to compare with.
     */
    public compare(model: GIModel, normalize: boolean, check_geom_equality: boolean, check_attrib_equality: boolean):
            {percent: number, score: number, total: number, comment: string} {
        return this.comparator.compare(model, normalize, check_geom_equality, check_attrib_equality);
    }
}
