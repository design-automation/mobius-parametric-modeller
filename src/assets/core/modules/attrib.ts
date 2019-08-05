/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * ~
 * ~
 */

/**
 *
 */

import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, EEntType, ESort, TEntTypeIdx,
    EAttribPush, TAttribDataTypes} from '@libs/geo-info/common';
import { idsMake, getArrDepth, isEmptyArr } from '@libs/geo-info/id';
import { checkIDs, IDcheckObj } from './_check_args';

// ================================================================================================
export enum _EEntTypeEnum {
    POSI =   'positions',
    VERT =   'vertices',
    EDGE =   'edges',
    WIRE =   'wires',
    FACE =   'faces',
    POINT =  'points',
    PLINE =  'polylines',
    PGON =   'polygons',
    COLL =   'collections'
    // ,
    // OBJS =   'objects',
    // TOPOS =  'topologies',
    // ALL =    'all'
}
function _entType(select: _EEntTypeEnum): EEntType|EEntType[] {
    switch (select) {
        case _EEntTypeEnum.POSI:
            return EEntType.POSI;
        case _EEntTypeEnum.VERT:
            return EEntType.VERT;
        case _EEntTypeEnum.EDGE:
            return EEntType.EDGE;
        case _EEntTypeEnum.WIRE:
            return EEntType.WIRE;
        case _EEntTypeEnum.FACE:
            return EEntType.FACE;
        case _EEntTypeEnum.POINT:
            return EEntType.POINT;
        case _EEntTypeEnum.PLINE:
            return EEntType.PLINE;
        case _EEntTypeEnum.PGON:
            return EEntType.PGON;
        case _EEntTypeEnum.COLL:
            return EEntType.COLL;
        // case _EEntTypeEnum.OBJS:
        //     return [
        //         EEntType.POINT,
        //         EEntType.PLINE,
        //         EEntType.PGON
        //     ];
        // case _EEntTypeEnum.TOPOS:
        //     return [
        //         EEntType.VERT,
        //         EEntType.EDGE,
        //         EEntType.WIRE,
        //         EEntType.FACE
        //     ];
        // case _EEntTypeEnum.ALL:
        //     return [
        //         EEntType.POSI,
        //         EEntType.VERT,
        //         EEntType.EDGE,
        //         EEntType.WIRE,
        //         EEntType.FACE,
        //         EEntType.POINT,
        //         EEntType.PLINE,
        //         EEntType.PGON,
        //         EEntType.COLL
        //     ];
        default:
            throw new Error('Query select parameter not recognised.');
    }
}
// ================================================================================================
// ================================================================================================
// These are used by Get(), Search(), Neighbor()
export enum _EEntTypeSelect {
    POSI =   'positions',
    VERT =   'vertices',
    EDGE =   'edges',
    WIRE =   'wires',
    FACE =   'faces',
    POINT =  'points',
    PLINE =  'polylines',
    PGON =   'polygons',
    COLL =   'collections',
}
function _convertSelectToEEntType(select: _EEntTypeSelect): EEntType {
    switch (select) {
        case _EEntTypeSelect.POSI:
            return EEntType.POSI;
        case _EEntTypeSelect.VERT:
            return EEntType.VERT;
        case _EEntTypeSelect.EDGE:
            return EEntType.EDGE;
        case _EEntTypeSelect.WIRE:
            return EEntType.WIRE;
        case _EEntTypeSelect.FACE:
            return EEntType.FACE;
        case _EEntTypeSelect.POINT:
            return EEntType.POINT;
        case _EEntTypeSelect.PLINE:
            return EEntType.PLINE;
        case _EEntTypeSelect.PGON:
            return EEntType.PGON;
        case _EEntTypeSelect.COLL:
            return EEntType.COLL;
        default:
            throw new Error('Query select parameter not recognised.');
    }
}
// ================================================================================================
// ================================================================================================
/**
 * Add an attribute to the model.
 * The attribute will appear as a new column in the attribute table.
 * All attribute values will be set to null.
 * ~
 * @param __model__
 * @param name The attribute name.
 * @param ent_type Enum, the attribute entity type.
 * @param template The template for the attribute. For example, 123 or "abc" or [1,2,3] or ["a", "b", "c"].
 * @returns True if the attribute was added. False otherwise.
 */
export function Add(__model__: GIModel, name: string, ent_type: _EEntTypeSelect, template: TAttribDataTypes): boolean {
    console.log('calling add attrib');
    return true;
}
// ================================================================================================
/**
 * Delete an attribute from the model.
 * The column in the attribute table will be deleted.
 * All values will also be deleted.
 * ~
 * @param __model__
 * @param name The attribute name.
 * @param ent_type Enum, the attribute entity type.
 * @returns True if the attribute was deleted. False otherwise.
 */
export function Delete(__model__: GIModel, name: string, ent_type: _EEntTypeSelect): boolean {
    console.log('calling delete attrib');
    return true;
}
// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * ~
 * @param __model__
 * @param old_name The old attribute name.
 * @param new_name The old attribute name.
 * @param ent_type Enum, the attribute entity type.
 * @returns True if the attribute was renamed. False otherwise.
 */
export function Rename(__model__: GIModel, old_name: string, new_name: string, ent_type: _EEntTypeSelect): boolean {
    console.log('calling rename attrib');
    return true;
}
// ================================================================================================
/**
 * Set an attribute value for one or more entities.
 * ~
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param name The attribute name.
 * @param value The attribute value.
 * @returns True if the attribute value was set successully for all entities. False otherwise.
 */
export function Set(__model__: GIModel, entities: TId|TId[], name: string, value: TAttribDataTypes): boolean {
    console.log('calling set attrib');
    return true;
}
// ================================================================================================
/**
 * Get attribute values for one or more entities.
 * ~
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param name The attribute name.
 * @returns One attribute value, or a list of attribute values.
 */
export function Get(__model__: GIModel, entities: TId|TId[], name: string): TAttribDataTypes|TAttribDataTypes[] {
    console.log('calling get attrib');
    return [];
}
// ================================================================================================
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * ~
 * The push expression defines the source and target for pushing the attribute from source to target.
 * ~
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param name The attribute name, can be one or two names.
 * @param ent_type_enum
 * @param method_enum Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 * @returns True if the attribte was successfully pushed for all entities. False otherwise.
 */
export function Push(__model__: GIModel, entities: TId|TId[],
        name: string|[string, string], ent_type_enum: _EEntTypeEnum, method_enum: _EPushMethod): boolean {
    console.log('calling push attrib');
    return true;
}
export enum _EPushMethod {
    FIRST = 'first',
    LAST = 'last',
    AVERAGE = 'average',
    MEDIAN = 'median',
    SUM = 'sum',
    MIN = 'min',
    MAX = 'max'
}
function _convertPromoteMethod(selection: _EPushMethod): EAttribPush {
    switch (selection) {
        case _EPushMethod.AVERAGE:
            return EAttribPush.AVERAGE;
        case _EPushMethod.MEDIAN:
            return EAttribPush.MEDIAN;
        case _EPushMethod.SUM:
            return EAttribPush.SUM;
        case _EPushMethod.MIN:
            return EAttribPush.MIN;
        case _EPushMethod.MAX:
            return EAttribPush.MAX;
        case _EPushMethod.FIRST:
            return EAttribPush.FIRST;
        case _EPushMethod.LAST:
            return EAttribPush.LAST;
        default:
            break;
    }
}
// ================================================================================================
