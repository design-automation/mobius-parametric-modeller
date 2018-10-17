import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { INode } from '@models/node';
import { ACTIONS } from './node.actions'

@Component({
  selector: '[node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent{
    
    @Input() node: INode;
    @Input() zoom: number;
    @Input() selected: boolean;
    
    @Input() node_index: number;

    @Output() action = new EventEmitter();

    startCoords = [];
    last = [0,0];    
    isDown = false;
    
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) { 
    }

    ngOnInit(){ 
    }

    updatePosition(position){ 
        //console.log('dragged...')
        this.node.position = position; 
    };

    nodeSelect($event){
        this.action.emit({ action: ACTIONS.SELECT });
    };

    nodeDelete($event){
        this.action.emit({ action: ACTIONS.DELETE });
    };

    nodeCopy($event){
        this.action.emit({ action: ACTIONS.COPY });
    }

    nodeConnected($event){
        this.action.emit({ action: ACTIONS.CONNECT, data: $event });
    }

    inputDraggable(): boolean{
        return !(this.node.type == 'start');
    }

    outputDraggable(): boolean{
        return !(this.node.type == 'end');
    }

    handleMouseDown($event:MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.action.emit({ action: ACTIONS.DRAGNODE, data: $event});
    }

    stopPropagation($event: Event){
        event.stopPropagation();
    }
    
}
