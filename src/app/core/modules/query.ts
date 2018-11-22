/**
 * Query functions check if an entity fufils certain conditions.
 */

/**
 *
 */

import * as gs from "gs-json";

//  ===============================================================================================================
//  Query Functions ===============================================================================================
//  ===============================================================================================================

/**
 *
 */

const x = "temp";

export module Query{
    /**
     * assign properties to a certain value in the model
     * @param __model__  Model of the node.
     * @param indices  indices of the value to set properties with.
     * @param statement  properties to be added to the value.
     * @returns void
     */
    export function set(__model__: any[], indices: number[], statement: string): void{
        let properties: any = statement.split('&');
        properties = properties.map(prop => {
            let property = prop.trim().substring(1).split('=');
            property[0] =  property[0].trim();
            property[1] =  property[1].trim();
            property[1] =  property[1].substring(1,property[1].length-1).trim();
            return property
        });
        for (let index of indices){
            if (index > __model__.length) {
                return
            } 
            for (let property of properties){
                __model__[index]["properties"][property[0]] = property[1];
            }
        }
    }

    /**
     * get a list of indices of the values that have certain properties
     * @param __model__  Model of the node.
     * @param statement  properties to be added to the value.
     * @returns list of indices
     */
    export function get(__model__: JSON[], statement: string): number[]{
        let property: any = statement.substring(1);
        if (property.indexOf('==') != -1){
            property = property.split('==');
            property[0] =  property[0].trim();
            property[1] =  property[1].trim();
            property[1] =  property[1].substring(1,property[1].length-1).trim();
    
            let result = [];
            
            for (let i = 0; i < __model__.length; i++){
                if (__model__[i]["properties"][property[0]] == property[1]){
                    result.push(i)
                }
            }
            return result
        } else if (property.indexOf('!=') != -1) {
            property = property.split('!=');
            property[0] =  property[0].trim();
            property[1] =  property[1].trim();
            property[1] =  property[1].substring(1,property[1].length-1).trim();
    
            let result = [];
            
            for (let i = 0; i < __model__.length; i++){
                if (__model__[i]["properties"][property[0]] != property[1]){
                    result.push(i)
                }
            }
            return result
        /*
        } else if (property.indexOf('>=') != -1) {
            property = property.split('>=');
            property[1] =  property[1].substring(1,property[1].length-1)
    
            let result = [];
            
            for (let i = 0; i < __model__.length; i++){
                if (__model__[i]["properties"][property[0]] >= property[1]){
                    result.push(i)
                }
            }
            return result
        } else if (property.indexOf('<=') != -1) {
            property = property.split('<=');
            property[1] =  property[1].substring(1,property[1].length-1)
    
            let result = [];
            
            for (let i = 0; i < __model__.length; i++){
                if (__model__[i]["properties"][property[0]] <= property[1]){
                    result.push(i)
                }
            }
            return result
        */
        }
    }

}
