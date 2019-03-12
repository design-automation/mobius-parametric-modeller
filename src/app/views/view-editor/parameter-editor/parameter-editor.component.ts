import { Component, Input, AfterContentInit, AfterViewInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { INode, NodeUtils } from '@models/node';
import { PortType } from '@models/port';
import { IFlowchart } from '@models/flowchart';
import { updateGlobals } from '@shared/parser';

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
    @Input() disableInput: boolean;
    @Output() eventAction = new EventEmitter();


    performAction(event: any, index: number) {
        // (delete)='deleteProd()'
        // (deleteC)='deleteChild(i)'
        // (disableProds)='markDisabled()'
        // (updateGlbs)='updateGlbs()'
        // (selectInp)='selectInput($event)'
        switch (event.type) {
            case 'delete':
                this.deleteProd();
                break;
            case 'deleteC':
                this.deleteChild(index);
                break;
            case 'disableProds':
                this.markDisabled();
                break;
            case 'updateGlbs':
                this.updateGlbs();
                break;
            case 'selectInp':
                this.selectInput(event.content);
                break;
        }
    }
    deleteProd() {
        this.eventAction.emit({
            'type': 'delete',
        });
    }

    deleteChild(index: number) {
        this.eventAction.emit({
            'type': 'regAction',
            'content': [{'type': 'del', 'parent': undefined, 'index': index, 'prod': this.node.procedure[index]}]
        });
        this.node.procedure.splice(index, 1);
        NodeUtils.deselect_procedure(this.node);
    }

    markDisabled() {
        this.eventAction.emit({
            'type': 'disableProds',
        });
    }

    selectInput(event) {
        this.eventAction.emit({
            'type': 'selectInp',
            'content': event
        });
    }

    inputSize(val) {
        return ctx.measureText(val).width + 7;
    }

    updateGlbs() {
        updateGlobals(this.node);
    }
}


