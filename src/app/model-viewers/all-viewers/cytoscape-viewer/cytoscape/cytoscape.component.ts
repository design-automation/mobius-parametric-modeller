import { GIModel } from '@libs/geo-info/GIModel';

// import @angular stuff
import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

// import app services
import { ColorPickerService } from 'ngx-color-picker';
import cytoscape from 'cytoscape';
import { EEntType } from '@assets/libs/geo-info/common';
import { CytoscapeService } from '../service/cytoscape.service';

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
            'text-background-opacity': 1,
            'text-background-color': 'lightgray',
        }
    },
    <cytoscape.Stylesheet> {
        selector: ':selected',
        css: {
            'background-color': 'black',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black'
        }
    },
    <cytoscape.Stylesheet> {
        selector: '.ps',
        css: {
        }
    },
    <cytoscape.Stylesheet> {
        selector: '._e',
        css: {
            'shape': 'round-triangle',
            'background-color': 'rgb(0, 0, 109)'
        }
    },
    <cytoscape.Stylesheet> {
        selector: 'edges',
        css: {
            'haystack-radius': 0.2
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

    ngOnChanges(changes: SimpleChanges) {
        if (!this.cytoscape && this.cytoscapeService.cytoscapeCol) {
            this.cytoscape = cytoscape({
                container: document.getElementById('cytoscape'),
                style: CYTOSCAPE_STYLE,
            });
            this.cytoscape.add(this.cytoscapeService.cytoscapeCol);
            this.cytoscape.fit();
        } else if (changes['model'] && this.model) {
            this.updateCytoscape();
        }
    }

    ngOnDestroy() {
        this.cytoscape.destroy();
    }

    updateCytoscape() {
        if (this.cytoscape) { this.cytoscape.destroy(); }
        this.cytoscape = cytoscape({
            container: document.getElementById('cytoscape'),
            style: CYTOSCAPE_STYLE,
        });
        const posis_i: number[] = this.model.geom.query.getEnts(EEntType.POSI, false);
        const cy_eles = [];
        posis_i.forEach( ps => {
            cy_eles.push({
                group: 'nodes',
                data: { id: `ps${ps}` },
                position: { x: 0, y: 0 },
                classes: ['ps']
            });
        });

        const edge_i: number[] = this.model.geom.query.getEnts(EEntType.EDGE, false);
        for (const _e of edge_i) {
            const ps = this.model.geom.nav.navAnyToPosi(EEntType.EDGE, _e);
            cy_eles.push({
                group: 'nodes',
                data: { id: `_e${_e}` },
                position: { x: 0, y: 0 },
                classes: ['_e']
            });
            cy_eles.push({
                group: 'edges',
                data: { id: `_e${_e}_ps${ps[0]}`, source: `_e${_e}`, target: `ps${ps[0]}` }
            });
            cy_eles.push({
                group: 'edges',
                data: { id: `_e${_e}_ps${ps[1]}`, source: `_e${_e}`, target: `ps${ps[1]}` }
            });
        }
        const allObjs = this.cytoscape.add(cy_eles);

        const layout = this.cytoscape.layout({
            name: 'cose',
            componentSpacing: 500
        });
        const x = layout.run();
        this.cytoscape.fit();
        this.cytoscapeService.cytoscapeCol = allObjs;
    }
}
