import { Component, Injector, Input, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { GICommon, GIAttribs } from '@libs/geo-info';
import { EEntityTypeStr } from '@libs/geo-info/common';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})

export class AttributeComponent implements OnChanges {
  @Input() data: GIModel;
  currentTab: number;

  tabs: {type: string, title: string}[] =
  [{type: EEntityTypeStr.POSI, title: 'Positions'},
  {type: EEntityTypeStr.VERT, title: 'Vertex'},
  {type: EEntityTypeStr.EDGE, title: 'Edges'},
  {type: EEntityTypeStr.WIRE, title: 'Wires'},
  {type: EEntityTypeStr.FACE, title: 'Faces'},
  {type: EEntityTypeStr.POINT, title: 'Points'},
  {type: EEntityTypeStr.PLINE, title: 'Polylines'},
  {type: EEntityTypeStr.PGON, title: 'Polygons'},
  {type: EEntityTypeStr.COLL, title: 'Collections'}];
  displayedColumns: string[] = [];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  dataSource: MatTableDataSource<object>;

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
    if (localStorage.getItem('mpm_attrib_current_tab') === null) {
      localStorage.setItem('mpm_attrib_current_tab', '0');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      if (localStorage.getItem('mpm_attrib_current_tab') != null) {
        this.currentTab = Number(localStorage.getItem('mpm_attrib_current_tab'));
      } else {
        this.currentTab = 0;
      }
      setTimeout(() => {
        this.generateTable(this.currentTab);
      });
    }
  }

  generateTable(tabIndex: number) {
    const EntityType = GICommon.EEntityTypeStr;
    const tab_map = {
      0: EntityType.POSI,
      1: EntityType.VERT,
      2: EntityType.EDGE,
      3: EntityType.WIRE,
      4: EntityType.FACE,
      5: EntityType.POINT,
      6: EntityType.PLINE,
      7: EntityType.PGON,
      8: EntityType.COLL
    };
    if (this.data) {
      const attribData = this.data.attribs.threejs.getAttribsForTable(tab_map[tabIndex]);
      // console.log(attribData);
      if (attribData.length > 0) {
        this.displayedColumns = Object.keys(attribData[0]);
        this.dataSource = new MatTableDataSource<object>(attribData);
      } else {
        this.displayedColumns = [];
        this.dataSource = new MatTableDataSource<object>();
      }
      this.dataSource.paginator = this.paginator.toArray()[tabIndex];
      this.dataSource.sort = this.sort.toArray()[tabIndex];
    }
    return tabIndex;
  }

  _setDataSource(tabIndex: number) {
    setTimeout(() => {
      this.currentTab = tabIndex;
      localStorage.setItem('mpm_attrib_current_tab', tabIndex.toString());
      this.generateTable(tabIndex);
    });
  }
}
