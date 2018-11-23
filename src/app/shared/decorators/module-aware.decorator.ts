import { Injectable } from '@angular/core';

import { IModule, IFunction } from '@models/procedure';
import { IArgument } from '@models/code';
import * as doc from '@assets/typedoc-json/doc.json';

import * as Modules from '@modules';

// todo: bug fix for defaults
function extract_params(func: Function): [IArgument[], boolean] {
    let fnStr = func.toString().replace( /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).split(",")//.match( /([^\s,]+)/g);
    if(result === null || result[0]==""){
         result = [];
    }
    let final_result = result.map(function(r){ 
        r = r.trim();
        let r_value = r.split("=");

        if (r_value.length == 1){
            return { name: r_value[0].trim(), value: undefined, default: 0}
        }
        else{
            return { name: r_value[0].trim(), value: undefined, default: 0 }
        }

    });
    let hasReturn = true;
    if (fnStr.indexOf("return") === -1 || fnStr.indexOf("return;") !== -1){
        hasReturn = false;
    }
    return [final_result, hasReturn];
}

function extract_docs(){
    let docs = {}
    for (let mod of doc.children){
        if (mod.name.substr(1,1)== '_' || mod.name == '"index"'){
            continue
        }        
        let modName = mod.name.substr(1, mod.name.length-2);
        let moduleDoc = {}
        for (let func of mod.children){
            let fn = {};
            fn["name"] = func.name;
            fn["description"] = func["signatures"][0].comment.shortText;
            fn["returns"] = func["signatures"][0].comment.returns;
            if (fn["returns"]) fn["returns"] = fn["returns"].trim();
            fn["parameters"] = [];
            if (func["signatures"][0].parameters) for (let param of func["signatures"][0].parameters){
                let pr = {};
                pr["name"] = param.name;
                pr["description"] = param.comment.shortText||param.comment.text;
                fn["parameters"].push(pr)
            }
            moduleDoc[func.name] = fn;
        }
        docs[modName] = moduleDoc
    }
    return docs
}

export function ModuleAware(constructor: Function) {
    let module_list = [];
    for( let m_name in Modules ){
        if (m_name[0] == '_' || m_name == 'gs' || m_name == 'gsConstructor'){
            continue
        }

        let modObj = <IModule>{};
        modObj.module = m_name;
        modObj.functions = [];
        
        for( let fn_name of Object.keys(Modules[m_name])){
            
            let func = Modules[m_name][fn_name];

            let fnObj = <IFunction>{};
            fnObj.module = m_name;
            fnObj.name = fn_name;
            fnObj.argCount = func.length;
            let args = extract_params(func);
            fnObj.args = args[0];
            fnObj.hasReturn = args[1];
            modObj.functions.push(fnObj);
        }
        module_list.push(modObj);
    }
    constructor.prototype.Modules = module_list;
    constructor.prototype.ModulesDoc = extract_docs()
}