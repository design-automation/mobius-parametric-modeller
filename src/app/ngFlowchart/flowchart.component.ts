import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

// todo: make internal to flowchart
import { IFlowchart } from '@models/flowchart';
import { NodeUtils } from '@models/node';
import { ACTIONS } from './node/node.actions';

@Component({
  selector: 'flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent{

  @Input() data: IFlowchart;

  // TODO: Is this redundant?
  @Output() select = new EventEmitter();

  ngOnInit(){ }

  selectNode(node_index): void{
      //this.select.emit($event);
  }

  nodeAction($event, node_index): void{

    switch($event.action){
        case ACTIONS.SELECT:
          this.data.meta.selected_nodes = [ node_index ];  
          break;

        case ACTIONS.DELETE:
          // TODO: Add a delete function in NodeUtils / FlowchartUtils
          break;

        case ACTIONS.COPY:
          // TODO: Add a copy function in NodeUtils / FlowchartUtils
          break;

    }

  }

  isSelected(node_index: number): boolean{
    return this.data.meta.selected_nodes.indexOf(node_index) > -1;
  }

  addNode(): void{  this.data.nodes.push(NodeUtils.getNewNode());  }

}

