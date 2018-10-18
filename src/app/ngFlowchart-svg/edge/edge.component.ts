import { Component, OnInit, Input, ViewChild, ElementRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { IEdge } from '@models/edge';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styles: [`
    .edge{
        stroke: green;
        stroke-width: 5px;
        opacity: 0.5;
        pointer-events: stroke
    }  
    .selected{
        stroke: blue;
        opacity: 0.8;
    }
  `]
})
export class EdgeComponent{

    @ViewChild('canvas') canvas: ElementRef;
    @Input() edge: IEdge;
    @Output() delete = new EventEmitter();

    inputOffset = [-10, 35];
    outputOffset = [110, 65];

    select($event){
        event.preventDefault();
        event.stopPropagation();
        this.edge.selected = !this.edge.selected;
    }

    deleteEdge(){ 
        this.delete.emit()
    }

    ngOnInit() {
    }

}
