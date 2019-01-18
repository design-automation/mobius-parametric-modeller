import { Injectable } from '@angular/core';

import { IModule, IFunction } from '@models/procedure';
import { IArgument } from '@models/code';
import * as doc from '@assets/typedoc-json/doc.json';
// const doc = require('@assets/typedoc-json/doc.json');

// @ts-ignore
import * as Modules from 'assets/core/modules';

const module_list = [];

// todo: bug fix for defaults
function extract_params(func: Function): [IArgument[], boolean] {
    const fnStr = func.toString().replace( /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');

    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).split(','); // .match( /([^\s,]+)/g);
    if (result === null || result[0] === '') {
         result = [];
    }
    const final_result = result.map(function(r) {
        r = r.trim();
        const r_value = r.split('=');

        if (r_value.length === 1) {
            return { name: r_value[0].trim(), value: undefined, default: 0};
        } else {
            return { name: r_value[0].trim(), value: undefined, default: 0 };
        }

    });
    let hasReturn = true;
    if (fnStr.indexOf('return') === -1 || fnStr.indexOf('return;') !== -1) {
        hasReturn = false;
    }
    return [final_result, hasReturn];
}

for ( const m_name in Modules ) {
    if (!Modules[m_name]) { continue; }
    // if (m_name[0] === '_') { continue; }

    const modObj = <IModule>{};
    modObj.module = m_name;
    modObj.functions = [];

    for ( const fn_name of Object.keys(Modules[m_name])) {
        // if (fn_name[0] === '_') { continue; }

        const func = Modules[m_name][fn_name];

        const fnObj = <IFunction>{};
        fnObj.module = m_name;
        fnObj.name = fn_name;
        fnObj.argCount = func.length;
        const args = extract_params(func);
        fnObj.args = args[0];
        fnObj.hasReturn = args[1];
        modObj.functions.push(fnObj);
    }
    module_list.push(modObj);
}


function analyzeParamType(fn, paramType) {
    if (paramType.type === 'array') {
        return `${analyzeParamType(fn, paramType.elementType)}[]`;
    } else if (paramType.type === 'intrinsic' || paramType.type === 'reference') {
        return paramType.name;
    } else if (paramType.type === 'union') {
        return paramType.types.map((tp: any) => analyzeParamType(fn, tp)).join(' | ');
    } else if (paramType.type === 'tuple') {
        return '[' + paramType.elements.map((tp: any) => analyzeParamType(fn, tp)).join(', ') + ']';
    } else {
        /**
         * TODO: Update unrecognized param type here
         */
        console.log('param type requires updating:', paramType);
        console.log('in function:', fn.module + '.' + fn.name);
        return paramType.type;
    }

}

const docs = {};
for (const mod of doc.children) {
    let modName: any = mod.name.split('/');
    modName = modName[modName.length - 1];
    if (modName.substr(0, 1) === '"' || modName.substr(0, 1) === '\'') {
        modName = modName.substr(1, modName.length - 2);
    } else {
        modName = modName.substr(0, modName.length - 1);
    }
    if (modName.substr(0, 1) === '_' || modName === 'index') {
        continue;
    }
    const moduleDoc = {};
    for (const func of mod.children) {
        // console.log(func);
        const fn = {};
        fn['name'] = func.name;
        fn['module'] = modName;
        if (!func['signatures']) { continue; }
        if (func['signatures'][0].comment) {
            const cmmt = func['signatures'][0].comment;
            fn['description'] = cmmt.shortText;
            if (cmmt.tags) {
                for (const fnTag of cmmt.tags) {
                    if (fnTag.tag === 'summary') { fn['summary'] = fnTag.text;
                    } else {
                        if (fn[fnTag.tag]) {
                            fn[fnTag.tag].push(fnTag.text);
                        } else {
                            fn[fnTag.tag] = [fnTag.text];
                        }

                    }
                }
            }
            fn['returns'] = cmmt.returns;
            if (fn['returns']) { fn['returns'] = fn['returns'].trim(); }
        }
        fn['parameters'] = [];
        if (func['signatures'][0].parameters) {
            for (const param of func['signatures'][0].parameters) {
                let namecheck = true;
                for (const systemVarName in Modules._parameterTypes) {
                    if (param.name === Modules._parameterTypes[systemVarName]) {
                        namecheck = false;
                        break;
                    }
                }
                if (!namecheck) {
                    fn['parameters'].push(undefined);
                    continue;
                }
                const pr = {};

                pr['name'] = param.name;
                if (param.comment) {
                    pr['description'] = param.comment.shortText || param.comment.text;
                }
                pr['type'] = analyzeParamType(fn, param.type);
                fn['parameters'].push(pr);
            }
        }
        moduleDoc[func.name] = fn;
    }
    docs[modName] = moduleDoc;
}

export const ModuleList = module_list;
export const ModuleDocList = docs;
