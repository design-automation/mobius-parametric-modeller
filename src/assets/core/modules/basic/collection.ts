/**
 * The `collections` module has functions for creating and modifying collections.
 */

/**
 *
 */
import { checkIDs, ID } from '../_check_ids';
import { checkArgs, ArgCh } from '../_check_args';

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, EEntType, TEntTypeIdx, EFilterOperatorTypes, EAttribNames } from '@libs/geo-info/common';
import { idsMake, getArrDepth, isEmptyArr, idsBreak, idMake, idsMakeFromIdxs } from '@assets/libs/geo-info/common_id_funcs';
// import { __merge__} from '../_model';
// import { _model } from '..';
import { arrMakeFlat } from '@libs/util/arrs';

// ================================================================================================
/**
 * Adds one or more new collections to the model.
 * \n
 * If the list of entities contains other collections, these other collections will then become
 * children of the new collection that will be created.
 * \n
 * @param __model__
 * @param entities List or nested lists of points, polylines, polygons, and other colletions.
 * @param name The name to give to this collection, resulting in an attribute called `name`. If `null`, no attribute will be created.
 * @returns Entities, new collection, or a list of new collections.
 * @example collection1 = collection.Create([point1,polyine1,polygon1], 'my_coll')
 * @example_info Creates a collection containing point1, polyline1, polygon1, with an attribute `name = 'my_coll'`.
 * @example collections = collection.Create([[point1,polyine1],[polygon1]], ['coll1', 'coll2'])
 * @example_info Creates two collections, the first containing point1 and polyline1, the second containing polygon1.
 */
export function Create(__model__: GIModel, entities: TId|TId[]|TId[][], name: string|string[]): TId|TId[] {
    // --- Error Check ---
    const fn_name = 'collection.Create';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL, ID.isIDLL],
            [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        checkArgs(fn_name, 'name', name, [ArgCh.isStr, ArgCh.isStrL]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list],
        //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ent_arrs: TEntTypeIdx|TEntTypeIdx[] = _create(__model__, ents_arr);
    // set the name
    if (name !== null) {
        let colls_i: number[] = [];
        if (Array.isArray(new_ent_arrs[0])) {
            colls_i = (new_ent_arrs as TEntTypeIdx[]).map( new_ent_arr => new_ent_arr[1] as number);
        } else {
            colls_i = [new_ent_arrs[1] as number];
        }
        if (Array.isArray(name)) {
            if (name.length !== colls_i.length) {
                throw new Error(fn_name +
                    ': The list of collection names must be equal in length to the list of collections that get created.');
            }
            for (let i = 0; i < name.length; i++) {
                __model__.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, colls_i[i], EAttribNames.COLL_NAME, name[i]);
            }
        } else {
            __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.COLL, colls_i, EAttribNames.COLL_NAME, name);
        }
    }
    // return the collection id
    return idsMake(new_ent_arrs) as TId|TId[];
}
function _create(__model__: GIModel, ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][]): TEntTypeIdx | TEntTypeIdx[] {
    const ssid: number = __model__.modeldata.active_ssid;
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    } else if (depth === 3) {
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _create(__model__, ents_arr_item)) as TEntTypeIdx[];
    }
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const child_colls_i: number[] = [];
    for (const ent_arr of ents_arr) {
        if (ent_arr[0] === EEntType.POSI) { points_i.push(ent_arr[1]); }
        if (ent_arr[0] === EEntType.PLINE) { plines_i.push(ent_arr[1]); }
        if (ent_arr[0] === EEntType.PGON) { pgons_i.push(ent_arr[1]); }
        if (ent_arr[0] === EEntType.COLL) { child_colls_i.push(ent_arr[1]); }
    }
    // create the collection, setting tha parent to -1
    const coll_i: number = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, child_colls_i);
    // return the new collection
    return [EEntType.COLL, coll_i];
}
// ================================================================================================
/**
 * Get one or more collections from the model, given a name or list of names.
 * Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.
 * \n
 * The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
 * For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.
 * \n
 * If a single collection is found, the collection will be returned as a single item (not a list).
 * This is a convenience so that there is no need to get the first item out of the returned list.
 * \n
 * If no collections are found, then an empty list is returned.
 * \n
 * @param __model__
 * @param names A name or list of names. May include wildcards, '?' and '*'.
 * @returns The collection, or a list of collections.
 */
export function Get(__model__: GIModel, names: string|string[]): TId|TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'collection.Get';
        checkArgs(fn_name, 'names', names, [ArgCh.isStr, ArgCh.isStrL]);
    }
    // --- Error Check ---
    const colls_i: number[] = _get(__model__, names);
    if (colls_i.length === 0) {
        return []; // return an empty list
    } else if (colls_i.length === 1) {
        return idMake(EEntType.COLL, colls_i[0]) as TId;
    }
    return idsMakeFromIdxs(EEntType.COLL, colls_i) as TId[];
    // return idsMake(colls_i.map(coll_i => [EEntType.COLL, coll_i]) as TEntTypeIdx[]) as TId[];
}
function _get(__model__: GIModel, names: string|string[]): number[] {
    if (!Array.isArray(names)) {
        // wildcards
        if (names.indexOf('*') !== -1 || names.indexOf('?') !== -1) {
            const reg_exp = new RegExp(names.replace('?', '\\w').replace('*', '\\w*'));
            const all_colls_i: number[] = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.COLL);
            const all_names: string[] = all_colls_i.map( coll_i =>
                __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME) as string
            );
            const unique_names: string[] = Array.from(new Set(all_names));
            const match_names: string[] = [];
            for (const name1 of unique_names) {
                if (reg_exp.test(name1)) { match_names.push(name1); }
            }
            return _get(__model__, match_names);
        }
        const colls_i: number[] = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.COLL);
        const query_result: number[] = __model__.modeldata.attribs.query.filterByAttribs(
            EEntType.COLL, colls_i, EAttribNames.COLL_NAME, null, EFilterOperatorTypes.IS_EQUAL, names);
        return query_result;
    } else {
        const all_colls_i: number[] = [];
        for (const name1 of names) {
            for (const coll_i of _get(__model__, name1)) {
                all_colls_i.push(coll_i);
            }
        }
        return all_colls_i;
    }
}
// ================================================================================================
/**
 * Addes entities to a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add.
 * @returns void
 */
export function Add(__model__: GIModel, coll: TId, entities: TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'collection.Add';
        let coll_arr;
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            coll_arr = checkIDs(__model__, fn_name, 'coll', coll, [ID.isID], [EEntType.COLL]) as TEntTypeIdx;
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL],
                [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        } else {
            // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            coll_arr = idsBreak(coll) as TEntTypeIdx;
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        _collectionAdd(__model__, coll_arr[1], ents_arr);
    }
}

function _collectionAdd(__model__: GIModel, coll_i: number, ents_arr: TEntTypeIdx[]): void {
    const ssid: number = __model__.modeldata.active_ssid;
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const colls_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POINT:
                points_i.push(ent_i);
                break;
            case EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case EEntType.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error adding entities to a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, colls_i);
}
// ================================================================================================
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
export function Remove(__model__: GIModel, coll: TId, entities: TId|TId[]): void {
    // --- Error Check ---
    const fn_name = 'collection.Remove';
    let ents_arr: TEntTypeIdx[] = null;
    let coll_arr;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL],
                [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        }
        coll_arr = checkIDs(__model__, fn_name, 'coll', coll, [ID.isID], [EEntType.COLL]) as TEntTypeIdx;
    } else {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
        coll_arr = idsBreak(coll) as TEntTypeIdx;
    }
    // --- Error Check ---
    if (ents_arr === null) {
        _collectionEmpty(__model__, coll_arr[1]);
    } else {
        _collectionRemove(__model__, coll_arr[1], ents_arr);
    }
}
function _collectionRemove(__model__: GIModel, coll_i: number, ents_arr: TEntTypeIdx[]): void {
    const ssid: number = __model__.modeldata.active_ssid;
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const colls_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POINT:
                points_i.push(ent_i);
                break;
            case EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case EEntType.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error removing entities from a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
function _collectionEmpty(__model__: GIModel, coll_i: number): void {
    const ssid: number = this.modeldata.active_ssid;
    const points_i: number[] = __model__.modeldata.geom.nav.navCollToPoint(coll_i);
    const plines_i: number[] = __model__.modeldata.geom.nav.navCollToPline(coll_i);
    const pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(coll_i);
    const colls_i: number[] = __model__.modeldata.geom.nav.navCollToCollChildren(coll_i);
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
// ================================================================================================
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
export function Delete(__model__: GIModel, coll: TId|TId[]): void {
    coll = arrMakeFlat(coll) as TId[];
    // --- Error Check ---
    const fn_name = 'collection.Delete';
    let colls_arrs;
    if (__model__.debug) {
        colls_arrs = checkIDs(__model__, fn_name, 'coll', coll, [ID.isIDL], [EEntType.COLL]) as TEntTypeIdx[];
    } else {
        // colls_arrs = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isIDList], [EEntType.COLL]) as TEntTypeIdx[];
        colls_arrs = idsBreak(coll) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const colls_i: number[] = [];
    for (const [ent_type, ent_i] of colls_arrs) {
        colls_i.push(ent_i);
    }
    __model__.modeldata.geom.snapshot.delColls(__model__.modeldata.active_ssid, colls_i);
}
// ================================================================================================

