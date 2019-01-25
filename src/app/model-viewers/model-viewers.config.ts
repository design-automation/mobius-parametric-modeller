import { IView } from './view.interface';
import { ConsoleViewerComponent } from './all-viewers/console-viewer/console-viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/help-viewer.component';

import { GIViewerComponent } from './all-viewers/gi-viewer/gi-viewer.component';
import { GIViewerModule } from './all-viewers/gi-viewer/gi-viewer';

export const VIEWER_ARR = [
    ConsoleViewerComponent,
    HelpViewerComponent,

    // Step-1: Add Component here
    GIViewerComponent,
];

export const VIEWER_MOD = [
    // Step-2: Add Module here
    GIViewerModule,
];

export const Viewers: IView[] = [
    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    { name: 'Help', icon: undefined, component: HelpViewerComponent },

    // Step-3: Add Viewer Definition here: name, icon and component
    { name: '3D Viewer', icon: undefined, component: GIViewerComponent },
];

