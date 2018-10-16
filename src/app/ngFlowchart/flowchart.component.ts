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
  private mousePos =[0,0];
  private zoom: number = 1;
  private isDown = false;
  private last = [0, 0];
  private startCoords = [];

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

  getMousePos(): string{
    //let value: string = "matrix(" + this.zoom + ",0,0,"+ this.zoom+","+this.mouse[0]+","+this.mouse[1]+")";
    //console.log(value)
    //console.log(this.mousePos[0]+'px '+this.mousePos[1]+'px')
    return this.mousePos[0]+'px '+this.mousePos[1]+'px';
  }

  getZoomStyle(): string{
    let value: string = "scale(" + this.zoom +")";
    //let value: string = "matrix(" + this.zoom + ",0,0,"+ this.zoom+","+this.mouse[0]+","+this.mouse[1]+")";
    //console.log(value)
    return value;
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
    
    if(value > 0.2 && value < 1.5){
      value = Number( (value).toPrecision(2) )
    } else {
      return
    }

    var newX = $event.clientX * value / this.zoom ;
    newX = Number( (newX).toPrecision(3) )
    var newY = $event.clientY * value / this.zoom ;
    newY = Number( (newY).toPrecision(3) )
    this.mousePos = [$event.clientX,$event.clientY];
    this.zoom = value;

    let element = <HTMLElement>document.getElementsByClassName("transform--container")[0];
    let transf = "scale(" + this.zoom + ")";
    //let a = `translate(${x - this.startCoords[0]}px ,${y - this.startCoords[1]}px)`
    element.style.webkitTransformOrigin = $event.screenX+'px '+$event.screenY+'px';
    element.style.webkitTransform = transf;

  }

  panStart(e):void{
    if (!e.ctrlKey){ return; }
    e.preventDefault();
    this.isDown = true;

    this.startCoords = [
      e.clientX - this.last[0],
      e.clientY - this.last[1]
    ];
    if (this.startCoords[0] == NaN){
      this.startCoords = [0,0];
    }
  }

  panMove(e):void{
    if (!e.ctrlKey) return;
    e.preventDefault();
    if(!this.isDown) return;
    let mainContainer = <HTMLElement>document.getElementById("flowchart-main-container");
    if (mainContainer != e.target) return;
    //console.log(e.target, e.clientX, e.clientY)
    var x = Number(e.clientX - this.startCoords[0]);
    var y = Number(e.clientY - this.startCoords[1]);
    //if (x > 0) x = 0;
    //if (y > 0) y = 0;
    let element = <HTMLElement>document.getElementsByClassName("transform--container")[0];
    let transf = "matrix(" + this.zoom + ",0,0,"+ this.zoom+","+ x+","+y+")"
    //let a = `translate(${x - this.startCoords[0]}px ,${y - this.startCoords[1]}px)`
    //console.log(transf)
    element.style.webkitTransform = transf;
  }

  panEnd(e):void{
    e.preventDefault();
    this.isDown = false;
    
    this.last = [
        e.clientX - this.startCoords[0],
        e.clientY - this.startCoords[1]
    ];
  }

  dragNodeOver($event){
    return false
  }

  dropNode($event){
    $event.preventDefault();
    if($event.ctrlKey) return;
    //@ts-ignore
    if (!(typeof InstallTrigger !== 'undefined')){
      return
    }


    const id = $event.dataTransfer.getData('text');
    
    for (let node of this.data.nodes){
      if (node.id == id){
        node.position.x = $event.clientX; 
        node.position.y = $event.clientY; 
        /*
        let relX: number = $event.pageX - posX; 
        let relY: number = $event.pageY - posY;
        if( (node.position.x + relX/this.zoom) < 0 || (node.position.y + relY/this.zoom) < 0){
          return;
        }
        
        node.position.x += relX; 
        node.position.y += relY; 
        */
      }
    }
    return
  }

}

