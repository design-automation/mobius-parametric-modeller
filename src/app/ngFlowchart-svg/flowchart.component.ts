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
  private edge: IEdge  = { source: undefined, target: undefined, selected: false };
  private mousePos =[0,0];
  private zoom: number = 1;
  private isDown: number;
  private screenOffset = [0, 0];
  private startCoords = [];
  private dragNode: INode;
  private element: any;

  
  copied: string;
  temporaryEdge: boolean;
  mouse: any;

  ngOnInit(){ }

  selectNode(node_index): void{
      //this.select.emit($event);
  }

  nodeAction($event, node_index): void{

    switch($event.action){
        case ACTIONS.DRAGNODE:
          this.dragNode = this.data.nodes[node_index];
          this.startCoords = [
            $event.data.pageX,
            $event.data.pageY
          ];
          if (this.startCoords[0] == NaN){
            this.startCoords = [0,0];
          }
          this.isDown = 2;
          break;
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
    this.element = <HTMLElement>document.getElementById("svg-canvas");
    //let transf = "scale(" + value + ")";
    var p = this.element.createSVGPoint();
    p.x = $event.clientX - offset[0];
    p.y = $event.clientY - offset[1];
    var m = this.element.createSVGMatrix()
            .translate(p.x, p.y)
            .scale(value)
            .translate(-p.x, -p.y);

    //let transf = "matrix(" + value + ",0,0,"+ value+","+ (- bRect.x + offset[0])+","+ (- bRect.y + offset[1])+")"
    let transf = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")"
    console.log(transf)
    //this.element.style.transition = 'transform 100ms';
    //this.element.style.webkitTransformOrigin = this.mousePos[0]+'px '+ this.mousePos[1]+'px';
    this.element.style.transition = 'transform 100ms ease-in';
    this.element.style.webkitTransformOrigin = `top left`;
    this.element.style.webkitTransform = transf;
    this.zoom = value;

    /*
function setCTM(element, matrix) {
    var m = matrix;
    var s = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")";
    
    element.setAttributeNS(null, "transform", s);
}

var svgEl = document.getElementById('svg');
var zoomEl = document.getElementById('zoom');
var zoomScale = 1;

svgEl.addEventListener('wheel', function(e) {
    var delta = e.wheelDeltaY;
    zoomScale = Math.pow(1.1, delta/360);
    
    var p = svgEl.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    
    p = p.matrixTransform( svgEl.getCTM().inverse() );
    
    var zoomMat = svgEl.createSVGMatrix()
            .translate(p.x, p.y)
            .scale(zoomScale)
            .translate(-p.x, -p.y);
    
    setCTM(zoomEl, zoomEl.getCTM().multiply(zoomMat));
});

    */
  }

  panStart($event:MouseEvent) {
    event.preventDefault();
    this.isDown = 1;
    this.element = <HTMLElement>document.getElementById("svg-canvas");
    let bRect = <DOMRect>this.element.getBoundingClientRect();
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
      let bRect = <DOMRect>this.element.getBoundingClientRect();
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
      this.element.style.transition = 'transform 0ms linear';
      this.element.style.webkitTransformOrigin = `top left`;
      this.element.style.webkitTransform = transf;
    } else if(this.isDown == 2){
      event.preventDefault();
      const xDiff = this.startCoords[0] - $event.pageX;
      const yDiff = this.startCoords[1] - $event.pageY;
    
      this.startCoords[0] = $event.pageX;
      this.startCoords[1] = $event.pageY;
    
      this.dragNode.position.x -= xDiff;
      this.dragNode.position.y -= yDiff;
    }

  }

  handleMouseUp($event){
    this.isDown = 0;
    this.dragNode = undefined;
  }




}

