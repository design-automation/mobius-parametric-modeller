import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import { ViewerContainerComponent } from './mobius-viewer.component';
import { VIEWER_ARR } from './viewers.config';

@NgModule({
  declarations: [
    ViewerContainerComponent,
    ...VIEWER_ARR
  ],
  exports: [ ViewerContainerComponent ],
  imports: [ CommonModule, FormsModule ],
  entryComponents: [ ...VIEWER_ARR ],
  providers: [ ]
})
export class MobiusViewerModule {
    constructor () { }
}
