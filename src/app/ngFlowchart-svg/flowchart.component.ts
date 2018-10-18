import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

// todo: make internal to flowchart
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';

import { ACTIONS } from './node/node.actions';
import * as circularJSON from 'circular-json';

const offset = [2, 47];

@Component({
  selector: 'flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent{

  @Input() data: IFlowchart;

  // general variable for mouse events
  private isDown: number;
  private startCoords = [];
  private canvas: any
  private element: any;

  // variable for flowchart zooming
  private mousePos =[0,0];
  private zoom: number = 1;

  // variable for edge dragging/dropping
  private edge: IEdge  = { source: undefined, target: undefined, selected: false };
  private startType: boolean;

  // variable for copied node
  private copied: string;

  

  ngOnInit(){ 
    this.canvas = <HTMLElement>document.getElementById("svg-canvas");
  }

  selectNode(node_index): void{
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
      case ACTIONS.DRAGNODE:
        this.element = this.data.nodes[node_index];
        this.startCoords = [
          $event.data.pageX,
          $event.data.pageY
        ];
        if (this.startCoords[0] == NaN){
          this.startCoords = [0,0];
        }
        this.isDown = 2;
        break;
      case ACTIONS.DRAGPORT:
        this.edge = <IEdge>{source: undefined, target: undefined, selected: false};
        if ($event.type == 'input'){
          this.edge.target = $event.data;
        } else {
          this.edge.source = $event.data;
        }
        this.startType = $event.type;
        this.element = <HTMLElement>document.getElementById("temporary-wire");
        this.element.setAttribute('x1', $event.position[0]);
        this.element.setAttribute('y1', $event.position[1]);
        this.element.setAttribute('x2', $event.position[0]);
        this.element.setAttribute('y2', $event.position[1]);
        this.isDown = 3;
        break;
      case ACTIONS.DROPPORT:
        if (this.startType == $event.type) return;
        if ($event.type == 'input'){
          this.edge.target = $event.data;
        } else {
          this.edge.source = $event.data;
        }
        for (let edge of this.data.edges){
          if (edge.target == this.edge.target && edge.source == this.edge.source){
            return;
          }
        }
        this.edge.target.edges.push(this.edge);
        this.edge.source.edges.push(this.edge);
        this.data.edges.push(this.edge);
        console.log('.......................')
        console.log(this.edge)
        console.log(this.data.edges)
        this.data.ordered = false;
        break;
    }

  }

  isSelected(node_index: number): boolean{
    return this.data.meta.selected_nodes.indexOf(node_index) > -1;
  }

  addNode(): void{  
    this.data.nodes.push(NodeUtils.getNewNode());  
  }

  deleteEdge(){
    var edge_index = 0
    while (edge_index < this.data.edges.length){
      let tbrEdge = this.data.edges[edge_index];
      if (!tbrEdge.selected){
        edge_index += 1;
        continue;
      }
      for (let i in this.data.edges){
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
    }
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
    
    if(value >= 1 && value <= 2.5){
      value = Number( (value).toPrecision(5) )
    } else {
      return
    }

    if (value > this.zoom){
      this.mousePos = [$event.clientX - offset[0], $event.clientY - offset[1]]
    }
    var m = this.canvas.createSVGMatrix()
    .translate(this.mousePos[0], this.mousePos[1])
    .scale(value)
    .translate(-this.mousePos[0], -this.mousePos[1]);
    let transf = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")"
    //console.log(transf)
    this.canvas.style.transition = 'transform 50ms ease-in';
    this.canvas.style.transformOrigin = `top left`;
    this.canvas.style.transform = transf;
    this.zoom = value;
  }

  panStart($event:MouseEvent) {
    event.preventDefault();
    this.isDown = 1;
    this.canvas.style.transition = 'transform 0ms linear';
    this.canvas.style.transformOrigin = `top left`;
    let bRect = <DOMRect>this.canvas.getBoundingClientRect();
    this.startCoords = [
      $event.clientX - (bRect.x - offset[0]),
      $event.clientY - (bRect.y - offset[1])
    ];
    this.isDown = 1;
  }

  handleMouseMove($event:MouseEvent){
    if (!this.isDown) {
      return;
    } else if(this.isDown == 1){
      event.preventDefault();
      var x = Number($event.clientX - this.startCoords[0]);
      var y = Number($event.clientY - this.startCoords[1]);
      let bRect = <DOMRect>this.canvas.getBoundingClientRect();
      let boundingDiv = <DOMRect>document.getElementById("flowchart-main-container").getBoundingClientRect();
      if (x > 0 || bRect.width < boundingDiv.width){
        x = 0
      } else if (boundingDiv.width - x > bRect.width){
        x = boundingDiv.width - bRect.width
      }
      if (y > 0 || bRect.height < boundingDiv.height){
        y = 0
      } else if (boundingDiv.height - y > bRect.height){
        y = boundingDiv.height - bRect.height
      }
      let transf = "matrix(" + this.zoom + ",0,0,"+ this.zoom+","+ x+","+y+")"
      //let a = `translate(${x - this.startCoords[0]}px ,${y - this.startCoords[1]}px)`
      //console.log(transf)
      this.canvas.style.transform = transf;
    } else if(this.isDown == 2){
      const xDiff = this.startCoords[0] - $event.pageX;
      const yDiff = this.startCoords[1] - $event.pageY;
    
      this.startCoords[0] = $event.pageX;
      this.startCoords[1] = $event.pageY;
    
      this.element.position.x -= xDiff;
      this.element.position.y -= yDiff;

  } else if (this.isDown == 3){
      event.preventDefault();
      var pt = this.canvas.createSVGPoint();

      pt.x = $event.pageX;
      pt.y = $event.pageY;

      const svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

      this.element.setAttribute('x2', svgP.x);
      this.element.setAttribute('y2', svgP.y);
    }

  }

  handleMouseUp($event){
    if (this.isDown == 3){
      let tempLine = <HTMLElement>document.getElementById("temporary-wire");
      tempLine.setAttribute('x1', '0');
      tempLine.setAttribute('y1', '0');
      tempLine.setAttribute('x2', '0');
      tempLine.setAttribute('y2', '0');
    }
    this.isDown = 0;
    this.element = undefined;
  }




}

