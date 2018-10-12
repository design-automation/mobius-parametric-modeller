import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

// todo: make internal to flowchart
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';

import { ACTIONS } from './node/node.actions';
import * as circularJSON from 'circular-json';


@Component({
  selector: 'flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent{

  @Input() data: IFlowchart;
  private edge: IEdge  = { source: undefined, target: undefined, selected: false };
  private temporaryEdge: boolean = false;
  private mouse;
  private zoom: number = 1;

  // TODO: Is this redundant?
  @Output() select = new EventEmitter();

  
  copied: string;

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
          // TODO: Delete all edges associated with this node
          this.data.nodes.splice( node_index, 1 );
          this.data.ordered = false;
          break;

        case ACTIONS.COPY:
          console.log('copied node:', this.data.nodes[node_index]);
          this.copied = circularJSON.stringify(this.data.nodes[node_index]);
          break;

        case ACTIONS.CONNECT:
          let edata = $event.data;

          if(edata.dragging){ 
            this.temporaryEdge = true;
            this.mouse = edata.mouse;
          };

          if(edata.dragover) this.temporaryEdge = false;

          if(edata.target) this.edge.target = edata.target;
          if(edata.source) this.edge.source = edata.source;

          if(this.edge.source && this.edge.target){
            // check if the edge already exists
            var existed = false;
            for (let edge of this.data.edges){
              if (edge.target === this.edge.target && edge.source === this.edge.source){
                existed = true;
                break;
              }
            }
            if (existed){
              break;
            }

            // add the edge
            this.data.edges.push(this.edge);

            // update target port's edge
            this.edge.target.edges.push(this.edge);
            this.edge.source.edges.push(this.edge);
            this.edge = { source: undefined, target: undefined, selected: false };
            this.temporaryEdge = false;
            this.data.ordered = false;
          }

          break;

    }

  }

  isSelected(node_index: number): boolean{
    return this.data.meta.selected_nodes.indexOf(node_index) > -1;
  }

  addNode(): void{  this.data.nodes.push(NodeUtils.getNewNode());  }

  deleteEdge(edge_index){ 
    const tbrEdge = this.data.edges[edge_index]
    for (let i in tbrEdge.target.edges){
      if (tbrEdge.target.edges[i] == tbrEdge){
        tbrEdge.target.edges.splice(Number(i), 1); 
        break;
      }
    }
    for (let i in tbrEdge.source.edges){
      if (tbrEdge.source.edges[i] == tbrEdge){
        tbrEdge.source.edges.splice(Number(i), 1);
        break;
      }
    }
    this.data.edges.splice(edge_index, 1); 
    this.data.ordered = false
  }

  copyNode($event): void{
    const node = this.data.nodes[this.data.meta.selected_nodes[0]];
    if (node.type != 'start' && node.type != 'end'){
      console.log('copied node:', node);
      this.copied = circularJSON.stringify(node);
    }
  }

  pasteNode($event): void{
    if (this.copied){
      const newNode = circularJSON.parse(this.copied);
      newNode.position = {x:0, y:0};
      this.data.nodes.push(newNode);
      console.log('pasting node:', newNode);
    }
  }

  resetViewer(): void{
    this.zoom = 1; 
    /*
    this.left = 0; 
    this.top = 0; 
    this.pan_mode = false;
    */
  }

  getZoomStyle(): string{
    let value: string = "scale(" + this.zoom + ")";
    return value;
  }

  getMousePos(): string{
    console.log('mouse pos:',this.mouse)
    return this.mouse;
  }

  //
  //  node class is assigned a zoom value based on this value
  //  this position of this node is absolute coordinates
  //
  scale($event: WheelEvent): void{

    $event.preventDefault();
    $event.stopPropagation();

    let scaleFactor: number = 0.1;
    let value: number = this.zoom  + (Math.sign($event.wheelDelta))*scaleFactor;
    
    if(value >= 0.2 && value <= 1.5){
      value = Number( (value).toPrecision(2) )
      this.zoom = Number( (value).toPrecision(2) );
    } else {
      return
    }
    this.mouse = `${$event.offsetX}px ${$event.offsetY}px`;

  }


}

