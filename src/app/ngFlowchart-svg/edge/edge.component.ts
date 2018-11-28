import {Component, OnInit, Input, ViewChild, ElementRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { IEdge } from '@models/edge';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styles: [`
    .edge{
        fill: none;
        stroke: rgb(80, 80, 80);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
        opacity: 1;
        pointer-events: stroke;
        marker-end: url(#arrow);
    }
    .inviEdge{
        fill: none;
        stroke: gray;
        stroke-width: 30px;
        opacity: 0;
        pointer-events: stroke;
    }
    .selected{
        stroke: rgb(0, 0, 150);
        opacity: 1;
        marker-end: url(#arrow_selected);

    }
  `]
})
export class EdgeComponent {

    @ViewChild('canvas') canvas: ElementRef;
    @Input() edge: IEdge;
    @Input() inputOffset;
    @Input() outputOffset;

    @Output() delete = new EventEmitter();
    @Output() selected = new EventEmitter();

    // select a wire
    select(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.edge.selected) {
            this.selected.emit(event.ctrlKey);
        } else {
            if (event.ctrlKey) { this.selected.emit('ctrl'); } else { this.selected.emit('single'); }
        }
    }

    // delete a wire
    deleteEdge() {
        this.delete.emit();
    }

}
