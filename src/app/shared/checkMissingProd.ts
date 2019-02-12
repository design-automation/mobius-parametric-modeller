import { ProcedureTypes } from '@models/procedure';
import { ModuleList } from './decorators';
import * as funcs from '@modules';
import * as depreciated from '@assets/core/depreciated.json';

import * as circularJSON from 'circular-json';


export function checkMissingProd(prodList: any[]) {
    let check = true;
    for (const prod of prodList) {
        if (prod.children) {
            if (!checkMissingProd(prod.children)) {
                check = false;
            }
        }
        prod.hasError = false;
        if (prod.type !== ProcedureTypes.Function) { continue; }

        // @ts-ignore
        for (const dpFn of depreciated.default) {
            if (dpFn.old_func.name.toLowerCase() === prod.meta.name.toLowerCase() &&
                dpFn.old_func.module.toLowerCase() === prod.meta.module.toLowerCase()) {
                let data: any;
                for (const mod of ModuleList) {
                    if (mod.module.toLowerCase() === dpFn.new_func.module.toLowerCase()) {
                        for (const fn of mod.functions) {
                            if (fn.name.toLowerCase() === dpFn.new_func.name.toLowerCase()) {
                                data = circularJSON.parse(circularJSON.stringify(fn));
                                break;
                            }
                        }
                        break;
                    }
                }
                if (dpFn.old_func.name === dpFn.new_func.name && prod.argCount === (data.argCount + 1)) { break; }
                prod.meta = { module: data.module, name: data.name};
                prod.argCount = data.argCount + 1;
                let returnArg = {name: 'var_name', value: undefined, default: undefined};
                if (!data.hasReturn) {
                    returnArg = {name: '__none__', value: undefined, default: undefined};
                } else if (prod.args[0].name !== '__none__') {
                    returnArg.value = prod.args[0].value;
                    returnArg.default = prod.args[0].default;
                }
                for (const arg of data.args) {
                    let UpdateCheck = false;
                    for (const updatedArg in dpFn.new_func.values) {
                        if (updatedArg.toLowerCase() === arg.name.toLowerCase()) {
                            arg.value = dpFn.new_func.values[updatedArg];
                            UpdateCheck = true;
                            break;
                        }
                    }
                    if (UpdateCheck) { continue; }
                    for (const oldArg of prod.args) {
                        if (arg.name.toLowerCase() === oldArg.name.toLowerCase()) {
                            arg.value = oldArg.value;
                            arg.default = oldArg.default;
                            break;
                        }
                    }
                }
                prod.args = [ returnArg, ...data.args];
                break;
            }
        }
        if (!funcs[prod.meta.module] || !funcs[prod.meta.module][prod.meta.name]) {
            prod.hasError = true;
            check = false;
        }
    }
    return check;
}
