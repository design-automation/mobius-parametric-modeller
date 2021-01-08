import { Injectable } from '@angular/core';

import { IModule, IFunction } from '@models/procedure';
import { IArgument } from '@models/code';
import * as doc from '@assets/typedoc-json/doc.json';
import * as ctrlFlowDoc from '@assets/typedoc-json/controlFlowDoc.json';
// const doc = require('@assets/typedoc-json/doc.json');
import * as showdown from 'showdown';
import * as fs from 'fs';

// @ts-ignore
import * as Modules from 'assets/core/modules';

const mdConverter = new showdown.Converter({literalMidWordUnderscores: true});
const module_list = [];
const extraMods = ['variable', 'comment', 'expression', 'control_flow'];

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
            return { name: r_value[0].trim(), value: undefined};
        } else {
            return { name: r_value[0].trim(), value: undefined};
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

function addDoc(mod, modName, docs) {
    const moduleDoc = {};
    if (mod.comment && mod.comment.shortText) {
        moduleDoc['description'] = mod.comment.shortText;
    }
    if (!mod.children) { return; }
    for (const func of mod.children) {
        const fn = {};
        fn['name'] = func.name;
        fn['module'] = modName;
        if (modName === '_constants') {
            fn['description'] = func['comment'].shortText;
            moduleDoc[func.name] = fn;
        }
        if (!func['signatures']) { continue; }
        if (func['signatures'][0].comment) {
            const cmmt = func['signatures'][0].comment;
            fn['description'] = cmmt.shortText;
            if (cmmt.text) {
                fn['description'] = fn['description'] + cmmt.text;
            }
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
                    // if (pr['description']) {
                    //     pr['description'] = mdConverter.makeHtml(pr['description']).replace(/\n/g, '<br/>')
                    // }
                }
                pr['type'] = analyzeParamType(fn, param.type);
                fn['parameters'].push(pr);
            }
        }
        if (fn['description']) {
            fn['description'] = mdConverter.makeHtml(fn['description']).replace(/\\n/g, '<br/>');
        }
        moduleDoc[func.name] = fn;
    }
    docs[modName] = moduleDoc;
}

function addModFuncDoc(modDoc, modUrl, modName) {
    fetch(modUrl).then(res => {
        if (!res.ok) {
            console.log('HTTP Request Error: Unable to retrieve documentation for ' + modName);
            return '';
        }
        const mod = { };
        modDoc[modName] = mod;
        res.text().then(docText => {
            const splitText = docText.split('## ');
            if (splitText.length === 1) {
                const funcText = docText.split('# ')[1];
                const funcName = funcText.split('\n')[0].trim().toLowerCase();

                if (extraMods.indexOf(modName) !== -1) {
                    mod[funcName] = '## ' + funcText.trim();
                } else {
                    mod[funcName] = '## ' + modName + '.' + funcText.trim();
                }
            } else {
                for (const funcText of splitText) {
                    if (funcText[0] === '#') { continue; }
                    const funcName = funcText.split('\n')[0].trim().toLowerCase();

                    if (extraMods.indexOf(modName) !== -1) {
                        mod[funcName] = '## ' + funcText.trim();
                    } else {
                        mod[funcName] = '## ' + modName + '.' + funcText.trim();
                    }
                }
            }
        });
    });

}

const moduleDocs = {};
const inlineDocs = {};
const functionDocs = {};
for (const mod of doc.children) {
    let modName: any = mod.name.replace(/"/g, '').replace(/'/g, '').split('/');
    const coreIndex = modName.indexOf('core');
    if (modName.length < 3 || coreIndex === -1) {
        continue;
    }
    if (modName[coreIndex + 1] === 'inline') {
        modName = modName[modName.length - 1];
        addDoc(mod, modName, inlineDocs);

    } else if (modName[coreIndex + 1] === 'modules') {
        modName = modName[modName.length - 1];
        if (modName.substr(0, 1) === '_' || modName === 'index' || modName === 'categorization') {
            continue;
        }
        addDoc(mod, modName, moduleDocs);
        addModFuncDoc(functionDocs, `assets/typedoc-json/docMD/_${modName}.md`, modName)
    }
}
for (const i of extraMods) {
    addModFuncDoc(functionDocs, `assets/typedoc-json/docCF/_${i}.md`, i)
}

export const ModuleList = module_list;
export const ModuleDocList = moduleDocs;
export const AllFunctionDoc = functionDocs;
export const InlineDocList = inlineDocs;
