import { IView } from './view.interface';
import { ConsoleViewerComponent } from './all-viewers/console-viewer/console-viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/help-viewer.component';
// GI Threejs viewer
import { GIViewerComponent } from './all-viewers/gi-viewer/gi-viewer.component';
import { GIViewerModule } from './all-viewers/gi-viewer/gi-viewer';

import { CytoscapeViewerComponent } from './all-viewers/cytoscape-viewer/cytoscape-viewer.component';
import { CytoscapeViewerModule } from './all-viewers/cytoscape-viewer/cytoscape-viewer.module';

import { GIGeoViewerComponent } from './all-viewers/gi-geo-viewer/gi-geo-viewer.component';
import { GIGeoViewerModule } from './all-viewers/gi-geo-viewer/gi-geo-viewer';

// Viewer Components array
export const VIEWER_ARR = [
    ConsoleViewerComponent,
    HelpViewerComponent,
    // Step-1: Add Component here
    GIViewerComponent,
    GIGeoViewerComponent
    // CytoscapeViewerComponent
];

// Viewer modules array
export const VIEWER_MOD = [
    // Step-2: Add Module here
    GIViewerModule,
    GIGeoViewerModule,
    // CytoscapeViewerModule,
];

// Viewers
export const Viewers: IView[] = [
    // Step-3: Add Viewer Definition here: name, icon and component
    // The order of these views here will influence the order of the view appearing in the viewer header.
    { name: '3D Viewer', icon: undefined, component: GIViewerComponent },
    { name: 'Three Geo Viewer', icon: undefined, component: GIGeoViewerComponent },
    // { name: 'Cytoscape Viewer', icon: undefined, component: CytoscapeViewerComponent },
    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    { name: 'Help', icon: undefined, component: HelpViewerComponent }
];

