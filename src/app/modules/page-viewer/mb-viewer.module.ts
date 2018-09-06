import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from '../../store/store';

import { ParameterViewerComponent } from './components/param-viewer/param-viewer.component';
import { MbViewerComponent } from './mb-viewer.component';


@NgModule({
  declarations: [
    ParameterViewerComponent,
    MbViewerComponent
  ],
  exports: [ MbViewerComponent ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    FormsModule,
    NgReduxModule
  ],
  entryComponents: [ ],
  providers: [ ]
})
export class MbViewerModule {
    constructor () { }
}
