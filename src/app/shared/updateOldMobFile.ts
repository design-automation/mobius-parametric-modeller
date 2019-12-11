import { ProcedureTypes } from '@models/procedure';
import { ModuleList } from './decorators';
import * as funcs from '@modules';
import * as deprecated from '@assets/core/deprecated.json';

import * as circularJSON from 'circular-json';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { fn } from '@angular/compiler/src/output/output_ast';


export function checkMobFile(file: any) {
    // check the end node
    // checkEndReturn(file);

    // check if there's any missing procedure in each node
    let hasError = false;
    for (const node of file.flowchart.nodes) {
        if (!checkMissingProd(node.procedure, file.version)) {
            node.hasError = true;
            hasError = true;
        }
    }
    updateNode(file.flowchart);
    for (const ifn of file.flowchart.functions ) { updateNode(ifn.flowchart); }
    if (file.flowchart.subFunctions) {
        for (const ifn of file.flowchart.subFunctions) { updateNode(ifn.flowchart); }
    }
    if (hasError) {
        alert('The flowchart contains functions that do not exist in the current version of Mobius');
    }

    // check all user defined functions
    for (const userDefFunc of file.flowchart.functions) {
        if (!userDefFunc.flowchart) { continue; }
        for (const node of userDefFunc.flowchart.nodes) {
            if (!checkMissingProd(node.procedure, file.version)) {
                alert('User Defined Function ' + userDefFunc.name +
                      ' contains functions that do not exist in the current version of Mobius');
            }
        }
    }
    if (file.flowchart.subFunctions) {
        for (const userDefFunc of file.flowchart.subFunctions) {
            if (!userDefFunc.flowchart) { continue; }
            for (const node of userDefFunc.flowchart.nodes) {
                if (!checkMissingProd(node.procedure, file.version)) {
                    alert('User Defined Function ' + userDefFunc.name +
                          ' contains functions that do not exist in the current version of Mobius');
                }
            }
        }
    }
    file.version = 4;
}

function updateNode(flowchart) {
    for (const node of flowchart.nodes) {
        if (node.type === 'end') {
            node.procedure[node.procedure.length - 1].ID = 'Return';
        }

        if (!node.localFunc) {
            node.localFunc = [{type: 13, ID: 'local_func_blank',
            parent: undefined,
            meta: {name: '', module: ''},
            variable: undefined,
            children: undefined,
            argCount: 0,
            args: [],
            print: false,
            enabled: true,
            selected: false,
            selectGeom: false,
            hasError: false}];
        }

        if (node.state.show_code === undefined) { node.state.show_code = node.type !== 'start'; }
        if (node.state.show_func === undefined) { node.state.show_func = node.type !== 'start'; }
    }
}

function checkMissingProd(prodList: any[], fileVersion: number) {
    let check = true;
    for (const prod of prodList) {

        // check the children procedures if the procedure has any
        if (prod.children) {
            if (!checkMissingProd(prod.children, fileVersion)) {
                check = false;
            }
        }

        prod.hasError = false;

        // only continue below for function procedures
        if (prod.type !== ProcedureTypes.MainFunction) { continue; }


        // @ts-ignore
        for (const dpFn of deprecated.default) {
            if (dpFn.old_func.name.toLowerCase() === prod.meta.name.toLowerCase() &&
                dpFn.old_func.module.toLowerCase() === prod.meta.module.toLowerCase()) {
                let data: any;
                for (const mod of ModuleList) {
                    if (mod.module.toLowerCase() === dpFn.new_func.module.toLowerCase()) {
                        for (const modfn of mod.functions) {
                            if (modfn.name.toLowerCase() === dpFn.new_func.name.toLowerCase()) {
                                data = circularJSON.parse(circularJSON.stringify(modfn));
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

    // edit the return procedure (last procedure in the end node)
    if (file.version === 1) {
        const endNode = file.flowchart.nodes[file.flowchart.nodes.length - 1];

        // add a blank procedure if there is no procedure in the node
        // (all node must start with a blank procedure)
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

        // add a return procedure if there is none before
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

