import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import { TextViewerComponent, JSONViewerComponent } from './viewers';
import { ViewerContainerComponent } from './mobius-viewer.component';

@NgModule({
  declarations: [
    ViewerContainerComponent,
    TextViewerComponent, JSONViewerComponent
  ],
  exports: [ ViewerContainerComponent ],
  imports: [ CommonModule, FormsModule ],
  entryComponents: [ TextViewerComponent, JSONViewerComponent ],
  providers: [ ]
})
export class MobiusViewerModule {
    constructor () { }
}
