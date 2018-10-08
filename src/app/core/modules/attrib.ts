/**
 * Attributes are properties assigned to each object.
 */

import * as gs from "gs-json";

//  ===============================================================================================================
//  Attrib Get ====================================================================================================
//  ===============================================================================================================

/**
 * Gets attribute that apply for a specified geometry type from a model
 * @param model Model to get attribute from
 * @param name The attribute name
 * @param geom_type Type of geometry to get attribute from
 * @returns List of attributes
 */
export function Get(model: gs.IModel, name: string, geom_type: gs.EGeomType): gs.IAttrib {
    switch (geom_type) {
        case gs.EGeomType.points: case gs.EGeomType.objs:
            return model.getEntAttrib(name, geom_type);
        default:
            return model.getTopoAttrib(name, geom_type);
    }
}

/**
 * Gets all entity attribs
 * @param model Model to get attribute from
 * @returns List of attributes
 */
export function getAll(model: gs.IModel): gs.IAttrib[] {
    return [...model.getAllEntAttribs(), ...model.getAllTopoAttribs()];
}

/**
 * Gets all entity attribs
 * @param model Model to get attribute from
 * @returns List of attributes
 */
export function getAllEnts(model: gs.IModel): gs.IAttrib[] {
    return model.getAllEntAttribs();
}

/**
 * Gets all topo attribs
 * @param model Model to get attribute from
 * @returns List of attributes
 */
export function getAllTopos(model: gs.IModel): gs.IAttrib[] {
    return model.getAllTopoAttribs();
}

//  ===============================================================================================================
//  Attrib Constructors ===========================================================================================
//  ===============================================================================================================

/**
 * Adds an attribute to a model
 * @param model Model to add to
 * @param name Name of new attribute
 * @param geom_type Type of geometry to add to
 * @param geom_type Data type for attribute values. (number, string, boolean, number[], string[], boolean[])
 * @returns New attribute
 */
export function Create(model: gs.IModel, name: string, geom_type: gs.EGeomType,
                       data_type: gs.EDataType): gs.IAttrib {
    switch (geom_type) {
        case gs.EGeomType.points: case gs.EGeomType.objs:
            return model.addEntAttrib(name, geom_type, data_type);
        default:
            return model.addTopoAttrib(name, geom_type, data_type);
    }
}

//  ===============================================================================================================
//  Attrib Functions ==============================================================================================
//  ===============================================================================================================

/**
 * Deletes an attribute
 * @param attrib Attribute to delete
 * @returns True if successful
 */
export function del(attrib: gs.IAttrib): boolean {
    return attrib.getModel().delAttrib(attrib);
}

/**
 * Gets the name of an attribute
 * @param attrib Attribute to get name of
 * @returns Name of specified attribute
 */
export function getName(attrib: gs.IAttrib): string {
    return attrib.getName();
}

/**
 * Sets the name of an attribute
 * @param attrib Attribute to set name
 * @param name New name of attribute
 * @returns Old name of specified attribute
 */
export function setName(attrib: gs.IAttrib, name: string ): string {
    return attrib.setName(name);
}

// TODO - see if these set and get methods can be combined

/**
 * Gets the value of a ent attribute for a specified geometry
 * @param attrib Attribute
 * @param ent Geometry
 * @returns Value of attribute
 */
export function getEntValue(attrib: gs.IEntAttrib, ent:gs.IPoint | gs.IObj): any {
    return ent.getAttribValue(attrib);
}

/**
 * Sets the value of a ent attribute for a specified geometry
 * @param attrib Attribute
 * @param ent Geometry
 * @param value New value of attribute
 * @returns Old value of specified attribute
 */
export function setEntValue(attrib: gs.IEntAttrib, ent: gs.IPoint | gs.IObj, value: any ): any {
    return ent.setAttribValue(attrib, value);
}

/**
 * Gets the value of a topo attribute for a specified geometry
 * @param attrib Attribute
 * @param topo Geometry
 * @returns Value of attribute
 */
export function getTopoValue(attrib: gs.ITopoAttrib, topo:gs.ITopo): any {
    return topo.getAttribValue(attrib);
}

/**
 * Sets the value of a topo attribute for a specified geometry
 * @param attrib Attribute
 * @param topo Geometry
 * @param value New value of attribute
 * @returns Old value of specified attribute
 */
export function setTopoValue(attrib: gs.ITopoAttrib, topo: gs.ITopo, value: any ): any {
    return topo.setAttribValue(attrib, value);
}
