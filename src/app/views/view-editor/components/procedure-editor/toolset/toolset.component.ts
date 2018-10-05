import { Component, Output, EventEmitter} from '@angular/core';

import { ProcedureTypes } from '@models/procedure';
import { ModuleAware, ProcedureTypesAware } from '@shared/decorators';

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

    constructor(){ }
    
    add(type: ProcedureTypes): void{
        this.select.emit( { type: type, data: undefined } ); 
    }

    add_function(fnData){
        // create a fresh copy of the params to avoid linked objects
        // todo: figure out
        fnData.args = fnData.args.map( (arg) => { 
                return {name: arg.name, value: arg.value} 
            });
        
        this.select.emit( { type: ProcedureTypes.FUNCTION, data: fnData } ); 
    }

}
