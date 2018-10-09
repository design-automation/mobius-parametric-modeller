import { Component, Input, Output, EventEmitter} from '@angular/core';

import { INode, NodeUtils } from '@models/node';
import { IProcedure, ProcedureTypes, IFunction } from '@models/procedure';
import { IFlowchart } from '@models/flowchart';

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
    copiedProd: IProcedure;

    constructor() { }

    add(data: {type: ProcedureTypes, data: IFunction}): void {
      NodeUtils.add_procedure(this.node, data.type, data.data);
    }

    deleteChild($event, index: number): void{
      this.node.procedure.splice(index, 1);
      NodeUtils.deselect_procedure(this.node);
    }

    selectProcedure($event): void{
      NodeUtils.select_procedure(this.node, $event);
    }

    setCopied($event){
      console.log('copying', $event)
      this.copiedProd = $event;
    }

    pasteProd($event){
      if (this.copiedProd){
        console.log('pasting',this.copiedProd.ID)
        NodeUtils.paste_procedure(this.node, this.copiedProd);
        //this.copiedProd = undefined;
      }
    }

    importFunction($event){
      this.imported.emit($event);
    }

}
