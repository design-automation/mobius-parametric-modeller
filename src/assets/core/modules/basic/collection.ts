/**
 * The `collections` module has functions for creating and modifying collections.
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, EEntType, TEntTypeIdx, EFilterOperatorTypes } from '@libs/geo-info/common';
import { isPoint, isPline, isPgon, isColl, idsMake, getArrDepth, isEmptyArr } from '@libs/geo-info/id';
import { __merge__} from '../_model';
import { _model } from '..';
import { checkArgTypes, checkIDs, IDcheckObj, TypeCheckObj } from '../_check_args';
import { arrMakeFlat } from '@libs/util/arrs';

// ================================================================================================
/**
 * Adds one or more new collections to the model.
 * ~
 * If the list of entities contains other collections, these other collections will then become
 * children of the new collection that will be created.
 * ~
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
    const ents_arr = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDList_list],
        [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    checkArgTypes(fn_name, 'name', name, [TypeCheckObj.isString, TypeCheckObj.isStringList]);
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
                __model__.attribs.add.setAttribVal(EEntType.COLL, colls_i[i], 'name', name[i]);
            }
        } else {
            __model__.attribs.add.setAttribVal(EEntType.COLL, colls_i, 'name', name);
        }
    }
    // return the collection id
    return idsMake(new_ent_arrs) as TId|TId[];
}
function _create(__model__: GIModel, ents_arr: TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][]): TEntTypeIdx | TEntTypeIdx[] {
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
        if (isPoint(ent_arr[0])) { points_i.push(ent_arr[1]); }
        if (isPline(ent_arr[0])) { plines_i.push(ent_arr[1]); }
        if (isPgon(ent_arr[0])) { pgons_i.push(ent_arr[1]); }
        if (isColl(ent_arr[0])) { child_colls_i.push(ent_arr[1]); }
    }
    // create the collection, setting tha parent to -1
    const coll_i: number = __model__.geom.add.addColl(-1, points_i, plines_i, pgons_i);
    // set the parents
    for (const child_coll_i of child_colls_i) {
        __model__.geom.modify.setCollParent(child_coll_i, coll_i);
    }
    // return the new collection
    return [EEntType.COLL, coll_i];
}
// ================================================================================================
/**
 * Get a collection from the model, given the `name` attribute.
 * ~
 * @param __model__
 * @param names The name of the collection to get.
 * @returns The collection, or a list of collections.
 */
export function Get(__model__: GIModel, names: string|string[]): TId|TId[] {
    // --- Error Check ---
    const fn_name = 'collection.Get';
    checkArgTypes(fn_name, 'names', names, [TypeCheckObj.isString, TypeCheckObj.isStringList]);
    // --- Error Check ---
    const new_ent_arrs: TEntTypeIdx | TEntTypeIdx[] = _get(__model__, names);
    return idsMake(new_ent_arrs) as TId|TId[];
}
function _get(__model__: GIModel, names: string|string[]): TEntTypeIdx | TEntTypeIdx[] {
    if (!Array.isArray(names)) {
        const colls_i: number[] = __model__.geom.query.getEnts(EEntType.COLL, false);
        const query_result: number[] = __model__.attribs.query.filterByAttribs(
            EEntType.COLL, colls_i, 'name', null, EFilterOperatorTypes.IS_EQUAL, names);
        if (query_result.length > 0) {
            return [EEntType.COLL, query_result[0]];
        }
        return [];
    } else {
        return names.map(name => _get(__model__, name)) as TEntTypeIdx[];
    }
}
// ================================================================================================
/**
 * Addes entities to a collection.
 * ~
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
        const coll_arr = checkIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        // --- Error Check ---
        _collection(__model__, coll_arr, ents_arr, _EModifyCollectionMethod.ADD_ENTITIES);
    }
}
// ================================================================================================
/**
 * Removes entities from a collection.
 * ~
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add.
 * @returns void
 */
export function Remove(__model__: GIModel, coll: TId, entities: TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'collection.Remove';
        const coll_arr = checkIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
        const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
            [IDcheckObj.isID, IDcheckObj.isIDList],
            [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        // --- Error Check ---
        _collection(__model__, coll_arr, ents_arr, _EModifyCollectionMethod.REMOVE_ENTITIES);
    }
}
// ================================================================================================
// /**
//  * Set the parent of a collection.
//  * ~
//  * @param __model__
//  * @param coll The collection to be updated.
//  * @param entities The parent collection.
//  * @returns void
//  */
// export function Parent(__model__: GIModel, coll: TId, parent: TId): void {
//     parent = arrMakeFlat(parent) as TId[];
//     if (!isEmptyArr(parent)) {
//         // --- Error Check ---
//         const fn_name = 'collection.Parent';
//         const coll_arr = checkIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
//         const ents_arr: TEntTypeIdx[] = checkIDs(fn_name, 'parent', parent,
//             [IDcheckObj.isID, IDcheckObj.isIDList],
//             [EEntType.COLL]) as TEntTypeIdx[];
//         // --- Error Check ---
//         _collection(__model__, coll_arr, ents_arr, _EModifyCollectionMethod.SET_PARENT_ENTITY);
//     }
// }
// ================================================================================================
export enum _EModifyCollectionMethod {
    SET_PARENT_ENTITY = 'set_parent',
    ADD_ENTITIES = 'add_entities',
    REMOVE_ENTITIES = 'remove_entities'
}
function _collection(__model__: GIModel, coll_arr: TEntTypeIdx, ents_arr: TEntTypeIdx[], method: _EModifyCollectionMethod): void {
    const [_, coll_i]: TEntTypeIdx = coll_arr;
    if (method === _EModifyCollectionMethod.SET_PARENT_ENTITY) {
        if (ents_arr.length !== 1) {
            throw new Error('Error setting collection parent. A collection can only have one parent.');
        }
        const [parent_ent_type, parent_coll_i]: TEntTypeIdx = ents_arr[0];
        if (parent_ent_type !== EEntType.COLL) {
            throw new Error('Error setting collection parent. The parent must be another collection.');
        }
        __model__.geom.modify.setCollParent(coll_i, parent_coll_i);
        return;
    }
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
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
            default:
                throw new Error('Error modifying collection. A collection can only contain points, polylines, and polygons.');
        }
    }
    if (method === _EModifyCollectionMethod.ADD_ENTITIES) {
        __model__.geom.modify.collAddEnts(coll_i, points_i, plines_i, pgons_i);
    } else { // Remove entities
        __model__.geom.modify.collRemoveEnts(coll_i, points_i, plines_i, pgons_i);
    }
}
// ================================================================================================
