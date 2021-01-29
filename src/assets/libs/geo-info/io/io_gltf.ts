import { GIModel } from '../GIModel';
import { TEntTypeIdx, IEntSets } from '../common';
import { getObjSets } from './common';

export function exportGltf(model: GIModel, entities: TEntTypeIdx[], ssid: number): string {
    // create features from pgons, plines, points
    const obj_sets: IEntSets = getObjSets(model, entities, ssid);
    const export_json = '';
    for (const pgon_i of obj_sets.pg) {
        
    }
    for (const pline_i of obj_sets.pl) {
        
    }

    return JSON.stringify(export_json, null, 2); // pretty
}
