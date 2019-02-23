import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { NodeUtils, INode } from '@models/node';
import { IEdge } from '@models/edge';

import { ACTIONS } from './node/node.actions';
import * as circularJSON from 'circular-json';
import { fromEvent } from 'rxjs';
import { DataService } from '@services';

// import size of the canvas
import { canvasSize } from '@models/flowchart';
import { Router } from '@angular/router';
import { SplitComponent } from 'angular-split';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { getViewerData } from '@shared/getViewerData';

declare const InstallTrigger: any;


@Component({
    selector: 'view-flowchart',
    templateUrl: './view-flowchart.component.html',
    styleUrls: ['./view-flowchart.component.scss']
})
export class ViewFlowchartComponent implements OnInit, AfterViewInit {

    viewerData = getViewerData;
    @Output() switch = new EventEmitter();
    @ViewChild('flowchartSplit') flowchartSplit: SplitComponent;

    constructor(private dataService: DataService, private router: Router) {
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url);
    }

    viewbox = `0 0 ${canvasSize} ${canvasSize}`;

    // general variable for mouse events
    private isDown: number;
    private starTxyzs = [];
    private canvas: any;
    private element: any;

    // variable for flowchart zooming
    private mousePos = [0, 0];
    private zoom = 10;
    private minZoom = 5;
    private maxZoom = 25;
    private zoomFactor = 1;

    // variable for edge
    private edge: IEdge = { source: undefined, target: undefined, selected: false };
    private selectedEdge = [];
    private startType: string;

    // variable for copied node
    private copied: string;
    private copySub: any;
    private pasteSub: any;
    private keydownSub: any;
    private splitDragSub: any;

    // listener for events, only activated when the mouse is hovering over the svg component
    private keydownListener = fromEvent(document, 'keydown');
    private copyListener = fromEvent(document, 'copy');
    private pasteListener = fromEvent(document, 'paste');
    private listenerActive = false;

    notificationMessage = '';
    notificationTrigger = true;


    // position of the current canvas view relative to the top left of the page
    private offset: number[];

    // constants for offset positions of input/output port relative to the node's position
    inputOffset = [50, 40];
    outputOffset = [50, 40];


    static enableNode(node: INode) {
        for (const edge of node.input.edges) {
            if (!edge.source.parentNode.enabled) { return; }
        }
        node.enabled = true;
        for (const edge of node.output.edges) {
            ViewFlowchartComponent.enableNode(edge.target.parentNode);
        }
    }


    static disableNode(node: INode) {
        node.enabled = false;
        for (const edge of node.output.edges) {
            ViewFlowchartComponent.disableNode(edge.target.parentNode);
        }
    }

    ngOnInit() {
        this.canvas = <HTMLElement>document.getElementById('svg-canvas');
        // const panZoom = svgPanZoom(this.canvas);
        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();
        this.offset = [bRect.left, bRect.top];

        /*
        */
        // transform
        if (!this.dataService.flowchartPos) {
            this.dataService.flowchartPos = 'matrix(' + this.zoom + ', 0, 0,' + this.zoom + ', -' +
            boundingDiv.width * this.zoom / 2 + ', -' + boundingDiv.width * this.zoom / 2 + ')';
        } else {
            this.zoom = Number(this.dataService.flowchartPos.split(',')[3]);
        }

        this.canvas.style.transform = this.dataService.flowchartPos;

        // copy: copy node
        this.copySub = this.copyListener.subscribe(val => {
            // || document.activeElement.tagName === 'TEXTAREA'
            if (!this.listenerActive) { return; }
            const node = this.dataService.node;
            if (node.type === '') {
                const saved = {
                    'input': node.input,
                    'output': node.output,
                    'model': node.model
                };
                node.input = undefined;
                node.output = undefined;
                node.model = undefined;
                this.copied = circularJSON.stringify(node);

                node.input = saved.input;
                node.output = saved.output;
                node.model = saved.model;

                this.notificationMessage = `Copied Last Selected Node`;
                this.notificationTrigger = !this.notificationTrigger;
            }
        });

        // paste: paste copied node
        this.pasteSub = this.pasteListener.subscribe((val: ClipboardEvent) => {
            //
            if (!this.listenerActive || document.activeElement.tagName === 'TEXTAREA') { return; }
            if (this.copied) {
                event.preventDefault();
                const newNode = <INode>circularJSON.parse(this.copied);
                const pt = this.canvas.createSVGPoint();
                pt.x = 20;
                pt.y = 100;

                const svgP = this.convertCoord(pt);

                NodeUtils.updateNode(newNode, svgP);
                newNode.enabled = false;
                this.dataService.flowchart.nodes.push(newNode);
                this.notificationMessage = `Pasted Node`;
                this.notificationTrigger = !this.notificationTrigger;

                this.dataService.registerFlwAction({'type': 'add', 'nodes': [newNode]});
            }
        });

        // delete: delete selected edge(s)
        this.keydownSub = this.keydownListener.subscribe((event: KeyboardEvent) => {
            if (!this.listenerActive) { return; }
            if (event.key === 'Delete') {
                if (this.selectedEdge.length > 0) {
                    this.deleteSelectedEdges();
                } else {
                    if (document.activeElement.id !== this.dataService.node.id) {
                        this.deleteSelectedNodes();
                    }
                }
            } else if (event.key.toLowerCase() === 'z' && event.ctrlKey === true) {
                let act: any;
                if (event.shiftKey) {
                    act = this.dataService.redoFlw();
                } else {
                    act = this.dataService.undoFlw();
                }
                if (!act) { return; }
                if ( (act.type === 'add') !== event.shiftKey ) {
                    if (act.edges) {
                        for (const tbrEdge of act.edges) {
                            for (let i = 0; i < this.dataService.flowchart.edges.length; i++) {
                                if (this.dataService.flowchart.edges[i] === tbrEdge) {
                                    this.deleteEdge(i);
                                    break;
                                }
                            }
                        }
                    }
                    if (!act.nodes) { return; }
                    for (const tbrNode of act.nodes) {
                        let nodeIndex: number;
                        for (let i = 0; i < this.dataService.flowchart.nodes.length; i++) {
                            const node = this.dataService.flowchart.nodes[i];
                            if (tbrNode.id === node.id) {
                                nodeIndex = i;
                                this.dataService.flowchart.nodes.splice(i, 1);
                                break;
                            }
                        }
                        let tbrSel: number;
                        for (let j = 0; j < this.dataService.flowchart.meta.selected_nodes.length; j++) {
                            if (tbrSel) {
                                this.dataService.flowchart.meta.selected_nodes[j] -= 1;
                            }
                            if (this.dataService.flowchart.meta.selected_nodes[j] === nodeIndex) {
                                tbrSel = nodeIndex;
                            }
                        }
                        this.dataService.flowchart.meta.selected_nodes.splice(tbrSel, 1);
                    }
                } else {
                    if (act.nodes) {
                        for (const tbaNode of act.nodes) {
                            this.dataService.flowchart.nodes.push(tbaNode);
                        }
                    }
                    if (!act.edges) { return; }
                    for (const tbaEdge of act.edges) {
                        this.dataService.flowchart.edges.push(tbaEdge);
                        tbaEdge.target.edges.push(tbaEdge);
                        tbaEdge.source.edges.push(tbaEdge);
                        tbaEdge.selected = false;
                        if (tbaEdge.source.parentNode.enabled) {
                            tbaEdge.target.parentNode.enabled = true;
                        }
                    }
                    while (true) {
                        let check = false;
                        for (const node of this.dataService.flowchart.nodes) {
                            if (node.enabled) { continue; }
                            for (const inp of node.input.edges) {
                                if (inp.source.parentNode.enabled) {
                                    node.enabled = true;
                                    check = true;
                                    break;
                                }
                            }
                        }
                        if (!check) {
                            break;
                        }
                    }
                }
            }
        });

    }
    convertCoord(pt) {
        const isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            const ctm = this.canvas.getScreenCTM();
            const bRect = this.canvas.getBoundingClientRect();
            ctm.a = ctm.a * this.zoom;
            ctm.d = ctm.d * this.zoom;
            ctm.e = bRect.x;
            ctm.f = bRect.y;
            return pt.matrixTransform(ctm.inverse());
        } else {
            return pt.matrixTransform(this.canvas.getScreenCTM().inverse());
        }

    }

    ngAfterViewInit() {
        if (this.dataService.newFlowchart) {
            this.focusFlowchart();
            this.dataService.newFlowchart = false;
        } else if (this.dataService.splitUpdate) {
            this.focusFlowchart();
            this.dataService.splitUpdate = false;
        }

    }

    /*
    handle event received from node component
    */
    nodeAction(event, node_index): void {

        switch (event.action) {

            // switch the viewchild of the appModule to the node's procedure view when double-click on the node
            case ACTIONS.PROCEDURE:
                this.router.navigate(['/editor']);
                // this.switch.emit('editor');
                this.deactivateKeyEvent();
                break;

            // select a node
            case ACTIONS.SELECT:
                const selectedNode = this.dataService.flowchart.nodes[node_index];
                if (event.ctrlKey) {
                    document.getElementById('executeButton').focus();
                    const index = this.dataService.flowchart.meta.selected_nodes.indexOf(node_index);
                    if (index === -1) {
                        this.dataService.flowchart.meta.selected_nodes = [node_index].concat(
                            this.dataService.flowchart.meta.selected_nodes);
                    } else {
                        if (this.dataService.flowchart.meta.selected_nodes.length > 1) {
                            this.dataService.flowchart.meta.selected_nodes.splice(index, 1);
                        }
                    }
                } else {
                    if (selectedNode.type === ''
                    && this.dataService.flowchart.meta.selected_nodes.length === 1
                    && this.dataService.flowchart.meta.selected_nodes[0] === node_index) {
                        if (document.activeElement.id !== selectedNode.id) {
                            const textarea = <HTMLTextAreaElement>document.getElementById(selectedNode.id);
                            textarea.focus();
                            textarea.select();
                        }
                    } else {
                        document.getElementById('executeButton').focus();
                    }
                    this.dataService.flowchart.meta.selected_nodes = [ node_index ];
                }
                break;

            // initiate dragging node
            case ACTIONS.DRAGNODE:
                this.element = this.dataService.flowchart.nodes[node_index];
                const pt = this.canvas.createSVGPoint();

                // get current mouse position in the page
                pt.x = event.data.pageX;
                pt.y = event.data.pageY;

                // convert mouse position to svg position (special procedure for firefox)
                const svgP = this.convertCoord(pt);

                // save the svg position as starTxyzs
                this.starTxyzs = [
                    svgP.x,
                    svgP.y
                ];
                if (this.starTxyzs[0] === NaN) {
                    this.starTxyzs = [0, 0];
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
    addNode(event?): void {
        // create a new node
        const newNode = NodeUtils.getNewNode();

        // the new node's position would be (20,100) relative to the current view
        const pt = this.canvas.createSVGPoint();

        pt.x = event.pageX - 40;
        pt.y = event.pageY - 35;


        // convert the position to svg position
        const svgP = this.convertCoord(pt);

        // assign the position to the new node and add it to the flowchart
        newNode.position.x = svgP.x;
        newNode.position.y = svgP.y;
        this.dataService.flowchart.nodes.splice(this.dataService.flowchart.nodes.length - 1, 0, newNode);
        this.dataService.registerFlwAction({'type': 'add', 'nodes': [newNode]});
    }

    // activate event listener for copy (ctrl+c), paste (ctrl+v), delete (Delete) when mouse hover over the svg component
    activateKeyEvent(): void {
        this.listenerActive = true;
    }

    // deactivate the event listeners when the mouse exit the svg component
    deactivateKeyEvent(event?: MouseEvent): void {
        this.listenerActive = false;
        if (this.isDown) {
            this.handleMouseUp(event);
        }
    }

    // delete selected node
    deleteSelectedNodes() {

        const deletedNodes = [];
        const deletedEdges = [];
        this.dataService.flowchart.meta.selected_nodes = this.dataService.flowchart.meta.selected_nodes.sort();
        // for each of the selected node
        while (this.dataService.flowchart.meta.selected_nodes.length > 0) {
            const node_index = this.dataService.flowchart.meta.selected_nodes.pop();
            const node = this.dataService.flowchart.nodes[node_index];
            // continue if the node is a start/end node
            if (node.type !== '') { continue; }

            deletedNodes.push(node);

            let edge_index = 0;

            // delete all the edges connected to the node
            while (edge_index < this.dataService.flowchart.edges.length) {
                const tbrEdge = this.dataService.flowchart.edges[edge_index];


                if (tbrEdge.target.parentNode === node || tbrEdge.source.parentNode === node) {
                    deletedEdges.push(tbrEdge);
                    this.deleteEdge(edge_index);
                    continue;
                }
                edge_index += 1;
            }

            // remove the node from the flowchart
            this.dataService.flowchart.nodes.splice(Number(node_index), 1);
        }
        const nodes = this.dataService.flowchart.nodes;
        for ( let i = 0; i < nodes.length; i ++ ) {
            if (nodes[i].type === 'end') {
                this.dataService.flowchart.meta.selected_nodes = [i];
                break;
            }
        }
        this.dataService.registerFlwAction({'type': 'del', 'nodes': deletedNodes, 'edges': deletedEdges});


    }

    // delete an edge with a known index
    deleteEdge(edge_index) {
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

        tbrEdge.target.parentNode.enabled = false;
        for (const remainingEdge of tbrEdge.target.edges) {
            if (remainingEdge.source.parentNode.enabled) {
                tbrEdge.target.parentNode.enabled = true;
                break;
            }
        }
        /*
        if (tbrEdge.target.parentNode.input.edges.length === 0 && deletedNode !== tbrEdge.target.parentNode.id) {
            ViewFlowchartComponent.disableNode(tbrEdge.target.parentNode);
        } else {
            ViewFlowchartComponent.enableNode(tbrEdge.target.parentNode);
        }
        */

        // remove the edge from the general list of edges
        this.dataService.flowchart.edges.splice(edge_index, 1);
        this.dataService.flowchart.ordered = false;
    }


    // delete all the selected edges
    deleteSelectedEdges() {
        this.selectedEdge.sort().reverse();
        const deletedEdges = [];
        for (const edge_index of this.selectedEdge) {
            deletedEdges.push(this.dataService.flowchart.edges[edge_index]);
            this.deleteEdge(edge_index);
        }
        this.dataService.registerFlwAction({'type': 'del', 'edges': deletedEdges});
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
        frame[3] += 100;

        // calculate the zoom to fit the whole flowchart
        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        let zoom = canvasSize  / (frame[2] - frame[0]);
        const heightZoom = canvasSize / (frame[3] - frame[1]);

        zoom = Math.min(zoom, heightZoom, this.maxZoom);

        let nX;
        let nY;

        if (zoom > this.minZoom) {
            const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();
            // const ctm = this.zoom * boundingDiv.width / canvasSize;
            const ctm = bRect.width / canvasSize;

            nX = (boundingDiv.width  - (frame[2] + frame[0]) * ctm * zoom / this.zoom) / 2;
            nY = (boundingDiv.height - (frame[3] + frame[1]) * ctm * zoom / this.zoom) / 2;

            // if the minX or minY goes below 0 (outside of svg frame), change them back to 0
            if (nX > 0) { nX = 0; }
            if (nY > 0) { nY = 0; }

        } else {
            zoom = this.minZoom;
            const ctm = bRect.width / canvasSize;
            nX = - frame[0] * ctm * zoom / this.zoom;
            nY = - frame[1] * ctm * zoom / this.zoom;
        }

        // transform
        this.dataService.flowchartPos = `matrix(${zoom},0,0,${zoom},${nX},${nY})`;
        this.canvas.style.transform = this.dataService.flowchartPos;

        this.zoom = zoom;
    }


    // scale view on mouse wheel
    scale(event: WheelEvent): void {
        event.preventDefault();
        event.stopPropagation();

        // calculate new zoom value
        let value: number = this.zoom - (Math.sign(event.deltaY)) * this.zoomFactor;

        // limit the zoom value to be between 1 and 2.5
        if (value >= this.minZoom && value <= this.maxZoom) {
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

        this.dataService.flowchartPos = 'matrix(' + m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.e + ',' + m.f + ')';
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


        this.dataService.flowchartPos = 'matrix(' + value + ', 0, 0,' + value + ',' + newX + ',' + newY + ')';
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

        let newX = ((bRect.left - this.offset[0]) * value - this.mousePos[0] * (value - this.zoom)) / this.zoom;
        let newY = ((bRect.top  - this.offset[1]) * value - this.mousePos[1] * (value - this.zoom)) / this.zoom;

        // snapping back the x and y coordinates if the zoom goes out of the bounding box
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

        this.dataService.flowchartPos = 'matrix(' + value + ', 0, 0,' + value + ',' + newX + ',' + newY + ')';

        // transform
        this.canvas.style.transform = this.dataService.flowchartPos;

        this.zoom = value;
    }


    // initiate dragging the view window
    panStart(event: any) {
        event.preventDefault();
        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        // set start coords to current view window position
        this.starTxyzs = [
            event.clientX - (bRect.left - this.offset[0]),
            event.clientY - (bRect.top - this.offset[1])
            // event.deltaX - (bRect.left - this.offset[0]),
            // event.deltaY - (bRect.top - this.offset[1])
        ];
        // set drag mode to drag view
        this.isDown = 1;
    }

    // handle mouse move for dragging view/node/port
    handleMouseMove(event: any) {
        // return if no dragging initiated
        if (!this.isDown) {
            return;

        // if drag view
        } else if (this.isDown === 1) {
            event.preventDefault();
            const bRect = <DOMRect>this.canvas.getBoundingClientRect();
            let x = Number(event.clientX - this.starTxyzs[0]);
            let y = Number(event.clientY - this.starTxyzs[1]);
            // let x = Number(event.deltaX - this.starTxyzs[0]);
            // let y = Number(event.deltaY - this.starTxyzs[1]);
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
            this.dataService.flowchartPos = 'matrix(' + this.zoom + ',0,0,' + this.zoom + ',' + x + ',' + y + ')';
            this.canvas.style.transform = this.dataService.flowchartPos;


        // if drag node
        } else if (this.isDown === 2) {

            const pt = this.canvas.createSVGPoint();

            pt.x = event.pageX;
            pt.y = event.pageY;

            const svgP = this.convertCoord(pt);

            const xDiff = this.starTxyzs[0] - svgP.x;
            const yDiff = this.starTxyzs[1] - svgP.y;
            this.starTxyzs[0] = svgP.x;
            this.starTxyzs[1] = svgP.y;

            let check: number;
            for ( const nodeIndex of this.dataService.flowchart.meta.selected_nodes) {
                if (this.dataService.flowchart.nodes[nodeIndex].id === this.element.id) {
                    check = nodeIndex;
                    break;
                }
            }
            if (check === undefined) {
                this.element.position.x -= xDiff;
                this.element.position.y -= yDiff;

                if (!event.shiftKey) {
                    const offsetx = this.element.position.x % 20;
                    const offsety = this.element.position.y % 20;

                    this.element.position.x = this.element.position.x - offsetx;
                    this.element.position.y = this.element.position.y - offsety;

                    this.starTxyzs[0] -= offsetx;
                    this.starTxyzs[1] -= offsety;
                }

            } else {
                for ( const nodeIndex of this.dataService.flowchart.meta.selected_nodes) {
                    const node =  this.dataService.flowchart.nodes[nodeIndex];
                    node.position.x -= xDiff;
                    node.position.y -= yDiff;
                    if (!event.shiftKey) {
                        const offsetx = node.position.x % 20;
                        const offsety = node.position.y % 20;

                        node.position.x = node.position.x - offsetx;
                        node.position.y = node.position.y - offsety;
                        if (nodeIndex === check) {
                            this.starTxyzs[0] -= offsetx;
                            this.starTxyzs[1] -= offsety;
                        }
                    }
                }
            }

    // if drag port
    } else if (this.isDown === 3) {
            event.preventDefault();
            const pt = this.canvas.createSVGPoint();

            pt.x = event.pageX;
            pt.y = event.pageY;

            const svgP = this.convertCoord(pt);
            this.element.setAttribute('x2', svgP.x);
            this.element.setAttribute('y2', svgP.y);


        }

    }

    handleMouseUp(event) {
        this.element = undefined;
        if (this.isDown === 3) {
            const pt = this.canvas.createSVGPoint();

            pt.x = event.pageX;
            pt.y = event.pageY;
            const svgP = this.convertCoord(pt);


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
                if (Math.abs(pPos[0] - svgP.x) > 60 || Math.abs(pPos[1] - svgP.y) > 50 ) { continue; }

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
                    this.edge.target.parentNode.enabled = true;
                }
                /*
                try {
                    if (this.edge.source.parentNode.enabled) {
                        ViewFlowchartComponent.enableNode(this.edge.target.parentNode);
                    } else {
                        ViewFlowchartComponent.disableNode(this.edge.target.parentNode);
                    }
                } catch (ex) {
                    this.edge.target.parentNode.hasError = true;
                    this.edge.source.parentNode.hasError = true;
                }
                */
                break;
            }
            this.dataService.registerFlwAction({'type': 'add', 'edges': [this.edge]});

        }
        this.isDown = 0;
    }

    newfile() {
        document.getElementById('newfile').click();
        this.focusFlowchart();
    }

    // viewerData(): any {
    //     const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
    //     if (!node || !node.enabled) { return ''; }
    //     // if (node.type === 'output') { return node.input.value; }
    //     return node.model;
    // }

    dragSplitStart(e) {
        const currentTransf: any = this.dataService.flowchartPos.split(',');
        currentTransf[5] = currentTransf[5].split(')')[0];
        // this.canvas.style.transition = 'transform 0ms linear';

        // @ts-ignore
        const dragProcess = this.flowchartSplit.dragProgress$ || this.flowchartSplit.dragProgress;
        const bW = (<DOMRect>this.canvas.getBoundingClientRect()).width;
        this.splitDragSub = dragProcess.subscribe(() => {
            const nBW = (<DOMRect>this.canvas.getBoundingClientRect()).width / bW;
            const nX = currentTransf[4] * nBW;
            const nY = currentTransf[5] * nBW;
            this.dataService.flowchartPos = currentTransf[0] + ', 0, 0,' + currentTransf[3] + ',' + nX + ',' + nY + ')';
            this.canvas.style.transform = this.dataService.flowchartPos;
        });
    }

    dragSplitEnd(e) {
        this.splitDragSub.unsubscribe();
        // this.canvas.style.transition = 'transform 0ms ease-in';
        this.dataService.splitVal = e.sizes[1];
    }

    deselectAll(e) {
        if (e.ctrlKey) {return; }

        document.getElementById('executeButton').focus();
        this.dataService.flowchart.meta.selected_nodes.splice(1, this.dataService.flowchart.meta.selected_nodes.length - 1);
        for (const edgeIndex of this.selectedEdge) {
            this.dataService.flowchart.edges[edgeIndex].selected = false;
        }
        this.selectedEdge = [];
    }
    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }
    getFlowchartName() { return this.dataService.file.name; }

}

