import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextViewerComponent, JSONViewerComponent } from './viewers';

@NgModule({
  declarations: [
    TextViewerComponent, JSONViewerComponent
  ],
  exports: [ ],
  imports: [ ],
  entryComponents: [ TextViewerComponent, JSONViewerComponent ],
  providers: [ ]
})
export class MobiusViewerModule {
    constructor () { }
}
