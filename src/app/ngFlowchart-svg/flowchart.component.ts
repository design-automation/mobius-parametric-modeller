import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';

// todo: make internal to flowchart
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';

import { ACTIONS } from './node/node.actions';
import * as circularJSON from 'circular-json';
import { fromEvent, Observable, Subscriber  } from 'rxjs';

declare const InstallTrigger: any;

@Component({
  selector: 'flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent{

  @Input() data: IFlowchart;
  @Output() switch = new EventEmitter(); 

  // general variable for mouse events
  private isDown: number;
  private startCoords = [];
  private canvas: any
  private element: any;

  // variable for flowchart zooming
  private mousePos =[0,0];
  private zoom: number = 1;

  // variable for edge
  private edge: IEdge  = { source: undefined, target: undefined, selected: false };
  private selectedEdge = [];
  private startType: string;

  // variable for copied node
  private copied: string;
  private copyListener = fromEvent(document, 'copy');
  private pasteListener = fromEvent(document, 'paste');
  private keydownListener = fromEvent(document, 'keydown');
  private copySub: any;
  private pasteSub: any;
  
  private offset;
  
  inputOffset = [50, -10, 50, -10];
  outputOffset = [50, 90, 50, 90];

  ngOnInit(){ 
    this.canvas = <HTMLElement>document.getElementById("svg-canvas");
    let bRect = <DOMRect>this.canvas.getBoundingClientRect();
    this.offset = [bRect.left, bRect.top]
  }


  nodeAction(event, node_index): void{

    switch(event.action){
      case ACTIONS.PROCEDURE:
        this.switch.emit("editor");
        this.deactivateKeyEvent();
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

      case ACTIONS.DRAGNODE:
        this.element = this.data.nodes[node_index];
        var pt = this.canvas.createSVGPoint();

        pt.x = event.data.pageX;
        pt.y = event.data.pageY;
  
        let svgP: any;
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox){
          let ctm = this.canvas.getScreenCTM()
          let bRect = this.canvas.getBoundingClientRect()
          ctm.a = ctm.a * this.zoom
          ctm.d = ctm.d * this.zoom
          ctm.e = bRect.x
          ctm.f = bRect.y
          svgP = pt.matrixTransform(ctm.inverse());
        } else {
          svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
        }
  
        this.startCoords = [
          svgP.x,
          svgP.y
        ];
        if (this.startCoords[0] == NaN){
          this.startCoords = [0,0];
        }
        this.isDown = 2;
        break;

      case ACTIONS.DRAGPORT:
        this.edge = <IEdge>{source: undefined, target: undefined, selected: false};
        if (event.type == 'input'){
          this.edge.target = event.data;
        } else {
          this.edge.source = event.data;
        }
        this.startType = event.type;
        this.element = <HTMLElement>document.getElementById("temporary-wire");
        this.element.setAttribute('x1', event.position[0]);
        this.element.setAttribute('y1', event.position[1]);
        this.element.setAttribute('x2', event.position[0]);
        this.element.setAttribute('y2', event.position[1]);
        this.isDown = 3;
        break;
    }

  }

  isSelected(node_index: number): boolean{
    return this.data.meta.selected_nodes.indexOf(node_index) > -1;
  }

  addNode(): void{  
    var newNode = NodeUtils.getNewNode();
    var pt = this.canvas.createSVGPoint();

    pt.x = 20;
    pt.y = 100;

    let svgP: any;
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox){
      let ctm = this.canvas.getScreenCTM()
      let bRect = this.canvas.getBoundingClientRect()
      ctm.a = ctm.a * this.zoom
      ctm.d = ctm.d * this.zoom
      ctm.e = bRect.x
      ctm.f = bRect.y
      svgP = pt.matrixTransform(ctm.inverse());
    } else {
      svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
    }
    newNode.position.x = svgP.x
    newNode.position.y = svgP.y
    this.data.nodes.push(newNode); 
  }

  activateKeyEvent(): void{
    this.copySub = this.copyListener.subscribe(val => {
      const node = this.data.nodes[this.data.meta.selected_nodes[0]];
      if (node.type != 'start' && node.type != 'end'){
        console.log('copied node:', node);
        let cp = circularJSON.parse(circularJSON.stringify(node));
        this.copied = circularJSON.stringify(cp);
      }
    })
    this.pasteSub = this.pasteListener.subscribe(val =>{
      if (this.copied){
        event.preventDefault();
        let newNode = <INode>circularJSON.parse(this.copied);
        var pt = this.canvas.createSVGPoint();
        pt.x = 20;
        pt.y = 100;
        const svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
        NodeUtils.updateNode(newNode, svgP);
        this.data.nodes.push(newNode);
        console.log('pasting node:', newNode);
      }
    })
    this.keydownListener.subscribe(val =>{
      if ((<KeyboardEvent> val).key == 'Delete'){
        this.deleteSelectedEdges();
      }
    })
  }

  deactivateKeyEvent(): void{

    this.copySub.unsubscribe();
    this.pasteSub.unsubscribe();
  }


  deleteSelectedNodes(){
    while (this.data.meta.selected_nodes.length > 0){
      let node_index = this.data.meta.selected_nodes.pop();
      let node = this.data.nodes[node_index];
      if (node.type == "start" || node.type == "end") continue;
      var edge_index = 0;
      while (edge_index < this.data.edges.length){
        let tbrEdge = this.data.edges[edge_index];
        if (tbrEdge.target.parentNode == node || tbrEdge.source.parentNode == node){
          this.deleteEdge(edge_index)
          continue;
        }
        edge_index += 1;
      }
      this.data.nodes.splice(Number(node_index),1)
    }
  }

  deleteEdge(edge_index){
    let tbrEdge = this.data.edges[edge_index];
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
    this.data.ordered = false
  }

  deleteSelectedEdges(){
    this.selectedEdge.sort().reverse();
    console.log(this.selectedEdge)
    for (let edge_index of this.selectedEdge){
      console.log(edge_index)
      this.deleteEdge(edge_index)
    }
    this.selectedEdge = [];
  }

  selectEdge(event, edge_index){
    if (event == 'ctrl'){
      this.selectedEdge.push(edge_index);
      this.data.edges[edge_index].selected = true;
    } else if (event == 'single' || (event === false && this.selectedEdge.length > 1)) {
      if (this.selectedEdge.length > 0){
        for (let e of this.selectedEdge) this.data.edges[e].selected = false;
      }
      this.selectedEdge = [edge_index];
      this.data.edges[edge_index].selected = true;
    } else {
      this.data.edges[edge_index].selected = false;
      for (let i = 0; i < this.selectedEdge.length; i ++) if (this.selectedEdge[i] == edge_index) {
        this.selectedEdge.splice(i,1);
        break;
      }
    }
  }

  resetViewer(): void{
    this.zoom = 1; 
    this.canvas.style.transition = 'transform 0ms ease-in';
    this.canvas.style.transformOrigin = `top left`;
    this.canvas.style.transform = "matrix(1,0,0,1,0,0)";
  }


  //
  //  node class is assigned a zoom value based on this value
  //  this position of this node is absolute coordinates
  //
  scale(event: WheelEvent): void{
    event.preventDefault();
    event.stopPropagation();
    let scaleFactor: number = 0.1;
    let value: number = this.zoom  - (Math.sign(event.deltaY))*scaleFactor;

    if(value >= 1 && value <= 2.5){
      value = Number( (value).toPrecision(5) )
    } else {
      return
    }

    if (value > this.zoom){
      this.mousePos = [event.clientX - this.offset[0], event.clientY - this.offset[1]]
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

  panStart(event:MouseEvent) {
    event.preventDefault();
    this.isDown = 1;
    this.canvas.style.transition = 'transform 0ms linear';
    this.canvas.style.transformOrigin = `top left`;
    let bRect = <DOMRect>this.canvas.getBoundingClientRect();
    this.startCoords = [
      event.clientX - (bRect.left - this.offset[0]),
      event.clientY - (bRect.top - this.offset[1])
    ];
    this.isDown = 1;
  }

  handleMouseMove(event:MouseEvent){
    if (!this.isDown) {
      return;
    } else if(this.isDown == 1){
      event.preventDefault();
      let bRect = <DOMRect>this.canvas.getBoundingClientRect();
      var x = Number(event.clientX - this.startCoords[0]);
      var y = Number(event.clientY - this.startCoords[1]);
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
      //let a = `translate(${x - this.startCoords[0]}px ,${y - this.startCoords[1]}px)`
      //console.log(transf)
      this.canvas.style.transform = "matrix(" + this.zoom + ",0,0,"+ this.zoom+","+ x+","+y+")";
      //this.canvas.style.transform = "matrix(1,1,1,1,1,1)";
    } else if(this.isDown == 2){

      var pt = this.canvas.createSVGPoint();

      pt.x = event.pageX;
      pt.y = event.pageY;

      let svgP: any;
      var isFirefox = typeof InstallTrigger !== 'undefined';
      if (isFirefox){
        let ctm = this.canvas.getScreenCTM()
        let bRect = this.canvas.getBoundingClientRect()
        ctm.a = ctm.a * this.zoom
        ctm.d = ctm.d * this.zoom
        ctm.e = bRect.x
        ctm.f = bRect.y
        svgP = pt.matrixTransform(ctm.inverse());
      } else {
        svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
      }

      const xDiff = this.startCoords[0] - svgP.x;
      const yDiff = this.startCoords[1] - svgP.y;
      this.startCoords[0] = svgP.x;
      this.startCoords[1] = svgP.y;

      this.element.position.x -= xDiff;
      this.element.position.y -= yDiff;


  } else if (this.isDown == 3){
      event.preventDefault();
      var pt = this.canvas.createSVGPoint();

      pt.x = event.pageX;
      pt.y = event.pageY;


      var isFirefox = typeof InstallTrigger !== 'undefined';
      if (isFirefox){
        let ctm = this.canvas.getScreenCTM()
        let bRect = this.canvas.getBoundingClientRect()
        ctm.a = ctm.a * this.zoom
        ctm.d = ctm.d * this.zoom
        ctm.e = bRect.x
        ctm.f = bRect.y
        const svgP = pt.matrixTransform(ctm.inverse());
        this.element.setAttribute('x2', svgP.x);
        this.element.setAttribute('y2', svgP.y);

      } else {
        const svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
        this.element.setAttribute('x2', svgP.x);
        this.element.setAttribute('y2', svgP.y);
      }
      
    }

  }

  handleMouseUp(event){
    // drop edge --> create new edge if drop position is within 15px of an input/output port
    if (this.isDown == 3){
      var pt = this.canvas.createSVGPoint();

      pt.x = event.pageX;
      pt.y = event.pageY;
      let svgP: any;

      var isFirefox = typeof InstallTrigger !== 'undefined';
      if (isFirefox){
        let ctm = this.canvas.getScreenCTM()
        let bRect = this.canvas.getBoundingClientRect()
        ctm.a = ctm.a * this.zoom
        ctm.d = ctm.d * this.zoom
        ctm.e = bRect.x
        ctm.f = bRect.y
        svgP = pt.matrixTransform(ctm.inverse());
      } else {
        svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
      }

      for (let n of this.data.nodes){
        var pPos;

        // find the node's corresponding port and its position
        if (this.startType == 'input'){
          if (this.edge.target.parentNode == n || n.type == 'end') continue;
          this.edge.source = n.output;

          pPos = [n.position.x+this.outputOffset[0], n.position.y+this.outputOffset[1]];
        } else {
          if (this.edge.source.parentNode == n || n.type == 'start') continue;
          this.edge.target = n.input;

          pPos = [n.position.x+this.inputOffset[0], n.position.y+this.inputOffset[1]];
        }

        // if the distance between the port's position and the dropped position is bigger than 15px, continue
        if (Math.abs(pPos[0]-svgP.x) > 25 || Math.abs(pPos[1]-svgP.y) > 25 ) continue;

        // if there is already an existing edge with the same source and target as the new edge, return
        for (let edge of this.data.edges){
          if (edge.target == this.edge.target && edge.source == this.edge.source){
            return;
          }
        }
        this.edge.target.edges.push(this.edge);
        this.edge.source.edges.push(this.edge);
        this.data.edges.push(this.edge);
        this.data.ordered = false;  
        break;

      }
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

