import { Component, Input } from '@angular/core';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent{
    @Input() flowchart: IFlowchart; 

    constructor(){}

    selectNode(node_index: number): void{  
        if( typeof(node_index) == 'number' ){
            this.flowchart.meta.selected_nodes = [node_index];  
        }
    }

    importFunction(event){
        for (let func of event){
            this.flowchart.functions.push(func);
        }
    }

    deleteFunction(event){
        for (let i = 0; i < this.flowchart.functions.length; i++){
            if (this.flowchart.functions[i] == event){
                this.flowchart.functions.splice(i,1);
                break;
            }
        }
    }

}
