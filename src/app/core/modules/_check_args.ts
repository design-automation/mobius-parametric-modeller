import { EEntityTypeStr } from '@libs/geo-info/common';
// import { isDim0, isDim1, isDim2 } from '@libs/geo-info/id';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

// =====================================================================================================================
// string
// =====================================================================================================================
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

// isId: function(fn_name: string, arg_name: string, arg: string): void {
//     isStringArg(fn_name, arg_name, arg);
//     return;
// },
// isIDList: function(fn_name: string, arg_name: string, arg_list: string[]): void {
//     isStringListArg(fn_name, arg_name, arg_list);
//     return;
// },
// isIDList_list: function(fn_name: string, arg_name: string, arg_list: string[][]): void {
//     isListArg(fn_name, arg_name, arg_list, 'ID lists');
//     for (let i = 0; i < arg_list.length; i++) {
//         isStringListArg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
//     }
//     return;
// },

// =====================================================================================================================
// Numbers
// =====================================================================================================================
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

// =====================================================================================================================
// common types
// =====================================================================================================================

const typeCheckObj  = {
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
            if (arg.startsWith(EEntityTypeStr[ent_type_strs[i]])) {
                return; // passed test
            }
        }
        throw new Error(fn_name + ': ' + arg_name + 'is not one of the following valid types - ' + ent_type_strs.toString());
    },
    isIDList: function(fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: string[]|'all'): void {
        if (ent_type_strs === 'all') {
            ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
        }
        for (let i = 0; i < arg_list.length; i++) {
            let pass = false;
            for (let j = 0; j < ent_type_strs.length; j++) {
                if (arg_list[i].startsWith(EEntityTypeStr[ent_type_strs[j]])) {
                    pass = true;
                    break;
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
export function checkCommTypes(fn_name: string, arg_name: string, arg: any, check_fns: string[]): void {
    let pass = false;
    const err_arr = [];
    for (let i = 0; i < check_fns.length; i++) {
        try {
            typeCheckObj[check_fns[i]](fn_name, arg_name, arg);
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
export function checkIDs(fn_name: string, arg_name: string, arg: any, check_fns: string[], IDchecks: string[]): void {
    let pass = false;
    const err_arr = [];
    for (let i = 0; i < check_fns.length; i++) {
        try {
            IDcheckObj[check_fns[i]](fn_name, arg_name, arg, IDchecks);
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
export function checkPPVCoord(fn_name: string, arg_name: string, arg: any): void {
    const err_arr = [];
    try {
        checkCommTypes(fn_name, arg_name, arg, ['isCoord']);
    } catch (err1) {
        err_arr.push(err1.message + '\n');
        try {
            checkIDs(fn_name, arg_name, arg, ['isID'], ['POSI', 'POINT', 'VERT']);
        } catch (err2) {
            err_arr.push(err2.message);
            throw new Error(err_arr.join(''));
        }
    }
    return;
}

// // dim0
// export function isDim0arg(fn_name: string, arg_name: string, arg: any): void {
//     if (!isDim0(arg)) {
//         throw new Error(fn_name + ': ' + arg_name + ' is not a Dim0 object');
//     }
//     return;
// }
// export function isDim0ListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
//     for (let i = 0; i < arg_list.length; i++) {
//         if (!isDim0(arg_list[i])) {
//             throw new Error(fn_name + ': list ' + arg_name + ' contains a non-Dim0 object');
//         }
//     }
//     return;
// }

// // dim1
// export function isDim1arg(fn_name: string, arg_name: string, arg: any): void {
//     if (!isDim1(arg)) {
//         throw new Error(fn_name + ': ' + arg_name + ' is not a Dim1 object');
//     }
//     return;
// }
// export function isDim1ListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
//     for (let i = 0; i < arg_list.length; i++) {
//         if (!isDim1(arg_list[i])) {
//             throw new Error(fn_name + ': list ' + arg_name + ' contains a non-Dim1 object');
//         }
//     }
//     return;
// }

// // dim2
// export function isDim2arg(fn_name: string, arg_name: string, arg: any): void {
//     if (!isDim2(arg)) {
//         throw new Error(fn_name + ': ' + arg_name + ' is not a Dim2 object');
//     }
//     return;
// }
// export function isDim2ListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
//     for (let i = 0; i < arg_list.length; i++) {
//         if (!isDim2(arg_list[i])) {
//             throw new Error(fn_name + ': list ' + arg_name + ' contains a non-Dim2 object');
//         }
//     }
//     return;
// }

// =====================================================================================================================
// util
// =====================================================================================================================

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
