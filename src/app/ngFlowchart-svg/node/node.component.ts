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

    inputOffset = [-10, 35];
    outputOffset = [110, 65];
    startType: string;
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

    startDragNode($event:MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.action.emit({ action: ACTIONS.DRAGNODE, data: $event});
    }

    startDragPort($event:MouseEvent, portType) {
        event.preventDefault();
        event.stopPropagation();
        let pos = this.node.position;
        var data: any;
        if (portType == 'input'){
            data = this.node.input;
            pos = [pos.x + this.inputOffset[0], pos.y + this.inputOffset[1]];
        } else {
            data = this.node.output;
            pos = [pos.x + this.outputOffset[0], pos.y + this.outputOffset[1]];
        }
        this.action.emit({ action: ACTIONS.DRAGPORT, data: data, position: pos, type: portType});
    }

    
    dropPort($event: MouseEvent, portType){
        var data: any;
        if (portType == 'input'){
            data = this.node.input;
        } else {
            data = this.node.output;
        }
        this.action.emit({ action: ACTIONS.DROPPORT, data: data, type: portType});
    }

    stopPropagation($event: Event){
        event.stopPropagation();
    }
    
}
