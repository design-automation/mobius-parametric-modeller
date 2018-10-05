import { IView } from './view.interface'; 
// Step-1: Add new ViewerComponet here
import { TextViewerComponent, JSONViewerComponent, ThreeViewerComponent } from './viewers';
import { GSViewerComponent } from './viewers/gs-viewer/gs-viewer.component';
//import { CesiumViewerComponent } from './viewers/viewer-cesium.component';
import { MobiuscesiumComponent } from './viewers/mobius-cesium/mobius-cesium.component';

export const VIEWER_ARR = [
    TextViewerComponent, 
    JSONViewerComponent, 
    ThreeViewerComponent,
    // Step-2: Add Component here
    //CesiumViewerComponent,
    GSViewerComponent,
    //MobiuscesiumComponent,
];

export const Viewers: IView[] = [
    { name: 'text-viewer', icon: undefined, component: TextViewerComponent },
    { name: 'json-viewer', icon: undefined, component: JSONViewerComponent },
    // Step-3: Add Viewer Definition here: name, icon and component
    //{ name: 'three-viewer', icon: undefined, component: ThreeViewerComponent },
    //{ name: 'cesium-viewer', icon: undefined, component: CesiumViewerComponent },
    { name: 'gs-viewer', icon: undefined, component: GSViewerComponent },
    //{ name: 'mobius-cesium', icon: undefined, component: MobiuscesiumComponent },
];

