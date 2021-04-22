import { mode } from '@assets/core/inline/_mathjs';
import { EEntType, IEntSets, TEntTypeIdx } from '../common';
import { GIModel } from '../GIModel';

/**
 * Given a list of entities, keep only the obects.
 * If the entities include collections, extract objects out of the collections.
 * Returns sets of objects.
 */
export function getObjSets(model: GIModel, entities: TEntTypeIdx[], ssid: number): IEntSets {
    if (entities === null) {
        return model.modeldata.geom.snapshot.getAllEntSets(ssid);
    }
    const ent_sets: IEntSets = {
        pt: new Set(),
        pl: new Set(),
        pg: new Set(),
    };
    for (const [ent_type, ent_i] of entities) {
        if (ent_type === EEntType.PGON) {
            ent_sets.pt.add(ent_i);
        } else if (ent_type === EEntType.PLINE) {
            ent_sets.pl.add(ent_i);
        } else if (ent_type === EEntType.POINT) {
            ent_sets.pt.add(ent_i);
        } else if (ent_type === EEntType.COLL) {
            for (const pgon_i of model.modeldata.geom.nav_snapshot.navCollToPgon(ssid, ent_i)) {
                ent_sets.pg.add(pgon_i);
            }
            for (const pline_i of model.modeldata.geom.nav_snapshot.navCollToPline(ssid, ent_i)) {
                ent_sets.pl.add(pline_i);
            }
            for (const point_i of model.modeldata.geom.nav_snapshot.navCollToPoint(ssid, ent_i)) {
                ent_sets.pt.add(point_i);
            }
        }
    }
    return ent_sets;
}
