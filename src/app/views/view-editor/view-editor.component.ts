import { Component, Input, EventEmitter, Output} from '@angular/core';
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { ProcedureTypes, IFunction, IProcedure } from '@models/procedure';
import { DataService } from '@services';

@Component({
  selector: 'view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent {
    /*
    @Input() flowchart: IFlowchart;
    @Input() node: INode;
    */

    @Output() imported = new EventEmitter();
    @Output() delete_Function = new EventEmitter();
    @Output() helpText = new EventEmitter();
    copiedProd: IProcedure[];
    copiedType: string;

    private copyCheck = false;

    constructor(private dataService: DataService) {
    }

    // add a procedure
    add(data: {type: ProcedureTypes, data: IFunction}): void {
      NodeUtils.add_procedure(this.dataService.node, data.type, data.data);
    }

    // delete a procedure
    deleteChild(index: number): void {
      this.dataService.node.procedure.splice(index, 1);
      NodeUtils.deselect_procedure(this.dataService.node);
    }

    // select a procedure
    selectProcedure(event, line): void {
      NodeUtils.select_procedure(this.dataService.node, event.prod, event.ctrl || false);
    }

    // copy selected procedures
    copyProd() {
        const node = this.dataService.node;
        if (!this.copyCheck || node.type === 'end') { return; }
        console.log('copying', node.state.procedure);
        this.copiedType = node.type;
        this.copiedProd = node.state.procedure;
    }

    // cut selected procedures
    cutProd(event) {
        const node = this.dataService.node;
        if (!this.copyCheck || document.activeElement.nodeName === 'INPUT' || node.type === 'end') { return; }
        console.log('cutting', node.state.procedure);
        this.copiedType = node.type;
        this.copiedProd = node.state.procedure;
        let parentArray;
        for (const prod of this.copiedProd) {
            if (prod.parent) {
                parentArray = prod.parent.children;
            } else { parentArray = node.procedure; }

            for (let i = 0; i < parentArray.length; i++ ) {
                if (parentArray[i] === prod) {
                    parentArray.splice(i, 1);
                    break;
                }
            }
        }
        NodeUtils.deselect_procedure(node);
    }

    // paste copied procedures
    pasteProd(event) {
        const node = this.dataService.node;
        if (this.copyCheck
        && this.copiedProd
        && this.copiedType === node.type
        && document.activeElement.nodeName.toUpperCase() !== 'INPUT'
        && document.activeElement.nodeName.toUpperCase() !== 'TEXTAREA') {
            const pastingPlace = node.state.procedure[0];
            if (pastingPlace === undefined) {
            for (let i = 0; i < this.copiedProd.length; i++) {
                console.log('pasting', this.copiedProd[i].ID);
                NodeUtils.paste_procedure(node, this.copiedProd[i]);
                node.state.procedure[0].selected = false;
                node.state.procedure = [];
            }
            } else if (pastingPlace.children) {
            for (let i = 0; i < this.copiedProd.length; i++) {
                console.log('pasting', this.copiedProd[i].ID);
                NodeUtils.paste_procedure(node, this.copiedProd[i]);
                node.state.procedure[0].selected = false;
                pastingPlace.selected = true;
                node.state.procedure = [pastingPlace];
            }

            } else {
            for (let i = this.copiedProd.length - 1; i >= 0; i --) {
                console.log('pasting', this.copiedProd[i].ID);
                NodeUtils.paste_procedure(node, this.copiedProd[i]);
                node.state.procedure[0].selected = false;
                pastingPlace.selected = true;
                node.state.procedure = [pastingPlace];
            }
            }
            // this.copiedProd = undefined;
      }
    }

    // activate copying/cutting/pasting when the mouse hovers over the procedure list
    activateCopyPaste(): void {
      this.copyCheck = true;
    }

    // deactivate copying/cutting/pasting when the mouse exit the procedure list
    deactivateCopyPaste(): void {
      this.copyCheck = false;
    }

    // import a flowchart as function
    importFunction(event) {
      for (const func of event) {
        this.dataService.flowchart.functions.push(func);
      }
    }

    // delete an imported function
    deleteFunction(event) {
        for (let i = 0; i < this.dataService.flowchart.functions.length; i++) {
            if (this.dataService.flowchart.functions[i] === event) {
                this.dataService.flowchart.functions.splice(i, 1);
                break;
            }
        }
    }

    emitHelpText(event) {
        if (typeof(event) === 'string') {
            for (const func of this.dataService.flowchart.functions) {
                if (func.name === event) {
                    this.helpText.emit(func.doc);
                }
            }
        } else {
            this.helpText.emit(event);
        }
    }

}
