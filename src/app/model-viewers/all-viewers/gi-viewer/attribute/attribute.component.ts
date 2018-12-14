import { Component, OnInit, ViewChild, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTable, MatSort, MatPaginator } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { GICommon } from '@libs/geo-info';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})

export class AttributeComponent implements OnChanges {
  @Input() data: GIModel;
  displayedColumns: string[] = ['key', 'color0', 'color1', 'color2'];

  private _data: PeriodicElement[] = [];

  dataSource = new MatTableDataSource<PeriodicElement>(this._data);

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges(changes: SimpleChanges) {
    if ( changes['data']) {
      if ( this.data ) {
        const colorData = this.data.getAttibs().getVertsAttrib(GICommon.EAttribNames.COLOR);

        const colorDataSource = [];
        if ( colorData ) {
          colorData.forEach((color, index) => {
            colorDataSource.push({key: `${GICommon.EEntityTypeStr.VERT}${index}`, color0: color[0], color1: color[1], color2: color[2]});
          });
          this.dataSource = new MatTableDataSource<PeriodicElement>(colorDataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    }
}
}

export interface PeriodicElement {
  key: string;
  color0: string;
  color1: string;
  color2: string;
}
