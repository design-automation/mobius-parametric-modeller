import { IView } from './view.interface';
// Step-1: Add new ViewerComponet here
import { TextViewerComponent } from './all-viewers/text-viewer/viewer.component';
import { ConsoleViewerComponent } from './all-viewers/console-viewer/viewer.component';
import { HelpViewerComponent } from './all-viewers/help-viewer/viewer.component';
import { GIViewerComponent } from './all-viewers/gi-viewer/gi-viewer.component';

export const VIEWER_ARR = [
    // Step-2: Add Component here
    GIViewerComponent,
    TextViewerComponent,
    ConsoleViewerComponent,
    HelpViewerComponent,
    // JSONViewerComponent,
    // ThreeViewerComponent
    // CesiumViewerComponent,
    // MobiuscesiumComponent,
];

export const Viewers: IView[] = [
    // Step-3: Add Viewer Definition here: name, icon and component
    { name: '3D Viewer', icon: undefined, component: GIViewerComponent },
    { name: 'Summary', icon: undefined, component: TextViewerComponent },
    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    { name: 'Help', icon: undefined, component: HelpViewerComponent },
    // { name: 'json-viewer', icon: undefined, component: JSONViewerComponent },
    // { name: 'three-viewer', icon: undefined, component: ThreeViewerComponent },
    // { name: 'cesium-viewer', icon: undefined, component: CesiumViewerComponent },
    // { name: 'mobius-cesium', icon: undefined, component: MobiuscesiumComponent },
];

