import { Component, Input, Output,  EventEmitter, OnInit, OnDestroy} from '@angular/core';

import { IProcedure } from '@models/procedure';
import { ProcedureTypesAware } from '@shared/decorators';
import { _parameterTypes} from '@modules';

@ProcedureTypesAware
@Component({
    selector: 'procedure-item',
    templateUrl: './procedure-item.component.html', 
    styleUrls: ['procedure-item.component.scss']
})
export class ProcedureItemComponent{
    @Input() data: IProcedure;
    @Output() delete = new EventEmitter();
    @Output() select = new EventEmitter();
    @Output() copied = new EventEmitter();
    @Output() pasteOn = new EventEmitter();

    private model = _parameterTypes.model;
    private constList = _parameterTypes.constList;
    
    // delete this procedure
    emitDelete(index: number): void{
        this.delete.emit(index);
    }

    // select this procedure
    emitSelect(event, procedure: IProcedure){
        event.stopPropagation();
        this.select.emit({"ctrl":event.ctrlKey, "prod":procedure});
    }

    // delete child procedure (after receiving emitDelete from child procedure)
    deleteChild(event, index: number): void{
        this.data.children.splice(index, 1);
    }

    // select child procedure (after receiving emitSelect from child procedure)
    selectChild(event, procedure: IProcedure){
        this.select.emit(event);
    }

    markPrint(){
        this.data.print = !this.data.print;
    }

    markDisabled(){
        this.data.enabled = !this.data.enabled;
    }

    // stopPropagation to prevent cut/paste with input box focused
    stopProp(event):void{
        event.stopPropagation();
    }

    // modify input: replace space " " with underscore "_"
    varMod(event){
        if(!event) return event;
        let str = event.trim();
        str = str.replace(/ /g,"_");
        return str;
    }
}