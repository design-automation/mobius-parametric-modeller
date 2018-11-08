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
    
    emitDelete(index: number): void{
        this.delete.emit(index);
    }

    emitSelect($event, procedure: IProcedure){
        this.select.emit({"ctrl":$event.ctrlKey, "prod":procedure});
    }

    selectChild($event, procedure: IProcedure){
        event.stopPropagation();
        this.select.emit($event);
    }

    deleteChild($event, index: number): void{
        this.data.children.splice(index, 1);
    }

    stopProp($event):void{
        event.stopPropagation();
    }

    varMod($event){
        if(!$event) return $event;
        let str = $event.trim();
        str = str.replace(' ',"_");
        //str = str.replace('"',"'");
        return str;
    }

    resize(e, val){
        if(!val) {
            e.target.size = 1;
            return
        }
        e.target.size = val.length;
    }
}