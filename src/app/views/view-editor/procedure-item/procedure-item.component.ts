import { Component, Input, Output,  EventEmitter, OnInit, OnDestroy} from '@angular/core';

import { IProcedure, ProcedureTypes } from '@models/procedure';
import { ProcedureTypesAware } from '@shared/decorators';

import { _parameterTypes} from '@modules';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
ctx.font = "14px Arial";        

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
    ProcedureTypes = ProcedureTypes;

    // delete this procedure
    emitDelete(): void{
        this.delete.emit();
    }

    // select this procedure
    emitSelect(event, procedure: IProcedure){
        event.stopPropagation();
        this.select.emit({"ctrl":event.ctrlKey, "prod":procedure});
    }

    // delete child procedure (after receiving emitDelete from child procedure)
    deleteChild(index: number): void{
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

    canBePrinted(){
        return (this.data.argCount > 0 && this.data.args[0].name == 'var_name')
    }

    haveHelpText(){
        return (this.data.type == ProcedureTypes.Function || this.data.type ==  ProcedureTypes.Imported)
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


    updateInputSize(event){
        let val = event.target.value||event.target.placeholder;
        event.target.style.width = ctx.measureText(val).width + 10 + 'px';
    }
}