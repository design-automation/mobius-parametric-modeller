import { Component, Input, Output, EventEmitter} from '@angular/core';

import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';
import { fromEvent } from 'rxjs';
/*
 *	Displays the drag-drop procedure for a node
 *
 * 	Updates on:
 * 	- selected_node is changed
* 	- selected_node is updated
 */

@Component({
  selector: 'procedure-editor',
  templateUrl: './procedure-editor.component.html',
  styleUrls: ['./procedure-editor.component.scss']
})
export class ProcedureEditorComponent{

    @Input() node: INode;
    @Input() functions: IFunction[];
    @Output() imported = new EventEmitter();
    @Output() delete_Function = new EventEmitter();
    copiedProd: IProcedure[];

    private copyCheck: boolean = false;

    constructor() { }
    
    add(data: {type: ProcedureTypes, data: IFunction}): void {
      NodeUtils.add_procedure(this.node, data.type, data.data);
    }

    deleteFunction(data): void {
      this.delete_Function.emit(data);
    }

    deleteChild(index: number): void{
      this.node.procedure.splice(index, 1);
      NodeUtils.deselect_procedure(this.node);
    }

    selectProcedure($event, line): void{
      NodeUtils.select_procedure(this.node, $event.prod, $event.ctrl||false);
    }

    copyProd(){
      if (!this.copyCheck) return;
      console.log('copying', this.node.state.procedure)
      this.copiedProd = this.node.state.procedure;
    }

    cutProd($event){
      if (!this.copyCheck || document.activeElement.nodeName == "INPUT") return;
      console.log('cutting', this.node.state.procedure)
      this.copiedProd = this.node.state.procedure;
      var parentArray;
      for (let prod of this.copiedProd){
        if (prod.parent){
          parentArray = prod.parent.children;
        } else parentArray = this.node.procedure;

        for (let i = 0; i < parentArray.length; i++ ){
          if (parentArray[i] === prod){
            parentArray.splice(i, 1);
            break;
          }
        }
      }
      NodeUtils.deselect_procedure(this.node);
    }

    pasteProd($event){
      if (this.copyCheck && document.activeElement.nodeName.toUpperCase() != "INPUT"){
        const pastingPlace = this.node.state.procedure[0];
        if (pastingPlace === undefined){
          for (let i = 0; i< this.copiedProd.length; i++){
            console.log('pasting', this.copiedProd[i].ID)
            NodeUtils.paste_procedure(this.node, this.copiedProd[i]);
            this.node.state.procedure[0].selected = false;
            this.node.state.procedure = []
          }
        } else if (pastingPlace.children){
          for (let i = 0; i< this.copiedProd.length; i++){
            console.log('pasting', this.copiedProd[i].ID)
            NodeUtils.paste_procedure(this.node, this.copiedProd[i]);
            this.node.state.procedure[0].selected = false;
            pastingPlace.selected = true
            this.node.state.procedure = [pastingPlace]
          }

        } else {
          for (let i = this.copiedProd.length-1; i>=0; i --){
            console.log('pasting', this.copiedProd[i].ID)
            NodeUtils.paste_procedure(this.node, this.copiedProd[i]);
            this.node.state.procedure[0].selected = false;
            pastingPlace.selected = true
            this.node.state.procedure = [pastingPlace]
          }
        }
        //this.copiedProd = undefined;
      }
    }

    activateCopyPaste(): void{
      this.copyCheck = true;
    }
  
    deactivateCopyPaste(): void{
      this.copyCheck = false;
    }

    importFunction($event){
      this.imported.emit($event);
    }

}
