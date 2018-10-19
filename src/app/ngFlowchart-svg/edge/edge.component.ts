import {Component, OnInit, Input, ViewChild, ElementRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { IEdge } from '@models/edge';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styles: [`
    .edge{
        fill: none;
        stroke: green;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 5px;
        opacity: 0.6;
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
    @Input() inputOffset;
    @Input() outputOffset;

    @Output() delete = new EventEmitter();

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
