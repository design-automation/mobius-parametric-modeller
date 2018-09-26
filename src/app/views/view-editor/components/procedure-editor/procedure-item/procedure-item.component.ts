import { Component, Input, Output,  EventEmitter, OnInit, OnDestroy} from '@angular/core';

import { IProcedure } from '@models/procedure';
import { ProcedureTypesAware } from '@shared/decorators';

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

    emitDelete(index: number): void{
        this.delete.emit(index);
    }

    emitSelect($event, procedure: IProcedure){
        this.select.emit(procedure);
    }

    selectChild($event, procedure: IProcedure){
        event.stopPropagation();
        this.select.emit($event);
    }

    deleteChild($event, index: number): void{
        this.data.children.splice(index, 1);
    }
}