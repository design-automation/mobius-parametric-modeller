import { EEntType, TEntTypeIdx } from '@libs/geo-info/common';
import { idsBreak } from '@libs/geo-info/id';

export class IdCh {
    static default_ent_type_strs = [EEntType.POSI,
                                    EEntType.TRI,
                                    EEntType.VERT,
                                    EEntType.EDGE,
                                    EEntType.WIRE,
                                    EEntType.FACE,
                                    EEntType.POINT,
                                    EEntType.PLINE,
                                    EEntType.PGON,
                                    EEntType.COLL];

    static isId(fn_name: string, arg_name: string, arg: any, ent_type_strs: EEntType[]|null): TEntTypeIdx {
        let ent_arr;
        try {
            ent_arr = idsBreak(arg) as TEntTypeIdx; // split
        } catch (err) {
            throw new Error(fn_name + ': ' + arg_name + ' is not a valid Entity ID'); // check valid id
        }
        if (ent_type_strs === null) {
            ent_type_strs = IdCh.default_ent_type_strs;
        }
        let pass = false;
        for (let i = 0; i < ent_type_strs.length; i++) {
            if (ent_arr[0] === ent_type_strs[i]) {
                pass = true;
                break;
            }
        }
        if (pass === false) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                            ent_type_strs.map((test_ent) => EEntType[test_ent]).toString());
        }
        return ent_arr;
    }
    static isIdL(fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: EEntType[]|null): TEntTypeIdx[] {
        if (!Array.isArray(arg_list)) {
            throw new Error(fn_name + ': ' + arg_name + ' is not list.');
        }
        const ret_arr = [];
        if (ent_type_strs === null) {
            ent_type_strs = IdCh.default_ent_type_strs;
        }
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IdCh.isId(fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[];
    }
    static isIdLL(fn_name: string, arg_name: string, arg_list: any, ent_type_strs: EEntType[]|null): TEntTypeIdx[][] {
        if (!Array.isArray(arg_list)) {
            throw new Error(fn_name + ': ' + arg_name + ' is not list.');
        }
        const ret_arr = [];
        if (ent_type_strs === null) {
            ent_type_strs = IdCh.default_ent_type_strs;
        }
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IdCh.isIdL(fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[][];
    }
}

export function checkIDs(fn_name: string, arg_name: string, arg: any, check_fns: Function[],
                         IDchecks: EEntType[]|null): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret: TEntTypeIdx|TEntTypeIdx[];
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is undefined' + '<br>');
    }
    for (let i = 0; i < check_fns.length; i++) {
        try {
           ret =  check_fns[i](fn_name, arg_name, arg, IDchecks);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret; // returns TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}
