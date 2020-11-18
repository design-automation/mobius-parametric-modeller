import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIModel } from '../GIModel';
import { EEntType, EAttribDataTypeStrs, IAttribsMaps, EEntTypeStr } from '../common';
import { GIAttribsMerge } from './GIAttribsMerge';
import { GIModelData } from '../GIModelData';
import { GIAttribsSnapshot } from './GIAttribsSnapshot';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsImpExp } from './GIAttribsImpExp';
import { GIAttribMapBase } from '../attrib_classes/GIAttribMapBase';
import { GIAttribsDel } from './GIAttribsDel';
import { GIAttribsGetVal } from './GIAttribsGetVal';
import { GIAttribsSetVal } from './GIAttribsSetVal';
import { GIAttribsPosis } from './GIAttribsPosis';
import { GIAttribsPush } from './GIAttribsPush';

const eny_type_array: EEntType[] = [
    EEntType.POSI,
    EEntType.VERT,
    EEntType.EDGE,
    EEntType.WIRE,
    EEntType.POINT,
    EEntType.PLINE,
    EEntType.PGON,
    EEntType.COLL,
    EEntType.MOD
];
const ent_type_strs: Map<EEntType, string> = new Map([
    [EEntType.POSI, 'positions'],
    [EEntType.VERT, 'vertices'],
    [EEntType.EDGE, 'edges'],
    [EEntType.WIRE, 'wires'],
    [EEntType.POINT, 'points'],
    [EEntType.PLINE, 'polylines'],
    [EEntType.PGON, 'polygons'],
    [EEntType.COLL, 'collections'],
    [EEntType.MOD, 'model']
]);
/**
 * Class for attributes.
 */
export class GIAttribs {
    private modeldata: GIModelData;
    // maps, the key is the ssid, the value is the attrib map data
    // so to get the specific attibutes for e.g. "xyz" for positions:
    // attrib_maps.get(ssid).ps.get("xyz")
    public attribs_maps: Map<number, IAttribsMaps> = new Map();
    // sub classes with methods
    public merge: GIAttribsMerge;
    public imp_exp: GIAttribsImpExp;
    public add: GIAttribsAdd;
    public del: GIAttribsDel;
    public get: GIAttribsGetVal;
    public set: GIAttribsSetVal;
    public push: GIAttribsPush;
    public posis: GIAttribsPosis;
    public query: GIAttribsQuery;
    public snapshot: GIAttribsSnapshot;
    public threejs: GIAttribsThreejs;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
        this.merge = new GIAttribsMerge(modeldata);
        this.imp_exp = new GIAttribsImpExp(modeldata);
        this.add = new GIAttribsAdd(modeldata);
        this.del = new GIAttribsDel(modeldata);
        this.get = new GIAttribsGetVal(modeldata);
        this.set = new GIAttribsSetVal(modeldata);
        this.push = new GIAttribsPush(modeldata);
        this.posis = new GIAttribsPosis(modeldata);
        this.query = new GIAttribsQuery(modeldata);
        this.snapshot = new GIAttribsSnapshot(modeldata);
        this.threejs = new GIAttribsThreejs(modeldata);
    }
    /**
     * Get all the attribute names for an entity type
     * @param ent_type
     */
    public getAttribNames(ent_type: EEntType): string[] {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs_map: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return Array.from(attribs_map.keys());
    }
    /**
     * Get all the user defined attribute names for an entity type
     * This excludes the built in attribute names, xyz and anything starting with '_'
     * @param ent_type
     */
    public getAttribNamesUser(ent_type: EEntType): string[] {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs_map: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attribs: string[] = Array.from(attribs_map.keys());
        if (ent_type === EEntType.POSI) {
            attribs = attribs.filter(attrib => attrib !== 'xyz');
        }
        attribs = attribs.filter(attrib => attrib[0] !== '_');
        return attribs;
    }
    /**
     * Get attrib
     * @param ent_type
     * @param name
     */
    public getAttrib(ent_type: EEntType, name: string): GIAttribMapBase {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        return attribs.get(name);
    }
    /**
     * Rename an existing attribute.
     * Time stamps are not updated.
     *
     * @param ent_type The level at which to create the attribute.
     * @param old_name The name of the old attribute.
     * @param new_name The name of the new attribute.
     * @return True if the attribute was renamed, false otherwise.
     */
    public renameAttrib(ent_type: EEntType, old_name: string, new_name: string): boolean {
        const ssid: number = this.modeldata.active_ssid;
        const attribs_maps_key: string = EEntTypeStr[ent_type];
        const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        if (!attribs.has(old_name)) { return false; }
        if (attribs.has(new_name)) { return false; }
        if (old_name === new_name) { return false; }
        // rename
        const attrib: GIAttribMapBase = attribs.get(old_name);
        attrib.setName(new_name);
        const result = attribs.set(new_name, attrib);
        return attribs.delete(old_name);
    }
    /**
     * Compares this model and another model.
     * ~
     * If check_equality=false, the max total score will be equal to the number of attributes in this model.
     * It checks that each attribute in this model exists in the other model. If it exists, 1 mark is assigned.
     * ~
     * If check_equality=true, the max score will be increased by 10, equal to the number of entity levels.
     * For each entity level, if the other model contains no additional attributes, then one mark is assigned.
     * ~
     * @param other_model The model to compare with.
     */
    public compare(other_model: GIModel, result: {score: number, total: number, comment: any[]}): void {
        result.comment.push('Comparing attribute names and types.');
        // compare all attributes except model attributes
        // check that this model is a subset of other model
        // all the attributes in this model must also be in other model
        const attrib_comments: string[] = [];
        let matches = true;
        const attrib_names: Map<EEntType, string[]> = new Map();
        for (const ent_type of eny_type_array) {
            // get the attrib names
            const ent_type_str: string = ent_type_strs.get(ent_type);
            const this_attrib_names: string[] = this.getAttribNames(ent_type);
            const other_attrib_names: string[] = other_model.modeldata.attribs.getAttribNames(ent_type);
            attrib_names.set(ent_type, this_attrib_names);
            // check that each attribute in this model exists in the other model
            for (const this_attrib_name of this_attrib_names) {
                // check is this is built in
                let is_built_in = false;
                if (this_attrib_name === 'xyz' || this_attrib_name === 'rgb' || this_attrib_name.startsWith('_')) {
                    is_built_in = true;
                }
                // update the total
                if (!is_built_in) { result.total += 1; }
                // compare names
                if (other_attrib_names.indexOf(this_attrib_name) === -1 ) {
                    matches = false;
                    attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute is missing.');
                } else {
                    // get the data types
                    const data_type_1: EAttribDataTypeStrs =
                        this.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    const data_type_2: EAttribDataTypeStrs =
                        other_model.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    // compare data types
                    if (data_type_1 !== data_type_2) {
                        matches = false;
                        attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute datatype is wrong. '
                            + 'It is "' + data_type_1 + '" but it should be "' + data_type_1 + '".');
                    } else {
                        // update the score
                        if (!is_built_in) { result.score += 1; }
                    }
                }
            }
            // check if we have exact equality in attributes
            // total marks is not updated, we deduct marks
            // check that the other model does not have additional attribs
            if (other_attrib_names.length > this_attrib_names.length) {
                const additional_attribs: string[] = [];
                for (const other_attrib_name of other_attrib_names) {
                    if (this_attrib_names.indexOf(other_attrib_name) === -1) {
                        additional_attribs.push(other_attrib_name);
                    }
                }
                attrib_comments.push('There are additional ' + ent_type_str + ' attributes. ' +
                    'The following attributes are not required: [' + additional_attribs.join(',') + ']. ');
                // update the score, deduct 1 mark
                result.score -= 1;
            } else if (other_attrib_names.length < this_attrib_names.length) {
                attrib_comments.push('Mismatch: Model has too few entities of type: ' + ent_type_strs.get(ent_type) + '.');
            } else {
                // correct
            }
        }
        if (attrib_comments.length === 0) {
            attrib_comments.push('Attributes all match, both name and data type.');
        }
        // add to result
        result.comment.push(attrib_comments);
    }
    /**
     * Generate a string for debugging
     */
    public toStr(ssid: number): string {
        const ss_attrib_maps: IAttribsMaps = this.attribs_maps.get(ssid);
        const result: string[] = [];
        result.push('posis');
        ss_attrib_maps.ps.forEach( attrib => result.push(attrib.toStr()) );
        if (ss_attrib_maps._v.size) {
            result.push('verts');
            ss_attrib_maps._v.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps._e.size) {
            result.push('edges');
            ss_attrib_maps._e.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps._w.size) {
            result.push('wires');
            ss_attrib_maps._w.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.pt.size) {
            result.push('points');
            ss_attrib_maps.pt.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.pl.size) {
            result.push('plines');
            ss_attrib_maps.pl.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.pg.size) {
            result.push('pgons');
            ss_attrib_maps.pg.forEach( attrib => result.push(attrib.toStr()) );
        }
        if (ss_attrib_maps.co.size) {
            result.push('colls');
            ss_attrib_maps.co.forEach( attrib => result.push(attrib.toStr()) );
        }
        return result.join('\n');
    }
}
