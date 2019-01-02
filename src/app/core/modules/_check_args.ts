import { EEntityTypeStr } from '@libs/geo-info/common';
import { isDim0, isDim1, isDim2 } from '@libs/geo-info/id';

// string
export function checkStr(fn_name: string, arg_name: string, arg: any): void {
    if (Array.isArray(arg)) {
        isStringListArg(fn_name, arg_name, arg);
    } else {
        isStringArg(fn_name, arg_name, arg);
    }
    return;
}
function isStringArg(fn_name: string, arg_name: string, arg: any): void {
    if (typeof arg !== 'string') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a string');
    }
    return;
}
function isStringListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    for (let i = 0; i < arg_list.length; i++) {
        if (typeof arg_list[i] !== 'string') {
            throw new Error(fn_name + ': list ' + arg_name + ' contains a non-string');
        }
    }
    return;
}

// integers
export function checkInt(fn_name: string, arg_name: string, arg: any): void {
    if (Array.isArray(arg)) {
        isIntListArg(fn_name, arg_name, arg);
    } else {
        isIntArg(fn_name, arg_name, arg);
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
    for (let i = 0; i < arg_list.length; i++) {
        if (!Number.isInteger(arg_list[i])) {
            throw new Error(fn_name + ': list ' + arg_name + ' contains a non-integer');
        }
    }
    return;
}

// ids
export function checkEntityType(fn_name: string, arg_name: string, arg: any, ent_type_strs: EEntityTypeStr[]|'all'): void {
    if (ent_type_strs === 'all') {
        ent_type_strs = [EEntityTypeStr.POSI, EEntityTypeStr.TRI, EEntityTypeStr.VERT, EEntityTypeStr.EDGE,
                         EEntityTypeStr.WIRE, EEntityTypeStr.FACE, EEntityTypeStr.POINT, EEntityTypeStr.PLINE,
                         EEntityTypeStr.PGON, EEntityTypeStr.COLL];
    }
    if (Array.isArray(arg)) {
        isIdListArg(fn_name, arg_name, arg, ent_type_strs);
    } else {
        isIdArg(fn_name, arg_name, arg, ent_type_strs);
    }
    return;
}
function isIdArg(fn_name: string, arg_name: string, arg: any, ent_type_strs: EEntityTypeStr[]): void {
    for (let i = 0; i < ent_type_strs.length; i++) {
        if (arg.startsWith(ent_type_strs[i])) {
            return;
        }
    }
    throw new Error(fn_name + ': ' + arg_name + 'is not one of the following valid types - ' + ent_type_strs.toString());
}
function isIdListArg(fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: EEntityTypeStr[]): void {
    for (let i = 0; i < arg_list.length; i++) {
        let pass = false;
        for (let j = 0; j < ent_type_strs.length; j++) {
            if (arg_list[i].startsWith(ent_type_strs[j])) {
                pass = true;
                break;
            }
        }
        if (!pass) {
            throw new Error(fn_name + ': list ' + arg_name + 'contains an object that is not one of the following valid types - '
                            + ent_type_strs.toString());
        }
    }
    return;
}

// dim0
export function checkDim0(fn_name: string, arg_name: string, arg: any): void {
    if (Array.isArray(arg)) {
        isDim0ListArg(fn_name, arg_name, arg);
    } else {
        isDim0arg(fn_name, arg_name, arg);
    }
    return;
}
function isDim0arg(fn_name: string, arg_name: string, arg: any): void {
    if (!isDim0(arg)) {
        throw new Error(fn_name + ': ' + arg_name + ' is not a Dim0 object');
    }
    return;
}
function isDim0ListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    for (let i = 0; i < arg_list.length; i++) {
        if (!isDim0(arg_list[i])) {
            throw new Error(fn_name + ': list ' + arg_name + ' contains a non-Dim0 object');
        }
    }
    return;
}

// dim1
export function checkDim1(fn_name: string, arg_name: string, arg: any): void {
    if (Array.isArray(arg)) {
        isDim1ListArg(fn_name, arg_name, arg);
    } else {
        isDim1arg(fn_name, arg_name, arg);
    }
    return;
}
function isDim1arg(fn_name: string, arg_name: string, arg: any): void {
    if (!isDim1(arg)) {
        throw new Error(fn_name + ': ' + arg_name + ' is not a Dim1 object');
    }
    return;
}
function isDim1ListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    for (let i = 0; i < arg_list.length; i++) {
        if (!isDim1(arg_list[i])) {
            throw new Error(fn_name + ': list ' + arg_name + ' contains a non-Dim1 object');
        }
    }
    return;
}

// dim2
export function checkDim2(fn_name: string, arg_name: string, arg: any): void {
    if (Array.isArray(arg)) {
        isDim2ListArg(fn_name, arg_name, arg);
    } else {
        isDim2arg(fn_name, arg_name, arg);
    }
    return;
}
function isDim2arg(fn_name: string, arg_name: string, arg: any): void {
    if (!isDim2(arg)) {
        throw new Error(fn_name + ': ' + arg_name + ' is not a Dim2 object');
    }
    return;
}
function isDim2ListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    for (let i = 0; i < arg_list.length; i++) {
        if (!isDim2(arg_list[i])) {
            throw new Error(fn_name + ': list ' + arg_name + ' contains a non-Dim2 object');
        }
    }
    return;
}
