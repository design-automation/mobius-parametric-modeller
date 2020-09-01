import { Injectable } from '@angular/core';

@Injectable()
export class CytoscapeService {
    private static _cytoscape_edges;

    get cytoscapeEdges() {return CytoscapeService._cytoscape_edges; }
    set cytoscapeEdges(col: any) {CytoscapeService._cytoscape_edges = col; }

    private static _cytoscape_nodes = [];

    get cytoscapeNodes() {return CytoscapeService._cytoscape_nodes; }
    public resetNodes() {CytoscapeService._cytoscape_nodes = []; }
    public addNodes(col: any) { CytoscapeService._cytoscape_nodes.push(col); }
    public removeNode(col: any) {
        const colID = col.id();
        let i = 0;
        while (i < CytoscapeService._cytoscape_nodes.length) {
            if (CytoscapeService._cytoscape_nodes[i].data.id === colID) {
                CytoscapeService._cytoscape_nodes.splice(i, 1);
                continue;
            }
            i++;
        }
    }
}
