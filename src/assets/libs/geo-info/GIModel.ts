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
     * TODO: implement parents of collections
     *
     * @param model The model to compare with.
     */
    public compare(model: GIModel, normalize: boolean, check_geom_equality: boolean, check_attrib_equality: boolean):
            {percent: number, score: number, total: number, comment: string} {
        // create the result object
        const result: {percent: number, score: number, total: number, comment: any} = {percent: 0, score: 0, total: 0, comment: []};
        // if check_geom_equality, then check we have exact same number of positions, objects, and colletions
        if (check_geom_equality) {
            this.geom.compare(model, result);
        }
        // check that the attributes in this model all exist in the other model
        // at the same time get a map of all attribute names in this model
        const attrib_names: Map<EEntType, string[]> = this.attribs.compare(model, check_attrib_equality, result);
        // normalize the two models
        if (normalize) {
            this.normalize();
            model.normalize();
        }
        // compare the actual data
        this.compareData(model, result, attrib_names);
        // Add a final msg
        if (result.score === result.total) {
            result.comment = ['RESULT: The two models match.'];
        } else {
            result.comment.push('RESULT: The two models no not match.');
        }
        // calculate percentage score
        result.percent = Math.round( result.score / result.total * 100);
        if (result.percent < 0) { result.percent = 0; }
        // html formatting
        let formatted_str = '';
        formatted_str += '<p><b>Percentage: ' + result.percent + '%</b></p>';
        formatted_str += '<p>Score: ' + result.score + '/' + result.total + '</p>';
        formatted_str += '<ul>';
        for (const comment of result.comment) {
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
        result.comment = formatted_str;
        // return the result
        return result;
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
     * Compare the data in two models. Check that this model is a subset of the other model.
     * So if this is being used to check if the model submitted by a student is the correct answer,
     * then this model is the answer, and teh student model is the other model
     * This method will check that every entity in this model also exists in the other model.
     * This means that the student answer (the other model) can conrain additional data and still get
     * a full score.
     * ~
     * This will return a score, indicating how similar the models are.
     * ~
     * For the compareData method, total score is equal to number of points, plines, pgons and collections
     */
    private compareData(other_model: GIModel,
            result: {score: number, total: number, comment: any[]}, attrib_names: Map<EEntType, string[]>): void {
        result.comment.push('Comparing model data.');
        const data_comments: string [] = [];
        // points, polylines, polygons
        const obj_ent_types: EEntType[] = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const obj_ent_type_strs: Map<EEntType, string> = new Map([
            [EEntType.POINT, 'points'],
            [EEntType.PLINE, 'polylines'],
            [EEntType.PGON, 'polygons']
        ]);
        // compare points, plines, pgons
        const this_to_com_idx_maps: Map<EEntType, Map<number, number>> = new Map();
        const other_to_com_idx_maps: Map<EEntType, Map<number, number>> = new Map();
        for (const obj_ent_type of obj_ent_types) {
            // create the two maps, and store them in the map of maps
            const this_to_com_idx_map: Map<number, number> = new Map();
            this_to_com_idx_maps.set(obj_ent_type, this_to_com_idx_map);
            const other_to_com_idx_map: Map<number, number> = new Map();
            other_to_com_idx_maps.set(obj_ent_type, other_to_com_idx_map);
            // get the fingerprints
            const [this_fingerprints, this_ents_i]: [string[], number[]] = this.getEntsFingerprint(obj_ent_type, attrib_names);
            // console.log('this_fingerprints:', this_fingerprints, 'this_ents_i:', this_ents_i);
            const [other_fingerprints, other_ents_i]: [string[], number[]] = other_model.getEntsFingerprint(obj_ent_type, attrib_names);
            // console.log('other_fingerprints:', other_fingerprints, 'other_ents_i:', other_ents_i);
            // check that every entity in this model also exists in the other model
            let num_objs_not_found = 0;
            for (let com_idx = 0; com_idx < this_fingerprints.length; com_idx++) {
                // increment the total by 1
                result.total += 1;
                // get this fingerprint, i.e. the one we are looking for in the other model
                const this_fingerprint: string = this_fingerprints[com_idx];
                // get this index and set the map
                const this_ent_i: number = this_ents_i[com_idx];
                this_to_com_idx_map.set(this_ent_i, com_idx);
                // for other...
                // get the index of this_fingerprint in the list of other_fingerprints
                const found_other_idx: number = other_fingerprints.indexOf(this_fingerprint);
                // add mismatch comment or update score
                if (found_other_idx === -1) {
                    num_objs_not_found++;
                } else {
                    // we get the idx, which is common for both models
                    const other_ent_i: number = other_ents_i[found_other_idx];
                    other_to_com_idx_map.set(other_ent_i, com_idx);
                    result.score += 1;
                }
            }
            if (num_objs_not_found > 0) {
                const marks_added: number = this_fingerprints.length - num_objs_not_found;
                data_comments.push('Mismatch: ' + num_objs_not_found + ' ' +
                    obj_ent_type_strs.get(obj_ent_type) + ' entities could not be found.');
            } else {
                data_comments.push('All ' +
                    obj_ent_type_strs.get(obj_ent_type) + ' entities have been found.');
            }
        }
        // compare collections
        const this_colls_fingerprints: string[] = this.getCollFingerprints(this_to_com_idx_maps, attrib_names.get(EEntType.COLL));
        // console.log('this_colls_fingerprints:', this_colls_fingerprints);
        const other_colls_fingerprints: string[] = other_model.getCollFingerprints(other_to_com_idx_maps, attrib_names.get(EEntType.COLL));
        // console.log('other_colls_fingerprints:', other_colls_fingerprints);
        // check that every collection in this model also exists in the other model
        let num_colls_not_found = 0;
        for (const this_colls_fingerprint of this_colls_fingerprints) {
            // increment the total score by 1
            result.total += 1;
            // look for this in other
            const found_other_idx: number = other_colls_fingerprints.indexOf(this_colls_fingerprint);
            // add mismatch comment or update score
            if (found_other_idx === -1) {
                num_colls_not_found++;
            } else {
                result.score += 1;
            }
        }
        if (num_colls_not_found > 0) {
            data_comments.push('Mismatch: ' + num_colls_not_found + ' collections could not be found.');
        }
        // add a comment if everything matches
        if (result.score === result.total) {
            data_comments.push('Match: The model contains all required entities and collections.');
        }
        // compare model attributes
        const this_mod_attrib_names: string[] = this.attribs.query.getAttribNames(EEntType.MOD);
        for (const this_mod_attrib_name of this_mod_attrib_names) {
            // increment the total by 1
            result.total += 1;
            // check if there is a match
            if (other_model.attribs.query.hasModelAttrib(this_mod_attrib_name)) {
                const this_value: TAttribDataTypes = this.attribs.query.getModelAttribVal(this_mod_attrib_name);
                const other_value: TAttribDataTypes = other_model.attribs.query.getModelAttribVal(this_mod_attrib_name);
                if (this_value === other_value) {
                    // correct, so increment the score by 1
                    result.score += 1;
                } else {
                    data_comments.push('Mismatch: the value for model attribute "' + this_mod_attrib_name + '" is incorrect.');
                }
            } else {
                data_comments.push('Mismatch: model attribute "' + this_mod_attrib_name + '" not be found.');
            }
        }
        // add a comment if everything matches
        if (result.score === result.total) {
            data_comments.push('Match: The model conatins all required model attributes.');
        }
        // add a final comment if everything matches
        if (result.score === result.total) {
            data_comments.push('Match: Everything matches.');
        }
        // 
        result.comment.push(data_comments);
    }
    /**
     * Get a fingerprint of all geometric entities of a certain type in the model.
     * This returns a fingerprint string, and the entity indexes
     * The two arrays are in the same order
     */
    private getEntsFingerprint(ent_type: EEntType, attrib_names: Map<EEntType, string[]>): [string[], number[]] {
        const fingerprints: string[]  = [];
        const ents_i: number[] = this.geom.query.getEnts(ent_type, false);
        for (const ent_i of ents_i) {
            fingerprints.push(this.getEntFingerprint(ent_type, ent_i, attrib_names));
        }
        // return the result, do not sort
        return [fingerprints, ents_i];
    }
    /**
     * Get a fingerprint of one geometric entity: point, polyline, polygon
     * Returns a string, something like '#a@b@c#x@y@z'
     */
    private getEntFingerprint(from_ent_type: EEntType, index: number, attrib_names_map: Map<EEntType, string[]>): string {
        const fingerprints = [];
        // define topo entities for each obj (starts with posis and ends with objs)
        const topo_ent_types_map: Map<EEntType, EEntType[]> = new Map();
        topo_ent_types_map.set(EEntType.POINT, [EEntType.POSI, EEntType.VERT, EEntType.POINT]);
        topo_ent_types_map.set(EEntType.PLINE, [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.PLINE]);
        topo_ent_types_map.set(EEntType.PGON, [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.FACE, EEntType.PGON]);
        // create fingerprints of topological entities
        for (const topo_ent_type of topo_ent_types_map.get(from_ent_type)) {
            const topo_fingerprints: string[] = [];
            // get the attribute names array that will be used for matching
            const attrib_names: string[] = attrib_names_map.get(topo_ent_type);
            // sort the attrib names
            attrib_names.sort();
            const sub_ents_i: number[] = this.geom.query.navAnyToAny(from_ent_type, topo_ent_type, index);
            // for each attrib, make a finderprint
            for (const attrib_name of attrib_names) {
                for (const sub_ent_i of sub_ents_i) {
                    const attrib_value: TAttribDataTypes = this.attribs.query.getAttribVal(topo_ent_type, attrib_name, sub_ent_i);
                    if (attrib_value !== null && attrib_value !== undefined) {
                        topo_fingerprints.push(this.getAttribValFingerprint(attrib_value));
                    }
                }
            }
            // the order is significant, so we do not sort
            // any differences in order (e.g. holes) will already be dealt with by normalization
            fingerprints.push(topo_fingerprints.join('@'));
        }
        // return the final fingerprint string for the object
        // no need to sort, the order is predefined
        return fingerprints.join('#');
    }
    /**
     * Get one fingerprint for all collections
     */
    private getCollFingerprints(idx_maps: Map<EEntType, Map<number, number>>, attrib_names: string[]): string[] {
        const fingerprints: string[]  = [];
        // create the fingerprints for each collection
        const colls_i: number[] = this.geom.query.getEnts(EEntType.COLL, false);
        for (const coll_i of colls_i) {
            fingerprints.push(this.getCollFingerprint(coll_i, idx_maps, attrib_names));
        }
        // if there are no values for a certain entity type, e.g. no coll, then return []
        if (fingerprints.length === 0) { return []; }
        // before we sort, we need to save the original order, which will be required for the parent collection index
        const fingerprint_to_old_i_map: Map<string, number> = new Map();
        for (let i = 0; i < fingerprints.length; i++) {
            fingerprint_to_old_i_map.set(fingerprints[i], i);
        }
        // the fingerprints of the collections are sorted
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
        // return the result, an array of fingerprints
        return fingerprints;
    }
    /**
     * Get a fingerprint of one collection
     * Returns a string, something like 'a@b@c#[1,2,3]#[3,5,7]#[2,5,8]'
     */
    private getCollFingerprint(coll_i: number, com_idx_maps: Map<EEntType, Map<number, number>>, attrib_names: string[]): string {
        const to_ent_types: EEntType[] = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const fingerprints: string[] = [];
        const attribs_vals: string[] = [];
        // for each attrib, make a finderprint of the attrib value
        for (const attrib_name of attrib_names) {
            const attrib_value: TAttribDataTypes = this.attribs.query.getAttribVal(EEntType.COLL, attrib_name, coll_i);
            if (attrib_value !== null && attrib_value !== undefined) {
                attribs_vals.push(this.getAttribValFingerprint(attrib_value));
            }
        }
        fingerprints.push(attribs_vals.join('@'));
        // get all the entities in this collection
        // if idx_maps is null, then we use teh actual entity numbers
        // if idx_maps is not null, then we map the entity numbers
        // mapping entity numbers means that we map to the equivalent entity numbers in the other model
        // we do this to ensure that, when comparing models, the entity numbers will match
        for (const to_ent_type of to_ent_types) {
            // get the map from ent_i to com_idx
            const com_idx_map: Map<number, number> = com_idx_maps.get(to_ent_type);
            // the the common indexes of the entities
            const ents_i: number[] = this.geom.query.navAnyToAny(EEntType.COLL, to_ent_type, coll_i);
            const com_idxs: number[] = ents_i.map( ent_i => com_idx_map.get(ent_i) );
            // sort so that they are in standard order
            com_idxs.sort();
            // create a string
            fingerprints.push(JSON.stringify(com_idxs));
        }
        // return the final fingerprint string for the collection
        // no need to sort, the order is predefined
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
                const attrib_value: string = this.getAttribValFingerprint(item);
                fingerprints.push(attrib_value);
            }
            return fingerprints.join(',');
        }
        if (typeof value === 'object') {
            let fingerprint = '';
            const prop_names: string[] = Object.getOwnPropertyNames(value);
            prop_names.sort();
            for (const prop_name of prop_names) {
                const attrib_value: string = this.getAttribValFingerprint(value[prop_name]);
                fingerprint += prop_name + '=' + attrib_value;
            }
            return fingerprint;
        }
        throw new Error('Attribute value not recognised.');
    }
}
