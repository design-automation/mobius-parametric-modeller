import { ProcedureTypes } from '@models/procedure';
import { ModuleList } from './decorators';
import * as funcs from '@modules';
import * as deprecated from '@assets/core/deprecated.json';

import * as circularJSON from 'circular-json';
import { _parameterTypes } from '@assets/core/_parameterTypes';


export function checkMobFile(file: any) {

    checkEndReturn(file);

    let hasError = false;
    for (const node of file.flowchart.nodes) {
        if (!checkMissingProd(node.procedure, file.version)) {
            node.hasError = true;
            hasError = true;
        }
    }
    if (hasError) {
        alert('The flowchart contains functions that do not exist in the current version of Mobius');
    }
    for (const userDefFunc of file.flowchart.functions) {
        if (!userDefFunc.flowchart) { continue; }
        for (const node of userDefFunc.flowchart.nodes) {
            if (!checkMissingProd(node.procedure, file.version)) {
                alert('User Defined Function ' + userDefFunc.name +
                      ' contains functions that do not exist in the current version of Mobius');
            }
        }
    }
}

function checkMissingProd(prodList: any[], fileVersion: number) {
    let check = true;
    for (const prod of prodList) {
        if (prod.children) {
            if (!checkMissingProd(prod.children, fileVersion)) {
                check = false;
            }
        }
        prod.hasError = false;
        if (fileVersion < 3) {
            if (prod.type === ProcedureTypes.Constant) {
                if (prod.args[1].default || prod.args[1].value === undefined) {
                    prod.args[1].value = prod.args[1].default;
                }
            }
        }

        if (prod.type !== ProcedureTypes.Function) { continue; }


        // @ts-ignore
        for (const dpFn of deprecated.default) {
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
                let returnArg = {name: 'var_name', value: undefined};
                if (!data.hasReturn) {
                    returnArg = {name: '__none__', value: undefined};
                } else if (prod.args[0].name !== '__none__') {
                    returnArg.value = prod.args[0].value;
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

function checkEndReturn(file) {
    if (file.version === 1) {
        const endNode = file.flowchart.nodes[file.flowchart.nodes.length - 1];
        if (endNode.procedure.length === 0) {
            endNode.procedure = [{type: 13, ID: '',
            parent: undefined,
            meta: {name: '', module: ''},
            children: undefined,
            variable: undefined,
            argCount: 0,
            args: [],
            print: false,
            enabled: true,
            selected: false,
            selectGeom: false,
            hasError: false}];
        }
        if (endNode.procedure[endNode.procedure.length - 1].type !== 11) {
            const returnMeta = _parameterTypes.return.split('.');
            for (const i of ModuleList) {
                if (i.module !== returnMeta[0]) { continue; }
                for ( const j of i.functions) {
                    if (j.name !== returnMeta[1]) { continue; }
                    endNode.procedure.push({type: 11, ID: '',
                    parent: undefined,
                    meta: {name: '', module: ''},
                    children: undefined,
                    variable: undefined,
                    argCount: j.argCount,
                    args: j.args,
                    print: false,
                    enabled: true,
                    selected: false,
                    selectGeom: false,
                    hasError: false});
                    break;
                }
                break;
            }
        }
    }
}

