import { GIModel } from '@libs/geo-info/GIModel';

// import @angular stuff
import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

// import app services
import { ColorPickerService } from 'ngx-color-picker';
import cytoscape from 'cytoscape';
import { EEntType } from '@assets/libs/geo-info/common';
import { CytoscapeService } from '../service/cytoscape.service';
import { isArray } from 'util';

// import others

const CYTOSCAPE_STYLE = [
    <cytoscape.Stylesheet>{
        selector: 'nodes',
        css: {
            'label': 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'height': '100px',
            'width': '100px',
            'border-color': 'black',
            'border-opacity': '1',
            'text-background-opacity': 0,
            'text-background-color': 'rgb(216, 216, 216)',
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.ps',
        css: {
        }
    },
    <cytoscape.Stylesheet> {
        selector: '._v',
        css: {
            'shape': 'round-triangle',
            'background-color': 'rgb(100, 0, 100)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '._e',
        css: {
            'shape': 'round-diamond',
            'background-color': 'rgb(100, 50, 50)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '._w',
        css: {
            'shape': 'round-rectangle',
            'background-color': 'rgb(100, 100, 0)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '._f',
        css: {
            'shape': 'round-pentagon',
            'background-color': 'rgb(50, 100, 50)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.pg',
        css: {
            'shape': 'pentagon',
            'background-color': 'rgb(0, 100, 100)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.pl',
        css: {
            'shape': 'rectangle',
            'background-color': 'rgb(0, 100, 100)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.pt',
        css: {
            'shape': 'triangle',
            'background-color': 'rgb(0, 100, 100)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.co',
        css: {
            'shape': 'hexagon',
            'background-color': 'rgb(0, 100, 0)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.root',
        css: {
            'shape': 'star',
            'background-color': 'rgb(100, 0, 0)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: ':selected',
        css: {
            'background-color': 'rgb(0, 0, 100)',
            'line-color': 'black'
        }
    },
    <cytoscape.Stylesheet> {
        selector: 'edges',
        css: {
            'curve-style': 'straight',
            'target-arrow-shape': 'vee',
            'arrow-scale': 3
        }
    }
];

/**
 * GICesiumViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'cytoscape',
    templateUrl: './cytoscape.component.html',
    styleUrls: ['./cytoscape.component.scss'],
})
export class CytoscapeComponent implements OnDestroy, OnChanges {
    // model data passed to the viewer
    @Input() model: GIModel;
    public modelData: GIModel;
    protected cytoscape: cytoscape.Core;

    /**
     * constructor
     * @param dataService
     */
    constructor(private cytoscapeService: CytoscapeService) {
    }

    static rotateAngle(pos, angle, cos_sin = null) {
        let cosA;
        let sinA;
        if (!cos_sin) {
            cosA = Math.cos(angle);
            sinA = Math.sin(angle);
        } else {
            cosA = cos_sin[0];
            sinA = cos_sin[1];
        }
        const new_x = cosA * pos.x - sinA * pos.y;
        const new_y = sinA * pos.x + cosA * pos.y;
        pos.x = new_x;
        pos.y = new_y;
        return pos;
    }

    static onclick(model: GIModel, cy: cytoscape.Core, cytoscapeService: CytoscapeService, box: boolean) {
//         return function (event: cytoscape.EventObject) {
//             const selectedID = event.target.id();
//             const selectedClass = event.target.classes()[0];
//             if (selectedClass === 'ps' || (box && selectedClass[0] === '_')) { return; }
//             const selectedPos = event.target.position();
//             const allObj = {
//                 'ps': model.modeldata.geom.query.getEnts(EEntType.POSI),
//                 '_v': model.modeldata.geom.query.getEnts(EEntType.VERT),
//                 '_e': model.modeldata.geom.query.getEnts(EEntType.EDGE),
//                 '_w': model.modeldata.geom.query.getEnts(EEntType.WIRE),
//                 'pt': model.modeldata.geom.query.getEnts(EEntType.POINT),
//                 'pl': model.modeldata.geom.query.getEnts(EEntType.PLINE),
//                 'pg': model.modeldata.geom.query.getEnts(EEntType.PGON),
//                 'co': model.modeldata.geom.query.getEnts(EEntType.COLL)
//             };

//             function removeObject(sourceID, sourceClass) {
//                 let obj_i;
//                 let objClass;
//                 let num_obj;
//                 if (sourceClass === 'co') {
//                     obj_i = [];
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToCollChildren(sourceID).map(x => 'co' + x));
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToPgon(sourceID).map(x => 'pg' + x));
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToPline(sourceID).map(x => 'pl' + x));
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToPoint(sourceID).map(x => 'pt' + x));
//                     objClass = '';
//                     num_obj = allObj.pg.length + allObj.pl.length + allObj.pt.length + allObj.co.length;
//                 } else if (sourceClass === 'pg') {
//                     obj_i = [model.modeldata.geom.nav.navPgonToWire(sourceID)];
//                     objClass = '_f';
//                     num_obj = allObj._f.length;
//                 } else if (sourceClass === 'pl') {
//                     obj_i = [model.modeldata.geom.nav.navPlineToWire(sourceID)];
//                     objClass = '_f';
//                     num_obj = allObj._f.length;
//                 } else if (sourceClass === 'pt') {
//                     obj_i = [model.modeldata.geom.nav.navPointToVert(sourceID)];
//                     objClass = '_f';
//                     num_obj = allObj._f.length;
// ;                } else if (sourceClass === '_w') {
//                     obj_i = model.modeldata.geom.nav.navWireToEdge(sourceID);
//                     objClass = '_e';
//                     num_obj = allObj._e.length;
//                 } else if (sourceClass === '_e') {
//                     obj_i = model.modeldata.geom.nav.navEdgeToVert(sourceID);
//                     objClass = '_v';
//                     num_obj = allObj._v.length;
//                 } else if (sourceClass === '_v') {
//                     obj_i = [model.modeldata.geom.nav.navVertToPosi(sourceID)];
//                     objClass = 'ps';
//                     num_obj = allObj.ps.length;
//                 } else {
//                     return;
//                 }
//                 for (const objID of obj_i) {
//                     let clss = objClass;
//                     let oID = objID;
//                     if (clss === '') {
//                         clss = objID.slice(0, 2);
//                         oID = parseInt(objID.slice(2), 10);
//                     }
//                     for (let i = 0; i < cytoscapeService.cytoscapeEdges.length; i++) {
//                         const objSet = cytoscapeService.cytoscapeEdges[i];
//                         if (objSet[0] === `${objClass}${objID}`) {
//                             cy.remove(objSet[1]);
//                             cytoscapeService.cytoscapeEdges.splice(i, 1);
//                             break;
//                         }
//                     }
//                     removeObject(oID, clss);
//                 }
//             }
//             if (selectedClass !== 'root') {
//                 for (let i = 0; i < cytoscapeService.cytoscapeEdges.length; i++) {
//                     const objSet = cytoscapeService.cytoscapeEdges[i];
//                     if (objSet[0] === selectedID) {
//                         cy.remove(objSet[1]);
//                         cytoscapeService.cytoscapeEdges.splice(i, 1);
//                         removeObject(parseInt(selectedID.slice(2), 10), selectedClass);
//                         cy.nodes().forEach( ele => {
//                             if (ele.isNode() && ele.degree(false) < 1) {
//                                 cy.remove(ele);
//                                 cytoscapeService.removeNode(ele);
//                             }
//                         });
//                         return;
//                     }
//                 }
//             } else if (!box) {
//                 for (let i = 1; i < cytoscapeService.cytoscapeEdges.length; i++) {
//                     const objSet = cytoscapeService.cytoscapeEdges[i];
//                     cy.remove(objSet[1]);
//                     cy.nodes().forEach( ele => {
//                         if (ele.isNode() && ele.degree(false) < 1) {
//                             cy.remove(ele);
//                         }
//                     });
//                 }
//                 cytoscapeService.cytoscapeEdges.splice(1);
//                 return;
//             } else {
//                 return;
//             }
//             function addObject(sourceID: number, sourceClass: string, sourcePos: {x: number, y: number}) {
//                 let obj_i;
//                 let objClass: string;
//                 let num_obj;
//                 if (sourceClass === 'co') {
//                     obj_i = [];
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToCollChildren(sourceID).map(x => 'co' + x));
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToPgon(sourceID).map(x => 'pg' + x));
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToPline(sourceID).map(x => 'pl' + x));
//                     obj_i = obj_i.concat(model.modeldata.geom.nav.navCollToPoint(sourceID).map(x => 'pt' + x));
//                     objClass = '';
//                     num_obj = allObj.pg.length + allObj.pl.length + allObj.pt.length + allObj.co.length;
//                 } else if (sourceClass === 'pg') {
//                     obj_i = [model.modeldata.geom.nav.navPgonToWire(sourceID)];
//                     objClass = '_f';
//                     num_obj = allObj._f.length;
//                 } else if (sourceClass === 'pl') {
//                     obj_i = [model.modeldata.geom.nav.navPlineToWire(sourceID)];
//                     objClass = '_f';
//                     num_obj = allObj._f.length;
//                 } else if (sourceClass === 'pt') {
//                     obj_i = [model.modeldata.geom.nav.navPointToVert(sourceID)];
//                     objClass = '_f';
//                     num_obj = allObj._f.length;
//                 // } else if (sourceClass === '_f') {
//                 //     obj_i = model.modeldata.geom.nav.navFaceToWire(sourceID);
//                 //     objClass = '_w';
//                 //     num_obj = allObj._w.length;
//                 } else if (sourceClass === '_w') {
//                     obj_i = model.modeldata.geom.nav.navWireToEdge(sourceID);
//                     objClass = '_e';
//                     num_obj = allObj._e.length;
//                 } else if (sourceClass === '_e') {
//                     obj_i = model.modeldata.geom.nav.navEdgeToVert(sourceID);
//                     objClass = '_v';
//                     num_obj = allObj._v.length;
//                 } else if (sourceClass === '_v') {
//                     obj_i = [model.modeldata.geom.nav.navVertToPosi(sourceID)];
//                     objClass = 'ps';
//                     num_obj = allObj.ps.length;
//                 } else {
//                     return;
//                 }
//                 const cy_edges = [];

//                 if (obj_i.length === 1) {
//                     const objID = obj_i[0];
//                     const distO = Math.sqrt( sourcePos.x * sourcePos.x + sourcePos.y * sourcePos.y);
//                     const scalar0 = (distO + 200) / distO;
//                     const n_pos = {x: sourcePos.x * scalar0, y: sourcePos.y * scalar0};
//                     cy_edges.push({
//                         group: 'edges',
//                         data: { id: `${sourceClass}${sourceID}_${objClass}${objID}`, source: `${sourceClass}${sourceID}`, target: `${objClass}${objID}` }
//                     });

//                     const newNode: any = [{
//                         group: 'nodes',
//                         data: { id: `${objClass}${objID}` },
//                         position: {x: n_pos.x, y: n_pos.y},
//                         classes: [objClass]
//                     }];
//                     cytoscapeService.addNodes(newNode[0]);
//                     cy.add(newNode);
//                     const allEdges0 = cy.add(cy_edges);
//                     cytoscapeService.cytoscapeEdges.push([`${sourceClass}${sourceID}`, allEdges0]);
//                     if (sourceClass !== 'co') { addObject(objID, objClass, n_pos); }
//                     return;
//                 }

//                 const angle = Math.PI * 1.5 / num_obj;
//                 const cos_sin = [Math.cos(angle), Math.sin(angle)];
//                 const distFromO = Math.sqrt( sourcePos.x * sourcePos.x + sourcePos.y * sourcePos.y);
//                 let scalar = 25 * num_obj / distFromO;
//                 if (distFromO * scalar - distFromO < 200) {
//                     scalar = (distFromO + 200) / distFromO;
//                 }
//                 const o_pos = {'x': sourcePos.x * scalar, 'y': sourcePos.y * scalar};
//                 CytoscapeComponent.rotateAngle(o_pos, - angle * (obj_i.length - 1) / 2);
//                 for (const objID of obj_i) {
//                     let clss = objClass;
//                     if (clss === '') { clss = objID.slice(0, 2); }
//                     cy_edges.push({
//                         group: 'edges',
//                         data: { id: `${sourceClass}${sourceID}_${objClass}${objID}`, source: `${sourceClass}${sourceID}`, target: `${objClass}${objID}` }
//                     });
//                     const newNode: any = [{
//                         group: 'nodes',
//                         data: { id: `${objClass}${objID}` },
//                         position: { x: o_pos.x, y: o_pos.y },
//                         classes: [clss]
//                     }];
//                     cytoscapeService.addNodes(newNode[0]);
//                     cy.add(newNode);
//                     addObject(objID, objClass, o_pos);
//                     CytoscapeComponent.rotateAngle(o_pos, angle, cos_sin);
//                 }
//                 const allEdges = cy.add(cy_edges);
//                 cytoscapeService.cytoscapeEdges.push([`${sourceClass}${sourceID}`, allEdges]);
//             }
//             addObject(parseInt(selectedID.slice(2), 10), selectedClass, selectedPos);
//         };
    }

    ngOnChanges(changes: SimpleChanges) {
        // if (!this.cytoscape && this.cytoscapeService.cytoscapeEdges) {
        //     this.cytoscape = cytoscape({
        //         container: document.getElementById('cytoscape'),
        //         style: CYTOSCAPE_STYLE,
        //     });
        //     this.cytoscape.add(this.cytoscapeService.cytoscapeNodes);
        //     for (const col of this.cytoscapeService.cytoscapeEdges) {
        //         console.log(col)
        //         col[1] = this.cytoscape.add(col[1]);
        //     }
        //     this.cytoscape.fit();
        //     this.cytoscape.on('tap', 'node', CytoscapeComponent.onclick(this.model, this.cytoscape, this.cytoscapeService, false));
        //     this.cytoscape.on('box', 'node', CytoscapeComponent.onclick(this.model, this.cytoscape, this.cytoscapeService, true));
        // } else if (changes['model'] && this.model) {
        //     this.updateCytoscape();
        // }
    }

    ngOnDestroy() {
        this.cytoscape.destroy();
    }

    updateCytoscape() {
        // if (this.cytoscape) { this.cytoscape.destroy(); }
        // this.cytoscape = cytoscape({
        //     container: document.getElementById('cytoscape'),
        //     style: CYTOSCAPE_STYLE,
        // });

        // let obj_i: string[] = this.model.modeldata.geom.query.getEnts(EEntType.COLL).map(x => 'co' + x);
        // if (obj_i.length === 0) {
        //     obj_i = obj_i.concat(this.model.modeldata.geom.query.getEnts(EEntType.PGON).map(x => 'pg' + x));
        //     obj_i = obj_i.concat(this.model.modeldata.geom.query.getEnts(EEntType.PLINE).map(x => 'pl' + x));
        //     obj_i = obj_i.concat(this.model.modeldata.geom.query.getEnts(EEntType.POINT).map(x => 'pt' + x));
        // }

        // const cy_eles = [];
        // cy_eles.push({
        //     group: 'nodes',
        //     data: { id: `ROOT` },
        //     position: { x: 0, y: 0},
        //     classes: ['root']
        // });
        // const angle = Math.PI * 2 / obj_i.length;
        // const cos_sin = [Math.cos(angle), Math.sin(angle)];
        // const obj_pos = {x: 0, y: - 30 * obj_i.length};
        // for (const obj of obj_i) {
        //     cy_eles.push({
        //         group: 'nodes',
        //         data: { id: obj },
        //         position: { x: obj_pos.x, y: obj_pos.y },
        //         classes: [obj.slice(0, 2)]
        //     });
        //     cy_eles.push({
        //         group: 'edges',
        //         data: { id: `root_${obj}`, source: 'ROOT', target: obj }
        //     });
        //     CytoscapeComponent.rotateAngle(obj_pos, angle, cos_sin);
        // }
        // const allObjs = this.cytoscape.add(cy_eles);

        // // const layout = this.cytoscape.layout({
        // //     name: 'concentric'
        // // });
        // // const x = layout.run();
        // this.cytoscape.fit();
        // this.cytoscapeService.cytoscapeEdges = [['root', allObjs]];
        // this.cytoscapeService.resetNodes();
        // this.cytoscape.on('tap', 'node', CytoscapeComponent.onclick(this.model, this.cytoscape, this.cytoscapeService, false));
        // this.cytoscape.on('box', 'node', CytoscapeComponent.onclick(this.model, this.cytoscape, this.cytoscapeService, true));
    }

    zoomfit() {
        this.cytoscape.fit();
    }

}
