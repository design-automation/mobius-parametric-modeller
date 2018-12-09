// import @angular stuff
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatButtonModule } from '@angular/material';
// import app components
import { ViewFlowchartComponent } from './view-flowchart.component';
import { NodeComponent } from './node/node.component';
import { EdgeComponent } from './edge/edge.component';

/**
 * SVGFlowchartModule
 */
@NgModule({
  declarations: [
    ViewFlowchartComponent,
    NodeComponent,
    EdgeComponent,
  ],
  exports: [ ViewFlowchartComponent ],
  imports: [ CommonModule,
             FormsModule,
             MatIconModule,
             MatButtonModule ],
  entryComponents: [ ],
  providers: [ ]
})
export class SVGFlowchartModule {
    constructor () { }
}
