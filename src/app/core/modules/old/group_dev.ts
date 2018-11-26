import * as gs from "gs-json";

/**
 * Checks if a group contains a specified geometry
 * @param group Group to check
 * @param geom Geometry to check
 * @returns True if group contains geometry, false if group does not contain geometry
 */
export function contains(group_name: string, geom: gs.IEnt | gs.ITopo): boolean {
    const model: gs.IModel = geom[0].getModel();
    const group: gs.IGroup = model.getGroup(group_name);
    switch (geom.getGeomType()) {
        case gs.EGeomType.points:
            return group.hasPoint(geom as gs.IPoint);
        case gs.EGeomType.objs:
            return group.hasObj(geom as gs.IObj);
        default:
            return group.hasTopo(geom as gs.ITopo);
    }
}

/**
 * Sets the name of a group
 * @param group Group
 * @param name New name of group
 * @returns Old name of specified group
 */
export function setName(group: gs.IGroup, name: string ): string {
    return group.setName(name);
}

/**
 * Gets the name of a group
 * @param group Group
 * @returns Name of specified group
 */
export function getName(group: gs.IGroup): string {
    return group.getName();
}

/**
 * Add geometry to a group
 *
 * Returns null if objects is already present in group
 * @param group Group to add to
 * @param geom Geometry to add, can be IPoint, IObj, or ITopo
 * @returns True if successful, null if unsuccessful or on error
 */
export function addGeom(group: gs.IGroup, geom: gs.IPoint | gs.IObj | gs.ITopo): boolean {
    switch (geom.getGeomType()) {
        case gs.EGeomType.points:
            return group.addPoint(geom as gs.IPoint);
        case gs.EGeomType.objs:
            return group.addObj(geom as gs.IObj);
        default:
            //return group.addTopo(geom as gs.ITopo); TODO
    }
}

/**
 * Remove geometry from a group
 *
 * Returns null if specified geometry cannot be found in specified group
 * @param group Group
 * @param geom Geometry to remove,  can be IPoint, IObj, or ITopo
 * @returns True if successful, null if unsuccessfull or on error
 */
export function removeGeom(group: gs.IGroup, geom: gs.IPoint | gs.IObj | gs.ITopo): boolean {
    switch (geom.getGeomType()) {
        case gs.EGeomType.points:
            return group.removePoint(geom as gs.IPoint);
        case gs.EGeomType.objs:
            return group.removeObj(geom as gs.IObj);
        default:
            //return group.removeTopo(geom as gs.ITopo); TODO
    }
}
