import { Component, Output, EventEmitter, Input} from '@angular/core';

import { ProcedureTypes, IFunction, IModule } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';
import * as CircularJSON from 'circular-json';
import { IArgument } from '@models/code';
import * as Modules from '@modules';


const keys = Object.keys(ProcedureTypes);

@Component({
  selector: 'toolset',
  templateUrl: './toolset.component.html',
  styleUrls: ['./toolset.component.scss']
})
export class ToolsetComponent{

    @Output() select = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() imported = new EventEmitter();
    @Input() functions: IFunction[];
    @Input() nodeType: string;
    @Input() hasProd: boolean;

    Modules = ToolsetComponent.ModuleAware();
    
    ProcedureTypes = ProcedureTypes;
    ProcedureTypesArr = keys.slice(keys.length / 2);

    constructor(){}
    
    // add selected basic function as a new procedure
    add(type: ProcedureTypes): void{
        this.select.emit( { type: type, data: undefined } ); 
    }

    // add selected function from core.modules as a new procedure
    add_function(fnData){
        // create a fresh copy of the params to avoid linked objects
        // todo: figure out
        fnData.args = fnData.args.map( (arg) => { 
            return {name: arg.name, value: arg.value, default: arg.default};
            });
        
        this.select.emit( { type: ProcedureTypes.Function, data: fnData } ); 
    }

    // add selected imported function as a new procedure
    add_imported_function(fnData){
        fnData.args = fnData.args.map( (arg) => { 
            return {name: arg.name, value: arg.value};
            });
        this.select.emit( { type: ProcedureTypes.Imported, data: fnData } ); 
    }

    // delete imported function
    delete_imported_function(fnData){
        this.delete.emit(fnData); 
    }


    // import a flowchart as function
    async import_function(event){
        // read the file and create the function based on the flowchart
        const p = new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = function(){
                // parse the flowchart
                const fl = CircularJSON.parse(reader.result.toString()).flowchart;
                // create function
                var funcs = [];
                var func: IFunction = <IFunction>{
                    module: <IFlowchart>{
                        name: fl.name,
                        nodes: fl.nodes,
                        edges: fl.edges
                    },
                    name: event.target.files[0].name.split('.')[0],
                };

                // go through the nodes
                func.argCount = fl.nodes[0].procedure.length;
                func.args = fl.nodes[0].procedure.map(prod => {
                    return <IArgument>{
                        name: prod.args[prod.argCount-2].value.substring(1,prod.args[prod.argCount-2].value.length-1),
                        default: prod.args[prod.argCount-1].default,
                        value: undefined,
                        min: undefined,
                        max: undefined
                    };
                });
                if (!func.argCount){
                    resolve('error');
                }

                // add func and all the imported functions of the imported flowchart to funcs
                funcs.push(func);
                for (let i of fl.functions){
                    funcs.push(i)
                }
                resolve(funcs)
            }
            reader.onerror = function(){
                resolve('error')
            }
            reader.readAsText(event.target.files[0])
        });
        const fnc = await p;
        (<HTMLInputElement>document.getElementById('selectedFile')).value = "";
        if (fnc === 'error'){
            console.warn('Error reading file')
            return
        }
        this.imported.emit(fnc);
    }

    toggleAccordion(id: string){
        var acc = document.getElementById(id);
        //var acc = document.getElementsByClassName("accordion");
        acc.classList.toggle("active");
        var panel = <HTMLElement>acc.nextElementSibling;
        console.log(panel)
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
        
    }



    // todo: bug fix for defaults
    static extract_params(func: Function): [IArgument[], boolean] {
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


    static ModuleAware() {
    let module_list = [];
    for( let m_name in Modules ){
        if (m_name[0] == '_') continue;
        
        let modObj = <IModule>{};
        modObj.module = m_name;
        modObj.functions = [];
        
        for( let fn_name of Object.keys(Modules[m_name])){
            
            let func = Modules[m_name][fn_name];

            let fnObj = <IFunction>{};
            fnObj.module = m_name;
            fnObj.name = fn_name;
            fnObj.argCount = func.length;
            let args = ToolsetComponent.extract_params(func);
            fnObj.args = args[0];
            fnObj.hasReturn = args[1];
            modObj.functions.push(fnObj);
        }
        module_list.push(modObj);
    }

    return module_list;
    }
}
