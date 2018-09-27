import { IView } from './view.interface'; 
import { TextViewerComponent, JSONViewerComponent, ThreeViewerComponent } from './viewers';


export const Viewers: IView[] = [
    { name: 'text-viewer', icon: undefined, component: TextViewerComponent },
    { name: 'json-viewer', icon: undefined, component: JSONViewerComponent },
    //{ name: 'three-viewer', icon: undefined, component: ThreeViewerComponent }
    // Add another viewer here
];

export const VIEWER_ARR = [
    TextViewerComponent, 
    JSONViewerComponent, 
    ThreeViewerComponent
]
