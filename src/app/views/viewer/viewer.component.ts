import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { IFlowchart } from '@models/flowchart';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit{

    private flowchart: IFlowchart;
    constructor(private dataService: DataService){
        this.flowchart = dataService.flowchart;
    }
    ngOnInit(){ }

    get_str(): string{
      return Object.keys(this.flowchart.nodes).join("__");
    }

    load_file(data): void{   }

    selectNode(node_index: number): void{  
      if( typeof(node_index) == 'number' ){
          this.flowchart.meta.selected_nodes = [node_index];  
      }
    }

}

