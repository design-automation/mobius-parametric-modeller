import { GIGeom } from './geom/GIGeom';
import { GIAttribs } from './attribs/GIAttribs';
import { IModelJSONData, EEntType, EAttribNames, TEntTypeIdx, IEntSets } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModel } from './GIModel';
import { GIModelThreejs } from './GIModelThreejs';
import { GIFuncsCommon } from './funcs/GIFuncsCommon';
import { GIFuncsMake } from './funcs/GIFuncsMake';
import { GIFuncsEdit } from './funcs/GIFuncsEdit';
import { GIFuncsModify } from './funcs/GIFuncsModify';

/**
 * Geo-info model class.
 */
export class GIModelData {
    public active_ssid = 0;
    private _max_timestamp = 0;
    public model: GIModel;
    public geom: GIGeom;
    public attribs: GIAttribs;
    public comparator: GIModelComparator;
    public threejs: GIModelThreejs;
    public debug = true;
    // functions
    public funcs_common = new GIFuncsCommon(this);
    public funcs_make = new GIFuncsMake(this);
    public funcs_edit = new GIFuncsEdit(this);
    public funcs_modify = new GIFuncsModify(this);
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
        // functions
        this.funcs_common = new GIFuncsCommon(this);
        this.funcs_make = new GIFuncsMake(this);
        this.funcs_edit = new GIFuncsEdit(this);
        this.funcs_modify = new GIFuncsModify(this);
    }
    /**
     * Imports JSOn data into this model.
     * Eexisting data in the model is not affected.
     * @param model_data The JSON data.
     */
    public importGI (model_data: IModelJSONData): void {
        // console.log("SET DATA");
        const renum_maps: Map<number, Map<number, number>> = this.geom.imp_exp.importGI(model_data.geometry);
        this.attribs.imp_exp.importGI(model_data.attributes, renum_maps);
    }
    /**
     * Exports the JSON data for this model.
     */
    public exportGI(ents: TEntTypeIdx[]): IModelJSONData {
        if (ents === null) {
            return {
                geometry: this.geom.imp_exp.exportGIAll(),
                attributes: this.attribs.imp_exp.exportGIAll()
            };

        }
        const ent_sets: IEntSets = this.geom.snapshot.getSubEntsSets( this.active_ssid, ents, true); // incl topo
        // merge the two sets of posis
        for (const posi_i of ent_sets.obj_ps) { ent_sets.ps.add(posi_i); }
        // return the data
        return {
            geometry: this.geom.imp_exp.exportGI(ent_sets),
            attributes: this.attribs.imp_exp.exportGI(ent_sets)
        };
    }
    // /**
    //  * Copys the data from a second model into this model.
    //  * The existing data in this model is not deleted.
    //  * For the imported data, deleted entities are also merged.
    //  * @param model_data The GI model.
    //  */
    // public merge(ssid: number, modeldata: GIModelData): void {
    //     // const geom_maps: Map<number, number>[] = this.geom.io.merge(model.modeldata.geom._geom_maps);
    //     // this.attribs.io.merge(model.modeldata.attribs.attribs_maps.get(ssid), geom_maps);
    //     this.geom.merge.merge(ssid, modeldata.geom);
    //     this.attribs.io.merge(ssid, modeldata.attribs.attribs_maps.get(ssid));
    //     this.model.metadata = modeldata.model.metadata;
    // }
    // /**
    //  * Copys the data from a second model into this model without conflict detection.
    //  * Usually, this model is assumed to be empty.
    //  * If ent_sets is null, then only model attribs are copied.
    //  * @param model_data The GI model.
    //  */
    // public dumpEnts(ssid: number, modeldata: GIModelData, ent_sets: IEntSets): void {
    //     if (ent_sets === null) {
    //         this.attribs.io.dumpEnts(ssid, modeldata.attribs.attribs_maps.get(ssid), ent_sets);
    //         return;
    //     }
    //     // add topo geom sets
    //     ent_sets.verts_i = new Set();
    //     ent_sets.tris_i = new Set();
    //     ent_sets.edges_i = new Set();
    //     ent_sets.wires_i = new Set();
    //     ent_sets.faces_i = new Set();
    //     // add the ent posis to the main posis list to keep
    //     ent_sets.obj_posis_i.forEach( posi_i => ent_sets.posis_i.add(posi_i) );
    //     // points
    //     ent_sets.points_i.forEach( point_i => {
    //         ent_sets.verts_i.add(modeldata.geom.nav.navPointToVert(point_i));
    //     });
    //     // plines
    //     ent_sets.plines_i.forEach( pline_i => {
    //         const wire_i: number = modeldata.geom.nav.navPlineToWire(pline_i);
    //         ent_sets.wires_i.add(wire_i);
    //         const edges_i: number[] = modeldata.geom.nav.navWireToEdge(wire_i);
    //         edges_i.forEach(edge_i => ent_sets.edges_i.add(edge_i));
    //         const verts_i: number[] = modeldata.geom.query.getWireVerts(wire_i);
    //         verts_i.forEach(vert_i => ent_sets.verts_i.add(vert_i));
    //     });
    //     // pgons
    //     ent_sets.pgons_i.forEach( pgon_i => {
    //         const face_i: number = modeldata.geom.nav.navPgonToFace(pgon_i);
    //         ent_sets.faces_i.add(face_i);
    //         const tris_i: number[] = modeldata.geom.nav.navFaceToTri(face_i);
    //         tris_i.forEach(tri_i => ent_sets.tris_i.add(tri_i));
    //         const wires_i: number[] = modeldata.geom.nav.navFaceToWire(face_i);
    //         wires_i.forEach(wire_i => ent_sets.wires_i.add(wire_i));
    //         wires_i.forEach( wire_i => {
    //             const edges_i: number[] = modeldata.geom.nav.navWireToEdge(wire_i);
    //             edges_i.forEach(edge_i => ent_sets.edges_i.add(edge_i));
    //             const verts_i: number[] = modeldata.geom.query.getWireVerts(wire_i);
    //         verts_i.forEach(vert_i => ent_sets.verts_i.add(vert_i));
    //         });
    //     });
    //     // dump the selected data into this model
    //     // this model is assumed to be emprt
    //     this.geom.dump.dumpEnts(ssid, modeldata.geom, ent_sets);
    //     this.attribs.io.dumpEnts(ssid, modeldata.attribs.attribs_maps.get(ssid), ent_sets);
    // }
    // /**
    //  * Returns a clone of this model.
    //  * Entity IDs will not change.
    //  */
    // public clone(ssid: number): GIModelData {
    //     const clone: GIModelData = new GIModelData(this.model);
    //     clone.geom.dump.dump(ssid, this.geom._geom_maps);
    //     clone.attribs.io.dump(ssid, this.attribs.attribs_maps.get(ssid));
    //     // this.model.metadata = this.model.metadata;
    //     // clone.dump(this);
    //     return clone;
    // }
    // /**
    //  * Renumber entities.
    //  */
    // public purge(ssid: number): GIModelData {
    //     throw new Error('Not implemented.');
    //     // const clone: GIModelData = new GIModelData(this.model);
    //     // clone.append(ssid, this);
    //     // return clone;
    // }
    // /**
    //  * Copys the data from a second model into this model.
    //  * The existing data in this model is not deleted.
    //  * For the imported data, deleted entities are filtered out (i.e. not merged).
    //  * @param model_data The GI model.
    //  */
    // public append(ssid: number, ssid2: number, modeldata: GIModelData): void {
    //     // append the geometry
    //     const renum_maps: Map<string, Map<number, number>> = this.geom.append.append(ssid, ssid2, modeldata);
    //     // append the attributes
    //     this.attribs.io.append(ssid, ssid2, modeldata, renum_maps);
    // }
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
    /**
     * Update time stamp of an object (point, pline, pgon)
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    public getObjsUpdateTs(ent_type: EEntType, ent_i: number): void {
        const ts: number = this.active_ssid;
        switch (ent_type) {
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
                this.attribs.set.setEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP, ts);
                return;
            case EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach( pgon_i => {
                    this.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPline(ent_i).forEach( pline_i => {
                    this.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach( point_i => {
                    this.attribs.set.setEntAttribVal(EEntType.POINT, point_i, EAttribNames.TIMESTAMP, ts);
                });
                return;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                // get the topo object
                const [ent2_type, ent2_i]: TEntTypeIdx = this.geom.query.getTopoObj(ent_type, ent_i);
                this.getObjsUpdateTs(ent2_type, ent2_i);
        }
    }
    /**
     * Check time stamp of an object (point, pline, pgon) is same as current time stamp
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    public getObjsCheckTs(ent_type: EEntType, ent_i: number): void {
        const ts: number = this.active_ssid;
        switch (ent_type) {
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
                if (this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP) !== ts) {
                    const obj_ts = this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP);
                    // TODO improve this error message
                    throw new Error('Bad edit...' + ent_type + ', ' + ent_i + ', ' + obj_ts + ', ' + ts);
                }
                return;
            case EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach( pgon_i => {
                    this.getObjsCheckTs(EEntType.PGON, pgon_i);
                });
                this.geom.nav.navCollToPline(ent_i).forEach( pline_i => {
                    this.getObjsCheckTs(EEntType.PLINE, pline_i);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach( point_i => {
                    this.getObjsCheckTs(EEntType.POINT, point_i);
                });
                return;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                // get the topo object
                const [ent2_type, ent2_i]: TEntTypeIdx = this.geom.query.getTopoObj(ent_type, ent_i);
                this.getObjsCheckTs(ent2_type, ent2_i);
        }
    }
    /**
     * Update time stamp of a object, or collection
     * Topo ents will throw an error
     * @param point_i
     */
    public updateEntTs(ent_type: EEntType, ent_i: number): void {
        if (ent_type >= EEntType.POINT && ent_type <= EEntType.PGON) {
            this.attribs.set.setEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP, this.active_ssid);
        }
    }
    /**
     * Get the timestamp of a posi
     * @param posi_i
     */
    public getEntTs(ent_type: EEntType, ent_i: number): number {
        if (ent_type < EEntType.POINT || ent_type > EEntType.PGON) { throw new Error('Get time stamp: Entity type is not valid.'); }
        return this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP ) as number;
    }
    /**
     *
     */
    public nextSnapshot() {
        this._max_timestamp += 1;
        this.active_ssid = this._max_timestamp;
    }
    /**
     *
     */
    public toStr(ssid: number): string {
        return 'SSID = ' + ssid + '\n' +
            'GEOMETRY\n' + this.geom.snapshot.toStr(ssid) +
            'ATTRIBUTES\n' + this.attribs.snapshot.toStr(ssid);
    }
}
