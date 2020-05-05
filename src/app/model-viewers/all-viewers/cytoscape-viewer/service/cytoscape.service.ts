import { Injectable } from '@angular/core';

@Injectable()
export class CytoscapeService {
    private static _cytoscape_collection;

    get cytoscapeCol() {return CytoscapeService._cytoscape_collection; }
    set cytoscapeCol(col: any) {CytoscapeService._cytoscape_collection = col; }
}
