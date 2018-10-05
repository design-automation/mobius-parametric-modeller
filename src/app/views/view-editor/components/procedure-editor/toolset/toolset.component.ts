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
        
        this.select.emit( { type: ProcedureTypes.FUNCTION, data: fnData } ); 
    }

    add_imported_function(fnData){
        console.log('........',fnData);
        this.select.emit( { type: ProcedureTypes.IMPORTED, data: fnData } ); 
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
                for (let i of fl.nodes){
                    if (i.type == 'start'){
                        func.argCount = i.inputs.length;
                        func.args = [];
                        for (let j of i.inputs){
                            var arg: IArgument = <IArgument>{
                                name: j.name,
                                default: j.default
                            };
                            func.args.push(arg);
                        }
                    }
                }
                resolve(func)
            }
            reader.readAsText($event.target.files[0])
        });
        const fnc = await p;
        this.imported.emit(fnc);
        (<HTMLInputElement>document.getElementById('selectedFile')).value = "";
    }

}
