import { EEntType, EAttribNames, TEntTypeIdx } from '@libs/geo-info/common';
// import { isDim0, isDim1, isDim2 } from '@libs/geo-info/id';
import { idsBreak } from '@libs/geo-info/id';

// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
function isValidName(fn_name: string, arg_name: string, arg: string): void {
    typeCheckObj.isString(fn_name, arg_name, arg); // check arg is string
    if (arg.length === 0) {
        throw new Error (fn_name + ': ' + arg_name + ' not specified');
    }
    if (arg.search(/\W/) !== -1) {
        throw new Error (fn_name + ': ' + arg_name + ' contains restricted characters');
    }
    if (arg[0].search(/[0-9]/) !== -1) {
        throw new Error (fn_name + ': ' + arg_name + ' should not start with numbers');
    }
    return;
}
export function checkAttribNameValue(fn_name: string, attrib_name: string, attrib_value: any, attrib_index?: number): void {
    isValidName(fn_name, 'attrib_name', attrib_name);
    // blocks writing to id
    if (attrib_name === 'id') {
        throw new Error(fn_name + ': id is not modifiable!');
    }
    // -- check defined index
    let ind = false;
    if (attrib_index !== null && attrib_index !== undefined) {
        ind = true;
        // check if index is number
        typeCheckObj.isNumber(fn_name, 'attrib_index', attrib_index);
    }
    // -- check blocked name
    const blk_att_nm_lst = Object.values(EAttribNames);
    let blocked = false;
    let isTexture = false;
    let isName = false;
    for (let i = 0; i < blk_att_nm_lst.length; i++) {
        if (attrib_name === 'texture') {
            isTexture = true;
            blocked = true;
            break;
        }
        if (attrib_name === 'name') {
            isName = true;
            blocked = true;
            break;
        }
        if (attrib_name === blk_att_nm_lst[i]) {
            blocked = true;
            break;
        }
    }
    let check_fns = [];
    if (attrib_value !== null && attrib_value !== undefined) {
        if (blocked === true) {
            let pass = false;
            const err_arr = [fn_name + ': ' + 'attrib_name is one of the reserved attribute names - '
                            + Object.values(EAttribNames).toString() + '\n'];
            if (isName) {
                try {
                    isValidName(fn_name, 'attrib_value', attrib_value);
                    pass = true;
                } catch (err) {
                    err_arr.push(err);
                }
            } else {
                if (ind === false) {
                    try {
                        isListArg(fn_name, 'attrib_value', attrib_value, 'numbers');
                        let chkLstLen;
                        if (isTexture) {
                            chkLstLen = 2;
                        } else {
                            chkLstLen = 3;
                        }
                        isListLenArg(fn_name, 'attrib_value', attrib_value, chkLstLen);
                    } catch (err) {
                        err_arr.push(err.message);
                        throw new Error(err_arr.join(''));
                    }
                    check_fns = ['isNumberList'];
                    for (let i = 0; i < check_fns.length; i++) {
                        try {
                            typeCheckObj[check_fns[i]](fn_name + '.' + check_fns[i], 'attrib_value', attrib_value);
                        } catch (err) {
                            err_arr.push(err.message + '\n');
                            continue;
                        }
                        pass = true;
                        break; // passed
                    }
                } else {
                    if (isTexture) {
                        if (attrib_index > 1 || attrib_index < 0) {
                            err_arr.push(fn_name + '.validIndex: attrib_index is not between 0 and 1 (inclusive)');
                            throw new Error(err_arr.join(''));
                        }
                    } else {
                        if (attrib_index > 2 || attrib_index < 0) {
                            err_arr.push(fn_name + '.validIndex: attrib_index is not between 0 and 2 (inclusive)');
                            throw new Error(err_arr.join(''));
                        }
                    }
                    check_fns = ['isNumber'];
                    for (let i = 0; i < check_fns.length; i++) {
                        try {
                            typeCheckObj[check_fns[i]](fn_name + '[' + attrib_index + ']' + '.' + check_fns[i],
                                                      'attrib_value', attrib_value);
                        } catch (err) {
                            err_arr.push(err.message + '\n');
                            continue;
                        }
                        pass = true;
                        break; // passed
                    }
                }
            }
            if (pass === false) {
                throw new Error(err_arr.join(''));
            }
        } else {
            if (ind === false) {
                checkCommTypes(fn_name, 'attrib_value', attrib_value, ['isString', 'isNumber', 'isStringList', 'isNumberList']);
            } else { // no nested lists
                checkCommTypes(fn_name  + '[' + attrib_index + ']', 'attrib_value', attrib_value, ['isString', 'isNumber']);
            }
        }
    }
    return;
}

// =========================================================================================================================================
// Function Dictionaries
// =========================================================================================================================================
const typeCheckObj  = {
    // entities: Check if string
    isEntity: function(fn_name: string, arg_name: string, arg: string): void {
        isStringArg(fn_name, arg_name, arg, 'entity');
        if (arg.slice(2).length === 0) {
            throw new Error(fn_name + ': ' + arg_name + ' needs to have an index specified');
        }
        return;
    },
    isEntityList: function(fn_name: string, arg_name: string, arg_list: string[]): void {
        isListArg(fn_name, arg_name, arg_list, 'entity');
        for (let i = 0; i < arg_list.length; i++) {
            typeCheckObj.isEntity(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    },
    // any: to catch undefined
    isAny: function(fn_name: string, arg_name: string, arg: string): void {
        isAnyArg(fn_name, arg_name, arg);
        return;
    },
    // null: allow Null input
    isNull: function(fn_name: string, arg_name: string, arg: string): void {
        isNullArg(fn_name, arg_name, arg);
        return;
    },
    // list
    isList: function(fn_name: string, arg_name: string, arg: string): void {
        isListArg(fn_name, arg_name, arg, 'any');
        return;
    },
    // strings
    isString: function(fn_name: string, arg_name: string, arg: string): void {
        isStringArg(fn_name, arg_name, arg, 'string');
        return;
    },
    isStringList: function(fn_name: string, arg_name: string, arg_list: string[]): void {
        isStringListArg(fn_name, arg_name, arg_list, 'string');
        return;
    },
    // numbers and special numbers
    isNumber: function(fn_name: string, arg_name: string, arg: number): void {
        isNumberArg(fn_name, arg_name, arg);
        return;
    },
    isNumberList: function(fn_name: string, arg_name: string, arg_list: number[]): void {
        isNumberListArg(fn_name, arg_name, arg_list);
        return;
    },
    isInt: function(fn_name: string, arg_name: string, arg: number): void {
        isIntArg(fn_name, arg_name, arg);
        return;
    },
    isXYlist: function(fn_name: string, arg_name: string, arg_list: [number, number]): void {
        isListArg(fn_name, arg_name, arg_list, 'numbers');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        isNumberListArg(fn_name, arg_name, arg_list);
        return;
    },
    isXYlistInt: function(fn_name: string, arg_name: string, arg_list: [number, number]): void {
        isListArg(fn_name, arg_name, arg_list, 'integers');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        isIntListArg(fn_name, arg_name, arg_list);
        return;
    },
    isXYZlist: function(fn_name: string, arg_name: string, arg_list: [number, number, number]): void {
        typeCheckObj.isCoord(fn_name, arg_name, arg_list);
        return;
    },
    // Other Geometry
    isCoord: function(fn_name: string, arg_name: string, arg: [number, number, number]): void { // Txyz = [number, number, number]
        isListArg(fn_name, arg_name, arg, 'numbers');
        isListLenArg(fn_name, arg_name, arg, 3);
        isNumberListArg(fn_name, arg_name, arg);
        return;
    },
    isCoordList: function(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void {
        isListArg(fn_name, arg_name, arg_list, 'coordinates');
        for (let i = 0; i < arg_list.length; i++) {
            isListLenArg(fn_name, arg_name + '[' + i + ']', arg_list[i], 3);
            isNumberListArg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    },
    isCoordList_List: function(fn_name: string, arg_name: string, arg_list: [number, number, number][][]): void {
        isListArg(fn_name, arg_name, arg_list, 'lists of coordinates');
        for (let i = 0; i < arg_list.length; i++) {
            for (let j = 0; j < arg_list[i].length; j++) {
                isListLenArg(fn_name, arg_name + '[' + i + ']' + '[' + j + ']', arg_list[i][j], 3);
                isNumberListArg(fn_name, arg_name + '[' + i + ']' + '[' + j + ']', arg_list[i][j]);
            }
        }
        return;
    },
    isVector: function(fn_name: string, arg_name: string, arg_list: [number, number, number]): void { // same checks as coord
        typeCheckObj.isCoord(fn_name, arg_name, arg_list);
        return;
    },
    isVectorList: function(fn_name: string, arg_name: string, arg_list: number[]): void {
        // Add if required
    },
    isOrigin: function(fn_name: string, arg_name: string, arg: number[]): TEntTypeIdx {
        return checkIDnTypes(fn_name, arg_name, arg, ['isID', 'isCoord'], ['POSI', 'VERT', 'POINT']) as TEntTypeIdx;
    },
    isPlane: function(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void { // TPlane = Txyz, Txyz, Txyz]
        // one origin: point, posi, vert, coord + 2 vectors
        isListArg(fn_name, arg_name, arg_list, 'origin and vectors');
        isListLenArg(fn_name, arg_name, arg_list, 3);
        typeCheckObj.isCoord(fn_name, arg_name  + '[0]', arg_list[0]);
        [1, 2].forEach((i) => {
            typeCheckObj.isVector(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        });
        return;
    },
    isBBox: function(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void { // TBbox = Txyz, Txyz, Txyz]
        // four coords
        isListArg(fn_name, arg_name, arg_list, 'origin, min corner, max corner, size');
        isListLenArg(fn_name, arg_name, arg_list, 4);
        typeCheckObj.isCoord(fn_name, arg_name  + '[0]', arg_list[0]);
        [0, 1, 2, 3].forEach((i) => {
            typeCheckObj.isVector(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        });
        return;
    },
    isPlaneList: function(fn_name: string, arg_name: string, arg_list: number[][][]): void {
        // Add if required
    },
    isRay: function(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void { // TRay = [Txyz, Txyz]
        isListArg(fn_name, arg_name, arg_list, 'origin and vector');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        typeCheckObj.isCoord(fn_name, arg_name  + '[0]', arg_list[0]);
        typeCheckObj.isVector(fn_name, arg_name + '[1]', arg_list[1]);
        return;
    }
};
const IDcheckObj = {
    // IDs
    // entity types
    // POSI, TRI, VERT, EDGE, WIRE, FACE, POINT, PLINE, PGON, COLL
    isID: function(fn_name: string, arg_name: string, arg: any, ent_type_strs: string[]|null): TEntTypeIdx {
        typeCheckObj.isEntity(fn_name, arg_name, arg); // check is valid id
        const ent_arr = idsBreak(arg) as TEntTypeIdx; // split

        if (ent_type_strs === null) {
            ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
        }
        let pass = false;
        for (let i = 0; i < ent_type_strs.length; i++) {
            if (ent_arr[0] === EEntType[ent_type_strs[i]]) {
                pass = true;
                break;
            }
        }
        if (pass === false) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' + ent_type_strs.toString());
        }
        return ent_arr;
    },
    isIDList: function(fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: string[]|null): TEntTypeIdx[] {
        typeCheckObj.isEntityList(fn_name, arg_name, arg_list); // check is valid id list
        const ent_arr_lst = idsBreak(arg_list) as TEntTypeIdx[]; // split

        if (ent_type_strs === null) {
            ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
        }
        for (let i = 0; i < ent_arr_lst.length; i++) {
            let pass = false;
            for (let j = 0; j < ent_type_strs.length; j++) {
                if (ent_arr_lst[i][0] === EEntType[ent_type_strs[j]]) {
                    pass = true;
                    break;
                }
            }
            if (pass === false) {
                const ret_str_arr = [];
                ent_type_strs.forEach((test_ent) => {
                    ret_str_arr.push(test_ent + '_list');
                });
                throw new Error(fn_name + ': ' + arg_name + '[' + i + ']' + ' is not one of the following valid types - '
                                + ret_str_arr.toString());
            }
        }
        return ent_arr_lst;
    },
    isIDList_list: function(fn_name: string, arg_name: string, arg_list: any, ent_type_strs: string[]|null): TEntTypeIdx[][] {
        const ret_arr = [];
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IDcheckObj.isIDList(fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[][];
    },
};
// =========================================================================================================================================
// Specific Checks
// =========================================================================================================================================
export function checkCommTypes(fn_name: string, arg_name: string, arg: any, check_fns: string[]): void|TEntTypeIdx|
                               TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret;
    for (let i = 0; i < check_fns.length; i++) {
        try {
           ret = typeCheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg);
        } catch (err) {
            err_arr.push(err.message + '\n');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests - ' + check_fns.toString() + '\n';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret;
}

export function checkIDs(fn_name: string, arg_name: string, arg: any, check_fns: string[],
                         IDchecks: string[]|null): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret: TEntTypeIdx|TEntTypeIdx[];
    for (let i = 0; i < check_fns.length; i++) {
        try {
           ret =  IDcheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg, IDchecks);
        } catch (err) {
            err_arr.push(err.message + '\n');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests - ' + check_fns.toString() + '\n';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret; // returns TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}
// =========================================================================================================================================
// Most General Check
// =========================================================================================================================================
export function checkIDnTypes(fn_name: string, arg_name: string, arg: any, check_fns: string[],
                              IDchecks?: string[]|null): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret: TEntTypeIdx|TEntTypeIdx[];
    for (let i = 0; i < check_fns.length; i++) {
        if (Object.keys(IDcheckObj).includes(check_fns[i])) {
            // checking for ID
            try {
                ret = IDcheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg, IDchecks);
            } catch (err) {
                err_arr.push(err.message + '\n');
                continue;
            }
            pass = true;
            break; // passed
        } else {
            // checking common types
            try {
                typeCheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg);
            } catch (err) {
                err_arr.push(err.message + '\n');
                continue;
            }
            pass = true;
            break; // passed
        }
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests - ' + check_fns.toString() + '\n';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret; // returns void|TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}

// =====================================================================================================================
// util
// =====================================================================================================================
// List
function isListArg(fn_name: string, arg_name: string, arg: any, typ: string): void {
    if (!Array.isArray(arg)) {
        throw new Error (fn_name + ': ' + arg_name + ' is not a list of ' + typ);
    }
    return;
}
function isListLenArg(fn_name: string, arg_name: string, arg_list: any[], len: number): void {
    if (arg_list.length !== len) {
        throw new Error (fn_name + ': ' + arg_name + ' is not a list of length ' + len);
    }
    return;
}
// Any
function isAnyArg(fn_name: string, arg_name: string, arg: any): void {
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' must be defined');
    }
    return;
}
// Null
function isNullArg(fn_name: string, arg_name: string, arg: any): void {
    if (arg !== null) {
        throw new Error(fn_name + ': ' + arg_name + ' is not null');
    }
    return;
}
// String
function isStringArg(fn_name: string, arg_name: string, arg: any, typ: string): void {
    if (typeof arg !== 'string') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a ' + typ);
    }
    return;
}
function isStringListArg(fn_name: string, arg_name: string, arg_list: any[], typ: string): void {
    isListArg(fn_name, arg_name, arg_list, typ);
    for (let i = 0; i < arg_list.length; i++) {
        isStringArg(fn_name, arg_name + '[' + i + ']', arg_list[i], typ);
    }
    return;
}
// Numbers
function isNumberArg(fn_name: string, arg_name: string, arg: any): void {
    if (typeof arg !== 'number') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a number');
    }
    return;
}
function isNumberListArg(fn_name: string, arg_name: string, arg_list: any): void {
    isListArg(fn_name, arg_name, arg_list, 'numbers');
    for (let i = 0; i < arg_list.length; i++) {
        if (typeof arg_list[i] !== 'number') {
            throw new Error(fn_name + ': ' + arg_name + '[' + i + ']' + ' is not a number');
        }
    }
    return;
}
function isIntArg(fn_name: string, arg_name: string, arg: any): void {
    if (!Number.isInteger(arg)) {
        throw new Error(fn_name + ': ' + arg_name + ' is not an integer');
    }
    return;
}
function isIntListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    isListArg(fn_name, arg_name, arg_list, 'integers');
    for (let i = 0; i < arg_list.length; i++) {
        if (!Number.isInteger(arg_list[i])) {
            throw new Error(fn_name + ': ' + arg_name + '[' + i + ']' + ' is not an integer');
        }
    }
    return;
}
