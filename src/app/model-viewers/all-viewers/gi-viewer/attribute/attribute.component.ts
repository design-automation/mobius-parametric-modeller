import { Component, OnInit, ViewChildren, Injector, Input, OnChanges, SimpleChanges, QueryList, AfterViewInit } from '@angular/core';
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

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  private _data: PeriodicElement[] = [];

  dataSource = {
    COODS: new MatTableDataSource<PeriodicElement>(this._data),
    COLOR: new MatTableDataSource<PeriodicElement>(this._data),
    NORMAL: new MatTableDataSource<PeriodicElement>(this._data),
  };

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
  }

  protected vertAttrib = ['NORMAL', 'COLOR'];

  ngOnChanges(changes: SimpleChanges) {
    if ( changes['data'] && this.data) {
      const AttribNames = GICommon.EAttribNames;
      const vertsAttrib = Object.keys(AttribNames).reduce((object, key) => {
        if (this.vertAttrib.includes(key)) {
          object[key] = AttribNames[key];
        }
        return object;
      }, {});

      for (const attr in vertsAttrib) {
        if (GICommon.EAttribNames.hasOwnProperty(attr)) {
          const attribData = this.data.getAttibs().getVertsAttrib(AttribNames[attr]);

          const _DataArray = [];
          attribData.forEach((value, index) => {
            _DataArray.push({key: `${GICommon.EEntityTypeStr.VERT}${index}`, v0: value[0], v1: value[1], v2: value[2]});
          });
          this.dataSource[attr] = new MatTableDataSource<PeriodicElement>(_DataArray);
          this.dataSource[attr].paginator = this.paginator.toArray()[this.vertAttrib.indexOf(attr)];
          this.dataSource[attr].sort = this.sort.toArray()[this.vertAttrib.indexOf(attr)];
        }
      }
    }
  }

  _setDataSource(indexNumber) {
    setTimeout(() => {
      !this.dataSource[this.vertAttrib[indexNumber]].paginator ?
          this.dataSource[this.vertAttrib[indexNumber]].paginator = this.paginator : null;
    });
  }
}

export interface PeriodicElement {
  key: string;
  v0: string;
  v1: string;
  v2: string;
}
