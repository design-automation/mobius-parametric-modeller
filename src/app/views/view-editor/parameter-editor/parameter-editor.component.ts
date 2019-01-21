import { Component, Input, AfterContentInit, AfterViewInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { INode, NodeUtils } from '@models/node';
import { PortType } from '@models/port';
import { IFlowchart } from '@models/flowchart';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = 'bold 12px arial';

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent  {
    @Input() node: INode;
    @Input() flowchart: IFlowchart;
    @Input() prodCheck: boolean;
    @Output() selectInp = new EventEmitter();


    deleteProd(index: number) {
        this.node.procedure.splice(index, 1);
        NodeUtils.deselect_procedure(this.node);
    }

    inputSize(val) {
        return ctx.measureText(val).width + 2;
    }

    selectInput(event) {
        this.selectInp.emit(event);
    }
}


