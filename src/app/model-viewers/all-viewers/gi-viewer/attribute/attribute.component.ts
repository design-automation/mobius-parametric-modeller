import { Component, Injector, Input, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { GICommon, GIAttribs } from '@libs/geo-info';
import { EEntType, EEntTypeStr } from '@libs/geo-info/common';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})

export class AttributeComponent implements OnChanges {
  @Input() data: GIModel;
  @Input() refresh: Event;
  showSelected = false;

  tabs: { type: number, title: string }[] =
    [
      { type: EEntType.POSI, title: 'Positions' },
      { type: EEntType.VERT, title: 'Vertex' },
      { type: EEntType.EDGE, title: 'Edges' },
      { type: EEntType.WIRE, title: 'Wires' },
      { type: EEntType.FACE, title: 'Faces' },
      { type: EEntType.POINT, title: 'Points' },
      { type: EEntType.PLINE, title: 'Polylines' },
      { type: EEntType.PGON, title: 'Polygons' },
      { type: EEntType.COLL, title: 'Collections' }
    ];
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
      this.refreshTable();
    }
    if (changes['refresh']) {
      this.refreshTable();
    }
  }

  generateTable(tabIndex: number) {
    const EntityType = GICommon.EEntType;
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
      const ThreeJS = this.data.attribs.threejs;
      let displayData: { id: string }[] = [];
      const AllAttribData = ThreeJS.getAttribsForTable(tab_map[tabIndex]);
      const selected_ents = this.dataService.selected_ents.get(EEntTypeStr[tab_map[tabIndex]]);
      const SelectedAttribData = ThreeJS.getEntsVals(selected_ents, tab_map[tabIndex]);
      if (this.showSelected) {
        displayData = SelectedAttribData;
      } else {
        displayData = AllAttribData;
      }
      if (displayData.length > 0) {
        this.displayedColumns = Object.keys(displayData[0]);
        this.dataSource = new MatTableDataSource<object>(displayData);
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
      localStorage.setItem('mpm_attrib_current_tab', tabIndex.toString());
      this.generateTable(tabIndex);
    });
  }

  private getCurrentTab() {
    if (localStorage.getItem('mpm_attrib_current_tab') != null) {
      return Number(localStorage.getItem('mpm_attrib_current_tab'));
    } else {
      return 0;
    }
  }

  showSelectedSwitch() {
    this.showSelected = !this.showSelected;
    this.refreshTable();
  }

  public refreshTable() {
    const currentTab = this.getCurrentTab();
    setTimeout(() => {
      this.generateTable(currentTab);
    });
  }
}
