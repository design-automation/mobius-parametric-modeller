import { Component } from '@angular/core';
import { INode } from '@models/node';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent{

    private flowchart: IFlowchart;
    constructor(private dataService: DataService){
        this.flowchart = dataService.flowchart;
    }

    select_node(node: INode): void{  console.log('select node');  }
    
}
