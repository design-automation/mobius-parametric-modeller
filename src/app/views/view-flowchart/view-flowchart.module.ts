// import @angular stuff
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import app components
import { ViewFlowchartComponent } from './view-flowchart.component';
import { NodeComponent } from './node/node.component';
import { EdgeComponent } from './edge/edge.component';
import { SharedModule } from '@shared/shared.module';
import { ViewFlowchartRoutingModule } from './view-flowchart-routing.module';

/**
 * ViewFlowchartModule
 */
@NgModule({
  declarations: [
    ViewFlowchartComponent,
    NodeComponent,
    EdgeComponent,
  ],
  exports: [ ViewFlowchartComponent ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ViewFlowchartRoutingModule
    ],
  entryComponents: [ ],
  providers: [ ]
})
export class ViewFlowchartModule {
    constructor () { }
}
