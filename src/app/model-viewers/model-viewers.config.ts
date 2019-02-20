import { IView } from './view.interface';
import { ConsoleViewerComponent } from './all-viewers/console-viewer/console-viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/help-viewer.component';

import { GIViewerComponent } from './all-viewers/gi-viewer/gi-viewer.component';
import { GIViewerModule } from './all-viewers/gi-viewer/gi-viewer';

import { MobiuscesiumComponent } from './all-viewers/cesium-viewer/mobius-cesium.component';
import { MobiusCesium } from './all-viewers/cesium-viewer/mobius-cesium';

export const VIEWER_ARR = [
    ConsoleViewerComponent,
    HelpViewerComponent,

    // Step-1: Add Component here
    GIViewerComponent,
    MobiuscesiumComponent,
];

export const VIEWER_MOD = [
    // Step-2: Add Module here
    GIViewerModule,
    MobiusCesium,
];

export const Viewers: IView[] = [
    // Step-3: Add Viewer Definition here: name, icon and component
    // The order of these views here will influence the order of the view appearing in the viewer header.
    { name: '3D Viewer', icon: undefined, component: GIViewerComponent },
    { name: 'Mobius Cesium', icon: undefined, component: MobiuscesiumComponent },

    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    { name: 'Help', icon: undefined, component: HelpViewerComponent },
];

