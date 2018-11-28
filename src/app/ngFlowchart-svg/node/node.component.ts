import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { INode } from '@models/node';
import { ACTIONS } from './node.actions';



@Component({
  selector: '[node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {

    @Input() node: INode;
    @Input() selected: boolean;
    @Input() inputOffset; // position offset of the input port as compared to the position of the node in svg
    @Input() outputOffset; // position offset of the output port as compared to the position of the node in svg


    @Output() action = new EventEmitter();
    startType: string;
    last = [0, 0];
    isDown = false;

    /*
    update the position of the node
    */
    updatePosition(position) {
        this.node.position = position;
    }

    /*
    select a node
    */
    nodeSelect(event) {
        this.action.emit({ action: ACTIONS.SELECT });
    }


    /*
    check if the input port of the node is draggable --> false only for start node, true otherwise
    */
    inputDraggable(): boolean {
        return !(this.node.type == 'start');
    }

    /*
    check if the output port of the node is draggable --> false only for end node, true otherwise
    */
    outputDraggable(): boolean {
        return !(this.node.type == 'end');
    }

    /*
    initiate dragging node when mousedown inside the node group
    */
    startDragNode(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.action.emit({ action: ACTIONS.DRAGNODE, data: event});
    }

    /*
    initiate dragging port when mousedown inside the port (inside the invisible stroke of the port)
    */
    startDragPort(event: MouseEvent, portType) {
        event.preventDefault();
        event.stopPropagation();
        let pos = this.node.position;
        let data: any;
        if (portType == 'input') {
            data = this.node.input;
            pos = [pos.x + this.inputOffset[0], pos.y + this.inputOffset[1]];
        } else {
            data = this.node.output;
            pos = [pos.x + this.outputOffset[0], pos.y + this.outputOffset[1]];
        }
        this.action.emit({ action: ACTIONS.DRAGPORT, data: data, position: pos, type: portType});
    }

    /*
    focus on the description of the node when mouse down inside the node
    ** no stopPropagation to allow propagation to startDragNode --> node can still be dragged
    */
    focusText(event: MouseEvent) {
        document.getElementById(this.node.id).focus();
    }

    /*
    switch the viewchild of the appModule to the node's procedure view when double-click on the node
    */
    switchToProcedure(event: Event) {
        this.action.emit({action: ACTIONS.PROCEDURE});
    }
}
