import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

// todo: make internal to flowchart
import { IFlowchart } from '@models/flowchart';
import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';

import { ACTIONS } from './node/node.actions';
import * as circularJSON from 'circular-json';
import { fromEvent } from 'rxjs';
import { DataService } from '@services';
// import * as svgPanZoom from 'svg-pan-zoom';

declare const InstallTrigger: any;

// constant for the size of the svg canvas viewbox
const canvasSize = 1500;

@Component({
    selector: 'flowchart',
    templateUrl: './flowchart.component.html',
    styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent implements OnInit {

    @Output() switch = new EventEmitter();

    constructor(private dataService: DataService) {
    }

    viewbox = `0 0 ${canvasSize} ${canvasSize}`;

    // general variable for mouse events
    private isDown: number;
    private startCoords = [];
    private canvas: any;
    private element: any;

    // variable for flowchart zooming
    private mousePos = [0, 0];
    private zoom = 1;

    // variable for edge
    private edge: IEdge = { source: undefined, target: undefined, selected: false };
    private selectedEdge = [];
    private startType: string;

    // variable for copied node
    private copied: string;
    private copySub: any;
    private pasteSub: any;
    private keydownSub: any;

    // listener for events, only activated when the mouse is hovering over the svg component
    private keydownListener = fromEvent(document, 'keydown');
    private copyListener = fromEvent(document, 'copy');
    private pasteListener = fromEvent(document, 'paste');
    private listenerActive = false;

    // position of the current canvas view relative to the top left of the page
    private offset;

    // constants for offset positions of input/output port relative to the node's position
    inputOffset = [50, -8];
    outputOffset = [50, 88];

    static enableNode(node: INode) {
        for (const edge of node.input.edges) {
            if (!edge.source.parentNode.enabled) { return; }
        }
        node.enabled = true;
        for (const edge of node.output.edges) {
            FlowchartComponent.enableNode(edge.target.parentNode);
        }
    }


    static disableNode(node: INode) {
        node.enabled = false;
        for (const edge of node.output.edges) {
            FlowchartComponent.disableNode(edge.target.parentNode);
        }
    }

    ngOnInit() {
        this.canvas = <HTMLElement>document.getElementById('svg-canvas');
        // const panZoom = svgPanZoom(this.canvas);
        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        this.offset = [bRect.left, bRect.top];

        // copy: copy node
        this.copySub = this.copyListener.subscribe(val => {
            if (!this.listenerActive) { return; }
            const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
            if (node.type !== 'start' && node.type !== 'end') {
                console.log('copied node:', node);
                const cp = circularJSON.parse(circularJSON.stringify(node));
                this.copied = circularJSON.stringify(cp);
            }
        });

        // paste: paste copied node
        this.pasteSub = this.pasteListener.subscribe(val => {
            if (!this.listenerActive) { return; }
            if (this.copied) {
                event.preventDefault();
                const newNode = <INode>circularJSON.parse(this.copied);
                const pt = this.canvas.createSVGPoint();
                pt.x = 20;
                pt.y = 100;

                let svgP: any;
                const isFirefox = typeof InstallTrigger !== 'undefined';
                if (isFirefox) {
                        const ctm = this.canvas.getScreenCTM();
                        // const bRect = this.canvas.getBoundingClientRect();
                        ctm.a = ctm.a * this.zoom;
                        ctm.d = ctm.d * this.zoom;
                        ctm.e = bRect.x;
                        ctm.f = bRect.y;
                        svgP = pt.matrixTransform(ctm.inverse());
                } else {
                        svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
                }

                NodeUtils.updateNode(newNode, svgP);
                this.dataService.flowchart.nodes.push(newNode);
                console.log('pasting node:', newNode);
            }
        });

        // delete: delete selected edge(s)
        this.keydownSub = this.keydownListener.subscribe(val => {
            if (!this.listenerActive) { return; }
            if ((<KeyboardEvent> val).key === 'Delete') {
                this.deleteSelectedEdges();
            }
        });

    }

    /*
    handle event received from node component
    */
    nodeAction(event, node_index): void {

        switch (event.action) {

            // switch the viewchild of the appModule to the node's procedure view when double-click on the node
            case ACTIONS.PROCEDURE:
                this.switch.emit('editor');
                this.deactivateKeyEvent();
                break;

            // select a node
            case ACTIONS.SELECT:
                this.dataService.flowchart.meta.selected_nodes = [ node_index ];
                break;

            // initiate dragging node
            case ACTIONS.DRAGNODE:
                this.element = this.dataService.flowchart.nodes[node_index];
                const pt = this.canvas.createSVGPoint();

                // get current mouse position in the page
                pt.x = event.data.pageX;
                pt.y = event.data.pageY;

                // convert mouse position to svg position (special procedure for firefox)
                let svgP: any;
                const isFirefox = typeof InstallTrigger !== 'undefined';
                if (isFirefox) {
                    const ctm = this.canvas.getScreenCTM();
                    const bRect = this.canvas.getBoundingClientRect();
                    ctm.a = ctm.a * this.zoom;
                    ctm.d = ctm.d * this.zoom;
                    ctm.e = bRect.x;
                    ctm.f = bRect.y;
                    svgP = pt.matrixTransform(ctm.inverse());
                } else {
                    svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
                }

                // save the svg position as startCoords
                this.startCoords = [
                    svgP.x,
                    svgP.y
                ];
                if (this.startCoords[0] === NaN) {
                    this.startCoords = [0, 0];
                }
                // mark the dragging mode as dragNode
                this.isDown = 2;
                break;

            // initiate dragging input/output port
            case ACTIONS.DRAGPORT:
                // create a new edge
                this.edge = <IEdge>{source: undefined, target: undefined, selected: false};

                // assign the port to the edge's input/output accordingly
                if (event.type === 'input') {
                    this.edge.target = event.data;
                } else {
                    this.edge.source = event.data;
                }
                this.startType = event.type;

                // modify the temporary-edge's coordinate
                this.element = <HTMLElement>document.getElementById('temporary-wire');
                this.element.setAttribute('x1', event.position[0]);
                this.element.setAttribute('y1', event.position[1]);
                this.element.setAttribute('x2', event.position[0]);
                this.element.setAttribute('y2', event.position[1]);
                this.isDown = 3;
                break;
        }
    }

    // check if the node at node_index is selected
    isSelected(node_index: number): boolean {
        return this.dataService.flowchart.meta.selected_nodes.indexOf(node_index) > -1;
    }

    // add a new node
    addNode(): void {

        // create a new node
        const newNode = NodeUtils.getNewNode();

        // the new node's position would be (20,100) relative to the current view
        const pt = this.canvas.createSVGPoint();

        pt.x = 20;
        pt.y = 100;

        // convert the position to svg position
        let svgP: any;
        const isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            const ctm = this.canvas.getScreenCTM();
            const bRect = this.canvas.getBoundingClientRect();
            ctm.a = ctm.a * this.zoom;
            ctm.d = ctm.d * this.zoom;
            ctm.e = bRect.x;
            ctm.f = bRect.y;
            svgP = pt.matrixTransform(ctm.inverse());
        } else {
            svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
        }

        // assign the position to the new node and add it to the flowchart
        newNode.position.x = svgP.x;
        newNode.position.y = svgP.y;
        this.dataService.flowchart.nodes.push(newNode);
    }

    // activate event listener for copy (ctrl+c), paste (ctrl+v), delete (Delete) when mouse hover over the svg component
    activateKeyEvent(): void {
        this.listenerActive = true;
    }

    // deactivate the event listeners when the mouse exit the svg component
    deactivateKeyEvent(): void {
        this.listenerActive = false;
    }

    // delete selected node
    deleteSelectedNodes() {

        // for each of the selected node
        while (this.dataService.flowchart.meta.selected_nodes.length > 0) {
            const node_index = this.dataService.flowchart.meta.selected_nodes.pop();
            const node = this.dataService.flowchart.nodes[node_index];

            // continue if the node is a start/end node
            if (node.type === 'start' || node.type === 'end') { continue; }
            let edge_index = 0;

            // delete all the edges connected to the node
            while (edge_index < this.dataService.flowchart.edges.length) {
                const tbrEdge = this.dataService.flowchart.edges[edge_index];
                if (tbrEdge.target.parentNode === node || tbrEdge.source.parentNode === node) {
                    this.deleteEdge(edge_index, node.id);
                    continue;
                }
                edge_index += 1;
            }

            // remove the node from the flowchart
            this.dataService.flowchart.nodes.splice(Number(node_index), 1);
        }
    }

    // delete an edge with a known index
    deleteEdge(edge_index, deletedNode) {
        const tbrEdge = this.dataService.flowchart.edges[edge_index];

        // remove the edge from the target node's list of edges
        for (const i in this.dataService.flowchart.edges) {
            if (tbrEdge.target.edges[i] === tbrEdge) {
                tbrEdge.target.edges.splice(Number(i), 1);
                break;
            }
        }

        // remove the edge from the source node's list of edges
        for (const i in tbrEdge.source.edges) {
            if (tbrEdge.source.edges[i] === tbrEdge) {
                tbrEdge.source.edges.splice(Number(i), 1);
                break;
            }
        }

        if (tbrEdge.target.parentNode.input.edges.length === 0 && deletedNode !== tbrEdge.target.parentNode.id) {
            FlowchartComponent.disableNode(tbrEdge.target.parentNode);
        } else {
            FlowchartComponent.enableNode(tbrEdge.target.parentNode);
        }

        // remove the edge from the general list of edges
        this.dataService.flowchart.edges.splice(edge_index, 1);
        this.dataService.flowchart.ordered = false;
    }


    // delete all the selected edges
    deleteSelectedEdges() {
        this.selectedEdge.sort().reverse();
        for (const edge_index of this.selectedEdge) {
            this.deleteEdge(edge_index, undefined);
        }
        this.selectedEdge = [];
    }

    // select an edge
    selectEdge(event, edge_index) {

        // if ctrl is pressed, add the edge into the list of selected edges
        if (event === 'ctrl') {
            this.selectedEdge.push(edge_index);
            this.dataService.flowchart.edges[edge_index].selected = true;
        } else if (event === 'single' || (event === false && this.selectedEdge.length > 1)) {
            if (this.selectedEdge.length > 0) {
                for (const e of this.selectedEdge) { this.dataService.flowchart.edges[e].selected = false; }
            }
            this.selectedEdge = [edge_index];
            this.dataService.flowchart.edges[edge_index].selected = true;
        } else {
            this.dataService.flowchart.edges[edge_index].selected = false;
            for (let i = 0; i < this.selectedEdge.length; i ++) { if (this.selectedEdge[i] === edge_index) {
                this.selectedEdge.splice(i, 1);
                break;
            }
            }
        }
    }

    // focus view onto the flowchart
    focusFlowchart(): void {
        // find the frame of the flowchart: frame = [minX, minY, maxX, maxY]
        const frame = [this.dataService.flowchart.nodes[0].position.x, this.dataService.flowchart.nodes[0].position.y,
                                this.dataService.flowchart.nodes[0].position.x, this.dataService.flowchart.nodes[0].position.y];
        for (const node of this.dataService.flowchart.nodes) {
            if (node.position.x < frame[0]) {
                frame[0] = node.position.x;
            } else if (node.position.x > frame[2]) {
                frame[2] = node.position.x;
            }
            if (node.position.y < frame[1]) {
                frame[1] = node.position.y;
            } else if (node.position.y > frame[3]) {
                frame[3] = node.position.y;
            }
        }
        frame[2] += 100;
        frame[3] += 80;

        // calculate the zoom to fit the whole flowchart
        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const ctm = <SVGMatrix>this.canvas.getScreenCTM();
        let zoom = bRect.width / (ctm.a * (frame[2] - frame[0]));
        const heightZoom = bRect.height / (ctm.d * (frame[3] - frame[1]));
        if (zoom > heightZoom) { zoom = heightZoom; }
        if (zoom > 2.5) { zoom = 2.5; }

        // calculate the difference between height and width, if height is bigger than width,
        // centering the flowchart based on the difference
        const height_width_diff = ((frame[3] - frame[1]) - (frame[2] - frame[0])) / 2;
        if (height_width_diff > 0) {
            frame[0] -= height_width_diff;
        }

        // if the minX or minY goes below 0 (outside of svg frame), change them back to 0
        if (frame[0] < 0) { frame[0] = 0; }
        if (frame[1] < 0) { frame[1] = 0; }

        // transform
        this.canvas.style.transition = 'transform 0ms ease-in';
        this.canvas.style.transformOrigin = 'top left';
        this.canvas.style.transform =
        `matrix(${zoom},0,0,${zoom},${-frame[0] * ctm.a * zoom / this.zoom},${-frame[1] * ctm.a * zoom / this.zoom})`;
        this.zoom = zoom;
    }


    // scale view on mouse wheel
    scale(event: WheelEvent): void {
        event.preventDefault();
        event.stopPropagation();

        // calculate new zoom value
        const scaleFactor = 0.1;
        let value: number = this.zoom    - (Math.sign(event.deltaY)) * scaleFactor;

        // limit the zoom value to be between 1 and 2.5
        if (value >= 1 && value <= 2.5) {
            value = Number( (value).toPrecision(5) );
        } else {
            return;
        }


        /*
        // VER 1: translate before and after re-scaling
        this.mousePos = [event.pageX - this.offset[0], event.pageY - this.offset[1]];

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const beforeX = this.mousePos[0] - bRect.x + this.offset[0];
        const beforeY = this.mousePos[1] - bRect.y + this.offset[1];

        const afterX = beforeX / value + this.mousePos[0] * (value - this.zoom);
        const afterY = beforeY / value + this.mousePos[1] * (value - this.zoom);

        // find transformation matrix
        const m = this.canvas.createSVGMatrix()
        .translate(beforeX / this.zoom, beforeY / this.zoom)
        .scale(value)
        .translate(-afterX, -afterY);

        const transf = 'matrix(' + m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.e + ',' + m.f + ')';
        */

        /*
        // VER 2 : transform relative to the top-left of the bounding box of the canvas and adjust based on mouse position

        this.mousePos = [event.pageX - this.offset[0], event.pageY - this.offset[1]];

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        let newX = (bRect.left - this.offset[0] - this.mousePos[0] * (value - this.zoom)) / this.zoom;
        let newY = (bRect.top - this.offset[1]  - this.mousePos[1] * (value - this.zoom)) / this.zoom;
        const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();

        const m = this.canvas.createSVGMatrix()
        .scale(value)
        .translate(newX, newY);

        newX = m.e;
        newY = m.f;

        if (newX > 0) {
            newX = 0;
        } else if (boundingDiv.width - newX > bRect.width * value / this.zoom) {
            newX = boundingDiv.width - bRect.width * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        } else if (boundingDiv.height - newY > bRect.height * value / this.zoom) {
            newY = boundingDiv.height - bRect.height * value / this.zoom;
        }
        if (newY > 0) { newY = 0; }


        const transf = 'matrix(' + value + ', 0, 0,' + value + ',' + newX + ',' + newY + ')';
        */

        /*
        // VER 3: transform relative to the center of the canvas

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();

        let newX = (bRect.left - this.offset[0]) / this.zoom;
        let newY = (bRect.top - this.offset[1] ) / this.zoom;


        const m = this.canvas.createSVGMatrix()
        .scale(value)
        .translate(newX, newY);

        newX = m.e - boundingDiv.width * (value - this.zoom) / (2 * this.zoom);
        newY = m.f - boundingDiv.width * (value - this.zoom) / (2 * this.zoom);

        if (newX > 0) {
            newX = 0;
        } else if (boundingDiv.width - newX > bRect.width * value / this.zoom) {
            newX = boundingDiv.width - bRect.width * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        } else if (boundingDiv.height - newY > bRect.height * value / this.zoom) {
            newY = boundingDiv.height - bRect.height * value / this.zoom;
        }
        if (newY > 0) { newY = 0; }
        */

        // VER 4: transform relative to the mouse position
        this.mousePos = [event.pageX - this.offset[0], event.pageY - this.offset[1]];

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();

        let newX = ((bRect.left - this.offset[0]) * value - this.mousePos[0] * (value - this.zoom)) / this.zoom ;
        let newY = ((bRect.top - this.offset[1] ) * value - this.mousePos[1] * (value - this.zoom)) / this.zoom;

        // snapping back the x and y coordinates if they go out of the bounding box
        if (newX > 0) {
            newX = 0;
        } else if (boundingDiv.width - newX > bRect.width * value / this.zoom) {
            newX = boundingDiv.width - bRect.width * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        } else if (boundingDiv.height - newY > bRect.height * value / this.zoom) {
            newY = boundingDiv.height - bRect.height * value / this.zoom;
        }
        if (newY > 0) { newY = 0; }

        const transf = 'matrix(' + value + ', 0, 0,' + value + ',' + newX + ',' + newY + ')';

        // transform
        this.canvas.style.transition = 'transform 0ms ease-in';
        this.canvas.style.transformOrigin = `top left`;
        this.canvas.style.transform = transf;
        this.zoom = value;
    }


    // initiate dragging the view window
    panStart(event: MouseEvent) {
        event.preventDefault();

        this.canvas.style.transition = 'transform 0ms linear';
        this.canvas.style.transformOrigin = `top left`;
        const bRect = <DOMRect>this.canvas.getBoundingClientRect();

        // set start coords to current view window position
        this.startCoords = [
            event.clientX - (bRect.left - this.offset[0]),
            event.clientY - (bRect.top - this.offset[1])
        ];
        // set drag mode to drag view
        this.isDown = 1;
    }

    // handle mouse move for dragging view/node/port
    handleMouseMove(event: MouseEvent) {
        // return if no dragging initiated
        if (!this.isDown) {
            return;

        // if drag view
        } else if (this.isDown === 1) {
            event.preventDefault();
            const bRect = <DOMRect>this.canvas.getBoundingClientRect();
            let x = Number(event.clientX - this.startCoords[0]);
            let y = Number(event.clientY - this.startCoords[1]);
            const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();
            if (x > 0 || bRect.width < boundingDiv.width) {
                x = 0;
            } else if (boundingDiv.width - x > bRect.width) {
                x = boundingDiv.width - bRect.width;
            }
            if (y > 0 || bRect.height < boundingDiv.height) {
                y = 0;
            } else if (boundingDiv.height - y > bRect.height) {
                y = boundingDiv.height - bRect.height;
            }
            this.canvas.style.transform = 'matrix(' + this.zoom + ',0,0,' + this.zoom + ',' + x + ',' + y + ')';

        // if drag node
        } else if (this.isDown === 2) {

            const pt = this.canvas.createSVGPoint();

            pt.x = event.pageX;
            pt.y = event.pageY;

            let svgP: any;
            const isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) {
                const ctm = this.canvas.getScreenCTM();
                const bRect = this.canvas.getBoundingClientRect();
                ctm.a = ctm.a * this.zoom;
                ctm.d = ctm.d * this.zoom;
                ctm.e = bRect.x;
                ctm.f = bRect.y;
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

    // if drag port
    } else if (this.isDown === 3) {
            event.preventDefault();
            const pt = this.canvas.createSVGPoint();

            pt.x = event.pageX;
            pt.y = event.pageY;


            const isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) {
                const ctm = this.canvas.getScreenCTM();
                const bRect = this.canvas.getBoundingClientRect();
                ctm.a = ctm.a * this.zoom;
                ctm.d = ctm.d * this.zoom;
                ctm.e = bRect.x;
                ctm.f = bRect.y;
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

    handleMouseUp(event) {
        this.element = undefined;
        if (this.isDown === 3) {
            const pt = this.canvas.createSVGPoint();

            pt.x = event.pageX;
            pt.y = event.pageY;
            let svgP: any;

            const isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) {
                const ctm = this.canvas.getScreenCTM();
                const bRect = this.canvas.getBoundingClientRect();
                ctm.a = ctm.a * this.zoom;
                ctm.d = ctm.d * this.zoom;
                ctm.e = bRect.x;
                ctm.f = bRect.y;
                svgP = pt.matrixTransform(ctm.inverse());
            } else {
                svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
            }

            // reset temporary edge position to <(0,0),(0,0)>
            const tempLine = <HTMLElement>document.getElementById('temporary-wire');
            tempLine.setAttribute('x1', '0');
            tempLine.setAttribute('y1', '0');
            tempLine.setAttribute('x2', '0');
            tempLine.setAttribute('y2', '0');

            // go through all of the nodes' input/output ports
            for (const n of this.dataService.flowchart.nodes) {
                let pPos;

                // find the node's corresponding port and its position
                if (this.startType === 'input') {
                    if (this.edge.target.parentNode === n || n.type === 'end') { continue; }
                    this.edge.source = n.output;

                    pPos = [n.position.x + this.outputOffset[0], n.position.y + this.outputOffset[1]];
                } else {
                    if (this.edge.source.parentNode === n || n.type === 'start') { continue; }
                    this.edge.target = n.input;

                    pPos = [n.position.x + this.inputOffset[0], n.position.y + this.inputOffset[1]];
                }

                // if the distance between the port's position and the dropped position is bigger than 15px, continue
                if (Math.abs(pPos[0] - svgP.x) > 25 || Math.abs(pPos[1] - svgP.y) > 25 ) { continue; }

                // if there is already an existing edge with the same source and target as the new edge, return
                for (const edge of this.dataService.flowchart.edges) {
                    if (edge.target === this.edge.target && edge.source === this.edge.source) {
                        this.isDown = 0;
                        return;
                    }
                }
                this.edge.target.edges.push(this.edge);
                this.edge.source.edges.push(this.edge);
                this.dataService.flowchart.edges.push(this.edge);
                this.dataService.flowchart.ordered = false;
                if (this.edge.source.parentNode.enabled) {
                    FlowchartComponent.enableNode(this.edge.target.parentNode);
                } else {
                    FlowchartComponent.disableNode(this.edge.target.parentNode);
                }
                break;
            }
        }
        this.isDown = 0;
    }

}

