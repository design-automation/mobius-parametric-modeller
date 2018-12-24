import { EEntityTypeStr, EQueryOperatorTypes, IQueryComponent  } from './common';
/**
 * Parse the attribute value. Handles sting with quotes, e.g. 'this' and "that".
 * Remove quotes from value string
 */
function _parse_value_str(value_str: string): string {
    const first_char: string = value_str.slice(0, 1);
    if (first_char ===  '\'' || first_char === '"') {return value_str.slice(1, -1); }
    return value_str;
}
/**
 * Parese the attribute name. Handles names with indexes, e.g. 'name[2]'
 * Split the name into the string name and the numeric index
 */
function _parse_name_str(value_str: string): [string, number?] {
    const last_char: string = value_str.slice(-1);
    if (last_char === ']') {
        const [name_str, index_str]: [string, string] = value_str.slice(0, -1).split('[') as [string, string];
        const index: number = Number(index_str);
        if (isNaN(index)) {throw new Error('Bad query'); }
        return [name_str, index];
    }
    return [value_str, null];
}
/**
 * Parse a query component string.
 */
function _parse_query_component(query_component: string): IQueryComponent {
    let attrib_name_str = '' ;
    let attrib_value_str = '' ;
    let operator_type: EQueryOperatorTypes = null;
    let attrib_type: EEntityTypeStr = null;
    // split the query at the @ sign
    const [attrib_type_str, attrib_name_value_str]: string[] = query_component.split('@');
    if (!attrib_name_value_str) { throw new Error('Bad query.'); }
    // get the attrib_type
    for (const key of Object.keys(EEntityTypeStr)) {
        if (attrib_type_str === EEntityTypeStr[key]) {
            attrib_type = EEntityTypeStr[key];
            break;
        }
    }
    //  check
    if (!attrib_type) { throw new Error('Bad query.'); }
    // split the attrib_name_value_str based on operator, ==, !=, etc...
    for (const key of Object.keys(EQueryOperatorTypes)) {
        const split_query = attrib_name_value_str.split(EQueryOperatorTypes[key]);
        if (split_query.length === 2) {
            attrib_name_str =  split_query[0];
            attrib_value_str = split_query[1];
            operator_type = EQueryOperatorTypes[key];
            break;
        }
    }
    // check
    if (!attrib_name_str) {throw new Error('Bad query.'); }
    if (!attrib_value_str) {throw new Error('Bad query.'); }
    if (!operator_type) {throw new Error('Bad query.'); }
    // parse the name
    const attrib_name_index = _parse_name_str(attrib_name_str);
    const attrib_name  = attrib_name_index[0];
    const attrib_index  = attrib_name_index[1];
    // parse the value
    attrib_value_str = _parse_value_str(attrib_value_str);
    // return the data for the query component as an object
    return {
        attrib_type: attrib_type,
        attrib_name: attrib_name,
        attrib_index: attrib_index,
        attrib_value_str: attrib_value_str,
        operator_type: operator_type
    };
}
/**
 * Parse a query string.
 */
export function parse_query(query_str: string): IQueryComponent[][] {
    if (!query_str.startsWith('#')) {throw new Error('Bad query.'); }
    const query_str_clean: string = query_str.replace(/\s/g, '').slice(1);
    const and_query_strs: string[] = query_str_clean.split('&&');
    const query_list: IQueryComponent[][] = [];
    and_query_strs.forEach(and_query_str => {
        const or_query_strs: string[] = and_query_str.split('||');
        query_list.push(or_query_strs.map( or_query_str => _parse_query_component(or_query_str) ) );
    });
    return query_list;
}
