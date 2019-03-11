import {Component, OnInit, Input, ViewChild, ElementRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { IEdge } from '@models/edge';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.scss']
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
            this.selected.emit(event.ctrlKey || event.metaKey);
        } else {
            if (event.ctrlKey || event.metaKey) { this.selected.emit('ctrl'); } else { this.selected.emit('single'); }
        }
    }

    // delete a wire
    deleteEdge() {
        this.delete.emit();
    }

}
