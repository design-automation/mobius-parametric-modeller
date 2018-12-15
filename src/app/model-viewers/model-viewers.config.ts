import { IView } from './view.interface';
// Step-1: Add new ViewerComponet here
import { TextViewerComponent } from './all-viewers/text-viewer/viewer.component';
import { ConsoleViewerComponent } from './all-viewers/console-viewer/console-viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/help-viewer.component';
import { GIViewerComponent } from './all-viewers/gi-viewer/gi-viewer.component';

export const VIEWER_ARR = [
    // Step-2: Add Component here
    GIViewerComponent,
    ConsoleViewerComponent,
    HelpViewerComponent,
    // TextViewerComponent,
    // JSONViewerComponent,
    // ThreeViewerComponent
    // CesiumViewerComponent,
    // MobiuscesiumComponent,
];

export const Viewers: IView[] = [
    // Step-3: Add Viewer Definition here: name, icon and component
    { name: '3D Viewer', icon: undefined, component: GIViewerComponent },
    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    { name: 'Help', icon: undefined, component: HelpViewerComponent },
    // { name: 'Summary', icon: undefined, component: TextViewerComponent },
    // { name: 'json-viewer', icon: undefined, component: JSONViewerComponent },
    // { name: 'three-viewer', icon: undefined, component: ThreeViewerComponent },
    // { name: 'cesium-viewer', icon: undefined, component: CesiumViewerComponent },
    // { name: 'mobius-cesium', icon: undefined, component: MobiuscesiumComponent },
];

