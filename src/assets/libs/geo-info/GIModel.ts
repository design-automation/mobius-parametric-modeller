import { GIGeom } from './GIGeom';
import { GIAttribs } from './GIAttribs';
import { IModelData, IGeomPack, EEntType, Txyz, TEntAttribValuesArr, TAttribDataTypes, TEntity, TEntTypeIdx } from './common';
import { GIModelThreejs } from './GIModelThreejs';

/**
 * Geo-info model class.
 */
export class GIModel {
    [x: string]: any; // TODO: What is this???
    public geom: GIGeom;
    public attribs: GIAttribs;
    public threejs: GIModelThreejs;
    /**
     * Creates a model.
     * @param model_data The JSON data
     */
    constructor(model_data?: IModelData) {
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        this.threejs = new GIModelThreejs(this);
        if (model_data) {
            this.setData(model_data);
        }
    }
    /**
     * Copys the data from a second model into this model.
     * The existing data in this model is not deleted.
     * @param model_data The GI model.
     */
    public merge(model: GIModel): void {
        this.attribs.io.merge(model.attribs._attribs_maps); // warning: must be before this.geom.io.merge()
        this.geom.io.merge(model.geom._geom_arrays);
    }
    /**
     * Sets the data in this model from JSON data.
     * Any existing data in the model is deleted.
     * @param model_data The JSON data.
     */
    public setData (model_data: IModelData): IGeomPack {
        this.attribs.io.setData(model_data.attributes); // warning: must be before this.geom.io.setData()
        const new_ents_i: IGeomPack = this.geom.io.setData(model_data.geometry);
        return new_ents_i;
    }
    /**
     * Returns the JSON data for this model.
     */
    public getData(): IModelData {
        return {
            geometry: this.geom.io.getData(),
            attributes: this.attribs.io.getData()
        };
    }
    /**
     * Check model for internal consistency
     */
    public check(): string[] {
        return this.geom.check();
    }
    /**
     * Compares this model and another model.
     *
     * Polygons must have the vertices in the same order, and starting at the same position.
     *
     * TODO: implement model attributes, need to compare values
     * TODO: implement collections, need to oompare attributes, parent id, and object ids
     *
     * @param model The model to compare with.
     */
    public compare(model: GIModel, normalize: boolean): {matches: boolean, comment: string} {
        const result_array: {matches: boolean, comment: any} = {matches: true, comment: []};
        // do some basic counting
        this.geom.compare(model, result_array);
        this.attribs.compare(model, result_array);
        // normalize the two models
        if (normalize) {
            this.normalize();
            model.normalize();
        }
        // compare the actual data
        this.compareData(model, result_array);
        // Add a final msg
        if (result_array.matches) {
            result_array.comment = ['RESULT: The two models match.'];
        } else {
            result_array.comment.push('RESULT: The two models no not match.');
        }
        // html formatting
        let formatted_str = '<ul>';
        for (const comment of result_array.comment) {
            if (Array.isArray(comment)) {
                formatted_str += '<ul>';
                    for (const sub_comment of comment) {
                        formatted_str += '<li>' + sub_comment + '</li>';
                    }
                formatted_str += '</ul>';
            } else {
                formatted_str += '<li>' + comment + '</li>';
            }
        }
        formatted_str += '</ul>';
        // return the result
        return {matches: result_array.matches, comment: formatted_str};
    }
    // ============================================================================
    // Private methods for normalizing
    // ============================================================================
    /**
     * Normalises the direction of open wires
     */
    private normalize(): void {
        this.normalizeOpenWires();
        this.normalizeClosedWires();
        this.normalizeHoles();
    }
    /**
     * Normalises the direction of open wires
     */
    private normalizeOpenWires(): void {
        for (const wire_i of this.geom.query.getEnts(EEntType.WIRE, false)) {
            if (!this.geom.query.istWireClosed(wire_i)) {
                // an open wire can only start at the first or last vertex, but the order can be reversed
                const verts_i: number[] = this.geom.query.navAnyToVert(EEntType.WIRE, wire_i);
                const fingerprint_start: string = this.xyzFingerprint(EEntType.VERT, verts_i[0]);
                const fingerprint_end: string = this.xyzFingerprint(EEntType.VERT, verts_i[verts_i.length - 1]);
                if (fingerprint_start > fingerprint_end) {
                    this.geom.modify.reverse(wire_i);
                }
            }
        }
    }
    /**
     * Normalises the edge order of closed wires
     */
    private normalizeClosedWires(): void {
        for (const wire_i of this.geom.query.getEnts(EEntType.WIRE, false)) {
            if (this.geom.query.istWireClosed(wire_i)) {
                // a closed wire can start at any edge, but the order cannot be reversed
                const edges_i: number[] = this.geom.query.navAnyToEdge(EEntType.WIRE, wire_i);
                const fingerprints: Array<[string, number]> = [];
                for (let i = 0; i < edges_i.length; i++) {
                    const edge_i: number = edges_i[i];
                    fingerprints.push([this.xyzFingerprint(EEntType.EDGE, edge_i), i]);
                }
                fingerprints.sort();
                this.geom.modify.shift(wire_i, fingerprints[0][1]);
            }
        }
    }
    /**
     * Normalises the order of holes in faces
     */
    private normalizeHoles(): void {
        for (const face_i of this.geom.query.getEnts(EEntType.FACE, false)) {
            const holes_i: number[] = this.geom.query.getFaceHoles(face_i);
            if (holes_i.length > 0) {
                const fingerprints: Array<[string, number]> = [];
                for (const hole_i of holes_i) {
                    fingerprints.push([this.xyzFingerprint(EEntType.WIRE, hole_i), hole_i]);
                }
                fingerprints.sort();
                const reordered_holes_i: number[] = fingerprints.map( fingerprint => fingerprint[1] );
                this.geom.modify.setFaceHoles(face_i, reordered_holes_i);
            }
        }
    }
    /**
     * For any entity, greate a string that concatenates all the xyz values of its positions.
     * ~
     * These strings will be used for sorting entities into a predictable order,
     * independent of the order in which the geometry was actually created.
     * ~
     * If there are multiple entities in exactly the same position, then the ordering may be unpredictable.
     * ~
     * @param ent_type
     * @param ent_i
     */
    private xyzFingerprint(ent_type: EEntType, ent_i: number): string {
        const posis_i: number[] = this.geom.query.navAnyToPosi(ent_type, ent_i);
        const fingerprints: string[] = posis_i.map(posi_i => this.getAttribValFingerprint(this.attribs.query.getPosiCoords(posi_i)));
        return fingerprints.join('|');
    }
    // ============================================================================
    // Private methods for fingerprinting
    // ============================================================================
    /**
     * Compare the data in two models
     */
    private compareData(other_model: GIModel , result_array: {matches: boolean, comment: any[]}): void {
        result_array.comment.push('Comparing model data.');
        const data_comments: string [] = [];
        // popint, polylines, polygons
        const obj_ent_types: EEntType[] = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const obj_ent_type_strs: Map<EEntType, string> = new Map([
            [EEntType.POINT, 'points'],
            [EEntType.PLINE, 'polylines'],
            [EEntType.PGON, 'polygons']
        ]);
        // create the maps to store the new sorted order of all the point, plines, pgons
        const this_i_maps: Map<EEntType, Map<number, number>> = new Map();
        const other_i_maps: Map<EEntType, Map<number, number>> = new Map();
        // create fingerprints for points, plines, pgons
        for (const obj_ent_type of obj_ent_types) {
            const [this_fingerprints, this_i_map]: [string, Map<number, number>] = this.getEntsFingerprint(obj_ent_type);
            // console.log('this ' + obj_ent_type_strs.get(obj_ent_type) + ': ', this_fingerprints);
            const [other_fingerprints, other_i_map]: [string, Map<number, number>] = other_model.getEntsFingerprint(obj_ent_type);
            // console.log('other ' + obj_ent_type_strs.get(obj_ent_type) + ': ', other_fingerprints);
            this_i_maps.set(obj_ent_type, this_i_map);
            other_i_maps.set(obj_ent_type, other_i_map);
            if (this_fingerprints !== other_fingerprints) {
                result_array.matches = false;
                data_comments.push('Differences were found in the ' + obj_ent_type_strs.get(obj_ent_type) + ' data.');
            }
        }
        // collections
        const this_colls_fingerprint: string = this.getCollFingerprints(this_i_maps);
        // console.log('this coll: ', this_colls_fingerprint);
        const other_colls_fingerprint: string = other_model.getCollFingerprints(other_i_maps);
        // console.log('other coll: ', other_colls_fingerprint);
        if (this_colls_fingerprint !== other_colls_fingerprint) {
            result_array.matches = false;
            data_comments.push('Differences were found in the collections data.');
        }
        // model attributes

        // TODO

        // add a final comment if everything matches
        if (data_comments.length === 0) {
            data_comments.push('Everything matches.');
        }
        result_array.comment.push(data_comments);
    }
    /**
     * Get a fingerprint of all geometric entities of a certain type in the model.
     * This returns a fingerprint string, and a map old_i -> new_i.
     * The map new_i will be consistent, no matter how the model was created.
     * The map is needed for creating fingerprints for collections.
     */
    private getEntsFingerprint(ent_type: EEntType): [string, Map<number, number>] {
        const fingerprints: string[]  = [];
        const ents_i: number[] = this.geom.query.getEnts(ent_type, false);
        for (const ent_i of ents_i) {
            fingerprints.push(this.getEntFingerprint(ent_type, ent_i));
        }
        // if there are no values for a certain entity type, e.g. no polylines, then return ~
        if (fingerprints.length === 0) { return ['~', null]; }
        // before we sort, we need to save the original order, which will be required for collections
        const fingerprint_to_old_i_map: Map<string, number> = new Map();
        for (let i = 0; i < fingerprints.length; i++) {
            fingerprint_to_old_i_map.set(fingerprints[i], i);
        }
        // the fingerprints of the entities are sorted
        fingerprints.sort();
        // now we need to create a map from old index to new index
        const old_i_to_new_i_map: Map<number, number> = new Map();
        for (let i = 0; i < fingerprints.length; i++) {
            const old_i: number = fingerprint_to_old_i_map.get(fingerprints[i]);
            old_i_to_new_i_map.set(old_i, i);
        }
        // return the result
        // sepeparted by a $, e.g. polyline5$polyline3$polyline6...
        return [fingerprints.join('$'), old_i_to_new_i_map];
    }
    /**
     * Get a fingerprint of one geometric entity: point, polyline, polygon
     */
    private getEntFingerprint(from_ent_type: EEntType, index: number): string {
        const fingerprints = [];
        // deal with everything else
        const to_ent_types: EEntType[] = [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.FACE,
            EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        for (const to_ent_type of to_ent_types) {
            const sub_fingerprints: string[] = [];
            // we are only interested in entities that are lower or equal to from_ent_type
            if (to_ent_type <= from_ent_type) {
                const attrib_names: string[] = this.attribs.query.getAttribNames(to_ent_type);
                // sort the attrib names
                attrib_names.sort();
                const sub_ents_i: number[] = this.geom.query.navAnyToAny(from_ent_type, to_ent_type, index);
                // for each attrib, make a finderprint
                for (const attrib_name of attrib_names) {
                    for (const sub_ent_i of sub_ents_i) {
                        const attrib_value: TAttribDataTypes = this.attribs.query.getAttribVal(to_ent_type, attrib_name, sub_ent_i);
                        sub_fingerprints.push(this.getAttribValFingerprint(attrib_value));
                    }
                }
            }
            // the fingerprints of the sub entities are sorted and seperated by @, e.g. vertex5@vertex3@...
            if (to_ent_type === EEntType.WIRE) {
                sub_fingerprints.sort();
            }
            fingerprints.push(sub_fingerprints.join('@'));
        }
        // the fingerprint of the entities are seperated by #, e.g. #positions#vertices#edges...
        // there is no need to sort these, they are already in a fixed order
        return fingerprints.join('#');
    }
    /**
     * Get one fingerprint for all collections
     */
    private getCollFingerprints(index_map: Map<EEntType, Map<number, number>>): string {
        const fingerprints: string[]  = [];
        const colls_i: number[] = this.geom.query.getEnts(EEntType.COLL, false);
        for (const ent_i of colls_i) {
            fingerprints.push(this.getCollFingerprint(ent_i, index_map));
        }
        // if there are no values for a certain entity type, e.g. no coll, then return ~
        if (fingerprints.length === 0) { return '~'; }
        // before we sort, we need to save the original order, which will be required for the parent collection index
        const fingerprint_to_old_i_map: Map<string, number> = new Map();
        for (let i = 0; i < fingerprints.length; i++) {
            fingerprint_to_old_i_map.set(fingerprints[i], i);
        }
        // the fingerprints of the collections are sorted and sepeparted by a $, e.g. coll5$coll3$coll6...
        fingerprints.sort();
        // now we need to create a map from old index to new index
        const old_i_to_new_i_map: Map<number, number> = new Map();
        for (let i = 0; i < fingerprints.length; i++) {
            const old_i: number = fingerprint_to_old_i_map.get(fingerprints[i]);
            old_i_to_new_i_map.set(old_i, i);
        }
        // for each collection, we now add the parent id, using the new index
        for (let i = 0; i < fingerprints.length; i++) {
            const coll_old_i: number = fingerprint_to_old_i_map.get(fingerprints[i]);
            const coll_parent_old_i: number = this.geom.query.getCollParent(coll_old_i);
            let parent_str = '';
            if (coll_parent_old_i === -1) {
                parent_str = '.^';
            } else {
                const coll_parent_new_i: number = old_i_to_new_i_map.get(coll_parent_old_i);
                parent_str = coll_parent_new_i + '^';
            }
            fingerprints[i] = parent_str + fingerprints[i];
        }
        // return the result
        return fingerprints.join('$');
    }
    /**
     * Get a fingerprint of one collection
     */
    private getCollFingerprint(index: number, index_map: Map<EEntType, Map<number, number>>): string {
        const to_ent_types: EEntType[] = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const fingerprints: string[] = [];
        for (const to_ent_type of to_ent_types) {
            const ents_i: number[] = this.geom.query.navAnyToAny(EEntType.COLL, to_ent_type, index);
            const ents_new_i: number[] = ents_i.map(ent_i => index_map.get(to_ent_type).get(ent_i));
            ents_new_i.sort();
            fingerprints.push(ents_new_i.join(','));
        }
        return fingerprints.join('#');
    }
    /**
     * Get a fingerprint of an attribute value
     */
    private getAttribValFingerprint(value: any): string {
        const precision = 1e4;
        if (value === null) { return '.'; }
        if (value === undefined) { return '.'; }
        if (typeof value === 'number') { return String(Math.round(value * precision) / precision); }
        if (typeof value === 'string') { return value; }
        if (typeof value === 'boolean') { return String(value); }
        if (Array.isArray(value)) {
            const fingerprints = [];
            for (const item of value) {
                fingerprints.push(this.getAttribValFingerprint(item));
            }
            return fingerprints.join(',');
        }
        if (typeof value === 'object') {
            let fingerprint = '';
            const prop_names: string[] = Object.getOwnPropertyNames(value);
            prop_names.sort();
            for (const prop_name of prop_names) {
                fingerprint += prop_name + '=' + this.getAttribValFingerprint(value[prop_name]);
            }
            return fingerprint;
        }
        throw new Error('Attribute value not recognised.');
    }
}
