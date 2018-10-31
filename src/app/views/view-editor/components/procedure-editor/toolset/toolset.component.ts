import { Component, Output, EventEmitter, Input} from '@angular/core';

import { ProcedureTypes, IFunction } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';
import { ModuleAware, ProcedureTypesAware } from '@shared/decorators';
import * as CircularJSON from 'circular-json';
import { IArgument } from '@models/code';
/*
 *	Independent of node; 
 *  Emits action for parent to act on about which procedure type
 *  was clicked
 */

@ProcedureTypesAware
@ModuleAware
@Component({
  selector: 'toolset',
  templateUrl: './toolset.component.html',
  styleUrls: ['./toolset.component.scss']
})
export class ToolsetComponent{

    @Output() select = new EventEmitter();
    @Output() imported = new EventEmitter();
    @Input() functions: IFunction[];
    @Input() nodeType: string;
    @Input() prodCount: number;

    constructor(){}
    
    add(type: ProcedureTypes): void{
        this.select.emit( { type: type, data: undefined } ); 
    }

    add_function(fnData){
        // create a fresh copy of the params to avoid linked objects
        // todo: figure out
        fnData.args = fnData.args.map( (arg) => { 
            return {name: arg.name, value: arg.value};
            });
        
        this.select.emit( { type: ProcedureTypes.Function, data: fnData } ); 
    }

    add_imported_function(fnData){
        fnData.args = fnData.args.map( (arg) => { 
            return {name: arg.name, value: arg.value};
            });
        this.select.emit( { type: ProcedureTypes.Imported, data: fnData } ); 
    }

    async import_function($event){
        const p = new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = function(){
                const fl = CircularJSON.parse(reader.result.toString()).flowchart;
                var func: IFunction = <IFunction>{
                    module: <IFlowchart>{
                        nodes: fl.nodes,
                        edges: fl.edges
                    },
                    name: $event.target.files[0].name.split('.')[0],
                };
                var funcs = [];
                for (let i of fl.nodes){
                    if (i.type == 'start'){
                        func.argCount = i.input.length;
                        var arg: IArgument = <IArgument>{
                            name: i.input.name,
                            default: i.input.default
                        };
                        func.args = [arg];
                    }
                }
                if (!func.hasOwnProperty('argCount')){
                    resolve('error');
                }
                funcs.push(func);
                for (let i of fl.functions){
                    funcs.push(i)
                }
                resolve(funcs)
            }
            reader.onerror = function(){
                resolve('error')
            }
            reader.readAsText($event.target.files[0])
        });
        const fnc = await p;
        (<HTMLInputElement>document.getElementById('selectedFile')).value = "";
        if (fnc === 'error'){
            console.warn('Error reading file')
            return
        }
        this.imported.emit(fnc);
    }

}
