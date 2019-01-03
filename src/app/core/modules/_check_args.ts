import { EEntityTypeStr } from '@libs/geo-info/common';
// import { isDim0, isDim1, isDim2 } from '@libs/geo-info/id';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

// =========================================================================================================================================
// Function Dictionaries
// =========================================================================================================================================
const typeCheckObj  = {
    // any: to catch undefined
    isAny: function(fn_name: string, arg_name: string, arg: string): void {
        isAnyArg(fn_name, arg_name, arg);
    },
    // list
    isList: function(fn_name: string, arg_name: string, arg: string): void {
        isListArg(fn_name, arg_name, arg, 'any');
    },
    // strings
    isString: function(fn_name: string, arg_name: string, arg: string): void {
        isStringArg(fn_name, arg_name, arg);
        return;
    },
    isStringList: function(fn_name: string, arg_name: string, arg_list: string[]): void {
        isStringListArg(fn_name, arg_name, arg_list);
        return;
    },
    // numbers and special numbers
    isNumber: function(fn_name: string, arg_name: string, arg: number): void {
        isNumberArg(fn_name, arg_name, arg);
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
    // Other Geometry
    isCoord: function(fn_name: string, arg_name: string, arg: number[]): void { // Txyz = [number, number, number]
        isListArg(fn_name, arg_name, arg, 'numbers');
        isListLenArg(fn_name, arg_name, arg, 3);
        isNumberListArg(fn_name, arg_name, arg);
        return;
    },
    isCoordList: function(fn_name: string, arg_name: string, arg_list: number[][]): void {
        isListArg(fn_name, arg_name, arg_list, 'coordinates');
        for (let i = 0; i < arg_list.length; i++) {
            isListLenArg(fn_name, arg_name + '[' + i + ']', arg_list[i], 3);
            isNumberListArg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    },
    isVector: function(fn_name: string, arg_name: string, arg: number[]): void { // same checks as coord
        typeCheckObj.isCoord(fn_name, arg_name, arg);
        return;
    },
    isVectorList: function(fn_name: string, arg_name: string, arg: number[]): void {
        // Add if required
    },
    isPlane: function(fn_name: string, arg_name: string, arg_list: number[][]): void { // TPlane = [Txyz, Txyz, Txyz]
        isListArg(fn_name, arg_name, arg_list, 'origin and vectors');
        isListLenArg(fn_name, arg_name, arg_list, 3);
        for (let i = 0; i < arg_list.length; i++) {
            typeCheckObj.isCoord(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    },
    isPlaneList: function(fn_name: string, arg_name: string, arg_list: number[][][]): void {
        // Add if required
    },
};
const IDcheckObj = {
    // IDs
    // entity types
    // POSI, TRI, VERT, EDGE, WIRE, FACE, POINT, PLINE, PGON, COLL
    isID: function(fn_name: string, arg_name: string, arg: any, ent_type_strs: string[]|'all'): void {
        if (ent_type_strs === 'all') {
            ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
        }
        for (let i = 0; i < ent_type_strs.length; i++) {
            if (typeof arg !== 'string') {
                break; // throw error
            }
            if (arg.startsWith(EEntityTypeStr[ent_type_strs[i]])) {
                if (arg.length !== 2) {
                    return; // passed test
                } else {
                    throw new Error(fn_name + ': ' + arg_name + ' needs to have an index specified');
                }
            }
        }
        throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' + ent_type_strs.toString());
    },
    isIDList: function(fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: string[]|'all'): void {
        if (ent_type_strs === 'all') {
            ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
        }
        for (let i = 0; i < arg_list.length; i++) {
            let pass = false;
            for (let j = 0; j < ent_type_strs.length; j++) {
                if (arg_list[i].startsWith(EEntityTypeStr[ent_type_strs[j]])) {
                    if (arg_list[i].length !== 2) {
                        pass = true;
                        return; // passed test
                    } else {
                        throw new Error(fn_name + ': ' + arg_name + '[' + i + ']' + ' needs to have an index specified');
                    }
                }
            }
            if (!pass) {
                const ret_str_arr = [];
                ent_type_strs.forEach((test_ent) => {
                    ret_str_arr.push(test_ent + '_list');
                });

                throw new Error(fn_name + ': ' + arg_name + '[' + i + ']' + 'is not one of the following valid types - '
                                + ret_str_arr.toString());
            }
        }
        return;
    },
    isIDList_list: function(fn_name: string, arg_name: string, arg_list: string[][], ent_type_strs: string[]|'all'): void {
        if (ent_type_strs === 'all') {
            ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
        }
        for (let i = 0; i < arg_list.length; i++) {
            IDcheckObj.isIDList(fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs);
        }
        return;
    },
};
// =========================================================================================================================================
// Specific Checks
// =========================================================================================================================================
export function checkCommTypes(fn_name: string, arg_name: string, arg: any, check_fns: string[]|'all'): void {
    let pass = false;
    const err_arr = [];
    for (let i = 0; i < check_fns.length; i++) {
        try {
            typeCheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg);
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
}
export function checkIDs(fn_name: string, arg_name: string, arg: any, check_fns: string[], IDchecks: string[]|'all'): void {
    let pass = false;
    const err_arr = [];
    for (let i = 0; i < check_fns.length; i++) {
        try {
            IDcheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg, IDchecks);
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
}
// =========================================================================================================================================
// Most General Check
// =========================================================================================================================================
export function checkIDnTypes(fn_name: string, arg_name: string, arg: any, check_fns: string[], IDchecks?: string[]|'all') {
    let pass = false;
    const err_arr = [];
    for (let i = 0; i < check_fns.length; i++) {
        if (Object.keys(IDcheckObj).includes(check_fns[i])) {
            // checking for ID
            try {
                IDcheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg, IDchecks);
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
// String
function isStringArg(fn_name: string, arg_name: string, arg: any): void {
    if (typeof arg !== 'string') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a string');
    }
    return;
}
function isStringListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    isListArg(fn_name, arg_name, arg_list, 'strings');
    for (let i = 0; i < arg_list.length; i++) {
        if (typeof arg_list[i] !== 'string') {
            throw new Error(fn_name + arg_name + '[' + i + ']' + ' is not a string');
        }
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
