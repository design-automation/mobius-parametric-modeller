import { Component, OnInit, ViewChild, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
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
  displayedColumns: string[] = ['key', 'v0', 'v1', 'v2'];

  private _data: PeriodicElement[] = [];

  dataSourceColor = new MatTableDataSource<PeriodicElement>(this._data);
  dataSourceNormal = new MatTableDataSource<PeriodicElement>(this._data);

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges(changes: SimpleChanges) {
    const attrData = {
      coords: [],
      normal: [],
      color: [],
    };
    if ( changes['data'] && this.data) {
      const AttribNames = GICommon.EAttribNames;
      for (const attr in GICommon.EAttribNames) {
        if (GICommon.EAttribNames.hasOwnProperty(attr)) {
          attrData[AttribNames[attr]] = this.data.getAttibs().getVertsAttrib(AttribNames[attr]);
        }
      }
        // const colorData = this.data.getAttibs().getVertsAttrib(GICommon.EAttribNames.COLOR);

        const _colorDataArray = [];
        if ( attrData.hasOwnProperty('color') ) {
          attrData.color.forEach((color, index) => {
            _colorDataArray.push({key: `${GICommon.EEntityTypeStr.VERT}${index}`, v0: color[0], v1: color[1], v2: color[2]});
          });
          this.dataSourceColor = new MatTableDataSource<PeriodicElement>(_colorDataArray);
          this.dataSourceColor.paginator = this.paginator;
          this.dataSourceColor.sort = this.sort;
        }

        const normalData = this.data.getAttibs().getVertsAttrib(GICommon.EAttribNames.NORMAL);
    }
}
}

export interface PeriodicElement {
  key: string;
  v0: string;
  v1: string;
  v2: string;
}
