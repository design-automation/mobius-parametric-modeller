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
    @Output() copied = new EventEmitter();
    @Output() pasteOn = new EventEmitter();

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

    copyProd($event, procedure: IProcedure): void{
        event.stopPropagation();
        this.copied.emit(procedure);
    }

    cutProd($event, procedure: IProcedure): void{
        event.stopPropagation();
        this.copied.emit(procedure);
        this.delete.emit(undefined);
    }

    pasteProd($event, procedure: IProcedure): void{
        event.stopPropagation();
        this.pasteOn.emit(procedure);
    }

    copyChild($event): void{
        event.stopPropagation();
        this.copied.emit($event);
    }

    pasteChild($event): void{
        event.stopPropagation();
        this.pasteOn.emit($event);
    }

}