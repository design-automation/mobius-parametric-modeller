import { Component, OnInit, ViewChild, Injector, Input, OnChanges, SimpleChanges, QueryList, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { GICommon } from '@libs/geo-info';
import { format } from 'util';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})

export class AttributeComponent implements OnInit, OnChanges {
  @Input() data: GIModel;
  displayedColumns: string[] = ['key', 'v0', 'v1', 'v2'];

  @ViewChild('paginatorNormal') paginatorNormal: MatPaginator;
  @ViewChild('paginatorColor') paginatorColor: MatPaginator;
  @ViewChild('tableNormal', {read: MatSort}) sortNormal: MatSort;
  @ViewChild('tableColor', {read: MatSort}) sortColor: MatSort;

  dataSourceColor;
  dataSourceNormal;

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
    this.dataSourceColor = new MatTableDataSource<PeriodicElement>([]);
    this.dataSourceNormal = new MatTableDataSource<PeriodicElement>([]);
  }

  ngOnInit() {
    if (this.data) {
      this.formatAttribData(this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes['data'] && this.data) {
      this.formatAttribData(this.data);
    }
  }

  formatAttribData(data) {
    let propName = GICommon.EAttribNames.NORMAL;
    const attribDataNormal = data.getAttibs().getVertsAttrib(propName);
    const normalData = this.convertModelData(attribDataNormal);
    this.dataSourceNormal = new MatTableDataSource<PeriodicElement>(normalData);
    this.dataSourceNormal.paginator = this.paginatorNormal;
    this.dataSourceNormal.sort = this.sortNormal;

    propName = GICommon.EAttribNames.COLOR;
    const attribDataColor = data.getAttibs().getVertsAttrib(propName);
    const colorData = this.convertModelData(attribDataColor);
    this.dataSourceColor = new MatTableDataSource<PeriodicElement>(colorData);
    this.dataSourceColor.paginator = this.paginatorColor;
    this.dataSourceColor.sort = this.sortColor;
  }

  convertModelData(attribData) {
    if (attribData) {
      const _DataArray = [];
      attribData.forEach((value, index) => {
        _DataArray.push({key: `${GICommon.EEntityTypeStr.VERT}${index}`, v0: value[0], v1: value[1], v2: value[2]});
      });
      return _DataArray;
    }
  }
}

export interface PeriodicElement {
  key: string;
  v0: string;
  v1: string;
  v2: string;
}
