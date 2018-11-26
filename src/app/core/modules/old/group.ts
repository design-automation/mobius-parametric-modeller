/**
 * Functions for working with groups.
 */

/**
 * Groups are collections of geometric objects, points, and topos.
 * Each group is identified by a unique name.
 * Groups can have a parent group, thereby allowing a herarchy of groups to be created.
 * If the parent group is null, then the group is assumed to be a top level group.
 *
 * Groups can have properties, which are key-value pairs.
 */

import * as gs from "gs-json";

//  ===============================================================================================================
//  Group Get =====================================================================================================
//  ===============================================================================================================

/**
 * Gets the names of all the groups in the model.
 *
 * @param model Model to get group names from.
 * @returns List of group names
 */
export function GetNames(model: gs.IModel): string[] {
    return model.getAllGroups().map((group) => group.getName());
}

//  ===============================================================================================================
//  Group Constructors ============================================================================================
//  ===============================================================================================================

/**
 * Creates a new group.
 *
 * @param model Model to create group in.
 * @param name Group name.
 * @returns Ture if the group was successfully created.
 */
export function Create(model: gs.IModel, name: string): boolean {
    if (model.getGroup(name) !== null) {throw new Error("Group already exists.");}
    const group: gs.IGroup = model.addGroup(name);
    if (group === undefined) {return false;}
    return true;
}

/**
 * Creates a set of new groups.
 *
 * @param model Model to create groups in.
 * @param name List of group names.
 * @returns Ture if all groups were successfully created.
 */
export function Creates(model: gs.IModel, names: string[]): boolean {
    let ok: boolean = true;
    for (const name of names) {
        if (model.getGroup(name) !== null) {throw new Error("Group already exists.");}
        const group: gs.IGroup = model.addGroup(name);
        if (group === undefined) {ok = false;}
    }
    return ok;
}

//  ===============================================================================================================
//  Group Functions ===============================================================================================
//  ===============================================================================================================

/**
 * Deletes a group from the model.
 *
 * @param model Model containing the groups.
 * @param group_name Group name to delete.
 * @param delete_geom If true, the objects and points in the group will be deleted.
 * @returns True if the group was successfully deleted.
 */
export function del(model: gs.IModel, group_name: string, delete_geom: boolean): boolean {
    const group: gs.IGroup = model.getGroup(group_name);
    if (group === null) {throw new Error("Group does not exist.");}
    if (delete_geom) {
        model.getGeom().delObjs(group.getObjs(), false);
        model.getGeom().delPoints(group.getPoints());
    }
    return group.getModel().delGroup(group);
}

/**
 * Gets the parent of a group.
 * Returns null if specified group does not have a parent group.
 *
 * @param model Model containing the groups.
 * @param group_name Group name to get parent from.
 * @returns Parent group of specified group if successful, null if unsuccessful or on error
 */
export function getParent(model: gs.IModel, group_name: string): string {
    const group: gs.IGroup = model.getGroup(group_name);
    if (group === null) {throw new Error("Group does not exist.");}
    return group.getParentGroup().getName();
}

/**
 * Sets the parent of a group.
 *
 * @param model Model containing the groups.
 * @param group_name Group name to set parent for.
 * @param parent_name Group name of parent.
 * @returns The old parent.
 */
export function setParent(model: gs.IModel, group_name: string, parent_name: string): string {
    const group: gs.IGroup = model.getGroup(group_name);
    const parent: gs.IGroup = model.getGroup(parent_name);
    if (group === null) {throw new Error("Group does not exist.");}
    if (parent === null) {throw new Error("Group does not exist.");}
    return group.setParentGroup(parent).getName();
}

/**
 * Gets the list of names of groups that are children of this group.
 * Returns empty list if specified group does not have any children.
 *
 * @param model Model containing the groups.
 * @param group_name Group name to get children from.
 * @returns A list of group names.
 */
export function getChildren(model: gs.IModel, group_name: string): string[] {
    const group: gs.IGroup = model.getGroup(group_name);
    if (group === null) {throw new Error("Group does not exist.");}
    return group.getChildGroups().map((group) => group.getName());
}
