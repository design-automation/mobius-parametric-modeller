import { IView } from './view.interface';
// Step-1: Add new ViewerComponet here
import { TextViewerComponent } from './viewers';
import { ConsoleViewerComponent } from './viewers/console-viewer.component';
import { ProcedureHelpComponent } from './viewers/procedure-help.component';

export const VIEWER_ARR = [
    TextViewerComponent,
    ConsoleViewerComponent,
    ProcedureHelpComponent,
    // JSONViewerComponent,
    // ThreeViewerComponent
    // Step-2: Add Component here
];

export const Viewers: IView[] = [
    { name: 'Summary', icon: undefined, component: TextViewerComponent },
    { name: 'Console', icon: undefined, component: ConsoleViewerComponent },
    { name: 'Help', icon: undefined, component: ProcedureHelpComponent },
    // { name: 'json-viewer', icon: undefined, component: JSONViewerComponent },
    // Step-3: Add Viewer Definition here: name, icon and component
    // { name: 'three-viewer', icon: undefined, component: ThreeViewerComponent }
];

