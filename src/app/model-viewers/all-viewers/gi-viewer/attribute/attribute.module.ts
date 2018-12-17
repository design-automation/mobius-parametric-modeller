import { NgModule } from '@angular/core';

import {
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule
} from '@angular/material';

@NgModule({
  imports: [
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports: [
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class AttributeModule {}
