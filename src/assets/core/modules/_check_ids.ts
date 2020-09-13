import { GIModel } from '@assets/libs/geo-info/GIModel';
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

    static isId(__model__: GIModel, fn_name: string, arg_name: string, arg: any, ent_type_strs: EEntType[]|null): TEntTypeIdx {
        let ent_arr;
        try {
            ent_arr = idsBreak(arg) as TEntTypeIdx; // split
        } catch (err) {
            throw new Error(fn_name + ': The entity ID "' + arg + '" is not a valid Entity ID.'); // check valid id
        }
        if (!__model__.modeldata.geom.query.entExists(ent_arr[0], ent_arr[1])) {
            throw new Error(fn_name + ': The entity ID "' + arg + '" does not exist in the model.'); // check id exists
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
            throw new Error(fn_name + ': The entity ID "' + arg + '" is not one of the following valid types - ' +
                            ent_type_strs.map((test_ent) => EEntType[test_ent]).toString());
        }
        return ent_arr;
    }
    static isIdL(__model__: GIModel, fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: EEntType[]|null): TEntTypeIdx[] {
        if (!Array.isArray(arg_list)) {
            throw new Error(fn_name + ': The argument is not list of entity IDs.');
        }
        const ret_arr = [];
        if (ent_type_strs === null) {
            ent_type_strs = IdCh.default_ent_type_strs;
        }
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IdCh.isId(__model__, fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[];
    }
    static isIdLL(__model__: GIModel, fn_name: string, arg_name: string, arg_list: any, ent_type_strs: EEntType[]|null): TEntTypeIdx[][] {
        if (!Array.isArray(arg_list)) {
            throw new Error(fn_name + ': The argument is not list of lists of entity IDs.');
        }
        const ret_arr = [];
        if (ent_type_strs === null) {
            ent_type_strs = IdCh.default_ent_type_strs;
        }
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IdCh.isIdL(__model__, fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[][];
    }
}

export function checkIDs(__model__: GIModel, fn_name: string, arg_name: string, arg: any, check_fns: Function[],
                         IDchecks: EEntType[]|null): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret: TEntTypeIdx|TEntTypeIdx[];
    if (arg === undefined) {
        throw new Error(fn_name + ': The argument "' + arg_name + '" is undefined' + '<br>');
    }
    for (let i = 0; i < check_fns.length; i++) {
        try {
           ret =  check_fns[i](__model__, fn_name, arg_name, arg, IDchecks);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': The argument "' + arg_name + '" failed the following tests:<br>';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret; // returns TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}
