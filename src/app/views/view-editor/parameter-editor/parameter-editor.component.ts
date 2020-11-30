import { Component, Input, AfterContentInit, AfterViewInit, AfterViewChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { INode, NodeUtils } from '@models/node';
import { PortType } from '@models/port';
import { IFlowchart } from '@models/flowchart';
import { updateGlobals, modifyArgument, checkNodeValidity, checkConstantShadowing } from '@shared/parser';
import { DataService } from '@shared/services';
import { IProcedure } from '@models/procedure';

@Component({
  selector: 'parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent implements OnDestroy {
    @Input() node: INode;
    @Input() flowchart: IFlowchart;
    @Input() prodCheck: boolean;
    @Input() disableInput: boolean;
    @Output() eventAction = new EventEmitter();
    private ctx = document.createElement('canvas').getContext('2d');

    constructor(private dataService: DataService) {
        this.ctx.font = '400 12px \'inconsolata\'';
    }

    ngOnDestroy() {
        this.ctx = null;
    }


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
            case 'argMod':
                this.argMod(event.content);
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
        return this.ctx.measureText(val).width + 7;
    }

    updateGlbs() {
        updateGlobals(this.node);
        let error = '';
        for (let i = 1; i < this.flowchart.nodes.length; i++) {
            error += checkConstantShadowing(this.flowchart.nodes[i]);
        }
        if (error !== '') {
            this.dataService.notifyMessage(`Error: Constant shadowing in nodes:${error.slice(1)}`);
        }
    }

    // modify argument input: check if input is valid
    argMod(prod: IProcedure) {
        if (prod.args[1].value === undefined || prod.args[1].value === '') {
            prod.args[1].jsValue = undefined;
            return;
        }
        modifyArgument(prod, 1, this.node.procedure);
        if (prod.args[1].invalidVar) {
            this.dataService.notifyMessage(prod.args[1].invalidVar);
        }
    }

}


